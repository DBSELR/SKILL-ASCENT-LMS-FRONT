import React, { useState } from 'react';

const AISummaryGenerator = ({ onGenerate }) => {
    const [loading, setLoading] = useState(false);
    const [generatedSummary, setGeneratedSummary] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        // Simulate AI generation
        setTimeout(() => {
            const summary = "Experienced professional with a proven track record of success in software development. Skilled in React, Node.js, and cloud technologies. Passionate about building scalable applications and solving complex problems.";
            setGeneratedSummary(summary);
            setLoading(false);
            onGenerate(summary);
        }, 1500);
    };

    return (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-purple-900">AI Summary Generator</h3>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Summary'}
                </button>
            </div>
            <p className="text-sm text-purple-700">
                Let AI analyze your experience and skills to write a professional summary for you.
            </p>
            {generatedSummary && (
                <div className="mt-3 p-3 bg-white rounded border border-purple-100 text-sm text-gray-700">
                    {generatedSummary}
                </div>
            )}
        </div>
    );
};

export default AISummaryGenerator;
