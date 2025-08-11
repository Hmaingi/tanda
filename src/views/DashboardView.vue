<template> 
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="sidebar-title">Quick Access</h2>
      <router-link to="/inventory" class="sidebar-btn">Inventory</router-link>
      <router-link to="/orders" class="sidebar-btn">Orders</router-link>
      <router-link to="/reports" class="sidebar-btn">Reports</router-link>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="search-filter-row">
          <input v-model="searchQuery" type="text" placeholder="Search inventory..." class="search-input" />
          <div class="date-pickers">
            <Calendar v-model="startDate" placeholder="Start Date" class="datepicker" />
            <Calendar v-model="endDate" placeholder="End Date" class="datepicker" />
          </div>
        </div>
        <!-- Avatar -->
        <div class="avatar-container" @click="goToProfile">
          <img :src="user.avatar || defaultAvatar" class="avatar" alt="User" />
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="dashboard-body">
        <h1>Agent Dashboard</h1>

        <!-- Stats + Chart Row -->
        <div class="stats-chart-row">
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Inventory</h3>
              <p>{{ stats.totalItems }}</p>
            </div>
            <div class="stat-card warning">
              <h3>Low Stock</h3>
              <p>{{ stats.lowStock }}</p>
            </div>
            <div class="stat-card">
              <h3>Pending Orders</h3>
              <p>{{ stats.pendingOrders }}</p>
            </div>
          </div>

          <div class="chart-container">
            <apexchart
              type="donut"
              height="280"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </div>

        <!-- Products Overview Row -->
        <div class="products-row">
          <div class="section">
            <h2>Top Selling Products</h2>
            <ul class="list">
              <li v-for="p in topSelling" :key="p.id">
                {{ p.name }} - {{ p.sales }} sold
              </li>
            </ul>
          </div>

          <div class="section">
            <h2>Products with Dropping Sales</h2>
            <ul class="list dropping">
              <li v-for="p in droppingSales" :key="p.id">
                {{ p.name }} - Down {{ p.dropPercent }}%
              </li>
            </ul>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div v-if="filteredLowStock.length" class="alerts">
          <h2>Low Stock Items</h2>
          <div class="alert-item" v-for="item in filteredLowStock" :key="item.id">
            {{ item.name }} ({{ item.quantity }} left)
            <button @click="restockItem(item)" class="restock-btn">Restock</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Calendar from 'primevue/calendar'
import defaultAvatar from '@/assets/default-avatar.png'
import ApexCharts from 'vue3-apexcharts'

const router = useRouter()

const user = ref({
  name: 'Agent Name',
  avatar: ''
})

const stats = ref({
  totalItems: 42,
  lowStock: 5,
  pendingOrders: 3
})

const searchQuery = ref('')
const startDate = ref(null)
const endDate = ref(null)

const lowStockItems = ref([
  { id: 1, name: 'Laptop', quantity: 2, added: '2025-04-10', expiry: '2025-06-01' },
  { id: 2, name: 'Mouse', quantity: 3, added: '2025-04-13', expiry: '2025-05-10' }
])

const filteredLowStock = computed(() => {
  return lowStockItems.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const addedDate = new Date(item.added)
    const afterStart = !startDate.value || addedDate >= startDate.value
    const beforeEnd = !endDate.value || addedDate <= endDate.value
    return matchesSearch && afterStart && beforeEnd
  })
})

const topSelling = ref([
  { id: 1, name: 'Smartphone', sales: 120 },
  { id: 2, name: 'Headphones', sales: 85 },
  { id: 3, name: 'Keyboard', sales: 70 }
])

const droppingSales = ref([
  { id: 1, name: 'Tablet', dropPercent: 15 },
  { id: 2, name: 'Camera', dropPercent: 10 }
])

// Chart Data
const chartSeries = ref([
  stats.value.lowStock,
  stats.value.pendingOrders,
  stats.value.totalItems
])

const chartOptions = ref({
  chart: {
    type: 'donut'
  },
  labels: ['Low Stock', 'Pending Orders', 'Total Inventory'],
  colors: ['#FF4560', '#FEB019', '#00E396'],
  legend: { position: 'bottom' },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' }
    }
  }]
})

function goToProfile() {
  router.push('/profile')
}

function restockItem(item) {
  console.log('Restocking:', item.name)
}
</script>

<script>
export default {
  components: {
    apexchart: ApexCharts,
    Calendar
  }
}
</script>

<style scoped>

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f7fa;
}
.sidebar {
  width: 220px;
  background-color: #2E5D9E;
  color: white;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
}
.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.sidebar-btn {
  display: block;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  color: #2E5D9E;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
}
.search-filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}
.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.date-pickers {
  display: flex;
  gap: 0.5rem;
}
.datepicker {
  min-width: 130px;
}
.avatar-container {
  cursor: pointer;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2E5D9E;
}
.stats-chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem 0;
}
.stats-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-card.warning {
  border-left: 4px solid #FFC107;
}
.chart-container {
  flex: 1;
  min-width: 280px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}
.products-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.section {
  flex: 1;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.list.dropping li {
  color: red;
}
.alerts {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
.restock-btn {
  background: #2E5D9E;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

</style>