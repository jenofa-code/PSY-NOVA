import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle, Activity, Volume2, AlertCircle } from 'lucide-react';
import { VoiceAcousticMetrics } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AudioVisualizerProps {
  onRecordingComplete: (metrics: VoiceAcousticMetrics) => void;
  initialRecorded?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  onRecordingComplete,
  initialRecorded = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(initialRecorded);
  const [metrics, setMetrics] = useState<VoiceAcousticMetrics | null>(null);
  const timerRef = useRef<any>(null);
  const [waveBars, setWaveBars] = useState<number[]>([20, 35, 60, 45, 80, 55, 30, 70, 90, 40, 65, 50, 30, 45]);
  const { t } = useLanguage();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });

        // Simulate waveform animation
        setWaveBars((prev) =>
          prev.map(() => Math.floor(Math.random() * 75) + 20)
        );
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setHasRecorded(false);
    setMetrics(null);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);

    // Realistic acoustic markers synthesized for prototype
    const computedMetrics: VoiceAcousticMetrics = {
      speechRateWpm: Math.floor(Math.random() * 25) + 110, // 110 - 135 wpm
      pauseDurationSec: Number((Math.random() * 1.5 + 1.2).toFixed(1)), // 1.2 - 2.7 sec average pause
      pitchJitterPercent: Number((Math.random() * 2.8 + 2.1).toFixed(2)), // 2.1 - 4.9%
      acousticDistressScore: Math.floor(Math.random() * 30) + 55, // 55 - 85
      durationSeconds: recordingDuration > 0 ? recordingDuration : 8,
    };

    setMetrics(computedMetrics);
    onRecordingComplete(computedMetrics);
  };

  return (
    <div id="psynova-voice-checkin-module" className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {t.victim.voicePrompt}
            </h4>
            <p className="text-xs text-slate-500">
              {t.victim.voiceSubtext}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
          Prototype Acoustic Analyzer
        </span>
      </div>

      {/* Visualizer Area */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 my-4 flex flex-col items-center justify-center min-h-[110px]">
        {isRecording ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="flex items-end justify-center gap-1.5 h-14 w-full px-4">
              {waveBars.map((height, idx) => (
                <div
                  key={idx}
                  className="w-2.5 bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>{t.victim.recording} (00:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration})</span>
            </div>
          </div>
        ) : hasRecorded && metrics ? (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-2.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.victim.voiceRecorded} ({metrics.durationSeconds}s)</span>
              </div>
              <span className="text-slate-500 text-[11px] font-normal">Feature simulation active</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Speech Cadence</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {metrics.speechRateWpm} <span className="text-[10px] font-normal text-slate-500">WPM</span>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Pause Interval</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {metrics.pauseDurationSec}s <span className="text-[10px] font-normal text-slate-500">avg</span>
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Pitch Jitter</div>
                <div className="font-bold text-amber-800 mt-0.5">
                  {metrics.pitchJitterPercent}% <span className="text-[10px] font-normal text-amber-700">elevated</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-slate-500 text-xs flex flex-col items-center gap-1.5">
            <Volume2 className="w-6 h-6 text-slate-400" />
            <span>Click below to record a brief 10–15s vocal reflection</span>
          </div>
        )}
      </div>

      {/* Button Controls */}
      <div className="flex items-center justify-between gap-3">
        {!isRecording ? (
          <button
            id="start-voice-record-btn"
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{hasRecorded ? 'Record New Voice Sample' : t.victim.recordVoice}</span>
          </button>
        ) : (
          <button
            id="stop-voice-record-btn"
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs animate-pulse"
          >
            <MicOff className="w-3.5 h-3.5" />
            <span>{t.victim.stopRecord}</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>No raw audio stored; extracts tension markers only.</span>
        </div>
      </div>
    </div>
  );
};
