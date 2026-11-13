import { WEEKDAYS_SHORT, TODAY, buildCalendarGrid, isDateSelectable } from '../data/date.js';

function CalendarGrid({ month, year, selectedDay, selectedMonth, selectedYear, onDayClick }) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <>
      <div className="weekdays-row">
        {WEEKDAYS_SHORT.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>

      <div className="days-grid">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const key = `${weekIndex}-${dayIndex}`;

            if (day === null) {
              return <div key={key} className="day-empty"></div>;
            }

            const selectable = isDateSelectable(day, month, year, TODAY);
            const isSelected =
              day === selectedDay && month === selectedMonth && year === selectedYear;

            const classes = ['day-btn'];
            if (!selectable) classes.push('disabled');
            if (isSelected) classes.push('selected');

            return (
              <button
                key={key}
                type="button"
                className={classes.join(' ')}
                disabled={!selectable}
                onClick={() => onDayClick(day)}
              >
                {day}
              </button>
            );
          })
        )}
      </div>
    </>
  );
}

export default CalendarGrid;
