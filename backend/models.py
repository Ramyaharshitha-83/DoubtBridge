from sqlalchemy import Column, Integer, String, Date
from database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    daily_question_count = Column(Integer, default=0)
    last_reset_date = Column(Date, default=date.today)