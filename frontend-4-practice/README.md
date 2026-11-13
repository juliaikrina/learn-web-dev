# Задание 3. Выбор даты и времени на React

Страница барбершопа «КРАФТ БАРБЕРШОП», переписанная с нативного JS на React (Vite).
Вёрстка и стили не менялись — только способ реализации.

## Запуск

```
npm install
npm run dev
```

Откройте адрес, который напишет Vite.

## Структура

- `src/App.jsx` — состояние (`currentMonth`, `currentYear`, `selectedDay`, `selectedTime`, `slots`) и обработчики
- `src/components/` — Header, Stepper, CalendarHeader, CalendarGrid, TimeSlots, BookingBottomBar, Footer
- `src/data/date.js` — чистые функции и константы для работы с датами
- `src/data/slots.js` — данные слотов
- `src/styles/styles.css` — стили из макета без изменений
