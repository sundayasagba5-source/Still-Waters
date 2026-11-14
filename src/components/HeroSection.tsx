import { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { PRACTICE_INFO } from '../data/ethicalPack';

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071A33] via-[#0B2545] to-[#133C6D] text-white">
      {/* Subtle geometric water ripple arcs in light blue & warm amber */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 w-[520px] h-[520px] rounded-full border border-[#38BDF8]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-8 w-[380px] h-[380px] rounded-full border border-[#EA580C]/20"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Primary Proposition & Dominant Focal Carrier */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-[#7DD3FC] tracking-wide mb-4">
                Online Teen Counselling · Ages 13–19 · Lagos &amp; Worldwide
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-white [text-wrap:balance]">
                A safe haven where teenagers find{' '}
                <span className="text-[#38BDF8]">calm</span>,{' '}
                <span className="text-[#FB923C]">clarity</span>, and{' '}
                <span className="text-white underline decoration-[#DC2626] decoration-2 underline-offset-8">
                  confidence
                </span>
                .
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#DBEAFE] max-w-2xl">
                Raising teenagers today brings real pressures—peer influence, academic stress,
                social media, and identity struggles. Still Waters offers confidential,
                culturally-sensitive online counselling for teenagers aged 13–19 in Nigeria and
                across the diaspora.
              </p>

              {/* Scripture anchor without thick left border cliché */}
              <div className="mt-7 p-5 rounded-xl bg-[#0F2F57]/90 border border-[#38BDF8]/25 max-w-2xl">
                <p className="font-display italic text-base sm:text-lg text-[#E0F2FE] leading-relaxed">
                  {PRACTICE_INFO.scripture}
                </p>
                <p className="mt-2 text-xs font-semibold tracking-wide text-[#FB923C]">
                  {PRACTICE_INFO.scriptureRef} · Inspired Care
                </p>
              </div>
            </div>

            {/* Action Block */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Book a Discovery Call or Session</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#safeguarding"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold text-[#E0F2FE] border border-[#38BDF8]/35 hover:bg-[#163D6B] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              >
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span>Ethical &amp; Safeguarding Pack</span>
              </a>
            </div>
          </div>

          {/* Right Column: Founder Portrait Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full rounded-2xl overflow-hidden bg-[#0F2F57] border border-[#38BDF8]/25 flex flex-col">
              <div className="relative flex-1 min-h-[340px] sm:min-h-[400px] bg-[#133C6D]">
                {!imgError ? (
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-14_at_9.03.25_AM_25775510.jpeg"
                    alt="Sonibare Titilayo Mary, Founder and Lead Teen Counsellor at Still Waters"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#133C6D] to-[#0B2545]">
                    <span className="font-display text-3xl text-white">Sonibare Titilayo Mary</span>
                    <span className="mt-2 text-sm text-[#BAE6FD]">
                      Founder &amp; Lead Teen Counsellor
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#071A33] via-[#071A33]/75 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-semibold text-[#FB923C]">
                    Founder &amp; Designated Safeguarding Lead
                  </p>
                  <p className="font-display text-xl font-semibold text-white mt-0.5">
                    {PRACTICE_INFO.founder}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-[#1E4473] bg-[#09203D] space-y-2">
                <p className="text-sm text-[#DBEAFE] leading-relaxed">
                  B.Sc. Psychology (Uni Ibadan) · M.Sc. HRM (Bells) · Developmental Psychology
                </p>
                <p className="text-xs text-[#7DD3FC]">
                  16+ years counselling teenagers productively · Home &amp; Abroad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width bottom strip: 4 clean quantitative & service anchors */}
        <div className="mt-12 pt-8 border-t border-[#1E4473] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-[#7DD3FC]">Experience</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white tabular-nums">
              16+ Years
            </p>
            <p className="mt-0.5 text-xs text-[#BFDBFE]">Counselling teenagers ages 13–19</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#7DD3FC]">Introductory Consultation</p>
            <p className="mt-1 font-display text-2xl font-semibold text-[#FB923C] tabular-nums">
              Free · 20 mins
            </p>
            <p className="mt-0.5 text-xs text-[#BFDBFE]">Parent Discovery Call via Zoom / Meet</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#7DD3FC]">Session &amp; Package Rates</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white tabular-nums">
              ₦20,000 / $40
            </p>
            <p className="mt-0.5 text-xs text-[#BFDBFE]">
              Per 45-min session · 4 &amp; 6 session packages available
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#7DD3FC]">Safe Booking Process</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">
              Direct Confirmation
            </p>
            <p className="mt-0.5 text-xs text-[#BFDBFE]">
              Payment link sent privately after booking confirmation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
