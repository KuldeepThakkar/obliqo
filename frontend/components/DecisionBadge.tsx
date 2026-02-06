'use client';

import React from 'react';

interface DecisionBadgeProps {
    decision: 'Apply' | 'Wait' | 'Skip' | 'Avoid';
    className?: string;
}

const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, className = '' }) => {
    const getIcon = () => {
        switch (decision) {
            case 'Apply':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'Wait':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'Skip':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                );
            case 'Avoid':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
        }
    };

    const getBadgeClass = () => {
        switch (decision) {
            case 'Apply':
                return 'badge-apply';
            case 'Wait':
                return 'badge-wait';
            case 'Skip':
                return 'badge-skip';
            case 'Avoid':
                return 'badge-avoid';
        }
    };

    return (
        <div className={`${getBadgeClass()} ${className}`}>
            {getIcon()}
            <span>{decision}</span>
        </div>
    );
};

export default DecisionBadge;
