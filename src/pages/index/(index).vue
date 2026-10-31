<template>
  <q-page class="bg-grey-1">
    <!-- Hero -->
    <div class="hero q-pa-xl text-center text-white">
      <div class="text-h3 text-bold">Encuentra tu próximo hogar</div>
      <div class="text-subtitle1 q-mt-sm opacity-80">
        Catálogo inmobiliario + firma digital de contratos — demo funcional
      </div>
    </div>

    <div class="q-pa-md">
      <!-- Filtros -->
      <q-card flat bordered class="q-pa-md q-mb-md">
        <div class="row q-col-gutter-sm items-center">
          <q-input
            v-model="store.q"
            dense
            outlined
            placeholder="Buscar por ciudad, dirección…"
            class="col-12 col-md-4"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
          <q-select
            v-model="store.type"
            :options="types"
            dense
            outlined
            label="Tipo"
            clearable
            class="col-6 col-md-2"
          />
          <q-select
            v-model="store.status"
            :options="statuses"
            dense
            outlined
            label="Estado"
            clearable
            class="col-6 col-md-2"
          />
          <q-select
            v-model="store.minBeds"
            :options="[0, 1, 2, 3, 4]"
            dense
            outlined
            label="Hab. mín."
            class="col-6 col-md-2"
          />
          <div class="col-6 col-md-2 text-caption text-grey-7">
            {{ store.filtered.length }} propiedades
          </div>
          <div class="col-12">
            <q-range
              v-model="range"
              :min="0"
              :max="600000"
              :step="10000"
              label
              color="primary"
              :left-label-value="money(range.min)"
              :right-label-value="money(range.max)"
            />
          </div>
        </div>
      </q-card>

      <div class="row q-col-gutter-md">
        <!-- Mapa -->
        <div class="col-12 col-md-5">
          <div class="text-subtitle2 q-mb-xs">Mapa de propiedades</div>
          <PropertyMap :items="store.filtered" @open="openDetail" />
        </div>

        <!-- Grid -->
        <div class="col-12 col-md-7">
          <div class="row q-col-gutter-sm">
            <div
              v-for="p in store.filtered"
              :key="p.id"
              class="col-12 col-sm-6"
            >
              <PropertyCard :p="p" @open="openDetail" />
            </div>
            <div
              v-if="!store.filtered.length"
              class="col-12 text-center text-grey-6 q-pa-xl"
            >
              <q-icon name="search_off" size="48px" />
              <div>Sin resultados con estos filtros</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalle -->
    <q-dialog v-model="detail" maximized-mobile>
      <q-card style="max-width: 760px; width: 100%" v-if="selected">
        <div class="detail-img">
          <img :src="selected.images[imgIdx]" />
          <q-btn
            flat
            round
            dense
            icon="close"
            class="close-btn"
            @click="detail = false"
          />
        </div>
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <div class="text-h5 text-bold">{{ selected.title }}</div>
            <q-badge
              :color="selected.status === 'Disponible' ? 'positive' : 'grey'"
              :label="selected.status"
            />
          </div>
          <div class="text-subtitle2 text-grey-7">
            <q-icon name="place" /> {{ selected.address }}, {{ selected.city }}
          </div>
          <div class="text-h4 text-primary q-mt-sm">{{
            money(selected.price)
          }}</div>

          <div class="row q-gutter-md q-mt-sm text-grey-8">
            <span><q-icon name="bed" /> {{ selected.beds }} hab.</span>
            <span><q-icon name="bathtub" /> {{ selected.baths }} baños</span>
            <span><q-icon name="square_foot" /> {{ selected.area }} m²</span>
            <span><q-icon name="category" /> {{ selected.type }}</span>
          </div>

          <p class="q-mt-md text-body2">{{ selected.description }}</p>

          <div class="row q-gutter-xs q-mt-sm">
            <q-img
              v-for="(img, i) in selected.images"
              :key="i"
              :src="img"
              class="thumb"
              :class="{ active: i === imgIdx }"
              @click="imgIdx = i"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            color="primary"
            icon="draw"
            label="Generar contrato"
            :disable="selected.status !== 'Disponible'"
            @click="goContract"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import PropertyCard from "@/components/PropertyCard.vue";
import PropertyMap from "@/components/PropertyMap.vue";
import { useEstateStore } from "@/stores/estate";
import {
  money,
  type Property,
  type PropertyStatus,
  type PropertyType
} from "@/lib/estate";

const store = useEstateStore();
const router = useRouter();

const types: PropertyType[] = [
  "Casa",
  "Apartamento",
  "Terreno",
  "Local",
  "Oficina"
];
const statuses: PropertyStatus[] = [
  "Disponible",
  "Reservada",
  "Vendida",
  "Alquilada"
];

const detail = ref(false);
const selected = ref<Property | null>(null);
const imgIdx = ref(0);
const pendingContractId = ref<string | null>(null);

const range = computed({
  get: () => ({ min: store.minPrice, max: store.maxPrice }),
  set: v => {
    store.minPrice = v?.min ?? 0;
    store.maxPrice = v?.max ?? 600000;
  }
});

function openDetail(p: Property) {
  selected.value = p;
  imgIdx.value = 0;
  detail.value = true;
}

function goContract() {
  pendingContractId.value = selected.value?.id ?? null;
  if (pendingContractId.value) {
    sessionStorage.setItem("contract-prop", pendingContractId.value);
    void router.push("/contratos");
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(120deg, #1d4ed8, #0369a1);
}
.detail-img {
  position: relative;
  height: 320px;
  overflow: hidden;
}
.detail-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.85);
}
.thumb {
  width: 90px;
  height: 60px;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.65;
}
.thumb.active {
  opacity: 1;
  outline: 2px solid var(--q-primary);
}
</style>
