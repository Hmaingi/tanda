import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '~',
        replacement: path.resolve(__dirname, './src/views')
      }
    ]
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: false,
      allow: [
        'C:/Users/hanna/OneDrive/Desktop/tanda-inventory-system'
      ]
    }
  },
  build: {
    rollupOptions: {
      external: [
        'C:/Users/hanna/OneDrive/Desktop/tanda-inventory-system/src/views/AgentLogin.vue',
        'C:/Users/hanna/OneDrive/Desktop/tanda-inventory-system/src/views/InventoryDash.vue'
      ]
    }
  }
})
