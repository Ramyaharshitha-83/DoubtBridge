from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import date
from fastapi import Security
from fastapi import Depends

from ai_service import generate_doubt_solution
from database import engine, SessionLocal
from models import Base, User
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fictional-invention-jj4jgwpj66qcqvpw-3000.app.github.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Schemas
# ----------------------------

class DoubtRequest(BaseModel):
    question: str
    language: str


class AuthRequest(BaseModel):
    email: str
    password: str


# ----------------------------
# Register Route
# ----------------------------

@app.post("/register")
def register(data: AuthRequest):
    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        daily_question_count=0,
        last_reset_date=date.today()
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


# ----------------------------
# Login Route
# ----------------------------

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ----------------------------
# Protected Ask Doubt Route
# ----------------------------

@app.post("/ask-doubt")
def ask_doubt(
    data: DoubtRequest,
    token: str = Security(oauth2_scheme)
):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    db = SessionLocal()
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Reset daily count if new day
    if user.last_reset_date != date.today():
        user.daily_question_count = 0
        user.last_reset_date = date.today()

    if user.daily_question_count >= 5:
        raise HTTPException(
            status_code=403,
            detail="Daily limit reached. Upgrade to Pro."
        )

    try:
        answer = generate_doubt_solution(data.question, data.language)
    except RuntimeError as exc:
        # propagate GenAI client errors as a 502 so the frontend can react
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc)
        )

    user.daily_question_count += 1
    db.commit()

    return {
        "answer": answer,
        "remaining_questions": 5 - user.daily_question_count
    }