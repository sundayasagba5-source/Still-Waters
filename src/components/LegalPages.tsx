import { ArrowLeft } from 'lucide-react';
import { PRACTICE_INFO } from '../data/ethicalPack';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
  onBackHome: () => void;
}

export function LegalPage({ mode, onBackHome }: LegalPageProps) {
  const isPrivacy = mode === 'privacy';

  return (
    <div className="min-h-screen bg-[#F5F9FF] text-[#0B2545] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8] hover:text-[#0B2545] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Still Waters Home</span>
        </button>

        <article className="p-6 sm:p-10 rounded-2xl bg-white border border-[#BFDBFE] shadow-sm space-y-6">
          <header className="pb-5 border-b border-[#DCE8F8]">
            <p className="text-xs font-semibold text-[#EA580C]">
              Still Waters · Official Legal Notice
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B2545]">
              {isPrivacy ? 'Privacy Policy & Google Data Notice' : 'Terms of Service'}
            </h1>
            <p className="mt-2 text-xs text-[#486581]">
              Data Controller: {PRACTICE_INFO.founder} · Contact: {PRACTICE_INFO.email} ·
              Effective Date: November 2026
            </p>
          </header>

          {isPrivacy ? (
            <div className="space-y-5 text-sm sm:text-base text-[#243B53] leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  1. Who We Are
                </h2>
                <p>
                  Still Waters is an online counselling, emotional support, psychoeducation,
                  and developmental coaching service for teenagers aged 13–19, operated by{' '}
                  <strong>{PRACTICE_INFO.founder}</strong> in Lagos, Nigeria and serving
                  families worldwide.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  2. Information Collected for Counselling Bookings
                </h2>
                <p>
                  When a parent, legal guardian, or family submits a booking application, we
                  collect: teenager name, age, date of birth, parent/guardian contact details,
                  residential address, emergency contact details, guardian ID verification
                  type and last 4 digits, intake notes, signed consent records, and payment
                  confirmation status.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  3. Purpose &amp; Legal Basis
                </h2>
                <p>
                  Personal data is processed solely to schedule and deliver online counselling
                  sessions, fulfill child safeguarding responsibilities, and meet legal
                  obligations. Our legal basis is explicit parental consent, legitimate
                  safeguarding interest, and legal compliance. We never sell or share personal
                  data for advertising or commercial purposes.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  4. Google Workspace APIs &amp; Limited Use Compliance
                </h2>
                <p>
                  Where authorized counsellor administration uses Google Workspace integration,
                  Still Waters requests access solely to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Google Calendar Events:</strong> To create the requested
                    counselling appointment event and invite{' '}
                    <span className="font-mono text-xs">{PRACTICE_INFO.email}</span>.
                  </li>
                  <li>
                    <strong>Gmail Send:</strong> To transmit the booking confirmation and
                    signed consent summary directly to{' '}
                    <span className="font-mono text-xs">{PRACTICE_INFO.email}</span>.
                  </li>
                </ul>
                <p>
                  Still Waters&apos; use and transfer to any other app of information received
                  from Google APIs adheres to the{' '}
                  <strong>Google API Services User Data Policy</strong>, including the
                  Limited Use requirements. OAuth access tokens are held strictly in memory
                  during the active browser session and are never stored in browser
                  localStorage, sold, or used for advertising.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  5. Your Rights
                </h2>
                <p>
                  Parents, guardians, and clients have the right to request access,
                  correction, deletion, or withdrawal of consent at any time by emailing{' '}
                  <a
                    href={`mailto:${PRACTICE_INFO.email}`}
                    className="text-[#1D4ED8] underline underline-offset-4"
                  >
                    {PRACTICE_INFO.email}
                  </a>
                  .
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-5 text-sm sm:text-base text-[#243B53] leading-relaxed">
              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  1. Scope of Service
                </h2>
                <p>
                  Still Waters provides general online counselling, emotional support,
                  psychoeducation, career clarity, and developmental coaching for adolescents
                  aged 13–19. Still Waters does <strong>not</strong> provide medical
                  diagnosis, psychiatric treatment, or prescriptions, and is not a 24/7
                  emergency crisis service.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  2. Bookings, Fees &amp; Cancellation
                </h2>
                <p>
                  Sessions are 45 minutes via Zoom or Google Meet at ₦20,000 (Nigeria) / $40
                  (International) per single session, or bundled in a 4-session package
                  (₦75,000 / $150) or 6-session package (₦110,000 / $220), following an
                  optional free 20-minute Parent Discovery Call. Verified payment links
                  (Paystack / Flutterwave) or direct payment invoices are sent privately after
                  booking confirmation. A 10-minute grace period applies, and 24-hour notice is
                  required for rescheduling or cancellation.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  3. Parental Consent &amp; Safeguarding
                </h2>
                <p>
                  Mandatory parental consent is required for teenagers under 18. A responsible
                  adult must be present in the home/premises while the teenager attends in a
                  private room with headphones. Confidentiality is strictly protected except
                  where risk of self-harm, harm to others, abuse/neglect, court order, or
                  medical emergency requires protective intervention.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-[#0B2545]">
                  4. Contact
                </h2>
                <p>
                  For questions or support, contact {PRACTICE_INFO.founder} at{' '}
                  <a
                    href={`mailto:${PRACTICE_INFO.email}`}
                    className="text-[#1D4ED8] underline underline-offset-4"
                  >
                    {PRACTICE_INFO.email}
                  </a>{' '}
                  or business line {PRACTICE_INFO.phone}.
                </p>
              </section>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
