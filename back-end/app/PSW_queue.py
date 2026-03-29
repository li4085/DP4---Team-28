from sqlmodel import SQLModel, Field
from typing import Optional

class PSWQueue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_name: str
    priority: int = Field(default=0)  # 0 = normal, 1 = emergency