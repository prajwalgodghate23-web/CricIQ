/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Team, Venue, HistoricalMatch } from '../types';
import { Calendar, Filter, Award, MapPin, Search, BarChart3, TrendingUp, Trophy, ArrowRight, BookOpen } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

interface HistoricalDashboardProps {
  teams: Team[];
  venues: Venue[];
  historicalMatches: HistoricalMatch[];
  headToHeadRecords: Array<{ team1: string; team2: string; matches: number; wins1: number; wins2: number; nr: number }>;
}

export default function HistoricalDashboard({
  teams,
  venues,
  historicalMatches,
  headToHeadRecords,
}: HistoricalDashboardProps) {
  // Filters state
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Head-to-head analysis state
  const [h2hTeamA, setH2hTeamA] = useState<string>('csk');
  const [h2hTeamB, setH2hTeamB] = useState<string>('rcb');

  // Filter historical match list
  const filteredMatches = historicalMatches.filter((m) => {
    const matchesSeason = selectedSeason === 'all' || m.season === selectedSeason;
    const matchesTeam =
      selectedTeam === 'all' || m.teamAId === selectedTeam || m.teamBId === selectedTeam;
    const matchesVenue = selectedVenue === 'all' || m.venueId === selectedVenue;
    const matchesStage = selectedStage === 'all' || m.stage === selectedStage;
    return matchesSeason && matchesTeam && matchesVenue && matchesStage;
  });

  // Unique list of seasons
  const seasons = Array.from(new Set(historicalMatches.map((m) => m.season))).sort().reverse();

  // Find head-to-head records
  const currentH2H = headToHeadRecords.find(
    (r) =>
      (r.team1 === h2hTeamA && r.team2 === h2hTeamB) ||
      (r.team1 === h2hTeamB && r.team2 === h2hTeamA)
  );

  // Fallback head-to-head counts if record is missing
  const computedH2HMatches = historicalMatches.filter(
    (m) =>
      (m.teamAId === h2hTeamA && m.teamBId === h2hTeamB) ||
      (m.teamAId === h2hTeamB && m.teamBId === h2hTeamA)
  );

  const teamAObj = teams.find((t) => t.id === h2hTeamA);
  const teamBObj = teams.find((t) => t.id === h2hTeamB);

  // Compute stats for charts based on currently filtered matches
  const teamWinCounts: { [key: string]: number } = {};
  teams.forEach((t) => {
    teamWinCounts[t.id] = 0;
  });
  filteredMatches.forEach((m) => {
    if (m.winnerId && teamWinCounts[m.winnerId] !== undefined) {
      teamWinCounts[m.winnerId]++;
    }
  });

  const chartWinsData = teams.map((t) => ({
    name: t.shortName,
    Wins: teamWinCounts[t.id],
    color: t.color,
  }));

  // Average runs tracker
  const parseInningsScore = (scoreStr: string) => {
    // extract numerical score, e.g. "187/5" -> 187
    const parts = scoreStr.split('/');
    return parseInt(parts[0]) || 150;
  };

  const scoreTrendsData = historicalMatches
    .filter((m) => m.season !== '')
    .map((m) => ({
      date: m.date,
      season: m.season,
      TeamAScore: parseInningsScore(m.teamAScore),
      TeamBScore: parseInningsScore(m.teamBScore),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pie chart for H2H
  const h2hWinsData = currentH2H
    ? [
        { name: teams.find((t) => t.id === currentH2H.team1)?.shortName || 'Team 1', value: currentH2H.wins1, color: teams.find((t) => t.id === currentH2H.team1)?.color || '#3b82f6' },
        { name: teams.find((t) => t.id === currentH2H.team2)?.shortName || 'Team 2', value: currentH2H.wins2, color: teams.find((t) => t.id === currentH2H.team2)?.color || '#ef4444' },
        { name: 'No Result / Ties', value: currentH2H.nr, color: '#475569' },
      ]
    : [
        { name: teamAObj?.shortName || 'Team A', value: computedH2HMatches.filter((m) => m.winnerId === h2hTeamA).length, color: teamAObj?.color || '#3b82f6' },
        { name: teamBObj?.shortName || 'Team B', value: computedH2HMatches.filter((m) => m.winnerId === h2hTeamB).length, color: teamBObj?.color || '#ef4444' },
        { name: 'Other', value: Math.max(0, computedH2HMatches.length - computedH2HMatches.filter(m => m.winnerId === h2hTeamA || m.winnerId === h2hTeamB).length), color: '#475569' },
      ];

  return (
    <div className="space-y-6" id="historical_analytics_dashboard_container">
      {/* Hero Bento Banner */}
      <div className="bg-gradient-to-r from-slate-900/80 via-blue-950/20 to-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <BookOpen size={16} />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">Historical Match Database</span>
        </div>
        <h2 className="text-xl font-display font-bold text-white tracking-tight">Interactive Tournament Archives</h2>
        <p className="text-xs text-slate-400 mt-1">Explore team head-to-head trends, venue pitching statistics, and season-by-season match logs powering our predictions.</p>
      </div>

      {/* Head-to-Head Comparison Tool Section (Bento Block) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-blue-400" />
          <h3 className="text-sm font-display font-bold text-white">Dynamic Head-to-Head Analyzer</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Matchup Picker */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Squad A</label>
                <select
                  value={h2hTeamA}
                  onChange={(e) => setH2hTeamA(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.id === h2hTeamB}>
                      {t.logo} {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center text-slate-600">
                <ArrowRight size={16} className="rotate-90 lg:rotate-0" />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Squad B</label>
                <select
                  value={h2hTeamB}
                  onChange={(e) => setH2hTeamB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.id === h2hTeamA}>
                      {t.logo} {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-950/40 p-3.5 border border-slate-850 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Total Head-to-Head Matches</span>
              <span className="text-xl font-mono font-bold text-white">
                {currentH2H ? currentH2H.matches : computedH2HMatches.length}
              </span>
            </div>
          </div>

          {/* Pie Chart display */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={h2hWinsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {h2hWinsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legends */}
            <div className="flex flex-wrap gap-3 justify-center text-[10px] text-slate-400 font-mono mt-2">
              {h2hWinsData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Head-to-head direct match history log */}
          <div className="lg:col-span-4 bg-slate-950/40 border border-slate-850 rounded-xl p-4 h-[250px] overflow-y-auto">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-2">Direct Matchup Logs</h4>
            <div className="space-y-2">
              {computedH2HMatches.length > 0 ? (
                computedH2HMatches.map((m) => {
                  const winnerTeam = teams.find((t) => t.id === m.winnerId);
                  return (
                    <div key={m.id} className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>{m.date} ({m.season})</span>
                        <span className="bg-slate-900 px-1 py-0.25 rounded border border-slate-800 text-[9px] uppercase">{m.stage}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-white">
                        <span>{teams.find((t) => t.id === m.teamAId)?.shortName}: {m.teamAScore}</span>
                        <span>{teams.find((t) => t.id === m.teamBId)?.shortName}: {m.teamBScore}</span>
                      </div>
                      <div className="text-[10px] text-blue-400 font-mono">
                        🏆 Winner: {winnerTeam?.name} by {m.margin}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-slate-600">
                  No direct log entry seeded. Sourced from external historical stats.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview and Multi-filtering Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Filter Controls (4 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md lg:col-span-4 flex flex-col justify-between h-[380px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-blue-400" />
              <h3 className="text-sm font-display font-bold text-white">Database Filtering</h3>
            </div>
            
            <div className="space-y-3.5">
              {/* Filter 1: Season */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Seasons (2023 - 2025)</option>
                  {seasons.map((s) => (
                    <option key={s} value={s}>
                      IPL Season {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Team */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Involving Squad</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">Any Squad</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.logo} {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 3: Venue */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Stadium Venue</label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">Any Stadium</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      📍 {v.name} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter 4: Stage */}
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Tournament Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Match Stages</option>
                  <option value="League">League Stage</option>
                  <option value="Playoffs">Playoffs</option>
                  <option value="Final">Grand Final</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 mt-4 flex justify-between">
            <span>Filtered Pool count:</span>
            <span className="text-white font-bold">{filteredMatches.length} matches</span>
          </div>
        </div>

        {/* Dynamic Wins Chart (8 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md lg:col-span-8 flex flex-col justify-between h-[380px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-blue-400" />
              <h3 className="text-sm font-display font-bold text-white">Win Analytics Across Filtered Dataset</h3>
            </div>
            
            <div className="h-60 w-full">
              {filteredMatches.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartWinsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      itemStyle={{ fontSize: '11px', color: '#60a5fa' }}
                    />
                    <Bar dataKey="Wins" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {chartWinsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                  No records match selected filter criteria. Try broadening filters.
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-right">
            Tracks total victories in selected filters.
          </div>
        </div>
      </div>

      {/* Historical Match Logs List Table (Bento Block) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <h3 className="text-sm font-display font-bold text-white">Historical Tournament Log</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
            {filteredMatches.length} Records Found
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-850">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-850 uppercase text-[9px]">
                <th className="p-3">Date</th>
                <th className="p-3">Season</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Team A</th>
                <th className="p-3">Team B</th>
                <th className="p-3">Winner ID</th>
                <th className="p-3">Margin</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Player of Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 bg-slate-950/20">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((m) => {
                  const teamA = teams.find((t) => t.id === m.teamAId);
                  const teamB = teams.find((t) => t.id === m.teamBId);
                  const winner = teams.find((t) => t.id === m.winnerId);
                  const venue = venues.find((v) => v.id === m.venueId);

                  return (
                    <tr key={m.id} className="hover:bg-slate-900/40 text-slate-300">
                      <td className="p-3 font-mono text-slate-400">{m.date}</td>
                      <td className="p-3">{m.season}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                          {m.stage}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span style={{ color: teamA?.color }}>{teamA?.logo}</span>
                          <span>{teamA?.name} ({m.teamAScore})</span>
                        </span>
                      </td>
                      <td className="p-3 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span style={{ color: teamB?.color }}>{teamB?.logo}</span>
                          <span>{teamB?.name} ({m.teamBScore})</span>
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-blue-400 font-bold">{winner?.shortName || m.winnerId}</span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-400">{m.margin}</td>
                      <td className="p-3 text-[11px] truncate max-w-[120px]" title={venue?.name}>
                        📍 {venue?.name || m.venueId}
                      </td>
                      <td className="p-3 font-medium text-amber-400 flex items-center gap-1">
                        <Award size={11} /> {m.playerOfMatch}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-500">
                    No historical matches match selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
