export interface EthicalDocument {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  sections: {
    heading: string;
    items: string[];
  }[];
  acknowledgment: string;
}

export interface HelplineItem {
  organization: string;
  scope: string;
  hours: string;
  number: string;
}

export const PRACTICE_INFO = {
  brand: 'Still Waters',
  tagline: 'A safe place to be heard, healed and guided',
  pillars: 'Calm. Clarity. Confidence.',
  motto: 'Listen · Support · Empower',
  founder: 'Sonibare Titilayo Mary',
  qualifications:
    'B.Sc. Psychology (University of Ibadan), M.Sc. HRM (Bells University), Professional Teen Counsellor, Developmental Psychology',
  experienceYears: '16+ Years',
  email: 'titilayomaryfayehun@gmail.com',
  phone: '0805 166 6668',
  phoneHref: '+2348051666668',
  businessHours: 'Mon–Sat · 9:00 AM – 6:00 PM WAT (Non-emergency bookings & enquiries)',
  instagram: '@titilayofayehun',
  location: 'Lagos, Nigeria – Online Worldwide (Home & Abroad)',
  scripture:
    '“He makes me lie down in green pastures, he leads me beside quiet waters, he restores my soul.”',
  scriptureRef: 'Psalm 23:2-3',
  vision:
    'To be a safe haven where teenagers home and abroad find calm in chaos, clarity in confusion, and confidence to become who they are created to be.',
  mission:
    'To provide accessible, culturally-sensitive, and ethically-grounded online counselling and psychoeducation that nurtures the emotional, social and developmental wellbeing of adolescents aged 13–19, while strengthening parent-teen connection.',
  coreValues: [
    {
      name: 'Safety',
      description:
        'A trauma-informed, protected online environment with clear safeguarding boundaries for every adolescent.',
    },
    {
      name: 'Confidentiality',
      description:
        'Private sessions held in strict trust, balanced transparently with legal and child-protection duties.',
    },
    {
      name: 'Compassion',
      description:
        'Warm, non-judgemental listening where every teenager feels genuinely heard, valued, and understood.',
    },
    {
      name: 'Integrity',
      description:
        'Full ethical disclosure, clear professional scope, and transparent parent-counsellor partnership.',
    },
    {
      name: 'Growth',
      description:
        'Practical psychoeducation, emotional resilience, career clarity, and lifelong decision-making skills.',
    },
  ],
  rates: {
    discovery: {
      title: 'Parent Discovery Call',
      duration: '20 mins',
      fee: 'Free',
      description:
        'An introductory consultation for parents/guardians to discuss your teenager’s needs, ask questions, and confirm fit before booking.',
    },
    counselling: {
      title: 'Single Counselling Session',
      duration: '45 mins',
      feeNgn: '₦20,000',
      feeUsd: '$40',
      label: 'Standard Session Rate',
      description:
        'One-on-one confidential online session for teenagers aged 13–19 via Zoom or Google Meet.',
    },
    packages: [
      {
        id: 'package4' as const,
        title: '4-Session Support Package',
        duration: '4 × 45 mins',
        feeNgn: '₦75,000',
        feeUsd: '$150',
        savings: 'Save ₦5,000 / $10',
        description:
          'Ideal for steady emotional support, coping tools, or exam/transition seasons.',
      },
      {
        id: 'package6' as const,
        title: '6-Session Support Package',
        duration: '6 × 45 mins',
        feeNgn: '₦110,000',
        feeUsd: '$220',
        savings: 'Save ₦10,000 / $20',
        description:
          'Comprehensive continuity for deeper resilience, identity, and career clarity.',
      },
    ],
  },
  paymentPolicy: {
    title: 'Verified Payment After Confirmation',
    summary:
      'To protect families against scams and fake payment claims, Still Waters never posts bank account numbers publicly on this website.',
    instruction:
      'Once your booking request is reviewed and your slot is confirmed, a secure Paystack / Flutterwave payment link or verified invoice is sent directly to the parent/guardian email.',
  },
  helplines: [
    {
      organization: 'Nigeria National Emergency Number',
      scope: 'Immediate life-safety, medical, or police emergency across Nigeria',
      hours: '24/7 Toll-Free',
      number: '112',
    },
    {
      organization: 'Lagos State DSVA Helpline',
      scope: 'Domestic & sexual violence, child abuse & urgent protection support',
      hours: '24/7 Toll-Free',
      number: '08000 333 333',
    },
    {
      organization: 'Nigeria Child & Family Support Lines',
      scope: 'Child safeguarding guidance & community crisis referral',
      hours: 'External Support Network (Hours vary by operator)',
      number: '0907 824 4818',
    },
  ] as HelplineItem[],
};

export const SERVICES_LIST = [
  {
    number: '01',
    title: 'Online Counselling',
    audience: 'Ages 13–19 · Zoom or Google Meet',
    description:
      'Confidential 45-minute one-on-one sessions providing a calm, non-judgemental space for teenagers navigating emotional distress, anxiety, family transitions, or personal struggles.',
  },
  {
    number: '02',
    title: 'Emotional Support',
    audience: 'Anxiety · Peer Pressure · Self-Esteem',
    description:
      'Guided support for adolescents dealing with academic stress, social media influence, identity questions, loneliness, or emotional overwhelm at home or in the diaspora.',
  },
  {
    number: '03',
    title: 'Psychoeducation & Guidance',
    audience: 'Adolescent Development · Coping Tools',
    description:
      'Age-appropriate psychological education that helps teenagers understand their emotions, manage stress triggers, communicate respectfully with parents, and build healthy boundaries.',
  },
  {
    number: '04',
    title: 'Career Clarity',
    audience: 'Academic Direction · Strengths Mapping',
    description:
      'Structured reflection to help teens discover their aptitudes, evaluate subject or university choices, and step toward their future with clarity instead of pressure.',
  },
  {
    number: '05',
    title: 'Personal Developmental Coaching',
    audience: 'Resilience · Confidence · Decision-Making',
    description:
      'Goal-oriented developmental coaching rooted in person-centered, solution-focused, and culturally-sensitive guidance so teens thrive—not merely survive adolescence.',
  },
];

export const ETHICAL_PACK_DOCUMENTS: EthicalDocument[] = [
  {
    id: 'disclosure',
    number: '01',
    title: 'Professional Disclosure',
    subtitle: 'Credentials, therapeutic approach & scope of practice',
    summary:
      'Establishes Sonibare Titilayo Mary’s qualifications, 16+ years of teen counselling experience, and clear clinical boundaries.',
    sections: [
      {
        heading: 'Counsellor Profile & Qualifications',
        items: [
          'Full Name: Sonibare Titilayo Mary — Brand: Still Waters (Online Teen Counselling).',
          'Qualifications: B.Sc. Psychology (University of Ibadan), M.Sc. HRM (Bells University), Professional Teen Counsellor, Developmental Psychology.',
          'Experience: Over 16 years productively counselling teenagers home and abroad.',
          'Vision: To be a safe haven where teenagers home and abroad find calm in chaos, clarity in confusion, and confidence to become who they are created to be.',
        ],
      },
      {
        heading: 'Scope of Practice & Therapeutic Approach',
        items: [
          'Scope: General counselling, psychoeducation, guidance, career clarity, and developmental coaching for adolescents aged 13–19.',
          'Strict Clinical Boundary: NO medical diagnosis, NO psychiatric treatment, and NO prescriptions are provided.',
          'Therapeutic Approach: Person-centered, developmental, solution-focused, trauma-informed, culturally sensitive, and Psalm 23 inspired.',
        ],
      },
    ],
    acknowledgment:
      'I have read and understood the Professional Disclosure and scope limitations of Still Waters.',
  },
  {
    id: 'informed-consent',
    number: '02',
    title: 'Informed Consent',
    subtitle: 'Session format, fees, voluntary participation & technology policy',
    summary:
      'Outlines the practical terms of 45-minute online Zoom/Google Meet sessions, package rates, and secure post-confirmation payment.',
    sections: [
      {
        heading: 'Session Structure & Fee Policy',
        items: [
          'Duration & Setting: 45-minute sessions held online via Zoom or Google Meet in a private space.',
          'Recording Policy: Strictly no audio or video recording without explicit written consent from all parties.',
          'Session Fees: Single Session ₦20,000 (Nigeria) / $40 (International); 4-Session Package ₦75,000 / $150; 6-Session Package ₦110,000 / $220.',
          'Secure Payment Process: A verified Paystack/Flutterwave payment link or direct invoice is sent privately to the parent/guardian email only after booking confirmation. Payment confirms the slot.',
          'Free 20-minute Parent Discovery Call is available prior to starting counselling.',
        ],
      },
      {
        heading: 'Voluntary Care & Contingencies',
        items: [
          'Voluntary Participation: Counselling is voluntary and collaborative for both teenager and parent/guardian.',
          'Emergency Service Notice: Still Waters is not a 24/7 crisis or emergency hospital service; in immediate danger, contact local emergency services (e.g., 112 in Nigeria, 999/911 abroad) immediately.',
          'Technical Failure Policy: If internet or platform disruption interrupts a session significantly, the session will be rescheduled at no extra cost.',
        ],
      },
    ],
    acknowledgment:
      'Both teenager and parent/guardian agree to the Informed Consent terms, session fee structure, and voluntary nature of service.',
  },
  {
    id: 'parental-consent',
    number: '03',
    title: 'Parental Consent (Mandatory Under 18)',
    subtitle: 'Legal guardian authorization, emergency contact & ID verification',
    summary:
      'Required for every teenager under age 18, verifying legal guardianship, emergency contacts, and adult presence at home.',
    sections: [
      {
        heading: 'Mandatory Guardian Confirmations',
        items: [
          'I confirm that I am the legal parent or guardian of the teenager (ages 13–19) applying for counselling at Still Waters by Sonibare Titilayo Mary.',
          'I have read and understood the Vision, Professional Disclosure, Confidentiality Limits, Safeguarding Policy, and Data Protection notice.',
          'I understand the limits of confidentiality and agree that an adult must be present in the home/premises (though outside the private room for teen confidentiality) during sessions.',
          'I confirm that all parent contact, address, emergency contact, country/city location, and ID verification (ID Type + Last 4 digits) details provided are accurate.',
        ],
      },
    ],
    acknowledgment:
      'As legal parent/guardian, I grant informed parental consent for my teenager to attend Still Waters online sessions.',
  },
  {
    id: 'confidentiality',
    number: '04',
    title: 'Confidentiality & Limits',
    subtitle: 'What stays private & the five mandatory safety exceptions',
    summary:
      'Protects teen trust while specifying the five life-safety and legal exceptions where disclosure is required.',
    sections: [
      {
        heading: 'Five Mandatory Exceptions to Confidentiality',
        items: [
          '1. Risk of Self-Harm or Suicide.',
          '2. Risk of Serious Harm to Others.',
          '3. Disclosure or Suspicion of Child Abuse, Neglect, or Sexual Abuse.',
          '4. Valid Court Order or Legal Mandate.',
          '5. Immediate Medical Emergency requiring urgent intervention.',
        ],
      },
      {
        heading: 'Disclosure & Referral Procedure',
        items: [
          'Where safe and appropriate, the counsellor will discuss the concern transparently with the teenager first.',
          'The counsellor will contact the parent/guardian immediately unless doing so places the teenager at greater risk.',
          'Urgent referrals may be directed to Nigeria Emergency Services (112), Lagos State DSVA (08000 333 333), Child Support Line (0907 824 4818), or local emergency authorities abroad.',
        ],
      },
    ],
    acknowledgment:
      'Both parent/guardian and teenager understand confidentiality and its five mandatory safeguarding exceptions.',
  },
  {
    id: 'safeguarding',
    number: '05',
    title: 'Safeguarding & Child Protection',
    subtitle: 'Designated Lead, boundary rules & zero-tolerance standards',
    summary:
      'Affirms that the welfare of the child is paramount across all digital communication and session environments.',
    sections: [
      {
        heading: 'Safeguarding Standards & Boundary Rules',
        items: [
          'Designated Safeguarding Lead: Sonibare Titilayo Mary (titilayomaryfayehun@gmail.com · Business Line: 0805 166 6668, Mon–Sat 9 AM – 6 PM WAT).',
          'Paramount Principle: The safety, dignity, and welfare of the child are paramount at all times.',
          'No Private 1:1 Messaging Outside Sessions: All scheduling and communication occur through approved parent-aware channels.',
          'Under-16 Rule: For teenagers under 16, parents/guardians are copied on session communications and scheduling.',
          'Home Presence Rule: No session will proceed if the teenager is completely home alone without a responsible adult nearby.',
          'Zero Tolerance & Boundaries: Zero tolerance for sexual, romantic, or exploitative behaviour; strict professional boundaries and no secret recording.',
        ],
      },
    ],
    acknowledgment:
      'I understand and uphold the Still Waters Safeguarding & Child Protection standards.',
  },
  {
    id: 'agreement',
    number: '06',
    title: 'Online Counselling Agreement',
    subtitle: 'Punctuality, 24-hour notice, environment & conduct rules',
    summary:
      'Sets mutual expectations for attendance, privacy during calls, and safe, respectful conduct.',
    sections: [
      {
        heading: 'Session Conduct & Attendance Rules',
        items: [
          'Punctuality & Grace Period: Punctuality is expected; a 10-minute grace period is allowed before a session is marked missed.',
          'Cancellation Notice: At least 24 hours advance notice is required to reschedule or cancel a confirmed session.',
          'Private Environment: The teenager must join from a quiet, private room wearing headphones to protect confidentiality.',
          'Safety & Sobriety: Strictly no joining while driving or in transit, and strictly no alcohol or non-prescribed drugs before or during sessions.',
          'Respect: Mutual respect and courteous communication are upheld throughout.',
        ],
      },
    ],
    acknowledgment:
      'Teenager and parent/guardian agree to follow the Online Counselling Agreement session rules.',
  },
  {
    id: 'data-protection',
    number: '07',
    title: 'Data Protection & Privacy',
    subtitle: 'Data controller, lawful basis, storage & family rights',
    summary:
      'Explains what intake data is collected, how it is safeguarded, and your rights to access or withdraw consent.',
    sections: [
      {
        heading: 'Data Handling & Legal Basis',
        items: [
          'Data Controller: Sonibare Titilayo Mary — Still Waters.',
          'Data Collected: Teen name, age, DOB, parent contact details, residential address, emergency contact, intake notes, signed consent records, anonymized session notes, and payment records.',
          'Purpose: Providing online counselling, fulfilling safeguarding duties, and meeting legal obligations.',
          'Legal Basis: Explicit parental consent, legitimate safeguarding interest, and legal obligation.',
          'Third-Party Sharing: Personal details are never sold or shared commercially; external referrals occur only with explicit consent or mandatory safeguarding duty.',
        ],
      },
      {
        heading: 'Your Data Rights',
        items: [
          'Right of Access, Correction, Deletion, and Right to Withdraw Consent at any time by emailing titilayomaryfayehun@gmail.com.',
        ],
      },
    ],
    acknowledgment:
      'I consent to the Data Protection & Privacy terms for processing this counselling application.',
  },
];
