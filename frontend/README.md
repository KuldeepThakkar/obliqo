# ApplyLess Frontend

Beautiful, modern web interface for ApplyLess - built with Next.js, React, and Tailwind CSS.

## Features

- ✨ Stunning glassmorphism design
- 🎨 Premium gradient animations
- 📱 Fully responsive (mobile-first)
- ⚡ Lightning-fast performance
- 🎯 Intuitive user experience
- 📊 Real-time job matching visualization
- 🎭 Smooth micro-animations

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL (Optional)

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Default is `http://localhost:8000` if not specified.

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Pages

### Landing Page (`/`)
- Hero section with value propositions
- Feature highlights
- Call-to-action buttons

### Profile Page (`/profile`)
- User profile creation/editing
- Skills, experience, preferences input
- Career goals definition

### Jobs Page (`/jobs`)
- Personalized job feed
- Stats dashboard
- Filter by decision (Apply/Wait/Skip/Avoid)
- Split-view job details
- Fit score visualization
- Explainability panel
- Skill gap roadmap

## Components

- **JobCard**: Job listing with fit score and decision
- **FitScore**: Animated circular progress indicator
- **DecisionBadge**: Color-coded recommendation badge
- **ExplainabilityPanel**: Detailed match breakdown
- **SkillGap**: Learning recommendations

## Design System

### Colors
- Apply: Green (#10b981)
- Wait: Amber (#f59e0b)
- Skip: Orange (#f97316)
- Avoid: Red (#ef4444)

### Typography
- Font: Inter (Google Fonts)
- Gradients: Purple-to-Pink

### Effects
- Glassmorphism cards
- Smooth animations
- Gradient borders
- Hover micro-interactions

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript
- **Build**: Turbopack (dev)

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── profile/
│   │   └── page.tsx         # Profile page
│   └── jobs/
│       └── page.tsx         # Jobs page
├── components/
│   ├── JobCard.tsx
│   ├── FitScore.tsx
│   ├── DecisionBadge.tsx
│   ├── ExplainabilityPanel.tsx
│   └── SkillGap.tsx
├── lib/
│   └── api.ts               # API client
├── styles/
│   └── globals.css          # Global styles
└── package.json
```
