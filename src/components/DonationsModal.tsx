interface DonationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationsModal({ isOpen, onClose }: DonationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 可滚动内容区域 */}
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-4">
          {/* 成功提示 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              训练计划生成！✅
            </h2>
            <p className="text-gray-600 text-lg">
              您的专属健身计划已经准备好啦！💪
            </p>
          </div>

          {/* 感谢文案 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                🎉 感谢使用 Workout Plan Generator！
              </p>
              <p className="text-gray-700">
                如果这个计划对您有帮助，欢迎请我喝杯奶茶 ☕️~
              </p>
              <p className="text-sm text-gray-600">
                您的支持是我持续优化和更新的动力 🚀
              </p>
              <p className="text-xs text-gray-500 mt-2">
                （完全自愿，不强制哦~ 😊）
              </p>
            </div>
          </div>

          {/* 收款码 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* 支付宝 */}
            <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💰</div>
                <h3 className="font-bold text-gray-800 text-lg">支付宝</h3>
                <p className="text-xs text-gray-600 mt-1">扫一扫请喝奶茶 🥤</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-inner flex items-center justify-center">
                <img
                  src="/images/alipay-qr.jpg"
                  alt="支付宝收款码"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '200px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement!;
                    if (parent) {
                      parent.innerHTML = '<p class="text-xs text-gray-500 text-center py-4">收款码加载中...</p>';
                    }
                  }}
                />
              </div>
            </div>

            {/* 微信 */}
            <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💚</div>
                <h3 className="font-bold text-gray-800 text-lg">微信支付</h3>
                <p className="text-xs text-gray-600 mt-1">扫一扫请喝奶茶 🧋</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-inner flex items-center justify-center">
                <img
                  src="/images/wechat-qr.jpg"
                  alt="微信收款码"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '200px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement!;
                    if (parent) {
                      parent.innerHTML = '<p class="text-xs text-gray-500 text-center py-4">收款码加载中...</p>';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* 额外提示 */}
          <p className="text-xs text-gray-500 text-center mb-4">
            💡 提示：您也可以随时在项目主页找到赞助入口
          </p>
        </div>

        {/* 固定底部按钮区域 */}
        <div className="px-8 pb-8 pt-2 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              开始训练 🏋️‍♂️
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              稍后再说 👋
            </button>
          </div>
        </div>
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
