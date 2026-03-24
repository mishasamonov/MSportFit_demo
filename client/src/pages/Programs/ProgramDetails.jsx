import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getProgramBySlug,
  getProgramScheduleHints,
  getTrainingGuidance,
} from './programDetailsData';
import './ProgramDetails.css';

const DAY_OPTIONS = [2, 3, 4];
const WEEK_OPTIONS = ['A', 'B'];

function NotFound() {
  return (
    <div className="pd-page">
      <div className="pd-not-found">
        <h1 className="pd-not-found__title">Програму не знайдено</h1>
        <p className="pd-not-found__text">Такої програми не існує або вона була видалена.</p>
        <Link to="/programs" className="pd-btn pd-btn--primary">
          Повернутись до програм
        </Link>
      </div>
    </div>
  );
}

function MetaRow({ goal, level, duration, daysPerWeek }) {
  return (
    <div className="pd-meta">
      <span className="pd-meta__tag pd-meta__tag--accent">{goal}</span>
      <span className="pd-meta__tag">{level}</span>
      <span className="pd-meta__tag">{duration}</span>
      {daysPerWeek.map((d) => (
        <span key={d} className="pd-meta__tag pd-meta__tag--days">
          {d} дн/тижд
        </span>
      ))}
    </div>
  );
}

function Section({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`pd-section ${className}`.trim()}>
      <h2 className="pd-section__title">{title}</h2>
      {children}
    </section>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div className="pd-info-card">
      <div className="pd-info-card__header">
        {icon && (
          <span className="pd-info-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <h3 className="pd-info-card__title">{title}</h3>
      </div>
      <div className="pd-info-card__body">{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="pd-list">
      {items.map((item) => (
        <li key={item} className="pd-list__item">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ScheduleHint({ daysPerWeek }) {
  const options = getProgramScheduleHints(daysPerWeek);
  if (options.length === 0) return null;

  return (
    <p className="pd-schedule-hint">
      Рекомендований графік:{' '}
      {options.map((opt, idx) => (
        <span key={opt}>
          {idx > 0 ? ' або ' : ''}
          <strong>{opt}</strong>
        </span>
      ))}
    </p>
  );
}

function WeekToggle({ activeWeek, onChange }) {
  return (
    <div className="pd-week-toggle">
      {WEEK_OPTIONS.map((w) => (
        <button
          key={w}
          type="button"
          className={`pd-week-toggle__btn${activeWeek === w ? ' pd-week-toggle__btn--active' : ''}`}
          onClick={() => onChange(w)}
        >
          Тиждень {w}
        </button>
      ))}
    </div>
  );
}

function CardioHighlight({ data }) {
  if (!data) return null;

  return (
    <Section title={data.title}>
      <div className="pd-cardio-callout">
        <div className="pd-cardio-callout__icon" aria-hidden="true">
          🔥
        </div>
        <ul className="pd-cardio-callout__list">
          {data.points.map((point) => (
            <li key={point} className="pd-cardio-callout__item">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function HypertrophyHighlight({ data }) {
  if (!data) return null;

  return (
    <Section title={data.title}>
      <div className="pd-hypertrophy-callout">
        <div className="pd-hypertrophy-callout__icon" aria-hidden="true">
          💪
        </div>
        <ul className="pd-hypertrophy-callout__list">
          {data.points.map((point) => (
            <li key={point} className="pd-hypertrophy-callout__item">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function TrainingGuidance() {
  const guidance = getTrainingGuidance();

  return (
    <div className="pd-guidance">
      <div className="pd-guidance__header">
        <span className="pd-guidance__icon" aria-hidden="true">
          📋
        </span>
        <h3 className="pd-guidance__title">{guidance.title}</h3>
      </div>
      <ul className="pd-guidance__list">
        {guidance.points.map((point) => (
          <li key={point} className="pd-guidance__item">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrainingDaysSection({ trainingDays, activeDays, onChangeDays, activeWeek, onChangeWeek }) {
  const variant = trainingDays[activeDays];
  if (!variant) return null;

  const days = variant.hasWeeks
    ? activeWeek === 'B'
      ? variant.weekB
      : variant.weekA
    : variant.days;

  return (
    <Section id="training-structure" title="Структура тренувань">
      <div className="pd-days-toggle">
        {DAY_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`pd-days-toggle__btn${activeDays === opt ? ' pd-days-toggle__btn--active' : ''}`}
            onClick={() => onChangeDays(opt)}
          >
            {opt} дні
          </button>
        ))}
      </div>

      <p className="pd-variant-note">{variant.note}</p>
      <ScheduleHint daysPerWeek={activeDays} />

      {variant.hasWeeks && <WeekToggle activeWeek={activeWeek} onChange={onChangeWeek} />}

      <div className="pd-training-grid">
        {days.map((day) => (
          <div key={day.name} className="pd-training-card">
            <h3 className="pd-training-card__name">{day.name}</h3>
            <p className="pd-training-card__focus">{day.focus}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProgramDetails() {
  const { id } = useParams();
  const [activeDays, setActiveDays] = useState(3);
  const [activeWeek, setActiveWeek] = useState('A');

  const program = getProgramBySlug(id);

  if (!program) return <NotFound />;

  return (
    <div className="pd-page">
      <section className="pd-hero">
        <div className="pd-hero__inner">
          <Link to="/programs" className="pd-hero__back">
            &larr; Усі програми
          </Link>
          <h1 className="pd-hero__title">{program.title}</h1>
          <p className="pd-hero__desc">{program.description}</p>
          <MetaRow
            goal={program.goal}
            level={program.level}
            duration={program.duration}
            daysPerWeek={program.daysPerWeek}
          />
          <a
            href="#training-structure"
            className="pd-hero__jump"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('training-structure')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Перейти до структури тренувань &darr;
          </a>
        </div>
        <div className="pd-hero__glow" aria-hidden="true" />
      </section>

      <div className="pd-content">
        <div className="pd-info-grid">
          <InfoCard title="Для кого підходить" icon="🎯">
            <BulletList items={program.targetAudience} />
          </InfoCard>

          <InfoCard title="Основні принципи" icon="⚙️">
            <BulletList items={program.principles} />
          </InfoCard>

          <InfoCard title="Що входить у програму" icon="📦">
            <BulletList items={program.includes} />
          </InfoCard>
        </div>

        <CardioHighlight data={program.cardioHighlight} />
        <HypertrophyHighlight data={program.hypertrophyHighlight} />

        <TrainingGuidance />

        <TrainingDaysSection
          trainingDays={program.trainingDays}
          activeDays={activeDays}
          onChangeDays={setActiveDays}
          activeWeek={activeWeek}
          onChangeWeek={setActiveWeek}
        />

        <div className="pd-cta">
          <Link to="/programs" className="pd-btn pd-btn--primary">
            &larr; Повернутись до програм
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProgramDetails;
