import React from 'react';
import '../../styles/resumeBuilder.css';

const ResumeTemplateSimple = ({ data }) => {
    if (!data) return null;

    return (
        <div className="template-simple p-10 font-sans text-gray-800">
            <div className="flex items-start justify-between border-b pb-6 mb-6">
                <div>
                    <h1 className="text-4xl font-light text-blue-600 mb-2">{data.personal?.fullName}</h1>
                    <p className="max-w-md text-gray-600 text-sm leading-relaxed">{data.personal?.summary}</p>
                </div>
                <div className="text-right text-sm text-gray-500 space-y-1">
                    <div className="font-medium text-gray-900">Contact</div>
                    <div>{data.personal?.email}</div>
                    <div>{data.personal?.phone}</div>
                    <div>{data.personal?.linkedin}</div>
                </div>
            </div>

            {data.skills && data.skills.length > 0 && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <span className="font-bold text-blue-800 mr-2">Skills:</span>
                    <span className="text-blue-900 text-sm">{data.skills.join(" • ")}</span>
                </div>
            )}

            {data.experience && data.experience.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wider">Work Experience</h3>
                    <div className="space-y-6">
                        {data.experience.map((exp, i) => (
                            <div key={i} className="pl-4 border-l-2 border-blue-200">
                                <div className="flex justify-between mb-1">
                                    <h4 className="font-bold text-xl">{exp.role}</h4>
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">{exp.duration}</span>
                                </div>
                                <div className="text-blue-500 font-medium mb-2">{exp.company}</div>
                                <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-8">
                {data.education && data.education.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wider">Education</h3>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="font-bold">{edu.school}</div>
                                <div className="text-sm">{edu.degree}</div>
                                <div className="text-xs text-gray-500">{edu.year}</div>
                            </div>
                        ))}
                    </div>
                )}

                {data.achievements && data.achievements.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wider">Awards</h3>
                        {data.achievements.map((ach, i) => (
                            <div key={i} className="mb-2">
                                <div className="font-bold">{ach.title}</div>
                                <div className="text-sm text-gray-600">{ach.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeTemplateSimple;
