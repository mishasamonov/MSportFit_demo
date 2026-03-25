import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getProgramBySlug,
  getProgramScheduleHints,
  getTrainingGuidance,
  getWorkoutByKey,
} from './programDetailsData';
import { resolveExerciseSlug } from '../../data/exerciseDetailsMap';
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

function AltLine({ label, name }) {
  const slug = resolveExerciseSlug(name);
  return (
    <p className="pd-exercise__alt-row">
      <strong>{label}:</strong>{' '}
      {slug ? (
        <Link to={`/exercises/${slug}`} className="pd-exercise__alt-link">
          {name} →
        </Link>
      ) : (
        <span>{name}</span>
      )}
    </p>
  );
}

function ExerciseItem({ exercise, index }) {
  const [altOpen, setAltOpen] = useState(false);

  return (
    <div className="pd-exercise">
      <div className="pd-exercise__header">
        <span className="pd-exercise__number">{index + 1}</span>
        <div className="pd-exercise__info">
          {exercise.slug ? (
            <Link to={`/exercises/${exercise.slug}`} className="pd-exercise__name-link">
              <h4 className="pd-exercise__name">{exercise.name}</h4>
            </Link>
          ) : (
            <h4 className="pd-exercise__name">{exercise.name}</h4>
          )}
          <p className="pd-exercise__target">{exercise.target}</p>
        </div>
        <div className="pd-exercise__params">
          <span className="pd-exercise__param">
            {exercise.sets} &times; {exercise.reps}
          </span>
          <span className="pd-exercise__rest">Відпочинок: {exercise.rest}</span>
        </div>
      </div>
      <div className="pd-exercise__actions">
        <button
          type="button"
          className={`pd-exercise__alt-toggle${altOpen ? ' pd-exercise__alt-toggle--open' : ''}`}
          onClick={() => setAltOpen((prev) => !prev)}
        >
          Альтернативи {altOpen ? '\u25B4' : '\u25BE'}
        </button>
        {exercise.slug && (
          <Link to={`/exercises/${exercise.slug}`} className="pd-exercise__technique-link">
            Переглянути техніку &rarr;
          </Link>
        )}
      </div>
      {altOpen && (
        <div className="pd-exercise__alternatives">
          <AltLine label="🏋️ Зал" name={exercise.alternatives.gym} />
          <AltLine label="🏠 Дім / вулиця" name={exercise.alternatives.home} />
        </div>
      )}
    </div>
  );
}

function WorkoutPanel({ day, workout }) {
  if (!workout || !day) return null;

  return (
    <div className="pd-workout-panel">
      <h3 className="pd-workout-panel__title">{day.name}</h3>
      <p className="pd-workout-panel__desc">{workout.description}</p>
      <div className="pd-workout-panel__list">
        {workout.exercises.map((ex, idx) => (
          <ExerciseItem key={ex.name} exercise={ex} index={idx} />
        ))}
      </div>
    </div>
  );
}

function TrainingDaysSection({
  trainingDays,
  activeDays,
  onChangeDays,
  activeWeek,
  onChangeWeek,
  selectedDayIndex,
  onSelectDay,
}) {
  const variant = trainingDays[activeDays];
  if (!variant) return null;

  const days = variant.hasWeeks
    ? activeWeek === 'B'
      ? variant.weekB
      : variant.weekA
    : variant.days;

  const safeIndex = selectedDayIndex < days.length ? selectedDayIndex : 0;
  const selectedDay = days[safeIndex];
  const workout = selectedDay ? getWorkoutByKey(selectedDay.workoutKey) : null;

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
        {days.map((day, idx) => (
          <div
            key={day.name}
            className={`pd-training-card${idx === safeIndex ? ' pd-training-card--active' : ''}`}
            onClick={() => onSelectDay(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectDay(idx);
              }
            }}
          >
            <h3 className="pd-training-card__name">{day.name}</h3>
            <p className="pd-training-card__focus">{day.focus}</p>
          </div>
        ))}
      </div>

      <WorkoutPanel day={selectedDay} workout={workout} />
    </Section>
  );
}

function ProgramDetails() {
  const { id } = useParams();
  const [activeDays, setActiveDays] = useState(3);
  const [activeWeek, setActiveWeek] = useState('A');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const handleChangeDays = (days) => {
    setActiveDays(days);
    setSelectedDayIndex(0);
  };

  const handleChangeWeek = (week) => {
    setActiveWeek(week);
    setSelectedDayIndex(0);
  };

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
          onChangeDays={handleChangeDays}
          activeWeek={activeWeek}
          onChangeWeek={handleChangeWeek}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={setSelectedDayIndex}
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
