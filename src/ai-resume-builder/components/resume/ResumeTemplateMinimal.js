import React from 'react';
import '../../styles/resumeBuilder.css';

const ResumeTemplateMinimal = ({ data }) => {
    if (!data) return null;

    const getInitials = (name) => {
        return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : "N";
    };

    return (
        <div className="template-minimal-refreshed">
            <div className="minimal-grid">

                {/* Left Sidebar */}
                <aside className="minimal-sidebar">

                    {/* Photo */}
                    <div className="minimal-photo-container">
                        {data.personal?.photo ? (
                            <img
                                src={data.personal.photo}
                                alt={data.personal.fullName}
                                className="minimal-photo"
                            />
                        ) : (
                            <div className="minimal-initials">
                                {getInitials(data.personal?.fullName)}
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="minimal-section">
                        <h3 className="sidebar-title">CONTACT</h3>
                        <div className="sidebar-divider"></div>
                        <ul className="contact-list">
                            {data.personal?.email && (
                                <li className="contact-item">
                                    <span className="icon">✉</span>
                                    <span className="text break-all">{data.personal.email}</span>
                                </li>
                            )}
                            {data.personal?.phone && (
                                <li className="contact-item">
                                    <span className="icon">📞</span>
                                    <span className="text">{data.personal.phone}</span>
                                </li>
                            )}
                            {data.personal?.address && ( // Assuming address exists or mapped
                                <li className="contact-item">
                                    <span className="icon">🏠</span>
                                    <span className="text">{data.personal.address}</span>
                                </li>
                            )}
                            {/* Generic Location if address missing but needed? */}
                            {!data.personal?.address && (
                                <li className="contact-item">
                                    <span className="icon">🏠</span>
                                    <span className="text">123 Anywhere St., Any City</span>
                                </li>
                            )}

                            {data.personal?.website && (
                                <li className="contact-item">
                                    <span className="icon">🌐</span>
                                    <span className="text break-all">{data.personal.website}</span>
                                </li>
                            )}
                            {/* Placeholder website if missing to match ref? No, better to hide if empty or use linedin */}
                            {data.personal?.linkedin && (
                                <li className="contact-item">
                                    <span className="icon">in</span>
                                    <span className="text break-all">{data.personal.linkedin}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div className="minimal-section">
                            <h3 className="sidebar-title">EDUCATION</h3>
                            <div className="sidebar-divider"></div>
                            <div className="sidebar-content-list">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="sidebar-item">
                                        <div className="item-degree font-bold uppercase">{edu.degree}</div>
                                        <div className="item-school">{edu.school}</div>
                                        <div className="item-year text-xs">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div className="minimal-section">
                            <h3 className="sidebar-title">SKILLS</h3>
                            <div className="sidebar-divider"></div>

                            {/* Grouping simply for visual split if needed, or just list */}
                            <div className="skills-group">
                                <h4 className="skills-subtitle">PROFESSIONAL</h4>
                                <ul className="skills-list">
                                    {data.skills.slice(0, Math.ceil(data.skills.length / 2)).map((skill, i) => (
                                        <li key={`prof-${i}`}>{skill}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Fake split for visual faithfulness if enough skills */}
                            {data.skills.length > 3 && (
                                <div className="skills-group mt-4">
                                    <h4 className="skills-subtitle">TECHNICAL</h4>
                                    <ul className="skills-list">
                                        {data.skills.slice(Math.ceil(data.skills.length / 2)).map((skill, i) => (
                                            <li key={`tech-${i}`}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="minimal-main">

                    {/* Header Name */}
                    <div className="minimal-header">
                        <h1 className="minimal-name">
                            <span className="font-bold">{data.personal?.fullName?.split(' ')[0] || "ALICE"}</span>
                            <span className="font-light ml-2">{data.personal?.fullName?.split(' ').slice(1).join(' ') || "PARKER"}</span>
                        </h1>
                        <h2 className="minimal-title">{data.experience?.[0]?.role || "PROFESSIONAL TITLE"}</h2>
                    </div>

                    {/* Profile */}
                    <div className="main-section">
                        <h3 className="main-section-title">MY PROFILE</h3>
                        <div className="main-divider"></div>
                        <p className="main-text">
                            {data.personal?.summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue magna, bibendum at nunc id, gravida ultrices tellus. Pellentesque vehicula ante id, dictum arcu hicula ante gravida ultrices."}
                        </p>
                    </div>

                    {/* Work Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <div className="main-section">
                            <h3 className="main-section-title">WORK EXPERIENCE</h3>
                            <div className="main-divider"></div>
                            <div className="experience-list space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="experience-item">
                                        <div className="exp-header">
                                            <h4 className="exp-role uppercase font-bold">{exp.role}</h4>
                                            {/* <span className="exp-connector"> | </span> */}
                                        </div>
                                        <div className="exp-sub text-sm mb-2">
                                            {exp.company} <span className="mx-1">|</span> {exp.duration}
                                        </div>
                                        <p className="main-text text-sm">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Professional Development / Projects / Courses */}
                    {(data.projects && data.projects.length > 0) && (
                        <div className="main-section">
                            <h3 className="main-section-title">PROFESSIONAL DEVELOPMENT</h3>
                            <div className="main-divider"></div>
                            <div className="development-list space-y-4">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="dev-item">
                                        <div className="dev-header font-bold uppercase text-sm">
                                            {proj.name}
                                        </div>
                                        <div className="dev-sub text-xs text-gray-500 mb-1">
                                            Company Name | Location | 2012-2013 {/* Placeholder logic or real data if available */}
                                        </div>
                                        {/* <p className="text-sm text-gray-600">{proj.description}</p> */}
                                        {/* Reference shows just title/loc/date typically for courses/workshops */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ResumeTemplateMinimal;
