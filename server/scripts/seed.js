const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProducts() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`Products already exist (${count}), skipping seeding.`);
    return;
  }

  await prisma.product.createMany({
    data: [
      {
        title: 'Вівсянка',
        category: 'Крупи',
        calories: 350,
        protein: 12.5,
        fat: 7.0,
        carbs: 60.0,
      },
      {
        title: 'Куряче філе',
        category: 'Мʼясо',
        calories: 165,
        protein: 31.0,
        fat: 3.6,
        carbs: 0.0,
      },
      {
        title: 'Грецький йогурт',
        category: 'Молочні продукти',
        calories: 59,
        protein: 10.0,
        fat: 0.4,
        carbs: 3.6,
      },
    ],
  });

  console.log('Seeded products.');
}

async function seedExercises() {
  const count = await prisma.exercise.count();
  if (count > 0) {
    console.log(`Exercises already exist (${count}), skipping seeding.`);
    return;
  }

  await prisma.exercise.createMany({
    data: [
      {
        slug: 'bodyweight-squat',
        title: 'Присідання з власною вагою',
        category: 'Ноги',
        calories: 100,
        muscleGroup: 'Quadriceps, Glutes',
        level: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
        description:
          "Базова вправа для ніг та сідниць з власною вагою тіла. Розвиває квадрицепси, сідниці та м'язи-стабілізатори. Підходить для новачків і домашніх тренувань.",
        steps: [
          'Встань прямо, ноги на ширині плечей, носки злегка розвернуті назовні.',
          'На вдиху починай згинати коліна, відводячи таз назад і вниз.',
          'Опускайся до паралелі стегон з підлогою або нижче.',
          'Коліна тримай над носками, спину — рівною, грудну клітку — розкритою.',
          "На видиху відштовхнись п'ятами та повернись у вихідне положення.",
        ],
        tips: [
          "Тримай п'яти на підлозі протягом усього руху.",
          'Дивись прямо перед собою, щоб не округлювати спину.',
          "Для глибшого присідання пробуй підкласти під п'яти тонкий підйом.",
        ],
        mistakes: [
          "Відривання п'ят від підлоги.",
          'Округлення попереку в нижній точці.',
          'Завалювання колін всередину при підйомі.',
        ],
        alternatives: {
          home: ['Болгарське присідання на одній нозі', 'Присідання з пульсом'],
          outdoor: ['Присідання на лавці в парку', 'Стрибкові присідання'],
          band: ['Присідання з гумовою стрічкою на стегнах', 'Бічні кроки з гумою'],
        },
      },
      {
        slug: 'push-up',
        title: 'Віджимання від підлоги',
        category: 'Груди',
        calories: 80,
        muscleGroup: 'Chest, Triceps',
        level: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        description:
          'Класична вправа для верхньої частини тіла, що залучає груди, трицепси та плечі. Не потребує обладнання і може виконуватись будь-де.',
        steps: [
          "Прийми упор лежачи: долоні на ширині плечей, тіло — пряма лінія від голови до п'ят.",
          'На вдиху згинай руки в ліктях, опускаючи груди до підлоги.',
          'Лікті повинні йти назад під кутом 45°, а не розходитись в сторони.',
          'Торкнись грудьми підлоги або зупинись за 2–3 см до неї.',
          'На видиху відштовхнись долонями і повернись у вихідне положення.',
        ],
        tips: [
          'Напружуй прес і сідниці для стабільності тіла.',
          "Постав долоні трохи ширше плечей для зменшення навантаження на зап'ястя.",
          'Починай з віджимань з колін, якщо повні важкі.',
        ],
        mistakes: [
          'Провисання таза або підняття сідниць вгору.',
          'Постановка ліктів під кутом 90° до тіла — це навантажує плечовий суглоб.',
          'Неповний діапазон руху — груди мають торкатись або майже торкатись підлоги.',
        ],
        alternatives: {
          home: ['Алмазні віджимання (акцент на трицепс)', 'Широкі віджимання (акцент на груди)'],
          outdoor: ['Віджимання від лавки', 'Віджимання від бордюру'],
          band: ['Жим з гумовою стрічкою стоячи', 'Зведення рук з гумою'],
        },
      },
      {
        slug: 'plank',
        title: 'Планка',
        category: 'Кор',
        calories: 60,
        muscleGroup: 'Core',
        level: 'Intermediate',
        videoUrl: 'https://www.youtube.com/watch?v=BQu26ABuVS0',
        description:
          'Статична вправа для зміцнення кору, що утримує тіло в горизонтальному положенні. Залучає прес, спину, плечі та сідниці одночасно.',
        steps: [
          'Прийми упор на передпліччях: лікті під плечима, долоні паралельні.',
          "Підніми тіло на носках, тримаючи пряму лінію від голови до п'ят.",
          'Напружуй прес, стягуючи пупок до хребта.',
          'Не допускай провисання таза або підняття сідниць.',
          'Утримуй положення від 20 секунд і поступово збільшуй час.',
        ],
        tips: [
          'Дивись у підлогу між руками, щоб не перенапружувати шию.',
          'Дихай рівно — не затримуй дихання.',
          'Стисни кулаки для кращої стабілізації плечового поясу.',
        ],
        mistakes: [
          'Прогин у попереку — таз не повинен провисати.',
          'Підняття сідниць вгору — тіло має бути рівним.',
          'Затримка дихання протягом усього часу виконання.',
        ],
        alternatives: {
          home: ['Бічна планка', 'Планка з підйомом руки/ноги'],
          outdoor: ['Планка на лавці', 'Планка на піску'],
          band: ['Планка з відведенням ноги з гумою', 'Планка з тягою гуми однією рукою'],
        },
      },
    ],
  });

  console.log('Seeded exercises.');
}

// ─── Program helpers ────────────────────────────────────────────────────────
// Upper = Груди + Спина + Плечі
// Lower = Ноги + Руки (біцепс і трицепс)

const upperABulk = [
  {
    name: 'Жим штанги лежачи',
    exerciseSlug: 'barbell-bench-press',
    sets: 4,
    reps: '6-8',
    restSec: 150,
    notes: 'Груди — основна вправа',
    effort: 'Останній підхід: RIR 0-1',
  },
  {
    name: 'Тяга штанги в нахилі',
    exerciseSlug: 'barbell-row',
    sets: 4,
    reps: '6-8',
    restSec: 150,
    notes: 'Спина — основна вправа',
    effort: 'RIR 1-2',
  },
  {
    name: 'Підтягування широким хватом',
    exerciseSlug: 'wide-grip-pull-up',
    sets: 3,
    reps: '6-10',
    restSec: 90,
    notes: 'Якщо потрібно — з гумою',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим штанги стоячи над головою',
    exerciseSlug: 'barbell-overhead-press',
    sets: 3,
    reps: '6-8',
    restSec: 120,
    notes: 'Плечі — основна вправа',
    effort: 'RIR 1-2',
  },
  {
    name: 'Розведення гантелей через сторони',
    exerciseSlug: 'dumbbell-lateral-raise',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Середня дельта',
    effort: 'RIR 1',
  },
  {
    name: 'Зворотні розведення в нахилі',
    exerciseSlug: 'reverse-fly',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Задня дельта — аксесуар',
    effort: 'RIR 1',
  },
];

const upperBBulk = [
  {
    name: 'Жим гантелей на похилій лаві',
    exerciseSlug: 'incline-dumbbell-press',
    sets: 4,
    reps: '8-10',
    restSec: 90,
    notes: 'Груди — верхня частина',
    effort: 'RIR 1-2',
  },
  {
    name: 'Тяга гантелі однією рукою',
    exerciseSlug: 'single-arm-dumbbell-row',
    sets: 4,
    reps: '8-10',
    restSec: 90,
    notes: 'Спина — аксесуар',
    effort: 'RIR 1-2',
  },
  {
    name: 'Тяга верхнього блоку вузьким хватом',
    exerciseSlug: 'close-grip-lat-pulldown',
    sets: 3,
    reps: '8-12',
    restSec: 90,
    notes: 'Спина / широчайші',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим Арнольда сидячи',
    exerciseSlug: 'arnold-press',
    sets: 3,
    reps: '8-10',
    restSec: 90,
    notes: 'Плечі — варіативний жим',
    effort: 'RIR 1-2',
  },
  {
    name: 'Розведення гантелей через сторони',
    exerciseSlug: 'dumbbell-lateral-raise',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Середня дельта — аксесуар',
    effort: 'RIR 1',
  },
];

const lowerABulk = [
  {
    name: 'Присідання зі штангою на спині',
    exerciseSlug: 'barbell-back-squat',
    sets: 4,
    reps: '6-8',
    restSec: 180,
    notes: 'Ноги — основна вправа',
    effort: 'Останній підхід: RIR 0-1',
  },
  {
    name: 'Румунська тяга зі штангою',
    exerciseSlug: 'romanian-deadlift-barbell',
    sets: 3,
    reps: '8-10',
    restSec: 120,
    notes: 'Ноги / сідниці',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим ногами в тренажері',
    exerciseSlug: 'leg-press',
    sets: 3,
    reps: '10-12',
    restSec: 90,
    notes: 'Ноги — аксесуар',
    effort: 'RIR 1-2',
  },
  {
    name: 'Підйоми на носки стоячи',
    exerciseSlug: 'standing-calf-raise',
    sets: 4,
    reps: '12-15',
    restSec: 60,
    notes: 'Литкові',
    effort: 'RIR 1',
  },
  {
    name: 'Скручування на прес',
    exerciseSlug: 'crunch',
    sets: 3,
    reps: '15-20',
    restSec: 60,
    notes: 'Прес — аксесуар',
    effort: 'RIR 1',
  },
  {
    name: 'Підйом штанги на біцепс',
    exerciseSlug: 'barbell-curl',
    sets: 3,
    reps: '8-12',
    restSec: 60,
    notes: 'Руки — біцепс',
    effort: 'RIR 1-2',
  },
  {
    name: 'Розгинання рук на брусах',
    exerciseSlug: 'dip',
    sets: 3,
    reps: '8-12',
    restSec: 60,
    notes: 'Руки — трицепс',
    effort: 'RIR 1-2',
  },
];

const lowerBBulk = [
  {
    name: 'Фронтальне присідання',
    exerciseSlug: 'front-squat',
    sets: 4,
    reps: '6-8',
    restSec: 180,
    notes: 'Або гобле-присідання',
    effort: 'RIR 1-2',
  },
  {
    name: 'Румунська тяга на одній нозі',
    exerciseSlug: 'single-leg-romanian-deadlift',
    sets: 3,
    reps: '8-10/н',
    restSec: 90,
    notes: 'Ноги / сідниці — баланс',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим ногами вузькою постановкою',
    exerciseSlug: 'narrow-stance-leg-press',
    sets: 3,
    reps: '10-12',
    restSec: 90,
    notes: 'Акцент на квадрицепс',
    effort: 'RIR 1-2',
  },
  {
    name: 'Підйоми на носки сидячи',
    exerciseSlug: 'seated-calf-raise',
    sets: 4,
    reps: '15-20',
    restSec: 60,
    notes: "Камбалоподібний м'яз",
    effort: 'RIR 1',
  },
  {
    name: 'Планка',
    exerciseSlug: 'plank',
    sets: 3,
    reps: '45-60с',
    restSec: 60,
    notes: 'Прес — статика',
    effort: 'Утримуй максимально рівно',
  },
  {
    name: 'Молоткові згинання з гантелями',
    exerciseSlug: 'hammer-curl',
    sets: 3,
    reps: '10-12',
    restSec: 60,
    notes: 'Руки — біцепс + плечопром.',
    effort: 'RIR 1-2',
  },
  {
    name: 'Французький жим зі штангою',
    exerciseSlug: 'barbell-skull-crusher',
    sets: 3,
    reps: '8-12',
    restSec: 60,
    notes: 'Руки — трицепс',
    effort: 'RIR 1-2',
  },
];

const upperACut = [
  {
    name: 'Жим гантелей лежачи',
    exerciseSlug: 'dumbbell-bench-press',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Груди — основна вправа',
    effort: 'RIR 1-2',
  },
  {
    name: 'Тяга горизонтального блоку',
    exerciseSlug: 'seated-cable-row',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Спина — сидячи',
    effort: 'RIR 1-2',
  },
  {
    name: 'Тяга верхнього блоку широким хватом',
    exerciseSlug: 'wide-grip-lat-pulldown',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Спина / широчайні',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим гантелей над головою сидячи',
    exerciseSlug: 'seated-dumbbell-overhead-press',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Плечі — основна вправа',
    effort: 'RIR 1-2',
  },
  {
    name: 'Розведення гантелей через сторони',
    exerciseSlug: 'dumbbell-lateral-raise',
    sets: 3,
    reps: '15-20',
    restSec: 45,
    notes: 'Середня дельта',
    effort: 'RIR 1',
  },
];

const upperBCut = [
  {
    name: 'Жим гантелей на похилій лаві',
    exerciseSlug: 'incline-dumbbell-press',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Груди — верхня частина',
    effort: 'RIR 1-2',
  },
  {
    name: 'Тяга гантелі в нахилі',
    exerciseSlug: 'dumbbell-row',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Спина — аксесуар',
    effort: 'RIR 1-2',
  },
  {
    name: 'Австралійські підтягування',
    exerciseSlug: 'australian-pull-up',
    sets: 3,
    reps: '10-15',
    restSec: 60,
    notes: 'Або підтягування з гумою',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим Арнольда сидячи',
    exerciseSlug: 'arnold-press',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Плечі — варіативний жим',
    effort: 'RIR 1-2',
  },
  {
    name: 'Підйом гантелей через сторони',
    exerciseSlug: 'dumbbell-lateral-raise',
    sets: 3,
    reps: '15-20',
    restSec: 45,
    notes: 'Середня дельта — аксесуар',
    effort: 'RIR 1',
  },
];

const lowerACut = [
  {
    name: 'Гобле-присідання',
    exerciseSlug: 'goblet-squat',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Ноги — основна вправа',
    effort: 'RIR 1-2',
  },
  {
    name: 'Румунська тяга з гантелями',
    exerciseSlug: 'romanian-deadlift-dumbbell',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Ноги / сідниці',
    effort: 'RIR 1-2',
  },
  {
    name: 'Жим ногами в тренажері',
    exerciseSlug: 'leg-press',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Ноги — аксесуар',
    effort: 'RIR 1-2',
  },
  {
    name: 'Підйоми на носки стоячи',
    exerciseSlug: 'standing-calf-raise',
    sets: 3,
    reps: '20-25',
    restSec: 45,
    notes: 'Литкові',
    effort: 'RIR 1',
  },
  {
    name: 'Скручування на прес',
    exerciseSlug: 'crunch',
    sets: 3,
    reps: '15-20',
    restSec: 45,
    notes: 'Прес — аксесуар',
    effort: 'RIR 1',
  },
  {
    name: 'Підйом гантелей на біцепс',
    exerciseSlug: 'dumbbell-curl',
    sets: 3,
    reps: '12-15',
    restSec: 45,
    notes: 'Руки — біцепс',
    effort: 'RIR 1-2',
  },
  {
    name: 'Розгинання рук на блоці',
    exerciseSlug: 'cable-tricep-pushdown',
    sets: 3,
    reps: '12-15',
    restSec: 45,
    notes: 'Руки — трицепс',
    effort: 'RIR 1-2',
  },
];

const lowerBCut = [
  {
    name: 'Сумо-присідання з гантеллю',
    exerciseSlug: 'sumo-squat-dumbbell',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Ноги / внутрішня частина стегна',
    effort: 'RIR 1-2',
  },
  {
    name: 'Румунська тяга на одній нозі',
    exerciseSlug: 'single-leg-romanian-deadlift',
    sets: 3,
    reps: '12/н',
    restSec: 60,
    notes: 'Ноги / сідниці — баланс',
    effort: 'RIR 1-2',
  },
  {
    name: 'Зашагування на платформу',
    exerciseSlug: 'step-up',
    sets: 3,
    reps: '12/н',
    restSec: 60,
    notes: 'Ноги — аксесуар',
    effort: 'RIR 1-2',
  },
  {
    name: 'Підйоми на носки сидячи',
    exerciseSlug: 'seated-calf-raise',
    sets: 3,
    reps: '20-25',
    restSec: 45,
    notes: "Камбалоподібний м'яз",
    effort: 'RIR 1',
  },
  {
    name: 'Планка',
    exerciseSlug: 'plank',
    sets: 3,
    reps: '30-45с',
    restSec: 45,
    notes: 'Прес — статика',
    effort: 'Утримуй максимально рівно',
  },
  {
    name: 'Молоткові згинання з гантелями',
    exerciseSlug: 'hammer-curl',
    sets: 3,
    reps: '12-15',
    restSec: 45,
    notes: 'Руки — біцепс + плечопром.',
    effort: 'RIR 1-2',
  },
  {
    name: 'Відтягування верхнього блоку',
    exerciseSlug: 'cable-tricep-pushdown',
    sets: 3,
    reps: '12-15',
    restSec: 45,
    notes: 'Руки — трицепс',
    effort: 'RIR 1-2',
  },
];

const cardioGuidelinesCut = {
  stepsPerDay: '8–12 тис. кроків щодня',
  sessionsPerWeek: '2–4 рази/тиждень',
  sessionDuration: '20–40 хв',
  intensity: 'помірна (зона 2)',
  note: 'Кардіо роби після силового або в окремі дні',
};

function buildDays(upperA, lowerA, upperB, lowerB, cardioGuidelines) {
  const variants = {
    2: [
      { day: 1, title: 'Верх (Груди + Спина + Плечі)', exercises: upperA },
      { day: 2, title: 'Низ (Ноги + Руки)', exercises: lowerA },
    ],
    3: {
      note: 'Чергуй тижні A/B',
      weekA: [
        { day: 1, title: 'Верх А (Груди + Спина + Плечі)', exercises: upperA },
        { day: 2, title: 'Низ А (Ноги + Руки)', exercises: lowerA },
        { day: 3, title: 'Верх Б (Груди + Спина + Плечі)', exercises: upperB },
      ],
      weekB: [
        { day: 1, title: 'Низ А (Ноги + Руки)', exercises: lowerA },
        { day: 2, title: 'Верх Б (Груди + Спина + Плечі)', exercises: upperB },
        { day: 3, title: 'Низ Б (Ноги + Руки)', exercises: lowerB },
      ],
    },
    4: [
      { day: 1, title: 'Верх А (Груди + Спина + Плечі)', exercises: upperA },
      { day: 2, title: 'Низ А (Ноги + Руки)', exercises: lowerA },
      { day: 3, title: 'Верх Б (Груди + Спина + Плечі)', exercises: upperB },
      { day: 4, title: 'Низ Б (Ноги + Руки)', exercises: lowerB },
    ],
  };

  return cardioGuidelines ? { variants, cardioGuidelines } : { variants };
}

async function seedPrograms() {
  const count = await prisma.program.count();
  if (count > 0) {
    console.log(`Programs already exist (${count}), skipping seeding.`);
    return;
  }

  await prisma.program.createMany({
    data: [
      {
        slug: 'upper-lower-bulk',
        title: "Upper/Lower — Набір м'язів",
        description:
          "Класична схема верх/низ для максимального набору м'язової маси. 8 тижнів прогресивного навантаження з варіантами на 2, 3 або 4 тренування на тиждень.",
        goal: 'BULK',
        level: 'BEGINNER',
        weeks: 8,
        days: buildDays(upperABulk, lowerABulk, upperBBulk, lowerBBulk),
      },
      {
        slug: 'upper-lower-cut',
        title: 'Upper/Lower — Схуднення',
        description:
          'Схема верх/низ з акцентом на жироспалювання: вищий діапазон повторень, коротший відпочинок. 8 тижнів для рельєфу з варіантами на 2, 3 або 4 тренування на тиждень.',
        goal: 'CUT',
        level: 'BEGINNER',
        weeks: 8,
        days: buildDays(upperACut, lowerACut, upperBCut, lowerBCut, cardioGuidelinesCut),
      },
    ],
  });

  console.log('Seeded programs.');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  try {
    await seedProducts();
    await seedExercises();
    await seedPrograms();
  } catch (err) {
    console.error('Seed error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
