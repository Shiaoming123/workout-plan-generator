/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义颜色系统 - 极简现代风格
      colors: {
        // 训练阶段颜色
        phase: {
          warmup: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            500: '#f97316',
            600: '#ea580c',
          },
          main: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            500: '#3b82f6',
            600: '#2563eb',
          },
          accessory: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            500: '#a855f7',
            600: '#9333ea',
          },
          cooldown: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            500: '#22c55e',
            600: '#16a34a',
          },
        },
        // 目标类型渐变起止色
        goal: {
          'fat-loss': {
            from: '#f97316', // orange-500
            to: '#ef4444', // red-500
          },
          'muscle-gain': {
            from: '#3b82f6', // blue-500
            to: '#8b5cf6', // purple-500
          },
          'fitness': {
            from: '#06b6d4', // cyan-500
            to: '#3b82f6', // blue-500
          },
          'rehab': {
            from: '#10b981', // green-500
            to: '#06b6d4', // cyan-500
          },
        },
      },
      // 自定义阴影 - 极简风格
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      // 自定义过渡
      transitionTimingFunction: {
        'bounce-gentle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
