import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Cpanel usually provides the port via process.env.PORT
// CloudLinux Passenger otomatik olarak port atar
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (tüm istekleri logla)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database setup
const defaultData = { users: [], qrCodes: [] };
const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter, defaultData);
await db.read();
db.data ||= defaultData;

// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, pass } = req.body;
        await db.read();
        const existingUser = db.data.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda' });
        }
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            pass
        };
        db.data.users.push(newUser);
        await db.write();
        const { pass: _, ...userWithoutPass } = newUser;
        res.json(userWithoutPass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        await db.read();
        const user = db.data.users.find(u => u.email === email && u.pass === pass);
        if (!user) {
            return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
        }
        const { pass: _, ...userWithoutPass } = user;
        res.json(userWithoutPass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- QR CODE ROUTES ---
app.get('/api/qrcodes', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'UserId required' });
        await db.read();
        const codes = db.data.qrCodes.filter(q => q.ownerId === userId);
        res.json(codes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/public/qr/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.read();
        const qr = db.data.qrCodes.find(q => q.id === id);
        if (qr) {
            res.json(qr);
        } else {
            res.status(404).json({ error: 'QR Kod bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/qrcodes', async (req, res) => {
    try {
        const { userId, data } = req.body;
        await db.read();
        const newQR = { ...data, ownerId: userId };
        db.data.qrCodes.unshift(newQR);
        await db.write();
        res.json(newQR);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/qrcodes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, data } = req.body;
        await db.read();
        const qrIndex = db.data.qrCodes.findIndex(q => String(q.id) === String(id));
        if (qrIndex === -1) {
            return res.status(404).json({ error: 'QR kod bulunamadı' });
        }
        if (String(db.data.qrCodes[qrIndex].ownerId) !== String(userId)) {
            return res.status(403).json({ error: 'Yetkisiz işlem' });
        }
        const updatedQR = { ...data, ownerId: userId };
        db.data.qrCodes[qrIndex] = updatedQR;
        await db.write();
        res.json(updatedQR);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/logos', async (req, res) => {
    try {
        await db.read();
        const logos = db.data.qrCodes
            .map(qr => qr.publisherLogo)
            .filter(logo => logo && logo.trim() !== '')
            .filter((logo, index, self) => self.indexOf(logo) === index);
        res.json(logos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/qrcodes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;
        await db.read();
        const initialLength = db.data.qrCodes.length;
        db.data.qrCodes = db.data.qrCodes.filter(q => !(q.id === id && q.ownerId === userId));
        if (db.data.qrCodes.length === initialLength) {
            return res.status(404).json({ error: 'Silinemedi veya yetki yok' });
        }
        await db.write();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/qrcodes/:id/scan', async (req, res) => {
    try {
        const { id } = req.params;
        await db.read();
        const qr = db.data.qrCodes.find(q => q.id === id);
        if (qr) {
            qr.scans = (qr.scans || 0) + 1;
            await db.write();
            res.json({ success: true, scans: qr.scans });
        } else {
            res.status(404).json({ error: 'QR Kod bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- API 404 HANDLER (Tüm API route'larından sonra, static'ten önce) ---
app.use('/api', (req, res) => {
    res.status(404).json({ error: `API endpoint bulunamadı: ${req.method} ${req.url}` });
});

// --- SERVE STATIC FRONTEND (API route'larından SONRA) ---
// Artık dist klasörü yerine public_html kök dizinini kullanıyoruz
const distPath = path.join(__dirname, '..');

// Static dosyaları serve et (API route'larından sonra)
app.use(express.static(distPath));

// Handle React routing, return all requests to React app (en son)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Frontend dosyaları bulunamadı. Lütfen index.html dosyasının yüklendiğinden emin olun.");
        }
    });
});

// CloudLinux Passenger için server başlatma
// Passenger otomatik olarak server'ı başlatır, bu yüzden sadece PORT dinliyoruz
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
});

