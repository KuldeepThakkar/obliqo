from datetime import datetime, timedelta
from typing import Tuple
from app.models import Job


def detect_ghost_job(job: Job) -> Tuple[bool, str, int]:
    """
    Detect if a job is likely a ghost posting
    
    Returns: (is_ghost, warning_message, quality_score)
    """
    
    red_flags = []
    quality_score = 100
    
    # 1. Job age check
    try:
        posted = datetime.fromisoformat(job.posted_date)
        days_old = (datetime.now() - posted).days
        
        if days_old > 90:
            red_flags.append(f"Posted {days_old} days ago")
            quality_score -= 40
        elif days_old > 60:
            red_flags.append(f"Posted {days_old} days ago")
            quality_score -= 25
        elif days_old > 30:
            red_flags.append(f"Posted {days_old} days ago")
            quality_score -= 10
    except:
        red_flags.append("Unknown posting date")
        quality_score -= 15
    
    # 2. Description quality
    if len(job.description) < 100:
        red_flags.append("Very short description")
        quality_score -= 20
    elif len(job.description) < 200:
        red_flags.append("Brief description")
        quality_score -= 10
    
    # Check for vague language
    vague_phrases = [
        'competitive salary', 'fast-paced environment',
        'self-starter', 'rockstar', 'ninja', 'guru'
    ]
    desc_lower = job.description.lower()
    vague_count = sum(1 for phrase in vague_phrases if phrase in desc_lower)
    
    if vague_count >= 3:
        red_flags.append("Overly generic description")
        quality_score -= 15
    
    # 3. Requirements clarity
    if len(job.requirements) < 3:
        red_flags.append("Unclear requirements")
        quality_score -= 20
    elif len(job.requirements) > 15:
        red_flags.append("Excessive requirements (unicorn hunting)")
        quality_score -= 15
    
    # 4. Company information
    if job.company.lower() in ['confidential', 'stealth', 'undisclosed', 'unknown']:
        red_flags.append("Anonymous company")
        quality_score -= 25
    
    # 5. Suspicious patterns in title
    title_lower = job.title.lower()
    suspicious_words = ['urgent', 'immediate', 'asap', 'rockstar', 'ninja', 'guru']
    if any(word in title_lower for word in suspicious_words):
        red_flags.append("Suspicious job title")
        quality_score -= 10
    
    # Determine if ghost job
    is_ghost = quality_score < 50
    
    if is_ghost:
        warning = f"⚠️ Ghost Job Warning ({quality_score}/100): " + ", ".join(red_flags)
    elif quality_score < 70:
        warning = f"⚠️ Low Quality ({quality_score}/100): " + ", ".join(red_flags)
    else:
        warning = ""
    
    return is_ghost, warning, quality_score


def check_duplicate_posting(job: Job, all_jobs: list) -> bool:
    """Check if this job is a duplicate repost"""
    # Simple duplicate detection
    for other_job in all_jobs:
        if other_job.job_id == job.job_id:
            continue
        
        # Same company and very similar title
        if (job.company.lower() == other_job.company.lower() and
            similarity_ratio(job.title.lower(), other_job.title.lower()) > 0.8):
            return True
    
    return False


def similarity_ratio(s1: str, s2: str) -> float:
    """Simple string similarity"""
    words1 = set(s1.split())
    words2 = set(s2.split())
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1 & words2
    union = words1 | words2
    
    return len(intersection) / len(union)
