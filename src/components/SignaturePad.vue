<template>
  <div>
    <canvas
      ref="cv"
      class="sig-pad"
      width="520"
      height="180"
      @pointerdown="start"
      @pointermove="draw"
      @pointerup="end"
      @pointerleave="end"
    />
    <div class="row q-gutter-sm q-mt-xs">
      <q-btn dense flat icon="undo" label="Limpiar" no-caps @click="clear" />
      <q-space />
      <q-badge v-if="signed" color="positive" label="Firma capturada" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const emit = defineEmits<{ signed: [dataUrl: string] }>();
const cv = ref<HTMLCanvasElement | null>(null);
const signed = ref(false);
let ctx: CanvasRenderingContext2D | null = null;
let drawing = false;

onMounted(() => {
  ctx = cv.value?.getContext("2d") ?? null;
  if (ctx) {
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }
  clear();
});

function pos(e: PointerEvent) {
  const r = cv.value!.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * 520,
    y: ((e.clientY - r.top) / r.height) * 180
  };
}
function start(e: PointerEvent) {
  drawing = true;
  const p = pos(e);
  ctx?.beginPath();
  ctx?.moveTo(p.x, p.y);
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}
function draw(e: PointerEvent) {
  if (!drawing || !ctx) return;
  const p = pos(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  signed.value = true;
  emitSigned();
}
function end() {
  drawing = false;
}
function clear() {
  if (!ctx || !cv.value) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cv.value.width, cv.value.height);
  ctx.strokeStyle = "#1e293b";
  signed.value = false;
  emit("signed", "");
}
function emitSigned() {
  const url = cv.value?.toDataURL("image/png") ?? "";
  emit("signed", url);
}
defineExpose({ clear });
</script>

<style scoped>
.sig-pad {
  width: 100%;
  height: 180px;
  background: #fff;
  border: 2px dashed #94a3b8;
  border-radius: 10px;
  touch-action: none;
  cursor: crosshair;
}
</style>
