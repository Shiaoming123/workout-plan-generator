import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 适配 GitHub Pages 等静态部署

  // ✅ 性能优化：代码分割配置
  build: {
    rollupOptions: {
      output: {
        // 更细致的代码分割策略，提升缓存效率
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom'],
          // UI 相关库
          'ui-vendor': ['framer-motion'],
          // 导出功能相关库
          'export-vendor': ['qrcode.react', 'html-to-image'],
        },
        // 为生成的 chunk 文件添加哈希，利于长期缓存
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 600,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 使用 esbuild 压缩（默认，更快）
    minify: 'esbuild',
    // 生产环境移除 console
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'external'
    }
  }
})
