import React, { useState } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import { ChevronDown, ChevronUp, Plus, Trash2, User, Mail, Phone, MapPin, Link, Briefcase, GraduationCap, Code2, Wrench, LayoutTemplate } from 'lucide-react';

interface SidebarProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const SectionHeader = ({ title, section, icon: Icon, openSection, toggleSection }: { title: string, section: string, icon: any, openSection: string | null, toggleSection: (section: string) => void }) => (
  <button
    onClick={() => toggleSection(section)}
    className="w-full flex justify-between items-center py-3.5 px-6 bg-white hover:bg-slate-50 transition border-b border-slate-200"
    style={{ margin: 0 }}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${openSection === section ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-sm font-bold text-slate-800 tracking-wide">{title}</h2>
    </div>
    {openSection === section ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
  </button>
);

const InputField = ({ label, name, value, onChange, icon: Icon, placeholder, type = "text" }: any) => (
  <div style={{ margin: 0, padding: 0 }}>
    <label
      className="block text-xs font-semibold text-slate-700 ml-1"
      style={{ margin: 0, padding: 0, marginBottom: '4px', lineHeight: '1.2' }}
    >
      {label}
    </label>
    <div className="relative" style={{ margin: 0, padding: 0 }}>
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        style={{ margin: 0, height: '42px', boxSizing: 'border-box' }}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 4 }: any) => (
  <div style={{ margin: 0, padding: 0 }}>
    <label
      className="block text-xs font-semibold text-slate-700 ml-1"
      style={{ margin: 0, padding: 0, marginBottom: '4px', lineHeight: '1.2' }}
    >
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition p-4 resize-y"
      style={{ margin: 0, boxSizing: 'border-box' }}
      placeholder={placeholder}
    ></textarea>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ data, setData }) => {
  const [openSection, setOpenSection] = useState<string | null>('personal');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const updatePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Template Selection */}
      <div style={{ margin: 0, padding: 0 }}>
        <SectionHeader title="Resume Template" section="template" icon={LayoutTemplate} openSection={openSection} toggleSection={toggleSection} />
        {openSection === 'template' && (
          <div className="p-6 animate-in slide-in-from-top-2 duration-200" style={{ margin: 0 }}>
            <div className="grid grid-cols-1 gap-3">
              {(['modern', 'classic', 'minimalist'] as const).map(tmpl => (
                <button
                  key={tmpl}
                  onClick={() => setData(prev => ({ ...prev, template: tmpl }))}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition flex items-center justify-between ${data.template === tmpl || (!data.template && tmpl === 'modern') ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                >
                  {tmpl} Template
                  {(data.template === tmpl || (!data.template && tmpl === 'modern')) && (
                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personal Info */}
      <div style={{ margin: 0, padding: 0 }}>
        <SectionHeader title="Your Details" section="personal" icon={User} openSection={openSection} toggleSection={toggleSection} />
        {openSection === 'personal' && (
          <div className="p-6 flex flex-col animate-in slide-in-from-top-2 duration-200" style={{ gap: '16px', margin: 0 }}>
            <InputField label="Full Name" name="fullName" value={data.personalInfo.fullName} onChange={updatePersonalInfo} icon={User} placeholder="Jane Doe" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Email Address" name="email" value={data.personalInfo.email} onChange={updatePersonalInfo} icon={Mail} placeholder="jane@example.com" type="email" />
              <InputField label="Phone Number" name="phone" value={data.personalInfo.phone} onChange={updatePersonalInfo} icon={Phone} placeholder="+1 234 567 890" />
            </div>
            <InputField label="Location" name="location" value={data.personalInfo.location} onChange={updatePersonalInfo} icon={MapPin} placeholder="San Francisco, CA" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="LinkedIn" name="linkedin" value={data.personalInfo.linkedin} onChange={updatePersonalInfo} icon={Link} placeholder="linkedin.com/in/jane" />
              <InputField label="GitHub" name="github" value={data.personalInfo.github} onChange={updatePersonalInfo} icon={Link} placeholder="github.com/jane" />
            </div>
            <InputField label="Portfolio / Website" name="website" value={data.personalInfo.website} onChange={updatePersonalInfo} icon={Link} placeholder="janedoe.com" />
            <TextAreaField label="Professional Summary" name="summary" value={data.personalInfo.summary} onChange={updatePersonalInfo} placeholder="Write a brief and impactful summary of your career..." />
          </div>
        )}
      </div>

      {/* Experience */}
      <div style={{ margin: 0, padding: 0 }}>
        <SectionHeader title="Work Experience" section="experience" icon={Briefcase} openSection={openSection} toggleSection={toggleSection} />
        {openSection === 'experience' && (
          <div className="p-6 flex flex-col animate-in slide-in-from-top-2 duration-200 bg-slate-50/50" style={{ gap: '20px', margin: 0 }}>
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative group">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 transition p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2" style={{ margin: 0, padding: 0, marginBottom: '16px' }}>
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs">{index + 1}</span>
                  Experience
                </h3>
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <InputField label="Company Name" value={exp.company} onChange={(e: any) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Google" />
                  <InputField label="Job Title" value={exp.position} onChange={(e: any) => updateExperience(exp.id, 'position', e.target.value)} placeholder="Senior Software Engineer" />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Start Date" value={exp.startDate} onChange={(e: any) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2020" />
                    <div>
                      <InputField label="End Date" value={exp.current ? 'Present' : exp.endDate} onChange={(e: any) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 pl-1">
                    <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-slate-300" />
                    <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-700 cursor-pointer">I currently work here</label>
                  </div>
                  <TextAreaField label="Description & Achievements" value={exp.description} onChange={(e: any) => updateExperience(exp.id, 'description', e.target.value)} placeholder="- Developed an innovative solution that increased revenue by..." />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-3.5 flex items-center justify-center gap-2 bg-brand-50 text-brand-700 rounded-xl hover:bg-brand-100 transition text-sm font-semibold border border-brand-200">
              <Plus className="w-4 h-4" /> Add Another Experience
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div style={{ margin: 0, padding: 0 }}>
        <SectionHeader title="Projects" section="projects" icon={Code2} openSection={openSection} toggleSection={toggleSection} />
        {openSection === 'projects' && (
          <div className="p-6 flex flex-col animate-in slide-in-from-top-2 duration-200 bg-slate-50/50" style={{ gap: '20px', margin: 0 }}>
            {data.projects.map((proj, index) => (
              <div key={proj.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative group">
                <button onClick={() => removeProject(proj.id)} className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 transition p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2" style={{ margin: 0, padding: 0, marginBottom: '16px' }}>
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs">{index + 1}</span>
                  Project
                </h3>
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <InputField label="Project Name" value={proj.name} onChange={(e: any) => updateProject(proj.id, 'name', e.target.value)} placeholder="E-commerce Dashboard" />
                  <InputField label="Link (URL)" value={proj.link} onChange={(e: any) => updateProject(proj.id, 'link', e.target.value)} placeholder="github.com/user/project" />
                  <InputField label="Technologies Used" value={proj.technologies} onChange={(e: any) => updateProject(proj.id, 'technologies', e.target.value)} placeholder="React, Node.js, TypeScript" />
                  <TextAreaField label="Description" value={proj.description} onChange={(e: any) => updateProject(proj.id, 'description', e.target.value)} rows={3} placeholder="Briefly describe what you built and the impact..." />
                </div>
              </div>
            ))}
            <button onClick={addProject} className="w-full py-3.5 flex items-center justify-center gap-2 bg-brand-50 text-brand-700 rounded-xl hover:bg-brand-100 transition text-sm font-semibold border border-brand-200">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div style={{ margin: 0, padding: 0 }}>
        <SectionHeader title="Education" section="education" icon={GraduationCap} openSection={openSection} toggleSection={toggleSection} />
        {openSection === 'education' && (
          <div className="p-6 flex flex-col animate-in slide-in-from-top-2 duration-200 bg-slate-50/50" style={{ gap: '20px', margin: 0 }}>
            {data.education.map((edu, index) => (
              <div key={edu.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative group">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 transition p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2" style={{ margin: 0, padding: 0, marginBottom: '16px' }}>
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs">{index + 1}</span>
                  Education
                </h3>
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <InputField label="Institution Name" value={edu.institution} onChange={(e: any) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="State University" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Degree" value={edu.degree} onChange={(e: any) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="B.S." />
                    <InputField label="Major/Field" value={edu.field} onChange={(e: any) => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Graduation Date" value={edu.graduationDate} onChange={(e: any) => updateEducation(edu.id, 'graduationDate', e.target.value)} placeholder="May 2024" />
                    <InputField label="GPA (Optional)" value={edu.gpa} onChange={(e: any) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8/4.0" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-3.5 flex items-center justify-center gap-2 bg-brand-50 text-brand-700 rounded-xl hover:bg-brand-100 transition text-sm font-semibold border border-brand-200">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div style={{ margin: 0, padding: 0 }}>
        <SectionHeader title="Skills & Expertise" section="skills" icon={Wrench} openSection={openSection} toggleSection={toggleSection} />
        {openSection === 'skills' && (
          <div className="p-6 animate-in slide-in-from-top-2 duration-200 bg-slate-50/50" style={{ margin: 0 }}>
            <TextAreaField
              label="Technical Skills (comma separated or grouped lines)"
              value={data.skills}
              onChange={(e: any) => setData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="Languages: JavaScript, Python, C++&#10;Frameworks: React, Next.js, Node.js"
              rows={5}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
