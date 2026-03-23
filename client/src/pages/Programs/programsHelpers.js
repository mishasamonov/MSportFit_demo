const GOAL_MAP = {
  BULK: 'Набір маси',
  CUT: 'Схуднення',
};

const LEVEL_MAP = {
  BEGINNER: 'Початковий',
  INTERMEDIATE: 'Середній',
};

const SCHEDULE_OPTIONS = {
  2: ['Пн / Чт', 'Вт / Сб'],
  3: ['Пн / Ср / Пт', 'Вт / Чт / Сб'],
  4: ['Пн / Вт / Чт / Пт', 'Вт / Ср / Пт / Сб'],
};

export function mapGoal(goal) {
  return GOAL_MAP[goal] ?? goal;
}

export function mapLevel(level) {
  return LEVEL_MAP[level] ?? level;
}

export function formatMeta(goal, level, weeks) {
  return `Мета: ${mapGoal(goal)} | Рівень: ${mapLevel(level)} | Тривалість: ${weeks} тижн.`;
}

export function getScheduleOptions(daysPerWeek) {
  return SCHEDULE_OPTIONS[daysPerWeek] ?? [];
}
