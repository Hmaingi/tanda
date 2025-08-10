<template>
  <!-- Template remains the same -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockApi } from '@/services/mockDataService'
import type { InventoryItem, InventoryStats, ActivityLog } from '@/services/mockDataService'

const router = useRouter()
const showAddItemModal = ref<boolean>(false)
const inventoryStats = ref<InventoryStats>({
  totalItems: 0,
  lowStockItems: 0,
  totalValue: 0
})
const recentActivities = ref<ActivityLog[]>([])
const inventoryItems = ref<InventoryItem[]>([])
const newItem = ref<Omit<InventoryItem, 'id' | 'lastUpdated'>>({
  name: '',
  category: '',
  stock: 0,
  threshold: 5,
  price: 0
})

onMounted(async (): Promise<void> => {
  await loadData()
})

const loadData = async (): Promise<void> => {
  inventoryStats.value = await mockApi.getInventoryStats()
  recentActivities.value = await mockApi.getActivityLog()
  inventoryItems.value = await mockApi.getInventory()
}

const handleLogout = (): void => {
  localStorage.removeItem('agentAuth')
  router.push('/login')
}

const addNewItem = async (): Promise<void> => {
  await mockApi.addItem(newItem.value)
  showAddItemModal.value = false
  newItem.value = { name: '', category: '', stock: 0, threshold: 5, price: 0 }
  await loadData()
}

const updateStock = async (id: number, newStock: number): Promise<void> => {
  await mockApi.updateItem(id, { stock: newStock })
  await loadData()
}
</script>
