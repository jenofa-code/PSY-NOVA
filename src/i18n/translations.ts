import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  subTitle: string;
  tagline: string;
  conceptPipeline: string[];
  nav: {
    home: string;
    victimPortal: string;
    professionalPortal: string;
    cases: string;
    alerts: string;
    analytics: string;
    interventions: string;
    demoMode: string;
    logout: string;
    login: string;
    language: string;
  };
  landing: {
    heroTitle: string;
    heroDesc: string;
    exploreVictim: string;
    exploreProfessional: string;
    launchDemo: string;
    disclaimer: string;
    howItWorks: string;
    keyCapabilities: string;
    cap1Title: string;
    cap1Desc: string;
    cap2Title: string;
    cap2Desc: string;
    cap3Title: string;
    cap3Desc: string;
    cap4Title: string;
    cap4Desc: string;
  };
  victim: {
    welcome: string;
    statusTitle: string;
    nextCheckIn: string;
    previousCheckIn: string;
    startCheckIn: string;
    helplineTitle: string;
    teleManas: string;
    legalAid: string;
    policeEmergency: string;
    privacyCardTitle: string;
    privacyCardDesc: string;
    checkInSteps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
    };
    emotionQuestion: string;
    questions: {
      safety: string;
      safetyLow: string;
      safetyHigh: string;
      difficulty: string;
      difficultyLow: string;
      difficultyHigh: string;
      support: string;
      supportLow: string;
      supportHigh: string;
      sleep: string;
      sleepLow: string;
      sleepHigh: string;
      worry: string;
      worryLow: string;
      worryHigh: string;
    };
    textPrompt: string;
    textPlaceholder: string;
    voicePrompt: string;
    voiceSubtext: string;
    recordVoice: string;
    recording: string;
    stopRecord: string;
    voiceRecorded: string;
    submitCheckIn: string;
    submissionSuccess: string;
  };
  professional: {
    title: string;
    totalCases: string;
    highRisk: string;
    worseningCases: string;
    followUpsDue: string;
    priorityCases: string;
    distressDistribution: string;
    weeklyTrend: string;
    actionRequired: string;
    reviewCase: string;
    scheduleFollowUp: string;
    acknowledgeAlert: string;
    trajectory: string;
    contributingSignals: string;
    escalationRisk: string;
  };
  auth: {
    backHome: string;
    victimTitle: string;
    victimDescription: string;
    participantSpace: string;
    privacyTitle: string;
    privacyDescription: string;
    caseId: string;
    pin: string;
    login: string;
    officialTitle: string;
    officialDescription: string;
    officialAccess: string;
    securityNotice: string;
    securityDescription: string;
    personaLabel: string;
    email: string;
    role: string;
    district: string;
    password: string;
    demo: string;
    authenticate: string;
    switchVictim: string;
    switchOfficial: string;
    authFailed: string;
  };
  emotions: Record<string, string>;
  risks: Record<string, string>;
  trajectories: Record<string, string>;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'PSYNOVA',
    subTitle: 'AI-Powered Dynamic Mental Health Monitoring & Distress Prediction System',
    tagline: 'Don’t wait for the crisis. Detect the trajectory.',
    conceptPipeline: ['Listen', 'Analyze', 'Track', 'Predict', 'Explain', 'Support'],
    nav: {
      home: 'Overview',
      victimPortal: 'Victim Portal',
      professionalPortal: 'Official Portal',
      cases: 'Case Directory',
      alerts: 'Early Alerts',
      analytics: 'SIH Analytics',
      interventions: 'Support Referrals',
      demoMode: 'Judge Demo Mode',
      logout: 'Sign Out',
      login: 'Sign In',
      language: 'Language',
    },
    auth: {
      backHome: 'Back to Home', victimTitle: 'Victim Portal Access',
      victimDescription: 'Log in with your anonymized Participant Case Identifier and secret PIN to record gentle check-ins and access support.',
      participantSpace: 'Participant Confidential Space', privacyTitle: 'Zero-Identity Exposure Guarantee',
      privacyDescription: 'No name, email, phone number, or government ID is collected. Your identity is protected behind your pseudonymous Case Token.',
      caseId: 'Participant Case ID', pin: 'Secret PIN', login: 'Access My Wellness Space',
      officialTitle: 'Professional Portal Login', officialDescription: 'Authorized access for District Mental Health Program, Social Justice Protection Cells, and DLSA officers.',
      officialAccess: 'Official Department Access', securityNotice: 'Statutory Compliance & Audit Notice',
      securityDescription: 'Authorized personnel only. Access to longitudinal participant trajectory data is governed by applicable data-protection and departmental policies. Actions are audit-logged.',
      personaLabel: 'Select Official Persona (or enter custom credentials below):', email: 'Official Department Email', role: 'Official Cadre', district: 'Jurisdiction District', password: 'Security Passphrase / Password', demo: 'Demo', authenticate: 'Authenticate & Access Casework Roster',
      switchVictim: 'Are you a participant? Victim Portal Login →', switchOfficial: 'Are you an official? Official Portal Login →', authFailed: 'Authentication failed. Please check your credentials.'
    },
    landing: {
      heroTitle: 'AI-Powered Dynamic Mental Health Monitoring for Victims of Atrocities',
      heroDesc: 'SIH26094 Prototype. Moving beyond static evaluations to detect longitudinal distress trajectories, alerting authorized welfare officers and clinical counsellors before crises materialize.',
      exploreVictim: 'Victim Portal Demo',
      exploreProfessional: 'Authorized Official Portal',
      launchDemo: 'Launch SIH Judge Simulator (2-Min)',
      disclaimer: 'PSYNOVA is a prototype decision-support tool. It estimates psychological distress risk and detects worsening trajectories; it does NOT clinically diagnose medical disorders. All critical interventions require human professional authorization.',
      howItWorks: 'Core Paradigm: Longitudinal Trajectory vs. Static Snapshot',
      keyCapabilities: 'System Pipeline',
      cap1Title: 'Multi-Modal Check-In',
      cap1Desc: 'Gentle, trauma-informed self-reports, linguistic sentiment, acoustic tension markers, and engagement latency.',
      cap2Title: 'Longitudinal Distress Curve',
      cap2Desc: 'Tracks consecutive shifts (e.g. 32 → 38 → 47 → 61 → 73) across time rather than relying on one-off static surveys.',
      cap3Title: 'Explainable AI Signals',
      cap3Desc: 'Transparent breakdown of contributing signals—identifying safety drops, sleep disruption, or external legal catalysts.',
      cap4Title: 'Human-in-the-Loop Safeguards',
      cap4Desc: 'AI only flags trajectories and recommends support pathways. Authorized officials maintain 100% decision authority.',
    },
    victim: {
      welcome: 'Welcome to your private wellness space',
      statusTitle: 'Your Current Trajectory Status',
      nextCheckIn: 'Next Recommended Check-in',
      previousCheckIn: 'Previous Assessment',
      startCheckIn: 'Start Quick Check-In (3 min)',
      helplineTitle: '24/7 Government Crisis Helplines',
      teleManas: 'Tele-MANAS (Govt of India Mental Health): 14416',
      legalAid: 'National Legal Aid (NALSA): 15100',
      policeEmergency: 'National Emergency Response: 112',
      privacyCardTitle: 'Your Data is Strictly Anonymized',
      privacyCardDesc: 'All communications are protected under zero-knowledge case pseudonyms. Your safety, dignity, and autonomy come first.',
      checkInSteps: {
        step1: 'Emotional Valence',
        step2: 'Self-Report Scales',
        step3: 'Text Reflection',
        step4: 'Voice Check-in',
        step5: 'Analysis & Result',
      },
      emotionQuestion: 'How would you describe your emotional state today?',
      questions: {
        safety: 'How safe do you currently feel?',
        safetyLow: '1 - Extremely Unsafe',
        safetyHigh: '5 - Completely Safe',
        difficulty: 'How difficult has your day been?',
        difficultyLow: '1 - Manageable',
        difficultyHigh: '5 - Overwhelming',
        support: 'How supported do you feel by those around you?',
        supportLow: '1 - Completely Isolated',
        supportHigh: '5 - Deeply Supported',
        sleep: 'How well have you been sleeping lately?',
        sleepLow: '1 - Severe Insomnia',
        sleepHigh: '5 - Restful Sleep',
        worry: 'How often have you been feeling anxious or worried?',
        worryLow: '1 - Rarely',
        worryHigh: '5 - Constant Distress',
      },
      textPrompt: 'Tell us how you have been feeling recently (Optional reflection)',
      textPlaceholder: 'Share whatever is on your mind—thoughts about today, upcoming events, or pressures you are feeling...',
      voicePrompt: 'Voice Reflection (Prototype Feature)',
      voiceSubtext: 'Speak freely for 10-30 seconds. Acoustic rhythm and pitch variation assist in assessing physiological tension without clinical claims.',
      recordVoice: 'Start Voice Reflection',
      recording: 'Listening & analyzing acoustic signals...',
      stopRecord: 'Stop & Save Audio Sample',
      voiceRecorded: 'Voice sample recorded & acoustic markers processed',
      submitCheckIn: 'Submit My Check-In',
      submissionSuccess: 'Your check-in has been securely recorded.',
    },
    professional: {
      title: 'Authorized Official / Counsellor Dashboard',
      totalCases: 'Total Monitored Cases',
      highRisk: 'High-Risk Trajectories',
      worseningCases: 'Worsening Trajectories',
      followUpsDue: 'Pending Human Follow-ups',
      priorityCases: 'Priority Action Required',
      distressDistribution: 'Distress Score Distribution',
      weeklyTrend: 'Cohort Longitudinal Trajectory',
      actionRequired: 'Human Review Recommended',
      reviewCase: 'Open Full Case File',
      scheduleFollowUp: 'Schedule Follow-Up',
      acknowledgeAlert: 'Acknowledge Alert',
      trajectory: 'Distress Trajectory',
      contributingSignals: 'Contributing Signals (Explainable AI)',
      escalationRisk: 'Escalation Risk',
    },
    emotions: {
      calm: 'Calm & Steady',
      worried: 'Worried & Anxious',
      fearful: 'Fearful / Threatened',
      sad: 'Sad & Hopeless',
      angry: 'Angry & Frustrated',
      overwhelmed: 'Overwhelmed',
      other: 'Other Feeling',
    },
    risks: {
      low: 'Low Risk',
      moderate: 'Moderate Risk',
      high: 'High Risk',
      critical: 'Critical Risk',
    },
    trajectories: {
      improving: 'Improving (Downward)',
      stable: 'Stable Baseline',
      worsening: 'Worsening (Upward)',
      rapidly_worsening: 'Rapidly Worsening (Escalating)',
    },
  },
  ta: {
    appName: 'PSYNOVA (சைநோவா)',
    subTitle: 'பாதிக்கப்பட்டோருக்கான AI அடிப்படையிலான மனநல கண்காணிப்பு மற்றும் முன்னறிவிப்பு அமைப்பு',
    tagline: 'நெருக்கடி வரும் வரை காத்திருக்காதீர்கள். மாற்றத்தின் பாதையை கண்டறியுங்கள்.',
    conceptPipeline: ['செவிமடுத்தல்', 'பகுப்பாய்வு', 'கண்காணிப்பு', 'முன்னறிவிப்பு', 'விளக்கம்', 'ஆதரவு'],
    nav: {
      home: 'முகப்பு',
      victimPortal: 'பாதிக்கப்பட்டோர் தளம்',
      professionalPortal: 'அதிகாரிகள் தளம்',
      cases: 'வழக்குகள் பட்டியல்',
      alerts: 'முன்னெச்சரிக்கைகள்',
      analytics: 'பகுப்பாய்வு தரவுகள்',
      interventions: 'ஆதரவு நடவடிக்கைகள்',
      demoMode: 'நடுவர் செயல்விளக்கம்',
      logout: 'வெளியேறு',
      login: 'உள்நுழைவு',
      language: 'மொழி (Language)',
    },
    auth: {
      backHome: 'முகப்புக்குத் திரும்பு', victimTitle: 'பாதிக்கப்பட்டோர் தள உள்நுழைவு',
      victimDescription: 'உங்கள் பெயரில்லா வழக்கு அடையாள எண் மற்றும் ரகசிய PIN மூலம் உள்நுழைந்து பாதுகாப்பான நல்வாழ்வு பதிவுகளைச் செய்யலாம்.',
      participantSpace: 'பங்கேற்பாளர் ரகசிய பகுதி', privacyTitle: 'அடையாள பாதுகாப்பு உறுதி',
      privacyDescription: 'பெயர், மின்னஞ்சல், தொலைபேசி அல்லது அரசு அடையாள எதுவும் சேகரிக்கப்படாது. உங்கள் அடையாளம் ரகசிய வழக்கு குறியீட்டின் பின்னால் பாதுகாக்கப்படுகிறது.',
      caseId: 'பங்கேற்பாளர் வழக்கு ID', pin: 'ரகசிய PIN', login: 'என் நல்வாழ்வு பகுதிக்குள் நுழை',
      officialTitle: 'அதிகாரி தள உள்நுழைவு', officialDescription: 'மாவட்ட மனநல திட்டம், சமூக நீதி பாதுகாப்பு பிரிவுகள் மற்றும் DLSA அதிகாரிகளுக்கான அங்கீகரிக்கப்பட்ட அணுகல்.',
      officialAccess: 'அதிகாரப்பூர்வ துறை அணுகல்', securityNotice: 'சட்ட இணக்கம் மற்றும் தணிக்கை அறிவிப்பு',
      securityDescription: 'அங்கீகரிக்கப்பட்ட பணியாளர்களுக்கு மட்டும். வழக்கு தரவுகளுக்கான அணுகல் பொருந்தும் தரவு பாதுகாப்பு மற்றும் துறை விதிகளுக்கு உட்பட்டது. செயல்கள் தணிக்கைப் பதிவில் சேமிக்கப்படும்.',
      personaLabel: 'அதிகாரி சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்:', email: 'அதிகாரப்பூர்வ துறை மின்னஞ்சல்', role: 'அதிகாரி பதவி', district: 'அதிகார வரம்பு மாவட்டம்', password: 'பாதுகாப்பு கடவுச்சொல்', demo: 'டெமோ', authenticate: 'அங்கீகரித்து வழக்கு பட்டியலைத் திற',
      switchVictim: 'நீங்கள் பங்கேற்பாளரா? பாதிக்கப்பட்டோர் தள உள்நுழைவு →', switchOfficial: 'நீங்கள் அதிகாரியா? அதிகாரி தள உள்நுழைவு →', authFailed: 'அங்கீகாரம் தோல்வியடைந்தது. உங்கள் விவரங்களைச் சரிபார்க்கவும்.'
    },
    landing: {
      heroTitle: 'கொடுமைகளால் பாதிக்கப்பட்டோருக்கான AI மனநல கண்காணிப்பு அமைப்பு',
      heroDesc: 'SIH26094 முன்மாதிரி. ஒருமுறை மட்டுமே செய்யப்படும் மதிப்பீடுகளைத் தாண்டி, மன அழுத்தத்தின் மாற்றப் பாதையைக் கண்டறிந்து அதிகாரிகள் உடனடியாக உதவ உதவுகிறது.',
      exploreVictim: 'பாதிக்கப்பட்டோர் தளம்',
      exploreProfessional: 'அதிகாரிகள் தளம்',
      launchDemo: '2 நிமிட நடுவர் செயல்விளக்கம்',
      disclaimer: 'PSYNOVA ஒரு முன்மாதிரி ஆதரவு கருவியாகும். இது மருத்துவ நோயறிதலை வழங்காது; மன அழுத்தத்தின் போக்கை மட்டுமே மதிப்பிடுகிறது. முடிவுகள் எப்போதும் தகுதிவாய்ந்த நிபுணர்களாலேயே எடுக்கப்பட வேண்டும்.',
      howItWorks: 'முக்கிய கருத்து: காலப்போக்கில் மன அழுத்தம் மாறுவதை கண்டறிதல்',
      keyCapabilities: 'அமைப்பின் படிநிலைகள்',
      cap1Title: 'பல்வகை மதிப்பீடு',
      cap1Desc: 'மனநிலை, உரை உணர்வுகள் மற்றும் குரல் மாறுபாடுகள் மூலம் மென்மையான தகவல் சேகரிப்பு.',
      cap2Title: 'தொடர் கண்காணிப்பு வளைவு',
      cap2Desc: 'வாராந்திர மாற்றங்களைக் கண்காணித்து (எ.கா. 32 → 38 → 47 → 61 → 73) ஆபத்தை முன்கூட்டியே உணர்த்துகிறது.',
      cap3Title: 'விளக்கக்கூடிய AI சமிக்ஞைகள்',
      cap3Desc: 'பாதுகாப்பு குறைவு, தூக்கமின்மை அல்லது சட்ட காரணங்களை வெளிப்படையாக விளக்குகிறது.',
      cap4Title: 'மனித முடிவெடுக்கும் கட்டுப்பாடு',
      cap4Desc: 'AI பரிந்துரைகளை மட்டுமே வழங்கும்; இறுதி முடிவுகளை அங்கீகரிக்கப்பட்ட அதிகாரிகளே எடுப்பர்.',
    },
    victim: {
      welcome: 'உங்கள் பாதுகாப்பான நல்வாழ்வு பகுதிக்கு வரவேற்கிறோம்',
      statusTitle: 'உங்கள் தற்போதைய மனநல நிலை',
      nextCheckIn: 'அடுத்த பரிந்துரைக்கப்பட்ட மதிப்பீடு',
      previousCheckIn: 'முந்தைய மதிப்பீடு',
      startCheckIn: 'பதிவைத் தொடங்குங்கள் (3 நிமிடம்)',
      helplineTitle: '24/7 அரசு அவசர உதவி எண்கள்',
      teleManas: 'Tele-MANAS (அரசு மனநல உதவி): 14416',
      legalAid: 'தேசிய சட்ட உதவி (NALSA): 15100',
      policeEmergency: 'காவல்துறை அவசர உதவி: 112',
      privacyCardTitle: 'உங்கள் தகவல்கள் முழுமையாக பாதுகாக்கப்படுகின்றன',
      privacyCardDesc: 'அனைத்து தகவல்களும் இரகசிய குறியீடுகளின் கீழ் மட்டுமே வைக்கப்படும். உங்கள் பாதுகாப்பு எங்கள் முன்னுரிமை.',
      checkInSteps: {
        step1: 'மனநிலை',
        step2: 'கேள்விகள்',
        step3: 'உரை விளக்கம்',
        step4: 'குரல் பதிவு',
        step5: 'முடிவுகள்',
      },
      emotionQuestion: 'இன்று உங்கள் மனநிலை எவ்வாறு உள்ளது?',
      questions: {
        safety: 'தற்போது நீங்கள் எவ்வளவு பாதுகாப்பாக உணர்கிறீர்கள்?',
        safetyLow: '1 - மிகவும் பாதுகாப்பற்ற நிலை',
        safetyHigh: '5 - முழு பாதுகாப்பு',
        difficulty: 'இன்றைய நாள் உங்களுக்கு எவ்வளவு கடினமாக இருந்தது?',
        difficultyLow: '1 - எளிதானது',
        difficultyHigh: '5 - தாங்க முடியாத சிரமம்',
        support: 'உங்களைச் சுற்றியுள்ளவர்களிடமிருந்து எவ்வளவு ஆதரவு கிடைக்கிறது?',
        supportLow: '1 - தனிமைப்படுத்தப்பட்ட நிலை',
        supportHigh: '5 - முழு ஆதரவு',
        sleep: 'சமீபத்தில் உங்கள் தூக்கம் எவ்வாறு உள்ளது?',
        sleepLow: '1 - கடுமையான தூக்கமின்மை',
        sleepHigh: '5 - அமைதியான தூக்கம்',
        worry: 'எவ்வளவு அடிக்கடி நீங்கள் கவலை அல்லது பயத்தை உணர்கிறீர்கள்?',
        worryLow: '1 - அரிதாக',
        worryHigh: '5 - தொடர் மன உளைச்சல்',
      },
      textPrompt: 'சமீபத்திய உங்கள் உணர்வுகளைப் பகிர்ந்துகொள்ளுங்கள் (விருப்பத்தேர்வு)',
      textPlaceholder: 'உங்கள் எண்ணங்கள், அன்றாட நிகழ்வுகள் அல்லது கவலைகளைப் பற்றி இங்கே எழுதலாம்...',
      voicePrompt: 'குரல் பதிவு (முன்மாதிரி அம்சம்)',
      voiceSubtext: '10-30 நொடிகள் இயல்பாகப் பேசுங்கள். குரல் நடுக்கம் மற்றும் இடைவெளிகளை முன்மாதிரி அமைப்பு பகுப்பாய்வு செய்கிறது.',
      recordVoice: 'குரல் பதிவைத் தொடங்கு',
      recording: 'பதிவாகிறது...',
      stopRecord: 'பதிவை நிறுத்து & சேமி',
      voiceRecorded: 'குரல் பதிவு வெற்றிகரமாகச் சேமிக்கப்பட்டது',
      submitCheckIn: 'பதிவைச் சமர்ப்பிக்கவும்',
      submissionSuccess: 'உங்கள் மனநலப் பதிவு பாதுகாப்பாகப் பெறப்பட்டது.',
    },
    professional: {
      title: 'அங்கீகரிக்கப்பட்ட அதிகாரி / ஆலோசகர் கட்டுப்பாட்டு தளம்',
      totalCases: 'மொத்த வழக்குகள்',
      highRisk: 'அதிக ஆபத்து வழக்குகள்',
      worseningCases: 'மோசமடையும் வழக்குகள்',
      followUpsDue: 'நிலுவையில் உள்ள பின்தொடர்தல்கள்',
      priorityCases: 'முன்னுரிமை வழக்குகள்',
      distressDistribution: 'மன அழுத்த மதிப்பெண் பரவல்',
      weeklyTrend: 'வாராந்திர மாற்றப் பாதை',
      actionRequired: 'மனித மதிப்பாய்வு தேவை',
      reviewCase: 'வழக்கை ஆய்வு செய்க',
      scheduleFollowUp: 'பின்தொடர்தலை திட்டமிடு',
      acknowledgeAlert: 'எச்சரிக்கையை ஏற்றுக்கொள்',
      trajectory: 'மன அழுத்த பாதை',
      contributingSignals: 'பங்களிக்கும் சமிக்ஞைகள் (Explainable AI)',
      escalationRisk: 'தீவிரமாகும் ஆபத்து',
    },
    emotions: {
      calm: 'அமைதி',
      worried: 'கவலை & பதற்றம்',
      fearful: 'பயம் / அச்சுறுத்தல்',
      sad: 'சோகம் & ஏமாற்றம்',
      angry: 'கோபம்',
      overwhelmed: 'தாங்க முடியாத அழுத்தம்',
      other: 'பிற உணர்வுகள்',
    },
    risks: {
      low: 'குறைந்த ஆபத்து',
      moderate: 'மிதமான ஆபத்து',
      high: 'அதிக ஆபத்து',
      critical: 'மிக தீவிர ஆபத்து',
    },
    trajectories: {
      improving: 'குணமடைகிறது',
      stable: 'நிலையானது',
      worsening: 'மோசமடைகிறது',
      rapidly_worsening: 'வேகமாக மோசமடைகிறது',
    },
  },
  hi: {
    appName: 'PSYNOVA (साइनोवा)',
    subTitle: 'उत्पीड़न पीड़ितों के लिए AI-संचालित गतिशील मानसिक स्वास्थ्य निगरानी एवं संकट पूर्वानुमान प्रणाली',
    tagline: 'संकट की प्रतीक्षा न करें। बदलाव के प्रक्षेपवक्र (Trajectory) को पहचानें।',
    conceptPipeline: ['सुनें', 'विश्लेषण', 'ट्रैक', 'पूर्वानुमान', 'व्याख्या', 'सहयोग'],
    nav: {
      home: 'अवलोकन',
      victimPortal: 'पीड़ित पोर्टल',
      professionalPortal: 'अधिकारी पोर्टल',
      cases: 'केस डायरेक्टरी',
      alerts: 'प्रारंभिक चेतावनी',
      analytics: 'SIH एनालिटिक्स',
      interventions: 'सहायता रेफरल',
      demoMode: 'जज डेमो मोड',
      logout: 'लॉग आउट',
      login: 'लॉग इन',
      language: 'भाषा (Language)',
    },
    auth: {
      backHome: 'होम पर वापस जाएँ', victimTitle: 'पीड़ित पोर्टल प्रवेश',
      victimDescription: 'अपने गुमनाम केस पहचानकर्ता और गुप्त PIN से लॉग इन करके सुरक्षित चेक-इन और सहायता सुविधाओं का उपयोग करें।',
      participantSpace: 'प्रतिभागी गोपनीय क्षेत्र', privacyTitle: 'पहचान सुरक्षा गारंटी',
      privacyDescription: 'नाम, ईमेल, फोन या सरकारी पहचान एकत्र नहीं की जाती। आपकी पहचान छद्म केस टोकन के पीछे सुरक्षित रहती है।',
      caseId: 'प्रतिभागी केस ID', pin: 'गुप्त PIN', login: 'मेरे कल्याण क्षेत्र में प्रवेश करें',
      officialTitle: 'अधिकारी पोर्टल लॉगिन', officialDescription: 'जिला मानसिक स्वास्थ्य कार्यक्रम, सामाजिक न्याय सुरक्षा प्रकोष्ठ और DLSA अधिकारियों के लिए अधिकृत प्रवेश।',
      officialAccess: 'आधिकारिक विभागीय प्रवेश', securityNotice: 'वैधानिक अनुपालन और ऑडिट सूचना',
      securityDescription: 'केवल अधिकृत कर्मियों के लिए। केस डेटा तक पहुंच लागू डेटा सुरक्षा और विभागीय नीतियों के अनुसार है। सभी कार्रवाइयाँ ऑडिट लॉग में दर्ज होती हैं।',
      personaLabel: 'अधिकारी प्रोफ़ाइल चुनें (या नीचे विवरण दर्ज करें):', email: 'आधिकारिक विभागीय ईमेल', role: 'अधिकारी पद', district: 'अधिकार क्षेत्र जिला', password: 'सुरक्षा पासफ़्रेज़ / पासवर्ड', demo: 'डेमो', authenticate: 'प्रमाणित करें और केस सूची खोलें',
      switchVictim: 'क्या आप प्रतिभागी हैं? पीड़ित पोर्टल लॉगिन →', switchOfficial: 'क्या आप अधिकारी हैं? अधिकारी पोर्टल लॉगिन →', authFailed: 'प्रमाणीकरण विफल हुआ। कृपया अपनी जानकारी जाँचें।'
    },
    landing: {
      heroTitle: 'अत्याचार पीड़ितों के लिए गतिशील मानसिक स्वास्थ्य निगरानी प्रणाली',
      heroDesc: 'SIH26094 प्रोटोटाइप। पारंपरिक स्थिर जांच से आगे बढ़कर समय के साथ तनाव के बढ़ते प्रक्षेपवक्र को पहचानना और संकट से पहले हस्तक्षेप करना।',
      exploreVictim: 'पीड़ित पोर्टल डेमो',
      exploreProfessional: 'अधिकारी / परामर्शदाता पोर्टल',
      launchDemo: 'SIH जज सिम्युलेटर (2 मिनट)',
      disclaimer: 'PSYNOVA एक प्रोटोटाइप निर्णय-सहायता प्रणाली है। यह किसी बीमारी का चिकित्सीय निदान नहीं करती, बल्कि केवल तनाव के रुझान का अनुमान लगाती है। सभी अंतिम निर्णय योग्य अधिकारियों द्वारा लिए जाते हैं।',
      howItWorks: 'मूल सिद्धांत: स्थिर जांच बनाम समय के साथ बढ़ता तनाव',
      keyCapabilities: 'सिस्टम पाइपलाइन',
      cap1Title: 'मल्टी-मोडल चेक-इन',
      cap1Desc: 'आत्म-रिपोर्ट, पाठ भावना विश्लेषण, आवाज की कंपन और प्रतिक्रिया अंतराल का संवेदनशील संकलन।',
      cap2Title: 'अनुदैर्ध्य तनाव वक्र (Longitudinal Curve)',
      cap2Desc: 'लगातार बढ़ते तनाव (उदा. 32 → 38 → 47 → 61 → 73) की पहचान कर शुरुआती चेतावनी देना।',
      cap3Title: 'व्याख्यात्मक AI संकेत (Explainable AI)',
      cap3Desc: 'सुरक्षा चिंता, नींद में खलल या कानूनी तनाव जैसे कारकों की स्पष्ट व्याख्या।',
      cap4Title: 'मानव-नियंत्रित सुरक्षा चक्र',
      cap4Desc: 'AI केवल सिफारिश करता है; कानूनी, सुरक्षा व पुनर्वास संबंधी अंतिम निर्णय अधिकारियों के हाथों में रहता है।',
    },
    victim: {
      welcome: 'आपके निजी कल्याण केंद्र में आपका स्वागत है',
      statusTitle: 'आपकी वर्तमान मानसिक स्वास्थ्य स्थिति',
      nextCheckIn: 'अगला अनुशंसित चेक-इन',
      previousCheckIn: 'पिछला मूल्यांकन',
      startCheckIn: 'त्वरित चेक-इन शुरू करें (3 मिनट)',
      helplineTitle: '24/7 सरकारी संकट हेल्पलाइन',
      teleManas: 'Tele-MANAS (मानसिक स्वास्थ्य हेल्पलाइन): 14416',
      legalAid: 'राष्ट्रीय कानूनी सहायता (NALSA): 15100',
      policeEmergency: 'आपातकालीन पुलिस सेवा: 112',
      privacyCardTitle: 'आपकी जानकारी पूरी तरह गोपनीय है',
      privacyCardDesc: 'आपकी सुरक्षा और सम्मान सर्वोच्च प्राथमिकता है। सभी जानकारी कूटबद्ध केस आईडी के तहत सुरक्षित रहती है।',
      checkInSteps: {
        step1: 'मनोस्थिति',
        step2: 'प्रश्नावली',
        step3: 'लिखित विचार',
        step4: 'आवाज रिकॉर्डिंग',
        step5: 'परिणाम',
      },
      emotionQuestion: 'आज आप कैसा महसूस कर रहे हैं?',
      questions: {
        safety: 'वर्तमान में आप स्वयं को कितना सुरक्षित महसूस करते हैं?',
        safetyLow: '1 - अत्यंत असुरक्षित',
        safetyHigh: '5 - पूरी तरह सुरक्षित',
        difficulty: 'आज का दिन आपके लिए कितना कठिन रहा?',
        difficultyLow: '1 - सामान्य / आसान',
        difficultyHigh: '5 - अत्यधिक कठिन',
        support: 'आसपास के लोगों से आपको कितना समर्थन महसूस होता है?',
        supportLow: '1 - बिल्कुल अकेला',
        supportHigh: '5 - गहरा सहयोग',
        sleep: 'हाल के दिनों में आपकी नींद कैसी रही है?',
        sleepLow: '1 - अनिद्रा / बेचैनी',
        sleepHigh: '5 - गहरी व आरामदायक',
        worry: 'आप कितनी बार अत्यधिक चिंता या भय महसूस करते हैं?',
        worryLow: '1 - कभी-कभार',
        worryHigh: '5 - निरंतर तनाव',
      },
      textPrompt: 'हाल ही में आप कैसा महसूस कर रहे हैं? (वैकल्पिक विचार साझा करें)',
      textPlaceholder: 'अपने विचार या चिंताएं यहाँ साझा करें...',
      voicePrompt: 'आवाज प्रतिबिंब (प्रोटोटाइप सुविधा)',
      voiceSubtext: '10-30 सेकंड स्वतंत्र रूप से बोलें। आवाज की गति और तनाव स्तर का प्रोटोटाइप विश्लेषण किया जाता है।',
      recordVoice: 'आवाज रिकॉर्ड करना शुरू करें',
      recording: 'रिकॉर्डिंग जारी है...',
      stopRecord: 'रोकें और सहेजें',
      voiceRecorded: 'आवाज का नमूना सुरक्षित रूप से रिकॉर्ड कर लिया गया है',
      submitCheckIn: 'चेक-इन सबमिट करें',
      submissionSuccess: 'आपका चेक-इन सफलतापूर्वक दर्ज कर लिया गया है।',
    },
    professional: {
      title: 'अधिकृत अधिकारी / परामर्शदाता डैशबोर्ड',
      totalCases: 'कुल निगरानीधीन मामले',
      highRisk: 'उच्च जोखिम मामले',
      worseningCases: 'बिगड़ती स्थिति वाले मामले',
      followUpsDue: 'लंबित फॉलो-अप्स',
      priorityCases: 'प्राथमिकता वाले मामले',
      distressDistribution: 'तनाव स्कोर वितरण',
      weeklyTrend: 'साप्ताहिक अनुदैर्ध्य रुझान',
      actionRequired: 'मानवीय समीक्षा आवश्यक',
      reviewCase: 'केस फाइल देखें',
      scheduleFollowUp: 'फॉलो-अप शेड्यूल करें',
      acknowledgeAlert: 'अलर्ट स्वीकार करें',
      trajectory: 'तनाव प्रक्षेपवक्र',
      contributingSignals: 'योगदान देने वाले संकेत (Explainable AI)',
      escalationRisk: 'संकट बढ़ने का जोखिम',
    },
    emotions: {
      calm: 'शांत व स्थिर',
      worried: 'चिंतित व परेशान',
      fearful: 'भयभीत / खतरे में',
      sad: 'उदास व निराश',
      angry: 'क्रोधित',
      overwhelmed: 'अत्यधिक व्याकुल',
      other: 'अन्य भावनाएं',
    },
    risks: {
      low: 'कम जोखिम',
      moderate: 'मध्यम जोखिम',
      high: 'उच्च जोखिम',
      critical: 'गंभीर जोखिम',
    },
    trajectories: {
      improving: 'सुधार की ओर',
      stable: 'स्थिर',
      worsening: 'बिगड़ता हुआ',
      rapidly_worsening: 'तेजी से बिगड़ता हुआ',
    },
  },
};
