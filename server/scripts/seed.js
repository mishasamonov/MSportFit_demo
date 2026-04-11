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
        calories: 389,
        protein: 16.9,
        fat: 6.9,
        carbs: 66.3,
      },
      {
        title: 'Гречка',
        category: 'Крупи',
        calories: 346,
        protein: 11.7,
        fat: 2.7,
        carbs: 75.0,
      },
      {
        title: 'Куряче філе',
        category: 'Мʼясо',
        calories: 120,
        protein: 22.5,
        fat: 2.6,
        carbs: 0.0,
      },
      {
        title: 'Індича грудка',
        category: 'Мʼясо',
        calories: 114,
        protein: 23.3,
        fat: 2.3,
        carbs: 0.0,
      },
      {
        title: 'Грецький йогурт',
        category: 'Молочні продукти',
        calories: 59,
        protein: 10.2,
        fat: 0.4,
        carbs: 3.6,
      },
      {
        title: 'Сир кисломолочний 5%',
        category: 'Молочні продукти',
        calories: 121,
        protein: 17.0,
        fat: 5.0,
        carbs: 1.8,
      },
      {
        title: 'Банан',
        category: 'Фрукти',
        calories: 89,
        protein: 1.1,
        fat: 0.3,
        carbs: 22.8,
      },
      {
        title: 'Яблуко',
        category: 'Фрукти',
        calories: 52,
        protein: 0.3,
        fat: 0.2,
        carbs: 13.8,
      },
      {
        title: 'Брокколі',
        category: 'Овочі',
        calories: 34,
        protein: 2.8,
        fat: 0.4,
        carbs: 6.6,
      },
      {
        title: 'Батат',
        category: 'Овочі',
        calories: 86,
        protein: 1.6,
        fat: 0.1,
        carbs: 20.1,
      },
      {
        title: 'Мигдаль',
        category: 'Горіхи',
        calories: 579,
        protein: 21.2,
        fat: 49.9,
        carbs: 21.6,
      },
      {
        title: 'Арахісова паста',
        category: 'Горіхи',
        calories: 598,
        protein: 22.2,
        fat: 51.4,
        carbs: 22.3,
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
        muscleGroup: 'Ноги, Сідниці',
        level: 'Початковий',
        equipment: 'Без обладнання',
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
        muscleGroup: 'Груди, Трицепс',
        level: 'Початковий',
        equipment: 'Без обладнання',
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
          'Починай з віджимань з колін, якщо повний діапазон поки складний.',
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
        muscleGroup: 'Кор',
        level: 'Середній',
        equipment: 'Без обладнання',
        videoUrl: 'https://www.youtube.com/watch?v=BQu26ABuVS0',
        description:
          'Статична вправа, в якій тіло утримується в горизонтальному положенні. Зміцнює прес, спину, плечі та сідниці одночасно.',
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
      {
        slug: 'barbell-bench-press',
        title: 'Жим штанги лежачи',
        category: 'Груди',
        calories: 120,
        muscleGroup: 'Груди, Трицепс, Плечі',
        level: 'Середній',
        equipment: 'Штанга',
        videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        description:
          "Основна багатосуглобова вправа для розвитку грудних м'язів, трицепсів та передніх дельт. Виконується лежачи на горизонтальній лаві зі штангою.",
        steps: [
          'Ляж на лаву, очі під грифом. Стопи на підлозі, лопатки зведені.',
          'Візьми гриф хватом трохи ширше плечей.',
          'Зніми штангу зі стійок і виведи над серединою грудей.',
          'На вдиху опускай штангу до нижньої частини грудей.',
          'На видиху вижми штангу вгору до повного випрямлення рук.',
        ],
        tips: [
          'Зводь лопатки і тримай природний прогин у попереку.',
          'Не відривай сідниці від лави.',
          'Використовуй страхувальника при роботі з великою вагою.',
        ],
        mistakes: [
          'Відрив сідниць від лави при жимі.',
          'Надмірне розведення ліктів у сторони (90°) — навантажує плечі.',
          'Відбивання штанги від грудей.',
        ],
        alternatives: {
          home: ['Віджимання з широкою постановкою рук', 'Жим гантелей лежачи на підлозі'],
          outdoor: ['Віджимання від брусів', 'Віджимання від лавки'],
          band: ['Жим з гумовою стрічкою лежачи', 'Зведення рук з гумою'],
        },
      },
      {
        slug: 'standing-dumbbell-lateral-raise',
        title: 'Махи з гантелями в сторони стоячи',
        category: 'Плечі',
        calories: 55,
        muscleGroup: 'Плечі',
        level: 'Початковий',
        equipment: 'Гантелі',
        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
        description:
          'Ізольована вправа на середній пучок дельт. Формує ширину плечей і V-подібний силует.',
        steps: [
          'Стань прямо, гантелі в руках вздовж тіла, лікті злегка зігнуті.',
          'На видиху підніми руки через сторони до рівня плечей.',
          'У верхній точці мізинець має бути трохи вище великого пальця.',
          'На вдиху повільно опусти руки у вихідне положення.',
          'Контролюй рух — не використовуй інерцію.',
        ],
        tips: [
          'Не піднімай плечі до вух — тримай трапецію розслабленою.',
          'Працюй з помірною вагою для чистої техніки.',
          'Уявляй, що виливаєш воду з чашки у верхній точці.',
        ],
        mistakes: [
          'Використання інерції та розгойдування тіла.',
          'Піднімання плечей замість рук.',
          'Занадто велика вага, що порушує техніку.',
        ],
        alternatives: {
          home: [
            'Підйоми рук через сторони з пляшками води',
            'Ізометричне утримання рук в сторони',
          ],
          outdoor: [
            'Підйоми рук через сторони з еспандером на стовпі',
            'Відведення рук з рюкзаком',
          ],
          band: ['Розведення рук з гумовою стрічкою', 'Бічні підйоми з гумою з-під ноги'],
        },
      },
      {
        slug: 'pull-up',
        title: 'Підтягування на турніку',
        category: 'Спина',
        calories: 110,
        muscleGroup: 'Спина, Біцепс',
        level: 'Середній',
        equipment: 'Турнік',
        videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
        description:
          "Базова вправа з власною вагою для розвитку широчайших м'язів спини та біцепсів. Один із найкращих рухів для V-подібного торсу.",
        steps: [
          'Візьмись за перекладину хватом трохи ширше плечей, долоні від себе.',
          'Повисни на прямих руках, лопатки опущені вниз.',
          'На видиху підтягнись, ведучи лікті вниз і назад.',
          'Підніми підборіддя вище перекладини.',
          'На вдиху повільно опустись у вихідне положення.',
        ],
        tips: [
          'Починай рух з лопаток, а не з рук.',
          'Не розгойдуйся — рух має бути контрольованим.',
          'Якщо важко — використовуй гумову стрічку для допомоги.',
        ],
        mistakes: [
          'Кіпінг (розгойдування тіла для інерції).',
          'Неповний діапазон руху — не опускаєшся до кінця.',
          'Занадто вузький або широкий хват, що навантажує суглоби.',
        ],
        alternatives: {
          home: ['Підтягування в дверному отворі', 'Горизонтальні підтягування під столом'],
          outdoor: ['Підтягування на дитячому майданчику', 'Австралійські підтягування на поручні'],
          band: ['Підтягування з гумовою стрічкою', 'Тяга гуми зверху вниз'],
        },
      },
      {
        slug: 'barbell-back-squat',
        title: 'Присідання зі штангою',
        category: 'Ноги',
        calories: 150,
        muscleGroup: 'Ноги, Сідниці',
        level: 'Середній',
        equipment: 'Штанга',
        videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
        description:
          "Король усіх вправ для нижньої частини тіла. Розвиває квадрицепси, сідниці, задню поверхню стегна та м'язи кору.",
        steps: [
          'Підійди під штангу на стійках, постав її на верхню частину трапецій.',
          'Зніми штангу, зроби 1–2 кроки назад, ноги на ширині плечей.',
          'На вдиху сідай вниз, відводячи таз назад.',
          'Опускайся нижче паралелі, якщо дозволяє гнучкість.',
          "На видиху вставай, відштовхуючись п'ятами.",
        ],
        tips: [
          'Завжди використовуй стійки з обмежувачами безпеки.',
          'Тримай груди розкритими, погляд вперед.',
          'Контролюй негативну фазу — не падай різко вниз.',
        ],
        mistakes: [
          'Завалювання колін всередину.',
          "Відривання п'ят від підлоги.",
          'Надмірний нахил корпусу вперед.',
        ],
        alternatives: {
          home: ['Присідання з рюкзаком', 'Болгарське присідання'],
          outdoor: ['Присідання на одній нозі (пістолетик)', 'Стрибкові присідання'],
          band: ['Присідання з гумовою стрічкою на плечах', 'Фронтальне присідання з гумою'],
        },
      },
      {
        slug: 'romanian-deadlift',
        title: 'Румунська тяга з гантелями',
        category: 'Ноги',
        calories: 95,
        muscleGroup: 'Ноги, Сідниці',
        level: 'Початковий',
        equipment: 'Гантелі',
        videoUrl: 'https://www.youtube.com/watch?v=7j-2w4-P14I',
        description:
          'Вправа для задньої поверхні стегна та сідниць. Розвиває силу та гнучкість задньої лінії тіла.',
        steps: [
          'Візьми гантелі, стань прямо, ноги на ширині стегон.',
          'Злегка зігни коліна і зафіксуй їх у цьому положенні.',
          'На вдиху нахиляйся вперед, ведучи таз назад, гантелі ковзають вздовж ніг.',
          'Опускайся до відчуття розтягнення задньої поверхні стегна.',
          'На видиху повернись у вихідне положення, стискаючи сідниці.',
        ],
        tips: [
          'Спина рівна протягом усього руху — без округлення.',
          'Гантелі тримай максимально близько до ніг.',
          'Не опускайся надто низько, якщо відчуваєш округлення попереку.',
        ],
        mistakes: [
          'Округлення спини при опусканні.',
          'Надмірне згинання колін — це перетворює вправу на присідання.',
          "Переміщення ваги на носки замість п'яток.",
        ],
        alternatives: {
          home: ['Сідничний міст на одній нозі', 'Нахили корпусу з рюкзаком'],
          outdoor: ['Тяга на одній нозі з опорою на лавку', 'Сідничний міст на лавці'],
          band: ['Румунська тяга з гумовою стрічкою', 'Нахили з гумою'],
        },
      },
      {
        slug: 'dumbbell-bicep-curl',
        title: 'Підйом гантелей на біцепс',
        category: 'Руки',
        calories: 50,
        muscleGroup: 'Біцепс',
        level: 'Початковий',
        equipment: 'Гантелі',
        videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
        description:
          'Ізольована вправа для розвитку біцепса. Виконується стоячи або сидячи з гантелями. Проста техніка робить її ідеальною для початківців.',
        steps: [
          'Стань прямо, гантелі в опущених руках, долоні вперед.',
          'Притисни лікті до боків і зафіксуй їх.',
          'На видиху згинай руки, піднімаючи гантелі до плечей.',
          'У верхній точці стисни біцепс на 1 секунду.',
          'На вдиху повільно опусти гантелі у вихідне положення.',
        ],
        tips: [
          'Не розгойдуй корпус — працює тільки біцепс.',
          'Контролюй негативну фазу — опускай повільно.',
          'Спробуй суперсет з трицепсом для ефективності.',
        ],
        mistakes: [
          'Розгойдування тіла для підйому ваги.',
          'Відведення ліктів від тіла.',
          'Занадто швидке опускання без контролю.',
        ],
        alternatives: {
          home: ['Згинання рук з пляшками води', 'Ізометричне утримання у верхній точці'],
          outdoor: ['Підтягування зворотним хватом', 'Згинання рук на низькій перекладині'],
          band: ['Згинання рук з гумовою стрічкою', 'Молоткові згинання з гумою'],
        },
      },
      {
        slug: 'leg-press',
        title: 'Жим ногами в тренажері',
        category: 'Ноги',
        calories: 130,
        muscleGroup: 'Ноги, Сідниці',
        level: 'Початковий',
        equipment: 'Тренажер',
        videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
        description:
          'Багатосуглобова вправа в тренажері для розвитку ніг. Менше навантаження на хребет порівняно з присіданнями, що робить її безпечнішою для новачків.',
        steps: [
          'Сядь у тренажер, спина і голова притиснуті до спинки.',
          'Постав стопи на платформу на ширині плечей.',
          'Зніми фіксатори і тримай платформу на злегка зігнутих ногах.',
          'На вдиху опускай платформу, згинаючи коліна до 90°.',
          'На видиху вижимай платформу вгору, не розгинаючи коліна до кінця.',
        ],
        tips: [
          'Не розгинай коліна повністю у верхній точці.',
          "Змінюй постановку ніг для акценту на різні м'язи.",
          'Контролюй вагу — не використовуй занадто багато.',
        ],
        mistakes: [
          'Повне розгинання колін — небезпечно для суглобів.',
          'Відрив попереку від спинки при опусканні.',
          'Занадто малий діапазон руху.',
        ],
        alternatives: {
          home: ['Присідання біля стіни з фітболом', 'Присідання з паузою в нижній точці'],
          outdoor: ['Зашагування на високу платформу', 'Стрибки на коробку'],
          band: ['Жим з гумовою стрічкою лежачи на спині', 'Присідання з гумою'],
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
    name: 'Махи з гантелями в сторони стоячи',
    exerciseSlug: 'standing-dumbbell-lateral-raise',
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
    name: 'Махи з гантелями в сторони стоячи',
    exerciseSlug: 'standing-dumbbell-lateral-raise',
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
    exerciseSlug: 'barbell-romanian-deadlift',
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
    exerciseSlug: 'seated-dumbbell-shoulder-press',
    sets: 3,
    reps: '12-15',
    restSec: 60,
    notes: 'Плечі — основна вправа',
    effort: 'RIR 1-2',
  },
  {
    name: 'Махи з гантелями в сторони стоячи',
    exerciseSlug: 'standing-dumbbell-lateral-raise',
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
    name: 'Махи з гантелями в сторони стоячи',
    exerciseSlug: 'standing-dumbbell-lateral-raise',
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
    exerciseSlug: 'romanian-deadlift',
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
    exerciseSlug: 'dumbbell-bicep-curl',
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
