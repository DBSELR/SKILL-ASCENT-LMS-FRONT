import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TEMPLATES, DUMMY_RESUME } from "../utils/resumeConstants";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Sparkles, Layout } from "lucide-react";

// Template Components
import ResumeTemplateModern from "../components/resume/ResumeTemplateModern";
import ResumeTemplateMinimal from "../components/resume/ResumeTemplateMinimal";
import ResumeTemplateProfessional from "../components/resume/ResumeTemplateProfessional";
import ResumeTemplateCreative from "../components/resume/ResumeTemplateCreative";
import ResumeTemplateExecutive from "../components/resume/ResumeTemplateExecutive";
import ResumeTemplateSimple from "../components/resume/ResumeTemplateSimple";

// Styles
import '../styles/TemplateSelectionCreative.css';

// Map template IDs to their components
const TEMPLATE_COMPONENTS = {
    modern: ResumeTemplateModern,
    minimal: ResumeTemplateMinimal,
    professional: ResumeTemplateProfessional,
    creative: ResumeTemplateCreative,
    executive: ResumeTemplateExecutive,
    simple: ResumeTemplateSimple
};

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 10 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function TemplateSelection() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [currentTemplate, setCurrentTemplate] = useState(null);

    // Initial load logic mainly for visual highlighting if re-visiting
    useEffect(() => {
        if (id) {
            const list = JSON.parse(localStorage.getItem("resumes")) || [];
            const resume = list.find(r => r.id === parseInt(id));
            if (resume) {
                setCurrentTemplate(resume.template);
            }
        }
    }, [id]);

    const selectTemplate = (templateId) => {
        if (!id) {
            alert("No resume selected. Please start from the dashboard.");
            navigate('/ai-resume-dashboard');
            return;
        }

        const list = JSON.parse(localStorage.getItem("resumes")) || [];
        const updatedList = list.map(r => r.id === parseInt(id) ? { ...r, template: templateId } : r);
        localStorage.setItem("resumes", JSON.stringify(updatedList));
        setCurrentTemplate(templateId);

        // Animate out? Or just navigate.
        setTimeout(() => {
            navigate(`/editor?id=${id}`);
        }, 300);
    };

    return (
        <div className="creative-selection-container">
            {/* Animated Background Orbs */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>

            <header className="selection-header">
                <div className="back-btn-wrapper">
                    <button onClick={() => navigate(-1)} className="back-btn-creative">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="title-3d">
                        Choose Your <span style={{ color: '#818cf8' }}>Style</span>
                    </h1>
                    <p className="subtitle">
                        Select a premium template designed to get you hired.
                        ATS-friendly, fully customizable, and stunningly professional.
                    </p>
                </motion.div>
            </header>

            <motion.div
                className="templates-grid-3d"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {TEMPLATES.map((template) => {
                    const Component = TEMPLATE_COMPONENTS[template.id] || ResumeTemplateModern;
                    const isSelected = currentTemplate === template.id;

                    return (
                        <motion.div
                            key={template.id}
                            className="template-card-container"
                            variants={cardVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={`template-card-wrapper ${isSelected ? 'selected-template' : ''}`}>
                                {template.id === 'creative' && <div className="status-tag">Popular</div>}
                                {template.id === 'executive' && <div className="status-tag" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>New</div>}

                                <div className="card-preview-area">
                                    <div className="preview-scroller">
                                        <div className="preview-content-scaled">
                                            <Component data={{ ...DUMMY_RESUME, template: template.id }} />
                                        </div>
                                    </div>

                                    {/* Overlay for quick action */}
                                    <div className="card-overlay">
                                        <button
                                            onClick={() => selectTemplate(template.id)}
                                            className="btn-use-creative"
                                        >
                                            {isSelected ? <Check size={20} /> : <Sparkles size={20} />}
                                            {isSelected ? "Selected" : "Use Template"}
                                        </button>
                                    </div>
                                </div>

                                <div className="card-info">
                                    <h3 className="template-name">{template.name}</h3>
                                    <span className="template-badge">
                                        <Layout size={12} style={{ marginRight: 4, display: 'inline' }} />
                                        {template.id.charAt(0).toUpperCase() + template.id.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <footer className="creative-footer">
                <p>Designed by D Base Solutions Pvt Ltd © 2025</p>
            </footer>
        </div>
    );
}
