<template>
  <div class="inventory-page">
    <!-- Back Button with Outer Layer -->
    <button @click="goBack" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>

    <!-- Main Content -->
    <div class="inventory-content">
      <h1 class="inventory-title">Inventory Management</h1>

      <!-- Inventory List Section -->
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

      <!-- Add Inventory Item Form -->
      <div class="add-item-form">
        <h2>Add New Item</h2>
        <form @submit.prevent="addItem">
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
          <button type="submit" class="add-item-btn">Add Item</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Sample inventory data
const inventory = ref([
  { id: 1, name: 'Laptop', quantity: 10, price: 800, added: '2024-04-01' },
  { id: 2, name: 'Mouse', quantity: 50, price: 25, added: '2024-04-05' },
  { id: 3, name: 'Keyboard', quantity: 30, price: 50, added: '2024-03-29' },
])

// New item model
const newItem = ref({
  name: '',
  quantity: 0,
  price: 0,
  added: '',
})

// Function to add new item
function addItem() {
  const newId = inventory.value.length + 1
  inventory.value.push({
    id: newId,
    ...newItem.value,
  })
  newItem.value = { name: '', quantity: 0, price: 0, added: '' } // reset form
}

// Function to edit an item
function editItem(item) {
  newItem.value = { ...item }
}

// Function to handle back button click (navigate back)
function goBack() {
  router.back() // This will go back to the previous page in history
}

// Computed property for filtered inventory (optional search/filter functionality)
const filteredInventory = computed(() => {
  return inventory.value.filter(item => {
    return item.name.toLowerCase().includes('') // You can implement actual search functionality here
  })
})
</script>

<style scoped>
.inventory-page {
  background-color: #f5f7fa;
  padding: 2rem;
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
  color: #2E5D9E; /* Tanda blue */
}

.inventory-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 50px; /* Give space for the back button */
}

.inventory-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2E5D9E;
}

.inventory-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2E5D9E;
  margin-bottom: 1rem;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: calc(33.33% - 1rem); /* Adjust item width for 3 items per row */
  box-sizing: border-box;
}

.item-details {
  margin-bottom: 1rem;
}

.edit-btn {
  background-color: #2E5D9E;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.add-item-form {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-item-form h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2E5D9E;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-item-btn {
  background-color: #2E5D9E;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .inventory-item {
    width: 100%; /* On mobile, make each item take full width */
  }

  .inventory-list {
    flex-direction: column; /* Stack inventory items vertically */
  }

  .add-item-form {
    max-width: 100%;
    margin: 0 auto;
  }

  .inventory-content {
    padding: 1rem;
  }
}
</style>
