import React, { useState } from "react";
import '../styles/resumeBuilder.css';

export default function CoverLetterGenerator() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [jobDesc, setJobDesc] = useState("");

    const generate = () => {
        if (!jobDesc.trim()) {
            alert("Please enter a job description first.");
            return;
        }
        setLoading(true);
        // Dummy AI Logic
        setTimeout(() => {
            setText(`Date: ${new Date().toLocaleDateString()}

Dear Hiring Manager,

I am writing to express my strong interest in the open position based on the job description provided. With my background in technology and my passion for problem-solving, I believe I would be a valuable asset to your team.

I was particularly excited to see your focus on innovation and quality. In my previous roles, I have consistently demonstrated the ability to deliver high-quality results under tight deadlines. I am confident that my skills alignment with your requirements for "${jobDesc.slice(0, 30)}..." makes me a strong candidate.

Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to your organization.

Sincerely,
[Your Name]`);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="resume-builder-container">
            <h1 className="text-center mb-8">AI Cover Letter Generator</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="mb-4">1. Job Description</h3>
                    <p className="text-sm text-gray-500 mb-2">Paste the job description you are applying for:</p>
                    <textarea
                        rows="12"
                        placeholder="Paste job description here..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                    ></textarea>
                    <button
                        className="btn-primary w-full"
                        onClick={generate}
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate Cover Letter"}
                    </button>
                </div>

                <div className="card">
                    <h3 className="mb-4">2. Your AI Cover Letter</h3>
                    <div className="bg-gray-50 border p-6 rounded min-h-[400px] whitespace-pre-wrap font-serif">
                        {text || <span className="text-gray-400 italic">Your generated letter will appear here...</span>}
                    </div>
                    {text && (
                        <button
                            className="btn-secondary w-full mt-4"
                            onClick={() => navigator.clipboard.writeText(text)}
                        >
                            Copy to Clipboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
