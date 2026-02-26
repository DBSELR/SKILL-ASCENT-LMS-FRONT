import React from 'react';
import '../../styles/ResumeTemplateExecutive.css';

const ResumeTemplateExecutive = ({ data }) => {
    if (!data) return null;

    const getInitials = (name) => {
        return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : "OW";
    };

    // Helper for watermrk initials (First Last) -> FL
    const watermarkInitials = getInitials(data.personal?.fullName);

    return (
        <div className="template-executive-refreshed">

            {/* Left Sidebar */}
            <aside className="exec-sidebar">

                {/* Photo & Decoration */}
                <div className="exec-photo-container">
                    {/* Decorative Stars (SVGs or Unicode) */}
                    <div className="star-decoration star-top-right">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" /></svg>
                    </div>
                    <div className="star-decoration star-bottom-left">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" /></svg>
                    </div>

                    <div className="exec-photo-frame">
                        {data.personal?.photo ? (
                            <img
                                src={data.personal.photo}
                                alt={data.personal.fullName}
                                className="exec-photo"
                            />
                        ) : (
                            <div className="exec-initials">
                                {watermarkInitials}
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="exec-sidebar-section">
                    <h3 className="exec-sidebar-title">Contact</h3>
                    <ul className="exec-contact-list">
                        {data.personal?.phone && (
                            <li className="exec-contact-item">
                                <span className="contact-icon">📞</span>
                                <span>{data.personal.phone}</span>
                            </li>
                        )}
                        {data.personal?.email && (
                            <li className="exec-contact-item">
                                <span className="contact-icon">@</span>
                                <span>{data.personal.email}</span>
                            </li>
                        )}
                        {data.personal?.address && (
                            <li className="exec-contact-item">
                                <span className="contact-icon">📍</span>
                                <span>{data.personal.address}</span>
                            </li>
                        )}
                        {!data.personal?.address && (
                            <li className="exec-contact-item">
                                <span className="contact-icon">📍</span>
                                <span>123 Anywhere St., Any City, ST 12345</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* About Me */}
                <div className="exec-sidebar-section">
                    <h3 className="exec-sidebar-title">About Me</h3>
                    <p className="exec-description" style={{ marginTop: '0' }}>
                        {data.personal?.summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."}
                    </p>
                </div>

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <div className="exec-sidebar-section">
                        <h3 className="exec-sidebar-title">Skills</h3>
                        <ul className="exec-skills-list">
                            {data.skills.map((skill, index) => (
                                <li key={index} className="exec-skill-item">
                                    <span className="skill-bullet">•</span> {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Languages (Mock/Derived if not in data) */}
                <div className="exec-sidebar-section">
                    <h3 className="exec-sidebar-title">Language</h3>
                    <ul className="exec-skills-list">
                        <li className="exec-skill-item"><span className="skill-bullet">•</span> English</li>
                        <li className="exec-skill-item"><span className="skill-bullet">•</span> Spanish</li>
                    </ul>
                </div>

            </aside>

            {/* Right Main Content */}
            <main className="exec-main">

                {/* Header with Watermark */}
                <header className="exec-header">
                    <div className="exec-watermark">{watermarkInitials}</div>
                    <h1 className="exec-name">{data.personal?.fullName || "Olivia Wilson"}</h1>
                    <div className="exec-title">{data.experience?.[0]?.role || "Marketing Manager"}</div>
                </header>

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <div className="exec-main-section">
                        <h3 className="exec-section-title">Education</h3>
                        <div className="exec-timeline">
                            {data.education.map((edu, index) => (
                                <div key={index} className="exec-timeline-item">
                                    <div className="exec-item-header">
                                        <div className="exec-role">{edu.degree}</div>
                                        <div className="exec-company">{edu.school}</div>
                                        <div className="exec-date">{edu.year}</div>
                                    </div>
                                    <p className="exec-description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div className="exec-main-section">
                        <h3 className="exec-section-title">Experience</h3>
                        <div className="exec-timeline">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="exec-timeline-item">
                                    <div className="exec-item-header">
                                        <div className="exec-role">{exp.role}</div>
                                        <div className="exec-company">{exp.company}</div>
                                        <div className="exec-date">{exp.duration}</div>
                                    </div>
                                    <p className="exec-description">
                                        {exp.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* References (Static/Mock for layout match) */}
                <div className="exec-main-section">
                    <h3 className="exec-section-title">References</h3>
                    <div className="exec-references-grid">
                        <div className="exec-ref-item">
                            <div className="exec-ref-name">Harumi Kobayashi</div>
                            <div className="exec-ref-company">Wardiere Inc. / CEO</div>
                            <div className="exec-ref-contact">Phone: 123-456-7890</div>
                            <div className="exec-ref-contact">Email: hello@reallygreatsite.com</div>
                        </div>
                        <div className="exec-ref-item">
                            <div className="exec-ref-name">Bailey Dupont</div>
                            <div className="exec-ref-company">Wardiere Inc. / CEO</div>
                            <div className="exec-ref-contact">Phone: 123-456-7890</div>
                            <div className="exec-ref-contact">Email: hello@reallygreatsite.com</div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ResumeTemplateExecutive;
