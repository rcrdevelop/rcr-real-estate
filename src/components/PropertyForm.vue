<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <q-card style="width: 560px; max-width: 92vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ editing ? "Editar" : "Nueva" }} propiedad</div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="close"
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm">
          <q-input
            v-model="form.title"
            label="Título"
            filled
            dense
            class="col-12"
          />
          <q-input
            v-model.number="form.price"
            label="Precio (USD)"
            type="number"
            filled
            dense
            class="col-6"
          />
          <q-select
            v-model="form.status"
            :options="statuses"
            label="Estado"
            filled
            dense
            class="col-6"
          />
          <q-select
            v-model="form.type"
            :options="types"
            label="Tipo"
            filled
            dense
            class="col-6"
          />
          <q-input
            v-model.number="form.area"
            label="Área (m²)"
            type="number"
            filled
            dense
            class="col-6"
          />
          <q-input
            v-model.number="form.beds"
            label="Habitaciones"
            type="number"
            filled
            dense
            class="col-4"
          />
          <q-input
            v-model.number="form.baths"
            label="Baños"
            type="number"
            filled
            dense
            class="col-4"
          />
          <q-input
            v-model="form.city"
            label="Ciudad"
            filled
            dense
            class="col-4"
          />
          <q-input
            v-model="form.address"
            label="Dirección"
            filled
            dense
            class="col-12"
          />
          <q-input
            v-model.number="form.coords.lat"
            label="Lat"
            type="number"
            step="0.01"
            filled
            dense
            class="col-6"
          />
          <q-input
            v-model.number="form.coords.lng"
            label="Lng"
            type="number"
            step="0.01"
            filled
            dense
            class="col-6"
          />
          <q-input
            v-model="form.description"
            label="Descripción"
            type="textarea"
            rows="3"
            filled
            dense
            class="col-12"
          />
          <q-toggle v-model="form.featured" label="Destacada" class="col-12" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          @click="$emit('update:modelValue', false)"
        />
        <q-btn
          color="primary"
          label="Guardar"
          :disable="!form.title"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, toRaw, watch } from "vue";
import type { Property, PropertyStatus, PropertyType } from "@/lib/estate";
import { slugify } from "@/lib/estate";
import { propImage } from "@/data/properties";

const props = defineProps<{ modelValue: boolean; editing?: Property | null }>();
const emit = defineEmits<{
  "update:modelValue": [v: boolean];
  save: [p: Property];
}>();

const statuses: PropertyStatus[] = [
  "Disponible",
  "Reservada",
  "Vendida",
  "Alquilada"
];
const types: PropertyType[] = [
  "Casa",
  "Apartamento",
  "Terreno",
  "Local",
  "Oficina"
];

const blank = (): Property => ({
  id: `prop-${Date.now()}`,
  title: "",
  slug: "",
  price: 100000,
  status: "Disponible",
  type: "Apartamento",
  beds: 2,
  baths: 1,
  area: 80,
  city: "",
  address: "",
  description: "",
  images: [],
  coords: { lat: 40.4, lng: -3.7 },
  agentId: "agent-1",
  featured: false,
  createdAt: new Date().toISOString()
});

const form = reactive<Property>(blank());

watch(
  () => props.modelValue,
  v => {
    if (v)
      Object.assign(
        form,
        props.editing ? structuredClone(toRaw(props.editing)) : blank()
      );
  }
);

function save() {
  form.slug = slugify(form.title);
  if (!form.images.length)
    form.images = [propImage(Math.floor(Math.random() * 360), 0)];
  emit("save", structuredClone(toRaw(form)));
  emit("update:modelValue", false);
}
</script>
