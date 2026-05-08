/** Категорії фільтра: id 'all' показує всі записи */
export const FAQ_CATEGORIES = [
  { id: 'all', label: 'Усі' },
  { id: 'training', label: 'Тренування' },
  { id: 'nutrition', label: 'Харчування' },
  { id: 'recovery', label: 'Відновлення' },
  { id: 'calculators', label: 'Калькулятори' },
  { id: 'general', label: 'Загальне' },
];

/**
 * Питання та відповіді для FAQ.
 * Поле sources — опційне. Якщо воно є, у відповіді під текстом
 * відобразиться невеликий блок із посиланнями на перевірені джерела.
 *
 * Дозволені значення sources[].type:
 *   'guideline' | 'position stand' | 'meta-analysis' | 'review' | 'research' | 'systematic review'
 */
export const FAQ_ITEMS = [
  // ── Тренування ───────────────────────────────────────────────
  {
    id: 'training-1',
    category: 'training',
    question: 'Як часто краще тренуватися новачку?',
    answer:
      'Для більшості новачків достатньо 2–3 силових тренувань на тиждень. Важливо залишати дні відпочинку між важкими тренуваннями, поступово збільшувати навантаження і спочатку робити акцент на техніці, а не на максимальній вазі.',
    sources: [
      {
        label: 'WHO Guidelines on Physical Activity and Sedentary Behaviour, 2020',
        url: 'https://www.who.int/publications/i/item/9789240015128',
        type: 'guideline',
      },
      {
        label:
          'ACSM Position Stand: Progression Models in Resistance Training for Healthy Adults, 2009',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'training-2',
    category: 'training',
    question: 'Чи потрібно тренуватися до відмови?',
    answer:
      'Не обов’язково. Для більшості вправ достатньо завершувати робочий підхід близько до відмови, залишаючи приблизно 1–3 повторення в запасі. Це дозволяє отримувати хороший стимул для росту м’язів, але не накопичувати надмірну втому. Повна відмова може бути доречною іноді, переважно в безпечних ізоляційних вправах, але її не варто робити основою кожного тренування.',
    sources: [
      {
        label: 'Grgic et al., 2022 — Resistance training to failure or non-failure',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33497853/',
        type: 'meta-analysis',
      },
      {
        label:
          'Refalo et al., 2023 — Resistance Training Proximity-to-Failure and Muscle Hypertrophy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36334240/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'training-3',
    category: 'training',
    question: 'Скільки підходів потрібно на м’язову групу за тиждень?',
    answer:
      'Орієнтовно можна починати з 8–12 робочих підходів на м’язову групу на тиждень і поступово рухатися до 12–16, якщо організм добре відновлюється. Для новачків часто достатньо меншого обсягу, а досвідченим спортсменам може знадобитися більше. Головне — рахувати саме робочі підходи, тобто ті, які виконуються з нормальною технікою і достатньою близькістю до втоми.',
    sources: [
      {
        label:
          'Schoenfeld et al., 2017 — Dose-response relationship between weekly resistance training volume and muscle mass',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'training-4',
    category: 'training',
    question: 'Коли потрібно збільшувати вагу у вправі?',
    answer:
      'Вагу варто збільшувати тоді, коли ви стабільно виконуєте заданий діапазон повторень з правильною технікою. Якщо техніка погіршується, краще залишити поточну вагу або зменшити її.',
  },
  {
    id: 'training-5',
    category: 'training',
    question: 'Чи можна тренуватися вдома без тренажерного залу?',
    answer:
      'Так. Для початку можна використовувати вправи з власною вагою, резинові стрічки, гантелі або рюкзак з навантаженням. Головне — поступово ускладнювати вправи і контролювати техніку.',
  },
  {
    id: 'training-6',
    category: 'training',
    question: 'Чому програма Upper/Lower ефективна?',
    answer:
      'Upper/Lower дозволяє тренувати основні м’язові групи більше одного разу на тиждень і рівномірніше розподіляти робочий обсяг. Такий формат зручний для набору м’язової маси, тому що м’язи отримують стимул частіше, а одне тренування не перевантажується надмірною кількістю вправ. Важливо розуміти, що ефективність залежить не лише від назви спліту, а від загального тижневого обсягу, техніки, прогресії навантаження і відновлення.',
    sources: [
      {
        label:
          'Schoenfeld et al., 2016 — Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27102172/',
        type: 'meta-analysis',
      },
      {
        label:
          'Schoenfeld et al., 2019 — How many times per week should a muscle be trained to maximize muscle hypertrophy?',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30558493/',
        type: 'review',
      },
    ],
  },
  {
    id: 'training-7',
    category: 'training',
    question: 'Скільки робочих підходів робити на м’язову групу за тренування?',
    answer:
      'Для більшості користувачів практичний орієнтир — приблизно 4–8 робочих підходів на одну м’язову групу за тренування. Якщо зробити занадто мало, стимулу може бути недостатньо; якщо занадто багато — втома може перевищити користь. Краще починати з нижчого обсягу і поступово збільшувати його, якщо техніка, сон і відновлення залишаються нормальними.',
    sources: [
      {
        label:
          'Schoenfeld et al., 2017 — Dose-response relationship between weekly resistance training volume and muscle mass',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/',
        type: 'meta-analysis',
      },
      {
        label: 'ACSM Position Stand — Progression Models in Resistance Training for Healthy Adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'training-8',
    category: 'training',
    question: 'Що таке гіпертрофія м’язів?',
    answer:
      'Гіпертрофія — це збільшення розміру м’язових волокон у відповідь на тренувальне навантаження. Для цього важливі регулярні силові тренування, достатній робочий обсяг, поступове збільшення навантаження, близькість підходів до втоми, білок у раціоні та сон. Саме тому програма тренувань має бути не випадковою, а структурованою.',
    sources: [
      {
        label: 'Schoenfeld et al., 2017 — Weekly resistance training volume and muscle mass',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27433992/',
        type: 'meta-analysis',
      },
      {
        label:
          'Morton et al., 2018 — Protein supplementation and resistance training-induced gains',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'training-9',
    category: 'training',
    question: 'Чи потрібне кардіо, якщо я тренуюся в залі?',
    answer:
      'Так, кардіо може бути корисним навіть при силових тренуваннях. Воно підтримує серцево-судинну систему, допомагає збільшити загальні енерговитрати і може бути корисним під час схуднення. Важливо не робити його настільки багато, щоб воно заважало відновленню після силових тренувань. Для більшості людей достатньо почати з ходьби, велосипеда або легкого бігу 2–4 рази на тиждень.',
    sources: [
      {
        label: 'WHO Guidelines on Physical Activity and Sedentary Behaviour, 2020',
        url: 'https://www.who.int/publications/i/item/9789240015128',
        type: 'guideline',
      },
      {
        label: 'Jayedi et al., 2024 — Aerobic Exercise and Weight Loss in Adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39724371/',
        type: 'meta-analysis',
      },
    ],
  },

  // ── Харчування ───────────────────────────────────────────────
  {
    id: 'nutrition-1',
    category: 'nutrition',
    question: 'Скільки білка потрібно для набору м’язової маси?',
    answer:
      'Для людей, які регулярно тренуються, часто використовують орієнтир близько 1.4–2.0 г білка на 1 кг маси тіла на добу. Точна потреба залежить від ваги, цілі, калорійності раціону, рівня активності та відновлення.',
    sources: [
      {
        label: 'ISSN Position Stand: Protein and Exercise, 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/',
        type: 'position stand',
      },
      {
        label:
          'Morton et al., 2018 — Protein supplementation and resistance training-induced gains',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'nutrition-2',
    category: 'nutrition',
    question: 'Що важливіше для схуднення: тренування чи харчування?',
    answer:
      'Головний фактор схуднення — стабільний дефіцит калорій, і найчастіше саме харчування визначає, чи вдається його тримати. Тренування допомагають витрачати енергію, зберігати м’язи, покращувати форму тіла та самопочуття, але без контролю харчування прогрес часто буває нестабільним. Найкраще поєднувати обидва напрями.',
    sources: [
      {
        label: 'ISSN Position Stand: Diets and Body Composition, 2017',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/',
        type: 'position stand',
      },
      {
        label: 'Xie et al., 2024 — Diet and Exercise Interventions on Body Composition',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39275322/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'nutrition-3',
    category: 'nutrition',
    question: 'Чи треба повністю прибирати вуглеводи?',
    answer:
      'Повністю прибирати вуглеводи не потрібно, якщо для цього немає медичних причин. Вуглеводи можуть бути корисними для тренувань, енергії та відновлення. Важливіше контролювати загальну калорійність і якість продуктів.',
    sources: [
      {
        label: 'ISSN Position Stand: Diets and Body Composition, 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28630601/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'nutrition-4',
    category: 'nutrition',
    question: 'Чи можна їсти після 18:00?',
    answer:
      'Так, можна. Сам по собі час після 18:00 не робить їжу шкідливою і не блокує схуднення. Для ваги важливіше, скільки калорій і макронутрієнтів ви отримуєте за день. Водночас дуже пізній або великий прийом їжі близько до сну може погіршувати сон, травлення та контроль апетиту. Тому практичніше орієнтуватися не на 18:00, а на власний режим сну: останній великий прийом їжі краще робити приблизно за 2–3 години до сну.',
    sources: [
      {
        label: 'Fong et al., 2017 — Large dinners and weight loss',
        url: 'https://doi.org/10.1017/S0007114517002550',
        type: 'meta-analysis',
      },
      {
        label: 'Liu et al., 2024 — Meal Timing and Anthropometric and Metabolic Outcomes',
        url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825747',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'nutrition-5',
    category: 'nutrition',
    question: 'Чи потрібно рахувати БЖВ щодня?',
    answer:
      'Не обов’язково рахувати БЖВ все життя. Але на початку це допомагає краще зрозуміти калорійність продуктів, кількість білка, жирів і вуглеводів у раціоні. Потім можна перейти до більш гнучкого контролю.',
  },
  {
    id: 'nutrition-6',
    category: 'nutrition',
    question: 'Як простіше скласти збалансовану тарілку?',
    answer:
      'Простий орієнтир — зробити половину тарілки овочами та фруктами, частину відвести під джерело білка, а частину — під складні вуглеводи або крупи. Це не жорстка дієта, а зручна модель, яка допомагає краще контролювати якість харчування без складних розрахунків у кожному прийомі їжі.',
    sources: [
      {
        label: 'МОЗ України — Тарілка здорового харчування',
        url: 'https://moz.gov.ua/uk/tarilka-zdorovogo-harchuvannja',
        type: 'guideline',
      },
      {
        label: 'ЦГЗ України — Тарілка здорового харчування',
        url: 'https://phc.org.ua/news/tarilka-zdorovogo-kharchuvannya',
        type: 'guideline',
      },
    ],
  },
  {
    id: 'nutrition-7',
    category: 'nutrition',
    question: 'Що головне для схуднення?',
    answer:
      'Головна умова схуднення — стабільний дефіцит калорій, тобто організм має витрачати більше енергії, ніж отримує з їжі. Але якість раціону теж важлива: достатньо білка, овочі, крупи, фрукти, нормальна кількість жирів і контроль солодких напоїв допомагають легше дотримуватися режиму. Силові тренування та активність протягом дня допомагають зберігати м’язи й підвищувати загальні енерговитрати.',
    sources: [
      {
        label: 'ISSN Position Stand: Diets and Body Composition, 2017',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/',
        type: 'position stand',
      },
      {
        label: 'Xie et al., 2024 — Diet and Exercise Interventions on Body Composition',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39275322/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'nutrition-8',
    category: 'nutrition',
    question: 'Що головне для набору м’язової маси?',
    answer:
      'Для набору м’язової маси потрібні силові тренування з поступовим прогресом, достатня кількість білка, нормальна калорійність раціону і відновлення. Зазвичай для активних людей орієнтир білка становить приблизно 1.4–2.0 г на 1 кг маси тіла на добу. Якщо вага не росте і силові показники стоять на місці, варто поступово збільшити калорійність раціону.',
    sources: [
      {
        label: 'ISSN Position Stand: Protein and Exercise, 2017',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/',
        type: 'position stand',
      },
      {
        label:
          'Morton et al., 2018 — Protein supplementation and resistance training-induced gains',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'nutrition-9',
    category: 'nutrition',
    question: 'Чи можна схуднути тільки за рахунок кардіо?',
    answer:
      'Кардіо допомагає витрачати більше енергії та може підтримувати схуднення, але без контролю харчування результат часто буде слабшим. Найкраще кардіо працює як частина системи: дефіцит калорій, достатньо білка, силові тренування і регулярна активність протягом дня. Для помітнішого впливу на вагу часто потрібна регулярність, а не разові дуже важкі кардіосесії.',
    sources: [
      {
        label: 'Jayedi et al., 2024 — Aerobic Exercise and Weight Loss in Adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39724371/',
        type: 'meta-analysis',
      },
      {
        label: 'Xie et al., 2024 — Diet and Exercise Interventions on Body Composition',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39275322/',
        type: 'meta-analysis',
      },
    ],
  },
  {
    id: 'nutrition-10',
    category: 'nutrition',
    question: 'Чи можна набирати м’язи без профіциту калорій?',
    answer:
      'Новачки, люди після перерви або користувачі з вищим відсотком жиру інколи можуть одночасно покращувати форму тіла: втрачати жир і набирати трохи м’язів. Але для стабільного набору м’язової маси зазвичай легше працювати з невеликим профіцитом калорій, достатньою кількістю білка і прогресією в силових тренуваннях. Великий профіцит не потрібен, бо він частіше збільшує набір жиру.',
    sources: [
      {
        label: 'ISSN Position Stand: Diets and Body Composition, 2017',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/',
        type: 'position stand',
      },
      {
        label: 'ISSN Position Stand: Protein and Exercise, 2017',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/',
        type: 'position stand',
      },
    ],
  },

  // ── Відновлення ──────────────────────────────────────────────
  {
    id: 'recovery-1',
    category: 'recovery',
    question: 'Скільки відпочивати між тренуваннями?',
    answer:
      'Якщо йдеться про ту саму м’язову групу, практичний орієнтир — дати їй приблизно 48 годин відновлення. Після важких тренувань ніг або великого обсягу може знадобитися 48–72 години. Водночас тренуватися два дні підряд можна, якщо навантаження припадає на різні м’язові групи, наприклад сьогодні верх тіла, а завтра низ, або якщо тренування має нижчу інтенсивність.',
    sources: [
      {
        label:
          'Sousa et al., 2024 — The Importance of Recovery in Resistance Training Microcycle Construction',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11057610/',
        type: 'review',
      },
      {
        label: 'ACSM Position Stand — Progression Models in Resistance Training for Healthy Adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'recovery-2',
    category: 'recovery',
    question: 'Чи можна тренуватися, якщо болять м’язи?',
    answer:
      'Легка крепатура не завжди є причиною повністю пропускати тренування. Але якщо біль сильний, обмежує рух або погіршує техніку, краще дати м’язам більше часу на відновлення.',
  },
  {
    id: 'recovery-3',
    category: 'recovery',
    question: 'Чому сон важливий для прогресу?',
    answer:
      'Сон впливає на відновлення, рівень енергії, концентрацію, апетит і якість тренувань. Якщо регулярно недосипати, може погіршуватися працездатність, техніка вправ, мотивація та здатність організму нормально відновлюватися. Для більшості людей практичний орієнтир — стабільний сон приблизно 7–9 годин на добу, але важлива не тільки тривалість, а й регулярність.',
    sources: [
      {
        label:
          'Kong et al., 2025 — Effects of sleep deprivation on sports performance and perceived exertion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/40236824/',
        type: 'systematic review',
      },
      {
        label:
          'Sleep and Athletic Performance: Impacts on Physical Performance, Mental Performance, Injury Risk and Recovery',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9960533/',
        type: 'review',
      },
    ],
  },
  {
    id: 'recovery-4',
    category: 'recovery',
    question: 'Скільки води потрібно пити під час тренувань?',
    answer:
      'Потреба у воді залежить від температури, тривалості тренування, інтенсивності та індивідуального потовиділення. Підтримуйте помірну гідратацію протягом дня, щоб не починати заняття в стані сильної спраги. Під час тренування зручно пити невеликими порціями за відчуттям спраги, особливо у спеку або при сильному потовиділенні. Після тренування доберіть рідину так, щоб самопочуття було нормальним, а сеча залишалася переважно світлою — це простий орієнтир відновлення водного балансу.',
    sources: [
      {
        label: 'ACSM Position Stand: Exercise and Fluid Replacement, 2007',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17277604/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'recovery-5',
    category: 'recovery',
    question: 'Чи можна тренуватися два дні підряд?',
    answer:
      'Так, можна, але бажано не навантажувати важко одну й ту саму м’язову групу два дні поспіль. Наприклад, формат Upper/Lower дозволяє тренуватися кілька днів на тиждень, чергуючи верх і низ тіла. Якщо після попереднього тренування є сильна втома, біль або помітне падіння сили, краще зменшити інтенсивність або взяти день відпочинку.',
    sources: [
      {
        label:
          'Sousa et al., 2024 — The Importance of Recovery in Resistance Training Microcycle Construction',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11057610/',
        type: 'review',
      },
    ],
  },
  {
    id: 'recovery-6',
    category: 'recovery',
    question: 'Скільки води потрібно пити протягом дня?',
    answer:
      'Точної універсальної норми для всіх немає, бо потреба у воді залежить від маси тіла, температури, активності, потовиділення та харчування. Практичний орієнтир для багатьох людей — приблизно 30–35 мл рідини на 1 кг маси тіла на добу або близько 1.5–2.5 л на день. У дні тренувань, спеки або сильного потовиділення води може знадобитися більше. Найпростіший контроль — відчуття спраги, самопочуття і світлий колір сечі.',
    sources: [
      {
        label: 'Thomas et al., 2016 — Joint Position Statement: Nutrition and Athletic Performance',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27623351/',
        type: 'position stand',
      },
      {
        label: 'ACSM Position Stand: Exercise and Fluid Replacement',
        url: 'https://pubmed.ncbi.nlm.nih.gov/17277604/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'recovery-7',
    category: 'recovery',
    question: 'Як зрозуміти, що я не встигаю відновлюватися?',
    answer:
      'Ознаки недостатнього відновлення можуть включати постійну втому, погіршення сну, падіння силових показників, небажання тренуватися, довгий м’язовий біль і відчуття виснаження. Якщо це повторюється кілька тренувань поспіль, варто зменшити обсяг, інтенсивність або додати день відпочинку. Відновлення — це частина програми, а не пауза від прогресу.',
    sources: [
      {
        label:
          'Sousa et al., 2024 — The Importance of Recovery in Resistance Training Microcycle Construction',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11057610/',
        type: 'review',
      },
      {
        label:
          'Kong et al., 2025 — Effects of sleep deprivation on sports performance and perceived exertion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/40236824/',
        type: 'systematic review',
      },
    ],
  },

  // ── Калькулятори ─────────────────────────────────────────────
  {
    id: 'calculators-1',
    category: 'calculators',
    question: 'Як працює TDEE-калькулятор?',
    answer:
      'TDEE-калькулятор спочатку оцінює базову витрату енергії організму, а потім множить її на коефіцієнт активності. У MSportFit це використовується як орієнтир для підтримки ваги, схуднення або набору маси. Результат не є абсолютно точним, тому його варто коригувати за реальною динамікою ваги, самопочуттям і тренувальним прогресом.',
    sources: [
      {
        label:
          'Mifflin et al., 1990 — A new predictive equation for resting energy expenditure in healthy individuals',
        url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
        type: 'research',
      },
      {
        label:
          'Frankenfield et al., 2005 — Comparison of predictive equations for resting metabolic rate in healthy adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15883556/',
        type: 'review',
      },
    ],
  },
  {
    id: 'calculators-2',
    category: 'calculators',
    question: 'Як розраховується БЖВ?',
    answer:
      'БЖВ — це розподіл калорій між білками, жирами та вуглеводами. У практиці харчування зазвичай використовують такі енергетичні значення: 1 г білка ≈ 4 ккал, 1 г вуглеводів ≈ 4 ккал, 1 г жиру ≈ 9 ккал. Розрахунок БЖВ допомагає не тільки бачити калорії, а й розуміти якість раціону.',
    sources: [
      {
        label: 'FAO — Food energy: methods of analysis and conversion factors',
        url: 'https://www.fao.org/4/y5022e/y5022e00.htm',
        type: 'guideline',
      },
    ],
  },
  {
    id: 'calculators-3',
    category: 'calculators',
    question: 'Чому TDEE — це приблизне значення, а не точна норма?',
    answer:
      'Формули використовують середні математичні моделі, але не можуть точно врахувати склад тіла, рівень тренованості, реальну активність протягом дня, сон, стрес і індивідуальний метаболізм. Тому TDEE краще використовувати як стартову точку, а не як остаточну цифру.',
    sources: [
      {
        label:
          'Frankenfield et al., 2005 — Comparison of predictive equations for resting metabolic rate in healthy adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/15883556/',
        type: 'review',
      },
    ],
  },
  {
    id: 'calculators-4',
    category: 'calculators',
    question: 'Як працює BMI-калькулятор?',
    answer:
      'BMI, або індекс маси тіла, розраховується як маса тіла в кілограмах, поділена на квадрат зросту в метрах. Це простий скринінговий показник, який допомагає приблизно оцінити співвідношення ваги та зросту. Але BMI не показує відсоток жиру, м’язову масу або розподіл жиру, тому його не варто сприймати як повну оцінку фізичної форми.',
    sources: [
      {
        label: 'WHO — Body mass index among adults',
        url: 'https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index',
        type: 'guideline',
      },
    ],
  },

  // ── Загальне ─────────────────────────────────────────────────
  {
    id: 'general-1',
    category: 'general',
    question: 'Чи замінює MSportFit тренера або лікаря?',
    answer:
      'Ні. MSportFit допомагає орієнтуватися у тренуваннях, продуктах, калоріях і базових принципах харчування. Але при травмах, хронічних захворюваннях або серйозних обмеженнях потрібно звертатися до фахівця.',
  },
  {
    id: 'general-2',
    category: 'general',
    question: 'Чи потрібен креатин для прогресу?',
    answer:
      'Креатин не є обов’язковим, але це одна з найбільш досліджених спортивних добавок. Він може бути корисним для силових показників і високоінтенсивних навантажень. Перед використанням добавок варто враховувати стан здоров’я і не перевищувати рекомендовані дози.',
    sources: [
      {
        label: 'ISSN Position Stand: Safety and efficacy of creatine supplementation, 2017',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28615996/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'general-3',
    category: 'general',
    question: 'Чи допомагає кофеїн перед тренуванням?',
    answer:
      'Кофеїн може покращувати працездатність і концентрацію, але реакція індивідуальна. Його не варто приймати занадто пізно ввечері, щоб не погіршити сон. Якщо є проблеми з тиском, серцем або тривожністю, краще бути обережним.',
    sources: [
      {
        label: 'ISSN Position Stand: Caffeine and Exercise Performance, 2021',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33388079/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'general-4',
    category: 'general',
    question: 'Скільки фізичної активності потрібно на тиждень?',
    answer:
      'Для дорослих людей загальний орієнтир — щонайменше 150–300 хвилин помірної аеробної активності на тиждень або 75–150 хвилин інтенсивної активності. Силові тренування також варто додавати, тому що вони допомагають підтримувати м’язи, силу і функціональність. Ходьба — зручний спосіб збільшити щоденну активність і поступово наближатися до рекомендованого обсягу руху.',
    sources: [
      {
        label: 'WHO Guidelines on Physical Activity and Sedentary Behaviour, 2020',
        url: 'https://www.who.int/publications/i/item/9789240015128',
        type: 'guideline',
      },
      {
        label: 'ЦГЗ України — Фізична активність та психічне здоров’я',
        url: 'https://phc.org.ua/news/fizichna-aktivnist-ta-psikhichne-zdorovya-chomu-pokraschuetsya-samopochuttya-ta-nastriy',
        type: 'guideline',
      },
    ],
  },
  {
    id: 'general-5',
    category: 'general',
    question: 'Чому важливо поєднувати тренування і харчування?',
    answer:
      'Тренування дають організму стимул до змін, а харчування забезпечує енергію та поживні речовини для відновлення. Якщо займатися спортом, але не контролювати раціон, прогрес може бути повільнішим. Якщо лише змінити харчування без тренувань, можна зменшити вагу, але складніше підтримувати м’язову масу, силу й форму тіла. Найкращий результат зазвичай дає поєднання силових тренувань, достатньої кількості білка, контрольованої калорійності та відновлення.',
    sources: [
      {
        label:
          'Xie et al., 2024 — Effects of Different Exercises Combined with Different Dietary Interventions on Body Composition',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39275322/',
        type: 'meta-analysis',
      },
      {
        label: 'ISSN Position Stand: Protein and Exercise, 2017',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/',
        type: 'position stand',
      },
    ],
  },
  {
    id: 'general-6',
    category: 'general',
    question: 'Чому ходьба важлива для схуднення і здоров’я?',
    answer:
      'Ходьба збільшує щоденну активність без сильного навантаження на суглоби та нервову систему. Вона допомагає підвищити витрати енергії, підтримувати серцево-судинне здоров’я і легше тримати дефіцит калорій. Не обов’язково одразу прагнути до 10 000 кроків: краще поступово збільшувати середню кількість кроків від свого поточного рівня.',
    sources: [
      {
        label: 'Paluch et al., 2022 — Daily steps and all-cause mortality',
        url: 'https://pubmed.ncbi.nlm.nih.gov/35247352/',
        type: 'meta-analysis',
      },
      {
        label: 'Ding et al., 2025 — Daily steps and health outcomes in adults',
        url: 'https://pubmed.ncbi.nlm.nih.gov/40713949/',
        type: 'systematic review',
      },
    ],
  },
];
