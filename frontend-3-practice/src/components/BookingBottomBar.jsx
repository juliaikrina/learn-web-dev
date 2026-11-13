import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../data/date.js';

function BookingBottomBar({ day, month, year, time }) {
  const weekday = DAYS_OF_WEEK[new Date(year, month, day).getDay()];
  const dateText = `${weekday}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;
  const text = time ? `${dateText}, ${time}` : dateText;

  return (
    <div className="bottom-bar">
      <div className="selected-summary">
        <span className="summary-caption">Выбранное время записи:</span>
        <strong className="summary-value">{text}</strong>
      </div>
      <div className="bottom-actions">
        <a href="#" className="btn-secondary">&larr; Назад</a>
        <button type="button" className="btn-primary" disabled={!time}>
          Далее &rarr;
        </button>
      </div>
    </div>
  );
}

export default BookingBottomBar;
