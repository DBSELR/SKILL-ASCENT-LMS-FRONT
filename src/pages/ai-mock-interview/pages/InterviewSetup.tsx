import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronRight, HelpCircle, Check, SearchCode, ShieldAlert, Cpu, FileText } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

export default function InterviewSetup() {
  const navigate = useNavigate();
  
  const [jobRole, setJobRole] = useState('Data Scientist');
  const [companyName, setCompanyName] = useState('Google');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [jdUploaded, setJdUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRound, setSelectedRound] = useState('Role Related');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Professional');
  const [selectedDuration, setSelectedDuration] = useState('10 mins');
  const [selectedInterviewer, setSelectedInterviewer] = useState('Payal');
  const [settings, setSettings] = useState({ audio: true, video: true });

  const rounds = [
    { id: 'Warm Up', icon: HelpCircle },
    { id: 'Coding', icon: SearchCode },
    { id: 'Role Related', icon: Cpu },
    { id: 'Behavioral', icon: ShieldAlert },
  ];

  const difficulties = ['Beginner', 'Professional'];
  const durations = ['5 mins', '10 mins', '15 mins'];

  const interviewers = [
    { name: 'Payal', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Emma', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'John', image: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Kapil', image: 'https://i.pravatar.cc/150?img=12' },
  ];

  const handleStartPractice = () => {
    // Save to localStorage so InterviewRoom and Analytics can use these values
    localStorage.setItem('interview_role', jobRole);
    localStorage.setItem('interview_company', companyName);
    localStorage.setItem('interview_round', selectedRound);
    localStorage.setItem('interview_jd', jdUploaded.toString());
    localStorage.setItem('interview_duration', selectedDuration);
    if (resumeUploaded && resumeText) {
      localStorage.setItem('interview_resume_text', resumeText);
    } else {
      localStorage.removeItem('interview_resume_text');
    }
    
    navigate('/ai-mock-interview/prerequisite');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm fixed inset-0 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto translate-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Header section */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="bg-purple-100 text-purple-700 px-3 py-1.5 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm">Target Role</span>
              <input 
                type="text" 
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="text-3xl font-extrabold text-gray-900 border-b-2 border-dashed border-gray-300 focus:border-purple-600 outline-none bg-transparent placeholder-gray-300 w-full max-w-xs transition-colors" 
                placeholder="e.g. Data Scientist" 
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1.5 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm">Company</span>
              <input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="text-xl font-bold text-gray-700 border-b-2 border-dashed border-gray-300 focus:border-blue-500 outline-none bg-transparent placeholder-gray-300 w-full max-w-xs transition-colors p-1" 
                placeholder="e.g. Google, TCS" 
              />
            </div>
            <p className="text-gray-500 font-medium pt-2">Please configure your interview preferences below.</p>
          </div>
          
          <div className="flex gap-4">
            <input 
               type="file" 
               accept=".txt,.pdf" 
               ref={fileInputRef} 
               className="hidden" 
               onChange={async (e) => {
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
                        reader.onload = (ev) => {
                           setResumeText(ev.target?.result as string);
                           setResumeUploaded(true);
                        };
                        reader.readAsText(file);
                     }
                  }
               }} 
            />
            <button 
              className={`flex flex-col items-center justify-center border-2 border-dashed ${resumeUploaded ? 'border-purple-400 bg-purple-50 shadow-inner' : 'border-gray-300 bg-gray-50'} rounded-xl p-4 cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-all h-24 w-32 relative group`}
              onClick={() => fileInputRef.current?.click()}
            >
              {resumeUploaded ? (
                <>
                  <Check className="w-6 h-6 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-purple-700 text-center">Resume Uploaded</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-xs font-semibold text-gray-600 text-center">Upload Resume (Optional)</span>
                </>
              )}
            </button>

            <button 
              className={`flex flex-col items-center justify-center border-2 border-dashed ${jdUploaded ? 'border-blue-400 bg-blue-50 shadow-inner' : 'border-gray-300 bg-gray-50'} rounded-xl p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all h-24 w-32 relative group`}
              onClick={() => setJdUploaded(!jdUploaded)}
            >
              {jdUploaded ? (
                <>
                  <Check className="w-6 h-6 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-blue-700 text-center">JD Uploaded</span>
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6 text-gray-400 mb-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-xs font-semibold text-gray-600 text-center">Upload JD</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 gap-x-12 gap-y-10 bg-gray-50/50">
          
          {/* Round Selection */}
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Select Round</h3>
            <div className="grid grid-cols-2 gap-3">
              {rounds.map((round) => {
                const Icon = round.icon;
                return (
                  <button
                    key={round.id}
                    onClick={() => setSelectedRound(round.id)}
                    className={`flex items-center gap-2 p-3 border rounded-xl text-left transition-all ${
                      selectedRound === round.id 
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-600' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50/30'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selectedRound === round.id ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="font-semibold text-sm">{round.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Duration */}
          <div className="space-y-8 col-span-2 sm:col-span-1">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Difficulty Level</h3>
              <div className="flex gap-3">
                {difficulties.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all border ${
                      selectedDifficulty === level
                        ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Interview Duration</h3>
              <div className="flex gap-3">
                {durations.map(duration => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all border ${
                      selectedDuration === duration
                        ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings and Interviewer side by side on bottom */}
          <div className="space-y-4 col-span-2 sm:col-span-1 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
               Choose Interviewer
            </h3>
            <div className="flex gap-4">
              {interviewers.map(person => (
                <button
                  key={person.name}
                  onClick={() => setSelectedInterviewer(person.name)}
                  className={`relative flex flex-col items-center gap-2 group p-2 rounded-xl transition-all ${selectedInterviewer === person.name ? 'bg-purple-50 ring-2 ring-purple-500' : 'hover:bg-gray-100'}`}
                >
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className={`w-14 h-14 rounded-full object-cover shadow-sm transition-transform group-hover:scale-105 ${selectedInterviewer === person.name ? 'ring-2 ring-purple-600 ring-offset-2' : ''}`}
                  />
                  <span className={`text-xs font-bold ${selectedInterviewer === person.name ? 'text-purple-700' : 'text-gray-500'}`}>{person.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Practice Settings</h3>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-sm">
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-700">Enable Audio</span>
                <input 
                  type="checkbox" 
                  checked={settings.audio} 
                  onChange={(e) => setSettings({...settings, audio: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded drop-shadow-sm focus:ring-purple-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-700">Enable Video</span>
                <input 
                  type="checkbox" 
                  checked={settings.video} 
                  onChange={(e) => setSettings({...settings, video: e.target.checked})}
                  className="w-5 h-5 text-purple-600 rounded drop-shadow-sm focus:ring-purple-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center rounded-b-3xl">
          <button 
            onClick={() => navigate('/ai-mock-interview/')}
            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleStartPractice}
            className="px-8 py-3 rounded-xl font-extrabold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            START PRACTICE
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

