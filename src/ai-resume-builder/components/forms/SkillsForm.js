import React, { useState } from "react";

export default function SkillsForm({ data, updateData }) {
    const [skill, setSkill] = useState("");
    const skillsList = data?.skills || [];

    const addSkill = () => {
        if (!skill.trim()) return;
        const updated = { ...data, skills: [...skillsList, skill.trim()] };
        updateData(updated);
        setSkill("");
    };

    const removeSkill = (index) => {
        const newSkills = [...skillsList];
        newSkills.splice(index, 1);
        updateData({ ...data, skills: newSkills });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Skills</h2>
            <div className="flex gap-4 mb-6">
                <input
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a skill and press Enter (e.g. React.js)"
                    className="flex-1 mb-0"
                />
                <button onClick={addSkill} className="btn-primary px-8">Add</button>
            </div>

            <div className="flex flex-wrap gap-2">
                {skillsList.map((s, i) => (
                    <span key={i} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-300 shadow-sm text-gray-700">
                        {s}
                        <button
                            onClick={() => removeSkill(i)}
                            className="ml-3 text-red-500 hover:text-red-700 font-bold focus:outline-none"
                            style={{ padding: 0, margin: '0 0 0 8px', fontSize: '1.2em', lineHeight: 1 }}
                        >
                            ×
                        </button>
                    </span>
                ))}
                {skillsList.length === 0 && <p className="text-gray-400">No skills added yet.</p>}
            </div>
        </div>
    );
}
