import React from 'react';

const EducationForm = ({ data, updateData }) => {
    const educationList = data?.education || [];

    const addEducation = () => {
        const newEducation = [...educationList, { school: '', degree: '', year: '' }];
        updateData({ ...data, education: newEducation });
    };

    const updateEducation = (index, field, value) => {
        const newEducation = [...educationList];
        newEducation[index][field] = value;
        updateData({ ...data, education: newEducation });
    };

    const removeEducation = (index) => {
        const newEducation = [...educationList];
        newEducation.splice(index, 1);
        updateData({ ...data, education: newEducation });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Education</h2>

            {educationList.map((edu, index) => (
                <div key={index} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeEducation(index)}>×</button>
                    <div className="grid-2">
                        <div>
                            <label>School / University</label>
                            <input
                                type="text"
                                placeholder="e.g. Harvard University"
                                value={edu.school}
                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Degree / Major</label>
                            <input
                                type="text"
                                placeholder="e.g. Bachelor of Science in CS"
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Year / Duration</label>
                            <input
                                type="text"
                                placeholder="e.g. 2018 - 2022"
                                value={edu.year}
                                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addEducation}
                className="btn-secondary w-full"
            >
                + Add Education
            </button>
        </div>
    );
};

export default EducationForm;
