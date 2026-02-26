import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/resumeBuilder.css';

import TemplateGallery from "../components/TemplateGallery";

export default function ResumeDashboard() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem("resumes")) || [];
            // Ensure we have an array
            setResumes(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to load resumes", e);
            setResumes([]);
        }
    }, []);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this resume?")) {
            const updatedResumes = resumes.filter(r => r.id !== id);
            localStorage.setItem("resumes", JSON.stringify(updatedResumes));
            setResumes(updatedResumes);
        }
    };

    return (
        <div className="resume-dashboard-wrapper">
            {/* Animated Background Elements */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
            <div className="bg-shape shape-3"></div>

            <div className="resume-builder-container relative z-10">
                {/* 3D Hero Section */}
                <div className="dashboard-hero-3d">
                    <div className="hero-content">
                        <div className="hero-badge">🚀 AI-Powered Resume Builder</div>
                        <h1 className="hero-title-3d">
                            Craft Your <br />
                            <span className="text-gradient">Professional Story</span>
                        </h1>
                        <p className="hero-subtitle-3d">
                            Stand out with impressive 3D templates and AI-driven content suggestions.
                            Build a job-winning resume in minutes, not hours.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-3d btn-primary-3d" onClick={() => navigate("/create")}>
                                <span className="btn-content">
                                    <span className="icon-plus">+</span> Create New Resume
                                </span>
                                <span className="btn-shadow"></span>
                            </button>
                            <button className="btn-3d btn-secondary-3d" onClick={() => document.getElementById('my-resumes').scrollIntoView({ behavior: 'smooth' })}>
                                <span className="btn-content">View My Resumes</span>
                                <span className="btn-shadow"></span>
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual-3d">
                        <div className="floating-card card-1">
                            <div className="glass-panel">
                                <div className="skeleton-header"></div>
                                <div className="skeleton-body">
                                    <div className="line l1"></div>
                                    <div className="line l2"></div>
                                    <div className="line l3"></div>
                                </div>
                            </div>
                        </div>
                        <div className="floating-card card-2">
                            <div className="glass-panel">
                                <div className="skeleton-circle"></div>
                                <div className="skeleton-body">
                                    <div className="line l1"></div>
                                    <div className="line l2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="floating-icon icon-1">⚡</div>
                        <div className="floating-icon icon-2">💼</div>
                        <div className="floating-icon icon-3">✨</div>
                    </div>
                </div>

        
                <TemplateGallery />

                {/* Dashboard Content */}
                <div id="my-resumes" className="dashboard-main-content">
                    <div className="section-header">
                        <h2 className="section-title-3d">My Documents</h2>
                        <div className="doc-count-badge">
                            {resumes.length} Resume{resumes.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    <div className="dashboard-grid-3d">
                        {/* Create New Card (Grid Item 1) */}
                        <div className="create-new-card-3d" onClick={() => navigate("/create")}>
                            <div className="create-content">
                                <div className="icon-container-3d">
                                    <div className="icon-plus-large">+</div>
                                    <div className="icon-ring"></div>
                                </div>
                                <h3>Create New Resume</h3>
                                <p>Start with a fresh template</p>
                            </div>
                            <div className="card-shine"></div>
                        </div>

                        {/* Existing Resumes */}
                        {resumes.map((r) => (
                            <div key={r.id} className="doc-card-3d" onClick={() => navigate(`/editor?id=${r.id}`)}>
                                <div className="doc-card-inner">
                                    <div className="doc-preview-3d">
                                        <div className="mini-resume-preview">
                                            <div className="preview-header"></div>
                                            <div className="preview-body">
                                                <div className="preview-sidebar"></div>
                                                <div className="preview-content">
                                                    <div className="p-line w-80"></div>
                                                    <div className="p-line w-60"></div>
                                                    <div className="p-line w-90"></div>
                                                    <div className="p-line w-70"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="doc-overlay">
                                            <button
                                                className="btn-icon-3d"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/editor?id=${r.id}`); }}
                                                title="Edit"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                className="btn-icon-3d"
                                                onClick={(e) => { e.stopPropagation(); navigate(`/preview?id=${r.id}`); }}
                                                title="Preview"
                                            >
                                                👁
                                            </button>
                                            <button
                                                className="btn-icon-3d delete"
                                                onClick={(e) => handleDelete(r.id, e)}
                                                title="Delete"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                    <div className="doc-info-3d">
                                        <h4 className="doc-name">{r.personal?.fullName || "Untitled Resume"}</h4>
                                        <div className="doc-meta">
                                            <span className="template-tag">{r.template || 'Modern'}</span>
                                            <span className="date-tag">{new Date(r.lastUpdated || r.id).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {resumes.length === 0 && (
                        <div className="empty-state-3d">
                            <div className="empty-visual">
                                <span className="empty-emoji">📝</span>
                                <div className="orbit-dot"></div>
                            </div>
                            <h3>No resumes yet</h3>
                            <p>Your professional journey begins with a single click.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
