import React from 'react';
import { DUMMY_RESUME } from '../../utils/resumeConstants';

const ResumePreviewCard = ({ templateName, TemplateComponent, onClick, isSelected }) => {
    return (
        <div
            className={`resume-preview-card ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="preview-card-image">
                {/* Scale the template down to fit in the card */}
                <div className="preview-scale-wrapper">
                    <TemplateComponent data={DUMMY_RESUME} />
                </div>
            </div>
            <div className="preview-card-footer">
                <h3>{templateName}</h3>
            </div>
        </div>
    );
};

export default ResumePreviewCard;
