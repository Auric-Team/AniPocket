'use client';

import { useState } from 'react';

interface SynopsisTextProps {
    text: string;
    maxLength?: number;
}

export default function SynopsisText({ text, maxLength = 250 }: SynopsisTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) {
        return <p className="text-[#aaaaaa] text-[13px] italic">No synopsis available.</p>;
    }

    const shouldTruncate = text.length > maxLength;
    const displayText = isExpanded ? text : text.slice(0, maxLength);

    return (
        <div className="relative text-[13px] text-[#aaaaaa] leading-[1.6]">
            <p className="whitespace-pre-line inline">
                {displayText}
                {!isExpanded && shouldTruncate && <span>...</span>}
            </p>
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline text-[var(--accent)] font-semibold hover:underline ml-1"
                >
                    {isExpanded ? '- Less' : '+ More'}
                </button>
            )}
        </div>
    );
}
