function TimeSlots({ slots, loading, error, selectedTime, onSlotClick }) {
  if (loading) {
    return <p className="page-subtitle">Загрузка слотов…</p>;
  }

  if (error) {
    return <p className="status-error">{error}</p>;
  }

  return (
    <div className="slots-grid">
      {slots.map((slot) => {
        const classes = ['slot-btn'];
        if (!slot.available) classes.push('busy');
        if (slot.time === selectedTime) classes.push('selected');

        return (
          <button
            key={slot.time}
            type="button"
            className={classes.join(' ')}
            disabled={!slot.available}
            onClick={() => onSlotClick(slot.time)}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlots;