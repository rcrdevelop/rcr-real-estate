<template>
  <q-card
    class="prop-card cursor-pointer"
    flat
    bordered
    @click="$emit('open', p)"
  >
    <div class="img-wrap">
      <img :src="p.images[0]" :alt="p.title" loading="lazy" />
      <q-badge class="status-badge" :color="statusColor" :label="p.status" />
      <q-badge
        v-if="p.featured"
        class="feat-badge"
        color="amber-8"
        text-color="black"
        label="Destacada"
      />
    </div>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle2 ellipsis">{{ p.title }}</div>
      <div class="text-caption text-grey-7 ellipsis">
        <q-icon name="place" size="14px" /> {{ p.address }}, {{ p.city }}
      </div>
      <div
        class="row items-center q-mt-xs text-caption text-grey-8 q-gutter-x-sm"
      >
        <span v-if="p.beds"><q-icon name="bed" /> {{ p.beds }}</span>
        <span v-if="p.baths"><q-icon name="bathtub" /> {{ p.baths }}</span>
        <span><q-icon name="square_foot" /> {{ p.area }} m²</span>
      </div>
      <div class="text-h6 text-primary q-mt-xs">{{ money(p.price) }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { money, type Property } from "@/lib/estate";

const props = defineProps<{ p: Property }>();
defineEmits<{ open: [p: Property] }>();

const statusColor = computed(
  () =>
    ({
      Disponible: "positive",
      Reservada: "warning",
      Vendida: "negative",
      Alquilada: "info"
    })[props.p.status] ?? "grey"
);
</script>

<style scoped>
.prop-card {
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.prop-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}
.img-wrap {
  position: relative;
  height: 160px;
  overflow: hidden;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.status-badge {
  position: absolute;
  top: 8px;
  left: 8px;
}
.feat-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
