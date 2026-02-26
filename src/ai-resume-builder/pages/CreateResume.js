import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, LayoutTemplate, FileText } from "lucide-react";
import '../styles/ResumeEditorCreative.css';

export default function CreateResume() {
    const navigate = useNavigate();

    const createNew = () => {
        const newResume = {
            id: Date.now(),
            lastUpdated: Date.now(),
            template: "modern",
            personal: {
                fullName: "",
                email: "",
                phone: "",
                linkedin: "",
                summary: ""
            },
            education: [],
            experience: [],
            skills: [],
            projects: [],
            achievements: []
        };

        try {
            const list = JSON.parse(localStorage.getItem("resumes")) || [];
            // Ensure it is an array
            const currentList = Array.isArray(list) ? list : [];
            currentList.push(newResume);
            localStorage.setItem("resumes", JSON.stringify(currentList));

            navigate(`/editor?id=${newResume.id}`);
        } catch (e) {
            console.error("Error creating resume", e);
            alert("Failed to create new resume. Please try clearing your browser data.");
        }
    };

    return (
        <div className="creative-editor-container flex items-center justify-center">
            {/* Ambient Background Elements */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative z-10 max-w-3xl w-full"
            >
                <div className="main-content-glass text-center p-12 md:p-16 border-t-4 border-t-indigo-500">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform hover:rotate-12 transition-transform duration-300"
                    >
                        <Sparkles className="text-white w-12 h-12" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600">
                        Craft Your Perfect Resume
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
                        Start from scratch with our AI-powered builder. Choose from creative templates and stand out from the crowd.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <motion.button
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary-3d text-lg px-8 py-4 w-full sm:w-auto justify-center group"
                            onClick={createNew}
                        >
                            <FileText size={24} />
                            Start Building Now
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary-3d text-lg px-8 py-4 w-full sm:w-auto justify-center"
                            onClick={() => navigate('/ai-resume-dashboard')}
                        >
                            <LayoutTemplate size={24} />
                            Back to Dashboard
                        </motion.button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200/60 flex justify-center gap-8 text-slate-400 text-sm font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div> AI Scoring</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> ATS Friendly</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400"></div> Premium Templates</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
