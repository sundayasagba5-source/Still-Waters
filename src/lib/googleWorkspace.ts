import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const COUNSELLOR_EMAIL = 'titilayomaryfayehun@gmail.com';

// Minimum least-privilege Workspace scopes for booking & email notification
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.send',
];

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
for (const scope of WORKSPACE_SCOPES) {
  provider.addScope(scope);
}
provider.setCustomParameters({
  prompt: 'select_account consent',
});

let isSigningIn = false;
// In-memory access token cache ONLY (never stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;

export function formatGoogleAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code)
      : '';
  const rawMessage = err instanceof Error ? err.message : String(err || '');

  if (code === 'auth/unauthorized-domain') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    return `Domain "${host}" is not authorized in Firebase Authentication. Open Firebase Console → Authentication → Settings → Authorized domains and add "${host}".`;
  }
  if (code === 'auth/popup-blocked') {
    return 'Your browser blocked the Google Sign-In popup. Please allow popups for this site (or open the app in a full browser tab) and try again.';
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Google Sign-In was closed before finishing. Click "Sign in with Google", select an approved test account, click "Continue" on the Google verification notice, and tick the Calendar & Gmail checkboxes.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google Sign-In provider is disabled in Firebase Console → Authentication → Sign-in method. Please enable Google there.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network error while connecting to Google Sign-In. Please check your internet connection and retry.';
  }
  if (rawMessage.includes('access_denied')) {
    return 'Google blocked access (Error 403: access_denied) because this account is not yet in the Test users list for project gen-lang-client-0490265049. Sign in with fotachurchmedia@gmail.com, or have fotachurchmedia@gmail.com add sundayasagba5@gmail.com and titilayomaryfayehun@gmail.com under Google Cloud Console → Google Auth Platform → Audience → Test users.';
  }

  return rawMessage || 'Google verification could not be completed. Please try again.';
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure?.(user);
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure?.(null);
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const fallbackToken = (
      result as unknown as { _tokenResponse?: { oauthAccessToken?: string } }
    )?._tokenResponse?.oauthAccessToken;
    const accessToken = credential?.accessToken || fallbackToken;

    if (!accessToken) {
      throw new Error(
        'Google Sign-In succeeded, but Calendar & Gmail permissions were not granted. Please click "Continue" and check the permission boxes when prompted.'
      );
    }
    cachedAccessToken = accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => cachedAccessToken;

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export type SessionPlanType = 'discovery' | 'counselling' | 'package4' | 'package6';

export interface BookingPayload {
  sessionType: SessionPlanType;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:MM (24h)
  timezone: string; // IANA timezone string e.g. Africa/Lagos
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

export function formatSessionPlanLabel(
  sessionType: SessionPlanType,
  currency: 'NGN' | 'USD'
): string {
  if (sessionType === 'discovery') {
    return 'Free 20-min Parent Discovery Call';
  }
  if (sessionType === 'package4') {
    return `4-Session Support Package (4 × 45 mins · ${currency === 'NGN' ? '₦75,000' : '$150'})`;
  }
  if (sessionType === 'package6') {
    return `6-Session Support Package (6 × 45 mins · ${currency === 'NGN' ? '₦110,000' : '$220'})`;
  }
  return `Single Online Counselling Session (45 mins · ${currency === 'NGN' ? '₦20,000' : '$40'})`;
}

function localTimeInTimezoneToUtcDate(
  dateStr: string,
  timeStr: string,
  timeZone: string
): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(utcGuess);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    const tzYear = get('year');
    const tzMonth = get('month');
    const tzDay = get('day');
    const tzHour = get('hour') === 24 ? 0 : get('hour');
    const tzMinute = get('minute');
    const tzSecond = get('second');
    const asUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond);
    const offsetMs = asUtc - utcGuess.getTime();
    return new Date(utcGuess.getTime() - offsetMs);
  } catch {
    return utcGuess;
  }
}

function addMinutesToTime(
  dateStr: string,
  timeStr: string,
  minutesToAdd: number,
  timeZone: string
): {
  startRfc3339: string;
  endRfc3339: string;
  startLocalCompact: string;
  endLocalCompact: string;
} {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const wallStart = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const wallEnd = new Date(wallStart.getTime() + minutesToAdd * 60_000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatCompact = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
      d.getUTCHours()
    )}${pad(d.getUTCMinutes())}00`;

  const utcStart = localTimeInTimezoneToUtcDate(dateStr, timeStr, timeZone);
  const utcEnd = new Date(utcStart.getTime() + minutesToAdd * 60_000);

  return {
    startRfc3339: utcStart.toISOString(),
    endRfc3339: utcEnd.toISOString(),
    startLocalCompact: formatCompact(wallStart),
    endLocalCompact: formatCompact(wallEnd),
  };
}

function encodeBase64Utf8(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function encodeBase64UrlUtf8(input: string): string {
  return encodeBase64Utf8(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function buildBookingSummaryText(booking: BookingPayload): string {
  const isDiscovery = booking.sessionType === 'discovery';
  const sessionLabel = formatSessionPlanLabel(booking.sessionType, booking.currency);

  return [
    'STILL WATERS — NEW COUNSELLING BOOKING REQUEST',
    '================================================',
    `Selected Plan: ${sessionLabel}`,
    `Preferred First Date & Time: ${booking.preferredDate} at ${booking.preferredTime} (${booking.timezone})`,
    `Focus Area: ${booking.focusArea}`,
    '',
    'TEENAGER DETAILS',
    `Name: ${booking.teenName}`,
    `Age: ${booking.teenAge} | Date of Birth: ${booking.teenDob}`,
    `Location: ${booking.locationCity}, ${booking.locationCountry}`,
    '',
    'PARENT / GUARDIAN DETAILS',
    `Name: ${booking.parentName} (${booking.relationship})`,
    `Email: ${booking.parentEmail}`,
    `Phone / WhatsApp: ${booking.parentPhone}`,
    `Address: ${booking.address}`,
    '',
    'EMERGENCY CONTACT & GUARDIAN ID VERIFICATION',
    `Emergency Contact: ${booking.emergencyName} (${booking.emergencyPhone})`,
    `ID Verification: ${booking.idType} (Last 4 digits: ${booking.idLastFour})`,
    '',
    isDiscovery
      ? 'PAYMENT: Free 20-minute Parent Discovery Call (No fee required)'
      : [
          'PAYMENT ARRANGEMENT',
          `Selected Plan Fee: ${sessionLabel}`,
          `Preferred Payment Method: ${booking.paymentReference || 'Secure payment link / verified invoice after confirmation'}`,
          'Note: Verified payment link/invoice to be sent directly to parent email upon booking confirmation.',
        ].join('\n'),
    '',
    'ETHICAL, LEGAL & SAFEGUARDING PACK SIGN-OFF',
    `Teen Digital Signature: ${booking.teenSignature}`,
    `Parent/Guardian Digital Signature: ${booking.parentSignature}`,
    `Signed Date: ${booking.consentDate}`,
    'Confirmed: Professional Disclosure, Informed Consent, Parental Consent (Under 18), Confidentiality & Limits, Safeguarding & Child Protection, Online Counselling Agreement, and Data Protection & Privacy.',
    '',
    booking.notes ? `Additional Notes: ${booking.notes}` : '',
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}

export async function createCalendarBookingEvent(
  accessToken: string,
  booking: BookingPayload
): Promise<{ eventId: string; htmlLink: string }> {
  const durationMinutes = booking.sessionType === 'discovery' ? 20 : 45;
  const { startRfc3339, endRfc3339 } = addMinutesToTime(
    booking.preferredDate,
    booking.preferredTime,
    durationMinutes,
    booking.timezone
  );

  const sessionTitle =
    booking.sessionType === 'discovery'
      ? `Still Waters Discovery Call — ${booking.parentName} (Teen: ${booking.teenName})`
      : `Still Waters Counselling — ${booking.teenName} (Age ${booking.teenAge})`;

  const attendees = [
    {
      email: COUNSELLOR_EMAIL,
      displayName: 'Titilayo Mary Sonibare (Still Waters)',
    },
  ];
  if (
    booking.parentEmail &&
    booking.parentEmail.toLowerCase() !== COUNSELLOR_EMAIL.toLowerCase()
  ) {
    attendees.push({
      email: booking.parentEmail,
      displayName: booking.parentName,
    });
  }

  const eventBody = {
    summary: sessionTitle,
    location: 'Online (Zoom / Google Meet)',
    description: buildBookingSummaryText(booking),
    start: {
      dateTime: startRfc3339,
      timeZone: booking.timezone,
    },
    end: {
      dateTime: endRfc3339,
      timeZone: booking.timezone,
    },
    attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Unable to create Google Calendar event.'
    );
  }

  return {
    eventId: data.id,
    htmlLink: data.htmlLink,
  };
}

export async function sendBookingEmailNotification(
  accessToken: string,
  booking: BookingPayload,
  calendarLink?: string
): Promise<{ messageId: string }> {
  const sessionLabel = formatSessionPlanLabel(booking.sessionType, booking.currency);

  const subject = `[Still Waters Booking] ${sessionLabel} — ${booking.teenName} (${booking.preferredDate})`;
  const bodyText = [
    `Dear Titilayo Mary Sonibare,`,
    '',
    `A new Still Waters booking application has been submitted and added to Google Calendar.`,
    calendarLink ? `Google Calendar Event Link: ${calendarLink}` : '',
    '',
    buildBookingSummaryText(booking),
  ]
    .filter(Boolean)
    .join('\n');

  const mimeLines = [
    `To: ${COUNSELLOR_EMAIL}`,
    `Reply-To: ${booking.parentEmail}`,
    `Subject: =?UTF-8?B?${encodeBase64Utf8(subject)}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    bodyText,
  ];

  const raw = encodeBase64UrlUtf8(mimeLines.join('\r\n'));

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Unable to send Gmail notification.'
    );
  }

  return {
    messageId: data.id,
  };
}

export interface StoredBooking extends BookingPayload {
  id: string;
  createdAt: string;
  syncedToCalendar: boolean;
  calendarLink?: string;
}

export function buildGoogleCalendarTemplateUrl(booking: BookingPayload): string {
  const durationMinutes = booking.sessionType === 'discovery' ? 20 : 45;
  const { startLocalCompact, endLocalCompact } = addMinutesToTime(
    booking.preferredDate,
    booking.preferredTime,
    durationMinutes,
    booking.timezone
  );

  const title =
    booking.sessionType === 'discovery'
      ? `Still Waters Discovery Call — ${booking.parentName} (Teen: ${booking.teenName})`
      : `Still Waters Counselling — ${booking.teenName} (Age ${booking.teenAge})`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startLocalCompact}/${endLocalCompact}`,
    ctz: booking.timezone,
    location: 'Online (Zoom / Google Meet)',
    details: buildBookingSummaryText(booking),
    add: COUNSELLOR_EMAIL,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildMailtoFallbackUrl(booking: BookingPayload): string {
  const sessionLabel = formatSessionPlanLabel(booking.sessionType, booking.currency);
  const subject = encodeURIComponent(
    `[Still Waters Booking] ${sessionLabel} — ${booking.teenName} (${booking.preferredDate})`
  );
  const body = encodeURIComponent(buildBookingSummaryText(booking));
  return `mailto:${COUNSELLOR_EMAIL}?subject=${subject}&body=${body}`;
}
