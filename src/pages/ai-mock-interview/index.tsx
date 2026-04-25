import './compiled.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import CompatibilityCheck from './pages/CompatibilityCheck';
import InterviewSession from './pages/InterviewSession';
import FeedbackPage from './pages/FeedbackPage';

function AiMockInterview() {
  return (
    <div className="ai-mock-interview-root">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/compatibility-check" element={<CompatibilityCheck />} />
        <Route path="/interview" element={<InterviewSession />} />
        <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default AiMockInterview;
