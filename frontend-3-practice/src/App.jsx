import { useState } from 'react';
import Header from './components/Header.jsx';
import Stepper from './components/Stepper.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import CalendarGrid from './components/CalendarGrid.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import Footer from './components/Footer.jsx';
import { TODAY } from './data/date.js';
import { getSlotsForDate } from './data/slots.js';

function App() {
  // Какой месяц показан в календаре
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());

  // Выбранный день (по умолчанию — сегодня) и время
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [selectedMonth, setSelectedMonth] = useState(TODAY.getMonth());
  const [selectedYear, setSelectedYear] = useState(TODAY.getFullYear());
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты выбранного дня
  const [slots, setSlots] = useState(() =>
    getSlotsForDate(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())
  );

  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setSelectedTime(null);
    setSlots(getSlotsForDate(currentYear, currentMonth, day));
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
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;
