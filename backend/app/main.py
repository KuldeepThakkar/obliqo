from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json
from pathlib import Path

from app.models import (
    UserProfile, Job, JobMatch, JobFeedResponse,
    ExplainabilityBreakdown
)
from app.services.matching import get_matcher
from app.services.scoring import calculate_fit_score
from app.services.decision import make_decision, estimate_competition, assess_career_impact
from app.services.explainer import generate_explanation
from app.services.detector import detect_ghost_job

app = FastAPI(
    title="ApplyLess API",
    description="AI-powered job matching that helps you apply less and grow more",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (for hackathon - replace with real DB later)
current_profile: Optional[UserProfile] = None
jobs_database: List[Job] = []


@app.on_event("startup")
async def load_jobs():
    """Load jobs from dataset on startup"""
    global jobs_database
    
    data_path = Path(__file__).parent.parent / "data" / "jobs_dataset.json"
    
    if data_path.exists():
        with open(data_path, 'r', encoding='utf-8') as f:
            jobs_data = json.load(f)
            jobs_database = [Job(**job) for job in jobs_data]
        print(f"✅ Loaded {len(jobs_database)} jobs from dataset")
    else:
        print("⚠️ No jobs dataset found, using empty database")
    
    # Initialize the semantic matcher (loads the model)
    get_matcher()
    print("✅ Semantic matcher initialized")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "ApplyLess API is running",
        "version": "1.0.0",
        "jobs_loaded": len(jobs_database)
    }


@app.post("/api/profile")
async def save_profile(profile: UserProfile):
    """Save or update user profile"""
    global current_profile
    current_profile = profile
    return {
        "message": "Profile saved successfully",
        "user_id": profile.user_id
    }


@app.get("/api/profile")
async def get_profile():
    """Get current user profile"""
    if not current_profile:
        raise HTTPException(status_code=404, detail="No profile found")
    return current_profile


@app.get("/api/jobs", response_model=JobFeedResponse)
async def get_job_feed(
    page: int = 1,
    page_size: int = 20,
    decision_filter: Optional[str] = None  # Apply, Wait, Skip, Avoid
):
    """Get personalized job feed with rankings"""
    
    if not current_profile:
        raise HTTPException(status_code=400, detail="Please create a profile first")
    
    if not jobs_database:
        raise HTTPException(status_code=404, detail="No jobs available")
    
    # Get semantic matcher
    matcher = get_matcher()
    
    # Rank all jobs
    ranked_jobs = matcher.rank_jobs(current_profile, jobs_database)
    
    # Generate full match data for each job
    job_matches = []
    for job, semantic_score in ranked_jobs:
        match = create_job_match(job, semantic_score)
        job_matches.append(match)
    
    # Apply filter if specified
    if decision_filter:
        job_matches = [jm for jm in job_matches if jm.decision == decision_filter]
    
    # Pagination
    total_count = len(job_matches)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_jobs = job_matches[start_idx:end_idx]
    
    return JobFeedResponse(
        jobs=paginated_jobs,
        total_count=total_count,
        page=page,
        page_size=page_size
    )


@app.get("/api/jobs/{job_id}", response_model=JobMatch)
async def get_job_detail(job_id: str):
    """Get detailed analysis for a specific job"""
    
    if not current_profile:
        raise HTTPException(status_code=400, detail="Please create a profile first")
    
    # Find job
    job = next((j for j in jobs_database if j.job_id == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get semantic score
    matcher = get_matcher()
    user_embedding = matcher.create_user_embedding(current_profile)
    job_embedding = matcher.create_job_embedding(job)
    semantic_score = matcher.calculate_similarity(user_embedding, job_embedding)
    
    # Generate full match data
    return create_job_match(job, semantic_score)


def create_job_match(job: Job, semantic_score: float) -> JobMatch:
    """Helper function to create a complete JobMatch object"""
    
    # Calculate fit score
    fit_score, score_breakdown = calculate_fit_score(
        current_profile, job, semantic_score
    )
    
    # Generate explanation
    explanation = generate_explanation(
        current_profile, job, fit_score, score_breakdown
    )
    
    # Make decision
    decision, decision_reason = make_decision(
        fit_score,
        current_profile,
        job,
        explanation.missing_skills,
        explanation.risk_factors
    )
    
    # Estimate competition
    competition_level = estimate_competition(job, fit_score)
    
    # Assess career impact
    career_impact = assess_career_impact(job, current_profile, fit_score)
    
    # Check for ghost job
    is_ghost, ghost_warning, quality_score = detect_ghost_job(job)
    if ghost_warning and ghost_warning not in explanation.risk_factors:
        explanation.risk_factors.insert(0, ghost_warning)
    
    return JobMatch(
        job=job,
        fit_score=fit_score,
        decision=decision,
        decision_reason=decision_reason,
        explanation=explanation,
        competition_level=competition_level,
        career_impact=career_impact
    )


@app.get("/api/stats")
async def get_stats():
    """Get statistics about job matches"""
    
    if not current_profile:
        raise HTTPException(status_code=400, detail="Please create a profile first")
    
    matcher = get_matcher()
    ranked_jobs = matcher.rank_jobs(current_profile, jobs_database)
    
    decisions = {"Apply": 0, "Wait": 0, "Skip": 0, "Avoid": 0}
    
    for job, semantic_score in ranked_jobs:
        match = create_job_match(job, semantic_score)
        decisions[match.decision] += 1
    
    return {
        "total_jobs": len(jobs_database),
        "decisions": decisions,
        "recommendation": f"Focus on the {decisions['Apply']} jobs marked 'Apply'"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
