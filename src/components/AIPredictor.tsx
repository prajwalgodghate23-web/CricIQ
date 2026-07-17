/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Team, Venue, PredictionResult } from '../types';
import {
  Brain,
  CloudRain,
  Sun,
  Compass,
  Trophy,
  TrendingUp,
  Info,
  User,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Search,
  Sparkle,
  ArrowRight,
  Terminal,
  Activity,
  Zap,
  Sliders,
  CheckCircle,
  Dribbble,
  HelpCircle,
  MessageSquare,
  Play,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AIPredictorProps {
  teams: Team[];
  venues: Venue[];
  onPredict: (prediction: PredictionResult) => void;
  theme?: 'light' | 'dark';
}

interface SpodaQueryResult {
  queryType: 'matchup_comparison' | 'stadium_analysis' | 'game_simulation' | 'general_stats';
  title: string;
  primarySummary: string;
  visualMetrics: Array<{
    label: string;
    valueA: string;
    valueB: string;
    teamAName: string;
    teamBName: string;
  }>;
  statsTable: Array<{
    metric: string;
    playerA: string;
    playerB: string;
    nameA: string;
    nameB: string;
  }>;
  chartData: Array<{
    name: string;
    value: number;
  }>;
  tacticalInsights: string[];
  simulatedOutcome?: string;
}

export default function AIPredictor({ teams, venues, onPredict, theme = 'dark' }: AIPredictorProps) {
  // Navigation: Spoda Conversational AI vs Custom Scenario Builder
  const [interfaceMode, setInterfaceMode] = useState<'conversational' | 'scenario'>('conversational');

  // Theme styling helpers
  const isLight = theme === 'light';
  const textPrimary = isLight ? 'text-slate-900' : 'text-white';
  const textSecondary = isLight ? 'text-slate-500' : 'text-slate-400';
  const bgCard = isLight ? 'bg-white border-slate-200/80 shadow-md' : 'bg-[#080B10] border-slate-800 shadow-2xl shadow-black/20';
  const bgSubPanel = isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-850';
  const borderCol = isLight ? 'border-slate-200' : 'border-slate-850';
  const hoverBg = isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900/60';
  const bgInput = isLight ? 'bg-slate-100 text-slate-950' : 'bg-slate-950 text-white';

  // Spoda Conversational Search states
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [spodaResult, setSpodaResult] = useState<SpodaQueryResult | null>(null);
  const [spodaError, setSpodaError] = useState<string | null>(null);

  // Scenario Builder Form states
  const [teamAId, setTeamAId] = useState(teams[0]?.id || 'rcb');
  const [teamBId, setTeamBId] = useState(teams[1]?.id || 'csk');
  const [venueId, setVenueId] = useState(venues[0]?.id || 'chinnaswamy');
  const [pitchType, setPitchType] = useState('Balanced');
  const [weather, setWeather] = useState<'Sunny' | 'Humid & Dew' | 'Overcast' | 'Rainy'>('Sunny');
  const [customFactor, setCustomFactor] = useState('');
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<PredictionResult | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const teamA = teams.find(t => t.id === teamAId);
  const teamB = teams.find(t => t.id === teamBId);
  const selectedVenue = venues.find(v => v.id === venueId);

  // Suggested trending Spoda prompts
  const trendingPrompts = [
    {
      label: '📊 Compare Virat Kohli vs MS Dhoni recent form',
      query: 'Compare Virat Kohli vs MS Dhoni advanced stats'
    },
    {
      label: '🏟️ Analyze Chinnaswamy Stadium bowling economy & dew impact',
      query: 'Analyze M. Chinnaswamy Stadium stats dew and boundary dimensions'
    },
    {
      label: '🔮 Simulate RCB vs CSK final over high-stakes run chase',
      query: 'Simulate high stakes final over play chase RCB vs CSK'
    },
    {
      label: '⚡ Compare Travis Head vs Heinrich Klaasen boundary power',
      query: 'Compare Travis Head vs Heinrich Klaasen stats and strike rates'
    }
  ];

  // Conversational Search Submit handler
  const handleSpodaSearch = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsSearching(true);
    setSpodaError(null);
    setSearchPrompt(promptText);

    try {
      const res = await fetch('/api/spoda-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      if (!res.ok) throw new Error('Failed to retrieve intelligence report.');
      const data = await res.json();
      setSpodaResult(data);
    } catch (err: any) {
      console.error(err);
      setSpodaError(err.message || 'An error occurred during conversational analysis.');
    } finally {
      setIsSearching(false);
    }
  };

  // Scenario Simulator submit handler
  const handlePredict = async () => {
    if (teamAId === teamBId) {
      alert('Please select two different teams for matchup analysis!');
      return;
    }
    setScenarioLoading(true);
    setScenarioResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamAId,
          teamBId,
          venueId,
          pitchType,
          weather,
          customFactor
        })
      });
      const data = await response.json();
      setScenarioResult(data);
      setIsAiGenerated(data.isAiGenerated);
      onPredict(data);
    } catch (e) {
      console.error(e);
    } finally {
      setScenarioLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="spoda_ai_root">
      {/* Mode Toggle Header */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${bgCard}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Sparkle size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-display font-bold ${textPrimary} tracking-tight`}>CricIQ AI</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-mono border border-emerald-500/20 font-bold">PRO ENGINE</span>
            </div>
            <p className="text-xs text-slate-400">Predictive Cricket Intelligence Platform</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-850'}`}>
          <button
            onClick={() => setInterfaceMode('conversational')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              interfaceMode === 'conversational'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search size={13} />
            <span>AI Conversational Search</span>
          </button>
          <button
            onClick={() => setInterfaceMode('scenario')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              interfaceMode === 'scenario'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Scenario Simulator</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Spoda Conversational AI Search */}
      {interfaceMode === 'conversational' && (
        <div className="space-y-6">
          {/* Main Search Panel */}
          <div className="bg-gradient-to-br from-[#080B11] to-[#04060A] border border-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_45%)]" />
            
            <div className="max-w-2xl mx-auto text-center relative z-10 space-y-4 mb-8">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-wide uppercase">
                <Activity size={10} /> Active Sports Synthesis
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                Deep Cricket Insights, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">Instantly Parsed.</span>
              </h1>
              <p className="text-sm text-slate-400">
                Ask sports intelligence questions about IPL rosters, player comparisons, venue statistics, or simulate high-tension games with full tactical reports.
              </p>
            </div>

            {/* Huge Search Box */}
            <div className="max-w-2xl mx-auto relative z-10" id="spoda_search_bar_container">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSpodaSearch(searchPrompt);
                }}
                className="relative flex items-center bg-slate-950/90 border border-slate-800 focus-within:border-emerald-500/50 rounded-2xl p-2 transition-all shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/10"
              >
                <div className="pl-3 text-slate-500">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchPrompt}
                  onChange={(e) => setSearchPrompt(e.target.value)}
                  placeholder="e.g. Compare Virat Kohli vs MS Dhoni stats or Simulate a final over chase..."
                  className="w-full bg-transparent border-none outline-none py-3 px-3 text-sm text-white placeholder-slate-500 focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchPrompt.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:hover:bg-emerald-500 cursor-pointer"
                >
                  {isSearching ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Synthesize</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </form>

              {/* Suggestions Grid */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">TRENDING SPORTS SUGGESTIONS</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trendingPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSpodaSearch(p.query)}
                      className="text-left text-[11px] text-slate-300 bg-slate-950/40 border border-slate-850 hover:border-slate-800 hover:bg-slate-900/60 px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{p.label}</span>
                      <ChevronRight size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spoda AI Answer Panel */}
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="spoda-searching"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#080B10] border border-slate-800/60 rounded-2xl p-10 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-sm font-display font-medium text-white mb-1">Retrieving Stats Database</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Parsing live stats, historic metrics, atmospheric dew points, and venue boundaries via Gemini...
                </p>
              </motion.div>
            ) : spodaError ? (
              <motion.div
                key="spoda-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/5 border border-red-500/15 rounded-2xl p-6 text-center space-y-2"
              >
                <AlertTriangle className="mx-auto text-red-400" size={24} />
                <h4 className="text-sm font-semibold text-white">Analysis Timeout</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{spodaError}</p>
              </motion.div>
            ) : spodaResult ? (
              <motion.div
                key="spoda-result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left Side: Answer & Narrative */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Synthesis Summary */}
                  <div className="bg-[#080B10] border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">SPODA REPORT SYNTHESIS</h2>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">MODEL: gemini-3.5-flash</span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-display font-bold text-white leading-snug">{spodaResult.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{spodaResult.primarySummary}</p>
                    </div>

                    {/* Simulated Outcome Banner if type is simulation */}
                    {spodaResult.simulatedOutcome && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex items-start gap-3">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <Terminal size={14} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono block">PROJECTION CONCLUSION</span>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-mono">{spodaResult.simulatedOutcome}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tactical Insights Checklist */}
                  <div className="bg-[#080B10] border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-emerald-400" /> Tactical Analyst Insights
                    </h3>
                    <div className="space-y-3">
                      {spodaResult.tacticalInsights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                          <div className="text-emerald-400 shrink-0 mt-0.5">
                            <CheckCircle size={14} />
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Data Widgets */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Visual metrics comparisons */}
                  {spodaResult.visualMetrics && spodaResult.visualMetrics.length > 0 && (
                    <div className="bg-[#080B10] border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Head-To-Head Probability</h3>
                      <div className="space-y-4">
                        {spodaResult.visualMetrics.map((m, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-medium text-slate-400">
                              <span>{m.label}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-emerald-400">{m.valueA} <span className="text-[9px] font-normal text-slate-500">({m.teamAName})</span></span>
                              <span className="font-bold text-teal-400">{m.valueB} <span className="text-[9px] font-normal text-slate-500">({m.teamBName})</span></span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full flex overflow-hidden">
                              <div style={{ width: m.valueA }} className="bg-emerald-500 h-full rounded-l-full" />
                              <div style={{ width: m.valueB }} className="bg-teal-500 h-full rounded-r-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recharts chart render */}
                  {spodaResult.chartData && spodaResult.chartData.length > 0 && (
                    <div className="bg-[#080B10] border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Performance Vector Chart</h3>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={spodaResult.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: '8px' }}
                              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                              itemStyle={{ color: '#10b981', fontSize: '11px' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {spodaResult.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#14b8a6'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Core Metrics Table */}
                  {spodaResult.statsTable && spodaResult.statsTable.length > 0 && (
                    <div className="bg-[#080B10] border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Metric Matrix Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-850 text-[10px] text-slate-500 font-mono">
                              <th className="py-2">FACET</th>
                              <th className="py-2 text-right">{spodaResult.statsTable[0]?.nameA || 'VAL A'}</th>
                              <th className="py-2 text-right">{spodaResult.statsTable[0]?.nameB || 'VAL B'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {spodaResult.statsTable.map((row, idx) => (
                              <tr key={idx} className="text-[11px] text-slate-300">
                                <td className="py-2.5 font-medium text-slate-400">{row.metric}</td>
                                <td className="py-2.5 text-right font-mono font-bold text-emerald-400">{row.playerA}</td>
                                <td className="py-2.5 text-right font-mono font-bold text-teal-400">{row.playerB}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-3xl bg-[#080B10]/30">
                <HelpCircle className="mx-auto text-slate-600 mb-3" size={32} />
                <h3 className="text-sm font-semibold text-slate-300">Awaiting Search Queries</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Type or click one of our curated sports queries above to trigger Spoda's high-tech intelligence summary.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* MODE 2: Custom Scenario Builder (Original Sidebar Form + Prediction layout) */}
      {interfaceMode === 'scenario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai_predictor_root">
          {/* Configuration Sidebar */}
          <div className="lg:col-span-5 bg-[#080B10] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between" id="config_panel">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Brain size={22} />
                </div>
                <div>
                  <h2 className="text-base font-display font-semibold text-white">Scenario Parameters</h2>
                  <p className="text-xs text-slate-400">Feed custom variables into the predictive algorithm</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Matchup Selection */}
                <div className="grid grid-cols-11 gap-2 items-center">
                  <div className="col-span-5">
                    <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Home Team (A)</label>
                    <div className="relative">
                      <select
                        value={teamAId}
                        onChange={(e) => setTeamAId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                      >
                        <optgroup label="Domestic (IPL)">
                          {teams.filter(t => ['rcb', 'csk', 'mi', 'kkr', 'srh', 'rr'].includes(t.id)).map(t => (
                            <option key={t.id} value={t.id}>{t.logo} {t.name} ({t.shortName})</option>
                          ))}
                        </optgroup>
                        <optgroup label="International Squads">
                          {teams.filter(t => !['rcb', 'csk', 'mi', 'kkr', 'srh', 'rr'].includes(t.id)).map(t => (
                            <option key={t.id} value={t.id}>{t.logo} {t.name} ({t.shortName})</option>
                          ))}
                        </optgroup>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 font-mono text-xs">▼</div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-center text-slate-500 font-display font-semibold text-xs pt-4">
                    VS
                  </div>

                  <div className="col-span-5">
                    <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Away Team (B)</label>
                    <div className="relative">
                      <select
                        value={teamBId}
                        onChange={(e) => setTeamBId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                      >
                        <optgroup label="Domestic (IPL)">
                          {teams.filter(t => ['rcb', 'csk', 'mi', 'kkr', 'srh', 'rr'].includes(t.id)).map(t => (
                            <option key={t.id} value={t.id}>{t.logo} {t.name} ({t.shortName})</option>
                          ))}
                        </optgroup>
                        <optgroup label="International Squads">
                          {teams.filter(t => !['rcb', 'csk', 'mi', 'kkr', 'srh', 'rr'].includes(t.id)).map(t => (
                            <option key={t.id} value={t.id}>{t.logo} {t.name} ({t.shortName})</option>
                          ))}
                        </optgroup>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 font-mono text-xs">▼</div>
                    </div>
                  </div>
                </div>

                {/* Venue Selection */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Tournament Venue</label>
                  <div className="relative">
                    <select
                      value={venueId}
                      onChange={(e) => setVenueId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                    >
                      <optgroup label="IPL Stadiums">
                        {venues.filter(v => ['chinnaswamy', 'wankhede', 'chepauk', 'ahmedabad', 'eden'].includes(v.id)).map(v => (
                          <option key={v.id} value={v.id}>🏟️ {v.name} ({v.city})</option>
                        ))}
                      </optgroup>
                      <optgroup label="International Grounds">
                        {venues.filter(v => !['chinnaswamy', 'wankhede', 'chepauk', 'ahmedabad', 'eden'].includes(v.id)).map(v => (
                          <option key={v.id} value={v.id}>🏟️ {v.name} ({v.city})</option>
                        ))}
                      </optgroup>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 font-mono text-xs">▼</div>
                  </div>
                  {selectedVenue && (
                    <div className="mt-2 flex gap-3 text-[10px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      <span>🏏 Avg Innings: <b className="text-slate-200">{selectedVenue.avgFirstInningsScore}</b></span>
                      <span>🌱 Nature: <b className="text-slate-200">{selectedVenue.pitchType}</b></span>
                      <span>📏 Size: <b className="text-slate-200">{selectedVenue.boundarySize}</b></span>
                    </div>
                  )}
                </div>

                {/* Pitch Overlay Condition */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Pitch Surface Overlay</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Balanced', 'Batting Paradise', 'Spinner Friendly', 'Green / Seam'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPitchType(type)}
                        className={`text-[9px] py-2 rounded-lg border font-medium transition-all cursor-pointer ${
                          pitchType === type
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weather Overlay */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Atmospheric Weather</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'Sunny', label: 'Sunny', icon: Sun },
                      { value: 'Humid & Dew', label: 'Dew', icon: Compass },
                      { value: 'Overcast', label: 'Overcast', icon: CloudRain },
                      { value: 'Rainy', label: 'Rainy', icon: CloudRain }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setWeather(item.value as any)}
                          className={`text-[9px] py-2.5 rounded-lg border font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                            weather === item.value
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                              : 'bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon size={12} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom factor inputs */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Custom Context Factors</label>
                  <input
                    type="text"
                    value={customFactor}
                    onChange={(e) => setCustomFactor(e.target.value)}
                    placeholder="e.g. Dew at 8pm, RCB playing with green jerseys, Kohli anchor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={handlePredict}
                disabled={scenarioLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                {scenarioLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Algorithms...</span>
                  </>
                ) : (
                  <>
                    <Brain size={15} />
                    <span>Generate ML Prediction</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prediction Output Results */}
          <div className="lg:col-span-7 bg-[#080B10] border border-slate-800 rounded-2xl p-6 flex flex-col justify-center min-h-[450px]" id="results_panel">
            <AnimatePresence mode="wait">
              {scenarioLoading ? (
                <motion.div
                  key="scenario-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                      <Sparkles size={20} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-base font-display font-medium text-white mb-2 animate-pulse">Running Simulation</h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Evaluating player metric vectors, stadium history, dew weights, and overlay modifiers...
                  </p>
                </motion.div>
              ) : scenarioResult ? (
                <motion.div
                  key="scenario-result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 font-mono">ANALYSIS COMPLETED</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Model: gemini-3.5-flash-latest</p>
                    </div>
                    {isAiGenerated ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold tracking-wide">
                        <Sparkles size={11} />
                        <span>LIVE AI GENERATED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold tracking-wide">
                        <AlertTriangle size={11} />
                        <span>DETERMINISTIC VECTOR</span>
                      </div>
                    )}
                  </div>

                  {/* Real-time Win Probability Gauge */}
                  <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl">
                    <h4 className="text-xs font-semibold text-slate-300 mb-4 tracking-wider flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-400" />
                      WIN PROBABILITY
                    </h4>

                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-display font-bold text-white">{scenarioResult.winProbability.teamA}%</span>
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">{teamA?.shortName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">{teamB?.shortName}</span>
                        <span className="text-xl font-display font-bold text-white">{scenarioResult.winProbability.teamB}%</span>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-slate-900 rounded-full flex overflow-hidden">
                      <div
                        style={{ width: `${scenarioResult.winProbability.teamA}%`, backgroundColor: teamA?.color || '#ef4444' }}
                        className="h-full rounded-l-full transition-all duration-1000"
                      />
                      <div
                        style={{ width: `${scenarioResult.winProbability.teamB}%`, backgroundColor: teamB?.color || '#eab308' }}
                        className="h-full rounded-r-full transition-all duration-1000"
                      />
                    </div>
                  </div>

                  {/* Top Performers Prediction */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top Scorer */}
                    <div className="bg-slate-950/50 border border-slate-850/80 p-4 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                        <Trophy size={18} />
                      </div>
                      <div>
                        <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PROJECTED TOP RUN-SCORER</h5>
                        <p className="text-xs font-semibold text-white mt-0.5">{scenarioResult.predictedTopScorer.playerName}</p>
                        <p className="text-base font-display font-bold text-amber-400 mt-1">{scenarioResult.predictedTopScorer.predictedRuns} <span className="text-[10px] text-slate-400 font-sans font-normal">Runs predicted</span></p>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{scenarioResult.predictedTopScorer.reason}</p>
                      </div>
                    </div>

                    {/* Top Wickets */}
                    <div className="bg-slate-950/50 border border-slate-850/80 p-4 rounded-xl flex items-start gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PROJECTED TOP WICKETEER</h5>
                        <p className="text-xs font-semibold text-white mt-0.5">{scenarioResult.predictedTopWicketeer.playerName}</p>
                        <p className="text-base font-display font-bold text-emerald-400 mt-1">{scenarioResult.predictedTopWicketeer.predictedWickets} <span className="text-[10px] text-slate-400 font-sans font-normal">Wickets predicted</span></p>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{scenarioResult.predictedTopWicketeer.reason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tactical Matchup Analysis */}
                  <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl">
                    <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-emerald-400" />
                      CRITICAL PLAYER MATCHUPS
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{scenarioResult.keyMatchupAnalysis}</p>
                  </div>

                  {/* Proper Prediction Reasoning (Explicit User Request) */}
                  {scenarioResult.predictionReason && (
                    <div className="bg-emerald-500/5 border border-emerald-500/15 p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase font-mono tracking-wider flex items-center gap-2">
                        <Sparkles size={13} className="animate-pulse" />
                        Proper Prediction Reasoning
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{scenarioResult.predictionReason}</p>
                    </div>
                  )}

                  {/* Suggestions on How Both Teams Will Play (Explicit User Request) */}
                  {scenarioResult.playSuggestions && (
                    <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center gap-2">
                        <Brain size={13} className="text-emerald-400" />
                        Suggested Game Plan: How Both Squads Will Play
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-lg">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block mb-1">🏏 {teamA?.name || 'Home Squad'} Suggestion</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{scenarioResult.playSuggestions.teamA}</p>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-lg">
                          <span className="text-[10px] font-bold text-teal-400 uppercase font-mono block mb-1">🥎 {teamB?.name || 'Away Squad'} Suggestion</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{scenarioResult.playSuggestions.teamB}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Factors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Info size={11} className="text-emerald-400" />
                        KEY PREDICTIVE FACTORS
                      </h4>
                      <ul className="space-y-1.5">
                        {scenarioResult.keyFactors.map((f, idx) => (
                          <li key={idx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-400 mt-1 font-bold">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Brain size={11} className="text-emerald-400" />
                        TACTICAL INSTRUCTIONS
                      </h4>
                      <ul className="space-y-1.5">
                        {scenarioResult.tacticalInsights.map((insight, idx) => (
                          <li key={idx} className="text-[10px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-400 mt-1 font-bold">✓</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-10" key="scenario-empty">
                  <div className="w-16 h-16 mx-auto bg-slate-950/80 rounded-full flex items-center justify-center text-slate-500 mb-4 border border-slate-800">
                    <Sliders size={28} />
                  </div>
                  <h3 className="text-sm font-display font-medium text-white mb-1.5">Awaiting Simulation Parameters</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Customize team rosters, pitch overlays, weather, custom modifiers and trigger the prediction engine.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
