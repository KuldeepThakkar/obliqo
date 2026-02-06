from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class UserProfile(BaseModel):
    """User profile with skills, experience, and preferences"""
    user_id: str
    skills: List[str]
    experience_years: int
    experience_level: str = Field(..., description="Entry, Mid, Senior, or Lead")
    preferred_roles: List[str]
    preferred_locations: List[str]
    career_goals: str
    resume_text: Optional[str] = None


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
