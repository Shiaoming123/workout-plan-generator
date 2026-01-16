export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sm:py-6 shadow-lg print:hidden">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          训练计划生成器
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm">
          Workout Plan Generator - 根据你的目标和条件，生成量身定制的训练计划
        </p>
      </div>
    </header>
  );
}
