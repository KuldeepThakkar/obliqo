# ApplyLess Backend

AI-powered job matching backend built with FastAPI and Sentence Transformers.

## Features

- ��� Semantic job matching using AI embeddings
- 📊 Intelligent fit scoring (0-100%)
- 🤖 Decision engine (Apply/Wait/Skip/Avoid)
- 🔍 Explainable AI recommendations
- 🛡️ Ghost job detection
- 📈 Career impact assessment
- 🎯 Competition level estimation
- 📚 Skill gap analysis with learning roadmaps

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI & Uvicorn
- Sentence Transformers (AI model)
- Scikit-learn (similarity calculations)
- Pydantic (data validation)
- SQLAlchemy (future database support)

### 3. Run the Server

```bash
# From the backend directory
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Main Endpoints

### Health Check
```
GET /
```

### Profile Management
```
POST /api/profile
GET /api/profile
```

### Job Matching
```
GET /api/jobs?page=1&page_size=20&decision_filter=Apply
GET /api/jobs/{job_id}
GET /api/stats
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   └── services/
│       ├── matching.py      # Semantic matching engine
│       ├── scoring.py       # Fit score calculator
│       ├── decision.py      # Decision engine
│       ├── explainer.py     # Explainability generator
│       └── detector.py      # Ghost job detector
├── data/
│   └── jobs_dataset.json    # Sample job data
└── requirements.txt
```

## How It Works

1. **Semantic Matching**: Uses Sentence Transformers to create embeddings of user profiles and job descriptions
2. **Fit Scoring**: Combines semantic similarity (40%), skill overlap (30%), experience match (20%), and preferences (10%)
3. **Decision Making**: Analyzes fit score, skill gaps, and risks to recommend Apply/Wait/Skip/Avoid
4. **Explainability**: Generates clear explanations with matched skills, missing skills, and risk factors
5. **Ghost Detection**: Identifies low-quality job postings using multiple signals

## Tech Stack

- **Framework**: FastAPI 0.109
- **AI/ML**: Sentence Transformers, Scikit-learn
- **Model**: all-MiniLM-L6-v2 (lightweight, fast)
- **Data**: In-memory (SQLite ready)
