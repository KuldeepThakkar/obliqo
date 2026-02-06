from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class PersonalInfo(BaseModel):
    full_name: str
    email: str
    phone_number: str
    date_of_birth: Optional[str] = None
    age: Optional[int] = 0
    gender: Optional[str] = None
    address: str
    emergency_address: Optional[str] = None

class OtherProfile(BaseModel):
    platform: str
    url: str

class SocialProfiles(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    other_profiles: List[OtherProfile] = []

class Project(BaseModel):
    id: str
    title: str
    description: str
    technologies: List[str]
    role: Optional[str] = None
    duration: Optional[str] = None
    link: Optional[str] = None

class WorkExperience(BaseModel):
    id: str
    company: str
    position: str
    duration: str
    location: Optional[str] = None
    skills_used: List[str] = []
    description: str
    responsibilities: List[str] = []

class Education(BaseModel):
    id: str
    institution: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: str
    grade: Optional[str] = None
    achievements: List[str] = []

class Certification(BaseModel):
    id: str
    name: str
    issuing_organization: str
    issue_date: str
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None

class Course(BaseModel):
    id: str
    name: str
    provider: str
    completion_date: str
    skills_learned: List[str] = []

class Award(BaseModel):
    id: str
    title: str
    issuer: str
    date: str
    description: Optional[str] = None

class ExtracurricularActivity(BaseModel):
    id: str
    activity: str
    role: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class MedicalInfo(BaseModel):
    has_disabilities: Optional[bool] = False
    disability_details: Optional[str] = None
    requires_accommodations: Optional[bool] = False
    accommodation_details: Optional[str] = None

class WorkPreferences(BaseModel):
    work_mode: str = "Any"
    willing_to_relocate: bool = False

class UserProfile(BaseModel):
    """User profile with skills, experience, and preferences"""
    user_id: str
    personal_info: PersonalInfo
    about_me: Optional[str] = ""
    social_profiles: SocialProfiles
    resume_url: Optional[str] = None
    resume_text: Optional[str] = None
    has_uploaded_resume: bool = False
    skills: List[str]
    experience_years: int
    experience_level: str = Field(..., description="Entry, Mid, Senior, or Lead")
    preferred_roles: List[str]
    preferred_locations: List[str]
    career_goals: str
    projects: List[Project] = []
    work_experience: List[WorkExperience] = []
    education: List[Education] = []
    certifications: List[Certification] = []
    courses: List[Course] = []
    awards: List[Award] = []
    extracurricular_activities: List[ExtracurricularActivity] = []
    medical_info: Optional[MedicalInfo] = None
    work_preferences: WorkPreferences


class Job(BaseModel):
    """Job listing model"""
    job_id: str
    title: str
    company: str
    description: str
    requirements: List[str]
    location: str
    experience_required: str
    posted_date: str
    company_size: Optional[str] = None
    is_remote: bool = False


class SkillGap(BaseModel):
    """Individual skill gap with learning recommendation"""
    skill: str
    importance: str = Field(..., description="High, Medium, Low")
    estimated_learning_time: str
    resources: List[str]


class ExplainabilityBreakdown(BaseModel):
    """Detailed explanation of job match"""
    matched_skills: List[str]
    missing_skills: List[str]
    risk_factors: List[str]
    strengths: List[str]
    skill_gaps: List[SkillGap]


class JobMatch(BaseModel):
    """Job match result with scoring and decision"""
    job: Job
    fit_score: float = Field(..., ge=0, le=100)
    decision: str = Field(..., description="Apply, Wait, Skip, or Avoid")
    decision_reason: str
    explanation: ExplainabilityBreakdown
    competition_level: str = Field(..., description="Low, Medium, High")
    career_impact: str = Field(..., description="Positive, Neutral, Negative")


class JobFeedResponse(BaseModel):
    """Response for job feed endpoint"""
    jobs: List[JobMatch]
    total_count: int
    page: int
    page_size: int
