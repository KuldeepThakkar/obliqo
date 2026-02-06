'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, UserProfile, Project, WorkExperience, Education, Certification, Course, Award, ExtracurricularActivity } from '@/lib/api';
import Link from 'next/link';

// Helper for dynamic fields
const DynamicSection = <T extends { id: string }>({
    title,
    items,
    onAdd,
    onRemove,
    renderItem
}: {
    title: string;
    items: T[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
}) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button type="button" onClick={onAdd} className="btn-secondary text-sm py-1 px-3">
                + Add {title}
            </button>
        </div>
        {items.length === 0 && <p className="text-gray-400 text-sm">No {title.toLowerCase()} added yet.</p>}
        {items.map((item, index) => (
            <div key={item.id} className="relative p-4 border border-white/10 rounded-lg bg-white/5 space-y-3">
                <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
                >
                    ✕
                </button>
                {renderItem(item, index)}
            </div>
        ))}
    </div>
);

export default function UserProfileForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);

    // Initial State matching UserProfile interface
    const INITIAL_PROFILE: UserProfile = {
        user_id: 'user_' + Date.now(),
        personal_info: {
            full_name: '',
            email: '',
            phone_number: '',
            address: '',
            date_of_birth: '',
            age: 0,
            gender: '',
            emergency_address: ''
        },
        social_profiles: {
            linkedin: '',
            github: '',
            portfolio: '',
            other_profiles: []
        },
        about_me: '',
        resume_url: '',
        has_uploaded_resume: false,
        skills: [],
        experience_years: 0,
        experience_level: 'Entry',
        preferred_roles: [],
        preferred_locations: [],
        career_goals: '',
        projects: [],
        work_experience: [],
        education: [],
        certifications: [],
        courses: [],
        awards: [],
        extracurricular_activities: [],
        medical_info: {
            has_disabilities: false,
            disability_details: '',
            requires_accommodations: false,
            accommodation_details: ''
        },
        work_preferences: {
            work_mode: 'Any',
            willing_to_relocate: false
        }
    };

    // Initial State matching UserProfile interface
    const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);

    // Helper states for comma-separated inputs
    const [skillsInput, setSkillsInput] = useState('');
    const [rolesInput, setRolesInput] = useState('');
    const [locationsInput, setLocationsInput] = useState('');

    useEffect(() => {
        api.getProfile()
            .then(data => {
                setExistingProfile(data);

                // Merge data with initial profile to ensure all sections exist
                const mergedProfile = {
                    ...INITIAL_PROFILE,
                    ...data,
                    personal_info: { ...INITIAL_PROFILE.personal_info, ...(data.personal_info || {}) },
                    social_profiles: { ...INITIAL_PROFILE.social_profiles, ...(data.social_profiles || {}) },
                    medical_info: { ...INITIAL_PROFILE.medical_info, ...(data.medical_info || {}) },
                    work_preferences: { ...INITIAL_PROFILE.work_preferences, ...(data.work_preferences || {}) }
                };

                setProfile(mergedProfile);
                setSkillsInput((data.skills || []).join(', '));
                setRolesInput((data.preferred_roles || []).join(', '));
                setLocationsInput((data.preferred_locations || []).join(', '));
            })
            .catch(() => {
                // No profile exists
            });
    }, []);

    const handleChange = (section: keyof UserProfile, field: string, value: any) => {
        setProfile(prev => {
            if (section === 'personal_info' || section === 'social_profiles' || section === 'medical_info' || section === 'work_preferences') {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value
                    }
                } as UserProfile;
            }
            return { ...prev, [field]: value };
        });
    };

    const handleArrayItemChange = <T extends { id: string }>(
        section: keyof UserProfile,
        id: string,
        field: keyof T,
        value: any
    ) => {
        setProfile(prev => ({
            ...prev,
            [section]: (prev[section] as T[]).map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addItem = (section: keyof UserProfile, newItem: any) => {
        setProfile(prev => ({
            ...prev,
            [section]: [...(prev[section] as any[]), { ...newItem, id: Date.now().toString() }]
        }));
    };

    const removeItem = (section: keyof UserProfile, id: string) => {
        setProfile(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).filter(item => item.id !== id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Process comma-separated fields
            const finalProfile = {
                ...profile,
                skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
                preferred_roles: rolesInput.split(',').map(s => s.trim()).filter(Boolean),
                preferred_locations: locationsInput.split(',').map(s => s.trim()).filter(Boolean),
            };

            await api.saveProfile(finalProfile);
            router.push('/jobs');
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 pb-20">
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

            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-8 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {existingProfile ? 'Update Your Profile' : 'Create Your Profile'}
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Complete your profile to unlock personalized job recommendations.
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                            <p className="text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* 1. Personal Details */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Personal Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input className="input-field" placeholder="Full Name *" value={profile.personal_info.full_name} onChange={e => handleChange('personal_info', 'full_name', e.target.value)} required />
                                <input className="input-field" placeholder="Email *" type="email" value={profile.personal_info.email} onChange={e => handleChange('personal_info', 'email', e.target.value)} required />
                                <input className="input-field" placeholder="Phone Number *" value={profile.personal_info.phone_number} onChange={e => handleChange('personal_info', 'phone_number', e.target.value)} required />
                                <input className="input-field" placeholder="Date of Birth" type="date" value={profile.personal_info.date_of_birth || ''} onChange={e => handleChange('personal_info', 'date_of_birth', e.target.value)} />
                                <input className="input-field" placeholder="Age" type="number" value={profile.personal_info.age || ''} onChange={e => handleChange('personal_info', 'age', parseInt(e.target.value) || 0)} />
                                <select className="input-field" value={profile.personal_info.gender || ''} onChange={e => handleChange('personal_info', 'gender', e.target.value)}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input className="input-field md:col-span-2" placeholder="Address *" value={profile.personal_info.address} onChange={e => handleChange('personal_info', 'address', e.target.value)} required />
                                <input className="input-field md:col-span-2" placeholder="Emergency Contact Address" value={profile.personal_info.emergency_address || ''} onChange={e => handleChange('personal_info', 'emergency_address', e.target.value)} />
                            </div>
                        </section>

                        {/* 2. Social Profiles */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Social Profiles</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input className="input-field" placeholder="LinkedIn URL" value={profile.social_profiles.linkedin || ''} onChange={e => handleChange('social_profiles', 'linkedin', e.target.value)} />
                                <input className="input-field" placeholder="GitHub URL" value={profile.social_profiles.github || ''} onChange={e => handleChange('social_profiles', 'github', e.target.value)} />
                                <input className="input-field md:col-span-2" placeholder="Portfolio / Personal Website" value={profile.social_profiles.portfolio || ''} onChange={e => handleChange('social_profiles', 'portfolio', e.target.value)} />
                            </div>
                        </section>

                        {/* 3. Professional Details */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Professional Summary</h3>
                            <textarea className="input-field min-h-[100px]" placeholder="About Me *" value={profile.about_me || ''} onChange={e => setProfile({ ...profile, about_me: e.target.value })} required />
                            <textarea className="input-field min-h-[100px]" placeholder="Career Goals *" value={profile.career_goals} onChange={e => setProfile({ ...profile, career_goals: e.target.value })} required />

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Skills (comma separated)</label>
                                    <input className="input-field" placeholder="React, Python, Node.js..." value={skillsInput} onChange={e => setSkillsInput(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Experience Years</label>
                                    <input className="input-field" type="number" value={profile.experience_years} onChange={e => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })} required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Level</label>
                                    <select className="input-field" value={profile.experience_level} onChange={e => setProfile({ ...profile, experience_level: e.target.value })} required>
                                        <option value="Entry">Entry Level</option>
                                        <option value="Mid">Mid Level</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Lead">Lead</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Preferred Roles (comma separated)</label>
                                    <input className="input-field" placeholder="Frontend Developer, Backend Engineer..." value={rolesInput} onChange={e => setRolesInput(e.target.value)} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Preferred Locations (comma separated)</label>
                                    <input className="input-field" placeholder="New York, London, Remote..." value={locationsInput} onChange={e => setLocationsInput(e.target.value)} required />
                                </div>
                            </div>
                        </section>

                        {/* 4. Projects */}
                        <DynamicSection
                            title="Projects"
                            items={profile.projects}
                            onAdd={() => addItem('projects', { title: '', description: '', technologies: [], link: '' })}
                            onRemove={(id) => removeItem('projects', id)}
                            renderItem={(item, idx) => (
                                <div className="grid gap-3">
                                    <input className="input-field" placeholder="Project Title" value={item.title} onChange={e => handleArrayItemChange<Project>('projects', item.id, 'title', e.target.value)} />
                                    <textarea className="input-field" placeholder="Description" value={item.description} onChange={e => handleArrayItemChange<Project>('projects', item.id, 'description', e.target.value)} />
                                    <input className="input-field" placeholder="Technologies (comma separated)" value={item.technologies.join(', ')} onChange={e => handleArrayItemChange<Project>('projects', item.id, 'technologies', e.target.value.split(','))} />
                                    <input className="input-field" placeholder="Link" value={item.link || ''} onChange={e => handleArrayItemChange<Project>('projects', item.id, 'link', e.target.value)} />
                                </div>
                            )}
                        />

                        {/* 5. Work Experience */}
                        <DynamicSection
                            title="Work Experience"
                            items={profile.work_experience}
                            onAdd={() => addItem('work_experience', { company: '', position: '', duration: '', description: '', responsibilities: [], skills_used: [] })}
                            onRemove={(id) => removeItem('work_experience', id)}
                            renderItem={(item, idx) => (
                                <div className="grid gap-3">
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input className="input-field" placeholder="Company" value={item.company} onChange={e => handleArrayItemChange<WorkExperience>('work_experience', item.id, 'company', e.target.value)} />
                                        <input className="input-field" placeholder="Position" value={item.position} onChange={e => handleArrayItemChange<WorkExperience>('work_experience', item.id, 'position', e.target.value)} />
                                    </div>
                                    <input className="input-field" placeholder="Duration (e.g. 2020 - 2022)" value={item.duration} onChange={e => handleArrayItemChange<WorkExperience>('work_experience', item.id, 'duration', e.target.value)} />
                                    <textarea className="input-field" placeholder="Description" value={item.description} onChange={e => handleArrayItemChange<WorkExperience>('work_experience', item.id, 'description', e.target.value)} />
                                </div>
                            )}
                        />

                        {/* 6. Education */}
                        <DynamicSection
                            title="Education"
                            items={profile.education}
                            onAdd={() => addItem('education', { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '' })}
                            onRemove={(id) => removeItem('education', id)}
                            renderItem={(item, idx) => (
                                <div className="grid gap-3">
                                    <input className="input-field" placeholder="Institution" value={item.institution} onChange={e => handleArrayItemChange<Education>('education', item.id, 'institution', e.target.value)} />
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input className="input-field" placeholder="Degree" value={item.degree} onChange={e => handleArrayItemChange<Education>('education', item.id, 'degree', e.target.value)} />
                                        <input className="input-field" placeholder="Field of Study" value={item.field_of_study} onChange={e => handleArrayItemChange<Education>('education', item.id, 'field_of_study', e.target.value)} />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <input className="input-field" type="date" placeholder="Start Date" value={item.start_date} onChange={e => handleArrayItemChange<Education>('education', item.id, 'start_date', e.target.value)} />
                                        <input className="input-field" type="date" placeholder="End Date" value={item.end_date} onChange={e => handleArrayItemChange<Education>('education', item.id, 'end_date', e.target.value)} />
                                    </div>
                                </div>
                            )}
                        />

                        {/* 7. Work Preferences */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Work Preferences</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Work Mode</label>
                                    <select className="input-field" value={profile.work_preferences.work_mode} onChange={e => handleChange('work_preferences', 'work_mode', e.target.value)}>
                                        <option value="Any">Any</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Onsite">Onsite</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 accent-purple-500" checked={profile.work_preferences.willing_to_relocate} onChange={e => handleChange('work_preferences', 'willing_to_relocate', e.target.checked)} />
                                    <label className="text-white">Willing to Relocate</label>
                                </div>
                            </div>
                        </section>

                        {/* 8. Medical Info */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Medical Background (Optional)</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 accent-purple-500" checked={profile.medical_info?.has_disabilities || false} onChange={e => handleChange('medical_info', 'has_disabilities', e.target.checked)} />
                                    <label className="text-white">Do you have any disabilities?</label>
                                </div>
                                {profile.medical_info?.has_disabilities && (
                                    <textarea className="input-field" placeholder="Please provide details" value={profile.medical_info?.disability_details || ''} onChange={e => handleChange('medical_info', 'disability_details', e.target.value)} />
                                )}
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="btn-primary w-full text-lg py-4 shadow-lg hover:shadow-purple-500/25 transition-all"
                                disabled={loading}
                            >
                                {loading ? 'Saving Profile...' : existingProfile ? 'Update Profile' : 'Create Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
