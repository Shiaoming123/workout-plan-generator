import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: './', // 适配 GitHub Pages 等静态部署
    define: {
      'import.meta.env.VITE_DEEPSEEK_API_KEY': JSON.stringify(env.VITE_DEEPSEEK_API_KEY),
      'import.meta.env.VITE_DEEPSEEK_BASE_URL': JSON.stringify(env.VITE_DEEPSEEK_BASE_URL),
    },
    server: {
      proxy: {
        // 开发环境代理 DeepSeek API，解决 CORS 问题
        '/api/deepseek': {
          target: 'https://api.deepseek.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 添加 API Key 到请求头
              if (env.VITE_DEEPSEEK_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.VITE_DEEPSEEK_API_KEY}`);
              }
            });
          }
        }
      }
    }
  };
});
