'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, JobMatch, StatsResponse } from '@/lib/api';
import JobCard from '@/components/JobCard';
import FitScore from '@/components/FitScore';
import ExplainabilityPanel from '@/components/ExplainabilityPanel';
import SkillGap from '@/components/SkillGap';
import DecisionBadge from '@/components/DecisionBadge';

export default function JobsDashboard() {
    const [jobs, setJobs] = useState<JobMatch[]>([]);
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        loadJobs();
        loadStats();
    }, [filter]);

    const loadJobs = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.getJobFeed(1, 50, filter || undefined);
            // Sort jobs by fit_score in descending order
            const sortedJobs = [...response.jobs].sort((a, b) => b.fit_score - a.fit_score);
            setJobs(sortedJobs);
            if (response.jobs.length > 0 && !selectedJob) {
                setSelectedJob(response.jobs[0]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load jobs. Please create a profile first.');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await api.getStats();
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleJobClick = async (jobId: string) => {
        try {
            const jobMatch = await api.getJobDetail(jobId);
            setSelectedJob(jobMatch);
        } catch (err: any) {
            console.error('Failed to load job details:', err);
        }
    };

    if (loading && jobs.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading your personalized job matches...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glass-card p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Profile Required</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <Link href="/profile">
                        <button className="btn-primary">Create Profile</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Navigation */}
            <nav className="glass-card mb-6 p-4">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ApplyLess
                            </h1>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <button className="btn-secondary">Edit Profile</button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Stats Dashboard */}
            {stats && (
                <div className="glass-card p-6 mb-6 max-w-7xl mx-auto">
                    <h2 className="section-header">Your Job Market Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{stats.total_jobs}</div>
                            <div className="text-sm text-gray-400">Total Jobs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-apply">{stats.decisions.Apply}</div>
                            <div className="text-sm text-gray-400">Apply</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-wait">{stats.decisions.Wait}</div>
                            <div className="text-sm text-gray-400">Wait</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-skip">{stats.decisions.Skip}</div>
                            <div className="text-sm text-gray-400">Skip</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-avoid">{stats.decisions.Avoid}</div>
                            <div className="text-sm text-gray-400">Avoid</div>
                        </div>
                    </div>
                    <div className="mt-4 bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                        <p className="text-purple-200">💡 {stats.recommendation}</p>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="glass-card p-4 mb-6 max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setFilter('')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === '' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        All Jobs
                    </button>
                    <button
                        onClick={() => setFilter('Apply')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'Apply' ? 'bg-apply text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        ✓ Apply
                    </button>
                    <button
                        onClick={() => setFilter('Wait')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'Wait' ? 'bg-wait text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        ⏱ Wait
                    </button>
                    <button
                        onClick={() => setFilter('Skip')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'Skip' ? 'bg-skip text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        ➖ Skip
                    </button>
                    <button
                        onClick={() => setFilter('Avoid')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'Avoid' ? 'bg-avoid text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        ✕ Avoid
                    </button>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
                {/* Job List */}
                <div className="space-y-4 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                    {jobs.length === 0 ? (
                        <div className="glass-card p-8 text-center">
                            <p className="text-gray-300">No jobs match this filter.</p>
                        </div>
                    ) : (
                        jobs.map((jobMatch) => (
                            <JobCard
                                key={jobMatch.job.job_id}
                                jobMatch={jobMatch}
                                onClick={handleJobClick}
                            />
                        ))
                    )}
                </div>

                {/* Job Detail */}
                {selectedJob && (
                    <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto space-y-6">
                        {/* Job Header */}
                        <div className="glass-card p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.job.title}</h2>
                                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="font-semibold text-lg">{selectedJob.job.company}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span>📍 {selectedJob.job.location}</span>
                                        {selectedJob.job.is_remote && <span>🌐 Remote</span>}
                                        <span>📊 {selectedJob.job.experience_required}</span>
                                        {selectedJob.job.company_size && <span>👥 {selectedJob.job.company_size}</span>}
                                    </div>
                                </div>
                                <FitScore score={selectedJob.fit_score} size="medium" />
                            </div>

                            <DecisionBadge decision={selectedJob.decision} className="mb-4" />
                            <p className="text-gray-200 mb-4">{selectedJob.decision_reason}</p>

                            {/* Apply Now button - only show for Apply or Wait decisions */}
                            {(selectedJob.decision === 'Apply' || selectedJob.decision === 'Wait') && (
                                <button className="w-full btn-primary mb-6 py-3 text-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all transform hover:scale-[1.02]">
                                    🚀 Apply Now
                                </button>
                            )}

                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-sm text-gray-400">Competition</div>
                                    <div className="text-lg font-semibold text-white">{selectedJob.competition_level}</div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-sm text-gray-400">Career Impact</div>
                                    <div className={`text-lg font-semibold ${selectedJob.career_impact === 'Positive' ? 'text-apply' :
                                        selectedJob.career_impact === 'Negative' ? 'text-avoid' : 'text-gray-300'
                                        }`}>
                                        {selectedJob.career_impact}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Job Description</h3>
                                <p className="text-gray-300 text-sm">{selectedJob.job.description}</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.job.requirements.map((req, idx) => (
                                        <span key={idx} className="skill-badge">{req}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Explainability */}
                        <ExplainabilityPanel explanation={selectedJob.explanation} />

                        {/* Skill Gaps */}
                        <SkillGap skillGaps={selectedJob.explanation.skill_gaps} />
                    </div>
                )}
            </div>
        </div>
    );
}
