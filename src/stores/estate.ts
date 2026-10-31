import { defineStore, acceptHMRUpdate } from "pinia";
import type {
  Contract,
  Property,
  PropertyStatus,
  PropertyType
} from "@/lib/estate";
import { sha256 } from "@/lib/estate";
import { seedProperties } from "@/data/properties";

const KEY = "rcr-real-estate-v1";

interface Persisted {
  properties: Property[];
  contracts: Contract[];
}

export const useEstateStore = defineStore("estate", {
  state: () => {
    const s = load();
    return {
      properties: s.properties,
      contracts: s.contracts,
      // filtros del catálogo
      q: "",
      type: null as PropertyType | null,
      status: null as PropertyStatus | null,
      minPrice: 0,
      maxPrice: 600000,
      minBeds: 0
    };
  },

  getters: {
    filtered(state): Property[] {
      const q = state.q.trim().toLowerCase();
      return state.properties.filter(p => {
        if (q && !`${p.title} ${p.city} ${p.address}`.toLowerCase().includes(q))
          return false;
        if (state.type && p.type !== state.type) return false;
        if (state.status && p.status !== state.status) return false;
        if (p.price < state.minPrice || p.price > state.maxPrice) return false;
        if (p.beds < state.minBeds) return false;
        return true;
      });
    },
    featured: (state): Property[] =>
      state.properties.filter(p => p.featured && p.status === "Disponible"),
    byId: state => (id: string) => state.properties.find(p => p.id === id)
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            properties: this.properties,
            contracts: this.contracts
          } satisfies Persisted)
        );
      } catch {
        /* ignore */
      }
    },
    upsertProperty(p: Property) {
      const i = this.properties.findIndex(x => x.id === p.id);
      if (i >= 0) this.properties[i] = p;
      else this.properties.unshift(p);
      this.persist();
    },
    removeProperty(id: string) {
      this.properties = this.properties.filter(p => p.id !== id);
      this.persist();
    },
    async signContract(id: string, signatureDataUrl: string) {
      const c = this.contracts.find(x => x.id === id);
      if (!c) return;
      c.signatureDataUrl = signatureDataUrl;
      c.status = "Firmado";
      c.signedAt = new Date().toISOString();
      c.hash = await sha256(JSON.stringify(c));
      this.persist();
    },
    addContract(c: Contract) {
      this.contracts.unshift(c);
      this.persist();
    },
    resetDemo() {
      this.properties = seedProperties();
      this.contracts = [];
      this.persist();
    }
  }
});

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Persisted;
      if (Array.isArray(d.properties) && d.properties.length) return d;
    }
  } catch {
    /* ignore */
  }
  return { properties: seedProperties(), contracts: [] };
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEstateStore, import.meta.hot));
}
