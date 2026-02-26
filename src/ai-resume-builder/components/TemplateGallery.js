import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES, DUMMY_RESUME } from '../utils/resumeConstants';
import ResumeTemplateModern from './resume/ResumeTemplateModern';
import ResumeTemplateMinimal from './resume/ResumeTemplateMinimal';
import ResumeTemplateProfessional from './resume/ResumeTemplateProfessional';
import ResumeTemplateCreative from './resume/ResumeTemplateCreative';
import ResumeTemplateExecutive from './resume/ResumeTemplateExecutive';
import ResumeTemplateSimple from './resume/ResumeTemplateSimple';

// Map template IDs to their components
const TEMPLATE_COMPONENTS = {
    modern: ResumeTemplateModern,
    minimal: ResumeTemplateMinimal,
    professional: ResumeTemplateProfessional,
    creative: ResumeTemplateCreative,
    executive: ResumeTemplateExecutive,
    simple: ResumeTemplateSimple
};

// Zety-Style Colors for the little dots
const TEMPLATE_COLORS = {
    modern: ['#3b82f6', '#1e293b', '#64748b'],
    minimal: ['#1e293b', '#94a3b8', '#ffffff'],
    professional: ['#1e3a8a', '#dc2626', '#1d4ed8'],
    creative: ['#f97316', '#2d3748', '#fff7ed'],
    executive: ['#1e3a8a', '#0f172a', '#e2e8f0'],
    simple: ['#334155', '#475569', '#f1f5f9']
};

export default function TemplateGallery() {
    const navigate = useNavigate();

    const handleUseTemplate = (templateId) => {
        // Create a new resume with this template
        const newResume = {
            id: Date.now(),
            template: templateId,
            lastUpdated: new Date().toISOString(),
            personal: {},
            education: [],
            experience: [],
            skills: [],
            projects: []
        };

        const existing = JSON.parse(localStorage.getItem("resumes")) || [];
        existing.push(newResume);
        localStorage.setItem("resumes", JSON.stringify(existing));

        navigate(`/editor?id=${newResume.id}`);
    };

    return (
        <section className="template-gallery-section-3d">
            <div className="gallery-background-shapes">
                <div className="shape g-shape-1"></div>
                <div className="shape g-shape-2"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="gallery-header-3d text-center mb-16">
                    <span className="gallery-subtitle">Choose Your Style</span>
                    <h2 className="gallery-title">
                        Premium <span className="text-gradient">Templates</span>
                    </h2>
                    <p className="gallery-description">
                        Professionally designed, ATS-friendly, and ready to get you hired.
                        Select a template to start building your future.
                    </p>
                </div>

                <div className="gallery-grid-3d">
                    {TEMPLATES.map((template, index) => {
                        const Component = TEMPLATE_COMPONENTS[template.id] || ResumeTemplateModern;
                        const colors = TEMPLATE_COLORS[template.id] || ['#ccc'];

                        return (
                            <div key={template.id} className="template-card-3d-wrapper" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="template-card-3d">
                                    <div className="card-3d-inner">
                                        <div className="card-3d-front">
                                            <div className="template-preview-container">
                                                <div className="preview-scaler">
                                                    <Component data={{ ...DUMMY_RESUME, template: template.id }} />
                                                </div>
                                                <div className="card-overlay-gradient"></div>

                                                <div className="card-actions-overlay">
                                                    <button
                                                        onClick={() => handleUseTemplate(template.id)}
                                                        className="btn-use-template-3d"
                                                    >
                                                        <span>Select Template</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="template-info-3d">
                                                <div className="info-header">
                                                    <h3 className="template-name">{template.name}</h3>
                                                    <div className="template-tag-badge">Popular</div>
                                                </div>
                                                <div className="color-swatches">
                                                    {colors.map((color, i) => (
                                                        <span
                                                            key={i}
                                                            className="color-dot"
                                                            style={{ backgroundColor: color }}
                                                            title={`Color variant ${i + 1}`}
                                                        ></span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
