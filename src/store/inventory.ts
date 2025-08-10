import { defineStore } from 'pinia'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: [
      { id: 1, name: 'Laptop', stock: 15, threshold: 5 },
      { id: 2, name: 'Mouse', stock: 8, threshold: 10 }
    ]
  }),
  actions: {
    updateStock(id: number, newStock: number) {
      const item = this.items.find(i => i.id === id)
      if (item) item.stock = newStock
    }
  },
  getters: {
    lowStockItems: (state) => state.items.filter(i => i.stock < i.threshold)
  }
})