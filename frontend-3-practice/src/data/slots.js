// Базовое расписание на день
const BASE_SLOTS = [
  '10:00', '11:00', '12:00', '13:30',
  '15:00', '16:30', '18:00', '19:30',
];

// Слоты для конкретного дня (занятые окна зависят от числа месяца)
export function getSlotsForDate(year, month, day) {
  return BASE_SLOTS.map((time, index) => ({
    time,
    busy: (day + index) % 4 === 0,
  }));
}
