from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, select, String
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, mapped_column, sessionmaker, Session
)

# ---------- Подключение к SQLite ----------
DATABASE_URL = "sqlite:///./salon.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


# ---------- Задание 1: модель Master (таблица masters) ----------
class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    specialization: Mapped[str] = mapped_column(String(100))


# Схема ответа API
class MasterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str


# Создаём таблицу, если её ещё нет
Base.metadata.create_all(engine)


# Начальные данные (добавляются один раз, пока таблица пустая)
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


# Сессия БД для каждого запроса
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()


# ---------- Задание 2: API мастеров ----------

# GET /masters и GET /masters?specialization=Парикмахер
@app.get("/masters", response_model=list[MasterOut])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = select(Master)
    if specialization:
        query = query.where(Master.specialization == specialization)
    return db.scalars(query).all()


# GET /masters/{master_id}
@app.get("/masters/{master_id}", response_model=MasterOut)
def get_master_by_id(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master


# ---------- Категории из прошлого задания ----------
class Category(BaseModel):
    id: int
    name: str
    servicesCount: int



categories = [
    Category(id=1, name="Мужская стрижка", servicesCount=3),
    Category(id=2, name="Стрижка + борода", servicesCount=2),
    Category(id=3, name="Моделирование бороды", servicesCount=2),
    Category(id=2, name="Борода и усы", servicesCount=3),
        Category(id=3, name="Комплексные услуги", servicesCount=3),
]

@app.get("/categories", response_model=list[Category])
def get_categories():
    return categories


@app.get("/categories/{category_id}", response_model=Category)
def get_category(category_id: int):
    for category in categories:
        if category.id == category_id:
            return category
    return PlainTextResponse("Category not found", status_code=404)