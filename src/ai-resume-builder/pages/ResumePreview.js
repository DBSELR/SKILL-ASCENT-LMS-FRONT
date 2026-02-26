import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResumeTemplateModern from "../components/resume/ResumeTemplateModern";
import ResumeTemplateMinimal from "../components/resume/ResumeTemplateMinimal";
import ResumeTemplateProfessional from "../components/resume/ResumeTemplateProfessional";
import ResumeTemplateCreative from "../components/resume/ResumeTemplateCreative";
import ResumeTemplateExecutive from "../components/resume/ResumeTemplateExecutive";
import ResumeTemplateSimple from "../components/resume/ResumeTemplateSimple";
import { DUMMY_RESUME } from "../utils/resumeConstants";
import '../styles/ResumePreview.css'; // New Styles

export default function ResumePreview() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [resume, setResume] = useState(null);
    const [showSample, setShowSample] = useState(false);

    // Zoom State
    const [zoom, setZoom] = useState(0.8); // Default 80% to fit screen nicely
    const containerRef = useRef(null);

    useEffect(() => {
        if (!id) return;
        const list = JSON.parse(localStorage.getItem("resumes")) || [];
        const found = list.find(r => r.id === parseInt(id));
        setResume(found);

        // If resume is empty (newly created), show sample data by default
        if (found && (!found.personal || !found.personal.fullName)) {
            setShowSample(true);
        }
    }, [id]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
    const handlePrint = () => window.print();

    if (!resume) {
        return (
            <div className="preview-loading">
                <div className="spinner"></div>
                <p>Loading your resume...</p>
            </div>
        );
    }

    // Determine which data to show
    const displayData = showSample ? { ...DUMMY_RESUME, template: resume.template } : resume;

    const renderTemplate = () => {
        const props = { data: displayData };

        switch (resume.template) {
            case 'minimal': return <ResumeTemplateMinimal {...props} />;
            case 'professional': return <ResumeTemplateProfessional {...props} />;
            case 'creative': return <ResumeTemplateCreative {...props} />;
            case 'executive': return <ResumeTemplateExecutive {...props} />;
            case 'simple': return <ResumeTemplateSimple {...props} />;
            case 'modern':
            default:
                return <ResumeTemplateModern {...props} />;
        }
    };

    return (
        <div className="resume-preview-page">

            {/* Toolbar */}
            <header className="preview-toolbar no-print">
                <div className="toolbar-left">
                    <button onClick={() => navigate(`/editor?id=${id}`)} className="btn-icon-text btn-back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back to Editor
                    </button>

                    <div className="template-pill">
                        <span>Template:</span>
                        <button onClick={() => navigate(`/templates?id=${id}`)}>
                            {resume.template || 'Modern'}
                        </button>
                    </div>
                </div>

                <div className="toolbar-center">
                    <div className="zoom-controls">
                        <button onClick={handleZoomOut} className="btn-zoom" title="Zoom Out">−</button>
                        <span className="zoom-label">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="btn-zoom" title="Zoom In">+</button>
                    </div>
                </div>

                <div className="toolbar-right">
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            className="sr-only toggle-checkbox"
                            checked={showSample}
                            onChange={() => setShowSample(!showSample)}
                        />
                        <div className="toggle-track">
                            <div className="toggle-thumb"></div>
                        </div>
                        <span className="toggle-label">{showSample ? 'Sample' : 'My Data'}</span>
                    </label>

                    <button className="btn-icon-text btn-secondary-action hidden md:flex" onClick={() => navigate('/ai-resume-dashboard')}>
                        Dashboard
                    </button>

                    <button onClick={handlePrint} className="btn-icon-text btn-action">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
                        Download PDF
                    </button>
                </div>
            </header>

            {/* Main Preview Area */}
            <div className="preview-viewer" ref={containerRef}>
                <div
                    className="preview-paper"
                    style={{ transform: `scale(${zoom})`, marginTop: zoom < 1 ? '0' : '20px' }}
                >
                    {renderTemplate()}

                    {/* Watermark overlay if sample mode */}
                    {showSample && (
                        <div className="sample-watermark no-print">
                            SAMPLE DATA
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
