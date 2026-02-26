import React, { useState } from 'react';

const SectionCard = ({ title, isActive, onClick, children }) => {
    return (
        <div className={`border rounded-lg mb-4 overflow-hidden transition-all ${isActive ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'}`}>
            <div
                className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={onClick}
            >
                <h3 className="font-medium text-gray-800">{title}</h3>
                <span className={`transform transition-transform ${isActive ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </div>
            {isActive && (
                <div className="p-4 bg-white border-t">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SectionCard;
