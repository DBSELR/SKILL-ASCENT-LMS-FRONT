import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div style={{ padding: '1cm' }}>
      {/* Header */}
      <div className="text-center mb-6 border-b border-slate-300 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 uppercase tracking-wide">
          {personalInfo.fullName || 'John Doe'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-slate-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.github}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-slate-300">|</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 mb-2 pb-1">
            Summary
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 mb-3 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                  <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-800 mb-2">{exp.company}</div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap pl-4 text-justify" style={{
                  listStyleType: 'disc',
                  display: 'list-item',
                  marginLeft: '1rem' // Simulate bullets if they use '-'
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
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 mb-3 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900">
                    {proj.name}
                    {proj.link && (
                      <span className="text-slate-500 font-normal ml-2 text-sm">{proj.link}</span>
                    )}
                  </h3>
                </div>
                {proj.technologies && (
                  <div className="text-sm text-slate-600 mb-1 italic">
                    {proj.technologies}
                  </div>
                )}
                <div className="text-sm text-slate-700 whitespace-pre-wrap text-justify">
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 mb-3 pb-1">
            Skills
          </h2>
          <div className="text-sm text-slate-800 leading-relaxed text-justify whitespace-pre-wrap">
            {skills}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 mb-3 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900">{edu.institution}</h3>
                  <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    {edu.graduationDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-800">{edu.degree} in {edu.field}</span>
                  {edu.gpa && <span className="text-slate-600">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ModernTemplate;
