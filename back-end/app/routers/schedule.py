from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Schedule, History
from app.routers.patients import get_current_patient

router = APIRouter(prefix="/schedule", tags=["Schedule"])

@router.post("/", response_model=Schedule)
def create_scheduled_task(task: Schedule, token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    task.patient_id = patient_id
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/", response_model=list[Schedule])
def get_schedule(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    query = select(Schedule).where(Schedule.patient_id == patient_id)
    results = session.exec(query).all()
    return results

@router.post("/{task_id}/complete")
def complete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Schedule, task_id)
    completed_task = History(patient_id=task.patient_id, task=task.task, time=task.time, date=task.date)
    session.add(completed_task)
    session.delete(task)
    session.commit()
    return {"message": f"Task {task_id} successfully moved to History!"}