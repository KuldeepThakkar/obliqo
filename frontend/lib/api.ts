// API Client for ApplyLess Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Personal Information
export interface PersonalInfo {
    full_name: string;
    email: string;
    phone_number: string;
    date_of_birth?: string;
    age?: number;
    gender?: string;
    address: string;
    emergency_address?: string;
}

// Social Profiles
export interface SocialProfiles {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    other_profiles?: { platform: string; url: string }[];
}

// Project Details
export interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    role?: string;
    duration?: string;
    link?: string;
}

// Work Experience
export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    duration: string;
    location?: string;
    skills_used: string[];
    description: string;
    responsibilities: string[];
}

// Education
export interface Education {
    id: string;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    grade?: string;
    achievements?: string[];
}

// Certifications & Courses
export interface Certification {
    id: string;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
}

export interface Course {
    id: string;
    name: string;
    provider: string;
    completion_date: string;
    skills_learned: string[];
}

// Awards & Activities
export interface Award {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
}

export interface ExtracurricularActivity {
    id: string;
    activity: string;
    role?: string;
    duration?: string;
    description?: string;
}

// Medical Background
export interface MedicalInfo {
    has_disabilities?: boolean;
    disability_details?: string;
    requires_accommodations?: boolean;
    accommodation_details?: string;
}

// Work Preferences
export interface WorkPreferences {
    work_mode: 'Remote' | 'Onsite' | 'Hybrid' | 'Any';
    preferred_work_mode?: string;
    willing_to_relocate?: boolean;
}

export interface UserProfile {
    user_id: string;

    // Personal Information
    personal_info: PersonalInfo;

    // About Me
    about_me?: string;

    // Social Profiles
    social_profiles: SocialProfiles;

    // Resume
    resume_url?: string;
    resume_text?: string;
    has_uploaded_resume: boolean;

    // Professional Details
    skills: string[];
    experience_years: number;
    experience_level: string;
    preferred_roles: string[];
    preferred_locations: string[];
    career_goals: string;

    // Projects
    projects: Project[];

    // Work Experience
    work_experience: WorkExperience[];

    // Education
    education: Education[];

    // Additional Qualifications
    certifications: Certification[];
    courses: Course[];
    awards: Award[];
    extracurricular_activities: ExtracurricularActivity[];

    // Medical Information
    medical_info?: MedicalInfo;

    // Work Preferences
    work_preferences: WorkPreferences;
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

    // CV Upload endpoint
    async uploadCV(file: File): Promise<{
        message: string;
        filename: string;
        file_url: string;
        extracted_data: {
            personal_info?: {
                full_name?: string;
                email?: string;
                phone_number?: string;
            };
            social_profiles?: {
                linkedin?: string;
                github?: string;
            };
            skills?: string[];
            experience_years?: number;
            raw_text?: string;
            error?: string;
        };
    }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/api/upload-cv`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(error.detail || 'Failed to upload CV');
        }

        return response.json();
    }
}

export const api = new ApiClient();
