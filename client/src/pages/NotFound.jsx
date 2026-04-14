import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">Сторінку не знайдено</h1>
      <p className="not-found__hint">
        Можливо, адресу введено з помилкою або сторінку було переміщено.
        <br />
        Скористайтеся навігацією або поверніться на головну.
      </p>
      <div className="not-found__actions">
        <button className="not-found__btn" onClick={() => navigate('/')}>
          На головну
        </button>
        <button
          className="not-found__btn not-found__btn--secondary"
          onClick={() => navigate('/report')}
        >
          Повідомити про проблему
        </button>
      </div>
    </div>
  );
}

export default NotFound;
