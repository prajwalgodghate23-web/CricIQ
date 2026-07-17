/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Newspaper, Trophy, Users, Shield, Award, Clock, ArrowUpRight, TrendingUp, RefreshCw, Star, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ICCStandingsAndNewsProps {
  theme: 'light' | 'dark';
}

// Interfaces for Standings and Rankings
interface TeamStanding {
  rank: number;
  team: string;
  code: string;
  logo: string;
  matches: number;
  points: number;
  rating: number;
}

interface PlayerRanking {
  rank: number;
  name: string;
  team: string;
  rating: number;
  countryCode: string;
  change?: 'up' | 'down' | 'same';
}

export default function ICCStandingsAndNews({ theme }: ICCStandingsAndNewsProps) {
  // Navigation states: 'standings' | 'rankings' | 'news'
  const [subTab, setSubTab] = useState<'news' | 'standings' | 'rankings'>('news');
  
  // Standings active format: 'Test' | 'ODI' | 'T20I'
  const [standingsFormat, setStandingsFormat] = useState<'Test' | 'ODI' | 'T20I'>('Test');

  // Rankings active format & category
  const [rankingsFormat, setRankingsFormat] = useState<'Test' | 'ODI' | 'T20I'>('Test');
  const [rankingsCategory, setRankingsCategory] = useState<'batting' | 'bowling' | 'allrounder'>('batting');

  // News states
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Realistic Cricket News Feed Data
  const [newsFeed, setNewsFeed] = useState([
    {
      id: 1,
      title: 'IPL 2026 Trade Window: Crucial Retentions Confirmed as franchises eye squad balance',
      summary: 'With the mega-retention deadline fast approaching, RCB and CSK have locked in their core rosters. Scouts are hunting for specialist death bowlers and hard-hitting spin-bashers to optimize for high-altitude venues.',
      time: '12 minutes ago',
      source: 'CricIQ Intelligence',
      category: 'IPL 2026',
      readTime: '3 min read',
      sentiment: 'neutral',
      hotness: 94
    },
    {
      id: 2,
      title: 'WTC Finals Standings: Team India strengthens position with a high-stakes series lead',
      summary: 'A masterful century by Yashasvi Jaiswal has propelled India to a commanding victory, widening the gap at the top of the World Test Championship table. Australia remains locked at second under severe pressure.',
      time: '45 minutes ago',
      source: 'ICC Match Center',
      category: 'World Test Championship',
      readTime: '5 min read',
      sentiment: 'positive',
      hotness: 89
    },
    {
      id: 3,
      title: 'Jasprit Bumrah rested for upcoming white-ball series; Arshdeep Singh to lead pace battery',
      summary: 'The national selection committee has opted to rest key bowling assets to prevent workload fatigue ahead of the ICC Champions Trophy. Dynamic left-armer Arshdeep will spearhead the primary attack.',
      time: '2 hours ago',
      source: 'CricIQ Insider',
      category: 'International Series',
      readTime: '2 min read',
      sentiment: 'neutral',
      hotness: 78
    },
    {
      id: 4,
      title: 'Chinnaswamy Pitch Curator guarantees high-scoring surface for the Bengaluru leg',
      summary: 'Short boundary layouts (58m square) coupled with a renewed sub-surface grass layer will trigger record boundary aggregates. Captains winning the toss will undoubtedly opt to chase to counter the heavy dew factor.',
      time: '4 hours ago',
      source: 'Venue Report',
      category: 'Pitch Report',
      readTime: '4 min read',
      sentiment: 'positive',
      hotness: 85
    },
    {
      id: 5,
      title: 'Wanindu Hasaranga climbs to Top Spot in ICC Men\'s T20I Bowlers Rankings',
      summary: 'Following a magnificent spell in the Asia qualifiers, Sri Lanka\'s premier leg-spinner has reclaimed the crown. England\'s Adil Rashid drops to second in a tightly contested ratings chart.',
      time: '8 hours ago',
      source: 'ICC Ratings Board',
      category: 'Player Rankings',
      readTime: '3 min read',
      sentiment: 'positive',
      hotness: 91
    },
    {
      id: 6,
      title: 'MS Dhoni confirms dynamic finisher mentoring role for junior IPL prospects',
      summary: 'In an exclusive update, the legendary skipper has agreed to lead high-pressure simulation bootcamps, focusing on tactical deep-crease positioning and yorker combat strategies.',
      time: '1 day ago',
      source: 'CSK Camp Updates',
      category: 'IPL Updates',
      readTime: '6 min read',
      sentiment: 'positive',
      hotness: 98
    }
  ]);

  const handleRefreshNews = () => {
    setIsRefreshingNews(true);
    setTimeout(() => {
      setIsRefreshingNews(false);
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC');
      // Shuffle or update one random news timing slightly to feel highly interactive
      setNewsFeed(prev => 
        prev.map((n, idx) => idx === 0 ? { ...n, time: 'Just now' } : n)
      );
    }, 1000);
  };

  // Static Standings across formats
  const standingsData: Record<'Test' | 'ODI' | 'T20I', TeamStanding[]> = {
    Test: [
      { rank: 1, team: 'India', code: 'IND', logo: '🇮🇳', matches: 32, points: 3872, rating: 121 },
      { rank: 2, team: 'Australia', code: 'AUS', logo: '🇦🇺', matches: 28, points: 3332, rating: 119 },
      { rank: 3, team: 'England', code: 'ENG', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', matches: 35, points: 3920, rating: 112 },
      { rank: 4, team: 'South Africa', code: 'SA', logo: '🇿🇦', matches: 20, points: 2080, rating: 104 },
      { rank: 5, team: 'New Zealand', code: 'NZ', logo: '🇳🇿', matches: 24, points: 2376, rating: 99 },
      { rank: 6, team: 'Pakistan', code: 'PAK', logo: '🇵🇰', matches: 22, points: 1980, rating: 90 },
      { rank: 7, team: 'Sri Lanka', code: 'SL', logo: '🇱🇰', matches: 26, points: 2158, rating: 83 },
      { rank: 8, team: 'West Indies', code: 'WI', logo: '🌴', matches: 25, points: 1900, rating: 76 }
    ],
    ODI: [
      { rank: 1, team: 'India', code: 'IND', logo: '🇮🇳', matches: 45, points: 5490, rating: 122 },
      { rank: 2, team: 'Australia', code: 'AUS', logo: '🇦🇺', matches: 40, points: 4680, rating: 117 },
      { rank: 3, team: 'South Africa', code: 'SA', logo: '🇿🇦', matches: 34, points: 3740, rating: 110 },
      { rank: 4, team: 'Pakistan', code: 'PAK', logo: '🇵🇰', matches: 30, points: 3180, rating: 106 },
      { rank: 5, team: 'New Zealand', code: 'NZ', logo: '🇳🇿', matches: 36, points: 3672, rating: 102 },
      { rank: 6, team: 'England', code: 'ENG', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', matches: 38, points: 3610, rating: 95 },
      { rank: 7, team: 'Sri Lanka', code: 'SL', logo: '🇱🇰', matches: 42, points: 3864, rating: 92 },
      { rank: 8, team: 'Bangladesh', code: 'BAN', logo: '🇧🇩', matches: 39, points: 3354, rating: 86 }
    ],
    T20I: [
      { rank: 1, team: 'India', code: 'IND', logo: '🇮🇳', matches: 58, points: 15428, rating: 266 },
      { rank: 2, team: 'Australia', code: 'AUS', logo: '🇦🇺', matches: 49, points: 12544, rating: 256 },
      { rank: 3, team: 'England', code: 'ENG', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', matches: 51, points: 12903, rating: 253 },
      { rank: 4, team: 'West Indies', code: 'WI', logo: '🌴', matches: 48, points: 12096, rating: 252 },
      { rank: 5, team: 'South Africa', code: 'SA', logo: '🇿🇦', matches: 44, points: 10868, rating: 247 },
      { rank: 6, team: 'New Zealand', code: 'NZ', logo: '🇳🇿', matches: 53, points: 12985, rating: 245 },
      { rank: 7, team: 'Pakistan', code: 'PAK', logo: '🇵🇰', matches: 55, points: 13255, rating: 241 },
      { rank: 8, team: 'Afghanistan', code: 'AFG', logo: '🇦🇫', matches: 42, points: 9828, rating: 234 }
    ]
  };

  // Static Rankings across formats & categories
  const rankingsData: Record<'Test' | 'ODI' | 'T20I', Record<'batting' | 'bowling' | 'allrounder', PlayerRanking[]>> = {
    Test: {
      batting: [
        { rank: 1, name: 'Joe Root', team: 'England', rating: 899, countryCode: 'ENG', change: 'same' },
        { rank: 2, name: 'Yashasvi Jaiswal', team: 'India', rating: 843, countryCode: 'IND', change: 'up' },
        { rank: 3, name: 'Kane Williamson', team: 'New Zealand', rating: 825, countryCode: 'NZ', change: 'down' },
        { rank: 4, name: 'Steve Smith', team: 'Australia', rating: 818, countryCode: 'AUS', change: 'same' },
        { rank: 5, name: 'Virat Kohli', team: 'India', rating: 795, countryCode: 'IND', change: 'up' }
      ],
      bowling: [
        { rank: 1, name: 'Ravichandran Ashwin', team: 'India', rating: 870, countryCode: 'IND', change: 'same' },
        { rank: 2, name: 'Jasprit Bumrah', team: 'India', rating: 865, countryCode: 'IND', change: 'up' },
        { rank: 3, name: 'Josh Hazlewood', team: 'Australia', rating: 847, countryCode: 'AUS', change: 'down' },
        { rank: 4, name: 'Pat Cummins', team: 'Australia', rating: 821, countryCode: 'AUS', change: 'same' },
        { rank: 5, name: 'Kagiso Rabada', team: 'South Africa', rating: 812, countryCode: 'SA', change: 'up' }
      ],
      allrounder: [
        { rank: 1, name: 'Ravindra Jadeja', team: 'India', rating: 468, countryCode: 'IND', change: 'same' },
        { rank: 2, name: 'Ravichandran Ashwin', team: 'India', rating: 358, countryCode: 'IND', change: 'same' },
        { rank: 3, name: 'Shakib Al Hasan', team: 'Bangladesh', rating: 312, countryCode: 'BAN', change: 'down' },
        { rank: 4, name: 'Jason Holder', team: 'West Indies', rating: 285, countryCode: 'WI', change: 'same' },
        { rank: 5, name: 'Axar Patel', team: 'India', rating: 279, countryCode: 'IND', change: 'up' }
      ]
    },
    ODI: {
      batting: [
        { rank: 1, name: 'Shubman Gill', team: 'India', rating: 826, countryCode: 'IND', change: 'same' },
        { rank: 2, name: 'Babar Azam', team: 'Pakistan', rating: 818, countryCode: 'PAK', change: 'down' },
        { rank: 3, name: 'Virat Kohli', team: 'India', rating: 792, countryCode: 'IND', change: 'up' },
        { rank: 4, name: 'Rohit Sharma', team: 'India', rating: 765, countryCode: 'IND', change: 'same' },
        { rank: 5, name: 'Daryl Mitchell', team: 'New Zealand', rating: 750, countryCode: 'NZ', change: 'up' }
      ],
      bowling: [
        { rank: 1, name: 'Keshav Maharaj', team: 'South Africa', rating: 716, countryCode: 'SA', change: 'same' },
        { rank: 2, name: 'Josh Hazlewood', team: 'Australia', rating: 688, countryCode: 'AUS', change: 'same' },
        { rank: 3, name: 'Kuldeep Yadav', team: 'India', rating: 682, countryCode: 'IND', change: 'up' },
        { rank: 4, name: 'Rashid Khan', team: 'Afghanistan', rating: 668, countryCode: 'AFG', change: 'down' },
        { rank: 5, name: 'Jasprit Bumrah', team: 'India', rating: 659, countryCode: 'IND', change: 'up' }
      ],
      allrounder: [
        { rank: 1, name: 'Mohammad Nabi', team: 'Afghanistan', rating: 320, countryCode: 'AFG', change: 'up' },
        { rank: 2, name: 'Shakib Al Hasan', team: 'Bangladesh', rating: 310, countryCode: 'BAN', change: 'down' },
        { rank: 3, name: 'Sikandar Raza', team: 'Zimbabwe', rating: 288, countryCode: 'ZIM', change: 'same' },
        { rank: 4, name: 'Rashid Khan', team: 'Afghanistan', rating: 265, countryCode: 'AFG', change: 'up' },
        { rank: 5, name: 'Mitchell Santner', team: 'New Zealand', rating: 252, countryCode: 'NZ', change: 'down' }
      ]
    },
    T20I: {
      batting: [
        { rank: 1, name: 'Travis Head', team: 'Australia', rating: 844, countryCode: 'AUS', change: 'same' },
        { rank: 2, name: 'Suryakumar Yadav', team: 'India', rating: 805, countryCode: 'IND', change: 'same' },
        { rank: 3, name: 'Phil Salt', team: 'England', rating: 792, countryCode: 'ENG', change: 'up' },
        { rank: 4, name: 'Babar Azam', team: 'Pakistan', rating: 755, countryCode: 'PAK', change: 'down' },
        { rank: 5, name: 'Yashasvi Jaiswal', team: 'India', rating: 743, countryCode: 'IND', change: 'up' }
      ],
      bowling: [
        { rank: 1, name: 'Wanindu Hasaranga', team: 'Sri Lanka', rating: 712, countryCode: 'SL', change: 'up' },
        { rank: 2, name: 'Adil Rashid', team: 'England', rating: 708, countryCode: 'ENG', change: 'down' },
        { rank: 3, name: 'Rashid Khan', team: 'Afghanistan', rating: 695, countryCode: 'AFG', change: 'same' },
        { rank: 4, name: 'Akeal Hosein', team: 'West Indies', rating: 680, countryCode: 'WI', change: 'up' },
        { rank: 5, name: 'Ravi Bishnoi', team: 'India', rating: 662, countryCode: 'IND', change: 'down' }
      ],
      allrounder: [
        { rank: 1, name: 'Marcus Stoinis', team: 'Australia', rating: 245, countryCode: 'AUS', change: 'up' },
        { rank: 2, name: 'Wanindu Hasaranga', team: 'Sri Lanka', rating: 238, countryCode: 'SL', change: 'down' },
        { rank: 3, name: 'Mohammad Nabi', team: 'Afghanistan', rating: 224, countryCode: 'AFG', change: 'same' },
        { rank: 4, name: 'Hardik Pandya', team: 'India', rating: 216, countryCode: 'IND', change: 'up' },
        { rank: 5, name: 'Liam Livingstone', team: 'England', rating: 204, countryCode: 'ENG', change: 'down' }
      ]
    }
  };

  // Color theme selectors mapping
  const isLight = theme === 'light';
  
  const textPrimary = isLight ? 'text-slate-900' : 'text-white';
  const textSecondary = isLight ? 'text-slate-500' : 'text-slate-400';
  const bgCard = isLight ? 'bg-white border-slate-200/80 shadow-md' : 'bg-[#080B10] border-slate-800 shadow-2xl shadow-black/20';
  const bgSubPanel = isLight ? 'bg-slate-50' : 'bg-slate-950/40';
  const borderCol = isLight ? 'border-slate-200' : 'border-slate-850';
  const hoverBg = isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-900/60';

  return (
    <div className="space-y-6" id="icc_standings_and_news_tab">
      
      {/* Sub Tabs Selection Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border ${bgCard}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <Newspaper size={20} />
          </div>
          <div>
            <h2 className={`text-base font-display font-bold ${textPrimary} tracking-tight`}>ICC INTEL & WORLD NEWS</h2>
            <p className="text-xs text-slate-400">Official Standings, Rankings & Real-time Feeds</p>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-850'}`}>
          <button
            onClick={() => setSubTab('news')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              subTab === 'news'
                ? isLight
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200 font-semibold'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock size={13} />
            <span>Cricket News Feed</span>
          </button>
          
          <button
            onClick={() => setSubTab('standings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              subTab === 'standings'
                ? isLight
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200 font-semibold'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy size={13} />
            <span>Team Standings</span>
          </button>

          <button
            onClick={() => setSubTab('rankings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              subTab === 'rankings'
                ? isLight
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200 font-semibold'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award size={13} />
            <span>Player Rankings</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: Cricket News Feed */}
        {subTab === 'news' && (
          <motion.div
            key="news-feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header refresh metrics */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-time Intel (updated in 2026 UTC)
              </span>
              <button
                onClick={handleRefreshNews}
                disabled={isRefreshingNews}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                    : 'bg-[#080B10] border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <RefreshCw size={12} className={`${isRefreshingNews ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isRefreshingNews ? 'Refreshing...' : `Refreshed: ${lastRefreshed}`}</span>
              </button>
            </div>

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsFeed.map((news) => (
                <div
                  key={news.id}
                  className={`border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${bgCard} ${hoverBg} group`}
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/80 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                  
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold tracking-wider ${
                      isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-950 text-slate-400'
                    }`}>
                      {news.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock size={11} />
                      <span>{news.time}</span>
                    </div>
                  </div>

                  <h3 className={`text-base font-display font-bold ${textPrimary} mb-2 leading-snug group-hover:text-emerald-500 transition-colors`}>
                    {news.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                    {news.summary}
                  </p>

                  <div className={`flex items-center justify-between border-t ${borderCol} pt-3 mt-4 text-[11px]`}>
                    <span className="font-semibold text-emerald-500 font-mono">{news.source}</span>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>{news.readTime}</span>
                      <span className="flex items-center gap-0.5 text-orange-400">
                        <TrendingUp size={11} />
                        <b>{news.hotness}% hot</b>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW 2: ICC Team Standings */}
        {subTab === 'standings' && (
          <motion.div
            key="standings-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`border rounded-3xl p-6 ${bgCard}`}
          >
            {/* Format Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
              <div>
                <h3 className={`text-lg font-display font-bold ${textPrimary}`}>ICC Men's Team Standings</h3>
                <p className="text-xs text-slate-400">Current official global table across three match formats</p>
              </div>

              <div className={`flex gap-1 p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-850'}`}>
                {(['Test', 'ODI', 'T20I'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setStandingsFormat(format)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      standingsFormat === format
                        ? isLight
                          ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Standings Table Rendering */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${borderCol} text-[11px] text-slate-500 font-mono uppercase tracking-wider`}>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Team Nation</th>
                    <th className="py-3 px-4 text-center">Matches</th>
                    <th className="py-3 px-4 text-center">Points</th>
                    <th className="py-3 px-4 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderCol}`}>
                  {standingsData[standingsFormat].map((row) => (
                    <tr
                      key={row.rank}
                      className={`text-xs transition-colors ${hoverBg} ${row.rank === 1 ? 'bg-emerald-500/5' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        {row.rank === 1 ? (
                          <span className="inline-flex items-center gap-1 text-yellow-500">
                            👑 {row.rank}
                          </span>
                        ) : (
                          `#0${row.rank}`
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl" role="img" aria-label={row.team}>
                            {row.logo}
                          </span>
                          <span className={`font-semibold ${textPrimary}`}>{row.team}</span>
                          <span className="text-[10px] text-slate-500 font-bold font-mono">({row.code})</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">{row.matches}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">{row.points.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {row.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer insight */}
            <div className={`mt-6 p-4 rounded-xl border ${bgSubPanel} ${borderCol} flex items-center gap-3 text-[11px] text-slate-400`}>
              <Star size={14} className="text-yellow-500 shrink-0" />
              <span>
                <b>Rankings weighting:</b> Standings are automatically computed by the ICC based on a dynamic moving average of points earned over the previous 36 months, with matches played in the last year weighted at 100%.
              </span>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: Player Rankings */}
        {subTab === 'rankings' && (
          <motion.div
            key="player-rankings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Format & Category selectors */}
            <div className={`border rounded-3xl p-6 ${bgCard} space-y-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className={`text-lg font-display font-bold ${textPrimary}`}>ICC Men's Player Rankings</h3>
                  <p className="text-xs text-slate-400">Explore top players in international cricket across all formats</p>
                </div>

                {/* Format selection */}
                <div className={`flex gap-1 p-1 rounded-xl border self-start ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-850'}`}>
                  {(['Test', 'ODI', 'T20I'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setRankingsFormat(format)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        rankingsFormat === format
                          ? isLight
                            ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category selection */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'batting', label: '🏏 Top Batsmen', color: 'indigo' },
                  { id: 'bowling', label: '🥎 Top Bowlers', color: 'emerald' },
                  { id: 'allrounder', label: '⚡ Top All-Rounders', color: 'amber' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setRankingsCategory(cat.id as any)}
                    className={`py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                      rankingsCategory === cat.id
                        ? isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-900 font-bold'
                          : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-bold'
                        : isLight
                          ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Table rendering */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${borderCol} text-[11px] text-slate-500 font-mono uppercase tracking-wider`}>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Player Name</th>
                      <th className="py-3 px-4">Country Team</th>
                      <th className="py-3 px-4 text-right">Rating Score</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderCol}`}>
                    {rankingsData[rankingsFormat][rankingsCategory].map((row) => (
                      <tr
                        key={row.rank}
                        className={`text-xs transition-colors ${hoverBg} ${row.rank === 1 ? 'bg-amber-500/5' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                          {row.rank === 1 ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-400">
                              🥇 {row.rank}
                            </span>
                          ) : (
                            `#0${row.rank}`
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${textPrimary}`}>{row.name}</span>
                            {row.rank === 1 && (
                              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase font-bold">
                                No.1 Spot
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-slate-500 font-bold font-mono">({row.countryCode})</span>
                            <span className={textSecondary}>{row.team}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                          {row.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
