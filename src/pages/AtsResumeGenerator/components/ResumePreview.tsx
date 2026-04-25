import React from 'react';
import { ResumeData } from '../types';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const renderTemplate = () => {
    switch (data.template) {
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div 
      className="bg-white shadow-xl max-w-[850px] w-full min-h-[1100px] print:shadow-none print:w-full print:max-w-none print:m-0"
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
