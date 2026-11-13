function TimeSlots({ slots, selectedTime, onSlotClick }) {
  return (
    <div className="slots-grid">
      {slots.map((slot) => {
        const classes = ['slot-btn'];
        if (slot.busy) classes.push('busy');
        if (slot.time === selectedTime) classes.push('selected');

        return (
          <button
            key={slot.time}
            type="button"
            className={classes.join(' ')}
            disabled={slot.busy}
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
