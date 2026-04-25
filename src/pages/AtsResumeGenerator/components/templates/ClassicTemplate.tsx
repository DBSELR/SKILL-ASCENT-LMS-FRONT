import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div style={{ padding: '0.8in', fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-black mb-2 tracking-wide">
          {personalInfo.fullName || 'John Doe'}
        </h1>
        <div className="text-sm text-black flex flex-wrap justify-center gap-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span>•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span>•</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-2">
            Summary
          </h2>
          <p className="text-sm text-black leading-snug whitespace-pre-wrap text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-end mb-1">
                  <div className="font-bold text-black text-base">{exp.company}</div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <div className="italic text-black text-sm">{exp.position}</div>
                  <span className="text-sm text-black whitespace-nowrap">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm text-black whitespace-pre-wrap pl-4" style={{
                  listStyleType: 'disc',
                  display: 'list-item',
                  marginLeft: '1rem'
                }}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold text-black">
                    {proj.name}
                    {proj.link && <span className="font-normal italic text-sm ml-2">({proj.link})</span>}
                  </div>
                </div>
                {proj.technologies && (
                  <div className="text-sm text-black mb-1">
                    <span className="font-semibold">Technologies: </span>{proj.technologies}
                  </div>
                )}
                <div className="text-sm text-black whitespace-pre-wrap pl-4 text-justify" style={{
                  listStyleType: 'disc',
                  display: 'list-item',
                  marginLeft: '1rem'
                }}>
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">
            Skills
          </h2>
          <div className="text-sm text-black leading-snug whitespace-pre-wrap text-justify">
            {skills}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-black">{edu.institution}</h3>
                  <span className="text-sm text-black whitespace-nowrap">
                    {edu.graduationDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="italic text-black">{edu.degree} - {edu.field}</span>
                  {edu.gpa && <span className="text-black">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassicTemplate;
