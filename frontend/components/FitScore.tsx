'use client';

import React, { useEffect, useState } from 'react';

interface FitScoreProps {
    score: number;
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
}

const FitScore: React.FC<FitScoreProps> = ({ score, size = 'medium', animated = true }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        if (animated) {
            const duration = 1000;
            const steps = 60;
            const increment = score / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= score) {
                    setDisplayScore(score);
                    clearInterval(timer);
                } else {
                    setDisplayScore(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        } else {
            setDisplayScore(score);
        }
    }, [score, animated]);

    const getColor = () => {
        if (score >= 75) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
        if (score >= 60) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };
        if (score >= 40) return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.3)' };
        return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
    };

    const getDimensions = () => {
        switch (size) {
            case 'small':
                return { width: 80, height: 80, strokeWidth: 6, fontSize: 'text-lg' };
            case 'large':
                return { width: 180, height: 180, strokeWidth: 12, fontSize: 'text-5xl' };
            default:
                return { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-3xl' };
        }
    };

    const { stroke, glow } = getColor();
    const { width, height, strokeWidth, fontSize } = getDimensions();
    const radius = (width - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={width} height={height} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={width / 2}
                    cy={height / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={width / 2}
                    cy={height / 2}
                    r={radius}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        transition: animated ? 'stroke-dashoffset 1s ease-in-out' : 'none',
                        filter: `drop-shadow(0 0 8px ${glow})`,
                    }}
                />
            </svg>
            <div className={`absolute ${fontSize} font-bold`} style={{ color: stroke }}>
                {Math.round(displayScore)}
                <span className="text-sm">%</span>
            </div>
        </div>
    );
};

export default FitScore;
