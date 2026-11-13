from typing import Annotated

from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from sqlalchemy import create_engine, select, String, Float
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, mapped_column, sessionmaker, Session
)

# ---------- Подключение к SQLite ----------
DATABASE_URL = "sqlite:///./salon.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


# ---------- Модели БД ----------
class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    specialization: Mapped[str] = mapped_column(String(100))


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int]
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(100))
    duration: Mapped[int]  # в минутах
    price: Mapped[float] = mapped_column(Float)


# ---------- Pydantic-модели ----------
class MasterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str


# Непустая строка до 100 символов (пробелы по краям обрезаются)
ShortText = Annotated[str, StringConstraints(strip_whitespace=True,
                                             min_length=1,
                                             max_length=100)]


# Задание 1: модель для создания услуги
class ServiceCreate(BaseModel):
    categoryId: int = Field(ge=1)           # id категории
    title: ShortText                        # название: 1-100 символов
    desc: ShortText                         # описание: 1-100 символов
    duration: int = Field(ge=30, le=180)    # минуты: от 30 до 3 часов
    price: float = Field(gt=0)              # стоимость строго больше 0


class ServiceOut(BaseModel):
    id: int
    categoryId: int
    title: str
    desc: str
    duration: int
    price: float


def service_to_out(service: Service) -> ServiceOut:
    return ServiceOut(
        id=service.id,
        categoryId=service.category_id,
        title=service.title,
        desc=service.description,
        duration=service.duration,
        price=service.price,
    )


class Category(BaseModel):
    id: int
    name: str
    servicesCount: int


# Создаём таблицы, если их ещё нет (masters и services)
Base.metadata.create_all(engine)


# Начальные данные мастеров (один раз, пока таблица пустая)
def seed_masters():
    with SessionLocal() as db:
        if db.query(Master).count() == 0:
            db.add_all([
                Master(name="Артём Соколов", specialization="Барбер"),
                Master(name="Дмитрий Волков", specialization="Барбер"),
                Master(name="Максим Орлов", specialization="Барбер"),
                Master(name="Илья Корнев", specialization="Мастер по бороде"),
                Master(name="Роман Белов", specialization="Мастер по бороде"),
            ])
            db.commit()


seed_masters()

categories = [
    Category(id=1, name="Мужская стрижка", servicesCount=3),
    Category(id=2, name="Стрижка + борода", servicesCount=2),
    Category(id=3, name="Моделирование бороды", servicesCount=2),
    Category(id=2, name="Борода и усы", servicesCount=3),
        Category(id=3, name="Комплексные услуги", servicesCount=3),
]



# Сессия БД для каждого запроса
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()


# ---------- Мастера ----------
@app.get("/masters", response_model=list[MasterOut])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = select(Master)
    if specialization:
        query = query.where(Master.specialization == specialization)
    return db.scalars(query).all()


@app.get("/masters/{master_id}", response_model=MasterOut)
def get_master_by_id(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master


# ---------- Категории ----------
@app.get("/categories", response_model=list[Category])
def get_categories():
    return categories


@app.get("/categories/{category_id}", response_model=Category)
def get_category(category_id: int):
    for category in categories:
        if category.id == category_id:
            return category
    return PlainTextResponse("Category not found", status_code=404)


# ---------- Задание 2: услуги ----------
@app.post("/services", response_model=ServiceOut, status_code=201)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    # Услуга добавляется только в существующую категорию
    if not any(c.id == data.categoryId for c in categories):
        raise HTTPException(status_code=404, detail="Category not found")

    service = Service(
        category_id=data.categoryId,
        title=data.title,
        description=data.desc,
        duration=data.duration,
        price=data.price,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service_to_out(service)


# Список услуг (чтобы проверить, что запись попала в БД)
@app.get("/services", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    return [service_to_out(s) for s in db.scalars(select(Service)).all()]

