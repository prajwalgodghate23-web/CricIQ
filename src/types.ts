/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlayerFormatStats {
  matchesPlayed: number;
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
  economy?: number;
  highestScore?: string;
  bestBowling?: string;
}

export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  runs?: number;
  ballsFaced?: number;
  wickets?: number;
  oversBowled?: number;
  average: number;
  strikeRate: number; // For batsmen
  economy?: number; // For bowlers
  form: number[]; // Last 5 matches ratings (1-10)
  recentScores?: string[];
  // Advanced Career Performance Metrics
  catchSuccessRate?: number; // percentage (e.g. 88.5)
  runOutAssists?: number; // count (e.g. 6)
  matchesPlayed?: number; // career matches
  careerRuns?: number;
  careerWickets?: number;
  bestBowling?: string; // e.g. "4/15"
  highestScore?: number;
  dotBallPercentage?: number; // e.g. 41.2%
  // New visual and tactical analysis fields
  pitchWeakness?: string; // e.g. "Slow left-arm spin on damp wickets"
  strongPointArea?: string; // e.g. "Extra cover drive & pull shot"
  pitchingLength?: string; // e.g. "Good length cutters & yorkers" (for bowlers)
  runsScoredSide?: {
    offside: number; // percentage
    legside: number; // percentage
    straight: number; // percentage
  };
  formats?: {
    Test: PlayerFormatStats;
    ODI: PlayerFormatStats;
    T20: PlayerFormatStats;
  };
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  logo: string;
  battingStrength: number; // 1-100
  bowlingStrength: number; // 1-100
  recentForm: ('W' | 'L')[];
  players: Player[];
  type?: 'ipl' | 'international';
}

export interface StadiumFormatStats {
  avgScore: number;
  highestScore: string;
  lowestScore: string;
  wicketsPace: number;
  wicketsSpin: number;
  matchesPlayed: number;
  chasingWon: number;
  defendingWon: number;
}

export interface StadiumTournamentStats {
  matchesPlayed: number;
  highestChased: string;
  bestPlayer: string;
  keyInsights: string[];
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  avgFirstInningsScore: number;
  pitchType: 'Batting Friendly' | 'Spinner Friendly' | 'Pacer Friendly' | 'Balanced';
  boundarySize: 'Small' | 'Medium' | 'Large';
  formats?: {
    Test: StadiumFormatStats;
    ODI: StadiumFormatStats;
    T20: StadiumFormatStats;
  };
  tournaments?: {
    WorldCup?: StadiumTournamentStats;
    WTC?: StadiumTournamentStats;
    ChampionsTrophy?: StadiumTournamentStats;
  };
}

export interface MatchScenario {
  teamAId: string;
  teamBId: string;
  venueId: string;
  pitchType: string;
  weather: 'Sunny' | 'Humid & Dew' | 'Overcast' | 'Rainy';
  customFactor?: string;
}

export interface PredictionResult {
  matchup: {
    teamA: string;
    teamB: string;
    venue: string;
  };
  winProbability: {
    teamA: number; // e.g. 52
    teamB: number; // e.g. 48
  };
  keyFactors: string[];
  keyMatchupAnalysis: string;
  predictedTopScorer: {
    playerName: string;
    predictedRuns: number;
    reason: string;
  };
  predictedTopWicketeer: {
    playerName: string;
    predictedWickets: number;
    reason: string;
  };
  tacticalInsights: string[];
  predictionReason?: string;
  playSuggestions?: {
    teamA: string;
    teamB: string;
  };
}

export interface BallEvent {
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  runs: number;
  isWicket: boolean;
  wicketType?: string;
  isExtra: boolean;
  extraType?: string;
  isBoundary: boolean;
  commentary: string;
  teamAScore: number;
  teamAWickets: number;
  teamBScore: number;
  teamBWickets: number;
  target?: number;
  currentInnings: 1 | 2;
  winProbA: number;
  winProbB: number;
}

export interface LiveMatchState {
  matchId: string;
  teamA: Team;
  teamB: Team;
  venue: Venue;
  currentInnings: 1 | 2;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  target?: number;
  teamAScore?: number;
  teamAWickets?: number;
  battingTeamId: string;
  bowlingTeamId: string;
  batsman1: { name: string; runs: number; balls: number };
  batsman2: { name: string; runs: number; balls: number };
  currentBowler: { name: string; overs: number; maidens: number; runs: number; wickets: number };
  winProbabilityA: number;
  winProbabilityB: number;
  eventsHistory: BallEvent[];
  isCompleted: boolean;
  winnerId?: string;
  statusText: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'wicket' | 'boundary' | 'milestone' | 'trend' | 'info';
  timestamp: string;
  read: boolean;
}

export interface BettingTrendPoint {
  time: string;
  oddsA: number;
  oddsB: number;
  volume: number; // Simulated total bet volume
}

export interface HistoricalMatch {
  id: string;
  date: string;
  season: string;
  teamAId: string;
  teamBId: string;
  teamAScore: string;
  teamBScore: string;
  winnerId: string;
  margin: string;
  venueId: string;
  playerOfMatch: string;
  stage: 'League' | 'Playoffs' | 'Final';
}

export interface UserAlertSettings {
  wickets: boolean;
  boundaries: boolean;
  probabilityShifts: boolean;
  bettingOdds: boolean;
  milestones: boolean;
}

export interface UserPreferences {
  followedTeams: string[];
  followedPlayers: string[];
  alerts: UserAlertSettings;
}

