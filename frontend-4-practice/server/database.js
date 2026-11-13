export const database = {
  // «Сегодня» по мнению сервера. Месяц 0-индексный (9 = октябрь)
  today: { day: 17, month: 9, year: 2026 },

  // Слоты для чётных дней
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],

  // Слоты для нечётных дней
  slotsOddDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],
};