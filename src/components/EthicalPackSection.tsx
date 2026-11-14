import { useState } from 'react';
import { PhoneCall, ShieldAlert } from 'lucide-react';
import { ETHICAL_PACK_DOCUMENTS, PRACTICE_INFO } from '../data/ethicalPack';

export function EthicalPackSection() {
  const [activeDocId, setActiveDocId] = useState(ETHICAL_PACK_DOCUMENTS[0].id);
  const activeDoc =
    ETHICAL_PACK_DOCUMENTS.find((d) => d.id === activeDocId) ?? ETHICAL_PACK_DOCUMENTS[0];

  return (
    <section id="safeguarding" className="py-18 bg-white border-b border-[#DCE8F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#DC2626]">
            Ethical, Legal &amp; Safeguarding Pack
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B2545] [text-wrap:balance]">
            Transparent protection for every teenager and parent.
          </h2>
          <p className="mt-3 text-base text-[#334E68] leading-relaxed">
            Every Still Waters family reviews and signs off on these seven safeguarding,
            consent, confidentiality, and data-protection standards before online sessions
            begin.
          </p>
        </div>

        {/* Interactive Document Selector & Reader */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Document List Tabs */}
          <div
            role="tablist"
            aria-label="Ethical and Safeguarding Documents"
            className="lg:col-span-4 flex flex-col gap-2"
          >
            {ETHICAL_PACK_DOCUMENTS.map((doc) => {
              const isActive = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex items-baseline gap-3 ${
                    isActive
                      ? 'bg-[#0B2545] text-white border-[#0B2545]'
                      : 'bg-[#F8FBFF] text-[#0B2545] border-[#DCE8F8] hover:bg-[#E0F2FE] hover:border-[#93C5FD]'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${
                      isActive ? 'text-[#FB923C]' : 'text-[#0284C7]'
                    }`}
                  >
                    {doc.number}
                  </span>
                  <span className="text-sm font-semibold leading-snug">{doc.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Document Reader */}
          <div
            role="tabpanel"
            className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#F5F9FF] border border-[#BFDBFE]"
          >
            <div className="pb-5 border-b border-[#CFE2F7]">
              <p className="text-xs font-semibold text-[#1D4ED8]">
                Document {activeDoc.number} of 07 · {activeDoc.subtitle}
              </p>
              <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-[#0B2545]">
                {activeDoc.title}
              </h3>
              <p className="mt-2 text-sm text-[#334E68] leading-relaxed">
                {activeDoc.summary}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              {activeDoc.sections.map((section) => (
                <div key={section.heading}>
                  <h4 className="text-sm font-semibold text-[#0B2545] mb-3">
                    {section.heading}
                  </h4>
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-[#243B53] leading-relaxed flex items-start gap-2.5"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#CFE2F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs font-medium text-[#1E3A5F]">
                {activeDoc.acknowledgment}
              </p>
              <a
                href="#booking"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0"
              >
                Sign in Booking Form
              </a>
            </div>
          </div>
        </div>

        {/* Crisis & Child Helpline Strip */}
        <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-5">
          <div className="flex items-start gap-3.5">
            <ShieldAlert className="w-6 h-6 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#7F1D1D]">
                Emergency &amp; Child Safeguarding Helplines (Immediate Danger Only)
              </h3>
              <p className="mt-1 text-sm text-[#991B1B] leading-relaxed">
                Still Waters is an appointment-based online counselling service and is{' '}
                <strong>not a 24/7 emergency or crisis response centre</strong>. If a teenager
                is in immediate danger of self-harm, abuse, or medical emergency, please contact
                official emergency services below (or dial your local emergency number abroad,
                such as 999 or 911):
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRACTICE_INFO.helplines.map((line) => (
              <a
                key={`${line.organization}-${line.number}`}
                href={`tel:${line.number.replace(/\s+/g, '')}`}
                className="p-4 rounded-xl bg-white border border-[#FCA5A5] hover:bg-[#FFF5F5] transition-colors flex flex-col justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-semibold text-[#B91C1C]">
                    {line.organization}
                  </p>
                  <p className="mt-1 text-xs text-[#7F1D1D] leading-relaxed">
                    {line.scope}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#FEE2E2] flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-mono font-bold text-[#991B1B] tabular-nums">
                    <PhoneCall className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>{line.number}</span>
                  </span>
                  <span className="text-[11px] font-medium text-[#B91C1C]">
                    {line.hours}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7F1D1D]">
            <span>
              <strong>Non-Emergency Still Waters Enquiries &amp; Bookings:</strong> Call or
              WhatsApp our business line ({PRACTICE_INFO.businessHours}).
            </span>
            <a
              href={`tel:${PRACTICE_INFO.phoneHref}`}
              className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#0B2545] hover:text-[#1D4ED8] underline underline-offset-4 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{PRACTICE_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
