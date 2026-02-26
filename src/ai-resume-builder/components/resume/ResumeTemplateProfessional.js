import React from 'react';
import '../../styles/resumeBuilder.css';

const ResumeTemplateProfessional = ({ data }) => {
    if (!data) return null;

    const getInitials = (name) => {
        return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : "N";
    };

    return (
        <div className="template-professional-refreshed">
            <div className="professional-grid">

                {/* Left Sidebar (Dark) */}
                <aside className="professional-sidebar">

                    {/* Photo Area */}
                    <div className="prof-photo-container">
                        {data.personal?.photo ? (
                            <img
                                src={data.personal.photo}
                                alt={data.personal.fullName}
                                className="prof-photo"
                            />
                        ) : (
                            <div className="prof-initials">
                                {getInitials(data.personal?.fullName)}
                            </div>
                        )}
                    </div>

                    {/* Name Block */}
                    <div className="prof-identity">
                        <h1 className="prof-name">
                            {data.personal?.fullName ? (
                                <>
                                    <span className="block">{data.personal.fullName.split(' ')[0]}</span>
                                    <span className="block">{data.personal.fullName.split(' ').slice(1).join(' ')}</span>
                                </>
                            ) : "YOUR NAME"}
                        </h1>
                        {/* Title if desired, though reference mostly emphasizes name in sidebar */}
                        {data.experience?.[0]?.role && (
                            <p className="prof-role-subtitle">{data.experience[0].role}</p>
                        )}
                    </div>

                    {/* Contact Details */}
                    <div className="prof-sidebar-section">
                        <h3 className="prof-sidebar-title">CONTACT DETAILS</h3>
                        <div className="prof-sidebar-divider"></div>
                        <ul className="prof-contact-list">
                            {data.personal?.phone && (
                                <li className="contact-item">
                                    <div className="icon-circle-small">
                                        <span>📞</span>
                                    </div>
                                    <span className="text">{data.personal.phone}</span>
                                </li>
                            )}
                            {data.personal?.email && (
                                <li className="contact-item">
                                    <div className="icon-circle-small">
                                        <span>✉</span>
                                    </div>
                                    <span className="text break-all">{data.personal.email}</span>
                                </li>
                            )}
                            {data.personal?.address && (
                                <li className="contact-item">
                                    <div className="icon-circle-small">
                                        <span>📍</span>
                                    </div>
                                    <span className="text">{data.personal.address}</span>
                                </li>
                            )}
                            {/* Fallback address if empty */}
                            {!data.personal?.address && (
                                <li className="contact-item">
                                    <div className="icon-circle-small">
                                        <span>📍</span>
                                    </div>
                                    <span className="text">21 Cobblestone Road, York, Y01 0GZ</span>
                                </li>
                            )}
                            {data.personal?.linkedin && (
                                <li className="contact-item">
                                    <div className="icon-circle-small">
                                        <span>in</span>
                                    </div>
                                    <span className="text break-all">{data.personal.linkedin}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div className="prof-sidebar-section">
                            <h3 className="prof-sidebar-title">SKILLS</h3>
                            <div className="prof-sidebar-divider"></div>
                            <ul className="prof-skills-list">
                                {data.skills.map((skill, index) => (
                                    <li key={index}>• {skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </aside>


                {/* Right Main Content (White) */}
                <main className="professional-main">

                    {/* Personal Statement */}
                    <div className="prof-main-section">
                        <h3 className="prof-main-title">PERSONAL STATEMENT</h3>
                        <div className="prof-main-divider"></div>
                        <p className="prof-main-text">
                            {data.personal?.summary || "Efficient Driver with 10 years experience safely transporting people and goods. Expert in planning delivery routes and schedules, interpreting maps, and analyzing traffic trends to determine the fastest routes. Ready to leverage soft skills, like emotional intelligence, and hard skills, like delivery system innovation to support solutions at [Company Name]."}
                        </p>
                    </div>

                    {/* Work History */}
                    {data.experience && data.experience.length > 0 && (
                        <div className="prof-main-section">
                            <h3 className="prof-main-title">WORK HISTORY</h3>
                            <div className="prof-main-divider"></div>

                            <div className="prof-experience-list">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="prof-experience-item">
                                        <div className="prof-date-range">
                                            {exp.duration}
                                        </div>
                                        <div className="prof-job-header">
                                            <h4 className="prof-job-title">{exp.role}</h4>
                                            <div className="prof-company">{exp.company}</div>
                                        </div>
                                        <div className="prof-job-description">
                                            {/* Assuming description might be pre-formatted or just text */}
                                            <p>{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education - Placed below work history as is standard professional layout */}
                    {data.education && data.education.length > 0 && (
                        <div className="prof-main-section">
                            <h3 className="prof-main-title">EDUCATION</h3>
                            <div className="prof-main-divider"></div>
                            <div className="prof-education-list">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="prof-education-item">
                                        <div className="prof-date-range">{edu.year}</div>
                                        <div className="prof-edu-details">
                                            <h4 className="prof-degree">{edu.degree}</h4>
                                            <div className="prof-school">{edu.school}</div>
                                        </div>
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

export default ResumeTemplateProfessional;
