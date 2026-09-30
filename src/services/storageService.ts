import {
  CaseRecord,
  CheckInRecord,
  AlertRecord,
  InterventionRecord,
  TimelineEvent,
  AuditLog,
  DistressAnalysisResult,
  CheckInHistoryItem,
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_ALERTS,
  INITIAL_INTERVENTIONS,
  INITIAL_TIMELINE,
  INITIAL_AUDIT_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  CASES: 'psynova_cases_v2',
  ALERTS: 'psynova_alerts_v2',
  INTERVENTIONS: 'psynova_interventions_v2',
  TIMELINE: 'psynova_timeline_v2',
  AUDIT_LOGS: 'psynova_audit_logs_v2',
  CHECK_INS: 'psynova_checkins_v2',
};

class StorageService {
  private cases: CaseRecord[] = [];
  private alerts: AlertRecord[] = [];
  private interventions: InterventionRecord[] = [];
  private timeline: TimelineEvent[] = [];
  private auditLogs: AuditLog[] = [];
  private checkIns: CheckInRecord[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    try {
      const storedCases = localStorage.getItem(STORAGE_KEYS.CASES);
      this.cases = storedCases ? JSON.parse(storedCases) : JSON.parse(JSON.stringify(INITIAL_CASES));

      const storedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
      this.alerts = storedAlerts ? JSON.parse(storedAlerts) : JSON.parse(JSON.stringify(INITIAL_ALERTS));

      const storedInterventions = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
      this.interventions = storedInterventions ? JSON.parse(storedInterventions) : JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));

      const storedTimeline = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      this.timeline = storedTimeline ? JSON.parse(storedTimeline) : JSON.parse(JSON.stringify(INITIAL_TIMELINE));

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = storedLogs ? JSON.parse(storedLogs) : JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

      const storedCheckIns = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
      this.checkIns = storedCheckIns ? JSON.parse(storedCheckIns) : [];
    } catch {
      this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
      this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
      this.interventions = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));
      this.timeline = JSON.parse(JSON.stringify(INITIAL_TIMELINE));
      this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
      this.checkIns = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(this.cases));
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(this.alerts));
      localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(this.interventions));
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(this.timeline));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(this.checkIns));
    } catch {
      // localStorage may be constrained
    }
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  public resetAllData() {
    this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.interventions = JSON.parse(JSON.stringify(INITIAL_INTERVENTIONS));
    this.timeline = JSON.parse(JSON.stringify(INITIAL_TIMELINE));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.checkIns = [];
    this.saveToStorage();
  }

  // Cases
  public getCases(): CaseRecord[] {
    return [...this.cases];
  }

  public getCaseById(caseId: string): CaseRecord | undefined {
    return this.cases.find((c) => c.caseId === caseId);
  }

  public updateCase(caseOrId: CaseRecord | string, partial?: Partial<CaseRecord>) {
    if (typeof caseOrId === 'string') {
      const target = this.cases.find((c) => c.caseId === caseOrId);
      if (target && partial) {
        Object.assign(target, partial);
        this.saveToStorage();
      }
    } else {
      const idx = this.cases.findIndex((c) => c.caseId === caseOrId.caseId);
      if (idx !== -1) {
        this.cases[idx] = caseOrId;
        this.saveToStorage();
      }
    }
  }

  // Check-ins
  public addCheckIn(record: CheckInRecord, analysis: DistressAnalysisResult) {
    this.checkIns.push(record);

    // Update the corresponding CaseRecord
    const targetCase = this.getCaseById(record.caseId);
    if (targetCase) {
      const prevScore = targetCase.currentDistressScore;
      targetCase.previousDistressScore = prevScore;
      targetCase.currentDistressScore = analysis.score;
      targetCase.riskLevel = analysis.riskLevel;
      targetCase.trajectory = analysis.trajectory;
      targetCase.escalationRisk = analysis.escalationRisk;
      targetCase.lastCheckInAt = record.timestamp;
      targetCase.totalCheckIns += 1;
      targetCase.contributingSignals = analysis.contributingSignals;

      if (analysis.changeFromPrevious > 2) {
        targetCase.consecutiveIncreases += 1;
      } else if (analysis.changeFromPrevious < -3) {
        targetCase.consecutiveIncreases = 0;
      }

      // Add to history
      const newHistoryItem: CheckInHistoryItem = {
        checkInIndex: targetCase.history.length + 1,
        weekLabel: `Week ${targetCase.history.length + 1}`,
        distressScore: analysis.score,
        date: new Date().toISOString().split('T')[0],
        riskLevel: analysis.riskLevel,
        eventNote: `Check-in with state: ${record.emotionalState}`,
      };
      targetCase.history.push(newHistoryItem);

      if (analysis.alertNeeded) {
        targetCase.status = 'escalated';
        // Check if an alert already exists
        const existingAlert = this.alerts.find(
          (a) => a.caseId === record.caseId && a.status === 'open'
        );
        if (!existingAlert) {
          const newAlert: AlertRecord = {
            id: `ALT-${Date.now().toString().slice(-6)}`,
            caseId: record.caseId,
            severity: analysis.riskLevel === 'critical' ? 'critical' : 'high',
            status: 'open',
            reason: `Dynamic distress score surged to ${analysis.score}/100 (${analysis.changeFromPrevious >= 0 ? `+${analysis.changeFromPrevious}` : analysis.changeFromPrevious} change). Trajectory: ${analysis.trajectory.replace('_', ' ')}.`,
            signals: analysis.contributingSignals,
            recommendedAction: analysis.recommendedInterventions[0]?.title || 'Immediate Human Review Required',
            createdAt: new Date().toISOString(),
          };
          this.alerts.unshift(newAlert);
        }
      }

      this.updateCase(targetCase);

      // Add to timeline
      this.addTimelineEvent({
        id: `TL-${Date.now()}`,
        caseId: record.caseId,
        type: 'check_in',
        title: `Victim Check-in (${analysis.score}/100)`,
        description: `Emotional state reported as ${record.emotionalState}. Score changed by ${
          analysis.changeFromPrevious >= 0 ? `+${analysis.changeFromPrevious}` : analysis.changeFromPrevious
        } points.`,
        distressScore: analysis.score,
        timestamp: new Date().toISOString(),
        badge: `Score: ${analysis.score}`,
      });
    }

    this.saveToStorage();
  }

  // Alerts
  public getAlerts(): AlertRecord[] {
    return [...this.alerts];
  }

  public updateAlertStatus(alertId: string, status: AlertRecord['status'], acknowledgedBy?: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (acknowledgedBy) {
        alert.acknowledgedBy = acknowledgedBy;
        alert.acknowledgedAt = new Date().toISOString();
      }
      this.saveToStorage();

      this.addAuditLog({
        id: `LOG-${Date.now()}`,
        actorId: 'authorized-officer',
        actorName: acknowledgedBy || 'Authorized Official',
        actorRole: 'counsellor',
        action: 'UPDATE_ALERT_STATUS',
        targetCaseId: alert.caseId,
        timestamp: new Date().toISOString(),
        details: `Updated alert ${alertId} status to "${status}".`,
      });
    }
  }

  // Interventions
  public getInterventions(): InterventionRecord[] {
    return [...this.interventions];
  }

  public addIntervention(intervention: Omit<InterventionRecord, 'id' | 'createdAt'>) {
    const newRecord: InterventionRecord = {
      ...intervention,
      id: `INT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    this.interventions.unshift(newRecord);

    this.addTimelineEvent({
      id: `TL-${Date.now()}`,
      caseId: intervention.caseId,
      type: 'referral',
      title: intervention.title,
      description: `Support referral created: ${intervention.notes.slice(0, 120)}... (By ${intervention.officerName})`,
      timestamp: new Date().toISOString(),
      badge: intervention.type.replace('_', ' ').toUpperCase(),
    });

    this.addAuditLog({
      id: `LOG-${Date.now()}`,
      actorId: 'authorized-officer',
      actorName: intervention.officerName,
      actorRole: 'counsellor',
      action: 'ADD_INTERVENTION',
      targetCaseId: intervention.caseId,
      timestamp: new Date().toISOString(),
      details: `Created ${intervention.type} intervention for ${intervention.caseId}: ${intervention.title}`,
    });

    this.saveToStorage();
  }

  public updateInterventionStatus(id: string, status: InterventionRecord['status']) {
    const intervention = this.interventions.find((i) => i.id === id);
    if (intervention) {
      intervention.status = status;
      this.saveToStorage();
    }
  }

  // Timeline
  public getTimelineForCase(caseId: string): TimelineEvent[] {
    return this.timeline
      .filter((t) => t.caseId === caseId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public addTimelineEvent(event: TimelineEvent) {
    this.timeline.push(event);
    this.saveToStorage();
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(log: AuditLog) {
    this.auditLogs.unshift(log);
    this.saveToStorage();
  }

  /**
   * Dedicated SIH Judge Demo Step Simulator
   * Allows transitioning Case PSY-1024 through stages:
   * Stage 1: Week 1 Baseline (Score 32, Stable)
   * Stage 2: Week 2 Check-in (Score 38)
   * Stage 3: Case Event (Court summons & intimidation)
   * Stage 4: Week 3 Check-in (Score 47, Worsening)
   * Stage 5: Missed Check-in / Engagement drop
   * Stage 6: Week 4 Check-in (Score 61, High risk)
   * Stage 7: Week 5 Check-in (Score 73, Escalation Alert fired!)
   */
  public setDemoStep(stage: number) {
    // Reset PSY-1024 to specific progressive stages for the judge
    const case1024 = this.getCaseById('PSY-1024');
    if (!case1024) return;

    if (stage === 1) {
      // Baseline 32
      case1024.currentDistressScore = 32;
      case1024.previousDistressScore = 30;
      case1024.riskLevel = 'low';
      case1024.trajectory = 'stable';
      case1024.escalationRisk = 'low';
      case1024.status = 'active';
      case1024.consecutiveIncreases = 0;
      case1024.totalCheckIns = 1;
      case1024.history = [
        { checkInIndex: 1, weekLabel: 'Week 1', distressScore: 32, date: '2026-08-05', riskLevel: 'low', eventNote: 'Initial baseline assessment after FIR registration' },
      ];
      case1024.contributingSignals = [
        { id: 'sig-d1', label: 'Baseline assessment complete', direction: 'down', impact: 'low', description: 'Patient reports mild trauma impact with stable emotional baseline.' },
      ];
      // Remove any open alert for 1024
      this.alerts = this.alerts.filter((a) => a.caseId !== 'PSY-1024');
    } else if (stage === 2) {
      // Week 2 -> 38
      case1024.currentDistressScore = 38;
      case1024.previousDistressScore = 32;
      case1024.riskLevel = 'low';
      case1024.trajectory = 'worsening';
      case1024.escalationRisk = 'low';
      case1024.status = 'active';
      case1024.consecutiveIncreases = 1;
      case1024.totalCheckIns = 2;
      case1024.history = [
        { checkInIndex: 1, weekLabel: 'Week 1', distressScore: 32, date: '2026-08-05', riskLevel: 'low' },
        { checkInIndex: 2, weekLabel: 'Week 2', distressScore: 38, date: '2026-08-12', riskLevel: 'low', eventNote: 'Routine check-in; mild sleep apprehension (+6 pts)' },
      ];
      case1024.contributingSignals = [
        { id: 'sig-d2', label: 'Distress score increased +6 pts', direction: 'up', impact: 'low', description: 'Mild upward shift in somatic sleep tension.' },
      ];
    } else if (stage === 3) {
      // Case Event: Court summons
      case1024.recentStressor = 'Sub-divisional court issued witness testimony summons';
      this.addTimelineEvent({
        id: `TL-SIM-${Date.now()}`,
        caseId: 'PSY-1024',
        type: 'case_event',
        title: 'Judicial Summons Received',
        description: 'Sub-divisional court issued witness testimony summons for mid-September.',
        timestamp: new Date().toISOString(),
        badge: 'External Stressor',
      });
    } else if (stage === 4) {
      // Week 3 -> 47
      case1024.currentDistressScore = 47;
      case1024.previousDistressScore = 38;
      case1024.riskLevel = 'moderate';
      case1024.trajectory = 'worsening';
      case1024.escalationRisk = 'moderate';
      case1024.status = 'monitored';
      case1024.consecutiveIncreases = 2;
      case1024.totalCheckIns = 3;
      case1024.history = [
        { checkInIndex: 1, weekLabel: 'Week 1', distressScore: 32, date: '2026-08-05', riskLevel: 'low' },
        { checkInIndex: 2, weekLabel: 'Week 2', distressScore: 38, date: '2026-08-12', riskLevel: 'low' },
        { checkInIndex: 3, weekLabel: 'Week 3', distressScore: 47, date: '2026-08-19', riskLevel: 'moderate', eventNote: 'Hearing notice delivered; anxiety escalated (+9 pts)' },
      ];
      case1024.contributingSignals = [
        { id: 'sig-d3-1', label: 'Distress increased by +15 pts from baseline', direction: 'up', impact: 'moderate', description: 'Consecutive worsening evaluations.' },
        { id: 'sig-d3-2', label: 'Court-related apprehension', direction: 'warning', impact: 'moderate', description: 'Fear of cross-examination by accused counsel.' },
      ];
    } else if (stage === 5) {
      // Missed check-in penalty / engagement decrease
      case1024.recentStressor = 'Missed scheduled check-in window; family reported nocturnal harassment';
      this.addTimelineEvent({
        id: `TL-SIM-ENG-${Date.now()}`,
        caseId: 'PSY-1024',
        type: 'alert',
        title: 'Check-in Continuity Interrupted',
        description: 'Engagement penalty: Participant failed to complete interval check-in.',
        timestamp: new Date().toISOString(),
        badge: 'Engagement Drop',
      });
    } else if (stage === 6) {
      // Week 4 -> 61
      case1024.currentDistressScore = 61;
      case1024.previousDistressScore = 47;
      case1024.riskLevel = 'moderate';
      case1024.trajectory = 'worsening';
      case1024.escalationRisk = 'high';
      case1024.status = 'monitored';
      case1024.consecutiveIncreases = 3;
      case1024.totalCheckIns = 4;
      case1024.history = [
        { checkInIndex: 1, weekLabel: 'Week 1', distressScore: 32, date: '2026-08-05', riskLevel: 'low' },
        { checkInIndex: 2, weekLabel: 'Week 2', distressScore: 38, date: '2026-08-12', riskLevel: 'low' },
        { checkInIndex: 3, weekLabel: 'Week 3', distressScore: 47, date: '2026-08-19', riskLevel: 'moderate' },
        { checkInIndex: 4, weekLabel: 'Week 4', distressScore: 61, date: '2026-08-28', riskLevel: 'moderate', eventNote: 'Missed check-in; boundary intimidation (+14 pts)' },
      ];
      case1024.contributingSignals = [
        { id: 'sig-d4-1', label: '3 consecutive worsening assessments', direction: 'up', impact: 'high', description: 'Trajectory gradient steepening.' },
        { id: 'sig-d4-2', label: 'Safety rating declined to 2/5', direction: 'warning', impact: 'high', description: 'Increased fear of bodily harm.' },
        { id: 'sig-d4-3', label: 'Engagement reduced', direction: 'down', impact: 'moderate', description: 'Avoidance patterns evident in check-in timing.' },
      ];
    } else if (stage === 7) {
      // Week 5 -> 73 (Final Flagged Alert Stage)
      case1024.currentDistressScore = 73;
      case1024.previousDistressScore = 61;
      case1024.riskLevel = 'high';
      case1024.trajectory = 'rapidly_worsening';
      case1024.escalationRisk = 'high';
      case1024.status = 'escalated';
      case1024.consecutiveIncreases = 4;
      case1024.totalCheckIns = 5;
      case1024.history = [
        { checkInIndex: 1, weekLabel: 'Week 1', distressScore: 32, date: '2026-08-05', riskLevel: 'low' },
        { checkInIndex: 2, weekLabel: 'Week 2', distressScore: 38, date: '2026-08-12', riskLevel: 'low' },
        { checkInIndex: 3, weekLabel: 'Week 3', distressScore: 47, date: '2026-08-19', riskLevel: 'moderate' },
        { checkInIndex: 4, weekLabel: 'Week 4', distressScore: 61, date: '2026-08-28', riskLevel: 'moderate' },
        { checkInIndex: 5, weekLabel: 'Week 5', distressScore: 73, date: '2026-09-06', riskLevel: 'high', eventNote: 'Severe sleep disruption; acoustic tension high (+12 pts)' },
      ];
      case1024.contributingSignals = [
        { id: 'sig-d5-1', label: 'Distress increased +41 points across five assessments', direction: 'up', impact: 'high', description: 'Trajectory indicates escalating psychological crisis.' },
        { id: 'sig-d5-2', label: 'Fear-related responses increased', direction: 'up', impact: 'high', description: 'Perceived safety score collapsed to 1/5.' },
        { id: 'sig-d5-3', label: 'Acoustic vocal jitter and pitch tremor', direction: 'up', impact: 'moderate', description: 'Simulated voice analysis detected elevated physiological agitation.' },
        { id: 'sig-d5-4', label: 'Four consecutive worsening cycles', direction: 'warning', impact: 'high', description: 'Criteria for Early Warning Trigger fulfilled.' },
      ];

      // Ensure active alert exists
      const existing = this.alerts.find((a) => a.caseId === 'PSY-1024' && a.status === 'open');
      if (!existing) {
        this.alerts.unshift({
          id: `ALT-1024-${Date.now().toString().slice(-4)}`,
          caseId: 'PSY-1024',
          severity: 'high',
          status: 'open',
          reason: 'EARLY WARNING ALERT: Case PSY-1024 shows a rapidly worsening distress trajectory (32 → 38 → 47 → 61 → 73). Four consecutive worsening cycles accompanied by safety rating collapse.',
          signals: case1024.contributingSignals,
          recommendedAction: 'Urgent human professional review: Schedule clinical tele-counselling & coordinate protection review.',
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.updateCase(case1024);
    this.saveToStorage();
  }
}

export const storageService = new StorageService();
