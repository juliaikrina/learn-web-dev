import { MONTHS_NOMINATIVE } from '../data/date.js';

function CalendarHeader({ month, year, onPrev, onNext }) {
  return (
    <div className="calendar-top">
      <h2 className="section-title">{MONTHS_NOMINATIVE[month]} {year}</h2>
      <div className="month-controls">
        <button type="button" className="arrow-btn" aria-label="Предыдущий месяц" onClick={onPrev}>
          &lsaquo;
        </button>
        <button type="button" className="arrow-btn" aria-label="Следующий месяц" onClick={onNext}>
          &rsaquo;
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;
