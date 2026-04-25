import { Brain, Target, Zap, ChevronRight, CheckCircle2, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200">
      <nav className="fixed top-0 w-full bg-[#0A0D14]/80 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-widest uppercase">ELEVATE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-emerald-400 transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-400 hover:text-emerald-400 transition-colors">Pricing</a>
          </div>
          <button
            onClick={() => navigate('/ai-mock-interview/setup')}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] px-6 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-8 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Next-Gen AI Interview Coaching</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Master Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Job Interview
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
              Practice with AI-powered mock interviews, receive instant feedback, and build confidence.
              Get hired faster with personalized coaching tailored strictly to your dream role.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/ai-mock-interview/setup')}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                Start Practicing Free
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors border border-white/10">
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                1000+ practice questions
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Real-time feedback
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-white/5 bg-[#0F131D]" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Ace Your Interview
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools and features designed to make you interview-ready
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#151A26] p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <Brain className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Questions</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Get personalized interview questions based on your industry, role, and experience level. Our AI adapts to your responses in real-time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Role-specific scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Behavioral questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Technical assessments</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#151A26] p-8 rounded-2xl border border-white/5 hover:border-teal-500/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 border border-teal-500/20">
                <Target className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Feedback</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Receive detailed analysis of your answers, including tone, clarity, structure, and content. Know exactly what to improve.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Speech analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Body language tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Content scoring</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#151A26] p-8 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Track Progress</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Monitor your improvement over time with detailed analytics. See your strengths and areas that need more practice.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Performance metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Progress reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Skill development</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-white/5" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple Process, Powerful Results
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get interview-ready in just three easy steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[40px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-emerald-500/50 z-0" />

            <div className="relative z-10">
              <div className="bg-[#151A26] border border-white/10 w-20 h-20 rounded-2xl flex items-center justify-center text-emerald-400 text-3xl font-bold mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Choose Your Track</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Select your target role, pick a specific company, or input a Job Description. Our AI customizes everything instantly.
              </p>
            </div>

            <div className="relative z-10">
              <div className="bg-[#151A26] border border-white/10 w-20 h-20 rounded-2xl flex items-center justify-center text-teal-400 text-3xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Practice & Record</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Answer realistic interview questions while our AI analyzes your responses, tone, and delivery in real-time.
              </p>
            </div>

            <div className="relative z-10">
              <div className="bg-[#151A26] border border-white/10 w-20 h-20 rounded-2xl flex items-center justify-center text-emerald-400 text-3xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Get Feedback</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Review detailed feedback, track your progress, and keep practicing until you're completely confident.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/5 bg-[#101520] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542382103-61fc6a1b80c3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Users className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join 50,000+ Job Seekers Who Got Hired
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Our users report 3x more interview callbacks and 2x higher offer rates after practicing with ELEVATE.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl font-bold text-emerald-400 mb-2">85%</div>
              <div className="text-gray-300 font-medium">Success Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl font-bold text-emerald-400 mb-2">1M+</div>
              <div className="text-gray-300 font-medium">Practice Sessions</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl font-bold text-emerald-400 mb-2">4.9/5</div>
              <div className="text-gray-300 font-medium">User Rating</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/ai-mock-interview/setup')}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#0A0D14] px-10 py-5 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center gap-2 mx-auto"
          >
            Start Your Free Trial
            <Zap className="w-5 h-5 fill-current" />
          </button>
        </div>
      </section>

      <footer className="bg-[#0A0D14] border-t border-white/10 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <Brain className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-lg font-bold text-white tracking-widest uppercase">ELEVATE</span>
              </div>
              <p className="text-gray-500 text-sm">
                Master your interviews with AI-powered practice and feedback.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm font-medium">
            © 2026 ELEVATE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
