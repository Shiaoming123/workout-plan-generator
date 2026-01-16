interface DonationTipProps {
  onOpenModal?: () => void;
}

export default function DonationTip({ onOpenModal }: DonationTipProps) {
  return (
    <div className="mt-6 sm:mt-8 mb-4 sm:mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 p-4 sm:p-6 print:hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* 左侧：感谢文案 */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-2">
            <span className="text-2xl sm:text-3xl">☕</span>
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              觉得有用？请我喝杯奶茶吧！
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            您的支持是我持续优化的动力 🚀
            <span className="block text-xs text-gray-500 mt-1">
              （完全自愿，不强制哦~ 😊）
            </span>
          </p>
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            查看打赏方式
          </button>
        </div>

        {/* 右侧：二维码预览 */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 支付宝 */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg border-2 border-blue-200 p-1 mb-1 shadow-sm">
              <img
                src="/images/alipay-qr.jpg"
                alt="支付宝"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <p className="text-xs text-gray-600 font-medium">支付宝</p>
          </div>

          {/* 微信 */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg border-2 border-green-200 p-1 mb-1 shadow-sm">
              <img
                src="/images/wechat-qr.jpg"
                alt="微信"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <p className="text-xs text-gray-600 font-medium">微信</p>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-orange-200 text-center">
        <p className="text-xs text-gray-500">
          💡 任意金额都是鼓励，感谢您的支持！💝
        </p>
      </div>
    </div>
  );
}
