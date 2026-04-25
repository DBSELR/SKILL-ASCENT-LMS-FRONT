import './tailwind.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ResumePreview from './components/ResumePreview';
import MyGenerations from './components/MyGenerations';
import ResumePDF from './components/ResumePDF';
import { initialResumeData, ResumeData, SavedGeneration } from './types';
import { sampleResumeData } from './dummyData';
import { Download, Wand2, Sun, FileText, Sparkles, FileClock } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';

function AtsResumeGenerator() {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [view, setView] = useState<'editor' | 'generations'>('editor');
  const [isExporting, setIsExporting] = useState(false);

  const loadSampleData = () => {
    setData(sampleResumeData);
  };

  const handleExportAndSave = async () => {
    const saved = localStorage.getItem('savings_generations');
    let generations: SavedGeneration[] = [];
    if (saved) {
      try { generations = JSON.parse(saved); } catch (e) {}
    }
    
    const newGen: SavedGeneration = {
      id: Date.now().toString(),
      name: data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'Untitled Resume',
      date: new Date().toISOString(),
      data: data
    };
    
    // Check if we already saved this exact version
    const isDuplicate = generations.length > 0 && 
                        JSON.stringify(generations[0].data) === JSON.stringify(data);
                        
    if (!isDuplicate) {
      generations.unshift(newGen);
      localStorage.setItem('savings_generations', JSON.stringify(generations));
    }
    
    try {
      setIsExporting(true);
      const blob = await pdf(<ResumePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.personalInfo.fullName ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] print:h-auto print:bg-white print:overflow-visible">
      
      {/* Top Navigation Bar - Exact replica of ATSResume header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 print:hidden z-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-800 rounded flex items-center justify-center transform -skew-x-12">
              <FileText className="w-5 h-5 text-white transform skew-x-12" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">ATSResume</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 h-full mt-2">
            <button 
              onClick={() => setView('editor')}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 ${view === 'editor' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'} text-sm font-semibold transition`}
            >
              <Sparkles className="w-4 h-4" />
              New Transform
            </button>
            <button 
              onClick={() => setView('generations')}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 ${view === 'generations' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'} text-sm font-medium transition`}
            >
              <FileClock className="w-4 h-4" />
              My Generations
            </button>
          </nav>
        </div>
      </header>

      {/* Main Workspace */}
      {view === 'editor' ? (
        <div className="flex flex-1 overflow-hidden print:overflow-visible">
          {/* Editor Panel (Sidebar) */}
          <div className="w-[500px] flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto print:hidden shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10">
            <div className="p-6 pb-2 border-b border-slate-100 sticky top-0 bg-white z-10 hidden">
               {/* We can hide or move actions here, but I will keep them on top of preview like ATSResume transformation screen */}
            </div>
            <Sidebar data={data} setData={setData} />
          </div>

          {/* Live Preview Panel */}
          <div className="flex-1 overflow-y-auto w-full print:overflow-visible relative bg-[#F8FAFC]">
            
            <div className="absolute top-6 right-8 flex gap-3 print:hidden z-10">
              <button 
                onClick={loadSampleData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 hover:shadow-sm transition"
              >
                <Wand2 className="w-4 h-4 text-brand-600" />
                Auto-fill Data
              </button>
              <button 
                onClick={handleExportAndSave}
                disabled={isExporting}
                className={`flex items-center gap-2 px-5 py-2.5 ${isExporting ? 'bg-brand-600 cursor-wait' : 'bg-brand-800 hover:bg-brand-900 hover:shadow-md transform hover:scale-[1.02]'} text-white font-medium text-sm rounded-xl transition`}
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>

            <div className="p-12 pb-32 flex justify-center w-full print:p-0">
              <ResumePreview data={data} />
            </div>
          </div>
        </div>
      ) : (
        <MyGenerations onLoad={(loadedData) => {
          setData(loadedData);
          setView('editor');
        }} />
      )}

    </div>
  );
}

export default AtsResumeGenerator;
