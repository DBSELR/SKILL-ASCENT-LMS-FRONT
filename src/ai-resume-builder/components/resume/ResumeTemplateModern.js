import React from 'react';
import '../../styles/resumeBuilder.css';

const ResumeTemplateModern = ({ data }) => {
    if (!data) return null;

    return (
        <div className="template-modern">
            {/* Left Sidebar (Blue) */}
            <div className="modern-sidebar">
                {/* Photo Placeholder (if we had one) - Divya Style */}
                <div className="modern-photo-container">
                    {/* Placeholder for user photo if available, or initials */}
                    <div className="modern-initials">
                        {data.personal?.fullName ? data.personal.fullName.charAt(0) : "U"}
                    </div>
                </div>

                <div className="modern-sidebar-content">
                    {/* Contact */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Contact</h3>
                        <div className="sidebar-list">
                            {data.personal?.phone && <div className="sidebar-item">{data.personal.phone}</div>}
                            {data.personal?.email && <div className="sidebar-item break-words">{data.personal.email}</div>}
                            {data.personal?.address && <div className="sidebar-item">{data.personal.address}</div>} {/* Assuming address field exists or map from fields */}
                            {data.personal?.linkedin && <div className="sidebar-item text-blue-200">{data.personal.linkedin}</div>}
                        </div>
                    </div>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Education</h3>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="font-bold text-white">{edu.school}</div>
                                        <div className="text-sm text-blue-100">{edu.degree}</div>
                                        <div className="text-xs text-blue-200 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div className="sidebar-section">
                            <h3 className="sidebar-title">Skills</h3>
                            <ul className="sidebar-list list-disc list-inside">
                                {data.skills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content (White) */}
            <div className="modern-main">
                {/* Header */}
                <div className="modern-header">
                    <h1 className="modern-name">{data.personal?.fullName || "Your Name"}</h1>
                    <h2 className="modern-role">{data.experience?.[0]?.role || "Professional Title"}</h2>
                </div>

                {/* Profile */}
                {data.personal?.summary && (
                    <div className="modern-section">
                        <h3 className="modern-section-title">Profile</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {data.personal.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div className="modern-section">
                        <h3 className="modern-section-title">Experience</h3>
                        <div className="space-y-6">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="experience-item">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-800">{exp.company}</h4>
                                        <span className="text-sm text-gray-500">{exp.duration}</span>
                                    </div>
                                    <div className="text-blue-600 font-medium text-sm mb-2">{exp.role}</div>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements/Projects (if any) */}
                {/* Using a generic extra section if needed */}
                {data.projects && data.projects.length > 0 && (
                    <div className="modern-section">
                        <h3 className="modern-section-title">Projects</h3>
                        <div className="space-y-4">
                            {data.projects.map((proj, i) => (
                                <div key={i}>
                                    <div className="font-bold text-gray-800 flex justify-between">
                                        {proj.name}
                                        {proj.link && <a href={proj.link} className="text-blue-500 text-xs font-normal">Link</a>}
                                    </div>
                                    <p className="text-sm text-gray-600">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeTemplateModern;
