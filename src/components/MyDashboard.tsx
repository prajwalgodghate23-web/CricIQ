/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Team, Player, PushNotification, UserPreferences } from '../types';
import { Bell, Heart, Star, Shield, Users, Trophy, Volume2, Sparkles, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface MyDashboardProps {
  teams: Team[];
  preferences: UserPreferences;
  onUpdatePreferences: (updated: UserPreferences) => void;
  notifications: PushNotification[];
  onTriggerTestNotification: (title: string, message: string, type: 'wicket' | 'boundary' | 'milestone' | 'trend' | 'info') => void;
}

export default function MyDashboard({
  teams,
  preferences,
  onUpdatePreferences,
  notifications,
  onTriggerTestNotification,
}: MyDashboardProps) {
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');

  // Flat list of all players with their team references
  const allPlayers = teams.flatMap((t) =>
    t.players.map((p) => ({ ...p, teamId: t.id, teamName: t.shortName, teamColor: t.color }))
  );

  // Filtered player list based on search/team dropdown
  const filteredPlayers = allPlayers.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(playerSearch.toLowerCase()) || p.role.toLowerCase().includes(playerSearch.toLowerCase());
    const matchesTeam = selectedTeamFilter === 'all' || p.teamId === selectedTeamFilter;
    return matchesSearch && matchesTeam;
  });

  // Toggle following teams
  const handleToggleTeam = (teamId: string) => {
    let updatedTeams = [...preferences.followedTeams];
    if (updatedTeams.includes(teamId)) {
      updatedTeams = updatedTeams.filter((id) => id !== teamId);
    } else {
      updatedTeams.push(teamId);
    }
    onUpdatePreferences({
      ...preferences,
      followedTeams: updatedTeams,
    });
  };

  // Toggle following players
  const handleTogglePlayer = (playerId: string) => {
    let updatedPlayers = [...preferences.followedPlayers];
    if (updatedPlayers.includes(playerId)) {
      updatedPlayers = updatedPlayers.filter((id) => id !== playerId);
    } else {
      updatedPlayers.push(playerId);
    }
    onUpdatePreferences({
      ...preferences,
      followedPlayers: updatedPlayers,
    });
  };

  // Toggle alert settings
  const handleToggleAlert = (category: keyof UserPreferences['alerts']) => {
    onUpdatePreferences({
      ...preferences,
      alerts: {
        ...preferences.alerts,
        [category]: !preferences.alerts[category],
      },
    });
  };

  // Get followed players complete records
  const followedPlayerRecords = allPlayers.filter((p) => preferences.followedPlayers.includes(p.id));

  // Filter notification feed based on preferences
  const filteredNotifications = notifications.filter((n) => {
    // Suppress by type if alert category is toggled off
    if (n.type === 'wicket' && !preferences.alerts.wickets) return false;
    if (n.type === 'boundary' && !preferences.alerts.boundaries) return false;
    if (n.type === 'trend' && !preferences.alerts.probabilityShifts) return false;
    if (n.type === 'milestone' && !preferences.alerts.milestones) return false;
    
    return true;
  });

  // Trigger a fun personalized test notification
  const handleTestAlert = () => {
    const selectedTeamId = preferences.followedTeams[0] || teams[0].id;
    const teamObj = teams.find(t => t.id === selectedTeamId) || teams[0];
    const playerObj = teamObj.players[0];

    const alertsPool = [
      {
        title: `🔥 BOUNDARY ALERT: ${playerObj.name}`,
        message: `⭐ FAVORITE: ${playerObj.name} cracks an absolute bullet of a boundary at ${teamObj.shortName}! Dynamic win probability shifts!`,
        type: 'boundary' as const
      },
      {
        title: `🔴 WICKET ALERT: ${teamObj.shortName} Strike!`,
        message: `Your followed team ${teamObj.name} takes a massive wicket! Death overs pressure loading up.`,
        type: 'wicket' as const
      },
      {
        title: `🏆 MILESTONE: ${teamObj.shortName} Victory!`,
        message: `${teamObj.name} has crossed their target! Playoff simulations updated in real-time.`,
        type: 'milestone' as const
      },
      {
        title: `📈 market shift: ${teamObj.shortName} Swings`,
        message: `High volume betting trend alert! ${teamObj.shortName} win probability swings by 18% in the last over.`,
        type: 'trend' as const
      }
    ];

    const randomAlert = alertsPool[Math.floor(Math.random() * alertsPool.length)];
    onTriggerTestNotification(randomAlert.title, randomAlert.message, randomAlert.type);
  };

  // Recharts data for followed players comparison
  const statsChartData = followedPlayerRecords.map((p) => ({
    name: p.name.split(' ')[1] || p.name,
    strikeRate: p.strikeRate,
    average: p.average,
    color: p.teamColor,
  }));

  return (
    <div className="space-y-6" id="personalized_dashboard_container">
      {/* Welcome Hero Bento Block */}
      <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/20 to-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Sparkles size={16} />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Personalized Fan Hub</span>
          </div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight">Cric-Predict Custom Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Configure your followed squads, players, and custom alert rules to tailor the push engine.</p>
        </div>
        <button
          onClick={handleTestAlert}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/15 cursor-pointer flex items-center gap-2 shrink-0 border border-indigo-400/20"
        >
          <Bell size={13} className="animate-bounce" />
          <span>Trigger Test Alert</span>
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: Follow Favorite Teams (6 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md md:col-span-6 flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-indigo-400" />
              <h3 className="text-sm font-display font-bold text-white">Follow Favorite Squads</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">Select squads to highlight their live scores, wickets, and boundaries in the notification stream.</p>
            
            <div className="grid grid-cols-2 gap-3.5">
              {teams.map((t) => {
                const isFollowed = preferences.followedTeams.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => handleToggleTeam(t.id)}
                    className={`relative p-3.5 rounded-xl border flex flex-col items-start text-left transition-all cursor-pointer overflow-hidden group ${
                      isFollowed
                        ? 'bg-slate-950 border-indigo-500/50 shadow shadow-indigo-500/10'
                        : 'bg-slate-950/40 border-slate-850 hover:border-slate-700 hover:bg-slate-950/60'
                    }`}
                  >
                    {/* Visual accent left line */}
                    <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: t.color }} />
                    <div className="flex justify-between items-center w-full mb-1">
                      <span className="text-xl">{t.logo}</span>
                      <span className="text-[9px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                        {t.shortName}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">{t.name}</span>
                    <span className="text-[9px] text-slate-500 mt-1">Batting: {t.battingStrength} • Bowling: {t.bowlingStrength}</span>

                    {isFollowed && (
                      <span className="absolute right-2.5 bottom-2.5 text-indigo-400">
                        <Heart size={14} fill="currentColor" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="border-t border-slate-850 pt-4 mt-4 flex justify-between items-center text-[10px] text-slate-500">
            <span>Click to follow/unfollow teams</span>
            <span className="font-mono text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
              {preferences.followedTeams.length} Following
            </span>
          </div>
        </div>

        {/* Card 2: Custom Alert Configuration (6 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md md:col-span-6 flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-indigo-400" />
              <h3 className="text-sm font-display font-bold text-white">Custom Push Alert Settings</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">Enable or disable push feeds for real-time match events, probability trends, and betting spikes.</p>

            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white">🔴 Wicket Dismissals</h4>
                  <p className="text-[10px] text-slate-500">Get alerted immediately when any player gets out</p>
                </div>
                <button
                  onClick={() => handleToggleAlert('wickets')}
                  className={`w-10 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                    preferences.alerts.wickets ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all absolute top-1 ${
                      preferences.alerts.wickets ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Alert 2 */}
              <div className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white">⚡ Boundary Fours & Sixes</h4>
                  <p className="text-[10px] text-slate-500">Alert for big shots (stadium clearers and tracking drives)</p>
                </div>
                <button
                  onClick={() => handleToggleAlert('boundaries')}
                  className={`w-10 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                    preferences.alerts.boundaries ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all absolute top-1 ${
                      preferences.alerts.boundaries ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Alert 3 */}
              <div className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white">📈 Significant Win Probability Shifts</h4>
                  <p className="text-[10px] text-slate-500">Triggered on swings of {'>'} 15% in predicted match outcome</p>
                </div>
                <button
                  onClick={() => handleToggleAlert('probabilityShifts')}
                  className={`w-10 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                    preferences.alerts.probabilityShifts ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all absolute top-1 ${
                      preferences.alerts.probabilityShifts ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Alert 4 */}
              <div className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white">💸 Betting Odds & Trend Changes</h4>
                  <p className="text-[10px] text-slate-500">Get notified when betting market odds shift notably</p>
                </div>
                <button
                  onClick={() => handleToggleAlert('bettingOdds')}
                  className={`w-10 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                    preferences.alerts.bettingOdds ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all absolute top-1 ${
                      preferences.alerts.bettingOdds ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Alert 5 */}
              <div className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-white">🏆 Match Completion & Milestones</h4>
                  <p className="text-[10px] text-slate-500">Innings break, matches won, DLS targets, and ties</p>
                </div>
                <button
                  onClick={() => handleToggleAlert('milestones')}
                  className={`w-10 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                    preferences.alerts.milestones ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-all absolute top-1 ${
                      preferences.alerts.milestones ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-850 pt-3 mt-3 flex justify-between items-center text-[10px] text-amber-400 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
            <span className="flex items-center gap-1"><AlertTriangle size={11} /> Settings saved to browser memory</span>
          </div>
        </div>

        {/* Card 3: Follow Favorite Players & Profiles (5 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md md:col-span-5 flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-400" />
                <h3 className="text-sm font-display font-bold text-white">Follow Players</h3>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-bold">
                {preferences.followedPlayers.length} Active
              </span>
            </div>

            {/* Filters panel */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Search players..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Teams</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* Scrollable Player List */}
            <div className="h-[280px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((p) => {
                  const isFollowed = preferences.followedPlayers.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="p-2 bg-slate-950/40 border border-slate-850/60 rounded-xl flex items-center justify-between hover:bg-slate-950/80 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-6 rounded" style={{ backgroundColor: p.teamColor }} />
                        <div className="truncate">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span className="truncate">{p.name}</span>
                            <span className="text-[9px] text-slate-500 uppercase">{p.teamName}</span>
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {p.role} • Avg: {p.average} • SR: {p.strikeRate}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTogglePlayer(p.id)}
                        className={`p-1.5 rounded-lg transition-all border shrink-0 cursor-pointer ${
                          isFollowed
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                            : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                        title={isFollowed ? 'Unfollow player' : 'Follow player'}
                      >
                        <Star size={12} fill={isFollowed ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-slate-500">No players match search criteria.</div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-850 pt-3">
            Following highlights batsman boundaries & bowler wickets in real-time!
          </div>
        </div>

        {/* Card 4: Followed Player Analytics Chart (7 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md md:col-span-7 flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo-400" />
              <h3 className="text-sm font-display font-bold text-white">Followed Player Strike Rates</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">Interactive comparison of strike rates for your followed stars. Add more players in the panel to populate this live benchmark.</p>

            {followedPlayerRecords.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px', fontFamily: 'monospace' }}
                      itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="strikeRate" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {statsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-800 rounded-xl bg-slate-950/20 text-xs text-slate-500 p-6 text-center">
                <Star size={24} className="text-slate-700 mb-2 animate-pulse" />
                <span>No followed players yet.</span>
                <span className="text-[10px] text-slate-600 mt-1">Select players in the sidebar list to see a live visual strike rate comparison.</span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-850 pt-3">
            Career Strike Rate comparisons sourced dynamically from seeded rosters.
          </div>
        </div>

        {/* Card 5: Personalized Live Alert Stream (12 cols) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md md:col-span-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-indigo-400" />
              <h3 className="text-sm font-display font-bold text-white">Your Custom Filtered Alert Feed</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">
              Showing {filteredNotifications.length} alerts matching preferences
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">This feed displays alerts that are currently enabled in your configurations. Alerts involving your followed squads or followed players are automatically highlighted.</p>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => {
                // Determine if this notification relates to followed teams or players
                const isPersonalized = 
                  preferences.followedTeams.some(teamId => {
                    const team = teams.find(t => t.id === teamId);
                    return team && (n.message.includes(team.shortName) || n.title.includes(team.shortName) || n.message.includes(team.name));
                  }) ||
                  preferences.followedPlayers.some(playerId => {
                    const player = allPlayers.find(p => p.id === playerId);
                    return player && (n.message.includes(player.name) || n.title.includes(player.name));
                  });

                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPersonalized
                        ? 'bg-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                        : 'bg-slate-950/40 border-slate-850'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        {isPersonalized ? (
                          <span className="text-xs bg-amber-500/15 text-amber-400 font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-amber-500/10">
                            <Star size={10} fill="currentColor" />
                            <span>FAVORITE UPDATE</span>
                          </span>
                        ) : (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            n.type === 'wicket' ? 'bg-red-500/10 text-red-400 border-red-500/10' :
                            n.type === 'boundary' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/10' :
                            n.type === 'trend' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                            'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            {n.type.toUpperCase()}
                          </span>
                        )}
                        <h4 className={`text-xs font-bold ${isPersonalized ? 'text-amber-300' : 'text-slate-200'}`}>
                          {n.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className={`text-xs ${isPersonalized ? 'text-slate-300' : 'text-slate-400'} mt-1`}>
                      {n.message}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-850 rounded-xl bg-slate-950/10 text-xs text-slate-500">
                <Bell size={24} className="mx-auto text-slate-700 mb-2 animate-pulse" />
                <span>No alerts matching your preferences have been received yet.</span>
                <span className="text-[10px] text-slate-600 block mt-1">Start a match simulation in the Live Match tab or toggle active settings.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
