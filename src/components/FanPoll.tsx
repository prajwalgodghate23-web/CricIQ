/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Vote, RefreshCw, BarChart2, CheckCircle, Flame, Users, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface FanPollProps {
  theme: 'light' | 'dark';
}

interface PollOption {
  id: string;
  label: string;
  votes: number;
  color: string;
}

interface PollTopic {
  id: string;
  question: string;
  category: string;
  totalVotes: number;
  options: PollOption[];
  userVotedId?: string;
}

export default function FanPoll({ theme }: FanPollProps) {
  const isLight = theme === 'light';

  // State with three rich, cricket-centric poll topics
  const [polls, setPolls] = useState<PollTopic[]>([
    {
      id: 'wtc_winner',
      question: 'Who will win the ICC World Test Championship (WTC) Final in 2026?',
      category: 'WTC Special',
      totalVotes: 14520,
      options: [
        { id: 'ind', label: 'India', votes: 6840, color: '#10B981' }, // Emerald
        { id: 'aus', label: 'Australia', votes: 4890, color: '#F59E0B' }, // Amber
        { id: 'eng', label: 'England', votes: 1680, color: '#3B82F6' }, // Blue
        { id: 'sa', label: 'South Africa', votes: 1110, color: '#8B5CF6' } // Purple
      ]
    },
    {
      id: 'potm_predict',
      question: 'Who is your candidate for the International Cricketer of the Year?',
      category: 'Player Awards',
      totalVotes: 28940,
      options: [
        { id: 'yashasvi', label: 'Yashasvi Jaiswal', votes: 12450, color: '#10B981' },
        { id: 'travis', label: 'Travis Head', votes: 8900, color: '#F59E0B' },
        { id: 'bumrah', label: 'Jasprit Bumrah', votes: 5120, color: '#3B82F6' },
        { id: 'root', label: 'Joe Root', votes: 2470, color: '#EC4899' } // Pink
      ]
    },
    {
      id: 'ipl_power',
      question: 'Which franchise has executed the most optimal tactical trade strategy?',
      category: 'IPL 2026 Strategy',
      totalVotes: 9410,
      options: [
        { id: 'rcb', label: 'Royal Challengers Bengaluru', votes: 3420, color: '#EF4444' }, // Red
        { id: 'csk', label: 'Chennai Super Kings', votes: 3100, color: '#F59E0B' }, // Amber
        { id: 'mi', label: 'Mumbai Indians', votes: 1840, color: '#3B82F6' }, // Blue
        { id: 'srh', label: 'Sunrisers Hyderabad', votes: 1050, color: '#F97316' } // Orange
      ]
    }
  ]);

  const [activePollId, setActivePollId] = useState<string>('wtc_winner');
  const [votingOptionId, setVotingOptionId] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const currentPoll = polls.find(p => p.id === activePollId) || polls[0];

  // Real-time vote trickling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPolls(prevPolls => {
        return prevPolls.map(poll => {
          // Add 1 to 4 random votes trickling in from general public worldwide
          const updatedOptions = poll.options.map(opt => {
            const addedVotes = Math.floor(Math.random() * 3);
            return {
              ...opt,
              votes: opt.votes + addedVotes
            };
          });

          const newTotal = updatedOptions.reduce((acc, o) => acc + o.votes, 0);

          return {
            ...poll,
            options: updatedOptions,
            totalVotes: newTotal
          };
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleVoteSubmit = () => {
    if (!votingOptionId) return;

    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === activePollId) {
          const updatedOptions = poll.options.map(opt => {
            if (opt.id === votingOptionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1,
            userVotedId: votingOptionId
          };
        }
        return poll;
      })
    );

    setSuccessMsg('Your vote was registered successfully!');
    setVotingOptionId('');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  // Pre-calculate data for Donut Chart
  const chartData = currentPoll.options.map(opt => ({
    name: opt.label,
    value: opt.votes,
    color: opt.color
  }));

  // Style selectors mapping
  const textPrimary = isLight ? 'text-slate-900' : 'text-white';
  const textSecondary = isLight ? 'text-slate-500' : 'text-slate-400';
  const bgCard = isLight ? 'bg-white border-slate-200/80 shadow-md' : 'bg-[#080B10] border-slate-800 shadow-2xl shadow-black/20';
  const bgSubPanel = isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-850';
  const borderCol = isLight ? 'border-slate-200' : 'border-slate-850';
  const hoverBg = isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900/40';

  return (
    <div className={`border rounded-2xl p-5 ${bgCard} flex flex-col h-full`} id="fan_poll_container">
      
      {/* Title block */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-850 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Vote size={16} className="text-emerald-500 animate-pulse" />
          <h3 className={`text-sm font-display font-semibold ${textPrimary}`}>Real-time CricIQ Fan Poll</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span>LIVE VOTE STREAM</span>
        </div>
      </div>

      {/* Select active poll topic */}
      <div className="grid grid-cols-3 gap-1 mb-4">
        {polls.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePollId(p.id);
              setVotingOptionId('');
            }}
            className={`py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer text-center border truncate px-1 ${
              activePollId === p.id
                ? isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600 font-bold shadow-sm'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold'
                : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                  : 'bg-slate-950/30 border-slate-900 text-slate-500 hover:text-slate-300'
            }`}
            title={p.question}
          >
            {p.category}
          </button>
        ))}
      </div>

      {/* Poll Question Display */}
      <div className={`p-3 rounded-xl mb-4 ${bgSubPanel} border`}>
        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono block mb-1">
          Active Query
        </span>
        <h4 className={`text-xs font-display font-bold leading-normal ${textPrimary}`}>
          {currentPoll.question}
        </h4>
      </div>

      {/* Poll Options and voting logic / donut chart */}
      <div className="space-y-4 flex-grow flex flex-col justify-between">
        
        {/* If user hasn't voted yet, offer selection */}
        {!currentPoll.userVotedId ? (
          <div className="space-y-2">
            {currentPoll.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVotingOptionId(opt.id)}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  votingOptionId === opt.id
                    ? isLight
                      ? 'bg-emerald-500/10 border-emerald-400 text-emerald-600 font-bold'
                      : 'bg-emerald-500/10 border-emerald-500/60 text-emerald-400 font-bold'
                    : isLight
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'bg-[#06080d]/60 border-slate-900 text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                  {votingOptionId === opt.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </span>
              </button>
            ))}

            <button
              onClick={handleVoteSubmit}
              disabled={!votingOptionId}
              className={`w-full mt-2 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                votingOptionId
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-md shadow-emerald-500/10'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
              }`}
            >
              Submit Fan Vote
            </button>
          </div>
        ) : (
          /* Show real-time donut chart and progress bars */
          <div className="space-y-4">
            
            {/* Donut Chart container */}
            <div className="h-[140px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#080B10',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid #1e293b',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-[13px] font-mono font-bold ${textPrimary}`}>
                  {(currentPoll.totalVotes / 1000).toFixed(1)}k
                </span>
                <span className="text-[8px] text-slate-400 font-medium">Votes</span>
              </div>
            </div>

            {/* Voting outcomes breakdown */}
            <div className="space-y-2">
              {currentPoll.options.map((opt) => {
                const percentage = ((opt.votes / currentPoll.totalVotes) * 100).toFixed(1);
                const isUserChoice = currentPoll.userVotedId === opt.id;

                return (
                  <div key={opt.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className={`flex items-center gap-1 font-semibold ${isUserChoice ? 'text-emerald-400 font-bold' : textSecondary}`}>
                        {isUserChoice && <CheckCircle size={10} className="text-emerald-400" />}
                        {opt.label}
                      </span>
                      <span className="text-slate-300 font-bold">
                        {percentage}% <span className="text-slate-500 font-normal">({opt.votes.toLocaleString()})</span>
                      </span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: opt.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic global activity simulation tag */}
        <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[9px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Users size={11} className="text-emerald-500" />
            <span>Active Voters: 3.4k online</span>
          </span>
          <span className="text-slate-500 flex items-center gap-0.5">
            <TrendingUp size={10} className="text-orange-400" />
            <span>Hot Topic</span>
          </span>
        </div>

        {/* Registered success notification banner */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400 font-semibold text-center flex items-center justify-center gap-1.5"
            >
              <CheckCircle size={12} />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
