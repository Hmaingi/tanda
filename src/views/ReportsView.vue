<template>
  <div class="reports-container bg-gray-50 min-h-screen p-6 relative">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>
    </button>

    <!-- CONTAINER START -->
    <div class="max-w-7xl mx-auto mt-8">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Reports</h2>

      <!-- Content Area Container -->
      <div class="content-area-container bg-white p-5 rounded-lg shadow-sm mb-6">
        <!-- Filters + Export -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Calendar v-model="dateRange" selectionMode="range" showIcon placeholder="Select date range" class="w-full" />
            <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name" placeholder="Filter by Category" class="w-full" />
            <Dropdown v-model="selectedUser" :options="users" optionLabel="name" placeholder="Filter by User" class="w-full" />
          </div>

          <div class="flex justify-end gap-2">
            <Button icon="pi pi-file-pdf" label="Export PDF" severity="danger" @click="exportPDF" />
            <Button icon="pi pi-file-excel" label="Export CSV" severity="success" @click="exportCSV" />
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-5 rounded-lg shadow-sm border-l-4 border-blue-500 bg-white">
            <p class="text-gray-600">Total Sales</p>
            <h3 class="text-xl font-bold">₱{{ totalSales }}</h3>
          </div>
          <div class="p-5 rounded-lg shadow-sm border-l-4 border-green-500 bg-white">
            <p class="text-gray-600">Items Sold</p>
            <h3 class="text-xl font-bold">{{ itemsSold }}</h3>
          </div>
          <div class="p-5 rounded-lg shadow-sm border-l-4 border-yellow-500 bg-white">
            <p class="text-gray-600">Total Orders</p>
            <h3 class="text-xl font-bold">{{ totalOrders }}</h3>
          </div>
        </div>

        <!-- Report Table -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4">Sales Details</h3>
          <DataTable :value="filteredData" paginator :rows="10" responsiveLayout="scroll" stripedRows>
            <Column field="date" header="Date" />
            <Column field="category" header="Category" />
            <Column field="user" header="User" />
            <Column field="item" header="Item" />
            <Column field="quantity" header="Quantity" />
            <Column field="total" header="Total" />
          </DataTable>
        </div>
      </div>
    </div>
    <!-- CONTAINER END -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Routing
const router = useRouter()
const goBack = () => router.go(-1)

// Filters
const dateRange = ref(null)
const selectedCategory = ref({ name: 'All', code: 'all' })
const selectedUser = ref({ name: 'All', code: 'all' })

// Options
const categories = ref([
  { name: 'All', code: 'all' },
  { name: 'Beverages', code: 'bev' },
  { name: 'Snacks', code: 'snack' },
])
const users = ref([
  { name: 'All', code: 'all' },
  { name: 'Admin', code: 'admin' },
  { name: 'Cashier', code: 'cashier' },
])

// All data
const allData = ref([
  { date: '2025-04-20', category: 'Beverages', user: 'Admin', item: 'Coke 500ml', quantity: 30, total: 900 },
  { date: '2025-04-20', category: 'Snacks', user: 'Cashier', item: 'Chips', quantity: 20, total: 400 },
  { date: '2025-04-21', category: 'Beverages', user: 'Admin', item: 'Sprite 500ml', quantity: 25, total: 750 },
  { date: '2025-04-21', category: 'Snacks', user: 'Cashier', item: 'Cookies', quantity: 15, total: 300 },
  { date: '2025-04-22', category: 'Beverages', user: 'Admin', item: 'Water 1L', quantity: 40, total: 800 },
  { date: '2025-04-22', category: 'Snacks', user: 'Admin', item: 'Peanuts', quantity: 10, total: 200 },
])

// Filtered data
const filteredData = computed(() => {
  return allData.value.filter(entry => {
    const entryDate = new Date(entry.date)

    const isInDateRange = !dateRange.value || (
      Array.isArray(dateRange.value) &&
      dateRange.value[0] &&
      dateRange.value[1] &&
      entryDate >= new Date(dateRange.value[0]) &&
      entryDate <= new Date(dateRange.value[1])
    )

    const isCategoryMatch =
      !selectedCategory.value || selectedCategory.value.code === 'all' ||
      entry.category === selectedCategory.value.name

    const isUserMatch =
      !selectedUser.value || selectedUser.value.code === 'all' ||
      entry.user === selectedUser.value.name

    return isInDateRange && isCategoryMatch && isUserMatch
  })
})

// Summary stats
const totalSales = computed(() => filteredData.value.reduce((acc, cur) => acc + cur.total, 0))
const itemsSold = computed(() => filteredData.value.reduce((acc, cur) => acc + cur.quantity, 0))
const totalOrders = computed(() => filteredData.value.length)

// Export CSV
function exportCSV() {
  const headers = ['Date', 'Category', 'User', 'Item', 'Quantity', 'Total']
  const rows = filteredData.value.map(row => [
    row.date, row.category, row.user, row.item, row.quantity, row.total
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'sales_report.csv'
  link.click()
}

// Export PDF
function exportPDF() {
  const doc = new jsPDF()
  doc.text('Sales Report', 14, 10)
  autoTable(doc, {
    startY: 20,
    head: [['Date', 'Category', 'User', 'Item', 'Qty', 'Total']],
    body: filteredData.value.map(row => [
      row.date, row.category, row.user, row.item, row.quantity, row.total
    ])
  })
  doc.save('sales_report.pdf')
}
</script>

<style scoped>
.reports-container {
  position: relative;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  z-index: 10;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.back-btn svg {
  width: 24px;
  height: 24px;
  color: #2E5D9E;
}

.content-area-container {
  background: rgb(235, 237, 238);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>
