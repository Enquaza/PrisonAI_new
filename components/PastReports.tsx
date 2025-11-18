
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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Vergangene Berichte</h2>
            {reports.length > 0 && (
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    aria-label="Alle Berichte löschen"
                >
                    <TrashIcon className="w-4 h-4" />
                    <span>Alle löschen</span>
                </button>
            )}
          </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {reports.map((report) => {
                 const { caseNumber, date } = parseReportSummary(report.formal);
                return (
                    <div
                        key={report.id}
                        className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                    >
                         <button onClick={() => onSelectReport(report)} className="flex-grow text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded-md -m-1 p-1">
                            <p className="font-semibold text-indigo-600 dark:text-indigo-400">{caseNumber}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{date}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Gespeichert am: {new Date(report.date).toLocaleString('de-DE')}</p>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteReport(report.id);
                            }}
                            className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                            aria-label={`Bericht ${caseNumber} löschen`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};
