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
  };
});
