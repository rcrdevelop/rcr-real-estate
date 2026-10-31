<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-toolbar-title class="row items-center q-gutter-sm">
          <q-icon name="apartment" color="primary" />
          <span class="text-bold">RCR Inmobiliaria</span>
          <q-badge color="primary" label="demo" />
        </q-toolbar-title>

        <q-tabs shrink stretch active-color="primary">
          <q-route-tab to="/" label="Catálogo" icon="home" exact />
          <q-route-tab to="/contratos" label="Contratos" icon="draw" exact />
          <q-route-tab to="/admin" label="Admin" icon="settings" exact />
        </q-tabs>

        <q-btn
          flat
          dense
          color="primary"
          icon="restart_alt"
          label="Restaurar demo"
          no-caps
          class="q-ml-sm"
          @click="store.resetDemo()"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useEstateStore } from "@/stores/estate";
const store = useEstateStore();
</script>
