/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Team, Venue, PredictionResult, PushNotification, UserPreferences, HistoricalMatch } from './types';
import AIPredictor from './components/AIPredictor';
import LiveMatchCenter from './components/LiveMatchCenter';
import StatsDashboard from './components/StatsDashboard';
import NotificationCenter from './components/NotificationCenter';
import FanPoll from './components/FanPoll';
import MyDashboard from './components/MyDashboard';
import HistoricalDashboard from './components/HistoricalDashboard';
import PlayerProfiles from './components/PlayerProfiles';
import ICCStandingsAndNews from './components/ICCStandingsAndNews';
import { Brain, Radio, BarChart3, Bell, Shield, Activity, Calendar, Compass, Sparkles, UserCheck, History, User, Newspaper, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'predict' | 'live' | 'stats' | 'dashboard' | 'history' | 'players' | 'news_rankings'>('predict');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('cric_theme') as 'light' | 'dark') || 'dark');

  // Sync theme
  useEffect(() => {
    localStorage.setItem('cric_theme', theme);
  }, [theme]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [headToHead, setHeadToHead] = useState<any[]>([]);
  const [historicalMatches, setHistoricalMatches] = useState<HistoricalMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // User Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('cric_user_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      followedTeams: ['csk', 'rcb'],
      followedPlayers: ['virat_kohli', 'ms_dhoni'],
      alerts: {
        wickets: true,
        boundaries: true,
        probabilityShifts: true,
        bettingOdds: true,
        milestones: true,
      },
    };
  });

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('cric_user_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Global Notification Stack
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [toasts, setToasts] = useState<PushNotification[]>([]);

  // Sound enable state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Fetch initial data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/metadata');
        const data = await response.json();
        setTeams(data.teams);
        setVenues(data.venues);
        setHeadToHead(data.headToHeadRecords);
        setHistoricalMatches(data.historicalMatches || []);
      } catch (e) {
        console.error('Error fetching cricket metadata from Express API:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Live clock ticks
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Universal trigger for push alerts
  const handleTriggerNotification = (
    title: string,
    message: string,
    type: 'wicket' | 'boundary' | 'milestone' | 'trend' | 'info'
  ) => {
    // Globally filter push alerts based on user-defined custom categories
    if (type === 'wicket' && !preferences.alerts.wickets) return;
    if (type === 'boundary' && !preferences.alerts.boundaries) return;
    if (type === 'trend' && !preferences.alerts.probabilityShifts) return;
    if (type === 'milestone' && !preferences.alerts.milestones) return;

    const newAlert: PushNotification = {
      id: `alert_${Date.now()}_${Math.random()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setNotifications((prev) => [newAlert, ...prev]);
    setToasts((prev) => [...prev, newAlert]);

    // Automatically dismiss toast after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newAlert.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAllAlerts = () => {
    setNotifications([]);
    setToasts([]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Seed initial alerts when match pred completed
  const handlePredictCompleted = (prediction: PredictionResult) => {
    handleTriggerNotification(
      `🎯 NEW PREDICTION MODEL`,
      `Outcome computed: ${prediction.matchup.teamA} has a ${prediction.winProbability.teamA}% chance of victory over ${prediction.matchup.teamB}.`,
      'info'
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-slate-900' : 'bg-[#0A0E17] text-slate-100 selection:bg-indigo-500 selection:text-slate-900'
    }`} id="app_root">
      {/* Background Ambience Stadium Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Banner & Header */}
      <header className={`border-b sticky top-0 z-30 transition-colors duration-300 ${
        theme === 'light' ? 'bg-white/80 border-slate-200' : 'border-slate-850 bg-slate-900/40'
      } backdrop-blur-md`} id="main_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold shadow-md shadow-emerald-500/5">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-lg font-display font-bold tracking-tight leading-none ${
                  theme === 'light' ? 'text-slate-950' : 'text-white'
                }`}>CricIQ <span className="text-emerald-500">AI</span></h1>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded">PRO v5.0</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-widest">Predictive Cricket Intelligence & World Standings</p>
            </div>
          </div>

          {/* Clean Info Bar & Theme Switcher */}
          <div className="flex items-center gap-4 text-xs">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
              }`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono border ${
              theme === 'light'
                ? 'text-slate-600 bg-slate-100 border-slate-200'
                : 'text-slate-400 bg-slate-950 border-slate-850'
            }`}>
              <Calendar size={12} className="text-emerald-500" />
              <span>{currentTime || '00:00:00'} UTC</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" id="workspace_container">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/15 border-t-indigo-400 animate-spin mb-4" />
            <h3 className="text-sm font-display font-semibold text-slate-300">Booting Prediction Engine</h3>
            <p className="text-xs text-slate-500 mt-1">Spinning up Express full-stack services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Primary Navigation & Work area */}
            <div className="xl:col-span-9 space-y-6">
              {/* Dashboard Navigation Tabs */}
              <div className={`p-1.5 border rounded-2xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 transition-colors duration-300 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
              }`} id="tab_navigation">
                <button
                  onClick={() => setActiveTab('predict')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'predict'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <Brain size={14} />
                  <span className="hidden sm:inline">Match Predictor (AI)</span>
                  <span className="inline sm:hidden">Predict</span>
                </button>

                <button
                  onClick={() => setActiveTab('live')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'live'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <Radio size={14} className={activeTab === 'live' ? 'animate-pulse text-emerald-500' : ''} />
                  <span className="hidden sm:inline">Live Simulator</span>
                  <span className="inline sm:hidden">Live</span>
                </button>

                <button
                  onClick={() => setActiveTab('news_rankings')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'news_rankings'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <Newspaper size={14} />
                  <span className="hidden sm:inline">ICC Standings & News</span>
                  <span className="inline sm:hidden">ICC Standings</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <UserCheck size={14} />
                  <span className="hidden sm:inline">Personalized Fan Hub</span>
                  <span className="inline sm:hidden">Fan Hub</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <History size={14} />
                  <span className="hidden sm:inline">Historical Archives</span>
                  <span className="inline sm:hidden">History</span>
                </button>

                <button
                  onClick={() => setActiveTab('players')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'players'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <User size={14} />
                  <span className="hidden sm:inline">Player Profiles</span>
                  <span className="inline sm:hidden">Players</span>
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                    activeTab === 'stats'
                      ? theme === 'light'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold shadow-sm'
                        : 'bg-gradient-to-r from-indigo-500/15 to-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-bold shadow'
                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-500/5 border border-transparent'
                  }`}
                >
                  <BarChart3 size={14} />
                  <span className="hidden sm:inline">Metrics & Records</span>
                  <span className="inline sm:hidden">Stats</span>
                </button>
              </div>

              {/* Active Tab Component Render */}
              <div id="active_tab_view">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'predict' && (
                      <AIPredictor
                        teams={teams}
                        venues={venues}
                        onPredict={handlePredictCompleted}
                        theme={theme}
                      />
                    )}
                    {activeTab === 'live' && (
                      <LiveMatchCenter
                        teams={teams}
                        venues={venues}
                        onTriggerNotification={handleTriggerNotification}
                      />
                    )}
                    {activeTab === 'news_rankings' && (
                      <ICCStandingsAndNews
                        theme={theme}
                      />
                    )}
                    {activeTab === 'dashboard' && (
                      <MyDashboard
                        teams={teams}
                        preferences={preferences}
                        onUpdatePreferences={setPreferences}
                        notifications={notifications}
                        onTriggerTestNotification={handleTriggerNotification}
                      />
                    )}
                    {activeTab === 'history' && (
                      <HistoricalDashboard
                        teams={teams}
                        venues={venues}
                        historicalMatches={historicalMatches}
                        headToHeadRecords={headToHead}
                      />
                    )}
                    {activeTab === 'players' && (
                      <PlayerProfiles
                        teams={teams}
                      />
                    )}
                    {activeTab === 'stats' && (
                      <StatsDashboard
                        teams={teams}
                        venues={venues}
                        headToHeadRecords={headToHead}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Global Alert Log Drawer & Fan Poll */}
            <div className="xl:col-span-3 space-y-6 xl:sticky xl:top-[84px]">
              <NotificationCenter
                notifications={notifications}
                toasts={toasts}
                onDismissToast={handleDismissToast}
                onClearAll={handleClearAllAlerts}
                onMarkAllAsRead={handleMarkAllAsRead}
                theme={theme}
              />
              <FanPoll theme={theme} />
            </div>
          </div>
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="border-t border-slate-900 bg-[#04060b] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-medium">© 2026 IPL & Cricket Prediction System • Bento Grid ML Sandbox Dashboard</p>
          <p className="max-w-2xl mx-auto text-[10px] text-slate-650 leading-relaxed">
            All team rosters, stadium averages, player stats, head-to-head ratios, and live events match commentary are simulated or statically modeled. AI predictions are dynamically formatted using Gemini 3.5 LLM endpoints. All simulated betting volumes or betting odds indexes are for mathematical demonstration purposes and do not involve real currency.
          </p>
        </div>
      </footer>
    </div>
  );
}
