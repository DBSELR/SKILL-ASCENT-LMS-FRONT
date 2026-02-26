import React from 'react';

const ATSScore = ({ data }) => {
    // Simple mock score calculation
    const calculateScore = () => {
        let score = 0;
        if (data?.fullName) score += 10;
        if (data?.email) score += 10;
        if (data?.phone) score += 10;
        if (data?.experience?.length > 0) score += 20;
        if (data?.education?.length > 0) score += 15;
        if (data?.skills?.length > 0) score += 15;
        if (data?.summary) score += 10;
        if (data?.projects?.length > 0) score += 10;
        return Math.min(score, 100);
    };

    const score = calculateScore();

    const getColor = (s) => {
        if (s >= 80) return 'text-green-600';
        if (s >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-2">ATS Resume Score</h3>
            <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getColor(score)}`}>
                    {score}/100
                </div>
                <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${score >= 80 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-500' : 'bg-red-600'}`}
                            style={{ width: `${score}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {score >= 80 ? 'Excellent! Ready to apply.' : 'Add more sections to improve your score.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ATSScore;
