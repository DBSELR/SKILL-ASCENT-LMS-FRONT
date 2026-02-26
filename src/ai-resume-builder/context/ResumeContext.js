import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

export const useResumeContext = () => {
    return useContext(ResumeContext);
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        summary: '',
        education: [],
        experience: [],
        skills: [],
        projects: [],
        achievements: []
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');

    const updateResumeData = (newData) => {
        setResumeData(newData);
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
    const goToStep = (step) => setCurrentStep(step);

    const value = {
        resumeData,
        updateResumeData,
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        selectedTemplate,
        setSelectedTemplate
    };

    return (
        <ResumeContext.Provider value={value}>
            {children}
        </ResumeContext.Provider>
    );
};
