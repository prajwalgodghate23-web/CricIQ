/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Team, Venue, LiveMatchState, BallEvent, PushNotification } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Bell, Radio, TrendingUp, Sparkles, Trophy, Users, ShieldAlert, Award, Target, Filter, Eye } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface LiveMatchCenterProps {
  teams: Team[];
  venues: Venue[];
  onTriggerNotification: (title: string, message: string, type: 'wicket' | 'boundary' | 'milestone' | 'trend' | 'info') => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#090d16]/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md max-w-xs text-xs">
        <p className="font-mono text-[10px] text-slate-500 font-bold mb-1.5">{label}</p>
        <div className="space-y-1.5">
          {payload.map((pld: any) => (
            <div key={pld.name} className="flex justify-between items-center gap-4">
              <span className="flex items-center gap-1 font-semibold" style={{ color: pld.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pld.color }} />
                {pld.name}
              </span>
              <span className="font-mono font-bold" style={{ color: pld.color }}>{pld.value}%</span>
            </div>
          ))}
        </div>
        {data.details && (
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-normal">
            <span className="font-mono text-[8px] font-bold uppercase bg-slate-900 text-slate-400 px-1 py-0.5 rounded mr-1">Commentary</span>
            <span className="italic">{data.details}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Generates contextually accurate pitch landing spots for each ball
function getBallLandingSpot(evt: BallEvent) {
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashString((evt.commentary || '') + evt.over + evt.ball + evt.currentInnings);
  const random = () => {
    const val = Math.sin(seed) * 10000;
    return val - Math.floor(val);
  };

  // Base Y length (meters from batsman crease: 0m to 10m)
  let y = 5.5; // default good length
  const comm = (evt.commentary || '').toLowerCase();
  
  if (comm.includes('yorker') || comm.includes('blockhole') || evt.wicketType === 'Bowled') {
    y = 0.5 + random() * 1.3; // yorker: 0.5m - 1.8m
  } else if (comm.includes('full') || comm.includes('drive') || comm.includes('stumped') || comm.includes('cover drive')) {
    y = 1.8 + random() * 1.7; // full: 1.8m - 3.5m
  } else if (comm.includes('pull') || comm.includes('bouncer') || comm.includes('short') || comm.includes('hook') || comm.includes('half tracker')) {
    y = 6.8 + random() * 2.5; // short: 6.8m - 9.3m
  } else {
    // default/random Good Length
    y = 3.5 + random() * 3.3; // good: 3.5m - 6.8m
  }

  // Base X line (horizontal offset from center line: -1.5m to +1.5m)
  let x = 0.0; // default middle stump line
  if (comm.includes('cover') || comm.includes('off side') || comm.includes('outside off') || comm.includes('cut') || comm.includes('third man') || comm.includes('point')) {
    x = 0.3 + random() * 0.9; // Outside off / wide off: 0.3m to 1.2m
  } else if (comm.includes('leg') || comm.includes('sweep') || comm.includes('flick') || comm.includes('fine leg') || comm.includes('square leg')) {
    x = -0.3 - random() * 0.9; // Leg side: -0.3m to -1.2m
  } else {
    x = -0.25 + random() * 0.5; // Middle/stumps: -0.25m to 0.25m
  }

  return { x, y };
}

function getLengthCategory(y: number): { name: string; color: string; desc: string } {
  if (y < 1.8) return { name: 'Yorker', color: '#f43f5e', desc: 'Fired right into the toes / blockhole' };
  if (y < 3.5) return { name: 'Full Length', color: '#f59e0b', desc: 'Pitched up, inviting the drive' };
  if (y < 6.8) return { name: 'Good Length', color: '#10b981', desc: 'Perfect testing length' };
  return { name: 'Short / Bouncer', color: '#0ea5e9', desc: 'Banged in short, forcing the batsman back' };
}

function getLineCategory(x: number): { name: string; desc: string } {
  if (x > 0.6) return { name: 'Wide Outside Off', desc: 'Well wide of the off stump' };
  if (x > 0.15) return { name: 'Outside Off', desc: 'Channel of uncertainty' };
  if (x < -0.6) return { name: 'Wide Down Leg', desc: 'Straying down the leg side' };
  if (x < -0.15) return { name: 'Down Leg-Side', desc: 'Aimed at the pads / leg stump' };
  return { name: 'In-Line / Stumps', desc: 'Targeting the stumps directly' };
}

export default function LiveMatchCenter({ teams, venues, onTriggerNotification }: LiveMatchCenterProps) {
  const [teamAId, setTeamAId] = useState('rcb');
  const [teamBId, setTeamBId] = useState('csk');
  const [venueId, setVenueId] = useState('chinnaswamy');

  const [matchState, setMatchState] = useState<LiveMatchState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 5 | 10>(1); // 1 = 2000ms, 5 = 800ms, 10 = 250ms
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Advanced Visualizer State
  const [activeVisualizer, setActiveVisualizer] = useState<'probability' | 'pitchmap'>('probability');
  const [pitchFilter, setPitchFilter] = useState<'over' | 'all' | 'wickets' | 'boundaries'>('over');
  const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(null);

  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  const teamA = teams.find(t => t.id === teamAId) || teams[0];
  const teamB = teams.find(t => t.id === teamBId) || teams[1];
  const selectedVenue = venues.find(v => v.id === venueId) || venues[0];

  // Sounds (Fictional AudioContext synthesized sound effects for wickets and boundaries!)
  const playBeep = (freq: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio synthesis not supported or blocked by frame security:', e);
    }
  };

  const playWicketSound = () => {
    // Sliding pitch down for a sad crowd/wicket sound
    playBeep(220, 'triangle', 0.6);
    setTimeout(() => playBeep(180, 'triangle', 0.4), 150);
  };

  const playBoundarySound = () => {
    // High double pitch for high energy cheering
    playBeep(520, 'sine', 0.3);
    setTimeout(() => playBeep(659, 'sine', 0.4), 100);
  };

  // Initialize a new match
  const handleStartMatch = () => {
    if (teamAId === teamBId) {
      alert('Matchup requires two different cricket teams!');
      return;
    }

    const initialMatch: LiveMatchState = {
      matchId: `ipl_match_${Date.now()}`,
      teamA,
      teamB,
      venue: selectedVenue,
      currentInnings: 1,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      battingTeamId: teamA.id,
      bowlingTeamId: teamB.id,
      batsman1: { name: teamA.players[0].name, runs: 0, balls: 0 },
      batsman2: { name: teamA.players[1].name, runs: 0, balls: 0 },
      currentBowler: {
        name: teamB.players[teamB.players.length - 1].name,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
      },
      winProbabilityA: 50,
      winProbabilityB: 50,
      eventsHistory: [],
      isCompleted: false,
      statusText: `Match Started at ${selectedVenue.name}! ${teamA.name} are batting first.`,
    };

    setMatchState(initialMatch);
    setIsPlaying(false);
    setSelectedBallIndex(null);
    setActiveVisualizer('probability');
    setPitchFilter('over');
  };

  // Run the core simulation step
  const simulateStep = async () => {
    if (!matchState || matchState.isCompleted) {
      setIsPlaying(false);
      return;
    }

    try {
      const res = await fetch('/api/simulate-next-ball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchState),
      });
      const data = await res.json();
      const updatedState: LiveMatchState = data.state;
      const event: BallEvent = data.event;

      setMatchState(updatedState);
      if (updatedState.eventsHistory && updatedState.eventsHistory.length > 0) {
        setSelectedBallIndex(updatedState.eventsHistory.length - 1);
      }

      // Handle Notifications & Sounds based on event type
      if (event.isWicket) {
        playWicketSound();
        onTriggerNotification(
          `🔴 WICKET ALERT! ${event.wicketType}`,
          `${event.batsman} dismissed by ${event.bowler}! commentary: "${event.commentary}"`,
          'wicket'
        );
      } else if (event.isBoundary) {
        playBoundarySound();
        onTriggerNotification(
          event.runs === 6 ? '⚡ MASSIVE SIX!' : '🔥 BOUNDARY FOUR!',
          `${event.batsman} strikes ${event.runs} runs off ${event.bowler}!`,
          'boundary'
        );
      } else if (event.over > 0 && event.ball === 0 && !event.isExtra) {
        // Over summary or Win probability shifts
        if (Math.abs(event.winProbA - 50) > 20) {
          onTriggerNotification(
            `📈 PROBABILITY SHIFT`,
            `Market sentiment swing: ${event.winProbA > 50 ? teamA.shortName : teamB.shortName} probability hits ${Math.max(event.winProbA, event.winProbB)}%!`,
            'trend'
          );
        }
      }

      // If innings change trigger notification
      if (event.commentary.includes('Innings break')) {
        onTriggerNotification(
          `🏏 INNINGS COMPLETED!`,
          `${teamA.name} finishes on ${event.teamAScore}/${event.teamAWickets}. Target is ${event.target} runs for ${teamB.name}!`,
          'milestone'
        );
      }

      // If match finished
      if (updatedState.isCompleted) {
        setIsPlaying(false);
        onTriggerNotification(
          `🏆 MATCH COMPLETED`,
          updatedState.statusText,
          'milestone'
        );
      }
    } catch (e) {
      console.error('Error simulating ball:', e);
    }
  };

  // Loop simulation while playing
  useEffect(() => {
    if (isPlaying && matchState && !matchState.isCompleted) {
      const ms = speed === 1 ? 2000 : speed === 5 ? 800 : 250;
      simulationInterval.current = setInterval(() => {
        simulateStep();
      }, ms);
    } else {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    }

    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [isPlaying, matchState, speed, soundEnabled]);

  // Win probability data parser for Recharts
  const chartData = matchState
    ? [
        {
          ball: 'Toss / 0.0',
          [teamA.shortName]: 50,
          [teamB.shortName]: 50,
          details: 'Pre-match baseline simulation'
        },
        ...(matchState.eventsHistory || [])
          .filter((_, idx) => idx % Math.max(1, Math.floor(matchState.eventsHistory.length / 30)) === 0 || idx === matchState.eventsHistory.length - 1)
          .map((evt) => ({
            ball: `${evt.currentInnings === 1 ? 'Inn 1' : 'Inn 2'} - ${evt.over}.${evt.ball}`,
            [teamA.shortName]: evt.winProbA,
            [teamB.shortName]: evt.winProbB,
            details: evt.commentary,
          }))
      ]
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="live_match_root">
      {/* Simulation Setup Overlay */}
      {!matchState ? (
        <div className="lg:col-span-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center backdrop-blur-md flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5">
            <Radio size={40} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Live Match Simulator</h2>
          <p className="text-sm text-slate-400 max-w-lg mb-8">
            Pitch two IPL giants head-to-head in a live-updating, mathematically modeled over-by-over tactical simulation with real-time analytics graphs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mb-8 max-w-2xl w-full">
            <div className="w-full">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-left block mb-2 font-semibold">Home Team</label>
              <select
                value={teamAId}
                onChange={(e) => setTeamAId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                ))}
              </select>
            </div>

            <div className="text-slate-500 font-display font-bold pt-6 text-sm">VS</div>

            <div className="w-full">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-left block mb-2 font-semibold">Away Team</label>
              <select
                value={teamBId}
                onChange={(e) => setTeamBId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-left block mb-2 font-semibold">Stadium Venue</label>
              <select
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>🏟️ {v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStartMatch}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-display font-bold rounded-xl shadow-lg shadow-indigo-500/15 cursor-pointer text-sm tracking-wide"
          >
            Launch Live Match Ticker
          </button>
        </div>
      ) : (
        <>
          {/* Left Column: Live Scoreboard and Chart */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Scoreboard */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-lg border transition-all ${soundEnabled ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-950/60 border-slate-850 text-slate-500'}`}
                  title={soundEnabled ? 'Mute Cheering Synth' : 'Enable Cheering Synth'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Team Matchup Header Banner */}
              <div className="grid grid-cols-3 items-center mb-6 border-b border-slate-850 pb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-slate-950/40 rounded-xl border border-slate-850">{matchState.teamA.logo}</span>
                  <div>
                    <h3 className="font-display font-semibold text-white leading-tight">{matchState.teamA.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Home Squad
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs font-mono px-3 py-1 bg-slate-950 border border-slate-850 text-indigo-400 rounded-full font-bold">
                    INNINGS {matchState.currentInnings}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">🏟️ {matchState.venue.name}</p>
                </div>

                <div className="flex items-center gap-3 justify-end text-right">
                  <div>
                    <h3 className="font-display font-semibold text-white leading-tight">{matchState.teamB.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono flex items-center justify-end gap-1.5 mt-0.5">
                      Away Squad
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </p>
                  </div>
                  <span className="text-3xl p-2 bg-slate-950/40 rounded-xl border border-slate-850">{matchState.teamB.logo}</span>
                </div>
              </div>

              {/* Giant Digital scoreboard */}
              <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Core digits */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Batting Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-display font-bold text-white tracking-tight">{matchState.runs}</span>
                    <span className="text-3xl font-display font-semibold text-slate-500">/</span>
                    <span className="text-4xl font-display font-bold text-indigo-400">{matchState.wickets}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Overs: <b className="text-slate-200">{matchState.overs}.{matchState.balls}</b> / 20.0
                  </div>
                </div>

                {/* Target required runs */}
                <div className="md:col-span-3 border-l md:border-l-0 md:border-r border-slate-850 md:pl-0 pl-4 py-1 h-full flex flex-col justify-center">
                  {matchState.currentInnings === 2 && matchState.target ? (
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">TARGET CHASE</span>
                      <p className="text-2xl font-display font-bold text-amber-400 mt-0.5">{matchState.target}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                        Need <b className="text-slate-200">{matchState.target - matchState.runs}</b> runs in <b className="text-slate-200">{(20 - matchState.overs) * 6 - matchState.balls}</b> balls.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">IST INNINGS STATE</span>
                      <p className="text-base font-semibold text-slate-300 mt-1.5 leading-snug">Setting Target</p>
                      <p className="text-[10px] text-slate-500 mt-1">First session sets the anchor line.</p>
                    </div>
                  )}
                </div>

                {/* Active players */}
                <div className="md:col-span-4 space-y-3">
                  <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 pulse-ring-active" />
                      <span className="text-slate-300 font-medium truncate max-w-[120px]">{matchState.batsman1.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-white">{matchState.batsman1.runs} <span className="text-[10px] text-slate-500">({matchState.batsman1.balls})</span></span>
                  </div>

                  <div className="bg-slate-900/10 p-2.5 rounded-xl border border-slate-850/50 flex justify-between items-center text-xs">
                    <span className="text-slate-400 pl-3.5 truncate max-w-[120px]">{matchState.batsman2.name}</span>
                    <span className="font-mono text-slate-400">{matchState.batsman2.runs} <span className="text-[10px] text-slate-600">({matchState.batsman2.balls})</span></span>
                  </div>

                  <div className="bg-slate-950 p-2 border-t border-slate-850 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-mono">Bowler: <b className="text-slate-300">{matchState.currentBowler.name}</b></span>
                    <span className="text-slate-400 font-mono">
                      Wkt: <b className="text-indigo-400">{matchState.currentBowler.wickets}</b> | R: <b className="text-slate-200">{matchState.currentBowler.runs}</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-4 flex flex-col md:flex-row gap-3 justify-between items-center">
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl">
                  <Radio size={14} className="text-indigo-400 animate-pulse" />
                  <span className="text-[11px] text-indigo-400 font-medium">{matchState.statusText}</span>
                </div>

                {/* Controller Panel */}
                <div className="flex items-center gap-2">
                  {/* Speed buttons */}
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-1 flex gap-1">
                    {([1, 5, 10] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`text-[9px] font-mono px-2 py-1 rounded-lg font-bold transition-all ${speed === s ? 'bg-indigo-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                      >
                        {s}X
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={matchState.isCompleted}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition-all ${
                      isPlaying 
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                        : 'bg-indigo-500 text-slate-950 hover:bg-indigo-400 disabled:opacity-50'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={13} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        <span>Simulate Ball</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleStartMatch}
                    className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 cursor-pointer"
                    title="Restart Match Simulation"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Visualizer Container: Win Probability & AI Pitch Map */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
                {/* Visualizer Selector Tabs */}
                <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850/80">
                  <button
                    onClick={() => setActiveVisualizer('probability')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all cursor-pointer ${
                      activeVisualizer === 'probability'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/15'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp size={14} />
                    <span>Probability Swing</span>
                  </button>
                  <button
                    onClick={() => setActiveVisualizer('pitchmap')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display font-semibold transition-all cursor-pointer relative ${
                      activeVisualizer === 'pitchmap'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/15'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Target size={14} />
                    <span>AI Pitch Map</span>
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </button>
                </div>

                {/* Constant Match Status Indicators on right */}
                <div className="flex gap-4 text-xs font-mono font-semibold">
                  <span className="flex items-center gap-1.5" style={{ color: teamA.color }}>
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: teamA.color }} />
                    {teamA.shortName}: {matchState ? matchState.winProbabilityA : 50}%
                  </span>
                  <span className="flex items-center gap-1.5" style={{ color: teamB.color }}>
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: teamB.color }} />
                    {teamB.shortName}: {matchState ? matchState.winProbabilityB : 50}%
                  </span>
                </div>
              </div>

              {activeVisualizer === 'probability' ? (
                /* Existing Probability Line Chart */
                <div className="h-64 w-full">
                  {matchState ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                        <XAxis dataKey="ball" stroke="#64748b" fontSize={9} tickLine={false} />
                        <YAxis stroke="#64748b" domain={[0, 100]} tickFormatter={(val) => `${val}%`} fontSize={9} tickLine={false} />
                        <ReferenceLine y={50} stroke="#334155" strokeDasharray="3 3" label={{ value: "EVEN MATCH", fill: "#475569", fontSize: 8, position: "insideBottomLeft" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey={teamA.shortName}
                          stroke={teamA.color}
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={teamB.shortName}
                          stroke={teamB.color}
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                      Win probability values will populate once the simulation gets running.
                    </div>
                  )}
                </div>
              ) : (
                /* Interactive Pitch Map Visualizer */
                <div className="space-y-6">
                  {/* Control Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/80 border border-slate-850 p-3 rounded-xl">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mr-1.5">
                        <Filter size={11} className="text-indigo-400" /> Filter spots:
                      </span>
                      {[
                        { id: 'over', label: 'Current Over' },
                        { id: 'all', label: 'All Innings' },
                        { id: 'wickets', label: 'Wickets Only' },
                        { id: 'boundaries', label: 'Boundaries Only' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setPitchFilter(item.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-tight transition-all cursor-pointer ${
                            pitchFilter === item.id
                              ? 'bg-slate-800 text-indigo-400 border border-indigo-500/20'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 border border-transparent'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 font-semibold self-end sm:self-auto">
                      Plotted: <b className="text-slate-300">{
                        matchState
                          ? pitchFilter === 'over'
                            ? ((matchState.eventsHistory || []).filter(evt => evt.over === matchState.overs && evt.currentInnings === matchState.currentInnings).length > 0
                                ? (matchState.eventsHistory || []).filter(evt => evt.over === matchState.overs && evt.currentInnings === matchState.currentInnings).length
                                : Math.min(6, (matchState.eventsHistory || []).length))
                            : pitchFilter === 'wickets'
                            ? (matchState.eventsHistory || []).filter(evt => evt.isWicket).length
                            : pitchFilter === 'boundaries'
                            ? (matchState.eventsHistory || []).filter(evt => evt.isBoundary).length
                            : Math.min(24, (matchState.eventsHistory || []).length)
                          : 0
                      }</b> balls
                    </div>
                  </div>

                  {/* Main Grid: Pitch Map and Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left: SVG Pitch Map */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="relative bg-slate-950 border border-slate-850 rounded-xl p-4 w-full flex justify-center items-center overflow-hidden">
                        {/* Interactive Pitch Diagram SVG */}
                        <svg width="220" height="320" viewBox="0 0 240 320" className="select-none overflow-visible">
                          {/* Outer Grass Area */}
                          <rect x="0" y="0" width="240" height="320" fill="#080c14" rx="8" />
                          <path d="M 0,0 L 40,320 M 240,0 L 200,320 M 120,0 L 120,320" stroke="#101827" strokeWidth="0.5" strokeDasharray="3 3" />
                          
                          {/* Pitch Surface Track */}
                          <rect x="55" y="25" width="130" height="270" fill="#0b1324" stroke="#1e293b" strokeWidth="1" rx="4" />
                          
                          {/* Crease markings */}
                          {/* Bowler's Crease (Top end) */}
                          <line x1="55" y1="50" x2="185" y2="50" stroke="#334155" strokeWidth="1" />
                          
                          {/* Batsman's Crease / Popping Crease (Bottom end) */}
                          <line x1="55" y1="280" x2="185" y2="280" stroke="#e2e8f0" strokeWidth="1.5" strokeOpacity="0.8" />
                          {/* Batsman's Bowling Crease */}
                          <line x1="65" y1="290" x2="175" y2="290" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />

                          {/* Length Zone Dividers with subtle color backgrounds */}
                          {/* Short Zone: 50 to 120 */}
                          <rect x="56" y="51" width="128" height="69" fill="#0ea5e9" fillOpacity="0.02" />
                          {/* Good Length Zone: 120 to 200 */}
                          <rect x="56" y="120" width="128" height="80" fill="#10b981" fillOpacity="0.02" />
                          {/* Full Length Zone: 200 to 250 */}
                          <rect x="56" y="200" width="128" height="50" fill="#f59e0b" fillOpacity="0.02" />
                          {/* Yorker Zone: 250 to 280 */}
                          <rect x="56" y="250" width="128" height="30" fill="#f43f5e" fillOpacity="0.02" />

                          {/* Zone labels on the right hand side */}
                          <text x="195" y="88" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">SHORT</text>
                          <text x="195" y="163" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">GOOD</text>
                          <text x="195" y="228" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">FULL</text>
                          <text x="195" y="268" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold">YORKER</text>

                          {/* Wickets/Stumps */}
                          <g stroke="#ff7a00" strokeWidth="2" strokeLinecap="round">
                            <line x1="114" y1="290" x2="114" y2="296" />
                            <line x1="120" y1="290" x2="120" y2="296" />
                            <line x1="126" y1="290" x2="126" y2="296" />
                          </g>
                          <line x1="112" y1="290" x2="128" y2="290" stroke="#ff7a00" strokeWidth="1.5" /> {/* Bails */}

                          {/* Coordinates/Scatter Dots Plotted */}
                          {matchState && (
                            (pitchFilter === 'over'
                              ? ((matchState.eventsHistory || []).filter(evt => evt.over === matchState.overs && evt.currentInnings === matchState.currentInnings).length > 0
                                  ? (matchState.eventsHistory || []).filter(evt => evt.over === matchState.overs && evt.currentInnings === matchState.currentInnings)
                                  : (matchState.eventsHistory || []).slice(-6))
                              : pitchFilter === 'wickets'
                              ? (matchState.eventsHistory || []).filter(evt => evt.isWicket)
                              : pitchFilter === 'boundaries'
                              ? (matchState.eventsHistory || []).filter(evt => evt.isBoundary)
                              : (matchState.eventsHistory || []).slice(-24)
                            ).map((evt, idx) => {
                              const { x, y } = getBallLandingSpot(evt);
                              const svgX = 120 + (x / 1.5) * 55;
                              const svgY = 280 - (y / 10) * 230;
                              
                              const overallIndex = (matchState.eventsHistory || []).findIndex(
                                (item) => item.over === evt.over && item.ball === evt.ball && item.currentInnings === evt.currentInnings
                              );
                              
                              const isSelected = selectedBallIndex === overallIndex;
                              const isLatest = matchState.eventsHistory && overallIndex === matchState.eventsHistory.length - 1;

                              let dotColor = '#64748b';
                              let glowColor = 'rgba(100, 116, 139, 0.3)';
                              if (evt.isWicket) {
                                dotColor = '#f43f5e';
                                glowColor = 'rgba(244, 63, 94, 0.6)';
                              } else if (evt.isBoundary) {
                                dotColor = '#f59e0b';
                                glowColor = 'rgba(245, 158, 11, 0.6)';
                              } else if (evt.runs > 0) {
                                dotColor = '#10b981';
                                glowColor = 'rgba(16, 185, 129, 0.5)';
                              }

                              return (
                                <g
                                  key={idx}
                                  className="cursor-pointer group"
                                  onClick={() => setSelectedBallIndex(overallIndex)}
                                >
                                  <circle
                                    cx={svgX}
                                    cy={svgY}
                                    r={12}
                                    fill="transparent"
                                    className="transition-all hover:fill-indigo-500/5"
                                  />

                                  {(isSelected || isLatest) && (
                                    <circle
                                      cx={svgX}
                                      cy={svgY}
                                      r={isSelected ? 10 : 8}
                                      fill="none"
                                      stroke={dotColor}
                                      strokeWidth={isSelected ? 1.5 : 1}
                                      className="animate-pulse"
                                      opacity={0.8}
                                    />
                                  )}

                                  <circle
                                    cx={svgX}
                                    cy={svgY}
                                    r={isSelected ? 6.5 : 5.5}
                                    fill={glowColor}
                                    className="transition-all group-hover:scale-125"
                                  />

                                  <circle
                                    cx={svgX}
                                    cy={svgY}
                                    r={isSelected ? 3.5 : 2.5}
                                    fill={dotColor}
                                    stroke="#090d16"
                                    strokeWidth={0.5}
                                  />

                                  <text
                                    x={svgX}
                                    y={svgY - 8}
                                    textAnchor="middle"
                                    fill="#cbd5e1"
                                    fontSize="6"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 p-0.5 rounded text-[5px]"
                                  >
                                    {evt.over}.{evt.ball}
                                  </text>
                                </g>
                              );
                            })
                          )}
                        </svg>

                        {/* Side Visual Legend Panel */}
                        <div className="absolute bottom-2 left-2 flex flex-col gap-1 text-[8px] font-mono text-slate-400 bg-slate-950/80 p-1.5 rounded border border-slate-850">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Wicket</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Boundary</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Runs</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-500" />Dot Ball</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Selected Ball Analysis Panel */}
                    <div className="md:col-span-7 h-full flex flex-col">
                      <AnimatePresence mode="wait">
                        {matchState && selectedBallIndex !== null && matchState.eventsHistory[selectedBallIndex] ? (
                          (() => {
                            const selectedBall = matchState.eventsHistory[selectedBallIndex];
                            const { x, y } = getBallLandingSpot(selectedBall);
                            const lengthInfo = getLengthCategory(y);
                            const lineInfo = getLineCategory(x);
                            return (
                              <motion.div
                                key={selectedBallIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className="bg-slate-950 border border-slate-850 rounded-xl p-4 h-full flex flex-col justify-between space-y-4"
                              >
                                <div>
                                  {/* Header & Delivery Numbers */}
                                  <div className="flex justify-between items-start border-b border-slate-900 pb-3 mb-3">
                                    <div>
                                      <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                                        Delivery Analytics
                                      </span>
                                      <h4 className="text-sm font-semibold text-white mt-0.5">
                                        Over {selectedBall.over}.{selectedBall.ball}
                                      </h4>
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                      selectedBall.isWicket
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : selectedBall.isBoundary
                                        ? 'bg-amber-500 text-slate-950'
                                        : selectedBall.runs > 0
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-slate-900 text-slate-500'
                                    }`}>
                                      {selectedBall.isWicket
                                        ? `OUT - ${selectedBall.wicketType}`
                                        : selectedBall.isBoundary
                                        ? `${selectedBall.runs} RUNS (BND)`
                                        : selectedBall.runs === 0
                                        ? 'DOT BALL'
                                        : `${selectedBall.runs} RUNS`}
                                    </span>
                                  </div>

                                  {/* Striker/Bowler matchup card */}
                                  <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-slate-900/40 border border-slate-900 p-2 rounded-lg">
                                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Bowler</span>
                                      <span className="text-xs font-semibold text-slate-300 truncate block">{selectedBall.bowler}</span>
                                    </div>
                                    <div className="bg-slate-900/40 border border-slate-900 p-2 rounded-lg">
                                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Batsman</span>
                                      <span className="text-xs font-semibold text-slate-300 truncate block">{selectedBall.batsman}</span>
                                    </div>
                                  </div>

                                  {/* Classifications */}
                                  <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-slate-900/10 border border-slate-900 p-2.5 rounded-lg">
                                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Pitched Length</span>
                                      <span className="text-[11px] font-bold block mt-0.5" style={{ color: lengthInfo.color }}>
                                        {lengthInfo.name}
                                      </span>
                                      <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">{lengthInfo.desc}</span>
                                    </div>
                                    <div className="bg-slate-900/10 border border-slate-900 p-2.5 rounded-lg">
                                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Stump Line</span>
                                      <span className="text-[11px] font-bold text-slate-200 block mt-0.5">
                                        {lineInfo.name}
                                      </span>
                                      <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">{lineInfo.desc}</span>
                                    </div>
                                  </div>

                                  {/* Actual Commentary */}
                                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-900/60 text-xs text-slate-300 leading-relaxed italic mb-4">
                                    <span className="font-mono text-[8px] font-bold uppercase bg-slate-800 text-slate-400 px-1 py-0.5 rounded mr-1.5 not-italic">Commentary</span>
                                    "{selectedBall.commentary}"
                                  </div>
                                </div>

                                {/* Bowler Assessment (AI Tactician Assessment) */}
                                <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg mt-auto">
                                  <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                                    🤖 AI Tactical Assessment
                                  </span>
                                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    {selectedBall.isWicket
                                      ? '🎯 Sensational execution! Bowling pitched up on a stump-to-stump line forced the batter into a high-risk stroke, reaping the ultimate wicket-taking reward.'
                                      : selectedBall.isBoundary
                                      ? '⚠️ Execution error. Bowler failed to maintain discipline on the off-stump corridor, leaving room or dropping short/full for an easy boundary scoring option.'
                                      : selectedBall.runs === 0
                                      ? '👏 Outstanding containment bowler control. A precise good-length line restricted the batsman to a solid defensive stroke, building immense dot-ball pressure.'
                                      : '👍 Solid strike rotation delivery. A calculated defensive shot into space, giving away low-risk single runs.'}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })()
                        ) : (
                          <div className="border border-dashed border-slate-850 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[280px] space-y-3">
                            <div className="p-3 bg-slate-950 rounded-full border border-slate-850">
                              <Target className="text-slate-600 animate-pulse" size={24} />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-slate-400">No Ball Selected</h4>
                              <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-normal">
                                Click on any ball spot in the Pitch Map to view deep spatial delivery classifications and tactical AI bowler insights.
                              </p>
                            </div>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Commentary Log & Betting sentiment */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live commentary feeds */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col h-[350px]">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <Radio size={16} className="text-indigo-400 animate-pulse" />
                <h3 className="text-sm font-display font-semibold text-white">Ball-by-Ball Commentary</h3>
              </div>

              <div className="overflow-y-auto space-y-3.5 flex-grow pr-1">
                {matchState.eventsHistory.length > 0 ? (
                  [...matchState.eventsHistory].reverse().map((evt, idx) => {
                    const isWkt = evt.isWicket;
                    const isBnd = evt.isBoundary;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-all ${
                          isWkt
                            ? 'bg-red-500/10 border-red-500/20 text-red-200'
                            : isBnd
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-850/80 text-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-mono font-bold text-slate-400">
                            Over {evt.over}.{evt.ball}
                          </span>
                          <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isWkt ? 'bg-red-500 text-white animate-bounce' : isBnd ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {isWkt ? 'WKT' : isBnd ? `${evt.runs} RUNS` : `${evt.runs} RUN`}
                          </span>
                        </div>
                        <p>{evt.commentary}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center px-4 leading-normal">
                    Waiting for the toss! Hit "Simulate Ball" or "Play" to start streaming commentary events.
                  </div>
                )}
              </div>
            </div>

            {/* Betting Trends Indicators */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-sm font-display font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-400" />
                Simulated Market Trends
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Sentiment Index</span>
                    <span className="text-indigo-400 font-semibold font-mono">
                      {matchState.winProbabilityA > matchState.winProbabilityB ? `${teamA.shortName} Bias` : `${teamB.shortName} Bias`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${Math.max(matchState.winProbabilityA, matchState.winProbabilityB)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl space-y-2.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Virtual Back Odds ({teamA.shortName})</span>
                    <span className="font-mono text-white font-bold">{(100 / (matchState.winProbabilityA || 1)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Virtual Back Odds ({teamB.shortName})</span>
                    <span className="font-mono text-white font-bold">{(100 / (matchState.winProbabilityB || 1)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Simulation Index Swing</span>
                    <span className="font-mono text-indigo-400 font-bold">±{Math.round(Math.abs(matchState.winProbabilityA - 50) * 0.4)}%</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 leading-normal bg-slate-950/20 p-2.5 rounded-lg border border-slate-850/40">
                  ⚠️ <b>Disclaimer:</b> All stats, betting index, volume metrics, and odds indexes displayed are completely virtual and for educational AI-prediction illustration purposes only.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
