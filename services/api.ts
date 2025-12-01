const API_URL = 'http://localhost:5000/api/reports';

export interface ReportData {
    id: string;
    formal: string;
    date: string;
}

export const api = {
    // Load all reports
    getAll: async (): Promise<ReportData[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
    },

    // Save a report
    save: async (formalReport: string): Promise<ReportData> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formalReport }),
        });
        if (!res.ok) throw new Error('Failed to save report');
        return res.json();
    },

    // Delete one report
    delete: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete report');
    },

    // Delete all
    clearAll: async () => {
        const res = await fetch(API_URL, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to clear reports');
    }
};