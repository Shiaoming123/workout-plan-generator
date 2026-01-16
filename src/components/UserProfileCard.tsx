import { UserProfile } from '../types';

interface UserProfileCardProps {
  profile: UserProfile;
}

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  // 获取目标标签
  const goalLabels: Record<string, string> = {
    fat_loss: '减脂',
    muscle_gain: '增肌',
    fitness: '综合体能',
    general: '一般健身',
    strength: '力量提升',
    endurance: '耐力提升',
    rehabilitation: '康复训练',
  };

  // 获取经验标签
  const experienceLabels: Record<string, string> = {
    beginner: '新手',
    intermediate: '进阶',
    advanced: '高级',
  };

  // 获取地点标签
  const locationLabels: Record<string, string> = {
    home: '家里',
    gym: '健身房',
    outdoor: '户外',
  };

  // 获取训练周期标签
  const periodLabels: Record<string, string> = {
    week: '周计划',
    month: '月计划',
    quarter: '季度计划',
    custom: `自定义${profile.customWeeks || 8}周`,
  };

  // 获取器械标签
  const equipmentLabels: Record<string, string> = {
    none: '徒手',
    dumbbells: '哑铃',
    barbell: '杠铃',
    kettlebell: '壶铃',
    resistance_bands: '弹力带',
    full_gym: '全套器械',
  };

  // 获取时长显示
  const getSessionDisplay = () => {
    if (profile.customSessionMinutes) {
      return `${profile.customSessionMinutes}分钟`;
    }
    return `${profile.sessionMinutes}分钟`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-card p-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">个人信息与目标</h3>
            <p className="text-sm text-gray-600">训练参数配置</p>
          </div>
        </div>
      </div>

      {/* 基本信息网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* 基本信息 */}
        <InfoItem label="性别" value={profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'} icon="👤" />
        <InfoItem label="年龄" value={`${profile.age}岁`} icon="🎂" />
        <InfoItem label="身高" value={`${profile.height}cm`} icon="📏" />
        <InfoItem label="体重" value={`${profile.weight}kg`} icon="⚖️" />

        {/* 训练目标 */}
        <InfoItem label="目标" value={goalLabels[profile.goal] || profile.goal} icon="🎯" color="blue" />
        <InfoItem label="经验" value={experienceLabels[profile.experience]} icon="⭐" />

        {/* 训练配置 */}
        <InfoItem label="周期" value={periodLabels[profile.period]} icon="📅" color="purple" />
        <InfoItem label="频率" value={`${profile.daysPerWeek}天/周`} icon="🔄" />
        <InfoItem label="时长" value={getSessionDisplay()} icon="⏱️" />

        {/* 训练环境 */}
        <InfoItem label="地点" value={locationLabels[profile.location]} icon="🏠" />
        <InfoItem label="器械" value={profile.equipment.map(e => equipmentLabels[e] || e).join('、')} icon="🏋️" />

        {/* AI 配置 */}
        <InfoItem label="AI模型" value={profile.aiModel === 'deepseek-chat' ? 'DeepSeek Chat' : 'DeepSeek Reasoner'} icon="🤖" color="indigo" />
      </div>

      {/* 约束条件 */}
      {profile.constraints.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-lg flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <div className="font-semibold text-sm text-yellow-900 mb-1">身体限制</div>
              <div className="flex flex-wrap gap-2">
                {profile.constraints.map((constraint) => {
                  const constraintLabels: Record<string, string> = {
                    knee_issue: '膝盖问题',
                    back_issue: '背部问题',
                    shoulder_issue: '肩膀问题',
                    postpartum: '产后恢复',
                    hypertension: '高血压',
                    other: '其他',
                  };
                  return (
                    <span key={constraint} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {constraintLabels[constraint] || constraint}
                    </span>
                  );
                })}
              </div>
              {profile.constraintNotes && (
                <div className="mt-2 text-xs text-yellow-800">{profile.constraintNotes}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 备注信息 */}
      {(profile.goalNotes || profile.experienceNotes || profile.equipmentNotes || profile.preferencesNotes) && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="font-semibold text-sm text-gray-900 mb-2">📝 备注</div>
          <div className="space-y-1 text-xs text-gray-600">
            {profile.goalNotes && <div>• 目标备注：{profile.goalNotes}</div>}
            {profile.experienceNotes && <div>• 经验备注：{profile.experienceNotes}</div>}
            {profile.equipmentNotes && <div>• 器械备注：{profile.equipmentNotes}</div>}
            {profile.preferencesNotes && <div>• 偏好备注：{profile.preferencesNotes}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// 信息项组件
function InfoItem({
  label,
  value,
  icon,
  color = 'gray'
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: 'gray' | 'blue' | 'purple' | 'indigo';
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-[10px] text-gray-600 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="font-semibold text-sm text-center leading-tight">{value}</div>
    </div>
  );
}
