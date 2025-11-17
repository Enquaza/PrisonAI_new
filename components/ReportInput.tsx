
import React from 'react';

interface ReportInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

export const ReportInput: React.FC<ReportInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Informeller Bericht</h2>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full flex-grow p-4 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        rows={15}
      />
    </div>
  );
};
