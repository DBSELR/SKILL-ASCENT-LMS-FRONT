import React from 'react';

const ExperienceForm = ({ data, updateData }) => {
    const experienceList = data?.experience || [];

    const addExperience = () => {
        const newExperience = [...experienceList, { company: '', role: '', duration: '', description: '' }];
        updateData({ ...data, experience: newExperience });
    };

    const updateExperience = (index, field, value) => {
        const newExperience = [...experienceList];
        newExperience[index][field] = value;
        updateData({ ...data, experience: newExperience });
    };

    const removeExperience = (index) => {
        const newExperience = [...experienceList];
        newExperience.splice(index, 1);
        updateData({ ...data, experience: newExperience });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Work Experience</h2>

            {experienceList.map((exp, index) => (
                <div key={index} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeExperience(index)}>×</button>
                    <div className="grid-2">
                        <div>
                            <label>Company Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Google"
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Job Title / Role</label>
                            <input
                                type="text"
                                placeholder="e.g. Senior Software Engineer"
                                value={exp.role}
                                onChange={(e) => updateExperience(index, 'role', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label>Duration</label>
                            <input
                                type="text"
                                placeholder="e.g. Jan 2020 - Present"
                                value={exp.duration}
                                onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Job Description & Achievements</label>
                        <textarea
                            rows="4"
                            placeholder="Describe your responsibilities and impact..."
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={addExperience}
                className="btn-secondary w-full"
            >
                + Add Experience
            </button>
        </div>
    );
};

export default ExperienceForm;
