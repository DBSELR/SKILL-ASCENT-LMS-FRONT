import { useState } from 'react';

const useAIResume = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateSummary = async (resumeData) => {
        setLoading(true);
        setError(null);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            return "Experienced professional with strong skills in React and Node.js.";
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const improveContent = async (text) => {
        setLoading(true);
        setError(null);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            return text + " (Improved by AI)";
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        generateSummary,
        improveContent,
        loading,
        error
    };
};

export default useAIResume;
