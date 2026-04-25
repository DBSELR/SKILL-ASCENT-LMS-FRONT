import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div style={{ padding: '1in 0.8in', fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-slate-900 mb-2 tracking-tight">
          {personalInfo.fullName || 'John Doe'}
        </h1>
        <div className="text-sm text-slate-500 flex flex-wrap gap-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-8 flex gap-8 items-start">
          <div className="w-1/4 flex-shrink-0 text-sm font-semibold text-slate-400 uppercase tracking-widest pt-1">
            Summary
          </div>
          <div className="w-3/4 text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap text-justify">
            {personalInfo.summary}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8 flex gap-8 items-start">
          <div className="w-1/4 flex-shrink-0 text-sm font-semibold text-slate-400 uppercase tracking-widest pt-1">
            Experience
          </div>
          <div className="w-3/4 space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900 text-base">{exp.position}</h3>
                  <span className="text-sm text-slate-500 whitespace-nowrap">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-600 mb-3">{exp.company}</div>
                <div className="text-sm font-normal text-slate-700 whitespace-pre-wrap pl-3 border-l-2 border-slate-200 text-justify"
                  style={{
                    listStyleType: 'disc',
                    display: 'list-item',
                    marginLeft: '1rem'
                  }}
                >
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8 flex gap-8 items-start">
          <div className="w-1/4 flex-shrink-0 text-sm font-semibold text-slate-400 uppercase tracking-widest pt-1">
            Projects
          </div>
          <div className="w-3/4 space-y-6">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900 text-base">
                    {proj.name}
                  </h3>
                  {proj.link && <span className="text-sm text-slate-500">{proj.link}</span>}
                </div>
                {proj.technologies && (
                  <div className="text-sm text-slate-500 mb-2">
                    {proj.technologies}
                  </div>
                )}
                <div className="text-sm font-normal text-slate-700 whitespace-pre-wrap pl-3 border-l-2 border-slate-200 text-justify"
                  style={{
                    listStyleType: 'disc',
                    display: 'list-item',
                    marginLeft: '1rem'
                  }}
                >
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-8 flex gap-8 items-start">
          <div className="w-1/4 flex-shrink-0 text-sm font-semibold text-slate-400 uppercase tracking-widest pt-1">
            Skills
          </div>
          <div className="w-3/4 text-sm font-normal text-slate-700 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-slate-200 text-justify">
            {skills}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8 flex gap-8 items-start">
          <div className="w-1/4 flex-shrink-0 text-sm font-semibold text-slate-400 uppercase tracking-widest pt-1">
            Education
          </div>
          <div className="w-3/4 space-y-5">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900 text-base">{edu.institution}</h3>
                  <span className="text-sm text-slate-500 whitespace-nowrap">
                    {edu.graduationDate}
                  </span>
                </div>
                <div className="text-sm text-slate-600 flex justify-between">
                  <span>{edu.degree} in {edu.field}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default MinimalistTemplate;
