import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  Users,
} from 'lucide-react';
import {
  MOCK_DISTRICT_METRICS,
  MOCK_AGGREGATE_TRENDS,
  MOCK_RISK_DISTRIBUTION,
} from '../../services/mockData';

export const AnalyticsView: React.FC = () => {
  const COLORS = ['#10b981', '#f59e0b', '#f43f5e', '#b91c1c'];

  return (
    <div className="space-y-8">
      {/* Overview Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Aggregated Monitored Cohort</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">412</div>
          <p className="text-[11px] text-teal-400 mt-1">
            Active under atrocity victim protection
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Mean Response Latency</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">3.4 <span className="text-sm font-normal text-slate-400">hours</span></div>
          <p className="text-[11px] text-indigo-400 mt-1">
            From early alert to clinical acknowledgement
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Early Alert Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">91.8%</div>
          <p className="text-[11px] text-emerald-400 mt-1">
            Confirmed clinically worsening trajectory
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Proactive Interventions</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">164</div>
          <p className="text-[11px] text-amber-400 mt-1">
            Dispatched before acute crisis stage
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Longitudinal Cohort Average Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span>Average Cohort Distress Over Time</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Weekly dynamic aggregate score across all districts
              </p>
            </div>
            <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
              Mean: 48.2
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_AGGREGATE_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[20, 70]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgDistress"
                  name="Mean Distress (0-100)"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: '#14b8a6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Risk Level Cohort Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Proportion of active cases across risk thresholds
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {MOCK_RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* District / Regional Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>District-Level Vulnerability & Response Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative data for District Magistrates, Welfare Officers, and DMHP heads
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Total Cases</th>
                <th className="py-3 px-4">High Risk</th>
                <th className="py-3 px-4">Worsening Trajectory</th>
                <th className="py-3 px-4">Avg Distress</th>
                <th className="py-3 px-4">Response Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_DISTRICT_METRICS.map((dist, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4 font-bold text-white">{dist.district}</td>
                  <td className="py-3.5 px-4 font-mono">{dist.totalCases}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-rose-400">{dist.highRisk}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-amber-400">{dist.worseningTrajectory}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-200">{dist.avgDistressScore}</span>
                    <span className="text-[10px] text-slate-500"> / 100</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-full bg-slate-800 rounded-full h-2 max-w-[120px]">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (1 - dist.highRisk / dist.totalCases) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
