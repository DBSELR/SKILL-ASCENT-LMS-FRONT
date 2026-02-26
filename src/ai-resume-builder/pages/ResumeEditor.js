import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Briefcase, GraduationCap, Wrench,
    FolderGit2, Award, ChevronLeft, ChevronRight,
    Save, LayoutTemplate, Eye, ArrowLeft
} from "lucide-react";

import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import EducationForm from "../components/forms/EducationForm";
import ExperienceForm from "../components/forms/ExperienceForm";
import SkillsForm from "../components/forms/SkillsForm";
import ProjectsForm from "../components/forms/ProjectsForm";
import AchievementsForm from "../components/forms/AchievementsForm";
import ATSScore from "../components/ai/ATSScore";
import '../styles/ResumeEditorCreative.css';

const STEPS = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'achievements', label: 'Achievements', icon: Award },
];

export default function ResumeEditor() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [resume, setResume] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate('/ai-resume-dashboard');
            return;
        }

        try {
            const list = JSON.parse(localStorage.getItem("resumes")) || [];
            const found = list.find(r => r.id === parseInt(id));
            if (found) {
                setResume(found);
            } else {
                alert("Resume not found");
                navigate('/ai-resume-dashboard');
            }
        } catch (e) {
            console.error(e);
            navigate('/ai-resume-dashboard');
        }
    }, [id, navigate]);

    const saveResume = (updatedData) => {
        setIsSaving(true);
        const newResume = { ...updatedData, lastUpdated: Date.now() };
        setResume(newResume);

        const list = JSON.parse(localStorage.getItem("resumes")) || [];
        const newList = list.map(r => r.id === parseInt(id) ? newResume : r);
        localStorage.setItem("resumes", JSON.stringify(newList));

        setTimeout(() => setIsSaving(false), 800);
    };

    if (!resume) return (
        <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
        </div>
    );

    const renderStep = () => {
        const StepComponent = [
            PersonalInfoForm, ExperienceForm, EducationForm,
            SkillsForm, ProjectsForm, AchievementsForm
        ][currentStep];

        return (
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, rotateX: -5 }}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                exit={{ opacity: 0, x: -20, rotateX: 5 }}
                transition={{ duration: 0.4, ease: "anticipate" }}
                className="perspective-1000"
            >
                <StepComponent data={resume} updateData={saveResume} />
            </motion.div>
        );
    };

    return (
        <div className="creative-editor-container">
            {/* Ambient Background Elements */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="editor-header"
            >
                <div className="header-title flex items-center gap-4">
                    <button onClick={() => navigate('/ai-resume-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            {resume.personal?.fullName || "Untitled Resume"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                            {isSaving ? (
                                <span className="flex items-center gap-1 text-green-500">
                                    <Save size={12} className="animate-spin" /> Saving...
                                </span>
                            ) : "All changes saved"}
                        </p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn-secondary-3d" onClick={() => navigate(`/templates?id=${id}`)}>
                        <LayoutTemplate size={18} /> Templates
                    </button>
                    <button className="btn-primary-3d" onClick={() => navigate(`/preview?id=${id}`)}>
                        <Eye size={18} /> Preview
                    </button>
                </div>
            </motion.header>

            <div className="editor-layout-creative">
                {/* Sidebar Navigation */}
                <aside className="sidebar-glass">
                    <div className="step-indicator">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.id}
                                    className={`step-item-creative ${index === currentStep ? 'active' : ''}`}
                                    onClick={() => setCurrentStep(index)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="step-icon-box">
                                        <Icon size={20} />
                                    </div>
                                    <span className="step-label">{step.label}</span>
                                    {index === currentStep && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 border-2 border-indigo-500 rounded-2xl pointer-events-none"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200/50">
                        <div className="ats-score-card">
                            <h4 className="text-center text-sm uppercase tracking-widest mb-4 opacity-80">Resume Strength</h4>
                            <ATSScore data={resume} />
                        </div>
                    </div>
                </aside>

                {/* Main Content Form */}
                <main className="main-content-glass">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="form-section-title">{STEPS[currentStep].label}</h3>
                        <span className="text-sm font-bold text-slate-400">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`btn-secondary-3d ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={currentStep === 0}
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        >
                            <ChevronLeft size={18} /> Previous
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary-3d"
                            onClick={() => {
                                if (currentStep < STEPS.length - 1) {
                                    setCurrentStep(currentStep + 1);
                                } else {
                                    navigate(`/preview?id=${id}`);
                                }
                            }}
                        >
                            {currentStep < STEPS.length - 1 ? (
                                <>Next <ChevronRight size={18} /></>
                            ) : (
                                <>Finish & Preview <Eye size={18} /></>
                            )}
                        </motion.button>
                    </div>
                </main>
            </div>
        </div>
    );
}

