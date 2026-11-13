import { PRACTICE_INFO } from '../data/ethicalPack';

interface FooterProps {
  onOpenWorkspace?: () => void;
  onNavigateLegal?: (mode: 'privacy' | 'terms') => void;
}

export function Footer({ onOpenWorkspace, onNavigateLegal }: FooterProps) {
  return (
    <footer className="bg-[#071A33] text-[#DBEAFE] border-t border-[#163A63]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-semibold text-white">
              {PRACTICE_INFO.brand}
            </p>
            <p className="mt-2 text-sm text-[#7DD3FC]">
              {PRACTICE_INFO.tagline} · {PRACTICE_INFO.pillars}
            </p>
            <p className="mt-4 text-sm text-[#BFDBFE] leading-relaxed max-w-md">
              Founded by {PRACTICE_INFO.founder}. Online counselling, psychoeducation, career
              clarity, and developmental coaching for teenagers aged 13–19 in Nigeria and
              across the world.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <p className="text-xs font-semibold text-[#FB923C]">Direct Contact</p>
            <p>
              Email:{' '}
              <a
                href={`mailto:${PRACTICE_INFO.email}`}
                className="text-white hover:text-[#38BDF8] underline underline-offset-4"
              >
                {PRACTICE_INFO.email}
              </a>
            </p>
            <p className="tabular-nums">
              Phone / WhatsApp:{' '}
              <a
                href="tel:+2348138066476"
                className="text-white hover:text-[#38BDF8] underline underline-offset-4"
              >
                {PRACTICE_INFO.phone}
              </a>
            </p>
            <p>Instagram: {PRACTICE_INFO.instagram}</p>
            <p className="text-[#93C5FD]">{PRACTICE_INFO.location}</p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="text-xs font-semibold text-[#FB923C]">Payment &amp; Navigation</p>
            <p className="text-white font-medium">
              {PRACTICE_INFO.bankDetails.bankName} ·{' '}
              <span className="font-mono tabular-nums">
                {PRACTICE_INFO.bankDetails.accountNumber}
              </span>
            </p>
            <nav aria-label="Footer links" className="pt-2 flex flex-col gap-2 text-[#BAE6FD]">
              <a href="#about" className="hover:text-white transition-colors">
                Vision &amp; Mission
              </a>
              <a href="#services" className="hover:text-white transition-colors">
                Services &amp; Rates
              </a>
              <a href="#safeguarding" className="hover:text-white transition-colors">
                Safeguarding Pack
              </a>
              <a
                href="/privacy"
                onClick={(e) => {
                  if (onNavigateLegal) {
                    e.preventDefault();
                    onNavigateLegal('privacy');
                  }
                }}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  if (onNavigateLegal) {
                    e.preventDefault();
                    onNavigateLegal('terms');
                  }
                }}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              {onOpenWorkspace && (
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="text-left text-xs text-[#7DD3FC] hover:text-white transition-colors pt-1"
                >
                  Counsellor Calendar Sync
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#163A63] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#93C5FD]">
          <p>
            © {new Date().getFullYear()} Still Waters by {PRACTICE_INFO.founder}. Data
            Controller: {PRACTICE_INFO.founder}.
          </p>
          <p>
            No medical diagnosis, psychiatric treatment, or prescriptions · Ages 13–19 Online
            Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
