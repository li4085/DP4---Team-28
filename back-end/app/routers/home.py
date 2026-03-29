from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from sqlalchemy import text
from app.database import get_session
from app.models import Schedule
from app.models import History

router = APIRouter(prefix="/home", tags =["Home"])

@router.get("/")
def get_home():
    return {"message": "Welcome to the home page"}