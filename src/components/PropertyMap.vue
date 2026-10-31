<template>
  <svg viewBox="0 0 600 380" class="map">
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path
          d="M 30 0 L 0 0 0 30"
          fill="none"
          stroke="#dbe4ee"
          stroke-width="1"
        />
      </pattern>
    </defs>
    <rect width="600" height="380" fill="#f1f6fb" />
    <rect width="600" height="380" fill="url(#grid)" />
    <!-- calles -->
    <line x1="0" y1="120" x2="600" y2="90" stroke="#ffffff" stroke-width="10" />
    <line x1="80" y1="0" x2="140" y2="380" stroke="#ffffff" stroke-width="8" />
    <line
      x1="0"
      y1="280"
      x2="600"
      y2="300"
      stroke="#ffffff"
      stroke-width="12"
    />
    <line x1="380" y1="0" x2="420" y2="380" stroke="#ffffff" stroke-width="9" />
    <line
      x1="200"
      y1="60"
      x2="560"
      y2="200"
      stroke="#ffffff"
      stroke-width="6"
    />
    <circle cx="300" cy="190" r="60" fill="#d7e8d4" opacity="0.7" />
    <text x="300" y="194" text-anchor="middle" font-size="10" fill="#4b7a54">
      Parque
    </text>

    <g v-for="p in points" :key="p.id" class="marker" @click="$emit('open', p)">
      <circle :cx="p.x" :cy="p.y" r="13" :fill="color(p.status)" opacity="0.25">
        <animate
          attributeName="r"
          values="10;16;10"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        :cx="p.x"
        :cy="p.y"
        r="7"
        :fill="color(p.status)"
        stroke="#fff"
        stroke-width="2"
      />
      <text
        :x="p.x"
        :y="p.y - 12"
        text-anchor="middle"
        font-size="9"
        font-weight="700"
        fill="#334155"
      >
        {{ shortPrice(p.price) }}
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Property, PropertyStatus } from "@/lib/estate";

const props = defineProps<{ items: Property[] }>();
defineEmits<{ open: [p: Property] }>();

const points = computed(() => {
  const ps = props.items;
  if (!ps.length) return [];
  const lats = ps.map(p => p.coords.lat);
  const lngs = ps.map(p => p.coords.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latR = maxLat - minLat || 1;
  const lngR = maxLng - minLng || 1;
  return ps.map((p, i) => ({
    ...p,
    // jitter para separar coordenadas muy distantes entre ciudades
    x: 40 + ((p.coords.lng - minLng) / lngR) * 520 + ((i * 13) % 24) - 12,
    y: 340 - ((p.coords.lat - minLat) / latR) * 300 + ((i * 17) % 20) - 10
  }));
});

function color(s: PropertyStatus): string {
  return (
    {
      Disponible: "#059669",
      Reservada: "#d97706",
      Vendida: "#dc2626",
      Alquilada: "#2563eb"
    }[s] ?? "#64748b"
  );
}
function shortPrice(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}
</script>

<style scoped>
.map {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d7e0ea;
  display: block;
}
.marker {
  cursor: pointer;
}
</style>
