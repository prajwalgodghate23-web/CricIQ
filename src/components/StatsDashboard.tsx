/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Team, Venue } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  Users,
  Shield,
  Award,
  BarChart3,
  TrendingUp,
  Info,
  Globe,
  MapPin,
  Calendar,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  Trophy,
  Sliders,
  ChevronRight,
  Sparkles,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatsDashboardProps {
  teams: Team[];
  venues: Venue[];
  headToHeadRecords: Array<{ team1: string; team2: string; matches: number; wins1: number; wins2: number; nr: number }>;
}

export default function StatsDashboard({ teams, venues, headToHeadRecords }: StatsDashboardProps) {
  // Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<'comparison' | 'rankings' | 'stadiums'>('comparison');

  // Tab A: Comparison State
  const [teamAId, setTeamAId] = useState('rcb');
  const [teamBId, setTeamBId] = useState('csk');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('virat_kohli');

  // Tab B: Rankings State
  const [selectedCountryId, setSelectedCountryId] = useState<string>('ind');
  const [selectedRankPlayerId, setSelectedRankPlayerId] = useState<string | null>(null);

  // Tab C: Stadium State
  const [selectedVenueId, setSelectedVenueId] = useState<string>('ahmedabad');
  const [activeFormat, setActiveFormat] = useState<'Test' | 'ODI' | 'T20'>('T20');
  const [activeTournament, setActiveTournament] = useState<'WorldCup' | 'WTC' | 'ChampionsTrophy' | 'IPL'>('WorldCup');

  // Top 10 Global Power Rankings Data (Combining International and Domestic IPL franchises)
  const top10Teams = [
    { rank: 1, teamId: 'ind', name: 'India', shortName: 'IND', logo: '🇮🇳', type: 'International', strength: 96, attribute: 'All-Format Giants', form: ['W', 'W', 'W', 'W', 'W'] },
    { rank: 2, teamId: 'aus', name: 'Australia', shortName: 'AUS', logo: '🇦🇺', type: 'International', strength: 95, attribute: 'ICC Tournament Kings', form: ['W', 'W', 'L', 'W', 'W'] },
    { rank: 3, teamId: 'srh', name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: '🦅', type: 'Domestic (IPL)', strength: 95, attribute: 'Heavy Batting Strike Rate', form: ['W', 'L', 'W', 'W', 'L'] },
    { rank: 4, teamId: 'eng', name: 'England', shortName: 'ENG', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', type: 'International', strength: 93, attribute: 'Explosive White-Ball Squad', form: ['W', 'L', 'W', 'L', 'W'] },
    { rank: 5, teamId: 'rcb', name: 'Royal Challengers Bengaluru', shortName: 'RCB', logo: '🏏', type: 'Domestic (IPL)', strength: 92, attribute: 'High-Form Chase Battery', form: ['W', 'W', 'L', 'W', 'L'] },
    { rank: 6, teamId: 'sa', name: 'South Africa', shortName: 'RSA', logo: '🇿🇦', type: 'International', strength: 92, attribute: 'Fierce Middle-Order Pace', form: ['W', 'W', 'L', 'W', 'L'] },
    { rank: 7, teamId: 'mi', name: 'Mumbai Indians', shortName: 'MI', logo: '⚡', type: 'Domestic (IPL)', strength: 91, attribute: 'Elite Red-Soil Bowlers', form: ['L', 'W', 'L', 'L', 'W'] },
    { rank: 8, teamId: 'nz', name: 'New Zealand', shortName: 'NZ', logo: '🇳🇿', type: 'International', strength: 91, attribute: 'Tactical Precision Swing', form: ['L', 'W', 'W', 'L', 'W'] },
    { rank: 9, teamId: 'kkr', name: 'Kolkata Knight Riders', shortName: 'KKR', logo: '⚔️', type: 'Domestic (IPL)', strength: 90, attribute: 'Elite Spin-Choke Spinners', form: ['W', 'W', 'W', 'L', 'W'] },
    { rank: 10, teamId: 'csk', name: 'Chennai Super Kings', shortName: 'CSK', logo: '🦁', type: 'Domestic (IPL)', strength: 89, attribute: 'Tactical Playbook Experts', form: ['W', 'L', 'W', 'W', 'W'] },
  ];

  // Domestic Teams Filter
  const domesticTeams = teams.filter(t => t.type === 'ipl' || ['rcb', 'csk', 'mi', 'kkr', 'srh', 'rr'].includes(t.id));
  const internationalTeams = teams.filter(t => t.type === 'international' || !['rcb', 'csk', 'mi', 'kkr', 'srh', 'rr'].includes(t.id));

  // Fetch current comparing teams (Domestic or International compatibility)
  const teamA = teams.find(t => t.id === teamAId) || teams[0] || domesticTeams[0];
  const teamB = teams.find(t => t.id === teamBId) || teams[1] || domesticTeams[1];

  // Head to Head calculation
  const h2h = headToHeadRecords.find(
    r => (r.team1 === teamAId && r.team2 === teamBId) || (r.team1 === teamBId && r.team2 === teamAId)
  ) || { team1: teamAId, team2: teamBId, matches: 0, wins1: 0, wins2: 0, nr: 0 };

  const teamAWins = h2h.team1 === teamAId ? h2h.wins1 : h2h.wins2;
  const teamBWins = h2h.team1 === teamAId ? h2h.wins2 : h2h.wins1;

  // Recharts strength comparison
  const strengthData = [
    {
      name: 'Batting Power',
      [teamA.shortName]: teamA.battingStrength,
      [teamB.shortName]: teamB.bowlingStrength, // Offset for visual metrics
    },
    {
      name: 'Bowling Grip',
      [teamA.shortName]: teamA.bowlingStrength,
      [teamB.shortName]: teamB.bowlingStrength,
    },
    {
      name: 'Form Factor',
      [teamA.shortName]: teamA.recentForm.filter(f => f === 'W').length * 20,
      [teamB.shortName]: teamB.recentForm.filter(f => f === 'W').length * 20,
    }
  ];

  // Selected player for deep dive metrics
  const allPlayers = [...teamA.players, ...teamB.players];
  const currentPlayer = allPlayers.find(p => p.id === selectedPlayerId) || allPlayers[0];

  const playerScoresData = currentPlayer?.recentScores?.map((score, idx) => ({
    match: `Match ${idx + 1}`,
    Runs: parseInt(score.replace('*', ''), 10) || 0,
  })) || [];

  // Tab B Country Details
  const selectedCountry = teams.find(t => t.id === selectedCountryId) || internationalTeams[0];
  const rankPlayer = selectedCountry?.players.find(p => p.id === selectedRankPlayerId) || selectedCountry?.players[0];

  // Tab C Stadium Details
  const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];

  // Fetch venue metrics dynamically based on chosen Format & Tournament
  const formatsStats = selectedVenue?.formats || {
    Test: { avgScore: 280, highestScore: '512/10 by AUS', lowestScore: '92/10 by IND', wicketsPace: 70, wicketsSpin: 30, matchesPlayed: 12, chasingWon: 4, defendingWon: 8 },
    ODI: { avgScore: 240, highestScore: '350/6 by IND', lowestScore: '110/10 by RSA', wicketsPace: 60, wicketsSpin: 40, matchesPlayed: 25, chasingWon: 12, defendingWon: 13 },
    T20: { avgScore: 165, highestScore: '210/5 by KKR', lowestScore: '89/10 by RCB', wicketsPace: 65, wicketsSpin: 35, matchesPlayed: 32, chasingWon: 18, defendingWon: 14 }
  };

  const activeFormatStats = formatsStats[activeFormat] || formatsStats.T20;

  const tournamentStats = selectedVenue?.tournaments || {};
  const activeTournamentStats = tournamentStats[activeTournament as keyof typeof tournamentStats] || {
    matchesPlayed: 4,
    highestChased: '245/4 by IND',
    bestPlayer: 'Virat Kohli',
    keyInsights: ['Grass covering maintains swing under floodlights.', 'Standard boundary dimensions favor running double plays.']
  };

  // Switch Country Grad Backgrounds
  const getCountryGrad = (cid: string) => {
    switch (cid) {
      case 'india': return 'from-blue-600/20 via-blue-900/10 to-transparent border-blue-500/30 text-blue-400';
      case 'australia': return 'from-yellow-600/20 via-yellow-900/10 to-transparent border-yellow-500/30 text-yellow-400';
      case 'england': return 'from-sky-600/20 via-sky-900/10 to-transparent border-sky-500/30 text-sky-400';
      case 'southafrica': return 'from-emerald-600/20 via-emerald-900/10 to-transparent border-emerald-500/30 text-emerald-400';
      case 'newzealand': return 'from-slate-600/20 via-slate-900/10 to-transparent border-slate-500/30 text-slate-400';
      default: return 'from-indigo-600/20 via-indigo-900/10 to-transparent border-indigo-500/30 text-indigo-400';
    }
  };

  return (
    <div className="space-y-6" id="stats_dashboard_container">
      {/* Dynamic Sub Tab Navigation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 flex flex-wrap gap-2 items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 size={18} className="text-indigo-400" />
          <h2 className="text-sm font-display font-bold text-white tracking-tight">Metrics & Analytics Vault</h2>
        </div>

        <div className="flex gap-2">
          {[
            { id: 'comparison', label: 'Squad Comparison', icon: Sliders },
            { id: 'rankings', label: 'Top 10 & International', icon: Globe },
            { id: 'stadiums', label: 'Stadium Deep Dive', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'comparison' && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Controls Top Card */}
            <div className="lg:col-span-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h3 className="text-xs font-display font-bold text-slate-300">DUAL TEAM METRICS GENERATOR</h3>
                <p className="text-[10px] text-slate-500">Pick any domestic franchise or country squad to compare ratings</p>
              </div>

              <div className="flex gap-2.5 items-center bg-slate-950/60 p-1.5 rounded-xl border border-slate-850">
                <select
                  value={teamAId}
                  onChange={(e) => {
                    setTeamAId(e.target.value);
                    const nt = teams.find(t => t.id === e.target.value);
                    if (nt) setSelectedPlayerId(nt.players[0].id);
                  }}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-semibold px-2"
                >
                  <optgroup label="IPL Franchise">
                    {domesticTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.logo} {t.shortName}</option>
                    ))}
                  </optgroup>
                  <optgroup label="International Countries">
                    {internationalTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.logo} {t.shortName}</option>
                    ))}
                  </optgroup>
                </select>

                <span className="text-[9px] font-mono font-bold text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">VS</span>

                <select
                  value={teamBId}
                  onChange={(e) => setTeamBId(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-semibold px-2"
                >
                  <optgroup label="IPL Franchise">
                    {domesticTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.logo} {t.shortName}</option>
                    ))}
                  </optgroup>
                  <optgroup label="International Countries">
                    {internationalTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.logo} {t.shortName}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Strength indexes BarChart */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-indigo-400" />
                  Squad Battle Index Comparison (0-100)
                </h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strengthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" domain={[0, 100]} fontSize={9} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      />
                      <Bar dataKey={teamA.shortName} fill={teamA.color} radius={[4, 4, 0, 0]} />
                      <Bar dataKey={teamB.shortName} fill={teamB.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Head to Head Visual Ratios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl text-center flex flex-col justify-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">ALL CONTESTS</span>
                  <span className="text-3xl font-display font-bold text-white font-mono">{h2h.matches || '0'}</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">Historical Database Matches</span>
                </div>

                <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl text-center flex flex-col justify-center" style={{ borderLeft: `3px solid ${teamA.color}` }}>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1" style={{ color: teamA.color }}>{teamA.shortName} VICTORIES</span>
                  <span className="text-3xl font-display font-bold text-white font-mono">{teamAWins || '0'}</span>
                  {h2h.matches > 0 && (
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">Ratio: {Math.round((teamAWins / h2h.matches) * 100)}%</span>
                  )}
                </div>

                <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl text-center flex flex-col justify-center" style={{ borderLeft: `3px solid ${teamB.color}` }}>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1" style={{ color: teamB.color }}>{teamB.shortName} VICTORIES</span>
                  <span className="text-3xl font-display font-bold text-white font-mono">{teamBWins || '0'}</span>
                  {h2h.matches > 0 && (
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">Ratio: {Math.round((teamBWins / h2h.matches) * 100)}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Player Deep Dive */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-indigo-400" />
                  <h3 className="text-xs font-display font-bold text-white uppercase">Player Deep Dive Analysis</h3>
                </div>

                {/* Player Select */}
                <div>
                  <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Roster Member</label>
                  <select
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <optgroup label={teamA.shortName}>
                      {teamA.players.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                      ))}
                    </optgroup>
                    <optgroup label={teamB.shortName}>
                      {teamB.players.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {currentPlayer && (
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-sm text-white">{currentPlayer.name}</h4>
                        <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{currentPlayer.role}</span>
                      </div>
                      <span className="text-2xl">🏏</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 border-t border-b border-slate-850/60 py-2 text-center">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block">STRIKE RATE</span>
                        <span className="font-display font-bold text-xs text-white font-mono">{currentPlayer.strikeRate}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block">AVERAGE</span>
                        <span className="font-display font-bold text-xs text-white font-mono">{currentPlayer.average}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block">CAREER RUNS</span>
                        <span className="font-display font-bold text-xs text-white font-mono">{currentPlayer.careerRuns || '—'}</span>
                      </div>
                    </div>

                    {/* Advanced Metrics */}
                    <div className="space-y-1 text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Highest Match Score:</span>
                        <span className="font-bold text-slate-200">{currentPlayer.highestScore || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Career Wickets:</span>
                        <span className="font-bold text-slate-200">{currentPlayer.careerWickets || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dot ball %:</span>
                        <span className="font-bold text-slate-200">{currentPlayer.dotBallPercentage ? `${currentPlayer.dotBallPercentage}%` : '—'}</span>
                      </div>
                    </div>

                    {/* Rating Gauge */}
                    <div>
                      <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-mono">
                        <span>Form Rating Factor</span>
                        <span className="text-indigo-400 font-bold font-mono">
                          {(currentPlayer.form.reduce((a, b) => a + b, 0) / currentPlayer.form.length).toFixed(1)} / 10
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {currentPlayer.form.map((rating, i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-grow rounded"
                            style={{
                              backgroundColor: rating >= 8 ? '#6366f1' : rating >= 6 ? '#ca8a04' : '#ef4444',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {currentPlayer?.recentScores && currentPlayer.recentScores.length > 0 && (
                <div className="mt-4 border-t border-slate-850/60 pt-4">
                  <h4 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-2">RUN PROGRESSION (LAST 5 GAMES)</h4>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={playerScoresData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                        <XAxis dataKey="match" stroke="#475569" fontSize={8} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={8} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px' }}
                          itemStyle={{ fontSize: '10px' }}
                        />
                        <Line type="monotone" dataKey="Runs" stroke="#6366f1" strokeWidth={1.5} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab B: Top 10 rankings & International Squads */}
        {activeSubTab === 'rankings' && (
          <motion.div
            key="rankings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Box: Top 10 Rankings */}
            <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-400" />
                  Global Cricket Power Rankings (Top 10)
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">Blended rankings combining Test/ODI/T20 form and major league indexes</p>
              </div>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {top10Teams.map((team, idx) => (
                  <div
                    key={team.teamId}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-850 hover:border-slate-700 transition-all cursor-pointer"
                    onClick={() => {
                      if (['india', 'australia', 'england', 'southafrica', 'newzealand'].includes(team.teamId)) {
                        setSelectedCountryId(team.teamId);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 font-mono text-xs font-bold text-slate-500">#{team.rank}</span>
                      <span className="text-lg">{team.logo}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-display font-bold text-white">{team.name}</h4>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-850">{team.shortName}</span>
                        </div>
                        <p className="text-[9px] text-indigo-400 font-medium">{team.attribute}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">STRENGTH</span>
                        <span className="font-display font-bold text-xs text-white font-mono">{team.strength}</span>
                      </div>

                      <div className="flex gap-0.5">
                        {team.form.map((f, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${f === 'W' ? 'bg-indigo-500' : 'bg-red-500'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: International Squad Explorer */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Globe size={14} className="text-indigo-400" />
                    International Squads Roster Explorer
                  </h3>

                  {/* Country Selector */}
                  <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
                    {internationalTeams.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCountryId(c.id);
                          setSelectedRankPlayerId(c.players[0].id);
                        }}
                        className={`text-xs p-1.5 rounded-lg transition-all ${
                          selectedCountryId === c.id
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title={c.name}
                      >
                        {c.logo}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCountry && (
                  <div className={`p-4 rounded-xl border bg-gradient-to-br ${getCountryGrad(selectedCountry.id)}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest font-bold">ICC FULL MEMBER</span>
                        <h4 className="text-base font-display font-bold text-white mt-1">{selectedCountry.logo} {selectedCountry.name}</h4>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <span className="text-[8px] text-slate-400 font-mono block">BATTING</span>
                          <span className="text-sm font-bold text-white font-mono">{selectedCountry.battingStrength}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] text-slate-400 font-mono block">BOWLING</span>
                          <span className="text-sm font-bold text-white font-mono">{selectedCountry.bowlingStrength}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Roster consists of 10 elite top-tier multi-format players certified by ICC rankings. Click on any player name to view professional details.
                    </p>
                  </div>
                )}

                {/* Squad Roster Player List */}
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedCountry?.players.map((p) => {
                    const isSelected = selectedRankPlayerId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedRankPlayerId(p.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white font-bold shadow'
                            : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <h5 className="text-[11px] font-display font-bold text-slate-200 line-clamp-1">{p.name}</h5>
                          <span className="text-[8px] font-mono text-slate-500 block mt-0.5">{p.role}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-slate-300 font-bold block">{p.average}</span>
                          <span className="text-[7px] font-mono text-slate-500 block uppercase">AVG</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Player Profile Card */}
              {rankPlayer && (
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                    <Award size={14} className="text-indigo-400" />
                    <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Professional Player Stat Matrix</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Full Name</span>
                        <span className="text-xs font-display font-semibold text-white">{rankPlayer.name}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Role Classification</span>
                        <span className="text-xs font-display font-semibold text-slate-300">{rankPlayer.role}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Batting Average</span>
                        <span className="text-sm font-display font-bold text-white font-mono">{rankPlayer.average}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Career Runs</span>
                        <span className="text-sm font-display font-bold text-white font-mono">{rankPlayer.careerRuns || '—'}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Career Wickets</span>
                        <span className="text-sm font-display font-bold text-white font-mono">{rankPlayer.careerWickets || '0'}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center">
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Highest Score</span>
                          <span className="text-xs font-display font-bold text-white font-mono">{rankPlayer.highestScore || '—'}</span>
                        </div>
                        {rankPlayer.bestBowling && (
                          <div className="text-right">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Best Bowl</span>
                            <span className="text-xs font-display font-bold text-white font-mono">{rankPlayer.bestBowling}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab C: Stadium Stats Analysis */}
        {activeSubTab === 'stadiums' && (
          <motion.div
            key="stadiums"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-none"
          >
            {/* Left sidebar: Stadium Selector */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="px-1 py-1 border-b border-slate-850">
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">Select Arena</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Explore pitch & boundary dimensional profiles</p>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {venues.map((v) => {
                  const isSelected = selectedVenueId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVenueId(v.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 font-bold'
                          : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-display font-bold text-slate-200">{v.name}</h4>
                        <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wide">{v.city}</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded border border-slate-850">
                        {v.pitchType}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Stadium Deep Dive Board */}
            {selectedVenue && (
              <div className="lg:col-span-8 space-y-6">
                {/* Stadium Header Card */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest font-bold">STADIUM DATABASE PORTAL</span>
                      <h3 className="text-lg font-display font-bold text-white mt-1.5">🏟️ {selectedVenue.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                        <MapPin size={11} className="text-indigo-400" />
                        {selectedVenue.city} • <span className="text-slate-300">Boundary size: <b>{selectedVenue.boundarySize}</b></span>
                      </p>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="text-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                        <span className="text-[8px] text-slate-400 font-mono block">OUTFIELD SPEED</span>
                        <span className="text-xs font-bold text-white font-mono">Ultra Rapid</span>
                      </div>
                      <div className="text-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                        <span className="text-[8px] text-slate-400 font-mono block">DEW DANGER</span>
                        <span className="text-xs font-bold text-white font-mono">High (Evening)</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Mode Multi-Format Selector Switches */}
                  <div className="mt-5 border-t border-slate-850 pt-4 flex flex-wrap gap-4 justify-between items-center">
                    {/* Format selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">FORMAT</span>
                      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                        {['Test', 'ODI', 'T20'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setActiveFormat(f as any)}
                            className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-all ${
                              activeFormat === f
                                ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tournament focus selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TOURNAMENT CONTEXT</span>
                      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                        {[
                          { id: 'WorldCup', label: 'WC' },
                          { id: 'WTC', label: 'WTC' },
                          { id: 'ChampionsTrophy', label: 'CT' },
                          { id: 'IPL', label: 'IPL' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setActiveTournament(t.id as any)}
                            className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-all ${
                              activeTournament === t.id
                                ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stadium Stats Bento Grid Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Innings Scorelines */}
                  <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-3">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest font-bold">🏟️ {activeFormat} INNINGS SCORE PROFILE</span>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[8px] text-slate-400 block font-mono">AVG RUNS</span>
                        <span className="text-sm font-bold text-white font-mono">{activeFormatStats.avgScore}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[8px] text-slate-400 block font-mono">HIGHEST</span>
                        <span className="text-[9px] font-display font-semibold text-indigo-400 mt-1 line-clamp-2 leading-tight">{activeFormatStats.highestScore}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[8px] text-slate-400 block font-mono">LOWEST</span>
                        <span className="text-[9px] font-display font-semibold text-red-400 mt-1 line-clamp-2 leading-tight">{activeFormatStats.lowestScore}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-slate-950/40 p-2 rounded-lg flex justify-between font-mono">
                      <span>Matches Recorded:</span>
                      <span className="text-white font-bold">{activeFormatStats.matchesPlayed} games</span>
                    </div>
                  </div>

                  {/* Card 2: Wickets Distribution (Pace vs Spin) */}
                  <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest font-bold">⚡ WICKET DISTRIBUTION RATIO</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Statistical ratio of wickets falling to pace seam vs spin</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span className="text-indigo-400 font-bold">Pace Seam ({activeFormatStats.wicketsPace}%)</span>
                        <span className="text-yellow-400 font-bold">Spin Grip ({activeFormatStats.wicketsSpin}%)</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-850 overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                          style={{ width: `${activeFormatStats.wicketsPace}%` }}
                        />
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                          style={{ width: `${activeFormatStats.wicketsSpin}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[8px] text-slate-500 font-mono">
                      Pace dominates on green soils, while spinning averages spikes during hot dry day sessions.
                    </p>
                  </div>

                  {/* Card 3: Pitch Strategy & Outcomes */}
                  <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest font-bold">🎲 TACTICAL MATCH OUTCOMES</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Win percentage ratios for teams chasing vs batting first</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span className="text-indigo-400 font-bold">Chasing ({activeFormatStats.chasingWon})</span>
                        <span className="text-emerald-400 font-bold">Defending ({activeFormatStats.defendingWon})</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-850 overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                          style={{ width: `${(activeFormatStats.chasingWon / (activeFormatStats.chasingWon + activeFormatStats.defendingWon)) * 100}%` }}
                        />
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ width: `${(activeFormatStats.defendingWon / (activeFormatStats.chasingWon + activeFormatStats.defendingWon)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[8px] text-slate-500 font-mono">
                      Out of {activeFormatStats.matchesPlayed} {activeFormatStats.chasingWon} won chasing, {activeFormatStats.defendingWon} won defending.
                    </p>
                  </div>

                  {/* Card 4: Tournament History */}
                  <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest font-bold">🏆 TOURNAMENT ARCHIVE REPORT</span>

                    <div className="space-y-1.5 text-[10px] text-slate-300">
                      <div className="flex justify-between border-b border-slate-850 pb-1">
                        <span>Tournament Focus:</span>
                        <span className="font-bold text-white uppercase">{activeTournament === 'WorldCup' ? 'World Cup' : activeTournament}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-1">
                        <span>Matches Played here:</span>
                        <span className="font-bold text-white font-mono">{activeTournamentStats.matchesPlayed} matches</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-850 pb-1">
                        <span>Highest Chased:</span>
                        <span className="font-bold text-indigo-400 font-mono">{activeTournamentStats.highestChased}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tournament MVP:</span>
                        <span className="font-bold text-yellow-400 flex items-center gap-1">
                          <Sparkles size={10} className="animate-pulse" />
                          {activeTournamentStats.bestPlayer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: AI pitch insights */}
                  <div className="md:col-span-2 bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-4 space-y-2.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                    <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Sparkles size={11} className="text-indigo-400" />
                      AI CONDITION & PITCH BEHAVIOR REPORT ({activeTournament})
                    </h4>

                    <div className="space-y-2 text-[10px] text-slate-300">
                      {activeTournamentStats.keyInsights?.map((insight, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <CheckCircle2 size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
