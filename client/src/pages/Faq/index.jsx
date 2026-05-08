import { useMemo, useState } from 'react';
import { FAQ_CATEGORIES, FAQ_ITEMS } from './faqData';
import './Faq.css';

function FaqCategoryTabs({ activeId, onChange }) {
  return (
    <div className="faq-categories" role="tablist" aria-label="Категорії питань">
      {FAQ_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={activeId === cat.id}
          className={`faq-categories__btn${activeId === cat.id ? ' faq-categories__btn--active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

function FaqAccordionItem({ id, question, answer, sources, isOpen, onToggle }) {
  const panelId = `faq-panel-${id}`;
  const triggerId = `faq-trigger-${id}`;
  const sourcesTitleId = `faq-sources-${id}`;
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const sourcesHeading = hasSources && sources.length === 1 ? 'Джерело' : 'Джерела';

  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button
        type="button"
        id={triggerId}
        className="faq-item__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <p className="faq-item__question">{question}</p>
        <svg
          className="faq-item__chevron"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`faq-item__panel${isOpen ? ' faq-item__panel--open' : ''}`}
      >
        <div className="faq-item__panel-inner">
          <div className="faq-item__answer">
            <p>{answer}</p>

            {hasSources && (
              <section className="faq-item__sources" aria-labelledby={sourcesTitleId}>
                <h3 id={sourcesTitleId} className="faq-item__sources-title">
                  {sourcesHeading}
                </h3>
                <ul className="faq-item__sources-list">
                  {sources.map((source) => (
                    <li key={source.url}>
                      <a
                        className="faq-item__source-link"
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${source.label} (відкрити у новій вкладці)`}
                      >
                        <span className="faq-item__source-label">{source.label}</span>
                        {source.type && (
                          <span className="faq-item__source-type">{source.type}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqEmptyState({ onReset }) {
  return (
    <div className="faq-empty">
      <div className="faq-empty__icon" aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          <path d="M11 8v4M11 14h.01" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="faq-empty__title">Немає питань у цій категорії</h2>
      <p className="faq-empty__text">
        Спробуйте обрати іншу тему або перегляньте всі питання — відповіді можуть з’явитися пізніше.
      </p>
      <button
        type="button"
        className="faq-categories__btn faq-categories__btn--active"
        style={{ marginTop: '1.25rem' }}
        onClick={onReset}
      >
        Показати всі
      </button>
    </div>
  );
}

function Faq() {
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  const handleCategoryChange = (id) => {
    setCategory(id);
    setOpenId(null);
  };

  const visibleItems = useMemo(() => {
    if (category === 'all') return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === category);
  }, [category]);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="faq-page">
      <section className="faq-hero faq-hero--centered">
        <div className="faq-hero__glow" />
        <div className="faq-hero__content">
          <div className="faq-hero__icon-box">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9 10h.01M15 10h.01" />
              <path d="M9.5 15a3.5 3.5 0 005 0" />
            </svg>
          </div>
          <div>
            <h1 className="faq-hero__title">FAQ</h1>
            <p className="faq-hero__subtitle">
              Короткі відповіді про тренування, харчування, відновлення, калькулятори та роботу з
              платформою — без зайвого тексту.
            </p>
          </div>
        </div>
      </section>

      <div className="faq-body">
        <FaqCategoryTabs activeId={category} onChange={handleCategoryChange} />

        {visibleItems.length === 0 ? (
          <FaqEmptyState onReset={() => setCategory('all')} />
        ) : (
          <div className="faq-list">
            {visibleItems.map((item) => (
              <FaqAccordionItem
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                sources={item.sources}
                isOpen={openId === item.id}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        )}

        <aside className="faq-helper">
          <span className="faq-helper__dot" aria-hidden="true" />
          <div>
            <p className="faq-helper__title">Потрібна індивідуальна консультація?</p>
            <p className="faq-helper__text">
              Відповіді тут носять загальний характер. Для діагностики та персонального плану
              зверніться до лікаря або сертифікованого тренера.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Faq;
