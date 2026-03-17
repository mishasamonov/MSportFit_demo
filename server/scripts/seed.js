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
        title: 'Присідання з власною вагою',
        category: 'Ноги',
        calories: 100,
        muscleGroup: 'Quadriceps, Glutes',
        level: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
      },
      {
        title: 'Віджимання від підлоги',
        category: 'Груди',
        calories: 80,
        muscleGroup: 'Chest, Triceps',
        level: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
      },
      {
        title: 'Планка',
        category: 'Кор',
        calories: 60,
        muscleGroup: 'Core',
        level: 'Intermediate',
        videoUrl: 'https://www.youtube.com/watch?v=BQu26ABuVS0',
      },
    ],
  });

  console.log('Seeded exercises.');
}

// ─── Program helpers ────────────────────────────────────────────────────────
// Upper = Груди + Спина + Плечі
// Lower = Ноги + Руки (біцепс і трицепс)

const upperABulk = [
  { name: 'Жим штанги лежачи',               sets: 4, reps: '6-8',   restSec: 150, notes: 'Груди — основна вправа',       effort: 'Останній підхід: RIR 0-1' },
  { name: 'Тяга штанги в нахилі',             sets: 4, reps: '6-8',   restSec: 150, notes: 'Спина — основна вправа',       effort: 'RIR 1-2' },
  { name: 'Підтягування широким хватом',       sets: 3, reps: '6-10',  restSec: 90,  notes: 'Якщо потрібно — з гумою',     effort: 'RIR 1-2' },
  { name: 'Жим штанги стоячи над головою',     sets: 3, reps: '6-8',   restSec: 120, notes: 'Плечі — основна вправа',      effort: 'RIR 1-2' },
  { name: 'Розведення гантелей через сторони', sets: 3, reps: '12-15', restSec: 60,  notes: 'Середня дельта',               effort: 'RIR 1' },
  { name: 'Зворотні розведення в нахилі',      sets: 3, reps: '12-15', restSec: 60,  notes: 'Задня дельта — аксесуар',     effort: 'RIR 1' },
];

const upperBBulk = [
  { name: 'Жим гантелей на похилій лаві',     sets: 4, reps: '8-10',  restSec: 90,  notes: 'Груди — верхня частина',      effort: 'RIR 1-2' },
  { name: 'Тяга гантелі однією рукою',         sets: 4, reps: '8-10',  restSec: 90,  notes: 'Спина — аксесуар',            effort: 'RIR 1-2' },
  { name: 'Тяга верхнього блоку вузьким хватом', sets: 3, reps: '8-12', restSec: 90, notes: 'Спина / широчайші',           effort: 'RIR 1-2' },
  { name: 'Жим Арнольда сидячи',              sets: 3, reps: '8-10',  restSec: 90,  notes: 'Плечі — варіативний жим',     effort: 'RIR 1-2' },
  { name: 'Розведення гантелей через сторони', sets: 3, reps: '12-15', restSec: 60,  notes: 'Середня дельта — аксесуар',  effort: 'RIR 1' },
];

const lowerABulk = [
  { name: 'Присідання зі штангою на спині',   sets: 4, reps: '6-8',   restSec: 180, notes: 'Ноги — основна вправа',       effort: 'Останній підхід: RIR 0-1' },
  { name: 'Румунська тяга зі штангою',         sets: 3, reps: '8-10',  restSec: 120, notes: 'Ноги / сідниці',              effort: 'RIR 1-2' },
  { name: 'Жим ногами в тренажері',            sets: 3, reps: '10-12', restSec: 90,  notes: 'Ноги — аксесуар',            effort: 'RIR 1-2' },
  { name: 'Підйоми на носки стоячи',           sets: 4, reps: '12-15', restSec: 60,  notes: 'Литкові',                    effort: 'RIR 1' },
  { name: 'Скручування на прес',               sets: 3, reps: '15-20', restSec: 60,  notes: 'Прес — аксесуар',            effort: 'RIR 1' },
  { name: 'Підйом штанги на біцепс',           sets: 3, reps: '8-12',  restSec: 60,  notes: 'Руки — біцепс',              effort: 'RIR 1-2' },
  { name: 'Розгинання рук на брусах',          sets: 3, reps: '8-12',  restSec: 60,  notes: 'Руки — трицепс',             effort: 'RIR 1-2' },
];

const lowerBBulk = [
  { name: 'Фронтальне присідання',             sets: 4, reps: '6-8',   restSec: 180, notes: 'Або гобле-присідання',       effort: 'RIR 1-2' },
  { name: 'Румунська тяга на одній нозі',       sets: 3, reps: '8-10/н', restSec: 90, notes: 'Ноги / сідниці — баланс',   effort: 'RIR 1-2' },
  { name: 'Жим ногами вузькою постановкою',     sets: 3, reps: '10-12', restSec: 90,  notes: 'Акцент на квадрицепс',      effort: 'RIR 1-2' },
  { name: 'Підйоми на носки сидячи',           sets: 4, reps: '15-20', restSec: 60,  notes: 'Камбалоподібний м\'яз',     effort: 'RIR 1' },
  { name: 'Планка',                            sets: 3, reps: '45-60с', restSec: 60, notes: 'Прес — статика',            effort: 'Утримуй максимально рівно' },
  { name: 'Молоткові згинання з гантелями',    sets: 3, reps: '10-12', restSec: 60,  notes: 'Руки — біцепс + плечопром.',effort: 'RIR 1-2' },
  { name: 'Французький жим зі штангою',        sets: 3, reps: '8-12',  restSec: 60,  notes: 'Руки — трицепс',             effort: 'RIR 1-2' },
];

const upperACut = [
  { name: 'Жим гантелей лежачи',               sets: 3, reps: '12-15', restSec: 60,  notes: 'Груди — основна вправа',    effort: 'RIR 1-2' },
  { name: 'Тяга горизонтального блоку',         sets: 3, reps: '12-15', restSec: 60,  notes: 'Спина — сидячи',           effort: 'RIR 1-2' },
  { name: 'Тяга верхнього блоку широким хватом',sets: 3, reps: '12-15', restSec: 60,  notes: 'Спина / широчайні',        effort: 'RIR 1-2' },
  { name: 'Жим гантелей над головою сидячи',    sets: 3, reps: '12-15', restSec: 60,  notes: 'Плечі — основна вправа',   effort: 'RIR 1-2' },
  { name: 'Розведення гантелей через сторони',  sets: 3, reps: '15-20', restSec: 45,  notes: 'Середня дельта',           effort: 'RIR 1' },
];

const upperBCut = [
  { name: 'Жим гантелей на похилій лаві',       sets: 3, reps: '12-15', restSec: 60,  notes: 'Груди — верхня частина',   effort: 'RIR 1-2' },
  { name: 'Тяга гантелі в нахилі',              sets: 3, reps: '12-15', restSec: 60,  notes: 'Спина — аксесуар',         effort: 'RIR 1-2' },
  { name: 'Австралійські підтягування',          sets: 3, reps: '10-15', restSec: 60,  notes: 'Або підтягування з гумою', effort: 'RIR 1-2' },
  { name: 'Жим Арнольда сидячи',                sets: 3, reps: '12-15', restSec: 60,  notes: 'Плечі — варіативний жим',  effort: 'RIR 1-2' },
  { name: 'Підйом гантелей через сторони',       sets: 3, reps: '15-20', restSec: 45,  notes: 'Середня дельта — аксесуар',effort: 'RIR 1' },
];

const lowerACut = [
  { name: 'Гобле-присідання',                   sets: 3, reps: '12-15', restSec: 60,  notes: 'Ноги — основна вправа',    effort: 'RIR 1-2' },
  { name: 'Румунська тяга з гантелями',          sets: 3, reps: '12-15', restSec: 60,  notes: 'Ноги / сідниці',           effort: 'RIR 1-2' },
  { name: 'Жим ногами в тренажері',              sets: 3, reps: '12-15', restSec: 60,  notes: 'Ноги — аксесуар',          effort: 'RIR 1-2' },
  { name: 'Підйоми на носки стоячи',             sets: 3, reps: '20-25', restSec: 45,  notes: 'Литкові',                  effort: 'RIR 1' },
  { name: 'Скручування на прес',                 sets: 3, reps: '15-20', restSec: 45,  notes: 'Прес — аксесуар',          effort: 'RIR 1' },
  { name: 'Підйом гантелей на біцепс',           sets: 3, reps: '12-15', restSec: 45,  notes: 'Руки — біцепс',            effort: 'RIR 1-2' },
  { name: 'Розгинання рук на блоці',             sets: 3, reps: '12-15', restSec: 45,  notes: 'Руки — трицепс',           effort: 'RIR 1-2' },
];

const lowerBCut = [
  { name: 'Сумо-присідання з гантеллю',          sets: 3, reps: '12-15', restSec: 60,  notes: 'Ноги / внутрішня частина стегна', effort: 'RIR 1-2' },
  { name: 'Румунська тяга на одній нозі',         sets: 3, reps: '12/н',  restSec: 60,  notes: 'Ноги / сідниці — баланс',  effort: 'RIR 1-2' },
  { name: 'Зашагування на платформу',             sets: 3, reps: '12/н',  restSec: 60,  notes: 'Ноги — аксесуар',          effort: 'RIR 1-2' },
  { name: 'Підйоми на носки сидячи',              sets: 3, reps: '20-25', restSec: 45,  notes: 'Камбалоподібний м\'яз',    effort: 'RIR 1' },
  { name: 'Планка',                               sets: 3, reps: '30-45с', restSec: 45, notes: 'Прес — статика',           effort: 'Утримуй максимально рівно' },
  { name: 'Молоткові згинання з гантелями',       sets: 3, reps: '12-15', restSec: 45,  notes: 'Руки — біцепс + плечопром.',effort: 'RIR 1-2' },
  { name: 'Відтягування верхнього блоку',         sets: 3, reps: '12-15', restSec: 45,  notes: 'Руки — трицепс',           effort: 'RIR 1-2' },
];

const cardioGuidelinesCut = {
  stepsPerDay:      '8–12 тис. кроків щодня',
  sessionsPerWeek:  '2–4 рази/тиждень',
  sessionDuration:  '20–40 хв',
  intensity:        'помірна (зона 2)',
  note:             'Кардіо роби після силового або в окремі дні',
};

function buildDays(upperA, lowerA, upperB, lowerB, cardioGuidelines) {
  const variants = {
    '2': [
      { day: 1, title: 'Верх (Груди + Спина + Плечі)', exercises: upperA },
      { day: 2, title: 'Низ (Ноги + Руки)',             exercises: lowerA },
    ],
    '3': {
      note: 'Чергуй тижні A/B',
      weekA: [
        { day: 1, title: 'Верх А (Груди + Спина + Плечі)', exercises: upperA },
        { day: 2, title: 'Низ А (Ноги + Руки)',             exercises: lowerA },
        { day: 3, title: 'Верх Б (Груди + Спина + Плечі)', exercises: upperB },
      ],
      weekB: [
        { day: 1, title: 'Низ А (Ноги + Руки)',             exercises: lowerA },
        { day: 2, title: 'Верх Б (Груди + Спина + Плечі)', exercises: upperB },
        { day: 3, title: 'Низ Б (Ноги + Руки)',             exercises: lowerB },
      ],
    },
    '4': [
      { day: 1, title: 'Верх А (Груди + Спина + Плечі)', exercises: upperA },
      { day: 2, title: 'Низ А (Ноги + Руки)',             exercises: lowerA },
      { day: 3, title: 'Верх Б (Груди + Спина + Плечі)', exercises: upperB },
      { day: 4, title: 'Низ Б (Ноги + Руки)',             exercises: lowerB },
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
        slug:        'upper-lower-bulk',
        title:       'Upper/Lower — Набір м\'язів',
        description: 'Класична схема верх/низ для максимального набору м\'язової маси. 8 тижнів прогресивного навантаження з варіантами на 2, 3 або 4 тренування на тиждень.',
        goal:        'BULK',
        level:       'BEGINNER',
        weeks:       8,
        days:        buildDays(upperABulk, lowerABulk, upperBBulk, lowerBBulk),
      },
      {
        slug:        'upper-lower-cut',
        title:       'Upper/Lower — Схуднення',
        description: 'Схема верх/низ з акцентом на жироспалювання: вищий діапазон повторень, коротший відпочинок. 8 тижнів для рельєфу з варіантами на 2, 3 або 4 тренування на тиждень.',
        goal:        'CUT',
        level:       'BEGINNER',
        weeks:       8,
        days:        buildDays(upperACut, lowerACut, upperBCut, lowerBCut, cardioGuidelinesCut),
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

