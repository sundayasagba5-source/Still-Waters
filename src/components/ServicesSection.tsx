import { useState } from 'react';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { PRACTICE_INFO, SERVICES_LIST } from '../data/ethicalPack';

export function ServicesSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(PRACTICE_INFO.bankDetails.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <section id="services" className="py-18 bg-[#EEF6FF] border-b border-[#CFE2F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold text-[#EA580C]">
              How We Support Adolescents (Ages 13–19)
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B2545] [text-wrap:balance]">
              Personalised Services &amp; Therapeutic Approach
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#334E68] max-w-xl leading-relaxed">
            Person-centered, developmental, solution-focused, trauma-informed, and culturally
            sensitive care designed to build self-awareness, resilience, and healthy family
            communication.
          </p>
        </div>

        {/* Asymmetric Bento Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {SERVICES_LIST.map((service, index) => {
            const isFeatured = index === 0 || index === 4;
            const colSpan =
              index === 0
                ? 'md:col-span-4 bg-[#0B2545] text-white border-[#1E3A5F]'
                : index === 1
                ? 'md:col-span-2 bg-white text-[#0B2545] border-[#BFDBFE]'
                : index === 2
                ? 'md:col-span-2 bg-white text-[#0B2545] border-[#BFDBFE]'
                : index === 3
                ? 'md:col-span-2 bg-[#DBEAFE] text-[#0B2545] border-[#93C5FD]'
                : 'md:col-span-2 bg-[#1E40AF] text-white border-[#1D4ED8]';

            return (
              <div
                key={service.number}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 ${colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        isFeatured ? 'text-[#FB923C]' : 'text-[#EA580C]'
                      }`}
                    >
                      {service.number}
                    </span>
                    <span
                      className={`text-xs ${
                        isFeatured ? 'text-[#BAE6FD]' : 'text-[#486581]'
                      }`}
                    >
                      {service.audience}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold">{service.title}</h3>
                  <p
                    className={`mt-2.5 text-sm leading-relaxed ${
                      isFeatured ? 'text-[#DBEAFE]' : 'text-[#334E68]'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rates & GTBank Payment Band */}
        <div id="rates" className="mt-14 pt-12 border-t border-[#CFE2F7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Free Discovery Call */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#BFDBFE] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#0284C7]">
                  First Step for Parents · {PRACTICE_INFO.rates.discovery.duration}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#0B2545]">
                  {PRACTICE_INFO.rates.discovery.title}
                </h3>
                <p className="mt-3 font-display text-3xl font-semibold text-[#EA580C]">
                  {PRACTICE_INFO.rates.discovery.fee}
                </p>
                <p className="mt-3 text-sm text-[#334E68] leading-relaxed">
                  {PRACTICE_INFO.rates.discovery.description}
                </p>
              </div>
              <a
                href="#booking"
                className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#0B2545] bg-[#E0F2FE] hover:bg-[#BAE6FD] transition-colors whitespace-nowrap"
              >
                <span>Request Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Founding Rate 45-min Session */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0B2545] text-white border border-[#1E3A5F] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#FB923C]">
                  {PRACTICE_INFO.rates.counselling.label} ·{' '}
                  {PRACTICE_INFO.rates.counselling.duration}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                  {PRACTICE_INFO.rates.counselling.title}
                </h3>
                <p className="mt-3 font-display text-3xl font-semibold text-white tabular-nums">
                  {PRACTICE_INFO.rates.counselling.feeNgn}{' '}
                  <span className="text-xl font-normal text-[#7DD3FC]">
                    / {PRACTICE_INFO.rates.counselling.feeUsd}
                  </span>
                </p>
                <p className="mt-3 text-sm text-[#DBEAFE] leading-relaxed">
                  {PRACTICE_INFO.rates.counselling.description}
                </p>
              </div>
              <a
                href="#booking"
                className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] transition-colors whitespace-nowrap"
              >
                <span>Book 45-min Session</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* GTBank Payment Details */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FEF2F2] border border-[#FDBA74] flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#C2410C]">
                  Session Payment Account
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#0B2545]">
                  Bank Transfer Details
                </h3>
                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-[#FED7AA]">
                    <span className="text-[#486581]">Bank</span>
                    <span className="font-semibold text-[#0B2545]">
                      {PRACTICE_INFO.bankDetails.bankName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#FED7AA]">
                    <span className="text-[#486581]">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-[#0B2545] tabular-nums">
                        {PRACTICE_INFO.bankDetails.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        aria-label="Copy GTBank account number"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white border border-[#FDBA74] text-[#C2410C] hover:bg-[#FFEDD5] transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#15803D]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#486581]">Account Name</span>
                    <span className="font-semibold text-[#0B2545]">
                      {PRACTICE_INFO.bankDetails.accountName}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-[#9A3412]">
                {PRACTICE_INFO.bankDetails.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
