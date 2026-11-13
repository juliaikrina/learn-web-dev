from dataclasses import dataclass
from datetime import datetime, time as dtime


# ---------- Заглушки (если у вас уже есть свои, не копируйте) ----------
@dataclass
class Master:
    master_id: int
    name: str


@dataclass
class Service:
    service_id: int
    title: str


masters = [Master(1, "Артём Соколов")]
services = [Service(1, "Мужская стрижка")]


def get_master(master_id: int):
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int):
    for service in services:
        if service.service_id == service_id:
            return service
    return None
# -----------------------------------------------------------------------

# Часы работы салона
WORK_START = dtime(8, 0)
WORK_END = dtime(20, 0)


def is_working_time(time_str: str) -> bool:
    """Время вида 'HH:MM' попадает в часы работы салона."""
    try:
        t = datetime.strptime(time_str, "%H:%M").time()
    except ValueError:
        return False  # неправильный формат, например "abc"
    return WORK_START <= t <= WORK_END


@dataclass
class Appointment:
    id: int
    client_name: str
    master_id: int
    service_id: int
    time: str

    def __post_init__(self):
        # Объект создаётся только если все поля заполнены
        if not self.client_name.strip():
            raise ValueError("Не указано имя клиента")
        if not self.master_id or not self.service_id:
            raise ValueError("Не указан мастер или услуга")
        if not self.time.strip():
            raise ValueError("Не указано время")


appointments = []


def create_appointment(client_name: str,
                       master_id: int,
                       service_id: int,
                       time: str,
) -> Appointment | None:
    master = get_master(master_id)
    service = get_service(service_id)

    if master is None or service is None:
        return None

    # Задание 2: только в часы работы салона
    if not is_working_time(time):
        return None

    try:
        appointment = Appointment(
            id=len(appointments) + 1,
            client_name=client_name,
            master_id=master.master_id,
            service_id=service.service_id,
            time=time,
        )
    except ValueError:
        return None  # поля заполнены не полностью

    appointments.append(appointment)
    return appointment


# ---------- Проверка ----------
first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")

print("Список записей:")
for appointment in appointments:
    print(appointment.client_name, appointment.time)

# Некорректные записи: в список не попадут
no_correct_appointment = create_appointment("", 1, 1, "12:00")        # пустое имя
night_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")  # вне часов работы
print(no_correct_appointment, night_appointment)  # None None
print(len(appointments))  # 2: некорректные записи не добавились