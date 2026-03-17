import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error } = this.state;

    return (
      <div className="error-boundary">
        <div className="error-boundary__icon" aria-hidden="true">
          ⚠️
        </div>
        <h1 className="error-boundary__title">Щось пішло не так</h1>
        <p className="error-boundary__desc">
          Виникла неочікувана помилка. Спробуйте перезавантажити сторінку або поверніться пізніше.
        </p>
        {import.meta.env.DEV && error?.message && (
          <p className="error-boundary__dev-msg">{error.message}</p>
        )}
        <div className="error-boundary__actions">
          <button className="error-boundary__btn" onClick={() => window.location.reload()}>
            Перезавантажити сторінку
          </button>
          <a className="error-boundary__btn error-boundary__btn--secondary" href="/report">
            Повідомити про проблему
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
