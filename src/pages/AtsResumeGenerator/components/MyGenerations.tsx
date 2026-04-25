import { useState, useEffect } from 'react';
import { SavedGeneration, ResumeData } from '../types';
import { FileText, Trash2, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

interface MyGenerationsProps {
  onLoad: (data: ResumeData) => void;
}

export default function MyGenerations({ onLoad }: MyGenerationsProps) {
  const [generations, setGenerations] = useState<SavedGeneration[]>([]);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savings_generations');
    if (saved) {
      try {
        setGenerations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse generations', e);
      }
    }
  }, []);

  const deleteGeneration = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = generations.filter(g => g.id !== id);
    setGenerations(updated);
    localStorage.setItem('savings_generations', JSON.stringify(updated));
  };

  const handleExportPDF = async (gen: SavedGeneration, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setExportingId(gen.id);
      const blob = await pdf(<ResumePDF data={gen.data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = gen.name ? `${gen.name.replace(/\s+/g, '_')}.pdf` : 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-600" />
          My Generations
        </h2>

        {generations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No generations yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven't saved any resumes yet. Go to New Transform to create and save your first resume.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generations.map((gen) => (
              <div 
                key={gen.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition cursor-pointer group"
                onClick={() => onLoad(gen.data)}
              >
                <div className="flex justify-between items-start mb-4 w-full">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className="font-semibold text-slate-900 truncate" title={gen.name}>
                      {gen.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(gen.date).toLocaleDateString()} at {new Date(gen.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleExportPDF(gen, e)}
                      disabled={exportingId === gen.id}
                      className={`p-1.5 ${exportingId === gen.id ? 'text-brand-600 bg-brand-50 cursor-wait' : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'} rounded-lg transition`}
                      title="Download PDF"
                    >
                      {exportingId === gen.id ? (
                        <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => deleteGeneration(gen.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 bg-slate-100 border border-slate-200 rounded shadow-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider origin-center">
                      {gen.data.template || 'Modern'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">
                      {gen.data.personalInfo.fullName || 'No Name Provided'}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      {gen.data.personalInfo.email || 'No Email'}
                    </div>
                    <div className="flex gap-2 mt-2">
                       {gen.data.experience.length > 0 && (
                         <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                           {gen.data.experience.length} Exp
                         </span>
                       )}
                       {gen.data.education.length > 0 && (
                         <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                           {gen.data.education.length} Edu
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
