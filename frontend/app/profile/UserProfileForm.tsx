'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, UserProfile } from '@/lib/api';
import Link from 'next/link';

export default function UserProfileForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);

    const [formData, setFormData] = useState({
        user_id: 'user_' + Date.now(),
        skills: '',
        experience_years: 2,
        experience_level: 'Mid',
        preferred_roles: '',
        preferred_locations: '',
        career_goals: '',
    });

    useEffect(() => {
        // Try to load existing profile
        api.getProfile()
            .then(profile => {
                setExistingProfile(profile);
                setFormData({
                    user_id: profile.user_id,
                    skills: profile.skills.join(', '),
                    experience_years: profile.experience_years,
                    experience_level: profile.experience_level,
                    preferred_roles: profile.preferred_roles.join(', '),
                    preferred_locations: profile.preferred_locations.join(', '),
                    career_goals: profile.career_goals,
                });
            })
            .catch(() => {
                // No profile exists, that's fine
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const profile: UserProfile = {
                user_id: formData.user_id,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                experience_years: formData.experience_years,
                experience_level: formData.experience_level,
                preferred_roles: formData.preferred_roles.split(',').map(s => s.trim()).filter(Boolean),
                preferred_locations: formData.preferred_locations.split(',').map(s => s.trim()).filter(Boolean),
                career_goals: formData.career_goals,
            };

            await api.saveProfile(profile);
            router.push('/jobs');
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            {/* Navigation */}
            <nav className="glass-card mb-6 p-4 max-w-5xl mx-auto">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ApplyLess
                            </h1>
                        </div>
                    </Link>
                    {existingProfile && (
                        <Link href="/jobs">
                            <button className="btn-secondary">View Jobs</button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Profile Form */}
            <div className="max-w-3xl mx-auto">
                <div className="glass-card p-8 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {existingProfile ? 'Update Your Profile' : 'Create Your Profile'}
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Tell us about yourself so we can find the perfect job matches for you.
                    </p>

                    {error && (
                        <div className="bg-avoid/20 border border-avoid/50 rounded-lg p-4 mb-6">
                            <p className="text-avoid">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Skills */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Your Skills *
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="React, Python, TypeScript, Node.js, etc."
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                required
                            />
                            <p className="text-sm text-gray-400 mt-1">Separate skills with commas</p>
                        </div>

                        {/* Experience */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white font-semibold mb-2">
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    min="0"
                                    max="50"
                                    value={formData.experience_years}
                                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2">
                                    Experience Level *
                                </label>
                                <select
                                    className="input-field"
                                    value={formData.experience_level}
                                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                    required
                                >
                                    <option value="Entry">Entry Level</option>
                                    <option value="Mid">Mid Level</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Lead">Lead</option>
                                </select>
                            </div>
                        </div>

                        {/* Preferred Roles */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Preferred Roles *
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Frontend Developer, Full Stack Engineer, etc."
                                value={formData.preferred_roles}
                                onChange={(e) => setFormData({ ...formData, preferred_roles: e.target.value })}
                                required
                            />
                            <p className="text-sm text-gray-400 mt-1">Separate roles with commas</p>
                        </div>

                        {/* Preferred Locations */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Preferred Locations *
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="San Francisco, Remote, New York, etc."
                                value={formData.preferred_locations}
                                onChange={(e) => setFormData({ ...formData, preferred_locations: e.target.value })}
                                required
                            />
                            <p className="text-sm text-gray-400 mt-1">Separate locations with commas</p>
                        </div>

                        {/* Career Goals */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Career Goals *
                            </label>
                            <textarea
                                className="input-field min-h-[120px]"
                                placeholder="I want to become a senior engineer at a product company, focusing on building scalable systems..."
                                value={formData.career_goals}
                                onChange={(e) => setFormData({ ...formData, career_goals: e.target.value })}
                                required
                            />
                            <p className="text-sm text-gray-400 mt-1">What are you looking to achieve in your career?</p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-primary w-full text-lg py-4"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile & Find Jobs'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
