import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackOrNavigate } from '../hooks/useBackOrNavigate.js';
import { apiFetch } from '../lib/api';

function buildPayload(fields) {
  return {
    ...fields,
    pageUrl: window.location.href,
    client: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform || undefined,
      screen: { w: window.screen.width, h: window.screen.height },
    },
  };
}

function ReportIssue() {
  const navigate = useNavigate();
  const cancelNavigate = useBackOrNavigate('/');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const payload = buildPayload({
      title: title.trim(),
      description: description.trim(),
      ...(steps.trim() && { steps: steps.trim() }),
    });

    try {
      const res = await apiFetch('/api/support/report', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.message || 'Сталася помилка. Спробуйте ще раз.');
        setStatus('error');
        return;
      }

      setTicketId(data.ticketId);
      setStatus('success');
    } catch {
      setErrorMsg("Не вдалося відправити звіт. Перевірте з'єднання.");
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="report">
        <div className="report__success">
          <span className="report__success-icon">✓</span>
          <h2 className="report__success-title">Дякуємо за звернення!</h2>
          <p className="report__success-text">
            Номер звернення: <strong className="report__ticket-id">{ticketId}</strong>
          </p>
          <p className="report__success-hint">Ми розглянемо вашу проблему якнайшвидше.</p>
          <button className="report__btn" onClick={() => navigate('/')}>
            На головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report">
      <h1 className="report__title">Повідомити про проблему</h1>
      <p className="report__subtitle">
        Опишіть проблему — ми намагаємося виправити все якомога швидше.
      </p>

      <form className="report__form" onSubmit={handleSubmit} noValidate>
        <div className="report__field">
          <label className="report__label" htmlFor="report-title">
            Заголовок <span className="report__required">*</span>
          </label>
          <input
            id="report-title"
            className="report__input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Коротко опишіть суть проблеми"
            maxLength={120}
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="report__field">
          <label className="report__label" htmlFor="report-description">
            Опис <span className="report__required">*</span>
          </label>
          <textarea
            id="report-description"
            className="report__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Детально опишіть, що сталося"
            maxLength={2000}
            rows={5}
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="report__field">
          <label className="report__label" htmlFor="report-steps">
            Кроки для відтворення <span className="report__optional">(необов&apos;язково)</span>
          </label>
          <textarea
            id="report-steps"
            className="report__textarea"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="1. Відкрив сторінку…&#10;2. Натиснув кнопку…&#10;3. Побачив помилку…"
            maxLength={2000}
            rows={4}
            disabled={status === 'loading'}
          />
        </div>

        {status === 'error' && <p className="report__error">{errorMsg}</p>}

        <div className="report__actions">
          <button
            type="button"
            className="report__btn report__btn--secondary"
            onClick={cancelNavigate}
            disabled={status === 'loading'}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="report__btn"
            disabled={status === 'loading' || !title.trim() || !description.trim()}
          >
            {status === 'loading' ? 'Відправка…' : 'Надіслати'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportIssue;
