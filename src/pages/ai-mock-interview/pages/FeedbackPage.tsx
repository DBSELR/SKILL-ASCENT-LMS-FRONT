import { useEffect, useState, useRef } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InterviewReportPDF } from '../components/InterviewReportPDF';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle2, TrendingUp, Brain, ArrowLeft, AlertCircle, Lightbulb, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { InterviewSession, InterviewQuestion } from '../types';
import { generateInterviewFeedback } from '../services/ai';

export default function FeedbackPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [jobRole, setJobRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [round, setRound] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (sessionId) {
      loadSessionData();
    }
    
    // Attempt to load some context from localStorage
    try {
      const setupDataStr = localStorage.getItem('interviewSetup');
      if (setupDataStr) {
        const setup = JSON.parse(setupDataStr);
        setJobRole(setup.jobRole || 'Role');
        setCompanyName(setup.company || '');
        setRound(setup.interviewType || 'Interview');
      }
    } catch {
      // ignore
    }
    
    const now = new Date();
    setDate(now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const storedVideo = localStorage.getItem(`interview_video_${sessionId}`);
    if (storedVideo) setLocalVideoUrl(storedVideo);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      let sessionData: any = null;
      let questionsData: any = null;

      if (sessionId === 'mock-session-123') {
        const localQ = localStorage.getItem(`mock_questions_${sessionId}`);
        if (localQ) {
           questionsData = JSON.parse(localQ);
           sessionData = { id: sessionId, status: 'completed', feedback: null };
        } else {
           questionsData = [
             { id: 'mock-1', question_text: 'Can you walk me through your background?', user_answer: 'I am a software engineer with 5 years of experience.' },
             { id: 'mock-2', question_text: 'What is your biggest strength?', user_answer: 'My biggest strength is problem solving.' }
           ];
           sessionData = { id: sessionId, status: 'completed', feedback: null };
        }
      } else {
        const { data: sData, error: sessionError } = await supabase
          .from('interview_sessions')
          .select('*')
          .eq('id', sessionId)
          .maybeSingle();

        if (sessionError) throw sessionError;
        sessionData = sData;

        const { data: qData, error: questionsError } = await supabase
          .from('interview_questions')
          .select('*')
          .eq('session_id', sessionId)
          .order('question_order', { ascending: true });

        if (questionsError) throw questionsError;
        questionsData = qData;
      }

      setSession(sessionData);
      setQuestions(questionsData || []);

      if (!sessionData?.feedback) {
        generateFeedback(questionsData || []);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setLoading(false);
    }
  };

  const generateFeedback = async (questionsData: InterviewQuestion[]) => {
    setGeneratingFeedback(true);

    try {
      const qTexts = questionsData.map(q => q.question_text);
      const aTexts = questionsData.map(q => q.user_answer || '');

      const aiFeedback = await generateInterviewFeedback(qTexts, aTexts);

      const recommended_responses: Record<string, string> = {};
      questionsData.forEach((q, index) => {
         recommended_responses[q.id] = aiFeedback.recommended_responses[String(index)] 
            || 'No recommendation generated.';
      });
      aiFeedback.recommended_responses = recommended_responses;

      await supabase
        .from('interview_sessions')
        .update({ feedback: aiFeedback })
        .eq('id', sessionId);

      setSession((prev) => (prev ? { ...prev, feedback: aiFeedback } : null));
    } catch (err) {
      console.error('Error generating and saving feedback:', err);
    }

    setGeneratingFeedback(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-emerald-400 font-bold tracking-widest uppercase">
            {generatingFeedback ? 'AI Analyzing Performance...' : 'Loading Data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative">
        <div className="text-center z-10 bg-[#151A26] border border-white/5 p-10 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl font-bold mb-6">Session not found</p>
          <button
            onClick={() => navigate('/ai-mock-interview/')}
            className="bg-emerald-500 text-[#0A0D14] px-6 py-2 rounded-lg font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const feedback = session.feedback || {};
  const techScore = feedback.domain_knowledge_score || 0;
  const artScore = feedback.articulation_score || 0;
  const commScore = feedback.communication_score || 0;
  const compScore = Math.round((techScore + artScore + commScore) / 3) || 0;

  const levels = ['Incomplete Response', 'Entry-Level', 'Professional', 'Advanced Professional', 'Expert', 'Extraordinary'];
  
  // map compScore to a level string
  let aggregateLevel = 'Entry-Level';
  if (compScore >= 90) aggregateLevel = 'Extraordinary';
  else if (compScore >= 80) aggregateLevel = 'Expert';
  else if (compScore >= 70) aggregateLevel = 'Advanced Professional';
  else if (compScore >= 60) aggregateLevel = 'Professional';
  else if (compScore > 0) aggregateLevel = 'Entry-Level';

  // calculate level index (0 to 5) for progress bar
  const levelIndex = levels.indexOf(aggregateLevel);
  const progressPercent = Math.max(10, (levelIndex + 1) * (100 / levels.length));

  const activeQuestion = questions[activeQIndex];
  
  const circleOffset = (score: number) => {
     // max dash offset is 289
     // score is 0 to 100
     return 289 - (289 * score) / 100;
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200">
      {/* Top Header */}
      <nav className="bg-[#0A0D14]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-widest text-white uppercase">ELEVATE</span>
          </div>
          <button
            onClick={() => navigate('/ai-mock-interview/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold transition-colors"
          >
             <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </nav>

      <div ref={reportRef} className="w-full max-w-6xl mx-auto p-6 md:p-8 space-y-8 relative z-10">
        
        {/* Overview Card */}
        <div className="bg-[#151A26] rounded-2xl p-6 md:p-8 shadow-xl border border-white/5 relative">
          
          {/* Improvement Badge */}
          <div className="absolute top-0 right-6 md:right-8 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-[#0A0D14] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-emerald-400/50">
             <TrendingUp className="w-4 h-4" />
             <span className="font-bold text-sm tracking-wide hidden md:inline">Analytical Report Ready</span>
             <span className="font-bold text-sm tracking-wide md:hidden">Ready</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-2 border-b border-white/10 pb-6 gap-4">
            <div>
              <p className="text-gray-400 mb-1"><span className="font-bold text-white uppercase tracking-widest text-xs">Position :</span> {jobRole} {companyName ? `at ${companyName}` : ''}</p>
              <p className="text-gray-400 mb-1"><span className="font-bold text-white uppercase tracking-widest text-xs">Round :</span> {round}</p>
              <p className="text-gray-500 text-sm mt-2"><span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Practiced On :</span> {date}</p>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => navigate('/ai-mock-interview/setup')} className="px-6 py-2.5 border border-white/10 text-gray-300 font-bold rounded-lg hover:bg-white/5 transition-colors focus:ring-2 focus:ring-emerald-500 outline-none text-sm tracking-wide">
                RETRY SCENARIO
              </button>
              <PDFDownloadLink
                document={<InterviewReportPDF 
                  session={session} 
                  questions={questions} 
                  jobRole={jobRole}
                  companyName={companyName}
                  round={round}
                  date={date}
                />}
                fileName={`Interview_Report_${sessionId}.pdf`}
                className="px-6 py-2.5 bg-emerald-500 text-[#0A0D14] text-sm font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] tracking-wide flex items-center gap-2"
              >
                {({ loading }) => (
                  loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0A0D14] border-t-transparent rounded-full animate-spin" />
                      PREPARING...
                    </>
                  ) : (
                    'EXPORT PDF'
                  )
                )}
              </PDFDownloadLink>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-3">
              <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">Aggregate Rating</p>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md uppercase tracking-wider">{aggregateLevel}</span>
            </div>
            <div className="flex rounded-full mb-4 overflow-hidden relative h-3 bg-[#0A0D14] border border-white/5">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="grid grid-cols-6 text-center text-[10px] uppercase tracking-wider font-bold text-gray-600 pt-2 hidden md:grid">
              {levels.map((level, i) => (
                <div key={level} className={`${i <= levelIndex ? 'text-emerald-500' : 'text-gray-600'}`}>
                  {level}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center pt-8 border-t border-white/10">
             <div className="bg-[#0A0D14] rounded-2xl p-4 md:p-6 border border-white/5 flex flex-col items-center">
                <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest">Composite Score</h4>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#151A26" strokeWidth="8" />
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="289" strokeDashoffset={circleOffset(compScore)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="font-extrabold text-2xl md:text-3xl text-white">{compScore}%</span>
                </div>
             </div>
             <div className="flex flex-col items-center justify-center">
                <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest">Domain Knowledge</h4>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#151A26" strokeWidth="8" />
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#14b8a6" strokeWidth="8" strokeDasharray="289" strokeDashoffset={circleOffset(techScore)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="font-bold text-xl md:text-2xl text-white">{techScore}%</span>
                </div>
             </div>
             <div className="flex flex-col items-center justify-center">
                <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest">Articulation</h4>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#151A26" strokeWidth="8" />
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="289" strokeDashoffset={circleOffset(artScore)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="font-bold text-xl md:text-2xl text-white">{artScore}%</span>
                </div>
             </div>
             <div className="flex flex-col items-center justify-center">
                <h4 className="font-bold mb-4 text-xs text-gray-400 uppercase tracking-widest">Communication</h4>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#151A26" strokeWidth="8" />
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="289" strokeDashoffset={circleOffset(commScore)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="font-bold text-xl md:text-2xl text-white">{commScore}%</span>
                </div>
             </div>
          </div>
        </div>

        {/* Global Feedback */}
        <div className="bg-[#151A26] rounded-2xl shadow-xl p-6 md:p-8 border border-white/5">
          <h2 className="text-xl font-extrabold text-white mb-6 border-b border-white/10 pb-4">Overall Performance Insights</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Top Strengths</h3>
              </div>
              <ul className="space-y-4">
                {feedback?.what_went_well?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                   <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Areas for Improvement</h3>
              </div>
              <ul className="space-y-4">
                {feedback?.what_could_be_better?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Question Analytics */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="w-full md:w-32 bg-[#151A26] rounded-xl border border-white/5 p-4 flex md:flex-col gap-2 overflow-x-auto shrink-0">
             {questions.map((q, index) => (
               <button 
                 key={q.id} 
                 onClick={() => setActiveQIndex(index)}
                 className={`py-3 px-4 md:px-0 text-center font-bold rounded-lg transition-colors text-sm tracking-wide whitespace-nowrap md:whitespace-normal ${activeQIndex === index ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:bg-white/5 border border-transparent'}`}
               >
                 Q{index + 1}
               </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#151A26] rounded-xl border border-white/5 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-white/5 bg-[#0A0D14]">
                 <button
                   className="flex-1 min-w-[200px] py-4 font-bold text-xs uppercase tracking-widest transition-colors text-emerald-400 bg-[#151A26] border-t-2 border-t-emerald-500"
                 >
                   Answer Analysis
                 </button>
            </div>

            <div className="p-6 md:p-8">
              {activeQuestion ? (
                <>
                  <h3 className="text-lg font-extrabold text-white mb-6">{activeQuestion.question_text}</h3>
                  <div className="bg-[#0A0D14] p-5 rounded-xl border border-white/5 mb-8">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Your Answer</p>
                    <p className="text-gray-300 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 py-1">
                      "{activeQuestion.user_answer || 'No audible answer recorded'}"
                    </p>
                  </div>

                  <div className="mb-8">
                    <p className="font-bold text-white text-lg mb-4 flex items-center gap-3">
                      <span className="bg-emerald-500/10 p-1.5 rounded-lg inline-block">
                        <Lightbulb className="w-5 h-5 text-emerald-400" />
                      </span>
                      AI Recommendation
                    </p>

                    <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0A0D14] p-5">
                       <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {feedback?.recommended_responses?.[activeQuestion.id] || 'Generating recommendation...'}
                       </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">Select a question to view details.</p>
              )}

              {/* Video Replay (if available) */}
              {(session?.video_url || localVideoUrl) ? (
              <div className="max-w-2xl mx-auto border border-white/5 rounded-2xl overflow-hidden shadow-lg bg-[#0A0D14] mt-8">
                <div className="py-4 px-6 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-emerald-400"/> 
                    <span className="font-bold text-white text-sm uppercase tracking-wider">Session Replay</span>
                  </div>
                </div>
                <div className="aspect-video bg-black relative">
                   <video src={session?.video_url || localVideoUrl || undefined} controls className="w-full h-full" />
                </div>
              </div>
              ) : (
                <div className="mt-8 bg-[#0A0D14] border border-white/5 rounded-xl p-8 text-center">
                  <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">
                    Video recording has been saved to your local machine.
                  </p>
                  <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto leading-relaxed">
                    If you don't see the player here, check your Downloads folder. 
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
