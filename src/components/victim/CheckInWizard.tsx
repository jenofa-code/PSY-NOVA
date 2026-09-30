import React, { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  Frown,
  AlertCircle,
  HelpCircle,
  Mic,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Activity,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  EmotionalState,
  QuestionnaireResponses,
  CheckInRecord,
  VoiceAcousticMetrics,
  EngagementSignals,
} from '../../types';
import { analyzeCheckIn, DistressAnalysisResult } from '../../services/aiEngine';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AudioVisualizer } from '../common/AudioVisualizer';
import { CheckInResultModal } from './CheckInResultModal';

interface CheckInWizardProps {
  onBack: () => void;
  onCompleted: () => void;
  onNavigate?: (tab: 'home' | 'checkin' | 'history' | 'support' | 'profile') => void;
}

export const CheckInWizard: React.FC<CheckInWizardProps> = ({ onBack, onCompleted, onNavigate }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const caseId = currentUser?.caseId || 'PSY-1024';
  const existingCase = storageService.getCaseById(caseId);

  // Wizard Step (1: Emotion, 2: Scales, 3: Text, 4: Voice, 5: Review & Submit)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('worried');
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponses>({
    safetyFeeling: 2,
    dayDifficulty: 4,
    supportedFeeling: 2,
    sleepQuality: 2,
    worryFrequency: 4,
  });
  const [textReflection, setTextReflection] = useState<string>(
    'I received a court appearance notice today and felt very panicky. People in the village keep watching our boundary.'
  );
  const [voiceRecorded, setVoiceRecorded] = useState<boolean>(false);
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceAcousticMetrics | undefined>(undefined);

  // Engagement tracking metrics (synthetic & realistic)
  const [startTime] = useState<number>(Date.now());
  const [missedCheckIns, setMissedCheckIns] = useState<number>(1);

  // Result state
  const [analysisResult, setAnalysisResult] = useState<DistressAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const emotionalOptions: Array<{ key: EmotionalState; label: string; icon: string; desc: string }> = [
    { key: 'calm', label: t.emotions.calm, icon: '🌿', desc: 'Grounded, resting, feeling safe' },
    { key: 'worried', label: t.emotions.worried, icon: '⚡', desc: 'Restless, anticipating danger' },
    { key: 'fearful', label: t.emotions.fearful, icon: '🛡️', desc: 'Acute threat or intimidation' },
    { key: 'sad', label: t.emotions.sad, icon: '🌧️', desc: 'Grief, exhausted, downcast' },
    { key: 'angry', label: t.emotions.angry, icon: '🔥', desc: 'Frustrated by injustice or delay' },
    { key: 'overwhelmed', label: t.emotions.overwhelmed, icon: '🌊', desc: 'Sensory and emotional overload' },
    { key: 'other', label: t.emotions.other, icon: '💭', desc: 'Complex mixed emotions' },
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);

    const elapsedMinutes = Math.max(1, Number(((Date.now() - startTime) / 60000).toFixed(1)));

    const engagement: EngagementSignals = {
      responseCompletion: 100,
      missedCheckIns: missedCheckIns,
      responseTimeMinutes: elapsedMinutes,
      engagementFrequency: missedCheckIns > 0 ? 'declining' : 'regular',
    };

    const previousScore = existingCase ? existingCase.currentDistressScore : 47;
    const consecutive = existingCase ? existingCase.consecutiveIncreases : 2;

    const analysis = analyzeCheckIn({
      emotionalState,
      questionnaire,
      textReflection,
      voiceMetrics,
      engagement,
      previousDistressScore: previousScore,
      recentStressor: existingCase?.recentStressor || 'Court Summons Notification',
      consecutiveIncreases: consecutive,
    });

    const checkInRecord: CheckInRecord = {
      id: `CHK-${Date.now().toString().slice(-6)}`,
      caseId,
      userId: currentUser?.uid || 'user-vic-1024',
      timestamp: new Date().toISOString(),
      emotionalState,
      questionnaireResponses: questionnaire,
      textResponse: textReflection,
      voiceRecorded,
      voiceMetrics,
      engagementSignals: engagement,
      distressScore: analysis.score,
      riskLevel: analysis.riskLevel,
      changeFromPrevious: analysis.changeFromPrevious,
      trajectory: analysis.trajectory,
      escalationRisk: analysis.escalationRisk,
      contributingSignals: analysis.contributingSignals,
    };

    storageService.addCheckIn(checkInRecord, analysis);
    setAnalysisResult(analysis);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Progress */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-700 font-semibold">Step {currentStep} of 4</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">Case ID: {caseId}</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { step: 1, label: t.victim.checkInSteps.step1 },
          { step: 2, label: t.victim.checkInSteps.step2 },
          { step: 3, label: t.victim.checkInSteps.step3 },
          { step: 4, label: t.victim.checkInSteps.step4 },
        ].map((s) => (
          <div
            key={s.step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep >= s.step ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-slate-900">
        {/* Step 1: Emotional State */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {t.victim.emotionQuestion}
              </h3>
              <p className="text-xs text-slate-500">
                Select the emotion that best reflects your current internal state.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {emotionalOptions.map((opt) => {
                const isSelected = emotionalState === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setEmotionalState(opt.key)}
                    className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-600 text-slate-900 shadow-xs ring-1 ring-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/60 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm flex items-center justify-between text-slate-900">
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Self-Report 1-5 Questions */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Short Self-Report Questions
              </h3>
              <p className="text-xs text-slate-500">
                Please rate each statement on a gentle 1 to 5 scale.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Safety */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.victim.questions.safety}
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {questionnaire.safetyFeeling} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={questionnaire.safetyFeeling}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, safetyFeeling: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] font-medium mt-1.5">
                  <span className="text-rose-600">{t.victim.questions.safetyLow}</span>
                  <span className="text-emerald-700">{t.victim.questions.safetyHigh}</span>
                </div>
              </div>

              {/* Day Difficulty */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.victim.questions.difficulty}
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {questionnaire.dayDifficulty} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={questionnaire.dayDifficulty}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, dayDifficulty: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] font-medium mt-1.5">
                  <span className="text-emerald-700">{t.victim.questions.difficultyLow}</span>
                  <span className="text-rose-600">{t.victim.questions.difficultyHigh}</span>
                </div>
              </div>

              {/* Supported */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.victim.questions.support}
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {questionnaire.supportedFeeling} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={questionnaire.supportedFeeling}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, supportedFeeling: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] font-medium mt-1.5">
                  <span className="text-rose-600">{t.victim.questions.supportLow}</span>
                  <span className="text-emerald-700">{t.victim.questions.supportHigh}</span>
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.victim.questions.sleep}
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {questionnaire.sleepQuality} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={questionnaire.sleepQuality}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, sleepQuality: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] font-medium mt-1.5">
                  <span className="text-rose-600">{t.victim.questions.sleepLow}</span>
                  <span className="text-emerald-700">{t.victim.questions.sleepHigh}</span>
                </div>
              </div>

              {/* Worry Frequency */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.victim.questions.worry}
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {questionnaire.worryFrequency} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={questionnaire.worryFrequency}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, worryFrequency: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[11px] font-medium mt-1.5">
                  <span className="text-emerald-700">{t.victim.questions.worryLow}</span>
                  <span className="text-rose-600">{t.victim.questions.worryHigh}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Text Reflection */}
        {currentStep === 3 && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Tell us how you have been feeling recently.
              </h3>
              <p className="text-xs text-slate-500">
                Optional reflection. Sharing your thoughts helps identify changes in your wellbeing over time.
              </p>
            </div>

            <div className="mb-6">
              <textarea
                id="victim-text-reflection"
                rows={5}
                value={textReflection}
                onChange={(e) => setTextReflection(e.target.value)}
                placeholder="Share any thoughts, feelings, or events that have been on your mind recently..."
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition leading-relaxed resize-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                <span>Optional — you can skip this step or write as much as you like.</span>
                <span>{textReflection.length} characters</span>
              </div>
            </div>

            {/* Contextual Factor */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-6">
              <span className="font-bold text-slate-900 block mb-1">
                Recent Contextual Factor / Incident Note:
              </span>
              <p className="text-[11px] text-indigo-700 font-semibold mb-2">
                Current recorded stressor: "{existingCase?.recentStressor || 'Court Summons Notification'}"
              </p>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-600">Simulate missed previous check-ins:</label>
                <select
                  value={missedCheckIns}
                  onChange={(e) => setMissedCheckIns(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value={0}>0 (Regular on-time)</option>
                  <option value={1}>1 (Recent missed window)</option>
                  <option value={2}>2 (Avoidance / Communication gap)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Voice Reflection & Review */}
        {currentStep === 4 && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Voice Reflection (Optional)
              </h3>
              <p className="text-xs text-slate-600 font-medium bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                Voice analysis is currently a prototype feature. Voice analysis does not diagnose a condition.
              </p>
            </div>

            <div className="mb-6">
              <AudioVisualizer
                onRecordingComplete={(metrics) => {
                  setVoiceRecorded(true);
                  setVoiceMetrics(metrics);
                }}
                initialRecorded={voiceRecorded}
              />
            </div>

            {/* Quick Check-in Summary Review */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mb-6">
              <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-2">
                Submission Summary Checklist
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Emotional State:</span>
                <span className="text-indigo-700 font-semibold capitalize">{emotionalState}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Perceived Safety Rating:</span>
                <span className="text-slate-900 font-semibold">{questionnaire.safetyFeeling}/5</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sleep Rating:</span>
                <span className="text-slate-900 font-semibold">{questionnaire.sleepQuality}/5</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Voice Sample Status:</span>
                <span className={voiceRecorded ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {voiceRecorded ? 'Recorded ✓' : 'Skipped (Optional)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          {currentStep > 1 ? (
            <button
              id="wizard-prev-btn"
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              id="wizard-next-btn"
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="wizard-submit-btn"
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Analyzing Signals...' : t.victim.submitCheckIn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Analysis Result Modal */}
      {analysisResult && (
        <CheckInResultModal
          result={analysisResult}
          onClose={() => {
            setAnalysisResult(null);
            onCompleted();
          }}
          onViewHistory={() => {
            setAnalysisResult(null);
            if (onNavigate) onNavigate('history');
            else onCompleted();
          }}
          onViewSupport={() => {
            setAnalysisResult(null);
            if (onNavigate) onNavigate('support');
            else onCompleted();
          }}
          onViewHome={() => {
            setAnalysisResult(null);
            if (onNavigate) onNavigate('home');
            else onCompleted();
          }}
        />
      )}
    </div>
  );
};
