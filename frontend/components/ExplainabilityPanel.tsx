'use client';

import React from 'react';
import { ExplainabilityBreakdown } from '@/lib/api';

interface ExplainabilityPanelProps {
    explanation: ExplainabilityBreakdown;
}

const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ explanation }) => {
    return (
        <div className="glass-card p-6 space-y-6">
            <h3 className="section-header">Match Analysis</h3>

            {/* Strengths */}
            {explanation.strengths.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-apply mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Your Strengths
                    </h4>
                    <div className="space-y-2">
                        {explanation.strengths.map((strength, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-gray-200">
                                <span className="text-apply mt-1">•</span>
                                <p>{strength}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Matched Skills */}
            {explanation.matched_skills.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">
                        Matched Skills ({explanation.matched_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {explanation.matched_skills.map((skill, idx) => (
                            <span key={idx} className="skill-badge-matched">
                                ✓ {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Missing Skills */}
            {explanation.missing_skills.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-wait mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Missing Skills ({explanation.missing_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {explanation.missing_skills.map((skill, idx) => (
                            <span key={idx} className="skill-badge-missing">
                                ⚠ {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Risk Factors */}
            {explanation.risk_factors.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-avoid mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Risk Factors
                    </h4>
                    <div className="space-y-2">
                        {explanation.risk_factors.map((risk, idx) => (
                            <div key={idx} className="bg-avoid/10 border border-avoid/30 rounded-lg p-3">
                                <p className="text-avoid text-sm">{risk}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExplainabilityPanel;
