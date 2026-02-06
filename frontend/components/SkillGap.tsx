'use client';

import React, { useState } from 'react';
import { SkillGap as SkillGapType } from '@/lib/api';

interface SkillGapProps {
    skillGaps: SkillGapType[];
}

const SkillGap: React.FC<SkillGapProps> = ({ skillGaps }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (skillGaps.length === 0) {
        return (
            <div className="glass-card p-6">
                <h3 className="section-header">Skill Development</h3>
                <p className="text-gray-300">✅ You already have all the required skills!</p>
            </div>
        );
    }

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'High':
                return 'text-avoid';
            case 'Medium':
                return 'text-wait';
            case 'Low':
                return 'text-apply';
            default:
                return 'text-gray-400';
        }
    };

    const getImportanceBadge = (importance: string) => {
        switch (importance) {
            case 'High':
                return 'bg-avoid/20 border-avoid/50 text-avoid';
            case 'Medium':
                return 'bg-wait/20 border-wait/50 text-wait';
            case 'Low':
                return 'bg-apply/20 border-apply/50 text-apply';
            default:
                return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
        }
    };

    return (
        <div className="glass-card p-6">
            {/* Collapsible trigger */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left group"
            >
                <span className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2 transition-colors">
                    📚 Learn how to develop your skills more
                </span>
                <span className={`text-purple-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Expandable content */}
            {isExpanded && (
                <div className="mt-6 animate-fadeIn">
                    <h3 className="section-header">Skill Development Roadmap</h3>
                    <p className="text-gray-300 mb-6">
                        Bridge the gap with these learning recommendations:
                    </p>

                    <div className="space-y-4">
                        {[...skillGaps]
                            .sort((a, b) => {
                                const priorityOrder: Record<string, number> = { 'High': 0, 'Medium': 1, 'Low': 2 };
                                return (priorityOrder[a.importance] ?? 3) - (priorityOrder[b.importance] ?? 3);
                            })
                            .map((gap, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">{gap.skill}</h4>
                                            <p className="text-sm text-gray-400 mt-1">
                                                ⏱ Estimated learning time: {gap.estimated_learning_time}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${getImportanceBadge(gap.importance)}`}>
                                            {gap.importance} Priority
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-300 mb-2">📚 Learning Resources:</p>
                                        <ul className="space-y-1">
                                            {gap.resources.map((resource, resIdx) => (
                                                <li key={resIdx} className="text-sm text-gray-400 flex items-start gap-2">
                                                    <span className="text-purple-400 mt-1">•</span>
                                                    <span>{resource}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="mt-6 bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                        <p className="text-sm text-purple-200">
                            💡 <strong>Pro Tip:</strong> Focus on {skillGaps.filter(g => g.importance === 'High').length > 0 ? 'high priority' : 'the most relevant'} skills first to quickly improve your fit score for similar roles.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillGap;
