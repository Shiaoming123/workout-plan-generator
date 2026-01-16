interface HeaderProps {
  onRestartTutorial?: () => void;
}

export default function Header({ onRestartTutorial }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sm:py-6 shadow-lg print:hidden relative">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          训练计划生成器
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm">
          Workout Plan Generator - 根据你的目标和条件，生成量身定制的训练计划
        </p>
      </div>

      {/* ✅ 引导按钮 */}
      {onRestartTutorial && (
        <button
          id="tutorial-button"
          onClick={onRestartTutorial}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/30"
          title="重新查看新手引导"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">帮助</span>
        </button>
      )}
    </header>
  );
}
