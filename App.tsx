import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReportInput } from './components/ReportInput';
import { ReportOutput } from './components/ReportOutput';
import { PastReports } from './components/PastReports';
import { generateFormalReport } from './services/geminiService';
import { api, ReportData } from './services/api';
import { v4 as uuidv4 } from 'uuid';

export type StoredReport = ReportData;

function App() {
  const [informalReport, setInformalReport] = useState('');
  const [formalReport, setFormalReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const [storedReports, setStoredReports] = useState<ReportData[]>([]);

  useEffect(() => {
    api.getAll()
        .then(data => setStoredReports(data))
        .catch(err => console.error("Could not load reports:", err));
  }, []);

  const handleGenerate = async () => {
        if (!informalReport.trim()) return;
        setIsLoading(true);
        setError(null);
        setFormalReport('');

        try {
            // NEU: ID hier erzeugen
            const newCaseId = uuidv4();

            // NEU: ID als dritten Parameter übergeben
            const result = await generateFormalReport(informalReport, (msg) => setProgress(msg), newCaseId);

            setFormalReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            setProgress('');
        }
  };

  const handleSave = async () => {
    if (!formalReport) return;
    try {
      const savedReport = await api.save(formalReport);
      setStoredReports(prev => [savedReport, ...prev]);
      setFormalReport(savedReport.formal);
      alert("Bericht erfolgreich gespeichert!");
    } catch (err) {
      alert("Fehler beim Speichern. Läuft der Server?");
    }
  };

  const handleDeleteReport = async (id: any) => {
    const reportId = String(id);
    try {
      await api.delete(reportId);
      setStoredReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      alert("Fehler beim Löschen.");
    }
  };

  const handleClearAll = async () => {
    if(!window.confirm("Wirklich alle Berichte löschen?")) return;
    try {
      await api.clearAll();
      setStoredReports([]);
    } catch (err) {
      alert("Fehler beim Löschen.");
    }
  };

  return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col">
        <Header />

        {/* WICHTIG: Kein h-screen oder feste Höhe hier! */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">

          {/* Grid Layout: Auf Desktop nebeneinander, aber mit 'items-start', damit sie unabhängig wachsen können */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">

            {/* LINKE SEITE */}
            <div className="flex flex-col gap-4 w-full">
              {/* Min-Height sorgt dafür, dass es auch leer gut aussieht */}
              <div className="min-h-[500px]">
                <ReportInput
                    value={informalReport}
                    onChange={(e) => setInformalReport(e.target.value)}
                    placeholder="Fügen Sie hier Ihren informellen Bericht ein..."
                />
              </div>

              <button
                  onClick={handleGenerate}
                  disabled={isLoading || !informalReport.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verarbeite...' : 'Bericht Generieren'}
                {!isLoading && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
              </button>
            </div>

            {/* RECHTE SEITE */}
            <div className="w-full min-h-[500px]">
              <ReportOutput
                  report={formalReport}
                  isLoading={isLoading}
                  error={error}
                  progress={progress}
                  onSave={handleSave}
              />
            </div>
          </div>

          {/* UNTEN: HISTORY - Durch margin-top (mt-12) Abstand halten */}
          <div className="mt-12">
            <PastReports
                reports={storedReports}
                onSelectReport={(report) => setFormalReport(report.formal)}
                onDeleteReport={handleDeleteReport}
                onClearAll={handleClearAll}
            />
          </div>
        </main>
      </div>
  );
}

export default App;