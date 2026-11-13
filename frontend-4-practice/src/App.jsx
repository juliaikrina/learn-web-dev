import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Stepper from './components/Stepper.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import CalendarGrid from './components/CalendarGrid.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import Footer from './components/Footer.jsx';
import { fetchToday, fetchSlots } from './api.js';

function App() {
  // «Сегодня» с сервера: { day, month, year }
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  // Какой месяц показан в календаре
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  // Выбранный день и время
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты выбранного дня
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // 1. При открытии страницы загружаем «сегодня»
  useEffect(() => {
    let ignore = false;

    fetchToday()
      .then((data) => {
        if (ignore) return;
        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
        setSelectedMonth(data.month);
        setSelectedYear(data.year);
      })
      .catch(() => {
        if (!ignore) setTodayError('Не удалось загрузить страницу. Попробуйте позже.');
      })
      .finally(() => {
        if (!ignore) setTodayLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 2. Загружаем слоты при смене выбранного дня (и когда стало известно «сегодня»)
  useEffect(() => {
    if (selectedDay === null) return;

    let ignore = false;
    setSlotsLoading(true);
    setSlotsError(null);

    fetchSlots({ day: selectedDay, month: selectedMonth, year: selectedYear })
      .then((data) => {
        // Защита от гонок: игнорируем ответ на неактуальную дату
        const isActual =
          data.date.day === selectedDay &&
          data.date.month === selectedMonth &&
          data.date.year === selectedYear;
        if (ignore || !isActual) return;
        setSlots(data.slots);
      })
      .catch(() => {
        if (!ignore) setSlotsError('Не удалось загрузить слоты. Попробуйте выбрать день ещё раз.');
      })
      .finally(() => {
        if (!ignore) setSlotsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDay, selectedMonth, selectedYear]);

  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setSelectedTime(null);
  }

  function handleSlotClick(time) {
    setSelectedTime(time);
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  let content;

  if (todayLoading) {
    content = <p className="page-subtitle">Загрузка…</p>;
  } else if (todayError) {
    content = <p className="status-error">{todayError}</p>;
  } else {
    const todayDate = new Date(today.year, today.month, today.day);

    content = (
      <>
        <div className="booking-grid">
          <section className="card calendar-section" aria-label="Календарь">
            <CalendarHeader
              month={currentMonth}
              year={currentYear}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
            />
            <CalendarGrid
              month={currentMonth}
              year={currentYear}
              today={todayDate}
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onDayClick={handleDayClick}
            />
          </section>

          <section className="card slots-section" aria-label="Свободное время">
            <div className="slots-top">
              <h2 className="section-title">Доступное время</h2>
              <div className="slots-legend">
                <span className="legend-tag"><i className="dot free"></i>Свободно</span>
                <span className="legend-tag"><i className="dot busy"></i>Занято</span>
              </div>
            </div>
            <TimeSlots
              slots={slots}
              loading={slotsLoading}
              error={slotsError}
              selectedTime={selectedTime}
              onSlotClick={handleSlotClick}
            />
          </section>
        </div>

        <BookingBottomBar
          day={selectedDay}
          month={selectedMonth}
          year={selectedYear}
          time={selectedTime}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <Stepper />

      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Выберите дату и время</h1>
            <p className="page-subtitle">
              Мастер: Артём Соколов &bull; Мужская стрижка (60 мин, 2 000 ₽)
            </p>
          </div>

          {content}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;