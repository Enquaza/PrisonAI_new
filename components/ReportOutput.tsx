
import React from 'react';
import { Loader } from './Loader';
import { SparklesIcon } from './icons/SparklesIcon';

interface ReportOutputProps {
  report: string;
  isLoading: boolean;
  error: string | null;
}

export const ReportOutput: React.FC<ReportOutputProps> = ({ report, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
          <Loader />
          <p className="mt-4 text-center">Analysiere und formatiere den Bericht...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="font-semibold">Error</p>
          <p className="text-center">{error}</p>
        </div>
      );
    }
    
    if (!report) {
         return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <SparklesIcon className="w-16 h-16 opacity-30" />
            <p className="mt-4 text-center">Der formelle Bericht wird hier angezeigt.</p>
        </div>
      );
    }

    return (
      <pre className="whitespace-pre-wrap font-sans text-sm md:text-base p-4 bg-slate-100 dark:bg-slate-700 rounded-md overflow-y-auto">
        {report}
      </pre>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
       <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Formeller Bericht</h2>
       <div className="flex-grow min-h-[300px] lg:min-h-0">
          {renderContent()}
       </div>
    </div>
  );
};
