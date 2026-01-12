import {
  UserProfile,
  TrainingPlan,
  WeekPlan,
  MonthPlan,
  WorkoutSession,
  WorkoutSet,
  Exercise,
} from '../types';
import {
  allExercises,
  warmupExercises,
  upperStrengthExercises,
  lowerStrengthExercises,
  coreStrengthExercises,
  cardioExercises,
  hiitExercises,
  stretchExercises,
  getAvailableExercises,
} from '../data/exercises';
import {
  goalTemplates,
  experienceModifiers,
  getTrainingSplit,
  getSafetyNotes,
  monthlyProgression,
  quarterlyProgression,
} from '../data/templates';

/**
 * 主生成函数：根据用户输入生成训练计划
 */
export function generatePlan(profile: UserProfile): TrainingPlan {
  const { period } = profile;

  const summary = generateSummary(profile);

  if (period === 'week') {
    const weekPlan = generateWeekPlan(profile, 1, 1.0);
    return {
      period: 'week',
      summary,
      weeks: [weekPlan],
      generatedAt: new Date().toISOString(),
    };
  }

  if (period === 'month') {
    const weeks = monthlyProgression.map((prog) =>
      generateWeekPlan(profile, prog.weekNumber, prog.volumeMultiplier)
    );
    return {
      period: 'month',
      summary,
      weeks,
      generatedAt: new Date().toISOString(),
    };
  }

  if (period === 'quarter') {
    const months = quarterlyProgression.map((monthProg) => {
      const weeks = monthlyProgression.map((weekProg) =>
        generateWeekPlan(
          profile,
          weekProg.weekNumber,
          weekProg.volumeMultiplier * monthProg.volumeMultiplier
        )
      );

      const monthPlan: MonthPlan = {
        monthNumber: monthProg.monthNumber,
        monthName: monthProg.phaseNoteZh,
        weeks,
        notes: monthProg.phaseNote,
      };
      return monthPlan;
    });

    return {
      period: 'quarter',
      summary,
      months,
      generatedAt: new Date().toISOString(),
    };
  }

  throw new Error('Invalid period type');
}

/**
 * 生成计划摘要
 */
function generateSummary(profile: UserProfile) {
  const goalTemplate = goalTemplates[profile.goal];
  const totalWeeks =
    profile.period === 'week' ? 1 : profile.period === 'month' ? 4 : 12;

  return {
    goal: goalTemplate.description,
    goalZh: goalTemplate.descriptionZh,
    daysPerWeek: profile.daysPerWeek,
    sessionMinutes: profile.sessionMinutes,
    totalWeeks,
    phaseDescription: `${profile.daysPerWeek}天/周，每次${profile.sessionMinutes}分钟，${goalTemplate.descriptionZh}`,
    safetyNotes: getSafetyNotes(profile.constraints),
  };
}

/**
 * 生成单周计划
 */
function generateWeekPlan(
  profile: UserProfile,
  weekNumber: number,
  volumeMultiplier: number
): WeekPlan {
  const split = getTrainingSplit(profile.daysPerWeek);
  const sessions: WorkoutSession[] = [];

  for (let i = 0; i < profile.daysPerWeek; i++) {
    const dayFocus = split.splitPatternZh[i];
    const session = generateWorkoutSession(
      profile,
      i + 1,
      dayFocus,
      volumeMultiplier
    );
    sessions.push(session);
  }

  const weekNote = monthlyProgression.find((p) => p.weekNumber === weekNumber);

  return {
    weekNumber,
    weekName: weekNote ? weekNote.intensityNoteZh : `第${weekNumber}周`,
    sessions,
    notes: weekNote?.intensityNote,
  };
}

/**
 * 生成单次训练
 */
function generateWorkoutSession(
  profile: UserProfile,
  dayNumber: number,
  focus: string,
  volumeMultiplier: number
): WorkoutSession {
  const goalTemplate = goalTemplates[profile.goal];
  const expModifier = experienceModifiers[profile.experience];

  const availableEquipment = profile.equipment;
  const constraints = profile.constraints;

  const warmup = generateWarmup(
    availableEquipment,
    constraints
  );
  const main = generateMainWork(
    profile,
    focus,
    goalTemplate,
    expModifier,
    volumeMultiplier
  );
  const accessory = generateAccessory(
    profile,
    expModifier,
    volumeMultiplier
  );
  const cooldown = generateCooldown(
    availableEquipment,
    constraints
  );

  return {
    dayNumber,
    dayName: `Day ${dayNumber} - ${focus}`,
    focus,
    totalMinutes: profile.sessionMinutes,
    phases: {
      warmup,
      main,
      accessory,
      cooldown,
    },
    notes: `根据${focus}重点设计`,
  };
}

/**
 * 生成热身部分
 */
function generateWarmup(
  availableEquipment: string[],
  constraints: string[]
): WorkoutSet[] {
  const available = getAvailableExercises(
    warmupExercises,
    availableEquipment,
    constraints
  );

  const selected = selectRandom(available, 3);

  return selected.map((ex) => ({
    exerciseId: ex.id,
    duration: 60,
    restSec: 0,
    notes: '动态热身',
  }));
}

/**
 * 生成主训练部分
 */
function generateMainWork(
  profile: UserProfile,
  focus: string,
  goalTemplate: any,
  expModifier: any,
  volumeMultiplier: number
): WorkoutSet[] {
  const { equipment, constraints } = profile;
  const sets: WorkoutSet[] = [];

  if (focus.includes('上肢') || focus.includes('推') || focus.includes('拉')) {
    const upperExercises = getAvailableExercises(
      upperStrengthExercises,
      equipment,
      constraints
    );
    const selected = selectRandom(upperExercises, 3);
    selected.forEach((ex) => {
      sets.push(
        createStrengthSet(ex, expModifier, volumeMultiplier, profile.goal)
      );
    });
  }

  if (focus.includes('下肢') || focus.includes('腿')) {
    const lowerExercises = getAvailableExercises(
      lowerStrengthExercises,
      equipment,
      constraints
    );
    const selected = selectRandom(lowerExercises, 3);
    selected.forEach((ex) => {
      sets.push(
        createStrengthSet(ex, expModifier, volumeMultiplier, profile.goal)
      );
    });
  }

  if (focus.includes('全身')) {
    const upperExercises = getAvailableExercises(
      upperStrengthExercises,
      equipment,
      constraints
    );
    const lowerExercises = getAvailableExercises(
      lowerStrengthExercises,
      equipment,
      constraints
    );
    const upper = selectRandom(upperExercises, 2);
    const lower = selectRandom(lowerExercises, 2);
    [...upper, ...lower].forEach((ex) => {
      sets.push(
        createStrengthSet(ex, expModifier, volumeMultiplier, profile.goal)
      );
    });
  }

  if (goalTemplate.cardioRatio > 0.2) {
    const cardioAvailable = getAvailableExercises(
      cardioExercises,
      equipment,
      constraints
    );
    const cardio = selectRandom(cardioAvailable, 1);
    cardio.forEach((ex) => {
      sets.push({
        exerciseId: ex.id,
        duration: Math.round(300 * volumeMultiplier),
        restSec: 60,
        rpe: 7,
        notes: '中等强度有氧',
      });
    });
  }

  if (goalTemplate.hiitRatio > 0.1) {
    const hiitAvailable = getAvailableExercises(
      hiitExercises,
      equipment,
      constraints
    );
    if (hiitAvailable.length > 0) {
      const hiit = selectRandom(hiitAvailable, 1);
      hiit.forEach((ex) => {
        sets.push({
          exerciseId: ex.id,
          sets: Math.round(3 * volumeMultiplier),
          duration: 30,
          restSec: 30,
          rpe: 8,
          notes: 'HIIT间歇',
        });
      });
    }
  }

  return sets;
}

/**
 * 生成辅助训练
 */
function generateAccessory(
  profile: UserProfile,
  expModifier: any,
  volumeMultiplier: number
): WorkoutSet[] {
  const { equipment, constraints } = profile;
  const coreAvailable = getAvailableExercises(
    coreStrengthExercises,
    equipment,
    constraints
  );

  const selected = selectRandom(coreAvailable, 2);

  return selected.map((ex) => ({
    exerciseId: ex.id,
    sets: Math.round(3 * volumeMultiplier * expModifier.volumeMultiplier),
    reps: ex.id.includes('plank') ? undefined : 12,
    duration: ex.id.includes('plank') ? 45 : undefined,
    restSec: Math.round(45 * expModifier.restMultiplier),
    notes: '核心辅助',
  }));
}

/**
 * 生成放松拉伸
 */
function generateCooldown(
  availableEquipment: string[],
  constraints: string[]
): WorkoutSet[] {
  const available = getAvailableExercises(
    stretchExercises,
    availableEquipment,
    constraints
  );

  const selected = selectRandom(available, 4);

  return selected.map((ex) => ({
    exerciseId: ex.id,
    duration: 45,
    restSec: 0,
    notes: '静态拉伸',
  }));
}

/**
 * 创建力量训练组
 */
function createStrengthSet(
  exercise: Exercise,
  expModifier: any,
  volumeMultiplier: number,
  goal: string
): WorkoutSet {
  const baseSets = goal === 'muscle_gain' ? 4 : 3;
  const baseReps = goal === 'muscle_gain' ? '8-10' : '10-12';

  return {
    exerciseId: exercise.id,
    sets: Math.round(baseSets * volumeMultiplier * expModifier.volumeMultiplier),
    reps: baseReps,
    restSec: Math.round(90 * expModifier.restMultiplier),
    rpe: expModifier.intensityLevel === 'high' ? 8 : 7,
    notes: '控制节奏',
  };
}

/**
 * 随机选择动作（避免重复）
 */
function selectRandom<T>(array: T[], count: number): T[] {
  if (array.length === 0) return [];
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * 根据ID查找动作
 */
export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find((ex) => ex.id === id);
}
