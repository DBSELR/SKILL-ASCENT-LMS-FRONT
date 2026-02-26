import React from 'react';

const ResumeStepper = ({ currentStep, steps, onStepClick }) => {
    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => onStepClick(index)}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${index <= currentStep
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                }`}
                        >
                            {index + 1}
                        </div>
                        <span className={`text-xs mt-1 font-medium ${index === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeStepper;
