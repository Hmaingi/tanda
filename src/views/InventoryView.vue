<template>
  <div class="inventory-page">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>

    <div class="inventory-content">
      <h1 class="inventory-title">Inventory Management</h1>

      <div class="inventory-form-section">
        <!-- Inventory List -->
        <div class="inventory-section">
          <h2 class="section-title">Inventory Items</h2>
          <div class="inventory-list">
            <div class="inventory-item" v-for="item in filteredInventory" :key="item.id">
              <div class="item-details">
                <p><strong>{{ item.name }}</strong></p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Price: ${{ item.price }}</p>
                <p>Added on: {{ item.added }}</p>
              </div>
              <button @click="editItem(item)" class="edit-btn">Edit</button>
            </div>
          </div>
        </div>

        <!-- Add / Edit Form -->
        <div class="add-item-form">
          <h2>{{ editingId ? 'Edit Item' : 'Add New Item' }}</h2>
          <form @submit.prevent="saveItem">
            <div class="form-group">
              <label for="itemName">Item Name</label>
              <input type="text" v-model="newItem.name" id="itemName" required />
            </div>
            <div class="form-group">
              <label for="itemQuantity">Quantity</label>
              <input type="number" v-model="newItem.quantity" id="itemQuantity" required />
            </div>
            <div class="form-group">
              <label for="itemPrice">Price</label>
              <input type="number" v-model="newItem.price" id="itemPrice" required />
            </div>
            <div class="form-group">
              <label for="itemDate">Date Added</label>
              <input type="date" v-model="newItem.added" id="itemDate" required />
            </div>
            <button type="submit" class="add-item-btn">
              {{ editingId ? 'Update Item' : 'Add Item' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const inventory = ref([
  { id: 1, name: 'Laptop', quantity: 10, price: 800, added: '2024-04-01' },
  { id: 2, name: 'Mouse', quantity: 50, price: 25, added: '2024-04-05' },
  { id: 3, name: 'Keyboard', quantity: 30, price: 50, added: '2024-03-29' },
])

const newItem = ref({ name: '', quantity: 0, price: 0, added: '' })
const editingId = ref(null)

function saveItem() {
  if (editingId.value) {
    const index = inventory.value.findIndex(i => i.id === editingId.value)
    if (index !== -1) inventory.value[index] = { id: editingId.value, ...newItem.value }
    editingId.value = null
  } else {
    const newId = inventory.value.length ? Math.max(...inventory.value.map(i => i.id)) + 1 : 1
    inventory.value.push({ id: newId, ...newItem.value })
  }
  newItem.value = { name: '', quantity: 0, price: 0, added: '' }
}

function editItem(item) {
  newItem.value = { ...item }
  editingId.value = item.id
}

function goBack() {
  router.back()
}

const filteredInventory = computed(() => inventory.value)
</script>

<style scoped>
.inventory-page {
  background-color: #f5f7fa;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.back-btn svg {
  width: 24px;
  height: 24px;
  color: #2E5D9E;
}

.inventory-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1200px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.inventory-title {
  text-align: center;
  margin-bottom: 1rem;
  color: #2E5D9E;
  font-size: 2rem;
  font-weight: 700;
}

.inventory-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2E5D9E;
}

.inventory-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.inventory-item {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex: 1 1 calc(33.33% - 1rem);
  box-sizing: border-box;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-details {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #333;
}

.edit-btn {
  background-color: #2E5D9E;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.inventory-form-section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
}

.add-item-form {
  flex: 1;
  min-width: 300px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.add-item-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2E5D9E;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
}

.add-item-btn {
  background-color: #2E5D9E;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .inventory-item {
    flex: 1 1 100%;
  }

  .inventory-form-section {
    flex-direction: column;
  }

  .inventory-content {
    padding: 1rem;
  }
}
</style>
