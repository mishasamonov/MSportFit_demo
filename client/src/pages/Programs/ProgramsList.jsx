import { Link } from 'react-router-dom';
import './ProgramsList.css';

const PROGRAMS = [
  {
    slug: 'mass-gain',
    title: 'Набір м\u2019язової маси',
    description:
      'Силова програма з прогресивним навантаженням, спрямована на гіпертрофію та збільшення силових показників.',
    benefits: [
      'Прогресивне збільшення робочої ваги',
      'Базові багатосуглобові вправи',
      'Оптимізація відновлення між тренуваннями',
    ],
    daysPerWeek: [2, 3, 4],
    duration: '8 тижнів',
    level: 'Середній',
  },
  {
    slug: 'weight-loss',
    title: 'Схуднення',
    description:
      'Поєднання силових та кардіо-тренувань для зниження відсотка жиру зі збереженням м\u2019язової маси.',
    benefits: [
      'Ефективне жироспалювання',
      'Збереження м\u2019язів при дефіциті калорій',
      'Підвищення метаболічної активності',
    ],
    daysPerWeek: [2, 3, 4],
    duration: '10 тижнів',
    level: 'Початковий',
  },
];

function ProgramsList() {
  return (
    <div className="programs-page">
      <section className="programs-hero">
        <div className="programs-hero__inner">
          <h1 className="programs-hero__title">Програми тренувань</h1>
          <p className="programs-hero__subtitle">
            Оберіть програму відповідно до вашої мети &mdash; набір маси або схуднення. Кожна
            програма адаптується під ваш графік від 2 до 4 тренувань на тиждень.
          </p>
        </div>
        <div className="programs-hero__glow" aria-hidden="true" />
      </section>

      <section className="programs-list">
        <div className="programs-container">
          <div className="programs-grid">
            {PROGRAMS.map((program) => (
              <article className="program-card" key={program.slug}>
                <div className="program-card__media">
                  <span className="program-card__chip">{program.duration}</span>
                </div>

                <div className="program-card__body">
                  <h2 className="program-card__title">{program.title}</h2>
                  <p className="program-card__desc">{program.description}</p>

                  <ul className="program-card__benefits">
                    {program.benefits.map((b) => (
                      <li key={b} className="program-card__benefit">
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="program-card__meta">
                    <span className="program-card__tag">{program.level}</span>
                    {program.daysPerWeek.map((d) => (
                      <span key={d} className="program-card__tag program-card__tag--days">
                        {d} дн/тижд
                      </span>
                    ))}
                  </div>

                  <Link to={`/programs/${program.slug}`} className="program-card__cta">
                    Переглянути програму <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProgramsList;
