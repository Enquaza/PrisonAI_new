import React from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { StoredReport } from '../App';

interface PastReportsProps {
  reports: StoredReport[];
  onSelectReport: (report: StoredReport) => void;
  onDeleteReport: (id: number) => void;
  onClearAll: () => void;
}

const parseReportSummary = (formalReport: string): { caseNumber: string; date: string } => {
  const caseNumberMatch = formalReport.match(/Fallnummer:\s*(.*)/);
  const dateMatch = formalReport.match(/Datum\/Uhrzeit:\s*(.*)/);

  return {
    caseNumber: caseNumberMatch ? caseNumberMatch[1].trim() : 'Unbekannte Fallnummer',
    date: dateMatch ? dateMatch[1].trim() : 'Unbekanntes Datum',
  };
};

export const PastReports: React.FC<PastReportsProps> = ({ reports, onSelectReport, onDeleteReport, onClearAll }) => {
  if (reports.length === 0) {
    return null;
  }

  return (
      // Hintergrund und Padding sorgen für saubere Trennung
      <div className="w-full bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Vergangene Berichte</h2>
          <button
              onClick={onClearAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Alle Berichte löschen"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Alle löschen</span>
          </button>
        </div>

        <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {reports.map((report) => {
            const { caseNumber, date } = parseReportSummary(report.formal);
            return (
                <div
                    key={report.id}
                    className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
                >
                  <button
                      onClick={() => onSelectReport(report)}
                      className="flex-grow text-left focus:outline-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{caseNumber}</span>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(report.date).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </button>

                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReport(Number(report.id) || String(report.id) as any);
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
            );
          })}
        </div>
      </div>
  );
};