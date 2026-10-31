<template>
  <q-page class="bg-grey-1 q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Generador -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-md">
          <div class="text-h6 q-mb-md">
            <q-icon name="draw" class="q-mr-sm" />Generador de contratos
          </div>

          <q-select
            v-model="propId"
            :options="propOptions"
            label="Propiedad"
            filled
            dense
            emit-value
            map-options
            class="q-mb-sm"
          />
          <q-select
            v-model="ctype"
            :options="['Compraventa', 'Arrendamiento']"
            label="Tipo de contrato"
            filled
            dense
            class="q-mb-sm"
          />
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="clientName"
              label="Nombre del cliente"
              filled
              dense
              class="col-12"
            />
            <q-input
              v-model="clientDoc"
              label="Documento de identidad"
              filled
              dense
              class="col-6"
            />
            <q-input
              v-model="clientEmail"
              label="Email"
              filled
              dense
              class="col-6"
            />
            <q-input
              v-model.number="amount"
              :label="
                ctype === 'Compraventa' ? 'Precio de venta' : 'Renta mensual'
              "
              type="number"
              filled
              dense
              class="col-6"
            />
            <q-input
              v-if="ctype === 'Arrendamiento'"
              v-model.number="months"
              label="Meses"
              type="number"
              filled
              dense
              class="col-6"
            />
          </div>

          <div class="text-subtitle2 q-mt-md q-mb-xs">Firma electrónica</div>
          <SignaturePad @signed="v => (signature = v)" />

          <q-btn
            color="primary"
            class="q-mt-md full-width"
            icon="picture_as_pdf"
            label="Firmar y descargar PDF"
            :disable="!canSign"
            @click="sign"
          />
          <div class="text-caption text-grey-6 q-mt-xs">
            Se genera un PDF con hash SHA-256, sello de tiempo y la firma
            capturada.
          </div>
        </q-card>
      </div>

      <!-- Lista de contratos -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-md">
          <div class="text-h6 q-mb-md"
            >Contratos ({{ store.contracts.length }})</div
          >
          <q-list separator v-if="store.contracts.length">
            <q-item v-for="c in store.contracts" :key="c.id">
              <q-item-section avatar>
                <q-icon
                  :name="c.status === 'Firmado' ? 'verified' : 'edit_document'"
                  :color="c.status === 'Firmado' ? 'positive' : 'grey'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ c.type }} — {{ propTitle(c.propertyId) }}</q-item-label
                >
                <q-item-label caption>
                  {{ c.clientName }} · {{ money(c.amount)
                  }}<template v-if="c.months">/mes · {{ c.months }}m</template>
                </q-item-label>
                <q-item-label caption v-if="c.hash" class="mono">
                  #{{ c.hash.slice(0, 18) }}…
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  flat
                  color="primary"
                  icon="download"
                  label="PDF"
                  no-caps
                  @click="download(c)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center text-grey-6 q-pa-lg">
            <q-icon name="description" size="42px" />
            <div
              >Aún no hay contratos. Genera el primero desde el panel
              izquierdo.</div
            >
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import SignaturePad from "@/components/SignaturePad.vue";
import { useEstateStore } from "@/stores/estate";
import { money, type Contract } from "@/lib/estate";
import { buildContractPdf, downloadBytes } from "@/lib/pdf";

const store = useEstateStore();
const $q = useQuasar();

const propId = ref<string | null>(null);
const ctype = ref<"Compraventa" | "Arrendamiento">("Compraventa");
const clientName = ref("");
const clientDoc = ref("");
const clientEmail = ref("");
const amount = ref(100000);
const months = ref(12);
const signature = ref("");

const propOptions = computed(() =>
  store.properties.map(p => ({
    label: `${p.title} — ${money(p.price)}`,
    value: p.id
  }))
);
const canSign = computed(
  () => propId.value && clientName.value && signature.value
);

onMounted(() => {
  const pre = sessionStorage.getItem("contract-prop");
  if (pre && store.properties.some(p => p.id === pre)) {
    propId.value = pre;
    const p = store.properties.find(x => x.id === pre)!;
    amount.value = p.price;
    sessionStorage.removeItem("contract-prop");
  }
});

function propTitle(id: string) {
  return store.properties.find(p => p.id === id)?.title ?? id;
}

async function sign() {
  const c: Contract = {
    id: `ct-${Date.now().toString(36)}`,
    propertyId: propId.value!,
    clientName: clientName.value,
    clientDoc: clientDoc.value,
    clientEmail: clientEmail.value,
    type: ctype.value,
    amount: amount.value,
    status: "Borrador",
    createdAt: new Date().toISOString()
  };
  if (ctype.value === "Arrendamiento") c.months = months.value;
  store.addContract(c);
  await store.signContract(c.id, signature.value);
  $q.notify({ type: "positive", message: "Contrato firmado" });
  const saved = store.contracts.find(x => x.id === c.id)!;
  await download(saved);
}

async function download(c: Contract) {
  const bytes = await buildContractPdf(
    c,
    store.properties.find(p => p.id === c.propertyId)
  );
  downloadBytes(bytes, `contrato-${c.id}.pdf`);
}
</script>

<style scoped>
.mono {
  font-family: monospace;
  font-size: 11px;
}
</style>
