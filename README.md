# ApplyLess

> **An AI job platform that helps users apply less — and grow more.**

ApplyLess is an AI-powered job matching platform that helps job seekers make **fewer, smarter applications** by providing intelligent job fit scoring, career-protective recommendations, and transparent AI explanations.

## 🎯 The Problem

Job seekers waste time applying blindly to low-quality, high-competition, or career-damaging roles. Existing platforms optimize for **application volume**, not **career outcomes**.

## ✅ Our Solution

ApplyLess uses AI to:
- Match jobs semantically (not just keywords)
- Score job fit transparently (0-100%)
- Recommend Apply/Wait/Skip/Avoid decisions
- Detect ghost jobs and career risks
- Provide skill gap analysis and learning roadmaps

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### 1. Start the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

Backend will be at `http://localhost:8000`

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be at `http://localhost:3000`

### 3. Use the App

1. Visit `http://localhost:3000`
2. Click "Get Started" and create your profile
3. Browse personalized job matches with AI recommendations
4. Click jobs to see detailed fit analysis

## 📦 Project Structure

```
karela/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py      # API endpoints
│   │   ├── models.py    # Data models
│   │   └── services/    # AI services
│   ├── data/            # Job dataset
│   └── requirements.txt
├── frontend/            # Next.js frontend
│   ├── app/            # Pages
│   ├── components/     # React components
│   ├── lib/            # API client
│   └── package.json
├── PRD.md              # Product Requirements
└── README.md
```

## 🧩 Key Features

### 1. Semantic Job Matching
AI-powered embeddings match jobs to your profile based on meaning, not keywords.

### 2. Job Fit Score (0-100%)
Transparent scoring combining:
- Semantic similarity (40%)
- Skill overlap (30%)
- Experience alignment (20%)
- Preferences (10%)

### 3. "Should I Apply?" Decision Engine
Explicit recommendations:
- ✅ **Apply**: High fit, ready to apply
- ⏱ **Wait**: Good fit, acquire skills first
- ➖ **Skip**: Low fit, better opportunities exist
- ❌ **Avoid**: Poor fit or career risks

### 4. Explainable AI
Clear breakdowns showing:
- ✓ Matched skills
- ⚠ Missing skills
- 🚨 Risk factors
- 💪 Your strengths

### 5. Career Risk Detection
Warns about:
- Ghost jobs (old, vague postings)
- Career regression
- Skill stagnation
- Misalignment with goals

### 6. Skill Gap Analysis
For each missing skill:
- Priority level (High/Medium/Low)
- Estimated learning time
- Curated learning resources

### 7. Competition Estimation
Assesses how competitive each role is based on:
- Company popularity
- Remote vs on-site
- Experience level
- Your fit score

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109
- **AI/ML**: Sentence Transformers, Scikit-learn
- **Model**: all-MiniLM-L6-v2
- **Data Validation**: Pydantic

### Frontend
- **Framework**: Next.js 14
- **UI**: React 18, TypeScript
- **Styling**: Tailwind CSS 3
- **Design**: Glassmorphism, gradients, animations

## 📊 API Endpoints

See full API documentation at `http://localhost:8000/docs` after starting the backend.

Key endpoints:
- `POST /api/profile` - Save user profile
- `GET /api/jobs` - Get personalized job feed
- `GET /api/jobs/{job_id}` - Get detailed job analysis
- `GET /api/stats` - Get match statistics

## 🎨 Design Highlights

- Premium glassmorphism UI
- Vibrant gradient text and animations
- Color-coded decision badges
- Animated fit score visualizations
- Smooth micro-interactions
- Fully responsive design

## 🏆 What Makes ApplyLess Different

1. **Career-First**: Optimizes for outcomes, not application volume
2. **Protective AI**: Actively recommends against bad opportunities
3. **Transparent**: Every decision is explained
4. **Ethical**: User-protective design philosophy
5. **Beautiful**: Production-grade UI/UX

## 📝 Product Documents

- [Product Requirements Document](./PRD.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🔮 Future Enhancements

- Alternative role suggestions
- Job comparison view
- Smart notifications
- Resume parsing
- Real job data integration
- User authentication
- Application tracking

## 📄 License

Built for educational and hackathon purposes.

---

**ApplyLess** - Apply less. Grow more. 🚀
