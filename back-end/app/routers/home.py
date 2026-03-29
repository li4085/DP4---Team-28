from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, SQLModel
from app.database import get_session, engine
from app.models import Schedule
from app.PSW_queue import PSWQueue

# Create queue table
SQLModel.metadata.create_all(engine)

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/")
def get_home():
    return {"message": "Welcome to the home page"}

# Add patient to queue (normal)
@router.post("/queue/")
def add_to_queue(patient_name: str, session: Session = Depends(get_session)):
    patient = PSWQueue(patient_name=patient_name, priority=0)
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return {"message": f"{patient_name} added to queue", "patient": patient}

# Add patient to top of queue (emergency)
@router.post("/queue/emergency/")
def emergency_queue(patient_name: str, session: Session = Depends(get_session)):
    patient = PSWQueue(patient_name=patient_name, priority=1)
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return {"message": f"EMERGENCY: {patient_name} added to top of queue", "patient": patient}

# Get full queue (emergencies first)
@router.get("/queue/")
def get_queue(session: Session = Depends(get_session)):
    query = select(PSWQueue).order_by(PSWQueue.priority.desc(), PSWQueue.id)
    results = session.exec(query).all()
    return results

# Add to schedule (same as schedule page)
@router.post("/schedule/")
def add_to_schedule(task: Schedule, session: Session = Depends(get_session)):
    session.add(task)
    session.commit()
    session.refresh(task)
    return task