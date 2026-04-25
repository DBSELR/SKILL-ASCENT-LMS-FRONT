import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, Square, Play, LogOut, Volume2, Settings, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateInitialQuestions, generateFollowUpQuestion, HistoryItem } from '../services/ai';

import StreamingAvatar, { AvatarQuality, VoiceEmotion, TaskType, StreamingEvents } from '@heygen/streaming-avatar';
import { getHeyGenSessionToken } from '../services/heygen';

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, setupData } = location.state || {};

  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [aiHistory, setAiHistory] = useState<HistoryItem[]>([]);
  const [currentCandidateAnswer, setCurrentCandidateAnswer] = useState('');
  


  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const getDurationInSeconds = () => {
    const durationStr = localStorage.getItem('interview_duration');
    if (durationStr && durationStr.includes('mins')) {
       return parseInt(durationStr.split(' ')[0]) * 60;
    }
    return 600; // default 10 mins
  };
  const [timeLeft, setTimeLeft] = useState(getDurationInSeconds());

  const recognitionRef = useRef<any>(null);

  // Set up background pattern matching Midnight & Emerald design
  const bgStyle = {
    backgroundColor: '#0F131D',
    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  };

  useEffect(() => {
    // Warm up speech synthesis voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !setupData) {
      navigate('/ai-mock-interview/setup');
      return;
    }

    initializeMedia();
    fetchInitialSequence();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setCurrentCandidateAnswer(transcript);
      };
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
      }
    };
  }, []);

  const initHeyGen = async () => {
    try {
      const token = await getHeyGenSessionToken();
      const avatar = new StreamingAvatar({ token });
      avatarRef.current = avatar;
      
      const avatarMapping: Record<string, string> = {
        'John': 'Wayland_Public_Base_20230110',
        'Jyoti': 'Daisy_Public_Base_20230110',
        'Lisa': 'Kristin_Public_Base_20230110',
        'Mike': 'Eric_Public_Base_20230110',
      };
      
      const avatarId = avatarMapping[setupData?.interviewer || 'John'] || 'Wayland_Public_Base_20230110';
      
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        if (avatarVideoRef.current && event.detail) {
          avatarVideoRef.current.srcObject = event.detail;
          avatarVideoRef.current.onloadedmetadata = () => {
            avatarVideoRef.current?.play().catch(console.error);
          };
        }
      });
      
      await avatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: avatarId,
        voice: {
          rate: 1,
          emotion: VoiceEmotion.EXCITED,
        },
      });
    } catch (err) {
      console.error("HeyGen init error:", err);
    }
  };

  useEffect(() => {
    if (interviewStarted && timeLeft > 0 && !isAnalyzing) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && interviewStarted) {
      finishInterview();
    }
  }, [interviewStarted, timeLeft, isAnalyzing]);

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Media error:', err);
    }
  };

  const fetchInitialSequence = async () => {
    setIsAnalyzing(true);
    setApiError(null);
    try {
      // Generate dynamically
      const resumeText = localStorage.getItem('interview_resume_text') || undefined;
      const initialBatch = await generateInitialQuestions(setupData.jobRole, setupData.company, setupData.jobDescription, resumeText, setupData.isJDBased, setupData.interviewType);
      setQuestions([initialBatch[0]]); // Setup initial question
      setIsAnalyzing(false);
    } catch (err: any) {
        console.error("Critical error in fetchInitialSequence:", err);
        setApiError(err.message || "Failed to generate AI question.");
        setIsAnalyzing(false);
    }
  };

  const startInterview = async () => {
    if (!stream) return;

    setInterviewStarted(true);
    setIsRecording(true);

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
       const blob = new Blob(chunksRef.current, { type: 'video/webm' });
       if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.style.display = 'none';
          a.href = url;
          a.download = `interview-recording-${sessionId}.webm`;
          a.click();
          localStorage.setItem(`interview_video_${sessionId}`, url);
          // Keeping URL alive for the analytics page
       }
    };

    mediaRecorder.start();
    setIsAnalyzing(true);
    await initHeyGen();
    setIsAnalyzing(false);
    speakQuestion(questions[0]);
  };

  const speakQuestion = async (text: string) => {
    setIsAvatarSpeaking(true);
    
    if (avatarRef.current) {
      try {
        await avatarRef.current.speak({ text, taskType: TaskType.REPEAT });
      } catch (err) {
        console.error("HeyGen speak error:", err);
        // Minimal fallback for visuals
        setTimeout(() => setIsAvatarSpeaking(false), text.length * 100);
      }
    } else {
      // Fallback to speech synthesis if HeyGen is not ready
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const interviewer = setupData?.interviewer || 'John';
        const isFemale = ['Jyoti', 'Lisa'].includes(interviewer);
        
        if (voices.length > 0) {
          let voice;
          if (isFemale) {
            voice = voices.find(v => (v.name.includes('Zira') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English')) && v.lang.startsWith('en'))
              || voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'));
          } else {
            voice = voices.find(v => (v.name.includes('David') || v.name.includes('Male') || v.name.includes('Mark') || v.name.includes('Google UK English Male')) && v.lang.startsWith('en'))
              || voices.find(v => v.name.toLowerCase().includes('male') && v.lang.startsWith('en'));
          }
          if (voice) utterance.voice = voice;
        }

        utterance.onend = () => setIsAvatarSpeaking(false);
        utterance.onerror = () => setIsAvatarSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsAvatarSpeaking(false);
      }
    }
  };

  const handleStartAnswer = () => {
     setIsListening(true);
     setCurrentCandidateAnswer('');
     if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch {}
     }
  };

  const handleEndAnswer = async () => {
     setIsListening(false);
     if (recognitionRef.current) {
         try { recognitionRef.current.stop(); } catch {}
     }
     
     const ans = currentCandidateAnswer.trim() || 'No audible answer was provided.';
     
     const updatedAnswers = [...answers];
     updatedAnswers[currentQuestionIndex] = ans;
     setAnswers(updatedAnswers);

     const newHistory: HistoryItem[] = [...aiHistory, { role: 'ai', text: questions[currentQuestionIndex] }, { role: 'user', text: ans }];
     setAiHistory(newHistory);

     if (timeLeft > 0) {
         // Dynamic Mode Flow - ask questions until time runs out!
         setIsAnalyzing(true);
         const nextQ = await generateFollowUpQuestion(setupData.jobRole, setupData.company, newHistory, ans, setupData.interviewType);
         setIsAnalyzing(false);
         pushNextQuestion(nextQ);
     } else {
         finishInterview();
     }
  };

  const pushNextQuestion = (q: string) => {
    setQuestions(prev => [...prev, q]);
    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentCandidateAnswer('');
    speakQuestion(q);
  };

  const finishInterview = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (avatarVideoRef.current) {
        setIsAvatarSpeaking(false);
        avatarVideoRef.current.pause();
        avatarVideoRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    try {
      const localQuestions = questions.map((q, i) => ({
        id: `mock-q-${i}`,
        session_id: sessionId,
        question_text: q,
        question_order: i,
        user_answer: answers[i] || ''
      }));
      localStorage.setItem(`mock_questions_${sessionId}`, JSON.stringify(localQuestions));

      for (let i = 0; i < questions.length; i++) {
          await supabase.from('interview_questions').insert([
            {
              session_id: sessionId,
              question_text: questions[i],
              question_order: i,
              user_answer: answers[i] || '',
            },
          ]);
      }
      await supabase.from('interview_sessions').update({ status: 'completed' }).eq('id', sessionId);
    } catch {
      console.warn("Could not save to Supabase.");
    }

    setTimeout(() => {
      navigate(`/ai-mock-interview/feedback/${sessionId}`);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!sessionId || !setupData) return null;

  const avatars: Record<string, { poster: string }> = {
     'John': { poster: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" },
     'Mike': { poster: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" },
     'Jyoti': { poster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" },
     'Lisa': { poster: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800" }
  };

  const selectedAvatar = avatars[setupData.interviewer || 'John'] || avatars['John'];

  return (
    <div className="min-h-screen relative p-6 font-sans text-gray-200" style={bgStyle}>
       <div className="max-w-[1400px] mx-auto h-[calc(100vh-48px)] flex flex-col gap-6">
          
          <div className="flex-1 flex gap-6 min-h-[500px]">
             
             {/* Left: Interviewer Video */}
             <div className={`flex-[2.5] relative rounded-3xl overflow-hidden shadow-xl border border-white/10 transition-all duration-500 bg-[#0A0D14] flex items-center justify-center
                ${isAvatarSpeaking ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}
             >
                <video 
                   ref={avatarVideoRef}
                   poster={selectedAvatar.poster}
                   autoPlay playsInline
                   className={`w-full h-full object-cover object-top transition-all duration-500 ${interviewStarted && !isAnalyzing ? 'opacity-100' : 'opacity-60'} ${isAvatarSpeaking ? 'scale-[1.02]' : 'scale-100'}`}
                />
                
                {isAvatarSpeaking && (
                   <div className="absolute top-6 left-6 bg-[#0A0D14]/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-500/30 animate-in fade-in zoom-in duration-300">
                      <div className="flex gap-1">
                         <span className="w-1 h-3 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                         <span className="w-1 h-4 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                         <span className="w-1 h-3 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">AI Speaking</span>
                   </div>
                )}                

                {interviewStarted && (
                   <div className="absolute bottom-6 left-6 bg-[#0A0D14]/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-md">
                      <span className="font-bold text-gray-300 tracking-wider text-sm">{formatTime(timeLeft)}</span>
                   </div>
                )}

                {/* Overlaid Actions */}
                {!interviewStarted ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-[#0A0D14]/60 backdrop-blur-sm">
                      {isAnalyzing ? (
                         <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                            <span className="text-white font-medium text-lg tracking-wide">Preparing your coaching environment...</span>
                         </div>
                       ) : apiError ? (
                         <div className="bg-[#151A26] p-8 rounded-2xl max-w-md text-center shadow-2xl border border-red-500/20">
                            <h3 className="text-red-400 font-bold text-xl mb-3">AI Engine Error</h3>
                            <p className="text-gray-300 font-medium mb-4">{apiError}</p>
                            <button 
                               onClick={fetchInitialSequence} 
                               className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-2 rounded-xl font-bold transition-colors"
                            >
                               Try Again
                            </button>
                         </div>
                       ) : (
                         <button 
                            onClick={startInterview}
                            className="bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] px-10 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 hover:scale-105"
                         >
                            <Play className="w-6 h-6 fill-current" />
                            BEGIN INTERVIEW
                         </button>
                      )}
                   </div>
                ) : (
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                      {isAnalyzing ? (
                         <div className="bg-[#0A0D14]/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 text-emerald-400 border border-emerald-500/30 shadow-lg">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="font-bold tracking-wide text-sm">Processing...</span>
                         </div>
                      ) : isListening ? (
                         <button 
                            onClick={handleEndAnswer}
                            className="bg-red-500 hover:bg-red-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 border border-red-400/30"
                         >
                            <Square className="w-4 h-4 fill-current" />
                            FINISH ANSWER
                         </button>
                      ) : (
                         <button 
                            onClick={handleStartAnswer}
                            className="bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                         >
                            <Mic className="w-5 h-5" />
                            START ANSWER
                         </button>
                      )}
                   </div>
                )}
             </div>

             {/* Right Sidebar */}
             <div className="flex-1 flex flex-col gap-6">
                
                {/* Candidate Video */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-[#0A0D14] w-full aspect-[4/3]">
                   <video
                      ref={videoRef}
                      autoPlay playsInline muted
                      className="w-full h-full object-cover scale-x-[-1]"
                   />
                   <button className="absolute top-4 right-4 bg-[#0A0D14]/60 p-2 rounded-full border border-white/10 hover:bg-white/10 text-gray-300 backdrop-blur-md transition-colors">
                      <Settings className="w-4 h-4" />
                   </button>
                </div>

                {/* Info Card */}
                <div className="bg-[#151A26] rounded-2xl border border-white/10 shadow-lg p-6 flex flex-col items-center justify-center gap-4 flex-1">

                   <div className="text-center space-y-1">
                      <h2 className="text-xl font-extrabold text-white">{setupData.jobRole}</h2>
                      <p className="text-gray-400 font-medium text-sm">{setupData.interviewType} Module</p>
                   </div>
                   
                   <div className="w-full space-y-3 mt-4">
                      <button className="w-full border border-white/10 hover:bg-white/5 text-gray-300 font-bold py-3 rounded-xl transition-colors text-sm tracking-wide">
                         EVALUATION CRITERIA
                      </button>
                      <button 
                         onClick={finishInterview}
                         className="w-full border border-red-500/20 hover:bg-red-500/10 text-red-400 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm tracking-wide"
                      >
                         <LogOut className="w-4 h-4" />
                         EXIT SESSION
                      </button>
                   </div>
                </div>

             </div>

          </div>

          {/* Bottom Area: Question Context */}
          <div className="bg-[#151A26] rounded-2xl border border-white/10 shadow-lg p-6 flex flex-col gap-3 min-h-[160px] relative">
             <div className="flex justify-between items-start h-full">
                <div className="flex-1 text-center flex flex-col justify-center h-full">
                   <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                      Current Question
                   </h3>
                   
                   {questions.length > 0 ? (
                      <p className="text-xl md:text-2xl font-bold text-white max-w-4xl mx-auto leading-relaxed">
                         {questions[currentQuestionIndex]}
                      </p>
                   ) : (
                      <p className="text-lg font-medium text-gray-500 italic mt-2">
                         Wait for the interviewer to begin...
                      </p>
                   )}
                   
                   {isListening && (
                      <div className="mt-8 bg-[#0A0D14]/50 rounded-xl p-4 border border-white/5 max-w-3xl mx-auto flex items-center justify-center gap-4">
                         <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Listening</span>
                         </div>
                         <p className="text-gray-300 font-medium line-clamp-2 italic max-w-[70%]">"{currentCandidateAnswer || '...' }"</p>
                      </div>
                   )}
                </div>
                
                <button 
                   onClick={() => speakQuestion(questions[currentQuestionIndex])}
                   disabled={!interviewStarted || questions.length === 0}
                   className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 text-sm font-bold border border-white/10"
                >
                   <Volume2 className="w-4 h-4" />
                   Repeat
                </button>
             </div>
          </div>

       </div>
    </div>
  );
}
