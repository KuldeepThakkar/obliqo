from typing import Tuple
from app.models import Job, UserProfile


def make_decision(
    fit_score: float,
    profile: UserProfile,
    job: Job,
    missing_skills: list,
    risk_factors: list
) -> Tuple[str, str]:
    """
    Determine application recommendation: Apply, Wait, Skip, or Avoid
    
    Returns: (decision, reason)
    """
    
    # AVOID - Critical red flags
    if len(risk_factors) > 0:
        avoid_keywords = ['ghost', 'scam', 'toxic', 'severe mismatch']
        for risk in risk_factors:
            if any(keyword in risk.lower() for keyword in avoid_keywords):
                return "Avoid", f"Critical issues detected: {risk}"
    
    # APPLY - High fit, ready to apply
    if fit_score >= 75:
        if len(missing_skills) <= 1:
            return "Apply", f"Excellent fit ({fit_score}%)! You meet nearly all requirements."
        else:
            return "Apply", f"Strong fit ({fit_score}%) with manageable skill gaps."
    
    # WAIT - Good fit but needs preparation
    if fit_score >= 60:
        if len(missing_skills) <= 3:
            return "Wait", f"Good fit ({fit_score}%), but acquire these skills first: {', '.join(missing_skills[:3])}"
        else:
            return "Wait", f"Decent fit ({fit_score}%), but significant gaps in {len(missing_skills)} skills."
    
    # SKIP - Low fit, better opportunities exist
    if fit_score >= 40:
        return "Skip", f"Moderate fit ({fit_score}%), but there are likely better matches for your profile."
    
    # AVOID - Very poor fit
    return "Avoid", f"Poor fit ({fit_score}%). This role doesn't align with your skills and goals."


def estimate_competition(job: Job, fit_score: float) -> str:
    """
    Estimate competition level for a job
    Returns: Low, Medium, or High
    """
    
    competition_score = 0
    
    # Popular companies attract more applicants
    top_companies = ['google', 'meta', 'amazon', 'microsoft', 'apple', 'netflix']
    if any(comp in job.company.lower() for comp in top_companies):
        competition_score += 3
    
    # Remote jobs are more competitive
    if job.is_remote:
        competition_score += 2
    
    # Senior roles typically have less competition than mid-level
    if 'senior' in job.experience_required.lower() or 'lead' in job.experience_required.lower():
        competition_score -= 1
    elif 'entry' in job.experience_required.lower():
        competition_score += 2
    
    # Generic job titles suggest mass hiring (lower competition per role)
    generic_titles = ['developer', 'engineer', 'analyst']
    if any(title in job.title.lower() for title in generic_titles):
        competition_score += 1
    
    # Your fit affects competition - if you're a good fit, effective competition is lower
    if fit_score >= 80:
        competition_score -= 2
    elif fit_score < 50:
        competition_score += 2
    
    # Classify
    if competition_score >= 4:
        return "High"
    elif competition_score >= 2:
        return "Medium"
    else:
        return "Low"


def assess_career_impact(job: Job, profile: UserProfile, fit_score: float) -> str:
    """
    Assess long-term career impact
    Returns: Positive, Neutral, or Negative
    """
    
    impact_score = 0
    
    # Check if role aligns with career goals
    goals_lower = profile.career_goals.lower()
    job_title_lower = job.title.lower()
    job_desc_lower = job.description.lower()
    
    # Positive indicators in goals
    positive_keywords = ['grow', 'lead', 'senior', 'architect', 'principal', 'advance']
    if any(keyword in goals_lower for keyword in positive_keywords):
        # Check if job offers growth
        if any(keyword in job_title_lower for keyword in ['senior', 'lead', 'principal']):
            impact_score += 2
    
    # Check for skill growth opportunities
    new_skills_offered = [req for req in job.requirements if req.lower() not in [s.lower() for s in profile.skills]]
    if len(new_skills_offered) >= 3:
        impact_score += 1  # Good learning opportunity
    elif len(new_skills_offered) == 0:
        impact_score -= 1  # No growth
    
    # Repetitive role (same as current level)
    if profile.experience_level.lower() in job.experience_required.lower():
        impact_score -= 1  # Lateral move
    
    # Check for career alignment
    if fit_score >= 70:
        impact_score += 1
    elif fit_score < 40:
        impact_score -= 2  # Wrong direction
    
    # Classify
    if impact_score >= 2:
        return "Positive"
    elif impact_score <= -2:
        return "Negative"
    else:
        return "Neutral"
