import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle2, XCircle, Video, Mic, Monitor, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CheckStatus {
  browser: boolean | null;
  camera: boolean | null;
  microphone: boolean | null;
}

export default function CompatibilityCheck() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [checks, setChecks] = useState<CheckStatus>({
    browser: null,
    camera: null,
    microphone: null,
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkBrowser();
    requestPermissions();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkBrowser = () => {
    const isCompatible = !!(
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      !!window.MediaRecorder
    );
    setChecks(prev => ({ ...prev, browser: isCompatible }));
  };

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];

      setChecks(prev => ({
        ...prev,
        camera: videoTrack?.enabled || false,
        microphone: audioTrack?.enabled || false,
      }));

      setIsChecking(false);
    } catch (err) {
      console.error('Permission error:', err);
      setError('Unable to access camera or microphone. Please check your permissions.');
      setChecks(prev => ({
        ...prev,
        camera: false,
        microphone: false,
      }));
      setIsChecking(false);
    }
  };

  const allChecksPassed = checks.browser && checks.camera && checks.microphone;

  const handleContinue = async () => {
    if (!allChecksPassed) {
      alert('Please ensure all compatibility checks pass before continuing.');
      return;
    }

    const setupData = localStorage.getItem('interviewSetup');
    if (!setupData) {
      alert('Setup data not found. Please complete the setup first.');
      navigate('/ai-mock-interview/setup');
      return;
    }

    const formData = JSON.parse(setupData);

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert([
          {
            job_role: formData.jobRole,
            industry: formData.industry || 'IT',
            company: formData.company || null,
            job_description: formData.jobDescription || null,
            interview_type: formData.interviewType,
            difficulty_level: formData.difficultyLevel || null,
            interviewer: formData.interviewer,
            custom_questions: formData.customQuestions ? formData.customQuestions.filter((q: string) => q.trim() !== '') : [],
            status: 'in_progress',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        navigate('/ai-mock-interview/interview', { state: { sessionId: data.id, setupData: formData } });
      }
    } catch (err: any) {
      console.error('Error creating session:', err);
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
         console.warn('Database offline or keys missing. Proceeding in mock mode.');
         navigate('/ai-mock-interview/interview', { state: { sessionId: 'mock-session-123', setupData: formData } });
      } else {
         alert('Error creating interview session. Please try again. Details: ' + (err.message || JSON.stringify(err)));
      }
    }
  };

  const CheckItem = ({ icon: Icon, label, status }: { icon: any; label: string; status: boolean | null }) => (
    <div className="flex items-center justify-between p-4 bg-[#0F131D] border border-white/5 rounded-xl transition-colors hover:border-emerald-500/20">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <span className="font-bold text-gray-200 tracking-wide">{label}</span>
      </div>
      <div>
        {status === null ? (
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        ) : status ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <nav className="bg-[#0A0D14]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-widest text-white uppercase">ELEVATE</span>
          </div>
          <button
            onClick={() => navigate('/ai-mock-interview/setup')}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold transition-colors"
          >
             <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">System Verification</h1>
          <p className="text-lg text-gray-400">
            We need to verify your browser, camera, and microphone functionality safely.
          </p>
        </div>

        <div className="bg-[#151A26] rounded-2xl shadow-2xl p-8 border border-white/5">
          <div className="space-y-4 mb-8">
            <CheckItem icon={Monitor} label="Browser Compatibility" status={checks.browser} />
            <CheckItem icon={Video} label="Camera Access" status={checks.camera} />
            <CheckItem icon={Mic} label="Microphone Access" status={checks.microphone} />
          </div>

          {checks.camera && stream && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-300 mb-3 tracking-widest uppercase">
                Video Feed Preview
              </label>
              <div className="relative bg-[#0A0D14] rounded-xl overflow-hidden aspect-video border border-white/10 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-bold uppercase tracking-wider">Access Denied</p>
                <p className="text-sm text-gray-300 mt-1 leading-relaxed">{error}</p>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  Please allow hardware access in your device settings and refresh.
                </p>
              </div>
            </div>
          )}

          {allChecksPassed && !isChecking && (
            <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <p className="text-sm text-emerald-300 font-bold tracking-wide">
                Diagnostics complete. All systems green.
              </p>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!allChecksPassed || isChecking}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center tracking-wide ${
              allChecksPassed && !isChecking
                ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]'
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isChecking ? 'Verifying Devices...' : 'Initiate Session'}
          </button>
        </div>
      </div>
    </div>
  );
}
