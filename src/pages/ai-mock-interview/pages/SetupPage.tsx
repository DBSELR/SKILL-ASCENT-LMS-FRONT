import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, Upload, Lock } from 'lucide-react';
import { InterviewType, DifficultyLevel, Interviewer } from '../types';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

type InterviewMode = 'role';

export default function SetupPage() {
  const navigate = useNavigate();
  const [mode] = useState<InterviewMode>('role');

  const [selectedDuration, setSelectedDuration] = useState('5 mins');
  const [isPremium] = useState(() => localStorage.getItem('isPremium') === 'true');
  const [trialCount, setTrialCount] = useState(() => parseInt(localStorage.getItem('trialCount') || '0', 10));
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const durations = ['5 mins', '10 mins', '15 mins'];

  const [formData, setFormData] = useState({
    jobRole: '',
    industry: '',
    company: '',
    jobDescription: '',
    jobTitle: '',
    interviewType: '' as InterviewType | '',
    difficultyLevel: '' as DifficultyLevel | '',
    interviewer: '' as Interviewer | '',
  });



  const interviewTypes = [
    { value: 'TECHNICAL', label: 'Role Related (Technical)', hasDifficulty: true },
    { value: 'HR', label: 'Behavioral (HR)', hasDifficulty: false },
  ];

  const interviewers = [
    { value: 'John', avatar: '👨💼' },
    { value: 'Jyoti', avatar: '👩💼' },
    { value: 'Lisa', avatar: '👩🦰' },
    { value: 'Mike', avatar: '👨🦱' },
  ];

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
              fullText += pageText + '\n';
            }
            setResumeText(fullText.trim());
            setResumeUploaded(true);
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error("PDF Parsing Error: ", error);
          alert("Failed to parse PDF file. Please try uploading a .txt file instead.");
        }
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
          setResumeUploaded(true);
        };
        reader.readAsText(file);
      }
    }
  };

  const selectedType = interviewTypes.find(t => t.value === formData.interviewType);
  const showDifficulty = selectedType?.hasDifficulty;



  const handleDifficultySelect = (level: DifficultyLevel) => {
    if (level === 'Professional' && !isPremium) {
      alert('Professional level is a Premium feature. Please upgrade.');
      return;
    }
    setFormData({ ...formData, difficultyLevel: level });
  };

  const handleDurationSelect = (duration: string) => {
    if (duration !== '5 mins' && !isPremium) {
      alert(`${duration} duration is a Premium feature. Please upgrade.`);
      return;
    }
    setSelectedDuration(duration);
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobRole) {
      alert('Please enter a job role');
      return;
    }
    if (!formData.interviewType || !formData.interviewer) {
      alert('Please select interview type and interviewer');
      return;
    }
    if (showDifficulty && !formData.difficultyLevel) {
      alert('Please select a difficulty level');
      return;
    }

    if (!isPremium) {
      if (trialCount >= 3) {
        alert('Free trial limit reached (3/3). Please upgrade to Premium to continue.');
        return;
      }
      const newCount = trialCount + 1;
      setTrialCount(newCount);
      localStorage.setItem('trialCount', newCount.toString());
    }

    finalizeAndNavigate(!!formData.jobDescription, false);
  };



  const finalizeAndNavigate = (isJDBased: boolean, isStaticCompany: boolean, overrideRole?: string) => {
    const finalData = {
      jobRole: overrideRole || formData.jobRole || formData.jobTitle,
      company: formData.company || '',
      jobDescription: formData.jobDescription || '',
      interviewType: formData.interviewType || 'TECHNICAL',
      difficultyLevel: formData.difficultyLevel || null,
      interviewer: formData.interviewer || 'John',
      customQuestions: [],
      isJDBased,
      isStaticCompanyMode: isStaticCompany
    };

    localStorage.setItem('interviewSetup', JSON.stringify(finalData));
    localStorage.setItem('interview_duration', selectedDuration);

    if (resumeUploaded && resumeText) {
      localStorage.setItem('interview_resume_text', resumeText);
    } else {
      localStorage.removeItem('interview_resume_text');
    }
    navigate('/ai-mock-interview/compatibility-check');
  };



  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200">
      <nav className="bg-[#0A0D14]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-widest text-white uppercase">ELEVATE</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* ROLE BASED MODE */}
        {mode === 'role' && (
          <div className="max-w-2xl mx-auto relative z-10">

            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-white mb-3">Role-Specific Interview</h1>
              <p className="text-lg text-gray-400">
                Configure your mock interview. Upload your resume to get personalized context questions.
              </p>
            </div>

            <form onSubmit={handleRoleSubmit} className="bg-[#151A26] border border-white/5 rounded-2xl shadow-2xl p-8 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Target Role <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  placeholder="e.g. Frontend Engineer"
                  className="w-full px-4 py-3 bg-[#0F131D] border border-white/5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white transition-all shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Stripe"
                  className="w-full px-4 py-3 bg-[#0F131D] border border-white/5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Interview Type <span className="text-emerald-500">*</span>
                </label>
                <select
                  value={formData.interviewType}
                  onChange={(e) => setFormData({ ...formData, interviewType: e.target.value as InterviewType })}
                  className="w-full px-4 py-3 bg-[#0F131D] border border-white/5 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white transition-all shadow-inner appearance-none"
                  required
                >
                  <option value="">Select Interview Type</option>
                  {interviewTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {showDifficulty && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                    Difficulty Level <span className="text-emerald-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleDifficultySelect('Beginner')}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all border flex items-center justify-center gap-2 ${formData.difficultyLevel === 'Beginner'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : 'bg-[#0F131D] border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                    >
                      Beginner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDifficultySelect('Professional')}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all border flex items-center justify-center gap-2 ${formData.difficultyLevel === 'Professional'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : 'bg-[#0F131D] border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                    >
                      Professional
                      {!isPremium && <Lock className="w-4 h-4 text-emerald-500/50" />}
                    </button>
                  </div>
                </div>
              )}

              {/* DURATION SELECTION */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Interview Duration <span className="text-emerald-500">*</span>
                </label>
                <div className="flex gap-4">
                  {durations.map(duration => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => handleDurationSelect(duration)}
                      className={`relative flex-1 py-3 px-6 rounded-lg font-bold transition-all border flex items-center justify-center gap-2 ${selectedDuration === duration
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : 'bg-[#0F131D] border-white/5 text-gray-400 hover:bg-white/5'
                        }`}
                    >
                      {duration}
                      {duration !== '5 mins' && !isPremium && <Lock className="w-4 h-4 text-emerald-500/50" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* RESUME UPLOAD */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Upload Resume (Optional)
                </label>
                <input
                  type="file"
                  accept=".txt,.pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleResumeUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${resumeUploaded ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-[#0F131D] text-gray-500 hover:bg-white/5 hover:border-white/20'
                    }`}
                >
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="font-semibold text-center">{resumeUploaded ? 'Resume Uploaded (Ready)' : 'Click to Upload Resume (.txt, .pdf format)'}</span>
                </button>
              </div>

              {/* JD PASTE */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Job Description (Optional)
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  placeholder="Paste the job description details here..."
                  className="w-full px-4 py-4 bg-[#0F131D] border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-white transition-all shadow-inner min-h-[150px] leading-relaxed resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Select Your Interviewer <span className="text-emerald-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interviewers.map((interviewer) => (
                    <button
                      key={interviewer.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, interviewer: interviewer.value as Interviewer })}
                      className={`p-6 rounded-xl border transition-all ${formData.interviewer === interviewer.value
                        ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'border-white/5 bg-[#0F131D] hover:border-white/20 hover:bg-white/5'
                        }`}
                    >
                      <div className="text-5xl mb-3">{interviewer.avatar}</div>
                      <div className="font-bold text-gray-300 text-sm tracking-wide">{interviewer.value}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] py-4 rounded-xl font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                >
                  Continue to Compatibility Check
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}


      </div>
    </div>
  );
}
