import { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle2, ExternalLink, Loader2, Lock, RefreshCw, X } from 'lucide-react';
import {
  COUNSELLOR_EMAIL,
  StoredBooking,
  createCalendarBookingEvent,
  getAccessToken,
  googleSignIn,
  sendBookingEmailNotification,
} from '../lib/googleWorkspace';

interface CounsellorSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CounsellorSyncModal({ isOpen, onClose }: CounsellorSyncModalProps) {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerEmail, setViewerEmail] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<StoredBooking | null>(null);

  const loadBookings = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Could not load booking applications.');
      }
      setBookings(data.bookings || []);
      setViewerEmail(data.viewerEmail || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const token = getAccessToken();
    if (token) {
      loadBookings(token);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignInAndLoad = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user, accessToken } = await googleSignIn();
      setViewerEmail(user.email || null);
      await loadBookings(accessToken);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Google sign-in failed. Ensure your email is listed under Test Users in Google Cloud Console.'
      );
      setLoading(false);
    }
  };

  const handleSyncToGoogle = async (booking: StoredBooking) => {
    const token = getAccessToken();
    if (!token) {
      setError('Please sign in with Google first.');
      setConfirmTarget(null);
      return;
    }

    setSyncingId(booking.id);
    setError(null);
    try {
      const event = await createCalendarBookingEvent(token, booking);
      await sendBookingEmailNotification(token, booking, event.htmlLink);
      await fetch(`/api/bookings/${encodeURIComponent(booking.id)}/sync`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendarLink: event.htmlLink }),
      });
      await loadBookings(token);
      setConfirmTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sync booking.');
      setConfirmTarget(null);
    } finally {
      setSyncingId(null);
    }
  };

  const token = getAccessToken();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="counsellor-workspace-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A33]/75 backdrop-blur-sm"
    >
      <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-white border border-[#BFDBFE] shadow-xl overflow-hidden">
        <div className="p-6 border-b border-[#DCE8F8] bg-[#0B2545] text-white flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#7DD3FC] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Private Counsellor Workspace · Not Visible to Public</span>
            </p>
            <h2
              id="counsellor-workspace-title"
              className="mt-1 font-display text-2xl font-semibold"
            >
              Google Calendar &amp; Application Sync
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close counsellor workspace"
            className="p-1.5 rounded-lg text-[#BAE6FD] hover:bg-[#163A63] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!token ? (
            <div className="p-6 rounded-xl bg-[#F5F9FF] border border-[#BFDBFE] text-center space-y-4">
              <p className="text-sm text-[#334E68] max-w-md mx-auto leading-relaxed">
                Sign in with your approved Google account ({COUNSELLOR_EMAIL} or developer-approved
                test account) to view submitted applications and push them directly to Google
                Calendar.
              </p>
              <button
                type="button"
                onClick={handleSignInAndLoad}
                disabled={loading}
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
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#486581]">
                  Signed in as <strong className="text-[#0B2545]">{viewerEmail}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => loadBookings(token)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B2545] bg-[#E0F2FE] hover:bg-[#BAE6FD] transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loading && bookings.length === 0 ? (
                <div className="py-12 flex items-center justify-center gap-2 text-sm text-[#486581]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading submitted applications...</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#F8FBFF] border border-[#DCE8F8] text-center text-sm text-[#486581]">
                  No submitted booking applications yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-xl bg-[#F8FBFF] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-[#0284C7] tabular-nums">
                          {item.id} · {item.preferredDate} at {item.preferredTime} ({item.timezone})
                        </p>
                        <p className="text-base font-semibold text-[#0B2545]">
                          {item.teenName} (Age {item.teenAge}) — Parent: {item.parentName}
                        </p>
                        <p className="text-xs text-[#486581]">
                          {item.sessionType === 'discovery'
                            ? 'Free 20-min Parent Discovery Call'
                            : `45-min Counselling (${item.currency}) · Ref: ${
                                item.paymentReference || 'Pending'
                              }`}{' '}
                          · {item.parentEmail} · {item.parentPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.syncedToCalendar ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D]">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Synced</span>
                            </span>
                            {item.calendarLink && (
                              <a
                                href={item.calendarLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D4ED8] bg-[#E0F2FE] hover:bg-[#BAE6FD] transition-colors"
                              >
                                <span>Open Event</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmTarget(item)}
                            disabled={syncingId === item.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            <span>Add to Calendar &amp; Notify</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-medium text-[#991B1B]">
              {error}
            </div>
          )}

          {confirmTarget && (
            <div className="p-5 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] space-y-3">
              <p className="text-sm font-semibold text-[#0B2545]">
                Confirm adding {confirmTarget.teenName}&apos;s session ({confirmTarget.preferredDate} at{' '}
                {confirmTarget.preferredTime}) to Google Calendar and sending email to{' '}
                {COUNSELLOR_EMAIL}?
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSyncToGoogle(confirmTarget)}
                  disabled={syncingId === confirmTarget.id}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors"
                >
                  {syncingId === confirmTarget.id ? 'Syncing...' : 'Confirm & Sync'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmTarget(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#334E68] bg-white border border-[#CBD5E1]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
