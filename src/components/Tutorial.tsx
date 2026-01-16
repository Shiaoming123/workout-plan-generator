import { useState } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';

interface TutorialProps {
  run: boolean;
  onTourComplete: () => void;
}

/**
 * 新手引导组件
 *
 * 使用 react-joyride 实现聚焦式分步教程
 * 首次访问时自动启动，用户可以随时重新查看
 */
export default function Tutorial({ run, onTourComplete }: TutorialProps) {
  const [steps] = useState<Step[]>([
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">
            🏋️‍♂️ 欢迎使用训练计划生成器！
          </h2>
          <p className="text-gray-700 mb-4">
            这是一款基于 AI 的智能健身计划生成工具，<br/>
            会根据您的目标、身体条件和设备，为您量身定制专属训练计划。
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-semibold mb-2">🎯 接下来我们将带您了解主要功能：</p>
            <ul className="text-left inline-block">
              <li>✅ 如何填写个人信息</li>
              <li>✅ 如何选择 AI 模型</li>
              <li>✅ 如何生成训练计划</li>
              <li>✅ 如何导出和分享计划</li>
            </ul>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#input-form-section',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            📝 第一步：填写个人信息
          </h3>
          <p className="text-gray-700 mb-3">
            在这个表单中，您需要填写：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>训练目标</strong>：减脂、增肌、综合体能等</li>
            <li>• <strong>基本信息</strong>：年龄、身高、体重</li>
            <li>• <strong>训练经验</strong>：新手、进阶或老手</li>
            <li>• <strong>训练频率</strong>：每周训练几天</li>
            <li>• <strong>可用设备</strong>：家中徒手、哑铃、健身房等</li>
            <li>• <strong>身体限制</strong>：如有伤病请如实填写</li>
          </ul>
          <p className="text-sm text-blue-600 mt-3 font-semibold">
            💡 提示：信息越详细，生成的计划越适合您！
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#ai-model-section',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            🤖 第二步：选择 AI 模型
          </h3>
          <p className="text-gray-700 mb-3">
            我们支持两种 AI 模型：
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-semibold text-purple-900">💬 Chat 模型（推荐新手）</p>
              <p className="text-purple-700">
                • 速度快，10-30秒即可生成<br/>
                • 适合日常使用，快速获取计划
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="font-semibold text-indigo-900">🧠 Reasoner 模型（进阶）</p>
              <p className="text-indigo-700">
                • 深度推理，5-10分钟<br/>
                • 展示完整思考过程，了解如何制定计划
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            ⚡ 如果 API 失败，系统会自动使用规则引擎生成计划
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#api-config-section',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            🔧 第三步：API 配置（可选）
          </h3>
          <p className="text-gray-700 mb-3">
            展开此区域可以自定义 API 配置：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 使用您自己的 API Key</li>
            <li>• 支持 OpenAI、Azure、DeepSeek 等</li>
            <li>• 也支持本地部署的模型</li>
          </ul>
          <p className="text-sm text-yellow-600 mt-3 font-semibold">
            ⚠️ 注意：配置会保存在浏览器本地，不会上传
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#generate-button',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            🚀 第四步：生成训练计划
          </h3>
          <p className="text-gray-700 mb-3">
            填写完成后，点击此按钮开始生成：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>周计划</strong>：快速体验，1周训练</li>
            <li>• <strong>月计划</strong>：标准周期，4周渐进</li>
            <li>• <strong>季度计划</strong>：系统训练，12周完整计划</li>
            <li>• <strong>自定义</strong>：自由指定周数（1-52周）</li>
          </ul>
          <p className="text-sm text-blue-600 mt-3 font-semibold">
            💡 生成过程中可以随时点击"中断生成"停止
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#streaming-display',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            ⏳ 生成进度实时显示
          </h3>
          <p className="text-gray-700 mb-3">
            在生成过程中，您可以看到：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>进度条</strong>：显示当前生成进度（第 X/4 周）</li>
            <li>• <strong>AI 推理过程</strong>：Reasoner 模型会展示思考过程</li>
            <li>• <strong>实时内容</strong>：像 ChatGPT 一样的打字效果</li>
            <li>• <strong>中断按钮</strong>：随时可以停止生成</li>
          </ul>
          <p className="text-sm text-orange-600 mt-3 font-semibold">
            🛑 如果不想等了，点击红色"中断生成"按钮即可
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '#user-profile-card',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            👤 个人信息汇总
          </h3>
          <p className="text-gray-700 mb-3">
            生成后，这里会显示您的配置汇总：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 所有填写的信息一目了然</li>
            <li>• 方便核对是否正确</li>
            <li>• 点击"重新生成"可返回修改</li>
          </ul>
          <p className="text-sm text-blue-600 mt-3 font-semibold">
            💡 随时可以点击"重新生成"修改配置
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#plan-display',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            📋 训练计划展示
          </h3>
          <p className="text-gray-700 mb-3">
            生成的训练计划以卡片形式展示：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>可折叠设计</strong>：点击卡片展开查看详情</li>
            <li>• <strong>彩色边框</strong>：不同训练日用不同颜色区分</li>
            <li>• <strong>四个阶段</strong>：热身 → 主训练 → 辅助 → 拉伸</li>
            <li>• <strong>动作详情</strong>：组数、次数、时长、休息时间</li>
          </ul>
          <p className="text-sm text-green-600 mt-3 font-semibold">
            ✅ 点击训练日卡片可以展开/收起查看详细动作
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#export-buttons',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            💾 导出与分享
          </h3>
          <p className="text-gray-700 mb-3">
            您可以通过多种方式保存和分享计划：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>📋 复制文本</strong>：复制为纯文本格式</li>
            <li>• <strong>📥 下载 JSON</strong>：保存为数据文件</li>
            <li>• <strong>🖼️ 导出图片</strong>：生成精美的分享图片</li>
            <li>• <strong>🖨️ 打印</strong>：打印为纸质版</li>
          </ul>
          <p className="text-sm text-blue-600 mt-3 font-semibold">
            🖼️ 导出图片时可以选择简略版或详细版，还能包含用户信息
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#donation-tip',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            ☕ 支持我们
          </h3>
          <p className="text-gray-700 mb-3">
            如果这个工具对您有帮助，欢迎支持我们：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 完全自愿，不强制</li>
            <li>• 金额随意，心意最重要</li>
            <li>• 支持微信和支付宝</li>
          </ul>
          <p className="text-sm text-pink-600 mt-3 font-semibold">
            💝 您的支持是我们持续优化的动力！
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '#tutorial-button',
      content: (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            🔄 随时重新查看引导
          </h3>
          <p className="text-gray-700 mb-3">
            忘记怎么使用了？没问题！
          </p>
          <p className="text-sm text-gray-600">
            点击页面右上角的 <strong className="text-blue-600">"?" 按钮</strong>，随时可以重新打开这个新手引导。
          </p>
          <p className="text-sm text-green-600 mt-3 font-semibold">
            🎉 现在开始您的健身之旅吧！
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      // 教程完成或跳过
      onTourComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#3b82f6',
        },
        tooltip: {
          fontSize: '14px',
          borderRadius: '12px',
          padding: '20px',
        },
        tooltipTitle: {
          fontSize: '20px',
          fontWeight: 'bold',
        },
        tooltipContent: {
          padding: '10px 0',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          padding: '10px 20px',
        },
        buttonBack: {
          color: '#3b82f6',
          borderRadius: '8px',
          padding: '10px 20px',
        },
        buttonSkip: {
          color: '#6b7280',
          borderRadius: '8px',
        },
      }}
      locale={{
        back: '上一步',
        close: '关闭',
        last: '完成',
        next: '下一步',
        open: '打开引导',
        skip: '跳过引导',
      }}
    />
  );
}
