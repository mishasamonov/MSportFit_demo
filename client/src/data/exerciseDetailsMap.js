const EXERCISE_DETAILS_MAP = {
  'incline-dumbbell-press': {
    slug: 'incline-dumbbell-press',
    title: 'Жим гантелей на похилій лаві',
    category: 'Груди',
    muscleGroup: 'Груди, передня дельта, трицепс',
    level: 'Середній',
    equipment: 'Гантелі',
    description:
      'Базова вправа для розвитку верхньої частини грудних м\u2019язів із залученням передніх дельтоїдів та трицепсів.',
    alternatives: {
      gym: ['Жим у Сміті на похилій лаві'],
      home: ['Віджимання з ногами на підвищенні'],
    },
  },
  'pec-deck-fly': {
    slug: 'pec-deck-fly',
    title: 'Зведення рук у тренажері (бабочка)',
    category: 'Груди',
    muscleGroup: 'Груди',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для грудних м\u2019язів, що забезпечує стабільну амплітуду та контрольоване навантаження.',
    alternatives: {
      gym: ['Зведення рук у кросовері'],
      home: ['Віджимання широким хватом'],
    },
  },
  'reverse-grip-lat-pulldown': {
    slug: 'reverse-grip-lat-pulldown',
    title: 'Тяга верхнього блока зворотним хватом',
    category: 'Спина',
    muscleGroup: 'Найширші, біцепс',
    level: 'Середній',
    equipment: 'Тренажер',
    description:
      'Варіація тяги верхнього блока з акцентом на нижню частину найширших м\u2019язів та біцепси.',
    alternatives: {
      gym: ['Тяга верхнього блока вузьким нейтральним хватом'],
      home: ['Підтягування зворотним хватом'],
    },
  },
  'cable-pullover': {
    slug: 'cable-pullover',
    title: 'Пуловер на верхньому блоці з канатною рукояткою',
    category: 'Спина',
    muscleGroup: 'Найширші, круглі м\u2019язи спини',
    level: 'Середній',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для найширших м\u2019язів спини, що мінімізує залучення біцепсів.',
    alternatives: {
      gym: ['Горизонтальна тяга в тренажері'],
      home: ['Пуловер з резиною зверху'],
    },
  },
  'seated-dumbbell-shoulder-press': {
    slug: 'seated-dumbbell-shoulder-press',
    title: 'Жим гантелей сидячи',
    category: 'Плечі',
    muscleGroup: 'Передня і середня дельта',
    level: 'Середній',
    equipment: 'Гантелі',
    description:
      'Базова вправа для розвитку дельтоїдних м\u2019язів із можливістю збільшення амплітуди руху порівняно зі штангою.',
    alternatives: {
      gym: ['Жим штанги сидячи'],
      home: ['Жим резини над головою'],
    },
  },
  'standing-dumbbell-lateral-raise': {
    slug: 'standing-dumbbell-lateral-raise',
    title: 'Махи з гантелями в сторони стоячи',
    category: 'Плечі',
    muscleGroup: 'Середня дельта',
    level: 'Початковий',
    equipment: 'Гантелі',
    description:
      'Ізольована вправа для середнього пучка дельтоїдного м\u2019яза, що формує ширину плечей.',
    alternatives: {
      gym: ['Махи в кросовері на середню дельту'],
      home: ['Махи з резиною в сторони'],
    },
  },
  'leg-press': {
    slug: 'leg-press',
    title: 'Жим ногами в тренажері',
    category: 'Ноги',
    muscleGroup: 'Квадрицепс, сідниці',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Базова вправа для розвитку м\u2019язів ніг у тренажері з мінімальним навантаженням на поперек.',
    alternatives: {
      gym: ['Випади з гантелями'],
      home: ['Присідання з рюкзаком'],
    },
  },
  'barbell-romanian-deadlift': {
    slug: 'barbell-romanian-deadlift',
    title: 'Румунська тяга',
    category: 'Ноги',
    muscleGroup: 'Біцепс стегна, сідниці, поперек-стабілізатори',
    level: 'Середній',
    equipment: 'Штанга',
    description:
      'Базова вправа для задньої поверхні стегна та сідниць з акцентом на розтягнення під навантаженням.',
    alternatives: {
      gym: ['Згинання ніг лежачи в тренажері'],
      home: ['Румунська тяга з резиною'],
    },
  },
  'dumbbell-supination-curl': {
    slug: 'dumbbell-supination-curl',
    title: 'Підйом гантелей на біцепс із супінацією',
    category: 'Руки',
    muscleGroup: 'Біцепс',
    level: 'Початковий',
    equipment: 'Гантелі',
    description:
      'Класична вправа для біцепса з обертанням кисті, що максимально активує обидві головки біцепса.',
    alternatives: {
      gym: ['Підйом штанги на біцепс'],
      home: ['Згинання рук з резиною прямим хватом'],
    },
  },
  'cable-bar-bicep-curl': {
    slug: 'cable-bar-bicep-curl',
    title: 'Згинання рук на нижньому блоці прямою рукояткою',
    category: 'Руки',
    muscleGroup: 'Біцепс',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для біцепса на блоці з постійним натягом по всій амплітуді руху.',
    alternatives: {
      gym: ['Згинання рук на нижньому блоці з канатною рукояткою'],
      home: ['Згинання рук з резиною молотковим хватом'],
    },
  },
  'seated-overhead-dumbbell-extension': {
    slug: 'seated-overhead-dumbbell-extension',
    title: 'Розгинання гантелі з-за голови сидячи',
    category: 'Руки',
    muscleGroup: 'Довга головка трицепса',
    level: 'Середній',
    equipment: 'Гантелі',
    description:
      'Вправа для трицепса з акцентом на довгу головку завдяки розтягненню м\u2019яза у верхній позиції.',
    alternatives: {
      gym: ['Розгинання рук над головою на верхньому блоці з канатом'],
      home: ['Розгинання рук з резиною над головою'],
    },
  },
  'cable-bar-pushdown': {
    slug: 'cable-bar-pushdown',
    title: 'Розгинання рук на верхньому блоці прямою рукояткою',
    category: 'Руки',
    muscleGroup: 'Трицепс',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для трицепса на верхньому блоці з акцентом на латеральну та медіальну головки.',
    alternatives: {
      gym: ['Розгинання рук на верхньому блоці з канатом'],
      home: ['Віджимання вузьким хватом'],
    },
  },
  'smith-machine-incline-press': {
    slug: 'smith-machine-incline-press',
    title: 'Жим у Сміті на похилій лаві',
    category: 'Груди',
    muscleGroup: 'Верх грудних, передня дельта, трицепс',
    level: 'Середній',
    equipment: 'Тренажер',
    description:
      'Варіація жиму на похилій лаві у Сміті для стабільнішої траєкторії та безпечного навантаження.',
    alternatives: {
      gym: ['Жим гантелей на похилій лаві'],
      home: ['Віджимання з резиною'],
    },
  },
  'cable-crossover-fly': {
    slug: 'cable-crossover-fly',
    title: 'Зведення рук у кросовері',
    category: 'Груди',
    muscleGroup: 'Груди',
    level: 'Середній',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для грудних м\u2019язів у кросовері з регульованим кутом і постійним натягом.',
    alternatives: {
      gym: ['Зведення рук у тренажері (бабочка)'],
      home: ['Зведення рук з резиною'],
    },
  },
  'wide-grip-lat-pulldown': {
    slug: 'wide-grip-lat-pulldown',
    title: 'Тяга верхнього блока прямим хватом',
    category: 'Спина',
    muscleGroup: 'Найширші, верх спини',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Базова вправа для розвитку найширших м\u2019язів спини та формування V-подібної фігури.',
    alternatives: {
      gym: ['Тяга верхнього блока зворотним хватом'],
      home: ['Підтягування прямим хватом'],
    },
  },
  'seated-cable-row': {
    slug: 'seated-cable-row',
    title: 'Тяга нижнього блока до живота',
    category: 'Спина',
    muscleGroup: 'Середина спини, найширші',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Горизонтальна тяга для товщини спини з акцентом на середній відділ трапецій та ромбоподібні м\u2019язи.',
    alternatives: {
      gym: ['Горизонтальна тяга в тренажері'],
      home: ['Тяга резини до поясу'],
    },
  },
  'cable-upright-row': {
    slug: 'cable-upright-row',
    title: 'Протяжка в кросовері з нижнього блока',
    category: 'Плечі',
    muscleGroup: 'Середня дельта, верх трапеції',
    level: 'Середній',
    equipment: 'Тренажер',
    description:
      'Вправа для розвитку середніх дельтоїдів та верхніх трапецій із плавним натягом блока.',
    alternatives: {
      gym: ['Махи в кросовері на середню дельту'],
      home: ['Тяга резини до підборіддя'],
    },
  },
  'bent-over-rear-delt-fly': {
    slug: 'bent-over-rear-delt-fly',
    title: 'Відведення гантелей у нахилі на задню дельту',
    category: 'Плечі',
    muscleGroup: 'Задня дельта',
    level: 'Середній',
    equipment: 'Гантелі',
    description:
      'Ізольована вправа для заднього пучка дельтоїдного м\u2019яза, важлива для балансу розвитку плечей.',
    alternatives: {
      gym: ['Face pull з канатною рукояткою в кросовері'],
      home: ['Face pull з резиною'],
    },
  },
  'leg-extension': {
    slug: 'leg-extension',
    title: 'Розгинання ніг у тренажері',
    category: 'Ноги',
    muscleGroup: 'Квадрицепс',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для чотириголового м\u2019яза стегна з контрольованим діапазоном руху.',
    alternatives: {
      gym: ['Жим ногами в тренажері'],
      home: ['Присідання з резиною на плечах'],
    },
  },
  'lying-leg-curl': {
    slug: 'lying-leg-curl',
    title: 'Згинання ніг лежачи в тренажері',
    category: 'Ноги',
    muscleGroup: 'Біцепс стегна',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для біцепса стегна в тренажері лежачи з максимальним скороченням м\u2019яза.',
    alternatives: {
      gym: ['Румунська тяга'],
      home: ['Випади з випригуванням'],
    },
  },
  'smith-machine-calf-raise': {
    slug: 'smith-machine-calf-raise',
    title: 'Підйоми на носки в Сміті з підставкою під стопи',
    category: 'Ноги',
    muscleGroup: 'Литкові м\u2019язи',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Вправа для розвитку литкових м\u2019язів у тренажері Сміта з повною амплітудою розтягнення.',
    alternatives: {
      gym: ['Підйоми на носки з гантеллю'],
      home: ['Підйоми на носки на сходинці на одній нозі'],
    },
  },
  'incline-dumbbell-curl': {
    slug: 'incline-dumbbell-curl',
    title: 'Підйом гантелей на похилій лаві на біцепс',
    category: 'Руки',
    muscleGroup: 'Біцепс',
    level: 'Середній',
    equipment: 'Гантелі',
    description:
      'Вправа на біцепс із збільшеним розтягненням довгої головки за рахунок відведення ліктів назад.',
    alternatives: {
      gym: ['Підйом гантелей на біцепс із супінацією'],
      home: ['Згинання рук з резиною прямим хватом'],
    },
  },
  'cable-rope-curl': {
    slug: 'cable-rope-curl',
    title: 'Згинання рук на нижньому блоці з канатною рукояткою',
    category: 'Руки',
    muscleGroup: 'Біцепс, плечовий м\u2019яз',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Вправа для біцепса та плечового м\u2019яза з нейтральним хватом і постійним натягом блока.',
    alternatives: {
      gym: ['Згинання рук на нижньому блоці прямою рукояткою'],
      home: ['Згинання рук з резиною молотковим хватом'],
    },
  },
  'smith-machine-close-grip-press': {
    slug: 'smith-machine-close-grip-press',
    title: 'Жим вузьким хватом у Сміті',
    category: 'Руки',
    muscleGroup: 'Трицепс',
    level: 'Середній',
    equipment: 'Тренажер',
    description:
      'Базова вправа для трицепса у Сміті з вузьким хватом, яка також залучає грудні та передні дельти.',
    alternatives: {
      gym: ['Віджимання на брусах'],
      home: ['Віджимання вузьким хватом'],
    },
  },
  'cable-rope-pushdown': {
    slug: 'cable-rope-pushdown',
    title: 'Розгинання рук на верхньому блоці з канатом',
    category: 'Руки',
    muscleGroup: 'Трицепс',
    level: 'Початковий',
    equipment: 'Тренажер',
    description:
      'Ізольована вправа для трицепса з канатною рукояткою, що дозволяє розводити руки в кінцевій точці.',
    alternatives: {
      gym: ['Розгинання рук на верхньому блоці прямою рукояткою'],
      home: ['Розгинання рук з резиною'],
    },
  },
};

const TITLE_TO_SLUG = Object.fromEntries(
  Object.values(EXERCISE_DETAILS_MAP).map((e) => [e.title.toLowerCase().trim(), e.slug]),
);

export function resolveExerciseSlug(name) {
  if (!name || typeof name !== 'string') return null;
  return TITLE_TO_SLUG[name.toLowerCase().trim()] ?? null;
}

export function getExerciseFallback(slug) {
  return EXERCISE_DETAILS_MAP[slug] ?? null;
}

export default EXERCISE_DETAILS_MAP;
