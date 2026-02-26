import React, { useState } from 'react';

const AIImproveContent = ({ originalContent, onImprove }) => {
    const [loading, setLoading] = useState(false);

    const handleImprove = () => {
        setLoading(true);
        // Simulate AI improvement
        setTimeout(() => {
            const improved = originalContent + " (Enhanced with action verbs and quantifiable results)";
            onImprove(improved);
            setLoading(false);
        }, 1000);
    };

    return (
        <button
            onClick={handleImprove}
            disabled={loading || !originalContent}
            className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
        >
            <span>✨</span>
            {loading ? 'Improving...' : 'Improve with AI'}
        </button>
    );
};

export default AIImproveContent;
