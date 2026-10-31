<template>
  <q-page class="bg-grey-1 q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="text-h6">Panel administrativo — Propiedades</div>
        <q-space />
        <q-btn
          color="primary"
          icon="add"
          label="Nueva propiedad"
          no-caps
          @click="openNew"
        />
      </div>

      <q-table
        flat
        :rows="store.properties"
        :columns="cols"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-img="p">
          <q-td :props="p"
            ><img :src="p.row.images[0]" class="row-thumb"
          /></q-td>
        </template>
        <template #body-cell-price="p">
          <q-td :props="p">{{ money(p.row.price) }}</q-td>
        </template>
        <template #body-cell-status="p">
          <q-td :props="p">
            <q-badge
              :color="
                {
                  Disponible: 'positive',
                  Reservada: 'warning',
                  Vendida: 'negative',
                  Alquilada: 'info'
                }[p.row.status as PropertyStatus]
              "
              :label="p.row.status"
            />
          </q-td>
        </template>
        <template #body-cell-actions="p">
          <q-td :props="p">
            <q-btn dense flat icon="edit" @click="openEdit(p.row)" />
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="store.removeProperty(p.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <PropertyForm
      v-model="showForm"
      :editing="editing"
      @save="store.upsertProperty"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PropertyForm from "@/components/PropertyForm.vue";
import { useEstateStore } from "@/stores/estate";
import { money, type Property, type PropertyStatus } from "@/lib/estate";
import type { QTableColumn } from "quasar";

const store = useEstateStore();
const showForm = ref(false);
const editing = ref<Property | null>(null);

const cols: QTableColumn<Property>[] = [
  { name: "img", label: "", field: "id" },
  {
    name: "title",
    label: "Título",
    field: "title",
    align: "left",
    sortable: true
  },
  {
    name: "city",
    label: "Ciudad",
    field: "city",
    align: "left",
    sortable: true
  },
  { name: "type", label: "Tipo", field: "type", align: "left" },
  { name: "price", label: "Precio", field: "price", sortable: true },
  { name: "status", label: "Estado", field: "status" },
  { name: "actions", label: "", field: "id" }
];

function openNew() {
  editing.value = null;
  showForm.value = true;
}
function openEdit(p: Property) {
  editing.value = p;
  showForm.value = true;
}
</script>

<style scoped>
.row-thumb {
  width: 64px;
  height: 42px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
