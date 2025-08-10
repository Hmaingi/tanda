<template>
  <!-- Template remains the same -->
</template>

<script setup lang="ts">
import { mockApi } from '@/services/mockDataService'
import type { InventoryItem } from '@/services/mockDataService'

const props = defineProps<{
  items: InventoryItem[]
}>()

const emit = defineEmits<{
  (e: 'update-stock'): void
  (e: 'edit-item', item: InventoryItem): void
}>()

const updateStock = async (id: number, newStock: number): Promise<void> => {
  await mockApi.updateItem(id, { stock: newStock })
  emit('update-stock')
}

const editItem = (item: InventoryItem): void => {
  emit('edit-item', item)
}
</script>
