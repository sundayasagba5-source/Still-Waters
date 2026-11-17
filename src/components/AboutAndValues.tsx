import { PRACTICE_INFO } from '../data/ethicalPack';

export function AboutAndValues() {
  return (
    <section id="about" className="py-18 bg-white border-b border-[#DCE8F8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Vision & Mission Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#0284C7]">
              Why Still Waters Exist
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B2545] leading-tight [text-wrap:balance]">
              Give your teenager the opportunity to thrive, not just survive adolescence.
            </h2>
            <p className="mt-4 text-base text-[#334E68] leading-relaxed">
              Sometimes your teenager needs more than parental advice alone—they need an
              independent, supportive, non-judgemental space to express themselves, navigate
              challenges, and discover their potential.
            </p>
            <p className="mt-3 text-base text-[#334E68] leading-relaxed">
              Seeking support is not a sign that something is wrong; it is a proactive investment
              in your child’s emotional wellbeing, self-awareness, and personal growth.
            </p>

            {/* Clear Scope Disclaimer */}
            <div className="mt-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
              <p className="text-xs font-semibold text-[#B91C1C]">
                Professional Scope Notice
              </p>
              <p className="mt-1 text-sm text-[#7F1D1D] leading-relaxed">
                Still Waters provides general counselling, psychoeducation, guidance, career
                clarity, and developmental coaching for ages 13–19. We do{' '}
                <strong className="font-semibold">not</strong> provide medical diagnosis,
                psychiatric treatment, or prescriptions.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#F0F7FF] border border-[#BFDBFE]">
                <p className="text-xs font-semibold text-[#1D4ED8]">Our Vision</p>
                <p className="mt-2.5 text-base text-[#0B2545] leading-relaxed">
                  {PRACTICE_INFO.vision}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[#0B2545] text-white border border-[#1E3A5F]">
                <p className="text-xs font-semibold text-[#FB923C]">Our Mission</p>
                <p className="mt-2.5 text-base text-[#E0F2FE] leading-relaxed">
                  {PRACTICE_INFO.mission}
                </p>
              </div>
            </div>

            {/* Five Core Values */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F8]">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[#DCE8F8]">
                <h3 className="font-display text-xl font-semibold text-[#0B2545]">
                  Core Values
                </h3>
                <span className="text-xs font-medium text-[#0284C7]">
                  {PRACTICE_INFO.motto}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PRACTICE_INFO.coreValues.map((val, idx) => (
                  <div key={val.name}>
                    <p className="text-sm font-semibold text-[#0B2545]">
                      <span className="font-mono text-xs text-[#EA580C] mr-1.5 tabular-nums">
                        0{idx + 1}.
                      </span>
                      {val.name}
                    </p>
                    <p className="mt-1 text-sm text-[#486581] leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
