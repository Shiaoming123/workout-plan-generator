import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 适配 GitHub Pages 等静态部署

  // ✅ 性能优化：代码分割配置
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库分离到单独的 chunk
          'react-vendor': ['react', 'react-dom'],
          // 将 UI 相关库分离
          'ui-vendor': ['framer-motion'],
          // 将工具库分离
          'utils': ['qrcode.react', 'html-to-image'],
        }
      }
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 600
  }
})
