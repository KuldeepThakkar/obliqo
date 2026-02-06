// API Client for ApplyLess Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserProfile {
    user_id: string;
    skills: string[];
    experience_years: number;
    experience_level: string;
    preferred_roles: string[];
    preferred_locations: string[];
    career_goals: string;
    resume_text?: string;
}

export interface Job {
    job_id: string;
    title: string;
    company: string;
    description: string;
    requirements: string[];
    location: string;
    experience_required: string;
    posted_date: string;
    company_size?: string;
    is_remote: boolean;
}

export interface SkillGap {
    skill: string;
    importance: string;
    estimated_learning_time: string;
    resources: string[];
}

export interface ExplainabilityBreakdown {
    matched_skills: string[];
    missing_skills: string[];
    risk_factors: string[];
    strengths: string[];
    skill_gaps: SkillGap[];
}

export interface JobMatch {
    job: Job;
    fit_score: number;
    decision: 'Apply' | 'Wait' | 'Skip' | 'Avoid';
    decision_reason: string;
    explanation: ExplainabilityBreakdown;
    competition_level: string;
    career_impact: string;
}

export interface JobFeedResponse {
    jobs: JobMatch[];
    total_count: number;
    page: number;
    page_size: number;
}

export interface StatsResponse {
    total_jobs: number;
    decisions: {
        Apply: number;
        Wait: number;
        Skip: number;
        Avoid: number;
    };
    recommendation: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(error.detail || 'API request failed');
        }

        return response.json();
    }

    // Health check
    async healthCheck() {
        return this.request('/');
    }

    // Profile endpoints
    async saveProfile(profile: UserProfile) {
        return this.request('/api/profile', {
            method: 'POST',
            body: JSON.stringify(profile),
        });
    }

    async getProfile(): Promise<UserProfile> {
        return this.request<UserProfile>('/api/profile');
    }

    // Job endpoints
    async getJobFeed(
        page: number = 1,
        pageSize: number = 20,
        decisionFilter?: string
    ): Promise<JobFeedResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString(),
        });

        if (decisionFilter) {
            params.append('decision_filter', decisionFilter);
        }

        return this.request<JobFeedResponse>(`/api/jobs?${params}`);
    }

    async getJobDetail(jobId: string): Promise<JobMatch> {
        return this.request<JobMatch>(`/api/jobs/${jobId}`);
    }

    // Stats endpoint
    async getStats(): Promise<StatsResponse> {
        return this.request<StatsResponse>('/api/stats');
    }
}

export const api = new ApiClient();
