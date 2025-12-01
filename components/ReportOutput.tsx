import React from 'react';
import { Loader } from './Loader';
import { SparklesIcon } from './icons/SparklesIcon';

interface ReportOutputProps {
    report: string;
    isLoading: boolean;
    error: string | null;
    progress: string;
    onSave: () => void; // <--- New Prop
}

export const ReportOutput: React.FC<ReportOutputProps> = ({ report, isLoading, error, progress, onSave }) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <Loader />
                    <p className="mt-4 text-center">{progress || 'Analysiere und formatiere den Bericht...'}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
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
            <div className="flex flex-col h-full">
                <pre className="whitespace-pre-wrap font-sans text-sm md:text-base p-4 bg-slate-100 dark:bg-slate-700 rounded-md overflow-y-auto flex-grow mb-4">
                    {report}
                </pre>

                {/* NEW SAVE BUTTON */}
                <button
                    onClick={onSave}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Bericht Speichern
                </button>
            </div>
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