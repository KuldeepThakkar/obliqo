'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="glass-card m-6 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            ApplyLess
                        </h1>
                    </div>
                    <Link href="/profile">
                        <button className="btn-primary">Get Started</button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-5xl text-center space-y-8 animate-fade-in">
                    {/* Main Headline */}
                    <div className="space-y-4">
                        <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                            Apply Less.
                            <br />
                            Grow More.
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            AI-powered job matching that helps you make <strong>fewer, smarter applications</strong> to protect your career and maximize your potential.
                        </p>
                    </div>

                    {/* Value Props */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Smart Matching</h3>
                            <p className="text-gray-300">
                                AI-powered semantic matching finds jobs that truly fit your skills and goals
                            </p>
                        </div>
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Career Protection</h3>
                            <p className="text-gray-300">
                                Detect ghost jobs, career risks, and low-quality postings before you apply
                            </p>
                        </div>
                        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Explainable AI</h3>
                            <p className="text-gray-300">
                                Get clear explanations, skill gap analysis, and learning recommendations
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                        <Link href="/profile">
                            <button className="btn-primary text-lg px-8 py-4">
                                Create Your Profile
                            </button>
                        </Link>
                        <Link href="/jobs">
                            <button className="btn-secondary text-lg px-8 py-4">
                                Browse Jobs
                            </button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400">75%</div>
                            <div className="text-sm text-gray-400">Fewer Applications</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pink-400">3x</div>
                            <div className="text-sm text-gray-400">Better Fit Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">100%</div>
                            <div className="text-sm text-gray-400">Transparency</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="glass-card m-6 p-4 text-center text-gray-400 text-sm">
                <p>
                    Built with ❤️ for smarter job seeking • {' '}
                    <span className="text-purple-400">Optimized for career outcomes, not application volume</span>
                </p>
            </footer>
        </div>
    );
}
