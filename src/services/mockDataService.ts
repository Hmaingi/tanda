
// Add to the top with other interfaces
interface Agent {
  id: string
  name: string
  role: 'admin' | 'inventory_manager' | 'viewer'
}
