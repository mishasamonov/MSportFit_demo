import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  IconPrograms,
  IconExercises,
  IconNutrition,
  IconCalculators,
  IconBmi,
  IconFlame,
  IconMacros,
} from '../components/HomeIcons';
import exercisesCatalogPreview from '../assets/previews/exercises-catalog-preview.png';
import './Home.css';

const ADVANTAGES = [
  {
    type: 'programs',
    title: 'Програми тренувань',
    description: 'Структуровані програми для різних рівнів підготовки та цілей',
  },
  {
    type: 'exercises',
    title: 'База вправ',
    description: 'Детальні інструкції з відео та описом техніки виконання',
  },
  {
    type: 'nutrition',
    title: 'Харчування',
    description: 'База продуктів з калорійністю та макронутрієнтами',
  },
  {
    type: 'calculators',
    title: 'Фітнес калькулятори',
    description: 'Розрахунок BMI, TDEE та макронутрієнтів для ваших цілей',
  },
];

const PROGRAMS_PREVIEW = [
  {
    slug: 'mass-gain',
    title: 'Набір м\u2019язової маси',
    description:
      'Комплексна силова програма з прогресивним навантаженням для нарощування м\u2019язів',
    duration: '8 тижнів',
    level: 'Середній',
    goal: 'Маса',
  },
  {
    slug: 'weight-loss',
    title: 'Схуднення',
    description:
      'Поєднання кардіо та силових тренувань для жироспалювання зі збереженням м\u2019язів',
    duration: '10 тижнів',
    level: 'Початковий',
    goal: 'Схуднення',
  },
];

const EXERCISES_BENEFIT_CHIPS = [
  'Для залу та вулиці',
  'З інвентарем і без нього',
  'Зручний пошук і фільтри',
  'Техніка виконання',
  'Типові помилки',
  'Поради та застереження',
];

const PRODUCTS_PREVIEW = [
  {
    title: 'Куряче філе',
    category: 'М\u2019ясо',
    kcal: 120,
    protein: 22.5,
    fat: 2.6,
    carbs: 0,
  },
  {
    title: 'Банан',
    category: 'Фрукти',
    kcal: 89,
    protein: 1.09,
    fat: 0.33,
    carbs: 22.8,
  },
  {
    title: 'Яйце куряче',
    category: 'Яйця',
    kcal: 143,
    protein: 12.6,
    fat: 9.5,
    carbs: 0.72,
  },
  {
    title: 'Вівсянка',
    category: 'Крупи',
    kcal: 389,
    protein: 16.9,
    fat: 6.9,
    carbs: 66.3,
  },
];

const CALCULATORS_PREVIEW = [
  {
    type: 'bmi',
    title: 'Індекс маси тіла (BMI)',
    description: 'Визначте співвідношення вашої ваги до зросту',
  },
  {
    type: 'tdee',
    title: 'Добова норма калорій (TDEE)',
    description: 'Розрахуйте скільки калорій потрібно на день',
  },
  {
    type: 'macros',
    title: 'Макронутрієнти',
    description: 'Оптимальне співвідношення БЖВ для ваших цілей',
  },
];

const ADVANTAGE_ICONS = {
  programs: IconPrograms,
  exercises: IconExercises,
  nutrition: IconNutrition,
  calculators: IconCalculators,
};

const CALC_ICONS = {
  bmi: IconBmi,
  tdee: IconFlame,
  macros: IconMacros,
};

function Home() {
  const { isAuthed } = useAuth();

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__inner">
          <span className="home-hero__pill">Сучасна платформа для тренувань</span>
          <h1 className="home-hero__title">
            Досягайте цілей з <span className="home-hero__accent">MSportFit</span>
          </h1>
          <p className="home-hero__subtitle">
            Професійні тренувальні програми, бібліотека вправ та харчування &mdash; все в одному
            місці для вашого прогресу
          </p>
          <div className="home-hero__actions">
            <Link to="/programs" className="home-hero__btn home-hero__btn--primary">
              Підібрати програму <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link to="/calculators" className="home-hero__btn home-hero__btn--secondary">
              Відкрити калькулятори
            </Link>
          </div>
        </div>
        <div className="home-hero__glow" aria-hidden="true" />
      </section>

      <section className="home-advantages">
        <div className="home-container">
          <h2 className="home-advantages__heading">Переваги платформи</h2>
          <p className="home-advantages__subheading">
            Все необхідне для ефективних тренувань та здорового способу життя
          </p>
          <div className="home-advantages__grid">
            {ADVANTAGES.map((item) => {
              const Icon = ADVANTAGE_ICONS[item.type];
              return (
                <div className="home-advantages__card" key={item.title}>
                  <span className="home-advantages__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className="home-advantages__card-title">{item.title}</h3>
                  <p className="home-advantages__card-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-programs">
        <div className="home-container">
          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">Популярні програми</h2>
              <p className="home-section-subtitle">Перевірені тренувальні програми</p>
            </div>
            <Link to="/programs" className="home-section-link">
              Всі програми <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="home-programs__grid">
            {PROGRAMS_PREVIEW.map((program) => (
              <Link
                to={`/programs/${program.slug}`}
                className="home-programs__card"
                key={program.title}
              >
                <div className="home-programs__media">
                  <span className="home-programs__chip">{program.duration}</span>
                </div>
                <div className="home-programs__body">
                  <h3 className="home-programs__card-title">{program.title}</h3>
                  <p className="home-programs__card-desc">{program.description}</p>
                  <div className="home-programs__meta">
                    <span className="home-programs__tag">{program.level}</span>
                    <span className="home-programs__tag">{program.goal}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-exercises" aria-labelledby="home-exercises-heading">
        <div className="home-container">
          <div className="home-exercises__layout">
            <div className="home-exercises__content">
              <h2 className="home-exercises__title" id="home-exercises-heading">
                Каталог вправ
              </h2>
              <p className="home-exercises__lead">
                Знаходьте вправи за м&apos;язовою групою, рівнем підготовки та обладнанням.
                Переглядайте техніку виконання, важливі поради й типові помилки.
              </p>
              <ul className="home-exercises__chips" aria-label="Переваги каталогу вправ">
                {EXERCISES_BENEFIT_CHIPS.map((label) => (
                  <li key={label} className="home-exercises__chip">
                    {label}
                  </li>
                ))}
              </ul>
              <Link to="/exercises" className="home-exercises__cta">
                Перейти до каталогу вправ <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="home-exercises__preview">
              <Link
                to="/exercises"
                className="home-exercises__preview-link"
                aria-label="Відкрити каталог вправ — попередній перегляд інтерфейсу"
              >
                <span className="home-exercises__preview-frame">
                  <img
                    className="home-exercises__preview-img"
                    src={exercisesCatalogPreview}
                    alt="Сторінка каталогу вправ: пошук, фільтри та картки вправ"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home-exercises__preview-overlay" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-products">
        <div className="home-container">
          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">База продуктів</h2>
              <p className="home-section-subtitle">Відстежуйте харчування</p>
            </div>
            <Link to="/products" className="home-section-link">
              Всі продукти <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="home-products__grid">
            {PRODUCTS_PREVIEW.map((product) => (
              <div className="home-products__card" key={product.title}>
                <h3 className="home-products__card-title">{product.title}</h3>
                <span className="home-products__card-category">{product.category}</span>
                <div className="home-products__kcal-row">
                  <IconFlame aria-hidden="true" />
                  <span className="home-products__kcal-value">{product.kcal}</span>
                  <span className="home-products__kcal-unit">ккал</span>
                </div>
                <div className="home-products__macros">
                  <div className="home-products__stat">
                    <span className="home-products__stat-value">{product.protein}г</span>
                    <span className="home-products__stat-label">Білки</span>
                  </div>
                  <div className="home-products__stat">
                    <span className="home-products__stat-value">{product.fat}г</span>
                    <span className="home-products__stat-label">Жири</span>
                  </div>
                  <div className="home-products__stat">
                    <span className="home-products__stat-value">{product.carbs}г</span>
                    <span className="home-products__stat-label">Вуглеводи</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-calcs">
        <div className="home-container">
          <div className="home-section-header">
            <div>
              <h2 className="home-section-title">Фітнес калькулятори</h2>
              <p className="home-section-subtitle">Точні розрахунки для планування харчування</p>
            </div>
            <Link to="/calculators" className="home-section-link">
              Усі калькулятори <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="home-calcs__grid">
            {CALCULATORS_PREVIEW.map((calc) => {
              const CalcIcon = CALC_ICONS[calc.type];
              return (
                <Link
                  to={`/calculators?tab=${calc.type}`}
                  className="home-calcs__card"
                  key={calc.type}
                >
                  <span className="home-calcs__badge" aria-hidden="true">
                    <CalcIcon />
                  </span>
                  <h3 className="home-calcs__card-title">{calc.title}</h3>
                  <p className="home-calcs__card-desc">{calc.description}</p>
                  <span className="home-calcs__card-link">
                    Розрахувати <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-container">
          <div className="home-cta__card">
            <h2 className="home-cta__title">
              {isAuthed ? 'Продовжуйте свій шлях' : 'Готові почати свій шлях?'}
            </h2>
            <p className="home-cta__text">
              {isAuthed
                ? 'Оберіть програму тренувань, керуйте обраним та використовуйте калькулятори для планування тренувань і харчування.'
                : 'Створіть акаунт, щоб зберігати улюблені програми та вправи, відстежувати харчування і користуватися фітнес-калькуляторами для планування тренувань'}
            </p>
            <div className="home-cta__actions">
              <Link
                to={isAuthed ? '/programs' : '/register'}
                className="home-cta__btn home-cta__btn--primary"
              >
                {isAuthed ? 'До програм тренувань' : 'Створити акаунт'}{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link to="/faq" className="home-cta__btn home-cta__btn--secondary">
                Часті запитання
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
