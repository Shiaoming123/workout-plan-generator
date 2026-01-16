import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 挂载运动演示日志系统到全局 window 对象
// 让用户可以在浏览器控制台直接使用
import {
  printDemoLogStats,
  printMismatchedLogs,
  exportDemoLogs,
  clearDemoLogs,
  getDemoLogs,
  getDemoLogStats,
} from './lib/exerciseDemoService'

// 扩展 Window 接口
declare global {
  interface Window {
    printDemoLogStats: typeof printDemoLogStats;
    printMismatchedLogs: typeof printMismatchedLogs;
    exportDemoLogs: typeof exportDemoLogs;
    clearDemoLogs: typeof clearDemoLogs;
    getDemoLogs: typeof getDemoLogs;
    getDemoLogStats: typeof getDemoLogStats;
  }
}

// 挂载到全局
if (typeof window !== 'undefined') {
  window.printDemoLogStats = printDemoLogStats;
  window.printMismatchedLogs = printMismatchedLogs;
  window.exportDemoLogs = exportDemoLogs;
  window.clearDemoLogs = clearDemoLogs;
  window.getDemoLogs = getDemoLogs;
  window.getDemoLogStats = getDemoLogStats;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
