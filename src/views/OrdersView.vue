<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
      <!-- Back Button Positioned at Top Left -->
      <button @click="goBack" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>
      

      <!-- Header Section -->
      <div class="header-section">
        <h1 class="text-2xl font-semibold text-gray-800">Order Management</h1>
        <!-- Moving Total Orders back here -->
        <div class="stats-badge">
          <span class="text-gray-700 font-medium">Total Orders: </span>
          <span class="text-blue-600 font-semibold">{{ orders.length }}</span>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="action-bar">
        <div class="filter-tabs">
          <Button
            v-for="filter in filters"
            :key="filter"
            :label="filter"
            :class="{
              'p-button-outlined': activeFilter !== filter, 
              'p-button-primary': activeFilter === filter
            }"
            @click="activeFilter = filter"
          />
        </div>
        <Button
          label="Add New Order"
          icon="pi pi-plus"
          class="p-button-success"
          @click="toggleAddOrderModal"
        />
      </div>

      <!-- Content Container -->
      <div class="table-container">
        <div v-if="loading" class="loading-spinner">
          <ProgressSpinner />
        </div>
        <div v-else-if="error" class="error-state">
          <p class="text-red-500">Error loading orders. Please try again.</p>
          <Button label="Retry" @click="loadOrders" class="mt-4" />
        </div>
        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <p class="text-gray-500">No orders found for the selected filter</p>
        </div>
        <div v-else>
          <DataTable 
            :value="filteredOrders" 
            responsiveLayout="scroll" 
            class="order-table"
            paginator 
            :rows="rowsPerPage"
            v-model:first="first"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <!-- Interactive rows per page dropdown -->
            <template #paginatorstart>
              <Dropdown 
                v-model="rowsPerPage" 
                :options="[5, 10, 20, 50]" 
                optionLabel="label" 
                optionValue="value"
                class="mr-2"
                @change="onRowsPerPageChange"
              />
            </template>
            
            <Column field="id" header="ID" sortable></Column>
            <Column field="customer" header="Customer" sortable></Column>
            <Column field="items" header="Items" :body="formatItems"></Column>
            <Column field="total" header="Total" :body="formatCurrency" sortable></Column>
            <Column field="date" header="Date" :body="formatDate" sortable></Column>
            <Column field="status" header="Status" :body="formatStatus" sortable></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <div class="action-buttons">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-sm p-button-outlined p-button-secondary"
                    @click="viewOrderDetails(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-check"
                    class="p-button-sm p-button-outlined p-button-success"
                    @click="updateOrderStatus(slotProps.data.id, 'Completed')"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-sm p-button-outlined p-button-danger"
                    @click="deleteOrder(slotProps.data.id)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Order Details Modal -->
      <Dialog 
        v-model:visible="orderDetailsVisible"
        modal
        header="Order Details" 
        :style="{width: '600px'}"
        :closable="true"
      >
        <div class="grid grid-cols-2 gap-4">
          <!-- Left Column -->
          <div>
            <div class="mb-4">
              <p class="text-sm text-gray-500 mb-1">Customer</p>
              <p class="font-medium">{{ selectedOrder?.customer }}</p>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500 mb-1">Date</p>
              <p>{{ selectedOrder?.date ? formatDate({date: selectedOrder.date}) : '' }}</p>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500 mb-1">Total</p>
              <p class="text-green-600 font-medium">{{ selectedOrder?.total ? formatCurrency({total: selectedOrder.total}) : '' }}</p>
            </div>
          </div>
          
          <!-- Right Column -->
          <div>
            <div class="mb-4">
              <p class="text-sm text-gray-500 mb-1">Status</p>
              <Dropdown 
                v-model="selectedOrder.status" 
                :options="statusOptions"
                class="w-full"
              />
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500 mb-1">Items Count</p>
              <p>{{ selectedOrder?.items ? (Array.isArray(selectedOrder.items) ? selectedOrder.items.length : selectedOrder.items.split(',').length) : 0 }}</p>
            </div>
          </div>
        </div>
        
        <!-- Items List (Full Width) -->
        <div class="mt-4">
          <p class="text-sm text-gray-500 mb-2">Items</p>
          <div class="border rounded max-h-48 overflow-y-auto">
            <div v-for="(item, index) in selectedOrder?.items ? (Array.isArray(selectedOrder.items) ? selectedOrder.items : selectedOrder.items.split(',')) : []" 
                :key="index"
                class="flex items-center py-1 px-2 hover:bg-gray-50 border-b last:border-b-0">
              <span class="text-gray-400 text-xs w-6">{{ index + 1 }}.</span>
              <span class="text-sm">{{ item.trim() }}</span>
            </div>
          </div>
        </div>
        
        <template #footer>
          <Button 
            label="Close" 
            class="p-button-outlined p-button-secondary"
            @click="orderDetailsVisible = false" 
          />
          <Button 
            label="Save Changes" 
            class="p-button-primary ml-2"
            @click="saveOrderChanges" 
          />
        </template>
      </Dialog>

      <!-- Add New Order Modal -->
      <Dialog 
        v-model:visible="showAddOrderModal"
        modal
        header="Add New Order" 
        :style="{width: '700px'}"
        :closable="true"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="block mb-1 font-medium">Customer Name</label>
            <InputText 
              v-model="newOrder.customer" 
              class="w-full" 
              required
            />
          </div>
          <div class="field">
            <label class="block mb-1 font-medium">Date</label>
            <Calendar 
              v-model="newOrder.date" 
              class="w-full" 
              dateFormat="yy-mm-dd" 
              required
            />
          </div>
          <div class="field">
            <label class="block mb-1 font-medium">Status</label>
            <Dropdown 
              v-model="newOrder.status" 
              :options="statusOptions" 
              class="w-full" 
              placeholder="Select Status"
              required
            />
          </div>
          <div class="field">
            <label class="block mb-1 font-medium">Total</label>
            <InputNumber 
              v-model="newOrder.total" 
              class="w-full" 
              mode="currency" 
              currency="USD" 
              required
            />
          </div>
          <div class="field col-span-2">
            <label class="block mb-1 font-medium">Items (comma-separated)</label>
            <InputText 
              v-model="newOrder.items" 
              class="w-full" 
              required
            />
          </div>
        </div>
        
        <template #footer>
          <Button 
            label="Cancel" 
            class="p-button-secondary" 
            @click="cancelAddOrder" 
          />
          <Button 
            label="Submit" 
            class="p-button-primary ml-2" 
            @click="addOrder" 
            :loading="submitting" 
            :disabled="!isFormValid"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';

const router = useRouter();

// State
const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const submitting = ref(false);
const showAddOrderModal = ref(false);
const activeFilter = ref('All');
const filters = ['All', 'Pending', 'Completed', 'Cancelled'];
const statusOptions = ['Pending', 'Completed', 'Cancelled'];
const orderDetailsVisible = ref(false);
const selectedOrder = ref({});
const retryCount = ref(0);
const MAX_RETRIES = 3;

// Pagination state
const rowsPerPage = ref(5);
const first = ref(0);
const currentPage = ref(0);

const newOrder = ref({
  customer: '',
  items: '',
  total: null,
  date: new Date(),
  status: 'Pending'
});

// Mock service with timeout
const orderService = {
  getOrders: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, customer: 'John Doe', items: ['Laptop', 'Mouse'], total: 1024.99, date: new Date(), status: 'Pending' },
          { id: 2, customer: 'Jane Smith', items: ['Monitor', 'Keyboard'], total: 459.98, date: new Date(), status: 'Completed' },
          { id: 3, customer: 'Bob Johnson', items: ['SSD Drive', 'RAM'], total: 289.97, date: new Date(), status: 'Cancelled' },
          { id: 4, customer: 'Alice Williams', items: ['Headphones', 'Webcam'], total: 159.98, date: new Date(), status: 'Pending' },
          { id: 5, customer: 'Eva Brown', items: ['Printer', 'Cartridge'], total: 345.50, date: new Date(), status: 'Completed' }
        ]);
      }, 500);
    });
  },
  
  addOrder: (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000) + 10,
          ...orderData
        });
      }, 300);
    });
  },
  
  updateOrderStatus: (orderId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: orderId, status });
      }, 300);
    });
  },
  
  updateOrder: (orderId, orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: orderId, ...orderData });
      }, 300);
    });
  },
  
  deleteOrder: (orderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
};

// Computed
const filteredOrders = computed(() => {
  if (!orders.value || !orders.value.length) return [];
  if (activeFilter.value === 'All') return orders.value;
  return orders.value.filter(order => order.status === activeFilter.value);
});

const isFormValid = computed(() => {
  return (
    newOrder.value.customer?.trim() &&
    newOrder.value.items?.trim() &&
    newOrder.value.total !== null &&
    newOrder.value.date &&
    newOrder.value.status
  );
});

// Methods
const loadOrders = async () => {
  try {
    if (retryCount.value >= MAX_RETRIES) return;
    
    loading.value = true;
    error.value = null;
    const data = await orderService.getOrders();
    orders.value = data || [];
    retryCount.value = 0;
  } catch (err) {
    error.value = err;
    retryCount.value++;
    showNotification('Failed to load orders', 'error');
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.push('/dashboard');

const toggleAddOrderModal = () => {
  showAddOrderModal.value = !showAddOrderModal.value;
  if (showAddOrderModal.value === false) {
    resetForm();
  }
};

const cancelAddOrder = () => {
  showAddOrderModal.value = false;
  resetForm();
};

const resetForm = () => {
  newOrder.value = {
    customer: '',
    items: '',
    total: null,
    date: new Date(),
    status: 'Pending'
  };
};

const showNotification = (message, severity = 'success') => {
  // Implementation for showing notifications
  console.log(`${severity}: ${message}`);
};

const addOrder = async () => {
  if (!isFormValid.value) return;
  
  submitting.value = true;
  try {
    const orderData = {
      ...newOrder.value,
      items: newOrder.value.items.split(',').map(item => item.trim()),
      total: parseFloat(newOrder.value.total)
    };
    
    const createdOrder = await orderService.addOrder(orderData);
    orders.value.unshift(createdOrder);
    
    showNotification('Order added successfully');
    showAddOrderModal.value = false;
  } catch (err) {
    showNotification('Failed to add order', 'error');
  } finally {
    submitting.value = false;
  }
};

const viewOrderDetails = (order) => {
  selectedOrder.value = JSON.parse(JSON.stringify(order));
  orderDetailsVisible.value = true;
};

const saveOrderChanges = async () => {
  if (!selectedOrder.value) return;
  
  try {
    const updatedOrder = await orderService.updateOrder(
      selectedOrder.value.id, 
      selectedOrder.value
    );
    
    const index = orders.value.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      orders.value[index] = updatedOrder;
    }
    
    orderDetailsVisible.value = false;
    showNotification('Order updated successfully');
  } catch (err) {
    showNotification('Failed to update order', 'error');
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
    const index = orders.value.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders.value[index] = {...orders.value[index], ...updatedOrder};
    }
    showNotification('Order status updated');
  } catch (err) {
    showNotification('Failed to update order', 'error');
  }
};

const deleteOrder = async (orderId) => {
  try {
    await orderService.deleteOrder(orderId);
    orders.value = orders.value.filter(o => o.id !== orderId);
    showNotification('Order deleted');
  } catch (err) {
    showNotification('Failed to delete order', 'error');
  }
};

const formatItems = (data) => {
  return Array.isArray(data.items) 
    ? data.items.join(', ') 
    : data.items;
};

const formatCurrency = (data) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(data.total);
};

const formatDate = (data) => {
  return new Date(data.date).toLocaleDateString();
};

const formatStatus = (data) => {
  const statusClasses = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  };
  return `<span class="px-2 py-1 rounded-md text-sm ${statusClasses[data.status]}">${data.status}</span>`;
};

// Pagination methods
const onRowsPerPageChange = () => {
  first.value = 0;
  currentPage.value = 0;
};

// Lifecycle
onMounted(loadOrders);
</script>

<style scoped>
.back-btn {
  position: left;
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

/* Header Styles */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.stats-badge {
  background-color: #f8fafc;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(15, 15, 15, 0.05);
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}
.p-button-icon {
 display: inline-block;
 font-size: 1rem;
}
.p-button {
  padding: 0.5rem 0.75rem;
  display: inline-block;
  font-size: 1rem;
}

.p-button-outlined {
   border-width:1px;
   background:transparent;
}

.p-button-outlined:hover{
  background: rgba(0, 0, 0, 0.04);
}

.filter-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Table Styles */
.table-container {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.order-table {
  width: 100%;
  font-size: 0.875rem;
}

.order-table th {
  background-color: #f1f5f9;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
}

.order-table tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.order-table tr:hover {
  background-color: #f8fafc;
}

.order-table td {
  padding: 0.75rem 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* State Styles */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.error-state {
  text-align: center;
  padding: 2rem 0;
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
}

/* Form Styles */
.field {
  margin-bottom: 1rem;
}

/* Add this to center the current page report */
:deep(.p-paginator) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.p-paginator-current) {
  margin: 0 auto;
  order: 1;
}

:deep(.p-paginator-first, .p-paginator-prev, .p-paginator-pages) {
  order: 0;
}

:deep(.p-paginator-next, .p-paginator-last) {
  order: 2;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-bar {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  
  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  :deep(.p-paginator) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  :deep(.p-paginator-current) {
    width: 100%;
    text-align: center;
    order: 0;
    margin-bottom: 0.5rem;
    
  }
  
  :deep(.p-paginator-first, .p-paginator-prev, .p-paginator-pages, .p-paginator-next, .p-paginator-last) {
    order: 1;
  }
}
</style>