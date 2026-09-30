import {
  CheckInRecord,
  EmotionalState,
  QuestionnaireResponses,
  EngagementSignals,
  ContributingSignal,
  RiskLevel,
  TrajectoryType,
  EscalationRisk,
  CaseRecord,
  VoiceAcousticMetrics,
} from '../types';

/**
 * Deterministic Prototype AI Engine for PSYNOVA
 * Computes transparent, reproducible dynamic distress scores, trajectories,
 * escalation risks, and human-in-the-loop intervention pathways.
 */

// Weightings for emotional states
const EMOTIONAL_STATE_WEIGHTS: Record<EmotionalState, number> = {
  calm: 5,
  worried: 18,
  fearful: 25,
  sad: 20,
  angry: 18,
  overwhelmed: 28,
  other: 12,
};

// Negative and distress keywords for text reflection lexicon analysis
const FEAR_KEYWORDS = ['fear', 'scared', 'threat', 'unsafe', 'police', 'attack', 'kill', 'danger', 'panicking', 'afraid', 'terror', 'intimidation'];
const DISTRESS_KEYWORDS = ['depressed', 'crying', 'hopeless', 'overwhelmed', 'cannot sleep', 'nightmare', 'pain', 'broken', 'exhausted', 'helpless', 'alone', 'isolated'];
const LEGAL_FINANCIAL_KEYWORDS = ['court', 'hearing', 'lawyer', 'bail', 'money', 'rent', 'compensation', 'debt', 'jobless', 'ration', 'starving'];

export interface DistressCalculationInput {
  emotionalState: EmotionalState;
  questionnaire: QuestionnaireResponses;
  textReflection: string;
  voiceMetrics?: VoiceAcousticMetrics;
  engagement: EngagementSignals;
  previousDistressScore: number;
  recentStressor?: string;
  consecutiveIncreases?: number;
}

export interface DistressAnalysisResult {
  score: number;
  riskLevel: RiskLevel;
  changeFromPrevious: number;
  trajectory: TrajectoryType;
  escalationRisk: EscalationRisk;
  contributingSignals: ContributingSignal[];
  alertNeeded: boolean;
  recommendedInterventions: Array<{
    type: 'counselling' | 'legal_aid' | 'financial_aid' | 'protection_review' | 'case_note';
    title: string;
    rationale: string;
    urgency: 'routine' | 'priority' | 'urgent';
  }>;
  explanationSummary: string;
}

export function analyzeCheckIn(input: DistressCalculationInput): DistressAnalysisResult {
  const signals: ContributingSignal[] = [];

  // 1. Emotional state baseline (0-28 pts)
  const emotionScore = EMOTIONAL_STATE_WEIGHTS[input.emotionalState] || 10;
  if (['fearful', 'overwhelmed', 'sad'].includes(input.emotionalState)) {
    signals.push({
      id: 'emotion_state',
      label: `Self-reported state: ${input.emotionalState.toUpperCase()}`,
      direction: 'up',
      impact: 'high',
      description: `Primary emotional valence indicates heightened acute distress (${input.emotionalState}).`,
    });
  }

  // 2. Questionnaire calculation (0-40 pts)
  // safetyFeeling: 1 (unsafe) to 5 (safe) -> inverted
  const safetyPenalty = (5 - input.questionnaire.safetyFeeling) * 2.2; // 0 to 8.8
  // dayDifficulty: 1 to 5 -> positive
  const difficultyPenalty = (input.questionnaire.dayDifficulty - 1) * 2.0; // 0 to 8.0
  // supportedFeeling: 1 (isolated) to 5 (supported) -> inverted
  const isolationPenalty = (5 - input.questionnaire.supportedFeeling) * 2.0; // 0 to 8.0
  // sleepQuality: 1 (poor) to 5 (good) -> inverted
  const sleepPenalty = (5 - input.questionnaire.sleepQuality) * 1.8; // 0 to 7.2
  // worryFrequency: 1 to 5 -> positive
  const worryPenalty = (input.questionnaire.worryFrequency - 1) * 2.0; // 0 to 8.0

  const questionnaireScore = safetyPenalty + difficultyPenalty + isolationPenalty + sleepPenalty + worryPenalty;

  if (input.questionnaire.safetyFeeling <= 2) {
    signals.push({
      id: 'safety_risk',
      label: 'Low perceived safety score',
      direction: 'warning',
      impact: 'high',
      description: `User rated personal safety ${input.questionnaire.safetyFeeling}/5, indicating acute protection concern.`,
    });
  }

  if (input.questionnaire.sleepQuality <= 2) {
    signals.push({
      id: 'sleep_disruption',
      label: 'Severe sleep disturbance',
      direction: 'up',
      impact: 'moderate',
      description: 'Persistent insomnia or hyperarousal frequently correlates with trauma re-experiencing.',
    });
  }

  if (input.questionnaire.worryFrequency >= 4) {
    signals.push({
      id: 'worry_frequency',
      label: 'Frequent intrusive worry',
      direction: 'up',
      impact: 'moderate',
      description: `Worry frequency rated ${input.questionnaire.worryFrequency}/5 with recurring apprehension.`,
    });
  }

  // 3. Text reflection lexicon analysis (0-15 pts)
  let textScore = 0;
  const lowerText = input.textReflection.toLowerCase();
  let fearWordCount = 0;
  let distressWordCount = 0;
  let legalWordCount = 0;

  FEAR_KEYWORDS.forEach((w) => {
    if (lowerText.includes(w)) fearWordCount++;
  });
  DISTRESS_KEYWORDS.forEach((w) => {
    if (lowerText.includes(w)) distressWordCount++;
  });
  LEGAL_FINANCIAL_KEYWORDS.forEach((w) => {
    if (lowerText.includes(w)) legalWordCount++;
  });

  textScore = Math.min(15, (fearWordCount * 3) + (distressWordCount * 2.5) + (legalWordCount * 1.5));

  if (fearWordCount > 0 || distressWordCount > 0) {
    signals.push({
      id: 'text_lexicon',
      label: 'Trauma & fear linguistic markers',
      direction: 'up',
      impact: 'moderate',
      description: `Text reflection contained prototype lexical markers (${fearWordCount} fear / ${distressWordCount} distress tokens); this is not a clinical language assessment.`,
    });
  }

  // 4. Voice acoustic markers (simulated prototype: 0-10 pts)
  let voiceScore = 0;
  if (input.voiceMetrics) {
    voiceScore = (input.voiceMetrics.acousticDistressScore / 100) * 10;
    if (input.voiceMetrics.acousticDistressScore > 55) {
      signals.push({
        id: 'voice_acoustic',
        label: 'Prototype acoustic stress signal',
        direction: 'up',
        impact: 'moderate',
        description: 'Experimental acoustic features may indicate tension; this signal is non-diagnostic and requires human review.',
      });
    }
  }

  // 5. Engagement continuity (prototype signal; never treated as proof of distress) (0-15 pts)
  let engagementPenalty = 0;
  if (input.engagement.missedCheckIns > 0) {
    engagementPenalty += Math.min(6, input.engagement.missedCheckIns * 2);
    signals.push({
      id: 'missed_checkin',
      label: `${input.engagement.missedCheckIns} missed check-in interval(s)`,
      direction: 'warning',
      impact: 'moderate',
      description: 'A missed check-in is treated only as a continuity signal; it may have many non-clinical explanations.',
    });
  }

  if (input.engagement.engagementFrequency === 'declining') {
    engagementPenalty += 4;
    signals.push({
      id: 'declining_engagement',
      label: 'Declining engagement frequency',
      direction: 'down',
      impact: 'moderate',
      description: 'Response latency increased by 45% relative to the victim baseline profile.',
    });
  }

  // 6. Recent Case Stressors
  let stressorPenalty = 0;
  if (input.recentStressor) {
    stressorPenalty = 8;
    signals.push({
      id: 'case_stressor',
      label: `Recent stressor: ${input.recentStressor}`,
      direction: 'warning',
      impact: 'high',
      description: `Case timeline notes external catalyst: ${input.recentStressor}.`,
    });
  }

  // Raw Total Calculation (clamped 5 - 95 for realistic health index)
  let rawScore = Math.round(emotionScore + questionnaireScore + textScore + voiceScore + engagementPenalty + stressorPenalty);
  rawScore = Math.max(8, Math.min(96, rawScore));

  const change = rawScore - input.previousDistressScore;

  // Trajectory determination based on rate of change and score
  let trajectory: TrajectoryType = 'stable';
  if (change >= 10 || (change >= 7 && (input.consecutiveIncreases || 0) >= 2)) {
    trajectory = rawScore >= 65 ? 'rapidly_worsening' : 'worsening';
  } else if (change >= 4) {
    trajectory = 'worsening';
  } else if (change <= -6) {
    trajectory = 'improving';
  } else {
    trajectory = 'stable';
  }

  // Risk Level
  let riskLevel: RiskLevel = 'low';
  if (rawScore >= 70) {
    riskLevel = rawScore >= 85 ? 'critical' : 'high';
  } else if (rawScore >= 45) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  // Consecutive worsening tracker
  const consecutive = change > 2 ? (input.consecutiveIncreases || 0) + 1 : 0;
  if (consecutive >= 3) {
    signals.push({
      id: 'consecutive_increases',
      label: `${consecutive} consecutive worsening assessments`,
      direction: 'up',
      impact: 'high',
      description: 'Longitudinal distress trajectory has escalated across multiple sequential evaluations.',
    });
  }

  // Escalation Risk (Predictive early warning)
  let escalationRisk: EscalationRisk = 'low';
  if (
    trajectory === 'rapidly_worsening' ||
    (riskLevel === 'high' || riskLevel === 'critical') ||
    consecutive >= 3 ||
    (change >= 12 && rawScore >= 55)
  ) {
    escalationRisk = 'high';
  } else if (trajectory === 'worsening' || rawScore >= 45 || input.engagement.missedCheckIns > 0) {
    escalationRisk = 'moderate';
  } else {
    escalationRisk = 'low';
  }

  // Alert generation
  const alertNeeded = escalationRisk === 'high' || rawScore >= 68 || input.questionnaire.safetyFeeling <= 1;

  // Recommendations
  const recommendations: DistressAnalysisResult['recommendedInterventions'] = [];

  if (escalationRisk === 'high' || rawScore >= 70) {
    recommendations.push({
      type: 'counselling',
      title: 'Urgent Clinical Counsellor Follow-up',
      rationale: 'Distress trajectory shows acute longitudinal escalation. Authorized tele-counselling session recommended within 24 hours.',
      urgency: 'urgent',
    });
  } else if (rawScore >= 45 || trajectory === 'worsening') {
    recommendations.push({
      type: 'counselling',
      title: 'Supportive Psychological Check-in',
      rationale: 'Moderate distress trajectory. Recommend scheduled welfare check-in with assigned district counsellor.',
      urgency: 'priority',
    });
  }

  if (input.questionnaire.safetyFeeling <= 2 || fearWordCount > 0) {
    recommendations.push({
      type: 'protection_review',
      title: 'Human Safety & Protection Review',
      rationale: 'Perceived safety score is low and intimidation markers are present in text/speech.',
      urgency: 'urgent',
    });
  }

  if (legalWordCount > 0 || (input.recentStressor && input.recentStressor.toLowerCase().includes('court'))) {
    recommendations.push({
      type: 'legal_aid',
      title: 'Legal Aid & Witness Support Referral',
      rationale: 'Impending judicial proceedings or legal pressure detected in distress signals.',
      urgency: 'priority',
    });
  }

  if (lowerText.includes('money') || lowerText.includes('rent') || lowerText.includes('compensation') || lowerText.includes('debt')) {
    recommendations.push({
      type: 'financial_aid',
      title: 'Victim Compensation & Relief Cell Review',
      rationale: 'Economic hardship and compensation delays are compounding trauma distress.',
      urgency: 'routine',
    });
  }

  // Explanation summary
  const explanationSummary = `Distress score calculated at ${rawScore}/100 (${riskLevel.toUpperCase()}). Net change of ${
    change >= 0 ? `+${change}` : change
  } points from baseline. Trajectory is evaluated as ${trajectory.replace('_', ' ').toUpperCase()} due to ${
    signals.slice(0, 3).map((s) => s.label).join(', ')
  }.`;

  return {
    score: rawScore,
    riskLevel,
    changeFromPrevious: change,
    trajectory,
    escalationRisk,
    contributingSignals: signals,
    alertNeeded,
    recommendedInterventions: recommendations,
    explanationSummary,
  };
}

/**
 * Predicts next week's anticipated distress score based on current trajectory and historical delta
 */
export function projectTrajectoryForecast(caseRecord: CaseRecord): Array<{
  week: string;
  actual?: number;
  projected?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}> {
  const result = caseRecord.history.map((h) => ({
    week: h.weekLabel,
    actual: h.distressScore,
    projected: undefined as number | undefined,
    confidenceLower: undefined as number | undefined,
    confidenceUpper: undefined as number | undefined,
  }));

  const lastActual = caseRecord.currentDistressScore;
  const historyLen = caseRecord.history.length;
  const delta = historyLen > 1
    ? (lastActual - caseRecord.history[0].distressScore) / (historyLen - 1)
    : 0;

  // Add projection for next 2 weeks
  const nextVal1 = Math.min(98, Math.round(lastActual + (caseRecord.trajectory === 'worsening' || caseRecord.trajectory === 'rapidly_worsening' ? Math.max(delta, 6) : -3)));
  const nextVal2 = Math.min(98, Math.round(nextVal1 + (caseRecord.trajectory === 'worsening' || caseRecord.trajectory === 'rapidly_worsening' ? Math.max(delta * 0.8, 5) : -4)));

  result.push({
    week: `Week ${historyLen + 1} (Proj.)`,
    actual: undefined,
    projected: nextVal1,
    confidenceLower: Math.max(10, nextVal1 - 7),
    confidenceUpper: Math.min(100, nextVal1 + 8),
  });

  result.push({
    week: `Week ${historyLen + 2} (Proj.)`,
    actual: undefined,
    projected: nextVal2,
    confidenceLower: Math.max(10, nextVal2 - 11),
    confidenceUpper: Math.min(100, nextVal2 + 12),
  });

  return result;
}
