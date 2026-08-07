# Researcher profile — department, skills, research interests, affiliations
from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Researcher(Base):
    __tablename__ = "researchers"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(200), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    department = Column(String(200), nullable=False)

    institution = Column(String(255), nullable=False)

    designation = Column(String(150), nullable=False)

    research_interests = Column(Text)

    skills = Column(Text)

    affiliation = Column(String(255))