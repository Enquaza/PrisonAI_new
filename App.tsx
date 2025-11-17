
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ReportInput } from './components/ReportInput';
import { ReportOutput } from './components/ReportOutput';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateFormalReport } from './services/geminiService';

const App: React.FC = () => {
  const [informalReport, setInformalReport] = useState<string>('');
  const [formalReport, setFormalReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!informalReport.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setFormalReport('');

    try {
      const result = await generateFormalReport(informalReport);
      setFormalReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [informalReport, isLoading]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-grow">
          <ReportInput
            value={informalReport}
            onChange={(e) => setInformalReport(e.target.value)}
            placeholder="Geben Sie hier Ihren informellen Bericht auf Deutsch ein..."
          />
          <ReportOutput
            report={formalReport}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      <footer className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="container mx-auto flex justify-center">
              <button
                  onClick={handleGenerateClick}
                  disabled={isLoading || !informalReport.trim()}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                  {isLoading ? (
                      <Loader />
                  ) : (
                      <>
                          <SparklesIcon className="w-6 h-6" />
                          <span>Formellen Bericht erstellen</span>
                      </>
                  )}
              </button>
          </div>
      </footer>
    </div>
  );
};

export default App;
