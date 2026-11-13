import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  CalendarCheck,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PRACTICE_INFO } from '../data/ethicalPack';
import {
  BookingPayload,
  COUNSELLOR_EMAIL,
  buildGoogleCalendarTemplateUrl,
  buildMailtoFallbackUrl,
  createCalendarBookingEvent,
  getAccessToken,
  googleSignIn,
  initAuth,
  logout,
  sendBookingEmailNotification,
} from '../lib/googleWorkspace';

const TIMEZONES = [
  { value: 'Africa/Lagos', label: 'West Africa Time (WAT · Lagos, UTC+1)' },
  { value: 'Europe/London', label: 'UK Time (GMT/BST · London)' },
  { value: 'America/New_York', label: 'US Eastern (EST/EDT · New York)' },
  { value: 'America/Chicago', label: 'US Central (CST/CDT · Chicago)' },
  { value: 'America/Toronto', label: 'Canada Eastern (EST/EDT · Toronto)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET · Europe)' },
];

const PREFERRED_TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

const FOCUS_AREAS = [
  'Online Counselling (General Emotional Support)',
  'Anxiety, Overwhelm or Academic Stress',
  'Peer Pressure, Identity & Self-Confidence',
  'Psychoeducation & Family Communication',
  'Career Clarity & Future Direction',
  'Personal Developmental Coaching (Ages 13–19)',
];

function getTomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getTodayIso(): string {
  return new Date().toISOString().split('T')[0];
}

export function BookingSection() {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{
    bookingId: string;
    calendarLink: string;
    calendarTemplateLink: string;
    mailtoLink: string;
    autoSyncedViaApi: boolean;
    summaryDate: string;
    summaryTime: string;
    timezone: string;
  } | null>(null);

  const [form, setForm] = useState<BookingPayload>({
    sessionType: 'counselling',
    preferredDate: getTomorrowIso(),
    preferredTime: '16:00',
    timezone: 'Africa/Lagos',
    focusArea: FOCUS_AREAS[0],
    teenName: '',
    teenAge: '15',
    teenDob: '',
    parentName: '',
    relationship: 'Mother',
    parentEmail: '',
    parentPhone: '',
    address: '',
    locationCountry: 'Nigeria',
    locationCity: 'Lagos',
    emergencyName: '',
    emergencyPhone: '',
    idType: 'National ID (NIN)',
    idLastFour: '',
    currency: 'NGN',
    paymentReference: '',
    notes: '',
    teenSignature: '',
    parentSignature: '',
    consentDate: getTodayIso(),
  });

  const [consents, setConsents] = useState({
    disclosureAndScope: false,
    parentalAndConfidentiality: false,
    safeguardingAndAgreement: false,
    dataProtection: false,
  });

  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (signedInUser, token) => {
        setUser(signedInUser);
        setHasToken(Boolean(token));
        setForm((prev) => ({
          ...prev,
          parentEmail: prev.parentEmail || signedInUser.email || '',
        }));
      },
      (signedInUser) => {
        setUser(signedInUser);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setHasToken(Boolean(result.accessToken));
      setForm((prev) => ({
        ...prev,
        parentEmail: prev.parentEmail || result.user.email || '',
      }));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Google verification could not be completed. You can still submit your application below.';
      setAuthError(msg);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setHasToken(false);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(PRACTICE_INFO.bankDetails.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2200);
    } catch {
      // Clipboard not available
    }
  };

  const updateField = <K extends keyof BookingPayload>(key: K, value: BookingPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (formValidationError) setFormValidationError(null);
  };

  const validateForm = (): string | null => {
    if (!form.preferredDate || !form.preferredTime) {
      return 'Please select your preferred date and time.';
    }
    if (!form.teenName.trim()) {
      return 'Please enter the teenager’s full name.';
    }
    const ageNum = Number(form.teenAge);
    if (Number.isNaN(ageNum) || ageNum < 13 || ageNum > 19) {
      return 'Still Waters supports teenagers aged 13–19. Please enter a valid age between 13 and 19.';
    }
    if (!form.teenDob) {
      return 'Please provide the teenager’s date of birth.';
    }
    if (!form.parentName.trim()) {
      return 'Please enter the parent or legal guardian’s full name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.parentEmail.trim())) {
      return 'Please enter a valid parent/guardian email address.';
    }
    if (!form.parentPhone.trim() || form.parentPhone.trim().length < 7) {
      return 'Please enter a valid phone or WhatsApp number.';
    }
    if (!form.address.trim() || !form.locationCountry.trim() || !form.locationCity.trim()) {
      return 'Please complete the residential address, country, and city.';
    }
    if (!form.emergencyName.trim() || !form.emergencyPhone.trim()) {
      return 'Please provide an emergency contact name and phone number.';
    }
    if (!/^\d{4}$/.test(form.idLastFour.trim())) {
      return 'Please enter the last 4 digits of the guardian ID for parental consent verification.';
    }
    if (
      !consents.disclosureAndScope ||
      !consents.parentalAndConfidentiality ||
      !consents.safeguardingAndAgreement ||
      !consents.dataProtection
    ) {
      return 'Please confirm all four Ethical, Legal & Safeguarding Pack checkboxes before submitting.';
    }
    if (!form.teenSignature.trim() || !form.parentSignature.trim()) {
      return 'Both the teenager’s digital signature and the parent/guardian’s digital signature are required.';
    }
    return null;
  };

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const err = validateForm();
    if (err) {
      setFormValidationError(err);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const token = getAccessToken();
    let calendarLink = '';
    let autoSyncedViaApi = false;

    try {
      if (token && hasToken) {
        try {
          const calendarEvent = await createCalendarBookingEvent(token, form);
          calendarLink = calendarEvent.htmlLink;
          await sendBookingEmailNotification(token, form, calendarEvent.htmlLink);
          autoSyncedViaApi = true;
        } catch (workspaceErr) {
          console.warn('Workspace API dispatch partial or skipped:', workspaceErr);
        }
      }

      const saveRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          syncedToCalendar: Boolean(calendarLink),
          calendarLink,
        }),
      });

      const savedData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(savedData?.error || 'Unable to save booking application.');
      }

      setShowConfirmModal(false);
      setBookingResult({
        bookingId: savedData.booking?.id || 'SW-BOOKING',
        calendarLink,
        calendarTemplateLink: buildGoogleCalendarTemplateUrl(form),
        mailtoLink: buildMailtoFallbackUrl(form),
        autoSyncedViaApi,
        summaryDate: form.preferredDate,
        summaryTime: form.preferredTime,
        timezone: form.timezone,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not complete the booking submission. Please try again.';
      setSubmitError(msg);
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCounselling = form.sessionType === 'counselling';
  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#BFD6F2] text-sm text-[#0B2545] placeholder:text-[#7C93B0] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-[#1D4ED8] transition-colors';
  const labelClass = 'block text-xs font-semibold text-[#1E3A5F] mb-1.5';

  return (
    <section id="booking" className="py-18 bg-[#F0F7FF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold text-[#EA580C]">
            Private Booking Application
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B2545] [text-wrap:balance]">
            Apply for a Session
          </h2>
          <p className="mt-3 text-base text-[#334E68] leading-relaxed">
            Your booking details remain completely private. Submit your preferred date,
            intake details, and signed safeguarding consent below—the application is routed
            directly to{' '}
            <span className="font-semibold text-[#0B2545]">{COUNSELLOR_EMAIL}</span> for
            Google Calendar scheduling and confirmation.
          </p>
        </div>

        {bookingResult ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#93C5FD] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-[#15803D]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#15803D] font-mono tabular-nums">
                  Reference: {bookingResult.bookingId}
                </p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
                  Booking Application Submitted
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#334E68] leading-relaxed">
                  Thank you, <strong>{form.parentName}</strong>. Your application for{' '}
                  <strong>{form.teenName}</strong> on{' '}
                  <strong className="tabular-nums">
                    {bookingResult.summaryDate} at {bookingResult.summaryTime}
                  </strong>{' '}
                  ({bookingResult.timezone}) has been recorded.
                </p>

                {bookingResult.autoSyncedViaApi ? (
                  <p className="mt-2 text-sm font-medium text-[#15803D]">
                    Added directly to Google Calendar and emailed to {COUNSELLOR_EMAIL}.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-[#334E68]">
                    Use the buttons below to add this appointment straight to Google Calendar
                    (automatically inviting <strong>{COUNSELLOR_EMAIL}</strong>) and send your
                    confirmation email copy:
                  </p>
                )}

                {isCounselling && (
                  <div className="mt-5 p-4 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-sm text-[#7C2D12]">
                    Payment Reminder: Please transfer{' '}
                    <strong>{form.currency === 'NGN' ? '₦20,000' : '$40'}</strong> to{' '}
                    <strong>GTBank · 0014786146</strong> ({PRACTICE_INFO.bankDetails.accountName}).
                    Payment confirms booking.
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={
                      bookingResult.calendarLink || bookingResult.calendarTemplateLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>
                      {bookingResult.calendarLink
                        ? 'View Google Calendar Event'
                        : 'Add to Google Calendar & Invite Counsellor'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {!bookingResult.autoSyncedViaApi && (
                    <a
                      href={bookingResult.mailtoLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Email to {COUNSELLOR_EMAIL}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setBookingResult(null)}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0B2545] bg-[#E0F2FE] hover:bg-[#BAE6FD] transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleOpenReview}
            className="rounded-2xl bg-white border border-[#BFDBFE] overflow-hidden shadow-sm"
          >
            {/* Section 1: Session Selection & Preferred Date/Time */}
            <div className="p-6 sm:p-8 border-b border-[#DCE8F8]">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h3 className="font-display text-xl font-semibold text-[#0B2545]">
                  01. Session Type &amp; Preferred Time
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0284C7]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private Request</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => updateField('sessionType', 'discovery')}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    form.sessionType === 'discovery'
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-[#F8FBFF] text-[#0B2545] border-[#BFD6F2] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      form.sessionType === 'discovery' ? 'text-[#FB923C]' : 'text-[#0284C7]'
                    }`}
                  >
                    20 Minutes · Free
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    Parent Discovery Call
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      form.sessionType === 'discovery' ? 'text-[#DBEAFE]' : 'text-[#486581]'
                    }`}
                  >
                    Initial consultation to discuss your teen’s needs.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('sessionType', 'counselling')}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    form.sessionType === 'counselling'
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-[#F8FBFF] text-[#0B2545] border-[#BFD6F2] hover:bg-[#E0F2FE]'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold tabular-nums ${
                      form.sessionType === 'counselling' ? 'text-[#FB923C]' : 'text-[#EA580C]'
                    }`}
                  >
                    45 Minutes · ₦20,000 / $40
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    Online Teen Counselling Session
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      form.sessionType === 'counselling' ? 'text-[#DBEAFE]' : 'text-[#486581]'
                    }`}
                  >
                    Confidential 1-on-1 Zoom or Google Meet session.
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="preferredDate" className={labelClass}>
                    Preferred Date
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    min={getTodayIso()}
                    value={form.preferredDate}
                    onChange={(e) => updateField('preferredDate', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="preferredTime" className={labelClass}>
                    Preferred Start Time
                  </label>
                  <select
                    id="preferredTime"
                    value={form.preferredTime}
                    onChange={(e) => updateField('preferredTime', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                  >
                    {PREFERRED_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timezone" className={labelClass}>
                    Your Timezone
                  </label>
                  <select
                    id="timezone"
                    value={form.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className={inputClass}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="focusArea" className={labelClass}>
                  Primary Service / Focus Area
                </label>
                <select
                  id="focusArea"
                  value={form.focusArea}
                  onChange={(e) => updateField('focusArea', e.target.value)}
                  className={inputClass}
                >
                  {FOCUS_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Teenager, Parent/Guardian & Emergency Info */}
            <div className="p-6 sm:p-8 border-b border-[#DCE8F8] bg-[#FAFDFD]">
              <h3 className="font-display text-xl font-semibold text-[#0B2545] mb-5">
                02. Teenager &amp; Parent / Guardian Intake
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label htmlFor="teenName" className={labelClass}>
                    Teenager Full Name
                  </label>
                  <input
                    id="teenName"
                    type="text"
                    placeholder="Full name"
                    value={form.teenName}
                    onChange={(e) => updateField('teenName', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="teenAge" className={labelClass}>
                    Age (13–19)
                  </label>
                  <input
                    id="teenAge"
                    type="number"
                    min={13}
                    max={19}
                    value={form.teenAge}
                    onChange={(e) => updateField('teenAge', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="teenDob" className={labelClass}>
                    Date of Birth
                  </label>
                  <input
                    id="teenDob"
                    type="date"
                    value={form.teenDob}
                    onChange={(e) => updateField('teenDob', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                    required
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="parentName" className={labelClass}>
                    Parent / Legal Guardian Name
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    placeholder="Full name"
                    value={form.parentName}
                    onChange={(e) => updateField('parentName', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="relationship" className={labelClass}>
                    Relationship to Teen
                  </label>
                  <input
                    id="relationship"
                    type="text"
                    placeholder="Mother / Father / Legal Guardian"
                    value={form.relationship}
                    onChange={(e) => updateField('relationship', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="parentPhone" className={labelClass}>
                    Parent Phone / WhatsApp
                  </label>
                  <input
                    id="parentPhone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.parentPhone}
                    onChange={(e) => updateField('parentPhone', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="parentEmail" className={labelClass}>
                    Parent Email Address
                  </label>
                  <input
                    id="parentEmail"
                    type="email"
                    placeholder="parent@example.com"
                    value={form.parentEmail}
                    onChange={(e) => updateField('parentEmail', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="locationCountry" className={labelClass}>
                    Country
                  </label>
                  <input
                    id="locationCountry"
                    type="text"
                    placeholder="Nigeria / UK / USA / Canada"
                    value={form.locationCountry}
                    onChange={(e) => updateField('locationCountry', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="locationCity" className={labelClass}>
                    City
                  </label>
                  <input
                    id="locationCity"
                    type="text"
                    placeholder="Lagos / London / Houston"
                    value={form.locationCity}
                    onChange={(e) => updateField('locationCity', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="address" className={labelClass}>
                  Residential Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Street address for safeguarding & emergency verification"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="mt-5 pt-5 border-t border-[#E2EEF9] grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="emergencyName" className={labelClass}>
                    Emergency Contact Name
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    placeholder="Trusted adult name"
                    value={form.emergencyName}
                    onChange={(e) => updateField('emergencyName', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emergencyPhone" className={labelClass}>
                    Emergency Contact Phone
                  </label>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="Emergency phone"
                    value={form.emergencyPhone}
                    onChange={(e) => updateField('emergencyPhone', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="idType" className={labelClass}>
                    Parent ID Type
                  </label>
                  <select
                    id="idType"
                    value={form.idType}
                    onChange={(e) => updateField('idType', e.target.value)}
                    className={inputClass}
                  >
                    <option value="National ID (NIN)">National ID (NIN)</option>
                    <option value="International Passport">International Passport</option>
                    <option value="Driver's Licence">Driver&apos;s Licence</option>
                    <option value="Voter's Card">Voter&apos;s Card</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="idLastFour" className={labelClass}>
                    ID Last 4 Digits
                  </label>
                  <input
                    id="idLastFour"
                    type="text"
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="1234"
                    value={form.idLastFour}
                    onChange={(e) =>
                      updateField('idLastFour', e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    className={`${inputClass} font-mono tabular-nums`}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="notes" className={labelClass}>
                  Brief Context for the Counsellor (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Share any helpful background or goals for this session."
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Section 3: GTBank Payment & Ethical Consent Sign-Off */}
            <div className="p-6 sm:p-8 border-b border-[#DCE8F8]">
              <h3 className="font-display text-xl font-semibold text-[#0B2545] mb-5">
                03. Payment Details &amp; Safeguarding Consent
              </h3>

              {isCounselling && (
                <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-[#FFF7ED] to-[#FEF2F2] border border-[#FDBA74]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FED7AA]">
                    <div>
                      <p className="text-xs font-semibold text-[#C2410C]">
                        GTBank Payment Account · Payment Confirms Booking
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#0B2545]">
                        GTBank ·{' '}
                        <span className="font-mono tabular-nums">
                          {PRACTICE_INFO.bankDetails.accountNumber}
                        </span>{' '}
                        · {PRACTICE_INFO.bankDetails.accountName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-[#FDBA74] text-[#C2410C] hover:bg-[#FFEDD5] transition-colors self-start sm:self-center shrink-0"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>Account Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy 0014786146</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="currency" className={labelClass}>
                        Session Fee Currency
                      </label>
                      <select
                        id="currency"
                        value={form.currency}
                        onChange={(e) =>
                          updateField('currency', e.target.value as 'NGN' | 'USD')
                        }
                        className={inputClass}
                      >
                        <option value="NGN">₦20,000 (NGN — Nigeria)</option>
                        <option value="USD">$40 (USD — International / Abroad)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="paymentReference" className={labelClass}>
                        Bank Transfer Reference / Sender Name
                      </label>
                      <input
                        id="paymentReference"
                        type="text"
                        placeholder="e.g. Sender name or transfer ref (if paid)"
                        value={form.paymentReference}
                        onChange={(e) => updateField('paymentReference', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Consent Checkboxes */}
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FBFF] border border-[#DCE8F8] cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                  <input
                    type="checkbox"
                    checked={consents.disclosureAndScope}
                    onChange={(e) =>
                      setConsents((p) => ({ ...p, disclosureAndScope: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-[#93C5FD] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                  <span className="text-sm text-[#243B53] leading-relaxed">
                    <strong>Professional Disclosure &amp; Informed Consent:</strong> I have read
                    the disclosure for Sonibare Titilayo Mary, understand sessions are 45 mins
                    (or 20-min free discovery) via Zoom/Google Meet with no recording, and
                    understand Still Waters provides no medical diagnosis, psychiatric treatment,
                    or prescriptions.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FBFF] border border-[#DCE8F8] cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                  <input
                    type="checkbox"
                    checked={consents.parentalAndConfidentiality}
                    onChange={(e) =>
                      setConsents((p) => ({
                        ...p,
                        parentalAndConfidentiality: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 rounded border-[#93C5FD] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                  <span className="text-sm text-[#243B53] leading-relaxed">
                    <strong>Mandatory Parental Consent &amp; Confidentiality Limits:</strong> I
                    confirm I am the legal parent/guardian, an adult will be present at home
                    during sessions, and we understand the 5 confidentiality exceptions
                    (self-harm, harm to others, abuse/neglect, court order, medical emergency).
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FBFF] border border-[#DCE8F8] cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                  <input
                    type="checkbox"
                    checked={consents.safeguardingAndAgreement}
                    onChange={(e) =>
                      setConsents((p) => ({
                        ...p,
                        safeguardingAndAgreement: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 rounded border-[#93C5FD] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                  <span className="text-sm text-[#243B53] leading-relaxed">
                    <strong>Safeguarding &amp; Online Counselling Agreement:</strong> We agree to
                    punctuality (10-minute grace period), 24-hour cancellation notice, private
                    room with headphones, no driving, no alcohol/drugs, and safeguarding rules.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FBFF] border border-[#DCE8F8] cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                  <input
                    type="checkbox"
                    checked={consents.dataProtection}
                    onChange={(e) =>
                      setConsents((p) => ({ ...p, dataProtection: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-[#93C5FD] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                  />
                  <span className="text-sm text-[#243B53] leading-relaxed">
                    <strong>Data Protection &amp; Privacy:</strong> I consent to Still Waters
                    (Data Controller: Sonibare Titilayo Mary) processing this intake and consent
                    record solely for counselling, safeguarding, and legal obligations.
                  </span>
                </label>
              </div>

              {/* Digital Signatures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="teenSignature" className={labelClass}>
                    Teenager Digital Signature (Full Name)
                  </label>
                  <input
                    id="teenSignature"
                    type="text"
                    placeholder="Teen typed full name"
                    value={form.teenSignature}
                    onChange={(e) => updateField('teenSignature', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="parentSignature" className={labelClass}>
                    Parent/Guardian Digital Signature
                  </label>
                  <input
                    id="parentSignature"
                    type="text"
                    placeholder="Parent typed full name"
                    value={form.parentSignature}
                    onChange={(e) => updateField('parentSignature', e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="consentDate" className={labelClass}>
                    Date Signed
                  </label>
                  <input
                    id="consentDate"
                    type="date"
                    value={form.consentDate}
                    onChange={(e) => updateField('consentDate', e.target.value)}
                    className={`${inputClass} tabular-nums`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Optional Google Sign-In & Submit */}
            <div className="p-6 sm:p-8 bg-[#0B2545] text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold text-[#7DD3FC]">
                    04. Submit Application (Optional Instant Google Sync)
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">
                    Route schedule &amp; notification to {COUNSELLOR_EMAIL}
                  </h3>
                  <p className="mt-1.5 text-sm text-[#DBEAFE] leading-relaxed">
                    Submit directly right now—or optionally sign in with Google (for approved
                    accounts) to dispatch automatically via Google Calendar &amp; Gmail.
                  </p>

                  {authError && (
                    <p className="mt-3 text-xs font-medium text-[#FCA5A5]">{authError}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  {!hasToken ? (
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      className="gsi-material-button"
                    >
                      <div className="gsi-material-button-state" />
                      <div className="gsi-material-button-content-wrapper">
                        <div className="gsi-material-button-icon">
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            style={{ display: 'block' }}
                          >
                            <path
                              fill="#EA4335"
                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                              fill="#4285F4"
                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                              fill="#34A853"
                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                            <path fill="none" d="M0 0h48v48H0z" />
                          </svg>
                        </div>
                        <span className="gsi-material-button-contents">
                          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
                        </span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-3.5 py-2 rounded-lg bg-[#163D6B] border border-[#38BDF8]/35 text-xs text-[#E0F2FE] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                        <span>
                          Google Connected: <strong>{user?.email}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-xs font-medium text-[#BAE6FD] hover:text-white underline underline-offset-4"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Review &amp; Submit Booking</span>
                  </button>
                </div>
              </div>

              {(formValidationError || submitError) && (
                <div className="mt-5 p-4 rounded-xl bg-[#7F1D1D] border border-[#FCA5A5]/40 text-sm text-[#FEE2E2]">
                  {formValidationError || submitError}
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-booking-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A33]/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#BFDBFE] shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[#DCE8F8] flex items-start justify-between gap-4 bg-[#F5F9FF]">
              <div>
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  Confirm Booking Submission
                </p>
                <h3
                  id="confirm-booking-title"
                  className="mt-1 font-display text-2xl font-semibold text-[#0B2545]"
                >
                  Ready to Submit Application
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                aria-label="Close confirmation dialog"
                className="p-1.5 rounded-lg text-[#486581] hover:bg-[#DCE8F8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-[#334E68]">
              <p className="leading-relaxed">
                {hasToken
                  ? 'With your confirmation, this application will be saved, added to Google Calendar, and emailed directly via Gmail:'
                  : 'With your confirmation, your booking application will be saved and prepared for Google Calendar invitation and email dispatch:'}
              </p>

              <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#BFDBFE] space-y-2 text-[#0B2545]">
                <p>
                  <strong>Session:</strong>{' '}
                  {form.sessionType === 'discovery'
                    ? '20-minute Parent Discovery Call (Free)'
                    : `45-minute Teen Counselling Session (${
                        form.currency === 'NGN' ? '₦20,000' : '$40'
                      })`}
                </p>
                <p>
                  <strong>Requested Time:</strong>{' '}
                  <span className="tabular-nums">
                    {form.preferredDate} at {form.preferredTime}
                  </span>{' '}
                  ({form.timezone})
                </p>
                <p>
                  <strong>Counsellor Target:</strong> {COUNSELLOR_EMAIL}
                </p>
              </div>

              <p className="text-xs text-[#627D98]">
                Teenager: {form.teenName} (Age {form.teenAge}) · Parent: {form.parentName} (
                {form.parentEmail})
              </p>
            </div>

            <div className="p-6 pt-0 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-[#334E68] bg-[#EEF2F6] hover:bg-[#DCE5EE] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Booking...</span>
                  </>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>Confirm &amp; Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
