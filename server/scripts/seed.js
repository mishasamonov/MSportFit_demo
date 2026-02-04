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

async function main() {
  try {
    await seedProducts();
    await seedExercises();
  } catch (err) {
    console.error('Seed error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();

