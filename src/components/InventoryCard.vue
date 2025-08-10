<template>
    <div class="card" :class="{ 'low-stock': item.stock < item.threshold }">
      <h3>{{ item.name }}</h3>
      <p>Stock: {{ item.stock }}</p>
      <input 
        type="number" 
        v-model.number="localStock" 
        @change="$emit('update-stock', localStock)"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps(['item'])
  const localStock = ref(props.item.stock)
  </script>