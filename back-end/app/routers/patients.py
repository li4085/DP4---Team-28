from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Patient
import hashlib

router = APIRouter(prefix="/patients", tags=["Patients"])

active_sessions = {}

@router.post("/signup", response_model=Patient)
def signup(patient: Patient, session: Session = Depends(get_session)):
    patient.password = hashlib.sha256(patient.password.encode()).hexdigest()
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient

@router.post("/login")
def login(username: str, password: str, session: Session = Depends(get_session)):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    query = select(Patient).where(Patient.username == username, Patient.password == hashed)
    patient = session.exec(query).first()
    
    if not patient:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = hashlib.sha256(f"{username}{password}".encode()).hexdigest()
    active_sessions[token] = patient.id
    return {"token": token, "name": patient.name}

def get_current_patient(token: str) -> int:
    if token not in active_sessions:
        raise HTTPException(status_code=401, detail="Not logged in")
    return active_sessions[token]