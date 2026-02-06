from typing import List
from app.models import UserProfile, Job, ExplainabilityBreakdown, SkillGap
from datetime import datetime, timedelta


def generate_explanation(
    profile: UserProfile,
    job: Job,
    fit_score: float,
    score_breakdown: dict
) -> ExplainabilityBreakdown:
    """Generate human-readable explanation of job match"""
    
    # 1. Matched skills
    user_skills_lower = {s.lower(): s for s in profile.skills}
    job_requirements_lower = {r.lower(): r for r in job.requirements}
    
    matched_skills = []
    for skill_lower in user_skills_lower:
        if skill_lower in job_requirements_lower:
            matched_skills.append(user_skills_lower[skill_lower])
    
    # 2. Missing skills
    missing_skills = []
    for req_lower in job_requirements_lower:
        if req_lower not in user_skills_lower:
            missing_skills.append(job_requirements_lower[req_lower])
    
    # 3. Risk factors
    risk_factors = detect_risks(job, profile, fit_score)
    
    # 4. Strengths
    strengths = identify_strengths(profile, job, score_breakdown)
    
    # 5. Skill gaps with learning recommendations
    skill_gaps = generate_skill_gaps(missing_skills)
    
    return ExplainabilityBreakdown(
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        risk_factors=risk_factors,
        strengths=strengths,
        skill_gaps=skill_gaps
    )


def detect_risks(job: Job, profile: UserProfile, fit_score: float) -> List[str]:
    """Detect potential risk factors"""
    risks = []
    
    # Ghost job warning
    try:
        posted = datetime.fromisoformat(job.posted_date)
        days_old = (datetime.now() - posted).days
        if days_old > 60:
            risks.append(f"⚠️ Job posted {days_old} days ago - may be a ghost job")
        elif days_old > 30:
            risks.append(f"⚠️ Job posted {days_old} days ago - verify if still active")
    except:
        pass
    
    # Vague description
    if len(job.description) < 100:
        risks.append("⚠️ Vague job description - may indicate low-quality posting")
    
    # Severe skill gaps
    user_skills_lower = [s.lower() for s in profile.skills]
    job_requirements_lower = [r.lower() for r in job.requirements]
    missing = [req for req in job_requirements_lower if req not in user_skills_lower]
    
    if len(missing) > 5:
        risks.append(f"🚨 Significant skill gaps ({len(missing)} missing skills)")
    
    # Experience misalignment
    levels = {'entry': 1, 'mid': 2, 'senior': 3, 'lead': 4}
    user_level = levels.get(profile.experience_level.lower(), 2)
    job_level = levels.get(job.experience_required.lower(), 2)
    
    if job_level - user_level >= 2:
        risks.append(f"⚠️ Job requires {job.experience_required} but you're {profile.experience_level}")
    
    # Very low fit
    if fit_score < 40:
        risks.append("🚨 Poor overall fit - not aligned with your profile")
    
    # Career regression
    if user_level > job_level + 1:
        risks.append("⚠️ This may be a step down from your current level")
    
    return risks


def identify_strengths(profile: UserProfile, job: Job, score_breakdown: dict) -> List[str]:
    """Identify strengths in the match"""
    strengths = []
    
    # High skill overlap
    if score_breakdown.get('skill_overlap_ratio', 0) >= 0.7:
        strengths.append("✅ Strong skill match - you have most required skills")
    
    # High semantic similarity
    if score_breakdown.get('semantic_score', 0) >= 75:
        strengths.append("✅ Excellent role alignment based on your background")
    
    # Perfect experience match
    if score_breakdown.get('experience_match', 0) >= 90:
        strengths.append("✅ Perfect experience level match")
    
    # Location match
    if score_breakdown.get('location_match', 0) >= 90:
        strengths.append("✅ Matches your location preferences")
    
    # Role preference
    if score_breakdown.get('role_match', 0) >= 90:
        strengths.append("✅ Aligns with your preferred roles")
    
    return strengths


def generate_skill_gaps(missing_skills: List[str]) -> List[SkillGap]:
    """Generate learning recommendations for missing skills"""
    skill_gaps = []
    
    # Skill categorization and learning estimates
    skill_categories = {
        # Programming languages
        'python': ('High', '2-3 months', ['Codecademy Python', 'Python.org Tutorial']),
        'javascript': ('High', '2-3 months', ['freeCodeCamp', 'JavaScript.info']),
        'java': ('High', '3-4 months', ['Oracle Java Tutorials', 'Coursera Java']),
        'typescript': ('Medium', '1-2 weeks', ['TypeScript Handbook', 'TypeScript Course']),
        
        # Frameworks
        'react': ('High', '1-2 months', ['React Docs', 'freeCodeCamp React']),
        'node.js': ('High', '1-2 months', ['Node.js Docs', 'NodeSchool']),
        'django': ('Medium', '3-4 weeks', ['Django Tutorial', 'Django for Beginners']),
        'fastapi': ('Medium', '1-2 weeks', ['FastAPI Docs', 'FastAPI Tutorial']),
        
        # Tools & Platforms
        'docker': ('Medium', '2-3 weeks', ['Docker Getting Started', 'Docker Tutorial']),
        'kubernetes': ('High', '1-2 months', ['Kubernetes Docs', 'Kubernetes Course']),
        'aws': ('High', '2-3 months', ['AWS Free Tier', 'AWS Training']),
        'git': ('Low', '1 week', ['Git Tutorial', 'Pro Git Book']),
        
        # Databases
        'sql': ('High', '3-4 weeks', ['SQLBolt', 'Mode Analytics SQL']),
        'mongodb': ('Medium', '2-3 weeks', ['MongoDB University', 'MongoDB Docs']),
        'postgresql': ('Medium', '2-3 weeks', ['PostgreSQL Tutorial', 'PG Exercises']),
        
        # AI/ML
        'machine learning': ('High', '3-6 months', ['Andrew Ng ML Course', 'fast.ai']),
        'deep learning': ('High', '3-6 months', ['Deep Learning Specialization', 'fast.ai']),
        'nlp': ('High', '2-3 months', ['NLP Course', 'Hugging Face Course']),
    }
    
    for skill in missing_skills[:10]:  # Limit to top 10
        skill_lower = skill.lower()
        
        # Find best match in categories
        matched_category = None
        for category in skill_categories:
            if category in skill_lower or skill_lower in category:
                matched_category = category
                break
        
        if matched_category:
            importance, time, resources = skill_categories[matched_category]
        else:
            # Default for unknown skills
            importance = 'Medium'
            time = '2-4 weeks'
            resources = [f'Search "{skill}" courses on Coursera', f'YouTube "{skill}" tutorials']
        
        skill_gaps.append(SkillGap(
            skill=skill,
            importance=importance,
            estimated_learning_time=time,
            resources=resources
        ))
    
    return skill_gaps
