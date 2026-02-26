import { useResumeContext } from '../context/ResumeContext';

const useResume = () => {
    const context = useResumeContext();

    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }

    return context;
};

export default useResume;
