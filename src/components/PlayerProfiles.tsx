/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Team, Player } from '../types';
import { User, Activity, ShieldCheck, Target, TrendingUp, AlertCircle, Award, Star, Search, Shield, ChevronRight, Compass } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PlayerProfilesProps {
  teams: Team[];
}

export default function PlayerProfiles({ teams }: PlayerProfilesProps) {
  const [squadType, setSquadType] = useState<'ipl' | 'international'>('ipl');
  const [selectedFormat, setSelectedFormat] = useState<'Test' | 'ODI' | 'T20'>('T20');
  
  // Filter teams of active type
  const typeTeams = teams.filter((t) => t.type === squadType || (!t.type && squadType === 'ipl'));
  
  const [selectedTeamId, setSelectedTeamId] = useState<string>(typeTeams[0]?.id || 'rcb');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(typeTeams[0]?.players[0]?.id || 'virat_kohli');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle squad type change (IPL vs International)
  const handleSquadTypeChange = (type: 'ipl' | 'international') => {
    setSquadType(type);
    const filteredTeams = teams.filter((t) => t.type === type);
    if (filteredTeams.length > 0) {
      setSelectedTeamId(filteredTeams[0].id);
      if (filteredTeams[0].players.length > 0) {
        setSelectedPlayerId(filteredTeams[0].players[0].id);
      }
    } else {
      setSelectedTeamId('all');
    }
  };

  // Flat list of all players with their team references
  const allPlayers = teams.flatMap((t) => 
    t.players.map((p) => ({ 
      ...p, 
      teamId: t.id, 
      teamName: t.shortName, 
      teamColor: t.color,
      teamType: t.type || 'ipl'
    }))
  );

  // Filter list of players for selector sidebar based on squadType and filters
  const sidebarPlayers = allPlayers.filter((p) => {
    const matchesSquadType = p.teamType === squadType;
    const matchesTeam = selectedTeamId === 'all' || p.teamId === selectedTeamId;
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSquadType && matchesTeam && matchesRole && matchesSearch;
  });

  const currentPlayer = allPlayers.find((p) => p.id === selectedPlayerId) || sidebarPlayers[0] || allPlayers[0];

  // Helper to safely fetch stats for radar
  const getRadarData = (player: any) => {
    if (!player) return [];
    
    // Check if format-specific stats are available for this player
    const hasFormats = player.formats && player.formats[selectedFormat];
    const avg = hasFormats ? player.formats[selectedFormat].average : player.average;
    const sr = hasFormats ? player.formats[selectedFormat].strikeRate : player.strikeRate;
    const econ = hasFormats ? player.formats[selectedFormat].economy : player.economy;

    if (player.role === 'Bowler') {
      const displayEcon = econ !== undefined ? econ : 8.0;
      const displaySR = sr !== undefined ? sr : 24.0;
      return [
        { subject: 'Economy Rate', value: Math.max(10, 100 - displayEcon * 9), displayValue: displayEcon },
        { subject: 'Wicket Strike Rate', value: displaySR ? Math.min(100, (140 / displaySR) * 75) : 50, displayValue: displaySR },
        { subject: 'Catch Success %', value: player.catchSuccessRate || 80, displayValue: player.catchSuccessRate },
        { subject: 'Run Out Assists', value: Math.min(100, (player.runOutAssists || 0) * 12), displayValue: player.runOutAssists },
        { subject: 'Dot Ball %', value: player.dotBallPercentage || 45, displayValue: player.dotBallPercentage },
      ];
    } else {
      // Batsman or All-Rounder
      const displayAvg = avg !== undefined ? avg : 30.0;
      const displaySR = sr !== undefined ? sr : 120.0;
      return [
        { subject: 'Batting Average', value: Math.min(100, displayAvg * 1.8), displayValue: displayAvg },
        { subject: 'Strike Rate', value: Math.min(100, (displaySR / 160) * 100), displayValue: displaySR },
        { subject: 'Recent Form', value: (player.form ? player.form.reduce((sum: number, f: number) => sum + f, 0) / player.form.length : 7) * 10, displayValue: player.form ? (player.form.reduce((sum: number, f: number) => sum + f, 0) / player.form.length).toFixed(1) : '7.0' },
        { subject: 'Catch Success %', value: player.catchSuccessRate || 85, displayValue: player.catchSuccessRate },
        { subject: 'Run Out Assists', value: Math.min(100, (player.runOutAssists || 0) * 10), displayValue: player.runOutAssists },
      ];
    }
  };

  const radarData = getRadarData(currentPlayer);

  // Form trend chart data from recentScores
  const getFormTrendData = (player: any) => {
    if (!player) return [];
    if (!player.recentScores || player.recentScores.length === 0) {
      return (player.form || [7, 8, 6, 9, 8]).map((val: number, idx: number) => ({
        match: `Match ${idx + 1}`,
        Rating: val,
      }));
    }
    return player.recentScores.map((score: string, idx: number) => {
      const numericScore = parseInt(score.replace('*', '')) || 0;
      return {
        match: `Match ${idx + 1}`,
        Score: numericScore,
        Rating: player.form ? player.form[idx] : 7,
      };
    });
  };

  const trendData = getFormTrendData(currentPlayer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="player_profiles_analysis_container">
      
      {/* Sidebar Selector (4 cols) */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur-md lg:col-span-4 flex flex-col h-[700px] justify-between">
        <div className="space-y-4">
          
          {/* Squad Category Toggles (IPL vs International) */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => handleSquadTypeChange('ipl')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                squadType === 'ipl'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              IPL Teams
            </button>
            <button
              onClick={() => handleSquadTypeChange('international')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                squadType === 'international'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              International
            </button>
          </div>

          <div className="flex items-center gap-2">
            <User size={16} className="text-emerald-400" />
            <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">
              {squadType === 'ipl' ? 'IPL' : 'International'} Squad Roster
            </h3>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Squads</option>
                {typeTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.shortName}
                  </option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicketkeeper">Wicketkeeper</option>
              </select>
            </div>
          </div>

          {/* Scrollable Selector Sidebar */}
          <div className="h-[430px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
            {sidebarPlayers.length > 0 ? (
              sidebarPlayers.map((p) => {
                const isSelected = p.id === selectedPlayerId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayerId(p.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between hover:bg-slate-950/80 transition-all text-xs text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500/50 shadow shadow-emerald-500/10'
                        : 'bg-slate-950/20 border-slate-850/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-7 rounded" style={{ backgroundColor: p.teamColor }} />
                      <div className="truncate">
                        <span className="font-semibold text-white block truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.teamName} • {p.role}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={12} className={isSelected ? 'text-emerald-400' : 'text-slate-600'} />
                  </button>
                );
              })
            ) : (
              <div className="text-center py-20 text-xs text-slate-600">No players match current search filters.</div>
            )}
          </div>

        </div>

        <div className="text-[9px] font-mono text-slate-500 border-t border-slate-850 pt-2 text-center">
          Showing {sidebarPlayers.length} of {allPlayers.filter(p => p.teamType === squadType).length} {squadType === 'ipl' ? 'IPL' : 'International'} Players
        </div>
      </div>

      {/* Profile Metrics Sheets and Charts (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Profile Card Header (Bento block) */}
        {currentPlayer && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-4 top-4 text-6xl opacity-5 select-none font-sans font-bold">
              {currentPlayer.teamName}
            </div>

            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
              {/* Color accent bar */}
              <div className="w-2.5 h-16 rounded" style={{ backgroundColor: currentPlayer.teamColor }} />
              
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400">
                    {currentPlayer.role}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400">
                    {squadType === 'ipl' ? 'IPL Franchise' : 'National Squad'} Star
                  </span>
                </div>
                <h2 className="text-xl font-display font-bold text-white">{currentPlayer.name}</h2>
                <p className="text-xs text-slate-400">Personal player profile & career stats analyzer card.</p>
              </div>

              {/* Quick Metrics Badge */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-center w-24">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Matches</span>
                  <span className="text-sm font-bold text-white font-mono">{currentPlayer.matchesPlayed || 82}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-center w-24">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Form rating</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {currentPlayer.form ? (currentPlayer.form.reduce((sum, f) => sum + f, 0) / currentPlayer.form.length).toFixed(1) : '7.5'}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats Grid */}
        {currentPlayer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Detailed Statistics List (Bento block) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-[380px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <h3 className="text-sm font-display font-bold text-white">Statistics Breakdown</h3>
                  </div>
                  {currentPlayer.formats && (
                    <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-850">
                      {(['Test', 'ODI', 'T20'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setSelectedFormat(fmt)}
                          className={`px-2.5 py-0.5 text-[9px] font-bold rounded transition-all cursor-pointer ${
                            selectedFormat === fmt
                              ? 'bg-emerald-500 text-slate-950'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {(() => {
                  const hasFormats = currentPlayer.formats && currentPlayer.formats[selectedFormat];
                  const stats = hasFormats ? currentPlayer.formats[selectedFormat] : null;
                  
                  const runsVal = stats ? stats.runs : (currentPlayer.careerRuns || '0');
                  const wicketsVal = stats ? stats.wickets : (currentPlayer.careerWickets || '0');
                  const avgVal = stats ? stats.average : (currentPlayer.average || 'N/A');
                  const srVal = stats ? stats.strikeRate : (currentPlayer.strikeRate || 'N/A');
                  const economyVal = stats ? stats.economy : currentPlayer.economy;
                  const highestScoreVal = stats ? stats.highestScore : currentPlayer.highestScore;
                  const bestBowlingVal = stats ? stats.bestBowling : currentPlayer.bestBowling;

                  return (
                    <>
                      <div className="space-y-2.5 text-xs text-slate-400">
                        <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                          <span>🏏 {hasFormats ? `${selectedFormat} Runs` : 'Career Runs'} / Wickets</span>
                          <span className="text-white font-semibold font-mono">
                            {runsVal} Runs / {wicketsVal} Wickets
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                          <span>🎯 {hasFormats ? `${selectedFormat} Average` : 'Career Average'}</span>
                          <span className="text-white font-semibold font-mono">{avgVal}</span>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                          <span>⚡ {hasFormats ? `${selectedFormat} Strike Rate` : 'Career Strike Rate'}</span>
                          <span className="text-white font-semibold font-mono">{srVal}</span>
                        </div>

                        {economyVal !== undefined && (
                          <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                            <span>📉 {hasFormats ? `${selectedFormat} Economy` : 'Economy Rate'}</span>
                            <span className="text-white font-semibold font-mono">{economyVal} rpo</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                          <span>🧤 Catch Success Rate</span>
                          <span className="text-white font-semibold font-mono">
                            {currentPlayer.catchSuccessRate ? `${currentPlayer.catchSuccessRate}%` : '85.0%'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                          <span>🏃 Run Out Assists</span>
                          <span className="text-white font-semibold font-mono">
                            {currentPlayer.runOutAssists !== undefined ? currentPlayer.runOutAssists : '4'}
                          </span>
                        </div>

                        {currentPlayer.dotBallPercentage !== undefined && (
                          <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-850 rounded-lg">
                            <span>⚪ Dot Ball Percentage</span>
                            <span className="text-white font-semibold font-mono">{currentPlayer.dotBallPercentage}%</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono mt-3 text-center">
                        Best Record: {highestScoreVal ? `H.S: ${highestScoreVal}` : ''} {bestBowlingVal ? `B.B: ${bestBowlingVal}` : ''}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Performance Radar Analytics (Bento block) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-emerald-400" />
                  <h3 className="text-sm font-display font-bold text-white">Attribute Breakdown Radar</h3>
                </div>
                <p className="text-[10px] text-slate-500 mb-4">Normative assessment of player attributes against tier-1 benchmark.</p>
              </div>

              <div className="h-56 w-full flex justify-center">
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="#1e293b" />
                      <Radar
                        name={currentPlayer.name}
                        dataKey="value"
                        stroke={currentPlayer.teamColor}
                        fill={currentPlayer.teamColor}
                        fillOpacity={0.2}
                      />
                      <Tooltip
                        content={({ payload }) => {
                          if (!payload || payload.length === 0) return null;
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#090d16] border border-slate-800 rounded-xl p-2.5 shadow-lg text-[10px] font-mono">
                              <p className="text-slate-400 uppercase font-bold">{item.subject}</p>
                              <p className="text-emerald-400 text-xs font-bold mt-1">Value: {item.displayValue}</p>
                            </div>
                          );
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">Radar metrics unavailable</div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 font-mono text-center">
                Weighted against average baseline performance.
              </div>
            </div>

          </div>
        )}

        {/* Tactical Matchups & Shot/Delivery Visualizations (New Bento Card) */}
        {currentPlayer && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-emerald-400 animate-spin-slow" />
                <h3 className="text-sm font-display font-bold text-white">Tactical Analysis & Pitch/Field Hotspots</h3>
              </div>
              <div className="text-[10px] bg-slate-950 border border-slate-850 text-emerald-400 px-2 py-1 rounded font-mono">
                Role: {currentPlayer.role}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Descriptive scouting report */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-900 pb-1.5">Scouting & Matchup Report</span>
                  
                  {/* Primary Strength / Pitching length */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                      {currentPlayer.role === 'Bowler' ? 'BOWLING SPECIALTY' : 'PRIMARY STRONG POINT'}
                    </span>
                    <p className="text-xs text-white font-semibold pl-3">
                      {currentPlayer.strongPointArea || 'Excellent cover drive & straight power lofts.'}
                    </p>
                  </div>

                  {/* Primary Weakness */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-rose-400 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full inline-block" />
                      CRITICAL TACTICAL WEAKNESS
                    </span>
                    <p className="text-xs text-slate-300 pl-3">
                      {currentPlayer.pitchWeakness || 'Slow left-arm spin on sticky/turning tracks.'}
                    </p>
                  </div>

                  {/* Delivery Length for Bowlers */}
                  {(currentPlayer.role === 'Bowler' || currentPlayer.role === 'All-Rounder') && currentPlayer.pitchingLength && (
                    <div className="space-y-1 border-t border-slate-900 pt-3">
                      <span className="text-[9px] font-mono text-sky-400 flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 bg-sky-400 rounded-full inline-block" />
                        DELIVERY LENGTH PREFERENCE
                      </span>
                      <p className="text-xs text-slate-300 pl-3 font-mono">
                        {currentPlayer.pitchingLength}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/20 border border-slate-850/50 p-3.5 rounded-lg text-xs text-slate-400 leading-relaxed">
                  ℹ️ <strong>Strategic Insight:</strong> {currentPlayer.role === 'Bowler' 
                    ? `Optimal deployment in the ${currentPlayer.pitchingLength?.toLowerCase().includes('yorker') ? 'death overs' : 'middle overs'} utilizing variations. Induces a ${currentPlayer.dotBallPercentage || 45}% dot ball density.`
                    : `Telemetry records a strong ${currentPlayer.runsScoredSide?.offside || 40}% offside split. Deploy tight, slower-cutters outside-off to choke their primary scoring boundaries.`}
                </div>
              </div>

              {/* Dynamic Map Visualization (Ground Shot Map vs Pitch Length map) */}
              <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center min-h-[250px] relative">
                
                {currentPlayer.role === 'Bowler' ? (
                  // BOWLER PITCHING LENGTH MAP (Visual vertical strip)
                  <div className="w-full flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-3 text-center tracking-wider">Preferred Delivery Pitching Lengths</span>
                    
                    <div className="w-48 bg-slate-900 border border-slate-800 rounded-lg p-2.5 relative flex flex-col gap-1.5">
                      {/* Top crease */}
                      <div className="h-5 border-b border-slate-700/40 flex items-center justify-center text-[8px] text-slate-500 font-mono tracking-widest">
                        BATTSMAN STUMPS
                      </div>

                      {/* Yorker Length */}
                      <div className={`p-2 rounded text-center transition-all ${
                        currentPlayer.pitchingLength?.toLowerCase().includes('yorker') 
                          ? 'bg-rose-500/20 border-2 border-rose-500 text-rose-300 font-bold scale-[1.02] shadow-lg shadow-rose-500/10' 
                          : 'bg-slate-950/30 border border-slate-850/50 text-slate-500'
                      }`}>
                        <span className="text-[9px] block">Yorker Blockhole (&lt; 2m)</span>
                        <span className="text-[7.5px] font-mono opacity-80 uppercase tracking-widest">
                          {currentPlayer.pitchingLength?.toLowerCase().includes('yorker') ? '★ Principal Delivery Strike' : 'Secondary option'}
                        </span>
                      </div>

                      {/* Full Length */}
                      <div className={`p-2 rounded text-center transition-all ${
                        currentPlayer.pitchingLength?.toLowerCase().includes('full') 
                          ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-300 font-bold scale-[1.02] shadow-lg shadow-amber-500/10' 
                          : 'bg-slate-950/30 border border-slate-850/50 text-slate-500'
                      }`}>
                        <span className="text-[9px] block">Full Pitch (2m - 4m)</span>
                        <span className="text-[7.5px] font-mono opacity-80 uppercase tracking-widest">
                          {currentPlayer.pitchingLength?.toLowerCase().includes('full') ? '★ Principal Delivery Strike' : 'Secondary option'}
                        </span>
                      </div>

                      {/* Good Length */}
                      <div className={`p-2 rounded text-center transition-all ${
                        (currentPlayer.pitchingLength?.toLowerCase().includes('good') || !currentPlayer.pitchingLength) 
                          ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 font-bold scale-[1.02] shadow-lg shadow-emerald-500/10' 
                          : 'bg-slate-950/30 border border-slate-850/50 text-slate-500'
                      }`}>
                        <span className="text-[9px] block">Good Length (4m - 6m)</span>
                        <span className="text-[7.5px] font-mono opacity-80 uppercase tracking-widest">
                          {(currentPlayer.pitchingLength?.toLowerCase().includes('good') || !currentPlayer.pitchingLength) ? '★ Principal Delivery Strike' : 'Secondary option'}
                        </span>
                      </div>

                      {/* Short Pitch */}
                      <div className={`p-2 rounded text-center transition-all ${
                        currentPlayer.pitchingLength?.toLowerCase().includes('short') || currentPlayer.pitchingLength?.toLowerCase().includes('bouncer')
                          ? 'bg-sky-500/20 border-2 border-sky-500 text-sky-300 font-bold scale-[1.02] shadow-lg shadow-sky-500/10' 
                          : 'bg-slate-950/30 border border-slate-850/50 text-slate-500'
                      }`}>
                        <span className="text-[9px] block">Short Length / Bouncer (&gt; 7m)</span>
                        <span className="text-[7.5px] font-mono opacity-80 uppercase tracking-widest">
                          {currentPlayer.pitchingLength?.toLowerCase().includes('short') || currentPlayer.pitchingLength?.toLowerCase().includes('bouncer') ? '★ Principal Delivery Strike' : 'Secondary option'}
                        </span>
                      </div>

                      {/* Bottom crease */}
                      <div className="h-5 border-t border-slate-700/40 flex items-center justify-center text-[8px] text-slate-500 font-mono tracking-widest mt-1">
                        BOWLER STRIP
                      </div>
                    </div>
                  </div>
                ) : (
                  // BATSMAN SHOT MAP (Circular Cricket Ground)
                  <div className="w-full flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-3 text-center tracking-wider">Ground Shot Scoring Splits</span>
                    
                    {/* Visual Green Cricket Field */}
                    <div className="w-48 h-48 rounded-full bg-emerald-950/20 border-2 border-emerald-500/30 relative flex items-center justify-center shadow-inner select-none">
                      
                      {/* 30 yard circle */}
                      <div className="w-32 h-32 rounded-full border border-dashed border-emerald-500/20 absolute" />

                      {/* Central Pitch Strip */}
                      <div className="w-4 h-12 bg-amber-900/30 border border-amber-800 rounded absolute flex flex-col justify-between py-0.5">
                        <div className="w-full h-0.5 bg-white/20" />
                        <div className="w-full h-0.5 bg-white/20" />
                      </div>

                      {/* Offside (Left Field overlay) */}
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-center shadow-md shadow-black/40 hover:border-emerald-500/50 transition-all group cursor-default">
                        <span className="text-[7.5px] font-mono text-slate-400 uppercase">Offside</span>
                        <span className="text-[11px] font-bold text-emerald-400 font-mono">{currentPlayer.runsScoredSide?.offside || 40}%</span>
                        <span className="text-slate-600 text-[8px] group-hover:text-emerald-400 transition-colors">← Drive</span>
                      </div>

                      {/* Legside (Right Field overlay) */}
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-center shadow-md shadow-black/40 hover:border-emerald-500/50 transition-all group cursor-default">
                        <span className="text-[7.5px] font-mono text-slate-400 uppercase">Legside</span>
                        <span className="text-[11px] font-bold text-emerald-400 font-mono">{currentPlayer.runsScoredSide?.legside || 35}%</span>
                        <span className="text-slate-600 text-[8px] group-hover:text-emerald-400 transition-colors">Pull →</span>
                      </div>

                      {/* Straight (Bottom Field overlay) */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-center shadow-md shadow-black/40 hover:border-emerald-500/50 transition-all group cursor-default">
                        <span className="text-[7.5px] font-mono text-slate-400 uppercase">Straight</span>
                        <span className="text-[11px] font-bold text-emerald-400 font-mono">{currentPlayer.runsScoredSide?.straight || 25}%</span>
                        <span className="text-slate-600 text-[8px] group-hover:text-emerald-400 transition-colors">↓ Loft</span>
                      </div>

                      {/* Compass directions for a cool tech feel */}
                      <div className="absolute top-2 text-[7px] font-mono text-emerald-500/40 uppercase tracking-widest">BOUNDARY ROPE</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Trends & Recent Output */}
        {currentPlayer && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-emerald-400" />
              <h3 className="text-sm font-display font-bold text-white">Recent Output Trend Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Chart Area */}
              <div className="md:col-span-8 h-48 w-full">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="match" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      />
                      {trendData[0] && trendData[0].Score !== undefined ? (
                        <Line
                          type="monotone"
                          dataKey="Score"
                          name="Match Score"
                          stroke={currentPlayer.teamColor}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ) : (
                        <Line
                          type="monotone"
                          dataKey="Rating"
                          name="Match Rating"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">Score logs unavailable</div>
                )}
              </div>

              {/* List Scores */}
              <div className="md:col-span-4 bg-slate-950/40 border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Recent Match Outputs</span>
                
                {currentPlayer.recentScores && currentPlayer.recentScores.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {currentPlayer.recentScores.map((score, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                        <span className="text-[8px] font-mono text-slate-500 block font-bold">M {idx + 1}</span>
                        <span className="font-semibold text-white font-mono mt-0.5 block">{score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 text-center py-6">
                    Match scorelogs not available.Sourced via performance rating models.
                  </div>
                )}

                <p className="text-[10px] text-slate-400 mt-4 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-850">
                  ⭐ <strong>Analyst Insight:</strong> Overall form is rated high. The player is showing consistent bat/ball controls and displays a steady projection for matches of high-stake profiles.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
