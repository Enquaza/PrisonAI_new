
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ReportInput } from './components/ReportInput';
import { ReportOutput } from './components/ReportOutput';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateFormalReport } from './services/geminiService';
import { PastReports } from './components/PastReports';

const STORAGE_KEY = 'prisonAI_reports';

export type StoredReport = {
  id: number;
  informal: string;
  formal: string;
  date: string;
};

const App: React.FC = () => {
  const [informalReport, setInformalReport] = useState<string>('');
  const [formalReport, setFormalReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [pastReports, setPastReports] = useState<StoredReport[]>([]);

  // Load reports from localStorage on initial render
  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(STORAGE_KEY);
      if (storedReports) {
        setPastReports(JSON.parse(storedReports));
      }
    } catch (err) {
      console.error("Failed to load past reports from storage:", err);
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pastReports));
    } catch (err) {
      console.error("Failed to save past reports to storage:", err);
    }
  }, [pastReports]);

  const saveReport = (informal: string, formal: string) => {
    const newReport: StoredReport = {
      id: Date.now(),
      informal,
      formal,
      date: new Date().toISOString(),
    };
    // Add new report to the beginning of the list
    setPastReports(prevReports => [newReport, ...prevReports]);
  };

  const handleDeleteReport = useCallback((id: number) => {
    setPastReports(prev => prev.filter(report => report.id !== id));
  }, []);

  const handleClearAllReports = useCallback(() => {
    if (window.confirm('Möchten Sie wirklich alle vergangenen Berichte löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      setPastReports([]);
    }
  }, []);

  const handleSelectReport = useCallback((report: StoredReport) => {
    setInformalReport(report.informal);
    setFormalReport(report.formal);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!informalReport.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setFormalReport('');
    setProgress('');

    try {
      const result = await generateFormalReport(informalReport, (message) => {
        setProgress(message);
      });
      setFormalReport(result);
      saveReport(informalReport, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setProgress('');
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
            progress={progress}
          />
        </div>
      </main>

      <PastReports 
        reports={pastReports}
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
        onClearAll={handleClearAllReports}
      />

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
