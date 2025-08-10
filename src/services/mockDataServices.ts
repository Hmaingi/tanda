// 1. First define all TypeScript interfaces
interface InventoryItem {
    id: number;
    name: string;
    category: string;
    stock: number;
    threshold: number;
    price?: number;  // Optional property
    lastUpdated: string;
  }
  
  interface ActivityLog {
    id: number;
    action: string;
    agent: string;
    timestamp: string;
  }
  
  interface InventoryStats {
    totalItems: number;
    lowStockItems: number;
    totalValue: number;
  }
  
  // 2. Initialize mock databases with types
  const inventoryDB: InventoryItem[] = [
    {
      id: 1,
      name: 'Laptop',
      category: 'Electronics',
      stock: 15,
      threshold: 5,
      price: 999.99,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Mouse',
      category: 'Electronics',
      stock: 8,
      threshold: 10,
      price: 24.99,
      lastUpdated: new Date().toISOString()
    }
  ];
  
  let activityLog: ActivityLog[] = [
    {
      id: 1,
      action: 'Initialized inventory',
      agent: 'System',
      timestamp: new Date().toISOString()
    }
  ];
  
  // 3. Helper function with proper typing
  function logActivity(action: string): void {
    const newId = activityLog.length > 0 
      ? Math.max(...activityLog.map(a => a.id)) + 1 
      : 1;
      
    activityLog.unshift({
      id: newId,
      action,
      agent: 'Demo Agent',
      timestamp: new Date().toISOString()
    });
  }
  
  // 4. Define the mock API interface
  interface MockApi {
    getInventory: () => Promise<InventoryItem[]>;
    getItem: (id: number) => Promise<InventoryItem | undefined>;
    updateItem: (id: number, updates: Partial<Omit<InventoryItem, 'id'>>) => Promise<InventoryItem>;
    addItem: (newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => Promise<InventoryItem>;
    getActivityLog: () => Promise<ActivityLog[]>;
    getInventoryStats: () => Promise<InventoryStats>;
  }
  
  // 5. Implement the mock API
  export const mockApi: MockApi = {
    getInventory: (): Promise<InventoryItem[]> => {
      return new Promise(resolve => {
        setTimeout(() => resolve([...inventoryDB]), 300);
      });
    },
  
    getItem: (id: number): Promise<InventoryItem | undefined> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(inventoryDB.find(item => item.id === id));
        }, 200);
      });
    },
  
    updateItem: (id: number, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = inventoryDB.findIndex(item => item.id === id);
          if (index === -1) {
            reject(new Error(`Item with ID ${id} not found`));
            return;
          }
  
          const updatedItem: InventoryItem = { 
            ...inventoryDB[index], 
            ...updates,
            lastUpdated: new Date().toISOString()
          };
  
          inventoryDB[index] = updatedItem;
          logActivity(`Updated ${updatedItem.name} stock`);
          resolve(updatedItem);
        }, 400);
      });
    },
  
    addItem: (newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
      return new Promise(resolve => {
        setTimeout(() => {
          const newId = inventoryDB.length > 0 
            ? Math.max(...inventoryDB.map(i => i.id)) + 1 
            : 1;
  
          const itemWithId: InventoryItem = {
            ...newItem,
            id: newId,
            lastUpdated: new Date().toISOString(),
            price: newItem.price || 0 // Default price if not provided
          };
  
          inventoryDB.push(itemWithId);
          logActivity(`Added new ${itemWithId.name}`);
          resolve(itemWithId);
        }, 500);
      });
    },
  
    getActivityLog: (): Promise<ActivityLog[]> => {
      return new Promise(resolve => {
        setTimeout(() => resolve([...activityLog]), 200);
      });
    },
  
    getInventoryStats: (): Promise<InventoryStats> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            totalItems: inventoryDB.length,
            lowStockItems: inventoryDB.filter(i => i.stock < i.threshold).length,
            totalValue: inventoryDB.reduce((sum, item) => sum + (item.stock * (item.price || 0)), 0)
          });
        }, 300);
      });
    }
  };