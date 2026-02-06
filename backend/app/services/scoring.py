from typing import Tuple
from app.models import UserProfile, Job


def calculate_fit_score(
    profile: UserProfile,
    job: Job,
    semantic_score: float
) -> Tuple[float, dict]:
    """
    Calculate comprehensive fit score combining multiple factors
    
    Weights:
    - Semantic similarity: 40%
    - Skill overlap: 30%
    - Experience alignment: 20%
    - Location/preference match: 10%
    """
    
    # 1. Semantic similarity (already 0-100)
    semantic_component = semantic_score * 0.4
    
    # 2. Skill overlap
    user_skills_lower = [s.lower() for s in profile.skills]
    job_requirements_lower = [r.lower() for r in job.requirements]
    
    matched_skills = set(user_skills_lower) & set(job_requirements_lower)
    skill_overlap_ratio = len(matched_skills) / len(job_requirements_lower) if job_requirements_lower else 0
    skill_component = skill_overlap_ratio * 100 * 0.3
    
    # 3. Experience alignment
    experience_match = calculate_experience_match(profile.experience_level, job.experience_required)
    experience_component = experience_match * 0.2
    
    # 4. Location/preference match
    location_match = calculate_location_match(profile.preferred_locations, job.location, job.is_remote)
    role_match = calculate_role_match(profile.preferred_roles, job.title)
    preference_component = ((location_match + role_match) / 2) * 0.1
    
    # Total score
    total_score = semantic_component + skill_component + experience_component + preference_component
    
    # Breakdown for debugging/explanation
    breakdown = {
        'semantic_score': round(semantic_score, 2),
        'skill_overlap_ratio': round(skill_overlap_ratio, 2),
        'experience_match': round(experience_match, 2),
        'location_match': round(location_match, 2),
        'role_match': round(role_match, 2),
        'components': {
            'semantic': round(semantic_component, 2),
            'skill': round(skill_component, 2),
            'experience': round(experience_component, 2),
            'preference': round(preference_component, 2)
        }
    }
    
    return round(total_score, 2), breakdown


def calculate_experience_match(user_level: str, job_level: str) -> float:
    """Calculate experience level alignment (0-100)"""
    levels = {
        'entry': 1,
        'mid': 2,
        'senior': 3,
        'lead': 4,
        'staff': 5
    }
    
    user_rank = levels.get(user_level.lower(), 2)
    job_rank = levels.get(job_level.lower(), 2)
    
    # Perfect match
    if user_rank == job_rank:
        return 100.0
    
    # One level difference
    if abs(user_rank - job_rank) == 1:
        return 70.0
    
    # Overqualified (user higher than job)
    if user_rank > job_rank:
        return 50.0
    
    # Underqualified (user lower than job)
    return 30.0


def calculate_location_match(preferred_locations: list, job_location: str, is_remote: bool) -> float:
    """Calculate location match (0-100)"""
    if is_remote:
        return 100.0
    
    job_loc_lower = job_location.lower()
    for pref in preferred_locations:
        if pref.lower() in job_loc_lower or job_loc_lower in pref.lower():
            return 100.0
    
    return 30.0  # Not a perfect match but not a dealbreaker


def calculate_role_match(preferred_roles: list, job_title: str) -> float:
    """Calculate role preference match (0-100)"""
    job_title_lower = job_title.lower()
    
    for role in preferred_roles:
        role_lower = role.lower()
        # Check for substring match
        if role_lower in job_title_lower or job_title_lower in role_lower:
            return 100.0
    
    return 40.0  # Might still be interesting even if not preferred
