import express from 'express';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

interface StoredBooking {
  id: string;
  createdAt: string;
  syncedToCalendar: boolean;
  calendarLink?: string;
  sessionType: 'discovery' | 'counselling' | 'package4' | 'package6';
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  focusArea: string;
  teenName: string;
  teenAge: string;
  teenDob: string;
  parentName: string;
  relationship: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  locationCountry: string;
  locationCity: string;
  emergencyName: string;
  emergencyPhone: string;
  idType: string;
  idLastFour: string;
  currency: 'NGN' | 'USD';
  paymentReference: string;
  notes: string;
  teenSignature: string;
  parentSignature: string;
  consentDate: string;
}

async function readBookings(): Promise<StoredBooking[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: StoredBooking[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
}

const AUTHORIZED_COUNSELLOR_EMAILS = new Set(
  [
    'titilayomaryfayehun@gmail.com',
    'fotachurchmedia@gmail.com',
    'sundayasagba5@gmail.com',
    ...(process.env.COUNSELLOR_ADMIN_EMAILS
      ? process.env.COUNSELLOR_ADMIN_EMAILS.split(',').map((e) => e.trim())
      : []),
  ].map((e) => e.toLowerCase())
);

async function verifyGoogleBearerToken(
  authHeader: string | undefined
): Promise<{ email?: string; verified: boolean; isAuthorizedCounsellor: boolean }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { verified: false, isAuthorizedCounsellor: false };
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return { verified: false, isAuthorizedCounsellor: false };

  try {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`
    );
    if (!res.ok) return { verified: false, isAuthorizedCounsellor: false };
    const data = (await res.json()) as { email?: string };
    let email = data.email;

    if (!email) {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userInfoRes.ok) {
        const userInfo = (await userInfoRes.json()) as { email?: string };
        email = userInfo.email;
      }
    }

    const isAuthorizedCounsellor = Boolean(
      email && AUTHORIZED_COUNSELLOR_EMAILS.has(email.toLowerCase())
    );

    return {
      verified: true,
      email,
      isAuthorizedCounsellor,
    };
  } catch {
    return { verified: false, isAuthorizedCounsellor: false };
  }
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // Public endpoint: submit a private booking application
  app.post('/api/bookings', async (req, res) => {
    try {
      const body = req.body as Partial<StoredBooking>;
      if (
        !body.teenName ||
        !body.parentName ||
        !body.parentEmail ||
        !body.preferredDate ||
        !body.preferredTime
      ) {
        return res.status(400).json({ error: 'Missing required booking fields.' });
      }

      const validSessionType =
        body.sessionType === 'discovery' ||
        body.sessionType === 'package4' ||
        body.sessionType === 'package6'
          ? body.sessionType
          : 'counselling';

      const id = `SW-${Date.now().toString(36).toUpperCase()}`;
      const newBooking: StoredBooking = {
        id,
        createdAt: new Date().toISOString(),
        syncedToCalendar: Boolean(body.syncedToCalendar),
        calendarLink: body.calendarLink,
        sessionType: validSessionType,
        preferredDate: String(body.preferredDate),
        preferredTime: String(body.preferredTime),
        timezone: String(body.timezone || 'Africa/Lagos'),
        focusArea: String(body.focusArea || 'Online Counselling'),
        teenName: String(body.teenName),
        teenAge: String(body.teenAge || ''),
        teenDob: String(body.teenDob || ''),
        parentName: String(body.parentName),
        relationship: String(body.relationship || ''),
        parentEmail: String(body.parentEmail),
        parentPhone: String(body.parentPhone || ''),
        address: String(body.address || ''),
        locationCountry: String(body.locationCountry || ''),
        locationCity: String(body.locationCity || ''),
        emergencyName: String(body.emergencyName || ''),
        emergencyPhone: String(body.emergencyPhone || ''),
        idType: String(body.idType || ''),
        idLastFour: String(body.idLastFour || ''),
        currency: body.currency === 'USD' ? 'USD' : 'NGN',
        paymentReference: String(body.paymentReference || ''),
        notes: String(body.notes || ''),
        teenSignature: String(body.teenSignature || ''),
        parentSignature: String(body.parentSignature || ''),
        consentDate: String(body.consentDate || ''),
      };

      const existing = await readBookings();
      existing.unshift(newBooking);
      await writeBookings(existing);

      return res.status(201).json({ booking: newBooking });
    } catch (error) {
      console.error('Error saving booking:', error);
      return res.status(500).json({ error: 'Unable to save booking application.' });
    }
  });

  // Protected endpoint: only authorized counsellor/owner Google accounts can view private bookings
  app.get('/api/bookings', async (req, res) => {
    const verification = await verifyGoogleBearerToken(req.headers.authorization);
    if (!verification.verified) {
      return res
        .status(401)
        .json({ error: 'Google verification required to view private bookings.' });
    }
    if (!verification.isAuthorizedCounsellor) {
      return res.status(403).json({
        error: `Access restricted to authorized Still Waters counsellor accounts (signed in as ${
          verification.email || 'unknown'
        }).`,
      });
    }

    const bookings = await readBookings();
    return res.json({ bookings, viewerEmail: verification.email });
  });

  // Protected endpoint: mark booking as synced to Google Calendar
  app.patch('/api/bookings/:id/sync', async (req, res) => {
    const verification = await verifyGoogleBearerToken(req.headers.authorization);
    if (!verification.verified) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!verification.isAuthorizedCounsellor) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { id } = req.params;
    const { calendarLink } = req.body as { calendarLink?: string };
    const bookings = await readBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    bookings[index] = {
      ...bookings[index],
      syncedToCalendar: true,
      calendarLink: calendarLink || bookings[index].calendarLink,
    };
    await writeBookings(bookings);
    return res.json({ booking: bookings[index] });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: hmrDisabled ? false : { server: httpServer },
        hmr: hmrDisabled ? false : true,
      },
      appType: 'spa',
    });

    if (hmrDisabled) {
      // Vite 8 injects /@vite/client into index.html and attempts a WebSocket connection
      // even when ws/hmr are false. Provide the client runtime exports without WebSockets.
      app.get('/@vite/client', (_req, res) => {
        res.type('application/javascript').send(`
export class ErrorOverlay { constructor() {} }
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(id) { return id; }
export function removeStyle(id) {
  const el = document.querySelector('style[data-vite-dev-id="' + CSS.escape(id) + '"]');
  if (el) el.remove();
}
export function updateStyle(id, content) {
  let style = document.querySelector('style[data-vite-dev-id="' + CSS.escape(id) + '"]');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    document.head.appendChild(style);
  }
  style.textContent = content;
}
`);
      });
    }

    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Still Waters server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
