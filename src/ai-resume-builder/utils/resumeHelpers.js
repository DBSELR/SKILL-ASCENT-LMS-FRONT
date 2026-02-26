// Utility functions for resume builder

export const validateResumeData = (data) => {
    const errors = {};
    if (!data.fullName) errors.fullName = 'Full Name is required';
    if (!data.email) errors.email = 'Email is required';
    return errors;
};

export const calculateCompletionPercentage = (data) => {
    let filledFields = 0;
    let totalFields = 0;

    // Basic check example
    if (data.fullName) filledFields++; totalFields++;
    if (data.email) filledFields++; totalFields++;

    // ... more checks

    return totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);
};
