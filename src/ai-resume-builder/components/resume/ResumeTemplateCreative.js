import React from 'react';
import '../../styles/resumeBuilder.css';

const ResumeTemplateCreative = ({ data }) => {
    if (!data) return null;

    // Helper to get initials if no photo
    const getInitials = (name) => {
        return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : "N";
    };

    return (
        <div className="template-creative-refreshed">
            {/* Header Section */}
            <div className="creative-header">
                <div className="header-content">
                    {/* Just a decorative shape or logic can go here if needed */}
                </div>

                {/* Profile Photo - Central and overlapping */}
                <div className="profile-photo-container">
                    {data.personal?.photo ? (
                        <img
                            src={data.personal.photo}
                            alt={data.personal.fullName}
                            className="profile-photo"
                        />
                    ) : (
                        <div className="profile-initials">
                            {getInitials(data.personal?.fullName)}
                        </div>
                    )}
                </div>

                {/* Name and Title */}
                <div className="header-text">
                    <h1 className="name">{data.personal?.fullName || "Your Name"}</h1>
                    <div className="title-badge">
                        {data.experience?.[0]?.role || "Creative Professional"}
                    </div>
                </div>

                {/* Company Name / Logo Placeholder */}
                <div className="company-branding">
                    {/* Using a generic icon/logo representation */}
                    <div className="brand-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="company-name">{data.experience?.[0]?.company || "Company Name"}</span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="creative-grid">

                {/* Left Column */}
                <div className="left-column">

                    {/* Education & Experience */}
                    <div className="section">
                        <div className="section-header">
                            <div className="icon-circle">
                                <span>🎓</span>
                            </div>
                            <h3 className="section-title">Education <br /> & Experience</h3>
                        </div>

                        <div className="section-content">
                            <p className="intro-text">
                                {data.personal?.fullName ? `${data.personal.fullName}'s` : "Candidate's"} professional journey effectively combines academic excellence with practical experience.
                            </p>

                            <ol className="timeline-list">
                                {data.education && data.education.map((edu, index) => (
                                    <li key={`edu-${index}`}>
                                        Graduated from <strong>{edu.school}</strong>. {edu.degree && <span>({edu.degree})</span>} in {edu.year}.
                                    </li>
                                ))}
                                {data.experience && data.experience.map((exp, index) => (
                                    <li key={`exp-${index}`}>
                                        Started role as <strong>{exp.role}</strong> at {exp.company} ({exp.duration}).
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Achievements (Mapping Skills/Projects mostly here or mapped explicitly) */}
                    <div className="section">
                        <div className="section-header">
                            <div className="icon-circle">
                                <span>🏆</span>
                            </div>
                            <h3 className="section-title">Achievements</h3>
                        </div>
                        <div className="section-content">
                            <ul className="bullet-list">
                                {data.skills && data.skills.length > 0 ? (
                                    data.skills.map((skill, index) => (
                                        <li key={index}>Proficient in {skill}, demonstrating strong capability in this area.</li>
                                    ))
                                ) : (
                                    <>
                                        <li>Organized and presented numerous successful projects.</li>
                                        <li>Recognized for outstanding performance and dedication.</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="right-column">

                    {/* Working Approach (Summary) */}
                    <div className="section">
                        <div className="section-header">
                            <div className="icon-circle">
                                <span>💼</span>
                            </div>
                            <h3 className="section-title">Working <br /> Approach</h3>
                        </div>
                        <div className="section-content">
                            <p className="long-text">
                                {data.personal?.summary || "Placing values on integrity and diligence, I spend time with clients by helping them identify their financial weaknesses and achieve their goals through a comprehensive financial approach. I understand that organizations have sensitive concerns about their financial futures."}
                            </p>
                        </div>
                    </div>

                    {/* Outside the Office (Interests/Hobbies) */}
                    <div className="section">
                        <div className="section-header">
                            <div className="icon-circle">
                                <span>👤</span>
                            </div>
                            <h3 className="section-title">Outside the Office</h3>
                        </div>
                        <div className="section-content">
                            <p className="long-text">
                                {data.personal?.interests || "When not at work, I enjoy traveling, spending time with family, and exploring new cultures. I believe in maintaining a healthy work-life balance."}
                            </p>
                            {/* Quote */}
                            <div className="quote-box">
                                "You can be young without money, but you cannot be old without it."
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Contact Info */}
            <div className="creative-footer">
                <div className="footer-item">
                    <span className="footer-icon">✉</span>
                    <span>{data.personal?.email || "email@example.com"}</span>
                </div>
                <div className="footer-item">
                    <span className="footer-icon">in</span>
                    <span>{data.personal?.linkedin || "linkedin.com/in/username"}</span>
                </div>
                <div className="footer-item">
                    <span className="footer-icon">🎧</span>
                    <span>{data.personal?.phone || "+1 234 567 890"}</span>
                </div>
                <div className="footer-item">
                    {/* Twitter/Generic */}
                    <span className="footer-icon">🐦</span>
                    <span>@{data.personal?.fullName ? data.personal.fullName.replace(/\s+/g, '').toLowerCase() : "username"}</span>
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplateCreative;
