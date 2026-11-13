async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }
  return response.json();
}

// «Сегодня» с сервера: { day, month, year }
export function fetchToday() {
  return request('/api/booking/today');
}

// Слоты на дату: { date, slots }. date = { day, month, year }
export function fetchSlots(date) {
  const { day, month, year } = date;
  return request(`/api/slots?day=${day}&month=${month}&year=${year}`);
}