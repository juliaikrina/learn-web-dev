// JavaScript для страницы выбора даты и времени.
//
// ЗАДАНИЕ
// ========
// Оживить свою свёрстанную страницу. Скорее всего на ней будет работать:
//   1. При открытии страницы выбрать день по умолчанию.
//   2. По клику на день — день становится выбранным,
//      слоты обновляются.
//   3. По клику на слот — время становится выбранным,
//      попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы.
//   5. Дни раньше «сегодня» нельзя выбрать.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// ГДЕ ЖИВУТ ДАННЫЕ
// ----------------
// Слотов пока нет с сервера. Захардкодьте массив в этом файле.
// Формат слота: { time: "10:00", available: true }.
// «Сегодня» можно взять из new Date() или захардкодить —
// как удобнее для проверки.
//
// СТРУКТУРА КОДА
// --------------
// Разделите код на смысловые части комментариями:
//   1. Данные (слоты, «сегодня»).
//   2. Состояние (месяц, день, время, слоты).
//   3. Чистые функции (для работы с датами).
//   4. Отрисовка и обработчики.
//   5. Инициализация.
//
// ЧИСТЫЕ ФУНКЦИИ
// --------------
// Если понадобится строить сетку календаря — вот функция,
// которую можно использовать. Она не зависит от DOM,
// просто принимает год и месяц и возвращает массив недель.
//
// function buildCalendarGrid(year, month) {
//   const firstDay = new Date(year, month, 1);
//   const lastDay = new Date(year, month + 1, 0);
//   const daysInMonth = lastDay.getDate();
//   const startDayOfWeek = firstDay.getDay();
//   const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
//   const prevMonthLastDay = new Date(year, month, 0).getDate();
//
//   const cells = [];
//
//   for (let i = offset - 1; i >= 0; i--) {
//     cells.push({ day: prevMonthLastDay - i, otherMonth: true });
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     cells.push({ day: d, otherMonth: false });
//   }
//   const totalCells = Math.ceil(cells.length / 7) * 7;
//   let nextDay = 1;
//   while (cells.length < totalCells) {
//     cells.push({ day: nextDay, otherMonth: true });
//     nextDay++;
//   }
//
//   const weeks = [];
//   for (let i = 0; i < cells.length; i += 7) {
//     weeks.push(cells.slice(i, i + 7));
//   }
//   return weeks;
// }

// Начните писать код здесь.
/* =========================================================
   1. ДАННЫЕ И КОНСТАНТЫ
   ========================================================= */
const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'
];

// Базовое расписание на день
const BASE_SLOTS = [
  '10:00', '11:00', '12:00', '13:30',
  '15:00', '16:30', '18:00', '19:30'
];

// Функция генерации слотов для конкретного дня (чтобы на разные даты занятые окна менялись)
function getSlotsForDate(year, month, day) {
  return BASE_SLOTS.map((time, index) => {
    // Имитируем занятые слоты в зависимости от числа месяца
    const isBusy = (day + index) % 4 === 0;
    return {
      time: time,
      busy: isBusy
    };
  });
}

/* =========================================================
   2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ (STATE)
   ========================================================= */
const todayDate = new Date();
// Обнуляем время для корректного сравнения дат
todayDate.setHours(0, 0, 0, 0);

const state = {
  currentYear: todayDate.getFullYear(),
  currentMonth: todayDate.getMonth(), // 0-11 (0 = Январь)
  selectedDay: todayDate.getDate(),
  selectedMonth: todayDate.getMonth(),
  selectedYear: todayDate.getFullYear(),
  selectedTime: null,
  slots: []
};

/* =========================================================
   3. ЧИСТЫЕ ФУНКЦИИ (РАБОТА С ДАТАМИ)
   ========================================================= */
function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(day, month, year, today) {
  if (!day) return false;
  const candidate = new Date(year, month, day);
  return compareDates(candidate, today) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  // Преобразуем день недели (0=Вс -> 6, 1=Пн -> 0)
  let startWeekday = firstDayOfMonth.getDay() - 1;
  if (startWeekday === -1) startWeekday = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let currentWeek = new Array(startWeekday).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/* =========================================================
   4. ФУНКЦИИ РЕНДЕРА
   ========================================================= */
function renderCalendar() {
  const monthTitleEl = document.getElementById('calendar-month-title');
  const daysGridEl = document.getElementById('calendar-days-grid');

  if (!monthTitleEl || !daysGridEl) return;

  // Обновляем заголовок: "Ноябрь 2026"
  monthTitleEl.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  weeks.forEach(week => {
    week.forEach(day => {
      if (day === null) {
        // Пустая ячейка до начала или после конца месяца
        html += `<div class="day-empty"></div>`;
        return;
      }

      const selectable = isDateSelectable(day, state.currentMonth, state.currentYear, todayDate);
      const isSelected =
        day === state.selectedDay &&
        state.currentMonth === state.selectedMonth &&
        state.currentYear === state.selectedYear;

      const classes = ['day-btn'];
      if (!selectable) classes.push('disabled');
      if (isSelected) classes.push('selected');

      html += `
        <button
          type="button"
          class="${classes.join(' ')}"
          data-day="${day}"
          ${!selectable ? 'disabled' : ''}
        >
          ${day}
        </button>
      `;
    });
  });

  daysGridEl.innerHTML = html;

  // Вешаем обработчики на свежесозданные кнопки дней
  const dayButtons = daysGridEl.querySelectorAll('.day-btn:not(.disabled)');
  dayButtons.forEach(btn => {
    btn.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  const slotsGridEl = document.getElementById('time-slots-grid');
  if (!slotsGridEl) return;

  let html = '';

  state.slots.forEach(slot => {
    const isSelected = slot.time === state.selectedTime;
    const classes = ['slot-btn'];
    if (slot.busy) classes.push('busy');
    if (isSelected) classes.push('selected');

    html += `
      <button
        type="button"
        class="${classes.join(' ')}"
        data-time="${slot.time}"
        ${slot.busy ? 'disabled' : ''}
      >
        ${slot.time}
      </button>
    `;
  });

  slotsGridEl.innerHTML = html;

  // Вешаем обработчики на свободные слоты времени
  const slotButtons = slotsGridEl.querySelectorAll('.slot-btn:not(.busy)');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  const infoEl = document.getElementById('selected-datetime-text');
  const nextBtn = document.getElementById('next-step-btn');

  if (infoEl) {
    if (state.selectedDay !== null) {
      const dateObj = new Date(state.selectedYear, state.selectedMonth, state.selectedDay);
      const weekdayName = DAYS_OF_WEEK[dateObj.getDay()];
      const monthName = MONTHS_GENITIVE[state.selectedMonth];
      const timePart = state.selectedTime ? ` • ${state.selectedTime}` : ' • время не выбрано';

      // Формат: "Пятница, 13 ноября 2026 • 13:30"
      infoEl.textContent = `${weekdayName}, ${state.selectedDay} ${monthName} ${state.selectedYear}${timePart}`;
    } else {
      infoEl.textContent = 'Выберите дату и время';
    }
  }

  // Блокируем кнопку "Далее", если время ещё не выбрано
  if (nextBtn) {
    nextBtn.disabled = !state.selectedTime;
  }
}

/* =========================================================
   5. ОБРАБОТЧИКИ СОБЫТИЙ
   ========================================================= */
function onDayClick(event) {
  const clickedDay = Number(event.currentTarget.dataset.day);

  state.selectedDay = clickedDay;
  state.selectedMonth = state.currentMonth;
  state.selectedYear = state.currentYear;

  // Обязательно сбрасываем выбранное время при смене дня
  state.selectedTime = null;
  state.slots = getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay);

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const clickedTime = event.currentTarget.dataset.time;
  state.selectedTime = clickedTime;

  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  const prevBtn = document.getElementById('prev-month-btn');
  const nextBtn = document.getElementById('next-month-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.currentMonth -= 1;
      if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.currentMonth += 1;
      if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

function setupNextButton() {
  const nextBtn = document.getElementById('next-step-btn');
  if (!nextBtn) return;

  nextBtn.addEventListener('click', () => {
    if (!state.selectedTime) return;
    const monthName = MONTHS_GENITIVE[state.selectedMonth];
    alert(`Вы записаны на ${state.selectedDay} ${monthName} ${state.selectedYear} в ${state.selectedTime}`);
  });
}

/* =========================================================
   6. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
   ========================================================= */
function init() {
  // Загружаем слоты для дня по умолчанию (сегодня)
  state.slots = getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay);

  // Выбираем первый свободный слот по умолчанию, чтобы экран сразу был заполнен
  const firstFreeSlot = state.slots.find(slot => !slot.busy);
  if (firstFreeSlot) {
    state.selectedTime = firstFreeSlot.time;
  }

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
  setupNextButton();
}

document.addEventListener('DOMContentLoaded', init);
