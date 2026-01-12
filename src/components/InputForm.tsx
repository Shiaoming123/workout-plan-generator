import { useState } from 'react';
import { UserProfile } from '../types';

interface InputFormProps {
  onGenerate: (profile: UserProfile) => void;
}

export default function InputForm({ onGenerate }: InputFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    goal: 'general',
    gender: 'prefer_not_to_say',
    age: 30,
    height: 170,
    weight: 70,
    experience: 'beginner',
    daysPerWeek: 3,
    sessionMinutes: 45,
    location: 'home',
    equipment: ['none'],
    constraints: [],
    constraintNotes: '',
    likes: [],
    dislikes: [],
    period: 'week',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfile(profile);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    onGenerate(profile);
  };

  const validateProfile = (p: UserProfile): string[] => {
    const errs: string[] = [];
    if (p.age < 10 || p.age > 100) errs.push('年龄应在10-100之间');
    if (p.height < 100 || p.height > 250) errs.push('身高应在100-250cm之间');
    if (p.weight < 30 || p.weight > 300) errs.push('体重应在30-300kg之间');
    if (p.equipment.length === 0) errs.push('请至少选择一种器械选项');
    return errs;
  };

  const updateField = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = <K extends keyof UserProfile>(
    field: K,
    value: string
  ) => {
    setProfile((prev) => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 print:hidden"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">个人信息与目标</h2>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-semibold text-red-800 mb-2">请修正以下错误：</p>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 训练目标 */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          训练目标 <span className="text-red-500">*</span>
        </label>
        <select
          value={profile.goal}
          onChange={(e) => updateField('goal', e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="fat_loss">减脂</option>
          <option value="muscle_gain">增肌</option>
          <option value="fitness">体能提升</option>
          <option value="rehab">康复</option>
          <option value="general">综合健康</option>
        </select>
      </div>

      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">性别</label>
          <select
            value={profile.gender}
            onChange={(e) => updateField('gender', e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
            <option value="prefer_not_to_say">不透露</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            年龄 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => updateField('age', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            身高 (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={profile.height}
            onChange={(e) => updateField('height', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            体重 (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={profile.weight}
            onChange={(e) => updateField('weight', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 训练经验 */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          训练经验 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {[
            { value: 'beginner', label: '新手' },
            { value: 'intermediate', label: '进阶' },
            { value: 'advanced', label: '老手' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="experience"
                value={opt.value}
                checked={profile.experience === opt.value}
                onChange={(e) => updateField('experience', e.target.value as any)}
                className="mr-2"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 训练频率 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            每周训练天数 <span className="text-red-500">*</span>
          </label>
          <select
            value={profile.daysPerWeek}
            onChange={(e) => updateField('daysPerWeek', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}天
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            每次时长 (分钟) <span className="text-red-500">*</span>
          </label>
          <select
            value={profile.sessionMinutes}
            onChange={(e) =>
              updateField('sessionMinutes', parseInt(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[20, 30, 45, 60, 90].map((n) => (
              <option key={n} value={n}>
                {n}分钟
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 训练场地与器械 */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          训练场地 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {[
            { value: 'home', label: '家' },
            { value: 'gym', label: '健身房' },
            { value: 'outdoor', label: '户外' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="location"
                value={opt.value}
                checked={profile.location === opt.value}
                onChange={(e) => updateField('location', e.target.value as any)}
                className="mr-2"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          可用器械 (多选) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'none', label: '无器械' },
            { value: 'dumbbells', label: '哑铃' },
            { value: 'barbell', label: '杠铃' },
            { value: 'kettlebell', label: '壶铃' },
            { value: 'resistance_bands', label: '弹力带' },
            { value: 'full_gym', label: '器械齐全' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.equipment.includes(opt.value as any)}
                onChange={() => toggleArrayItem('equipment', opt.value)}
                className="mr-2"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 身体限制 */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          身体限制 (多选)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'knee_issue', label: '膝盖不适' },
            { value: 'back_issue', label: '腰背不适' },
            { value: 'shoulder_issue', label: '肩部不适' },
            { value: 'postpartum', label: '产后恢复' },
            { value: 'hypertension', label: '高血压' },
            { value: 'other', label: '其他' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.constraints.includes(opt.value as any)}
                onChange={() => toggleArrayItem('constraints', opt.value)}
                className="mr-2"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {profile.constraints.includes('other' as any) && (
          <textarea
            value={profile.constraintNotes}
            onChange={(e) => updateField('constraintNotes', e.target.value)}
            placeholder="请描述其他身体限制..."
            className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        )}
      </div>

      {/* 计划周期 */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          计划周期 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {[
            { value: 'week', label: '周 (1周)' },
            { value: 'month', label: '月 (4周)' },
            { value: 'quarter', label: '季度 (12周)' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="period"
                value={opt.value}
                checked={profile.period === opt.value}
                onChange={(e) => updateField('period', e.target.value as any)}
                className="mr-2"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        生成训练计划
      </button>
    </form>
  );
}
