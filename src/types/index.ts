export type UserRole = 'victim' | 'counsellor' | 'admin';

export type Language = 'en' | 'ta' | 'hi';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  caseId?: string;
  badge?: string;
  phone?: string;
}

export type EmotionalState =
  | 'calm'
  | 'worried'
  | 'fearful'
  | 'sad'
  | 'angry'
  | 'overwhelmed'
  | 'other';

export interface QuestionnaireResponses {
  safetyFeeling: number; // 1 (extremely unsafe) - 5 (completely safe)
  dayDifficulty: number; // 1 (easy) - 5 (extremely difficult)
  supportedFeeling: number; // 1 (completely isolated) - 5 (deeply supported)
  sleepQuality: number; // 1 (severe insomnia) - 5 (restful sleep)
  worryFrequency: number; // 1 (rarely) - 5 (constant worry/intrusive thoughts)
}

export interface VoiceAcousticMetrics {
  speechRateWpm: number;
  pauseDurationSec: number;
  pitchJitterPercent: number;
  acousticDistressScore: number;
  durationSeconds: number;
}

export interface EngagementSignals {
  responseCompletion: number; // e.g. 100%
  missedCheckIns: number; // e.g. 1
  responseTimeMinutes: number; // e.g. 4.2
  engagementFrequency: 'regular' | 'declining' | 'sporadic' | 'normal';
}

export interface ContributingSignal {
  id: string;
  label: string;
  direction: 'up' | 'down' | 'warning';
  impact: 'high' | 'moderate' | 'low';
  description: string;
}

export type TrajectoryType = 'improving' | 'stable' | 'worsening' | 'rapidly_worsening';
export type TrajectoryStatus = TrajectoryType;
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type EscalationRisk = 'low' | 'moderate' | 'high';

export type { DistressAnalysisResult } from '../services/aiEngine';


export interface CheckInHistoryItem {
  checkInIndex: number;
  weekLabel: string;
  distressScore: number;
  date: string;
  riskLevel: RiskLevel;
  eventNote?: string;
}

export interface CheckInRecord {
  id: string;
  caseId: string;
  userId: string;
  timestamp: string;
  emotionalState: EmotionalState;
  questionnaireResponses: QuestionnaireResponses;
  textResponse: string;
  voiceRecorded: boolean;
  voiceMetrics?: VoiceAcousticMetrics;
  engagementSignals: EngagementSignals;
  distressScore: number;
  riskLevel: RiskLevel;
  changeFromPrevious: number;
  trajectory: TrajectoryType;
  escalationRisk: EscalationRisk;
  contributingSignals: ContributingSignal[];
}

export interface CaseRecord {
  caseId: string;
  victimUid: string;
  victimPseudonym: string;
  district: string;
  state: string;
  incidentType: string;
  registrationDate: string;
  status: 'active' | 'monitored' | 'escalated' | 'resolved';
  currentDistressScore: number;
  previousDistressScore: number;
  riskLevel: RiskLevel;
  trajectory: TrajectoryType;
  escalationRisk: EscalationRisk;
  lastCheckInAt: string;
  followUpDue: string;
  followUpStatus: 'overdue' | 'due_today' | 'scheduled' | 'completed';
  assignedCounsellor: string;
  totalCheckIns: number;
  consecutiveIncreases: number;
  history: CheckInHistoryItem[];
  contributingSignals: ContributingSignal[];
  recentStressor?: string;
}

export interface AlertRecord {
  id: string;
  caseId: string;
  severity: 'moderate' | 'high' | 'critical';
  status: 'open' | 'under_review' | 'acknowledged' | 'resolved' | 'escalated';
  reason: string;
  signals: ContributingSignal[];
  recommendedAction: string;
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface InterventionRecord {
  id: string;
  caseId: string;
  type: 'counselling' | 'tele_counselling' | 'legal_aid' | 'financial_aid' | 'financial_assistance' | 'protection_review' | 'case_note';
  title: string;
  notes: string;
  officerName: string;
  officerRole?: string;
  officerId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  targetDate?: string;
  aiRecommended?: boolean;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: 'complaint' | 'baseline' | 'case_event' | 'check_in' | 'alert' | 'human_review' | 'referral';
  title: string;
  description: string;
  distressScore?: number;
  timestamp: string;
  badge?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetCaseId: string;
  timestamp: string;
  details: string;
}

export interface AggregatedDistrictStat {
  district: string;
  activeCases: number;
  highRiskCases: number;
  worseningCases: number;
  averageDistress: number;
  followUpsDue: number;
}
