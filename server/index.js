import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Da wir "import" nutzen, müssen wir __dirname manuell erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Hilfsfunktion: Berichte aus der Datei lesen
const readReports = () => {
    if (!fs.existsSync(DB_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
};

// Hilfsfunktion: Berichte in die Datei speichern
const saveReports = (reports) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(reports, null, 2));
};

// --- ROUTEN ---

// 1. Alle Berichte laden
app.get('/api/reports', (req, res) => {
    try {
        const reports = readReports();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Laden' });
    }
});

// 2. Bericht speichern
app.post('/api/reports', (req, res) => {
    try {
        const { formalReport } = req.body;
        if (!formalReport) return res.status(400).json({ error: 'Inhalt fehlt' });

        const reports = readReports();

        // 1. Versuchen, die ID aus dem Text zu lesen (Regex sucht nach Fallnummer: <ID>)
        const idMatch = formalReport.match(/Fallnummer:\s*([^\n\r]+)/);

        // Wenn eine ID gefunden wurde, nimm sie. Sonst generiere eine neue (Fallback).
        const reportId = idMatch && idMatch[1].trim() !== '[Angabe fehlt]'
            ? idMatch[1].trim()
            : uuidv4();

        const newReport = {
            id: reportId,
            formal: formalReport,
            date: new Date().toISOString()
        };

        reports.unshift(newReport);
        saveReports(reports);

        res.status(201).json(newReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Speichern' });
    }
});

// 3. Einen Bericht löschen
app.delete('/api/reports/:id', (req, res) => {
    try {
        const { id } = req.params;
        let reports = readReports();
        reports = reports.filter(r => r.id !== id);
        saveReports(reports);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
});

// 4. Alle löschen
app.delete('/api/reports', (req, res) => {
    try {
        saveReports([]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend Server läuft auf http://localhost:${PORT}`);
});