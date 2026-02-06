from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict, Tuple
from app.models import UserProfile, Job


class SemanticMatcher:
    """Semantic job matching using sentence transformers"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """Initialize the semantic matching model"""
        print(f"Loading semantic model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Model loaded successfully!")
    
    def create_user_embedding(self, profile: UserProfile) -> np.ndarray:
        """Create embedding from user profile"""
        # Combine all user information into a rich text representation
        user_text = f"""
        Professional Profile:
        Skills: {', '.join(profile.skills)}
        Experience Level: {profile.experience_level} with {profile.experience_years} years
        Preferred Roles: {', '.join(profile.preferred_roles)}
        Career Goals: {profile.career_goals}
        """
        
        if profile.resume_text:
            user_text += f"\nResume: {profile.resume_text}"
        
        embedding = self.model.encode(user_text, convert_to_tensor=False)
        return embedding
    
    def create_job_embedding(self, job: Job) -> np.ndarray:
        """Create embedding from job listing"""
        job_text = f"""
        Job Title: {job.title}
        Company: {job.company}
        Description: {job.description}
        Requirements: {', '.join(job.requirements)}
        Experience Required: {job.experience_required}
        Location: {job.location}
        """
        
        embedding = self.model.encode(job_text, convert_to_tensor=False)
        return embedding
    
    def calculate_similarity(self, user_embedding: np.ndarray, job_embedding: np.ndarray) -> float:
        """Calculate cosine similarity between user and job"""
        # Reshape for sklearn
        user_emb = user_embedding.reshape(1, -1)
        job_emb = job_embedding.reshape(1, -1)
        
        similarity = cosine_similarity(user_emb, job_emb)[0][0]
        # Convert to 0-100 scale
        return float(similarity * 100)
    
    def rank_jobs(self, profile: UserProfile, jobs: List[Job]) -> List[Tuple[Job, float]]:
        """Rank jobs by semantic similarity to user profile"""
        user_embedding = self.create_user_embedding(profile)
        
        job_scores = []
        for job in jobs:
            job_embedding = self.create_job_embedding(job)
            similarity_score = self.calculate_similarity(user_embedding, job_embedding)
            job_scores.append((job, similarity_score))
        
        # Sort by score descending
        job_scores.sort(key=lambda x: x[1], reverse=True)
        return job_scores
    
    def get_skill_embedding(self, skill: str) -> np.ndarray:
        """Get embedding for a single skill"""
        return self.model.encode(skill, convert_to_tensor=False)
    
    def find_similar_skills(self, skill: str, skill_pool: List[str], top_k: int = 3) -> List[str]:
        """Find similar skills to help with gap analysis"""
        skill_emb = self.get_skill_embedding(skill)
        
        similarities = []
        for pool_skill in skill_pool:
            pool_emb = self.get_skill_embedding(pool_skill)
            sim = cosine_similarity(skill_emb.reshape(1, -1), pool_emb.reshape(1, -1))[0][0]
            similarities.append((pool_skill, sim))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        return [s[0] for s in similarities[:top_k]]


# Global instance
_matcher_instance = None

def get_matcher() -> SemanticMatcher:
    """Get or create the global matcher instance"""
    global _matcher_instance
    if _matcher_instance is None:
        _matcher_instance = SemanticMatcher()
    return _matcher_instance
