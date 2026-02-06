"""
CV Parser Service
Extracts structured data from PDF and DOCX resumes
"""
import re
from pathlib import Path
from typing import Dict, List, Optional, Any
from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_pdf(file_path: Path) -> str:
    """Extract text from PDF file"""
    try:
        reader = PdfReader(str(file_path))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""


def extract_text_from_docx(file_path: Path) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(str(file_path))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return ""


def extract_text(file_path: Path) -> str:
    """Extract text from CV file based on extension"""
    ext = file_path.suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(file_path)
    return ""


def extract_email(text: str) -> Optional[str]:
    """Extract email address from text"""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else None


def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text"""
    # Match various phone formats
    phone_patterns = [
        r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\d{10,12}',
    ]
    for pattern in phone_patterns:
        matches = re.findall(pattern, text)
        if matches:
            return matches[0]
    return None


def extract_linkedin(text: str) -> Optional[str]:
    """Extract LinkedIn URL from text"""
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
    matches = re.findall(linkedin_pattern, text, re.IGNORECASE)
    if matches:
        url = matches[0]
        if not url.startswith('http'):
            url = 'https://' + url
        return url
    return None


def extract_github(text: str) -> Optional[str]:
    """Extract GitHub URL from text"""
    github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+'
    matches = re.findall(github_pattern, text, re.IGNORECASE)
    if matches:
        url = matches[0]
        if not url.startswith('http'):
            url = 'https://' + url
        return url
    return None


def extract_name(text: str) -> Optional[str]:
    """Extract name from the beginning of CV (usually first line)"""
    lines = text.strip().split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        # Skip empty lines and lines that look like headers/emails
        if not line or '@' in line or 'resume' in line.lower() or 'curriculum' in line.lower():
            continue
        # Name is usually 2-4 words, all capitalized or title case
        words = line.split()
        if 2 <= len(words) <= 4:
            # Check if it looks like a name (mostly letters)
            if all(word.replace('.', '').replace('-', '').isalpha() for word in words):
                return line
    return None


def extract_skills(text: str) -> List[str]:
    """Extract skills from CV"""
    skills = []
    
    # Common technical skills to look for
    common_skills = [
        'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
        'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring',
        'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux',
        'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
        'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
        'REST', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
        'Data Analysis', 'Data Science', 'Power BI', 'Tableau', 'Excel',
    ]
    
    text_lower = text.lower()
    for skill in common_skills:
        if skill.lower() in text_lower:
            skills.append(skill)
    
    # Also try to find a Skills section and extract from there
    skills_section = re.search(r'(?:skills|technical skills|technologies)[:\s]*([^\n]+(?:\n[^\n]+)*?)(?:\n\n|\n[A-Z])', text, re.IGNORECASE)
    if skills_section:
        section_text = skills_section.group(1)
        # Split by common delimiters
        potential_skills = re.split(r'[,|•·\n]', section_text)
        for skill in potential_skills:
            skill = skill.strip().strip('-').strip()
            if skill and len(skill) > 1 and len(skill) < 30 and skill not in skills:
                skills.append(skill)
    
    return list(set(skills))[:20]  # Return unique skills, max 20


def extract_experience_years(text: str) -> int:
    """Estimate years of experience from CV"""
    # Look for explicit mentions
    exp_pattern = r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)?'
    matches = re.findall(exp_pattern, text, re.IGNORECASE)
    if matches:
        return int(matches[0])
    
    # Count year ranges in work experience
    year_pattern = r'20\d{2}\s*[-–]\s*(?:20\d{2}|present|current)'
    matches = re.findall(year_pattern, text, re.IGNORECASE)
    if matches:
        return len(matches)  # Rough estimate based on number of positions
    
    return 0


def parse_cv(file_path: Path) -> Dict[str, Any]:
    """
    Parse CV and extract structured data
    Returns a dictionary with extracted fields
    """
    text = extract_text(file_path)
    
    if not text:
        return {"error": "Could not extract text from file", "raw_text": ""}
    
    extracted_data = {
        "raw_text": text[:5000],  # Limit raw text size
        "personal_info": {
            "full_name": extract_name(text),
            "email": extract_email(text),
            "phone_number": extract_phone(text),
        },
        "social_profiles": {
            "linkedin": extract_linkedin(text),
            "github": extract_github(text),
        },
        "skills": extract_skills(text),
        "experience_years": extract_experience_years(text),
    }
    
    return extracted_data
