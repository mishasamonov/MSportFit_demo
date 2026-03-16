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

const upperABulk = [
  { name: 'Жим штанги лежачи',               sets: 4, reps: '6-10',  restSec: 120, notes: '' },
  { name: 'Тяга штанги в нахилі',             sets: 4, reps: '6-10',  restSec: 120, notes: '' },
  { name: 'Жим гантелей над головою',          sets: 3, reps: '8-10',  restSec: 90,  notes: '' },
  { name: 'Підтягування широким хватом',       sets: 3, reps: '6-10',  restSec: 90,  notes: 'Якщо потрібно — з гумою' },
  { name: 'Розгинання рук на брусах',          sets: 3, reps: '8-12',  restSec: 90,  notes: '' },
];

const upperBBulk = [
  { name: 'Жим гантелей на похилій лаві',     sets: 4, reps: '8-10',  restSec: 90,  notes: '' },
  { name: 'Тяга гантелі однією рукою',         sets: 4, reps: '8-10',  restSec: 90,  notes: '' },
  { name: 'Тяга верхнього блоку за голову',    sets: 3, reps: '8-12',  restSec: 90,  notes: '' },
  { name: 'Розведення гантелей на дельти',     sets: 3, reps: '10-12', restSec: 60,  notes: '' },
  { name: 'Підйом гантелей на біцепс',         sets: 3, reps: '10-12', restSec: 60,  notes: '' },
];

const lowerABulk = [
  { name: 'Присідання зі штангою на спині',   sets: 4, reps: '6-10',  restSec: 120, notes: '' },
  { name: 'Румунська тяга зі штангою',         sets: 3, reps: '8-10',  restSec: 90,  notes: '' },
  { name: 'Жим ногами в тренажері',            sets: 3, reps: '10-12', restSec: 90,  notes: '' },
  { name: 'Підйоми на носки стоячи',           sets: 4, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Скручування на прес',               sets: 3, reps: '15-20', restSec: 60,  notes: '' },
];

const lowerBBulk = [
  { name: 'Фронтальне присідання',             sets: 4, reps: '6-10',  restSec: 120, notes: 'Або гобле-присідання' },
  { name: 'Мертва тяга',                       sets: 3, reps: '5-8',   restSec: 120, notes: '' },
  { name: 'Випади зі штангою',                 sets: 3, reps: '10/н',  restSec: 90,  notes: '' },
  { name: 'Згинання ніг лежачи',               sets: 3, reps: '10-12', restSec: 60,  notes: '' },
  { name: 'Планка',                            sets: 3, reps: '40-60с', restSec: 60, notes: '' },
];

const upperACut = [
  { name: 'Віджимання від підлоги',            sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Тяга гантелі в нахилі',             sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Жим гантелей над головою сидячи',   sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Тяга верхнього блоку',              sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Розгинання рук на блоці',           sets: 3, reps: '12-15', restSec: 60,  notes: '' },
];

const upperBCut = [
  { name: 'Піке-віджимання',                   sets: 3, reps: '10-12', restSec: 60,  notes: '' },
  { name: 'Тяга горизонтального блоку',        sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Австралійські підтягування',        sets: 3, reps: '10-15', restSec: 60,  notes: 'Або підтягування з гумою' },
  { name: 'Підйом гантелей через сторони',     sets: 3, reps: '15-20', restSec: 45,  notes: '' },
  { name: 'Підйом гантелей на біцепс',         sets: 3, reps: '12-15', restSec: 60,  notes: '' },
];

const lowerACut = [
  { name: 'Гобле-присідання',                  sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Випади в ходьбі',                   sets: 3, reps: '12/н',  restSec: 60,  notes: '' },
  { name: 'Ягодичний міст з гантеллю',         sets: 3, reps: '15-20', restSec: 60,  notes: '' },
  { name: 'Зашагування на платформу',          sets: 3, reps: '12/н',  restSec: 60,  notes: '' },
  { name: 'Скалолаз',                          sets: 3, reps: '30с',   restSec: 45,  notes: '' },
];

const lowerBCut = [
  { name: 'Сумо-присідання',                   sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Румунська тяга з гантелями',         sets: 3, reps: '12-15', restSec: 60,  notes: '' },
  { name: 'Стрибки на ящик',                   sets: 3, reps: '8-10',  restSec: 90,  notes: 'Або швидкі присідання' },
  { name: 'Підйоми на носки сидячи',           sets: 3, reps: '20-25', restSec: 45,  notes: '' },
  { name: 'Планка з підніманням руки',          sets: 3, reps: '20-30с/ст', restSec: 60, notes: '' },
];

function buildDays(upperA, lowerA, upperB, lowerB) {
  return {
    variants: {
      '2': [
        { day: 1, title: 'Верх', exercises: upperA },
        { day: 2, title: 'Низ',  exercises: lowerA },
      ],
      '3': {
        note: 'Чергуй тижні A/B',
        weekA: [
          { day: 1, title: 'Верх А',  exercises: upperA },
          { day: 2, title: 'Низ А',   exercises: lowerA },
          { day: 3, title: 'Верх Б',  exercises: upperB },
        ],
        weekB: [
          { day: 1, title: 'Низ А',   exercises: lowerA },
          { day: 2, title: 'Верх Б',  exercises: upperB },
          { day: 3, title: 'Низ Б',   exercises: lowerB },
        ],
      },
      '4': [
        { day: 1, title: 'Верх А',  exercises: upperA },
        { day: 2, title: 'Низ А',   exercises: lowerA },
        { day: 3, title: 'Верх Б',  exercises: upperB },
        { day: 4, title: 'Низ Б',   exercises: lowerB },
      ],
    },
  };
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
        days:        buildDays(upperACut, lowerACut, upperBCut, lowerBCut),
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

