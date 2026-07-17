import { Team, Venue, HistoricalMatch } from '../types';

// Mock/Seeded Advanced Stadium statistics
export const venues: Venue[] = [
  {
    id: 'chinnaswamy',
    name: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    avgFirstInningsScore: 192,
    pitchType: 'Batting Friendly',
    boundarySize: 'Small',
    formats: {
      Test: { avgScore: 335, highestScore: '626/10 by IND', lowestScore: '103/10 by AFG', wicketsPace: 58, wicketsSpin: 42, matchesPlayed: 24, chasingWon: 9, defendingWon: 11 },
      ODI: { avgScore: 265, highestScore: '383/6 by IND', lowestScore: '114/10 by IND', wicketsPace: 65, wicketsSpin: 35, matchesPlayed: 38, chasingWon: 20, defendingWon: 16 },
      T20: { avgScore: 188, highestScore: '263/5 by RCB', lowestScore: '99/10 by RCB', wicketsPace: 60, wicketsSpin: 40, matchesPlayed: 45, chasingWon: 25, defendingWon: 18 }
    },
    tournaments: {
      WorldCup: { matchesPlayed: 10, highestChased: '328/10 by IRE vs ENG', bestPlayer: 'Virat Kohli', keyInsights: ['Small boundaries lead to 65%+ boundary percentage.', 'Dew plays a major role under lights.'] },
      WTC: { matchesPlayed: 3, highestChased: '188/4 by IND', bestPlayer: 'Ashwin', keyInsights: ['Turns sharply on Day 3.'] },
      ChampionsTrophy: { matchesPlayed: 4, highestChased: '240/6 by RSA', bestPlayer: 'AB de Villiers', keyInsights: ['Flat deck leads to quick outfields.'] }
    }
  },
  {
    id: 'wankhede',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    avgFirstInningsScore: 185,
    pitchType: 'Batting Friendly',
    boundarySize: 'Medium',
    formats: {
      Test: { avgScore: 345, highestScore: '631/10 by IND', lowestScore: '93/10 by AUS', wicketsPace: 52, wicketsSpin: 48, matchesPlayed: 26, chasingWon: 11, defendingWon: 12 },
      ODI: { avgScore: 258, highestScore: '438/4 by RSA', lowestScore: '79/10 by IND', wicketsPace: 62, wicketsSpin: 38, matchesPlayed: 32, chasingWon: 15, defendingWon: 16 },
      T20: { avgScore: 182, highestScore: '240/3 by IND', lowestScore: '122/10 by SL', wicketsPace: 68, wicketsSpin: 32, matchesPlayed: 41, chasingWon: 23, defendingWon: 17 }
    },
    tournaments: {
      WorldCup: { matchesPlayed: 9, highestChased: '277/4 by IND', bestPlayer: 'MS Dhoni', keyInsights: ['Ocean breeze assists swing under lights.', 'Excellent carry for shot makers.'] },
      WTC: { matchesPlayed: 2, highestChased: '120/5 by IND', bestPlayer: 'Ashwin', keyInsights: ['Spinners dominate after day 2.'] },
      ChampionsTrophy: { matchesPlayed: 3, highestChased: '220/4 by NZ', bestPlayer: 'Stephen Fleming', keyInsights: ['True track with excellent bounce.'] }
    }
  },
  {
    id: 'chepauk',
    name: 'MA Chidambaram Stadium',
    city: 'Chennai',
    avgFirstInningsScore: 162,
    pitchType: 'Spinner Friendly',
    boundarySize: 'Medium',
    formats: {
      Test: { avgScore: 312, highestScore: '759/7d by IND', lowestScore: '83/10 by IND', wicketsPace: 40, wicketsSpin: 60, matchesPlayed: 34, chasingWon: 10, defendingWon: 18 },
      ODI: { avgScore: 235, highestScore: '337/7 by PAK', lowestScore: '69/10 by IND', wicketsPace: 48, wicketsSpin: 52, matchesPlayed: 24, chasingWon: 11, defendingWon: 12 },
      T20: { avgScore: 158, highestScore: '246/5 by CSK', lowestScore: '80/10 by RCB', wicketsPace: 45, wicketsSpin: 55, matchesPlayed: 30, chasingWon: 12, defendingWon: 17 }
    },
    tournaments: {
      WorldCup: { matchesPlayed: 8, highestChased: '201/4 by IND', bestPlayer: 'Ravindra Jadeja', keyInsights: ['Heavy spin and grip from first over.', 'Slower cutters work perfectly here.'] },
      WTC: { matchesPlayed: 2, highestChased: '227/10 by ENG', bestPlayer: 'Joe Root', keyInsights: ['Abrasive red clay bakes fast.'] },
      ChampionsTrophy: { matchesPlayed: 2, highestChased: '190/5 by RSA', bestPlayer: 'Kallis', keyInsights: ['Turns from the rough early.'] }
    }
  },
  {
    id: 'ahmedabad',
    name: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    avgFirstInningsScore: 175,
    pitchType: 'Balanced',
    boundarySize: 'Large',
    formats: {
      Test: { avgScore: 290, highestScore: '575/10 by IND', lowestScore: '81/10 by ENG', wicketsPace: 55, wicketsSpin: 45, matchesPlayed: 15, chasingWon: 6, defendingWon: 7 },
      ODI: { avgScore: 245, highestScore: '365/2 by RSA', lowestScore: '85/10 by ZIM', wicketsPace: 58, wicketsSpin: 42, matchesPlayed: 28, chasingWon: 15, defendingWon: 13 },
      T20: { avgScore: 172, highestScore: '234/4 by IND', lowestScore: '124/7 by IND', wicketsPace: 62, wicketsSpin: 38, matchesPlayed: 26, chasingWon: 15, defendingWon: 11 }
    },
    tournaments: {
      WorldCup: { matchesPlayed: 12, highestChased: '241/4 by AUS (2023 Final)', bestPlayer: 'Travis Head', keyInsights: ['Massive boundaries make running between wickets critical.', 'Dual soil tracks (Black vs Red).'] },
      WTC: { matchesPlayed: 3, highestChased: '115/2 by IND', bestPlayer: 'Axar Patel', keyInsights: ['Pink ball tests wrap up inside 2 days.'] },
      ChampionsTrophy: { matchesPlayed: 5, highestChased: '263/5 by IND', bestPlayer: 'Rahul Dravid', keyInsights: ['Highly balanced track testing versatility.'] }
    }
  }
];

// 20 Teams Array (10 IPL, 10 International)
export const teams: Team[] = [
  // --- IPL TEAMS ---
  {
    id: 'rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    color: '#ef4444',
    secondaryColor: '#ca8a04',
    logo: '🏏',
    battingStrength: 92,
    bowlingStrength: 82,
    recentForm: ['W', 'W', 'L', 'W', 'L'],
    type: 'ipl',
    players: [
      { id: 'virat_kohli', name: 'Virat Kohli', role: 'Batsman', average: 52.8, strikeRate: 138.4, form: [9, 10, 8, 9, 7], recentScores: ['92', '47', '21', '101*', '33'], catchSuccessRate: 91.4, runOutAssists: 14, matchesPlayed: 244, careerRuns: 7263, careerWickets: 4, highestScore: 113, dotBallPercentage: 35.2, pitchWeakness: 'Left-arm orthodox spin on turning pitches', strongPointArea: 'Cover drive & mid-wicket pull', runsScoredSide: { offside: 45, legside: 35, straight: 20 } },
      { id: 'faf_du_plessis', name: 'Faf du Plessis', role: 'Batsman', average: 41.2, strikeRate: 140.5, form: [7, 8, 6, 9, 5], recentScores: ['64', '35', '17', '71', '24'], catchSuccessRate: 93.6, runOutAssists: 9, matchesPlayed: 145, careerRuns: 4512, careerWickets: 0, highestScore: 96, dotBallPercentage: 36.5, pitchWeakness: 'Inswinging pacers early on', strongPointArea: 'Lofted straight drives', runsScoredSide: { offside: 30, legside: 30, straight: 40 } },
      { id: 'glenn_maxwell', name: 'Glenn Maxwell', role: 'All-Rounder', average: 31.4, strikeRate: 164.2, economy: 8.4, form: [6, 4, 9, 8, 5], recentScores: ['12', '41', '0', '56', '5'], catchSuccessRate: 86.4, runOutAssists: 11, matchesPlayed: 130, careerRuns: 2810, careerWickets: 38, highestScore: 103, bestBowling: "3/15", dotBallPercentage: 42.1, pitchWeakness: 'Hard length slow cutters', strongPointArea: 'Reverse sweeps and pull shots', runsScoredSide: { offside: 25, legside: 50, straight: 25 } },
      { id: 'mohammed_siraj', name: 'Mohammed Siraj', role: 'Bowler', average: 18.5, strikeRate: 110.0, economy: 8.65, form: [8, 7, 9, 5, 6], recentScores: ['1', '0', '4*', '0', '2'], catchSuccessRate: 80.2, runOutAssists: 4, matchesPlayed: 93, careerRuns: 120, careerWickets: 93, bestBowling: '4/21', dotBallPercentage: 48.6, pitchWeakness: 'Short-pitched bouncers', strongPointArea: 'Tail-end loft over cow corner', pitchingLength: 'Good length outswingers & yorkers', runsScoredSide: { offside: 30, legside: 40, straight: 30 } }
    ]
  },
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    color: '#eab308',
    secondaryColor: '#1d4ed8',
    logo: '🦁',
    battingStrength: 89,
    bowlingStrength: 90,
    recentForm: ['W', 'L', 'W', 'W', 'W'],
    type: 'ipl',
    players: [
      { id: 'ruturaj_gaikwad', name: 'Ruturaj Gaikwad', role: 'Batsman', average: 48.5, strikeRate: 135.2, form: [9, 8, 9, 10, 8], recentScores: ['62', '108*', '98', '42', '32'], catchSuccessRate: 92.5, runOutAssists: 7, matchesPlayed: 68, careerRuns: 2697, careerWickets: 0, highestScore: 108, dotBallPercentage: 34.1, pitchWeakness: 'Left arm fast swing', strongPointArea: 'Elegant square cut & cover drive', runsScoredSide: { offside: 50, legside: 25, straight: 25 } },
      { id: 'shivam_dube', name: 'Shivam Dube', role: 'All-Rounder', average: 42.4, strikeRate: 162.5, economy: 9.1, form: [9, 7, 8, 5, 9], recentScores: ['66*', '51', '18', '24', '48*'], catchSuccessRate: 85.1, runOutAssists: 5, matchesPlayed: 59, careerRuns: 1399, careerWickets: 5, highestScore: 95, bestBowling: '1/15', dotBallPercentage: 40.2, pitchWeakness: 'Short pitch bouncers', strongPointArea: 'Massive straight lofts over spinners', runsScoredSide: { offside: 20, legside: 40, straight: 40 } },
      { id: 'ms_dhoni', name: 'MS Dhoni', role: 'Wicketkeeper', average: 40.5, strikeRate: 182.4, form: [8, 9, 10, 7, 9], recentScores: ['28*', '37*', '12*', '20*', '4*'], catchSuccessRate: 98.4, runOutAssists: 31, matchesPlayed: 262, careerRuns: 5218, careerWickets: 0, highestScore: 84, dotBallPercentage: 33.5, pitchWeakness: 'Wide-line back of length yorkers', strongPointArea: 'Helicopter shot & pull over midwicket', runsScoredSide: { offside: 30, legside: 45, straight: 25 } },
      { id: 'matheesha_pathirana', name: 'Matheesha Pathirana', role: 'Bowler', average: 10.0, strikeRate: 140.0, economy: 7.68, form: [9, 10, 8, 9, 9], recentScores: ['0', '1*', '0', '0', '0'], catchSuccessRate: 81.6, runOutAssists: 2, matchesPlayed: 20, careerRuns: 20, careerWickets: 42, bestBowling: '4/15', dotBallPercentage: 51.2, pitchWeakness: 'Express pace sweeps', strongPointArea: 'Slinging toe crushers', pitchingLength: 'Toe-crushing death yorkers', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    color: '#2563eb',
    secondaryColor: '#f97316',
    logo: '⚡',
    battingStrength: 91,
    bowlingStrength: 86,
    recentForm: ['L', 'W', 'L', 'L', 'W'],
    type: 'ipl',
    players: [
      { id: 'rohit_sharma', name: 'Rohit Sharma', role: 'Batsman', average: 40.2, strikeRate: 145.6, form: [7, 6, 8, 9, 5], recentScores: ['36', '105*', '19', '8', '6'], catchSuccessRate: 91.8, runOutAssists: 11, matchesPlayed: 252, careerRuns: 6528, careerWickets: 15, highestScore: 109, bestBowling: '4/6', dotBallPercentage: 35.8, pitchWeakness: 'Left-arm inswingers early on', strongPointArea: 'Pull shot & elegant cover drives', runsScoredSide: { offside: 40, legside: 40, straight: 20 } },
      { id: 'suryakumar_yadav', name: 'Suryakumar Yadav', role: 'Batsman', average: 46.8, strikeRate: 168.2, form: [10, 8, 10, 6, 9], recentScores: ['102*', '56', '78', '10', '52'], catchSuccessRate: 89.6, runOutAssists: 6, matchesPlayed: 144, careerRuns: 3594, careerWickets: 0, highestScore: 103, dotBallPercentage: 33.2, pitchWeakness: 'Slow cutters wide off-stump', strongPointArea: '360 degree sweeps and scoops', runsScoredSide: { offside: 30, legside: 50, straight: 20 } },
      { id: 'hardik_pandya', name: 'Hardik Pandya', role: 'All-Rounder', average: 28.5, strikeRate: 139.4, economy: 9.35, form: [5, 6, 7, 5, 8], recentScores: ['46', '10', '2', '24', '39'], catchSuccessRate: 88.5, runOutAssists: 10, matchesPlayed: 137, careerRuns: 2425, careerWickets: 62, highestScore: 91, bestBowling: '3/17', dotBallPercentage: 41.5, pitchWeakness: 'Outside-off channels', strongPointArea: 'Hard lofted hitting over long-on', runsScoredSide: { offside: 35, legside: 35, straight: 30 } },
      { id: 'jasprit_bumrah', name: 'Jasprit Bumrah', role: 'Bowler', average: 21.0, strikeRate: 185.0, economy: 6.48, form: [10, 10, 9, 10, 8], recentScores: ['4', '1', '12*', '0', '0'], catchSuccessRate: 84.8, runOutAssists: 8, matchesPlayed: 133, careerRuns: 165, careerWickets: 165, bestBowling: '5/10', dotBallPercentage: 54.5, pitchWeakness: 'Defending wide off-stump sweeps', strongPointArea: 'Unplayable yorkers and heavy bouncers', pitchingLength: 'Searing yorkers & good length seamers', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    color: '#6d28d9',
    secondaryColor: '#f59e0b',
    logo: '⚔️',
    battingStrength: 90,
    bowlingStrength: 89,
    recentForm: ['W', 'W', 'W', 'L', 'W'],
    type: 'ipl',
    players: [
      { id: 'phil_salt', name: 'Phil Salt', role: 'Wicketkeeper', average: 39.8, strikeRate: 156.4, form: [8, 9, 8, 5, 9], recentScores: ['68', '32', '48', '10', '89*'], catchSuccessRate: 93.2, runOutAssists: 12, matchesPlayed: 21, careerRuns: 785, careerWickets: 0, highestScore: 89, dotBallPercentage: 35.1, pitchWeakness: 'Slow spin on sticky surfaces', strongPointArea: 'Aggressive cover punch & pulls', runsScoredSide: { offside: 45, legside: 35, straight: 20 } },
      { id: 'sunil_narine', name: 'Sunil Narine', role: 'All-Rounder', average: 38.6, strikeRate: 165.8, economy: 6.82, form: [10, 9, 8, 10, 9], recentScores: ['81', '71', '15', '109', '30'], catchSuccessRate: 89.2, runOutAssists: 14, matchesPlayed: 176, careerRuns: 1520, careerWickets: 180, highestScore: 109, bestBowling: '4/19', dotBallPercentage: 48.9, pitchWeakness: 'Express pace short ball', strongPointArea: 'Flat-bat boundaries through offside', runsScoredSide: { offside: 50, legside: 30, straight: 20 } },
      { id: 'rinku_singh', name: 'Rinku Singh', role: 'Batsman', average: 44.5, strikeRate: 150.0, form: [7, 7, 8, 6, 8], recentScores: ['20*', '16*', '26', '5', '9*'], catchSuccessRate: 94.0, runOutAssists: 5, matchesPlayed: 46, careerRuns: 893, careerWickets: 0, highestScore: 67, dotBallPercentage: 34.5, pitchWeakness: 'Bouncers at extreme pace', strongPointArea: 'Deep crease finish over legside', runsScoredSide: { offside: 25, legside: 45, straight: 30 } },
      { id: 'varun_chakaravarthy', name: 'Varun Chakaravarthy', role: 'Bowler', average: 16.5, strikeRate: 120.0, economy: 8.04, form: [9, 8, 9, 8, 9], recentScores: ['0', '1', '0', '0', '0'], catchSuccessRate: 81.2, runOutAssists: 1, matchesPlayed: 70, careerRuns: 30, careerWickets: 86, bestBowling: '5/20', dotBallPercentage: 47.5, pitchWeakness: 'Aggressive sweep play', strongPointArea: 'Mystery carrom ball', pitchingLength: 'Flat good length turning tracks', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    color: '#ea580c',
    secondaryColor: '#171717',
    logo: '🦅',
    battingStrength: 95,
    bowlingStrength: 83,
    recentForm: ['W', 'L', 'W', 'W', 'L'],
    type: 'ipl',
    players: [
      { id: 'travis_head', name: 'Travis Head', role: 'Batsman', average: 45.4, strikeRate: 182.5, form: [10, 8, 10, 9, 5], recentScores: ['89', '0', '58', '102', '31'], catchSuccessRate: 89.5, runOutAssists: 6, matchesPlayed: 43, careerRuns: 1540, careerWickets: 2, highestScore: 102, dotBallPercentage: 31.8, pitchWeakness: 'Slow spin inside-edge', strongPointArea: 'Slicing over backward point & covers', runsScoredSide: { offside: 60, legside: 20, straight: 20 } },
      { id: 'abhishek_sharma', name: 'Abhishek Sharma', role: 'Batsman', average: 38.2, strikeRate: 185.1, form: [8, 9, 7, 9, 6], recentScores: ['75*', '12', '46', '34', '63'], catchSuccessRate: 87.2, runOutAssists: 5, matchesPlayed: 63, careerRuns: 1378, careerWickets: 9, highestScore: 75, bestBowling: '2/4', dotBallPercentage: 32.5, pitchWeakness: 'High pace short bouncer', strongPointArea: 'Lofted pulls and cover drive', runsScoredSide: { offside: 35, legside: 40, straight: 25 } },
      { id: 'heinrich_klaasen', name: 'Heinrich Klaasen', role: 'Wicketkeeper', average: 48.1, strikeRate: 171.4, form: [9, 9, 8, 7, 8], recentScores: ['42', '67*', '10', '20', '56'], catchSuccessRate: 95.8, runOutAssists: 14, matchesPlayed: 35, careerRuns: 1256, careerWickets: 0, highestScore: 104, dotBallPercentage: 34.2, pitchWeakness: 'Wide sliding yorkers', strongPointArea: 'Backfoot punches & pulls', runsScoredSide: { offside: 30, legside: 40, straight: 30 } },
      { id: 'pat_cummins', name: 'Pat Cummins', role: 'Bowler', average: 22.0, strikeRate: 155.0, economy: 8.12, form: [9, 8, 9, 8, 8], recentScores: ['35', '12*', '2', '1', '14'], catchSuccessRate: 90.2, runOutAssists: 12, matchesPlayed: 58, careerRuns: 460, careerWickets: 63, bestBowling: '4/34', dotBallPercentage: 47.8, pitchWeakness: 'Full tosses and scoop shots', strongPointArea: 'Hard deck back of length', pitchingLength: 'Hard good length & sharp bouncers', runsScoredSide: { offside: 35, legside: 30, straight: 35 } }
    ]
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    color: '#06b6d4',
    secondaryColor: '#1e3a8a',
    logo: '🔵',
    battingStrength: 86,
    bowlingStrength: 85,
    recentForm: ['L', 'W', 'W', 'L', 'L'],
    type: 'ipl',
    players: [
      { id: 'kl_rahul', name: 'KL Rahul', role: 'Wicketkeeper', average: 45.8, strikeRate: 134.6, form: [8, 8, 7, 6, 9], recentScores: ['58', '29', '76', '12', '82'], catchSuccessRate: 94.2, runOutAssists: 8, matchesPlayed: 132, careerRuns: 4683, careerWickets: 0, highestScore: 132, dotBallPercentage: 36.1, pitchWeakness: 'Moving ball in first over', strongPointArea: 'Exquisite square cut & pick-up flick', runsScoredSide: { offside: 45, legside: 35, straight: 20 } },
      { id: 'nicholas_pooran', name: 'Nicholas Pooran', role: 'Batsman', average: 38.4, strikeRate: 165.2, form: [9, 8, 9, 7, 7], recentScores: ['75*', '12', '45', '18', '61'], catchSuccessRate: 90.5, runOutAssists: 6, matchesPlayed: 75, careerRuns: 1850, careerWickets: 0, highestScore: 89, dotBallPercentage: 34.0, pitchWeakness: 'Wide outside-off spinners', strongPointArea: 'Clean swing over deep midwicket', runsScoredSide: { offside: 25, legside: 50, straight: 25 } },
      { id: 'marcus_stoinis', name: 'Marcus Stoinis', role: 'All-Rounder', average: 32.2, strikeRate: 145.4, economy: 8.85, form: [7, 8, 6, 9, 5], recentScores: ['124*', '19', '2', '34', '5'], catchSuccessRate: 88.0, runOutAssists: 4, matchesPlayed: 92, careerRuns: 1850, careerWickets: 42, highestScore: 124, bestBowling: '3/15', dotBallPercentage: 42.0, pitchWeakness: 'Slow left arm spin', strongPointArea: 'Power hitting down the ground', runsScoredSide: { offside: 35, legside: 35, straight: 30 } },
      { id: 'ravi_bishnoi', name: 'Ravi Bishnoi', role: 'Bowler', average: 15.2, strikeRate: 110.0, economy: 7.92, form: [8, 7, 7, 9, 6], recentScores: ['0', '2*', '1', '0', '0'], catchSuccessRate: 82.5, runOutAssists: 3, matchesPlayed: 65, careerRuns: 110, careerWickets: 62, bestBowling: '4/24', dotBallPercentage: 45.8, pitchWeakness: 'Batsmen sweeping down leg', strongPointArea: 'Skidding googlies on legstump', pitchingLength: 'Quick skidding flat good lengths', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    color: '#db2777',
    secondaryColor: '#1d4ed8',
    logo: '👑',
    battingStrength: 88,
    bowlingStrength: 89,
    recentForm: ['L', 'L', 'L', 'W', 'W'],
    type: 'ipl',
    players: [
      { id: 'yashasvi_jaiswal', name: 'Yashasvi Jaiswal', role: 'Batsman', average: 41.5, strikeRate: 152.4, form: [8, 9, 7, 5, 9], recentScores: ['67', '104*', '35', '19', '24'], catchSuccessRate: 89.2, runOutAssists: 4, matchesPlayed: 49, careerRuns: 1608, careerWickets: 0, highestScore: 124, dotBallPercentage: 35.6, pitchWeakness: 'Incoming swinging deliveries', strongPointArea: 'Cover drive & upper cut', runsScoredSide: { offside: 45, legside: 35, straight: 20 } },
      { id: 'sanju_samson', name: 'Sanju Samson', role: 'Batsman', average: 45.2, strikeRate: 151.8, form: [9, 8, 9, 7, 8], recentScores: ['86', '18', '71*', '38', '68'], catchSuccessRate: 96.0, runOutAssists: 22, matchesPlayed: 167, careerRuns: 4411, careerWickets: 0, highestScore: 119, dotBallPercentage: 33.8, pitchWeakness: 'Slow cutters early in innings', strongPointArea: 'Punches through covers & pull shot', runsScoredSide: { offside: 40, legside: 30, straight: 30 } },
      { id: 'jos_buttler', name: 'Jos Buttler', role: 'Wicketkeeper', average: 43.8, strikeRate: 145.2, form: [9, 6, 10, 8, 5], recentScores: ['59', '11', '107*', '38', '0'], catchSuccessRate: 95.1, runOutAssists: 17, matchesPlayed: 107, careerRuns: 3582, careerWickets: 0, highestScore: 124, dotBallPercentage: 34.0, pitchWeakness: 'Moving ball outside off stump', strongPointArea: 'Scoop shots and cover boundaries', runsScoredSide: { offside: 35, legside: 40, straight: 25 } },
      { id: 'trent_boult', name: 'Trent Boult', role: 'Bowler', average: 14.0, strikeRate: 110.0, economy: 7.82, form: [8, 9, 8, 6, 7], recentScores: ['1', '12*', '0', '0', '0'], catchSuccessRate: 92.0, runOutAssists: 9, matchesPlayed: 104, careerRuns: 125, careerWickets: 121, bestBowling: '4/18', dotBallPercentage: 51.0, pitchWeakness: 'Extreme right-handed sweeps', strongPointArea: 'Insane powerplay swing', pitchingLength: 'Full length swing & pitching yorkers', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    color: '#0f172a',
    secondaryColor: '#eab308',
    logo: '🔱',
    battingStrength: 87,
    bowlingStrength: 88,
    recentForm: ['W', 'L', 'W', 'L', 'W'],
    type: 'ipl',
    players: [
      { id: 'shubman_gill', name: 'Shubman Gill', role: 'Batsman', average: 47.2, strikeRate: 139.5, form: [9, 8, 8, 9, 7], recentScores: ['104*', '35', '12', '76', '41'], catchSuccessRate: 92.0, runOutAssists: 8, matchesPlayed: 103, careerRuns: 3218, careerWickets: 0, highestScore: 129, dotBallPercentage: 35.1, pitchWeakness: 'Left arm orthodox spin', strongPointArea: 'Elegant short arm jab & cover drive', runsScoredSide: { offside: 40, legside: 40, straight: 20 } },
      { id: 'sai_sudharsan', name: 'Sai Sudharsan', role: 'Batsman', average: 42.5, strikeRate: 135.8, form: [8, 9, 7, 8, 6], recentScores: ['103', '21', '45', '84*', '19'], catchSuccessRate: 88.5, runOutAssists: 3, matchesPlayed: 25, careerRuns: 1025, careerWickets: 0, highestScore: 103, dotBallPercentage: 36.8, pitchWeakness: 'High pace bouncers', strongPointArea: 'Driving on both sides of wicket', runsScoredSide: { offside: 45, legside: 35, straight: 20 } },
      { id: 'rashid_khan', name: 'Rashid Khan', role: 'All-Rounder', average: 21.8, strikeRate: 156.4, economy: 7.25, form: [8, 9, 9, 7, 8], recentScores: ['12', '45*', '0', '21', '18*'], catchSuccessRate: 91.2, runOutAssists: 15, matchesPlayed: 121, careerRuns: 650, careerWickets: 145, highestScore: 79, bestBowling: '4/24', dotBallPercentage: 48.0, pitchWeakness: 'Wide-line pacers with height', strongPointArea: 'Snake shot over midwicket', runsScoredSide: { offside: 20, legside: 50, straight: 30 } },
      { id: 'mohit_sharma', name: 'Mohit Sharma', role: 'Bowler', average: 15.0, strikeRate: 110.0, economy: 8.42, form: [7, 8, 6, 8, 8], recentScores: ['0', '4*', '0', '0', '0'], catchSuccessRate: 85.0, runOutAssists: 4, matchesPlayed: 115, careerRuns: 150, careerWickets: 124, bestBowling: '5/10', dotBallPercentage: 46.5, pitchWeakness: 'Express batsmen hitting straight', strongPointArea: 'Slower back-of-hand balls', pitchingLength: 'Good length slower cutters', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    color: '#1d4ed8',
    secondaryColor: '#ef4444',
    logo: '🐯',
    battingStrength: 86,
    bowlingStrength: 87,
    recentForm: ['L', 'W', 'W', 'L', 'W'],
    type: 'ipl',
    players: [
      { id: 'jake_fraser', name: 'Jake Fraser-McGurk', role: 'Batsman', average: 36.5, strikeRate: 198.5, form: [10, 8, 9, 5, 8], recentScores: ['84', '20', '50', '4', '65'], catchSuccessRate: 85.0, runOutAssists: 2, matchesPlayed: 9, careerRuns: 330, careerWickets: 0, highestScore: 84, dotBallPercentage: 30.1, pitchWeakness: 'Slow spinners with extra turn', strongPointArea: 'Extreme baseball-like swings', runsScoredSide: { offside: 35, legside: 35, straight: 30 } },
      { id: 'rishabh_pant', name: 'Rishabh Pant', role: 'Wicketkeeper', average: 38.8, strikeRate: 148.5, form: [9, 8, 7, 9, 8], recentScores: ['51', '88*', '12', '45', '21'], catchSuccessRate: 94.5, runOutAssists: 16, matchesPlayed: 111, careerRuns: 3284, careerWickets: 0, highestScore: 128, dotBallPercentage: 35.2, pitchWeakness: 'Turning off spin away from body', strongPointArea: 'One-handed sixes over legside', runsScoredSide: { offside: 30, legside: 45, straight: 25 } },
      { id: 'axar_patel', name: 'Axar Patel', role: 'All-Rounder', average: 29.5, strikeRate: 135.2, economy: 7.15, form: [9, 8, 8, 7, 9], recentScores: ['31*', '12', '25', '4*', '41'], catchSuccessRate: 94.0, runOutAssists: 12, matchesPlayed: 60, careerRuns: 850, careerWickets: 62, highestScore: 65, bestBowling: '3/9', dotBallPercentage: 48.0, pitchWeakness: 'Short pace bowling', strongPointArea: 'Flat lofts through covers', runsScoredSide: { offside: 35, legside: 35, straight: 30 } },
      { id: 'kuldeep_yadav', name: 'Kuldeep Yadav', role: 'Bowler', average: 14.2, strikeRate: 110.0, economy: 7.42, form: [9, 8, 9, 8, 9], recentScores: ['0', '1*', '0', '0', '0'], catchSuccessRate: 82.0, runOutAssists: 2, matchesPlayed: 103, careerRuns: 150, careerWickets: 168, bestBowling: '6/25', dotBallPercentage: 51.2, pitchWeakness: 'Batsmen using feet down straight', strongPointArea: 'Mystery chinaman loop', pitchingLength: 'Good length slower loop spinners', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    color: '#dc2626',
    secondaryColor: '#e2e8f0',
    logo: '🦁',
    battingStrength: 85,
    bowlingStrength: 86,
    recentForm: ['L', 'L', 'W', 'W', 'L'],
    type: 'ipl',
    players: [
      { id: 'shashank_singh', name: 'Shashank Singh', role: 'Batsman', average: 44.2, strikeRate: 165.4, form: [8, 9, 9, 7, 8], recentScores: ['61*', '15', '68*', '4', '35'], catchSuccessRate: 88.0, runOutAssists: 3, matchesPlayed: 15, careerRuns: 354, careerWickets: 0, highestScore: 68, dotBallPercentage: 32.5, pitchWeakness: 'Hard length slow bouncers', strongPointArea: 'Flat bat pulls over midwicket', runsScoredSide: { offside: 25, legside: 45, straight: 30 } },
      { id: 'jonny_bairstow', name: 'Jonny Bairstow', role: 'Batsman', average: 32.1, strikeRate: 146.5, form: [7, 8, 10, 6, 5], recentScores: ['108*', '12', '8', '47', '21'], catchSuccessRate: 90.0, runOutAssists: 4, matchesPlayed: 45, careerRuns: 1520, careerWickets: 0, highestScore: 114, dotBallPercentage: 35.8, pitchWeakness: 'Incoming nip back seamers', strongPointArea: 'Brutal legside slugging', runsScoredSide: { offside: 30, legside: 50, straight: 20 } },
      { id: 'sam_curran', name: 'Sam Curran', role: 'All-Rounder', average: 25.8, strikeRate: 138.4, economy: 8.65, form: [7, 6, 8, 7, 9], recentScores: ['12*', '20', '35*', '5', '41'], catchSuccessRate: 85.0, runOutAssists: 6, matchesPlayed: 52, careerRuns: 680, careerWickets: 48, highestScore: 95, bestBowling: '5/10', dotBallPercentage: 45.2, pitchWeakness: 'Extreme high pace bouncers', strongPointArea: 'Lofted offside drives', runsScoredSide: { offside: 40, legside: 30, straight: 30 } },
      { id: 'arshdeep_singh', name: 'Arshdeep Singh', role: 'Bowler', average: 12.0, strikeRate: 95.0, economy: 8.35, form: [8, 8, 9, 7, 7], recentScores: ['0', '1*', '0', '0', '0'], catchSuccessRate: 81.5, runOutAssists: 3, matchesPlayed: 60, careerRuns: 50, careerWickets: 75, bestBowling: '5/32', dotBallPercentage: 48.0, pitchWeakness: 'Slicing shots outside off', strongPointArea: 'Powerplay swing and death block holes', pitchingLength: 'Wide outside-off yorkers & inswingers', runsScoredSide: { offside: 30, legside: 30, straight: 40 } }
    ]
  },

  // --- INTERNATIONAL TEAMS ---
  {
    id: 'ind',
    name: 'India',
    shortName: 'IND',
    color: '#1e40af',
    secondaryColor: '#f97316',
    logo: '🇮🇳',
    battingStrength: 96,
    bowlingStrength: 95,
    recentForm: ['W', 'W', 'W', 'W', 'W'],
    type: 'international',
    players: [
      {
        id: 'rohit_ind',
        name: 'Rohit Sharma',
        role: 'Batsman',
        average: 49.2,
        strikeRate: 140.2,
        form: [9, 8, 10, 7, 9],
        recentScores: ['92', '23', '103', '8', '57'],
        catchSuccessRate: 91.5,
        runOutAssists: 18,
        matchesPlayed: 265,
        careerRuns: 10843,
        careerWickets: 12,
        highestScore: 264,
        dotBallPercentage: 38.2,
        pitchWeakness: 'Left-arm seam swing inside-edge',
        strongPointArea: 'Elite pull shot over deep midwicket',
        runsScoredSide: { offside: 35, legside: 45, straight: 20 },
        formats: {
          Test: { matchesPlayed: 15, runs: 1180, wickets: 0, average: 45.4, strikeRate: 65.5, highestScore: '131', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 1040, wickets: 0, average: 52.0, strikeRate: 110.4, highestScore: '131', bestBowling: '0/0' },
          T20: { matchesPlayed: 25, runs: 780, wickets: 0, average: 35.5, strikeRate: 145.2, highestScore: '121*', bestBowling: '0/0' }
        }
      },
      {
        id: 'kohli_ind',
        name: 'Virat Kohli',
        role: 'Batsman',
        average: 58.5,
        strikeRate: 137.8,
        form: [10, 9, 8, 10, 8],
        recentScores: ['117', '51', '76', '101*', '45'],
        catchSuccessRate: 92.4,
        runOutAssists: 21,
        matchesPlayed: 295,
        careerRuns: 13848,
        careerWickets: 5,
        highestScore: 183,
        dotBallPercentage: 32.5,
        pitchWeakness: 'Spin on sticky surfaces',
        strongPointArea: 'Exquisite cover drive',
        runsScoredSide: { offside: 50, legside: 30, straight: 20 },
        formats: {
          Test: { matchesPlayed: 16, runs: 1250, wickets: 0, average: 50.0, strikeRate: 58.4, highestScore: '186', bestBowling: '0/0' },
          ODI: { matchesPlayed: 25, runs: 1380, wickets: 0, average: 65.7, strikeRate: 98.5, highestScore: '117', bestBowling: '1/15' },
          T20: { matchesPlayed: 24, runs: 850, wickets: 0, average: 42.5, strikeRate: 135.4, highestScore: '101*', bestBowling: '0/0' }
        }
      },
      {
        id: 'pant_ind',
        name: 'Rishabh Pant',
        role: 'Wicketkeeper',
        average: 39.5,
        strikeRate: 148.5,
        form: [8, 9, 7, 7, 9],
        recentScores: ['42', '65', '12', '89*', '33'],
        catchSuccessRate: 95.8,
        runOutAssists: 15,
        matchesPlayed: 74,
        careerRuns: 2150,
        careerWickets: 0,
        highestScore: 125,
        dotBallPercentage: 35.6,
        pitchWeakness: 'Spin turning away off stump',
        strongPointArea: 'One-handed sweeps & down-the-ground lofts',
        runsScoredSide: { offside: 30, legside: 45, straight: 25 },
        formats: {
          Test: { matchesPlayed: 12, runs: 950, wickets: 0, average: 47.5, strikeRate: 78.5, highestScore: '146', bestBowling: '0/0' },
          ODI: { matchesPlayed: 18, runs: 710, wickets: 0, average: 39.4, strikeRate: 108.5, highestScore: '125*', bestBowling: '0/0' },
          T20: { matchesPlayed: 30, runs: 820, wickets: 0, average: 31.5, strikeRate: 152.4, highestScore: '89*', bestBowling: '0/0' }
        }
      },
      {
        id: 'bumrah_ind',
        name: 'Jasprit Bumrah',
        role: 'Bowler',
        average: 15.0,
        strikeRate: 195.0,
        economy: 6.22,
        form: [10, 10, 9, 10, 10],
        recentScores: ['1', '0', '4*', '0', '0'],
        catchSuccessRate: 86.4,
        runOutAssists: 7,
        matchesPlayed: 89,
        careerRuns: 95,
        careerWickets: 149,
        bestBowling: '6/19',
        dotBallPercentage: 55.8,
        pitchWeakness: 'None - elite all-format execution',
        strongPointArea: 'Deadly yorker & slower ball dip',
        pitchingLength: 'Unplayable death yorkers & heavy cutters',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 14, runs: 120, wickets: 62, average: 10.0, strikeRate: 12.5, economy: 2.75, highestScore: '34*', bestBowling: '6/19' },
          ODI: { matchesPlayed: 24, runs: 45, wickets: 48, average: 7.5, strikeRate: 8.5, economy: 4.42, highestScore: '14*', bestBowling: '6/19' },
          T20: { matchesPlayed: 32, runs: 15, wickets: 45, average: 5.0, strikeRate: 6.2, economy: 6.15, highestScore: '4*', bestBowling: '4/7' }
        }
      }
    ]
  },
  {
    id: 'pak',
    name: 'Pakistan',
    shortName: 'PAK',
    color: '#047857',
    secondaryColor: '#facc15',
    logo: '🇵🇰',
    battingStrength: 89,
    bowlingStrength: 91,
    recentForm: ['L', 'W', 'W', 'L', 'W'],
    type: 'international',
    players: [
      {
        id: 'babar_pak',
        name: 'Babar Azam',
        role: 'Batsman',
        average: 51.5,
        strikeRate: 132.8,
        form: [9, 8, 7, 8, 8],
        recentScores: ['68', '35', '101', '12', '45'],
        catchSuccessRate: 90.0,
        runOutAssists: 9,
        matchesPlayed: 112,
        careerRuns: 4500,
        careerWickets: 0,
        highestScore: 122,
        dotBallPercentage: 34.0,
        pitchWeakness: 'Outside off stump slow sliders',
        strongPointArea: 'Elegant punch drives & crisp cuts',
        runsScoredSide: { offside: 45, legside: 35, straight: 20 },
        formats: {
          Test: { matchesPlayed: 14, runs: 1100, wickets: 0, average: 47.8, strikeRate: 55.4, highestScore: '196', bestBowling: '0/0' },
          ODI: { matchesPlayed: 20, runs: 980, wickets: 0, average: 51.5, strikeRate: 89.4, highestScore: '158', bestBowling: '0/0' },
          T20: { matchesPlayed: 28, runs: 920, wickets: 0, average: 36.8, strikeRate: 131.5, highestScore: '122', bestBowling: '0/0' }
        }
      },
      {
        id: 'rizwan_pak',
        name: 'Mohammad Rizwan',
        role: 'Wicketkeeper',
        average: 44.8,
        strikeRate: 135.2,
        form: [8, 9, 8, 7, 7],
        recentScores: ['41', '82*', '10', '52', '18'],
        catchSuccessRate: 95.2,
        runOutAssists: 11,
        matchesPlayed: 98,
        careerRuns: 3100,
        careerWickets: 0,
        highestScore: 104,
        dotBallPercentage: 33.1,
        pitchWeakness: 'Short pace bouncers',
        strongPointArea: 'Sweep and slog sweep over square leg',
        runsScoredSide: { offside: 25, legside: 50, straight: 25 },
        formats: {
          Test: { matchesPlayed: 12, runs: 820, wickets: 0, average: 45.5, strikeRate: 58.2, highestScore: '115*', bestBowling: '0/0' },
          ODI: { matchesPlayed: 20, runs: 840, wickets: 0, average: 44.0, strikeRate: 92.5, highestScore: '131*', bestBowling: '0/0' },
          T20: { matchesPlayed: 30, runs: 950, wickets: 0, average: 39.5, strikeRate: 132.8, highestScore: '104*', bestBowling: '0/0' }
        }
      },
      {
        id: 'fakhar_pak',
        name: 'Fakhar Zaman',
        role: 'Batsman',
        average: 38.2,
        strikeRate: 145.4,
        form: [7, 8, 9, 5, 6],
        recentScores: ['23', '81', '0', '45', '12'],
        catchSuccessRate: 85.5,
        runOutAssists: 3,
        matchesPlayed: 82,
        careerRuns: 2500,
        careerWickets: 0,
        highestScore: 193,
        dotBallPercentage: 38.0,
        pitchWeakness: 'Left arm orthodox spin',
        strongPointArea: 'Lofted straight punches & pull shots',
        runsScoredSide: { offside: 30, legside: 40, straight: 30 },
        formats: {
          Test: { matchesPlayed: 4, runs: 210, wickets: 0, average: 26.2, strikeRate: 75.4, highestScore: '94', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 950, wickets: 0, average: 43.1, strikeRate: 105.4, highestScore: '193', bestBowling: '0/0' },
          T20: { matchesPlayed: 26, runs: 710, wickets: 0, average: 28.4, strikeRate: 142.1, highestScore: '81', bestBowling: '0/0' }
        }
      },
      {
        id: 'shaheen_pak',
        name: 'Shaheen Afridi',
        role: 'Bowler',
        average: 15.0,
        strikeRate: 105.0,
        economy: 7.85,
        form: [9, 9, 8, 8, 9],
        recentScores: ['0', '12*', '1', '0', '0'],
        catchSuccessRate: 87.2,
        runOutAssists: 4,
        matchesPlayed: 65,
        careerRuns: 210,
        careerWickets: 98,
        bestBowling: '5/19',
        dotBallPercentage: 50.5,
        pitchWeakness: 'Right-handers stepping across stump',
        strongPointArea: 'Deadly opening-over full swings',
        pitchingLength: 'Full length inswingers & yorkers',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 12, runs: 150, wickets: 48, average: 12.5, strikeRate: 15.0, economy: 3.12, highestScore: '33', bestBowling: '6/51' },
          ODI: { matchesPlayed: 20, runs: 90, wickets: 42, average: 9.0, strikeRate: 10.5, economy: 5.25, highestScore: '28*', bestBowling: '5/19' },
          T20: { matchesPlayed: 32, runs: 75, wickets: 40, average: 7.5, strikeRate: 9.2, economy: 7.82, highestScore: '15*', bestBowling: '4/18' }
        }
      }
    ]
  },
  {
    id: 'eng',
    name: 'England',
    shortName: 'ENG',
    color: '#0284c7',
    secondaryColor: '#dc2626',
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    battingStrength: 93,
    bowlingStrength: 88,
    recentForm: ['W', 'L', 'W', 'L', 'W'],
    type: 'international',
    players: [
      {
        id: 'buttler_eng',
        name: 'Jos Buttler',
        role: 'Wicketkeeper',
        average: 41.8,
        strikeRate: 150.2,
        form: [9, 8, 7, 9, 5],
        recentScores: ['83*', '11', '107*', '4*', '32'],
        catchSuccessRate: 94.8,
        runOutAssists: 20,
        matchesPlayed: 182,
        careerRuns: 5120,
        careerWickets: 0,
        highestScore: 162,
        dotBallPercentage: 35.1,
        pitchWeakness: 'Incoming nip-back pace',
        strongPointArea: 'Laps & straight ground loft',
        runsScoredSide: { offside: 35, legside: 40, straight: 25 },
        formats: {
          Test: { matchesPlayed: 5, runs: 280, wickets: 0, average: 31.1, strikeRate: 72.4, highestScore: '85', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 910, wickets: 0, average: 45.5, strikeRate: 115.4, highestScore: '162', bestBowling: '0/0' },
          T20: { matchesPlayed: 30, runs: 1120, wickets: 0, average: 44.8, strikeRate: 155.6, highestScore: '107*', bestBowling: '0/0' }
        }
      },
      {
        id: 'salt_eng',
        name: 'Phil Salt',
        role: 'Batsman',
        average: 36.5,
        strikeRate: 162.8,
        form: [8, 9, 6, 8, 9],
        recentScores: ['119', '38', '51', '10', '88*'],
        catchSuccessRate: 88.5,
        runOutAssists: 4,
        matchesPlayed: 32,
        careerRuns: 1040,
        careerWickets: 0,
        highestScore: 119,
        dotBallPercentage: 32.8,
        pitchWeakness: 'Extreme left-arm spin',
        strongPointArea: 'Flat bat shots through cover',
        runsScoredSide: { offside: 45, legside: 35, straight: 20 },
        formats: {
          Test: { matchesPlayed: 0, runs: 0, wickets: 0, average: 0, strikeRate: 0, highestScore: '—', bestBowling: '0/0' },
          ODI: { matchesPlayed: 15, runs: 520, wickets: 0, average: 34.6, strikeRate: 125.4, highestScore: '112', bestBowling: '0/0' },
          T20: { matchesPlayed: 34, runs: 1180, wickets: 0, average: 38.1, strikeRate: 165.2, highestScore: '119', bestBowling: '0/0' }
        }
      },
      {
        id: 'brook_eng',
        name: 'Harry Brook',
        role: 'Batsman',
        average: 44.2,
        strikeRate: 145.6,
        form: [9, 8, 10, 5, 8],
        recentScores: ['53', '105*', '22', '31', '40'],
        catchSuccessRate: 90.2,
        runOutAssists: 3,
        matchesPlayed: 35,
        careerRuns: 1150,
        careerWickets: 0,
        highestScore: 105,
        dotBallPercentage: 34.6,
        pitchWeakness: 'Slow cutters on sticky pitch',
        strongPointArea: 'Backfoot punch and pulls',
        runsScoredSide: { offside: 40, legside: 30, straight: 30 },
        formats: {
          Test: { matchesPlayed: 14, runs: 1150, wickets: 0, average: 57.5, strikeRate: 88.5, highestScore: '186', bestBowling: '1/10' },
          ODI: { matchesPlayed: 20, runs: 820, wickets: 0, average: 45.5, strikeRate: 102.4, highestScore: '105*', bestBowling: '0/0' },
          T20: { matchesPlayed: 28, runs: 740, wickets: 0, average: 37.0, strikeRate: 146.5, highestScore: '67', bestBowling: '0/0' }
        }
      },
      {
        id: 'archer_eng',
        name: 'Jofra Archer',
        role: 'Bowler',
        average: 14.1,
        strikeRate: 130.0,
        economy: 7.82,
        form: [8, 9, 8, 7, 9],
        recentScores: ['5*', '0', '1', '0', '0'],
        catchSuccessRate: 89.1,
        runOutAssists: 2,
        matchesPlayed: 28,
        careerRuns: 85,
        careerWickets: 45,
        bestBowling: '6/40',
        dotBallPercentage: 51.5,
        pitchWeakness: 'Aggressive sweep maneuvers',
        strongPointArea: 'Express high-arm bounce',
        pitchingLength: 'Effortless bouncers & good lengths',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 4, runs: 50, wickets: 15, average: 8.3, strikeRate: 12.0, economy: 2.92, highestScore: '22', bestBowling: '6/40' },
          ODI: { matchesPlayed: 14, runs: 30, wickets: 25, average: 6.0, strikeRate: 8.5, economy: 5.12, highestScore: '15', bestBowling: '6/40' },
          T20: { matchesPlayed: 28, runs: 20, wickets: 32, average: 4.0, strikeRate: 6.4, economy: 7.42, highestScore: '10', bestBowling: '4/12' }
        }
      }
    ]
  },
  {
    id: 'aus',
    name: 'Australia',
    shortName: 'AUS',
    color: '#fbbf24',
    secondaryColor: '#047857',
    logo: '🇦🇺',
    battingStrength: 94,
    bowlingStrength: 96,
    recentForm: ['W', 'W', 'L', 'W', 'W'],
    type: 'international',
    players: [
      {
        id: 'head_aus',
        name: 'Travis Head',
        role: 'Batsman',
        average: 44.5,
        strikeRate: 158.4,
        form: [10, 9, 8, 9, 5],
        recentScores: ['137', '0', '76', '45', '21'],
        catchSuccessRate: 89.8,
        runOutAssists: 5,
        matchesPlayed: 68,
        careerRuns: 2540,
        careerWickets: 14,
        highestScore: 152,
        bestBowling: '2/15',
        dotBallPercentage: 33.2,
        pitchWeakness: 'Slow spin on sluggish decks',
        strongPointArea: 'Square cut and slashing cover drive',
        runsScoredSide: { offside: 60, legside: 20, straight: 20 },
        formats: {
          Test: { matchesPlayed: 15, runs: 1120, wickets: 4, average: 44.8, strikeRate: 75.2, highestScore: '152', bestBowling: '2/15' },
          ODI: { matchesPlayed: 24, runs: 1220, wickets: 6, average: 55.4, strikeRate: 112.4, highestScore: '137', bestBowling: '2/15' },
          T20: { matchesPlayed: 28, runs: 980, wickets: 2, average: 39.2, strikeRate: 168.5, highestScore: '92', bestBowling: '1/10' }
        }
      },
      {
        id: 'smith_aus',
        name: 'Steve Smith',
        role: 'Batsman',
        average: 48.2,
        strikeRate: 124.5,
        form: [8, 9, 7, 8, 8],
        recentScores: ['82', '41', '105', '12', '56'],
        catchSuccessRate: 95.0,
        runOutAssists: 8,
        matchesPlayed: 155,
        careerRuns: 5420,
        careerWickets: 28,
        highestScore: 164,
        bestBowling: '3/16',
        dotBallPercentage: 36.8,
        pitchWeakness: 'Left-arm orthodox spinners',
        strongPointArea: 'Deflection clips and legside taps',
        runsScoredSide: { offside: 30, legside: 45, straight: 25 },
        formats: {
          Test: { matchesPlayed: 16, runs: 1320, wickets: 2, average: 52.8, strikeRate: 48.5, highestScore: '164', bestBowling: '1/20' },
          ODI: { matchesPlayed: 22, runs: 980, wickets: 4, average: 49.0, strikeRate: 88.5, highestScore: '105', bestBowling: '1/10' },
          T20: { matchesPlayed: 18, runs: 510, wickets: 0, average: 31.8, strikeRate: 124.5, highestScore: '82', bestBowling: '0/0' }
        }
      },
      {
        id: 'maxwell_aus',
        name: 'Glenn Maxwell',
        role: 'All-Rounder',
        average: 35.4,
        strikeRate: 155.8,
        economy: 7.98,
        form: [9, 10, 4, 8, 6],
        recentScores: ['201*', '41', '0', '104*', '11'],
        catchSuccessRate: 87.2,
        runOutAssists: 12,
        matchesPlayed: 141,
        careerRuns: 3850,
        careerWickets: 64,
        highestScore: 201,
        bestBowling: '4/40',
        dotBallPercentage: 41.8,
        pitchWeakness: 'Fast rising short deliveries',
        strongPointArea: 'Incredible switch-hits and pulls',
        runsScoredSide: { offside: 25, legside: 50, straight: 25 },
        formats: {
          Test: { matchesPlayed: 2, runs: 90, wickets: 2, average: 22.5, strikeRate: 85.0, highestScore: '45', bestBowling: '1/15' },
          ODI: { matchesPlayed: 25, runs: 920, wickets: 22, average: 41.8, strikeRate: 148.5, economy: 5.45, highestScore: '201*', bestBowling: '4/40' },
          T20: { matchesPlayed: 30, runs: 880, wickets: 14, average: 35.2, strikeRate: 165.4, economy: 8.12, highestScore: '104*', bestBowling: '3/15' }
        }
      },
      {
        id: 'starc_aus',
        name: 'Mitchell Starc',
        role: 'Bowler',
        average: 16.5,
        strikeRate: 110.0,
        economy: 8.24,
        form: [8, 9, 10, 6, 8],
        recentScores: ['1', '12*', '0', '0', '0'],
        catchSuccessRate: 83.2,
        runOutAssists: 3,
        matchesPlayed: 121,
        careerRuns: 450,
        careerWickets: 236,
        bestBowling: '6/28',
        dotBallPercentage: 52.8,
        pitchWeakness: 'Sweeps by left-handed batsman',
        strongPointArea: 'Unbelievable opening inswing yorkers',
        pitchingLength: 'Toe crushers & full length swingers',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 14, runs: 240, wickets: 58, average: 17.1, strikeRate: 22.0, economy: 3.25, highestScore: '45', bestBowling: '6/28' },
          ODI: { matchesPlayed: 25, runs: 110, wickets: 46, average: 9.1, strikeRate: 11.5, economy: 4.85, highestScore: '18', bestBowling: '5/33' },
          T20: { matchesPlayed: 28, runs: 30, wickets: 34, average: 5.0, strikeRate: 6.8, economy: 8.12, highestScore: '12*', bestBowling: '4/20' }
        }
      }
    ]
  },
  {
    id: 'bang',
    name: 'Bangladesh',
    shortName: 'BAN',
    color: '#047857',
    secondaryColor: '#dc2626',
    logo: '🇧🇩',
    battingStrength: 84,
    bowlingStrength: 86,
    recentForm: ['W', 'L', 'L', 'W', 'W'],
    type: 'international',
    players: [
      {
        id: 'shakib_bang',
        name: 'Shakib Al Hasan',
        role: 'All-Rounder',
        average: 36.8,
        strikeRate: 122.5,
        economy: 6.85,
        form: [8, 7, 8, 9, 6],
        recentScores: ['42', '12', '56*', '4', '33'],
        catchSuccessRate: 91.2,
        runOutAssists: 14,
        matchesPlayed: 117,
        careerRuns: 2400,
        careerWickets: 140,
        highestScore: 84,
        bestBowling: '5/20',
        dotBallPercentage: 46.2,
        pitchWeakness: 'Extreme pace over 145km/h bouncers',
        strongPointArea: 'Point cuts & slog sweeps',
        runsScoredSide: { offside: 35, legside: 40, straight: 25 },
        formats: {
          Test: { matchesPlayed: 10, runs: 650, wickets: 32, average: 36.1, strikeRate: 62.5, economy: 2.85, highestScore: '124', bestBowling: '5/40' },
          ODI: { matchesPlayed: 22, runs: 850, wickets: 38, average: 42.5, strikeRate: 85.4, economy: 4.52, highestScore: '92', bestBowling: '5/29' },
          T20: { matchesPlayed: 28, runs: 580, wickets: 26, average: 24.1, strikeRate: 122.5, economy: 6.82, highestScore: '68*', bestBowling: '4/9' }
        }
      },
      {
        id: 'litton_bang',
        name: 'Litton Das',
        role: 'Wicketkeeper',
        average: 30.5,
        strikeRate: 130.4,
        form: [6, 8, 7, 5, 8],
        recentScores: ['15', '60', '21', '8', '45'],
        catchSuccessRate: 92.5,
        runOutAssists: 6,
        matchesPlayed: 78,
        careerRuns: 1850,
        careerWickets: 0,
        highestScore: 73,
        dotBallPercentage: 38.0,
        pitchWeakness: 'Early lateral swing',
        strongPointArea: 'Stylish drives & pick up pulls',
        runsScoredSide: { offside: 40, legside: 35, straight: 25 },
        formats: {
          Test: { matchesPlayed: 10, runs: 620, wickets: 0, average: 34.4, strikeRate: 58.2, highestScore: '141', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 710, wickets: 0, average: 33.8, strikeRate: 88.4, highestScore: '113', bestBowling: '0/0' },
          T20: { matchesPlayed: 26, runs: 650, wickets: 0, average: 26.0, strikeRate: 130.4, highestScore: '73', bestBowling: '0/0' }
        }
      },
      {
        id: 'shanto_bang',
        name: 'Najmul Hossain Shanto',
        role: 'Batsman',
        average: 32.1,
        strikeRate: 125.4,
        form: [7, 6, 8, 8, 5],
        recentScores: ['35', '51', '12', '20', '4*'],
        catchSuccessRate: 88.0,
        runOutAssists: 2,
        matchesPlayed: 45,
        careerRuns: 1050,
        careerWickets: 0,
        highestScore: 71,
        dotBallPercentage: 39.5,
        pitchWeakness: 'Off spin drift outside off',
        strongPointArea: 'Cover drives & sweep shots',
        runsScoredSide: { offside: 45, legside: 35, straight: 20 },
        formats: {
          Test: { matchesPlayed: 10, runs: 680, wickets: 0, average: 37.7, strikeRate: 48.5, highestScore: '124', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 780, wickets: 0, average: 35.4, strikeRate: 82.1, highestScore: '117', bestBowling: '0/0' },
          T20: { matchesPlayed: 24, runs: 510, wickets: 0, average: 24.2, strikeRate: 118.5, highestScore: '71', bestBowling: '0/0' }
        }
      },
      {
        id: 'mustafizur_bang',
        name: 'Mustafizur Rahman',
        role: 'Bowler',
        average: 11.5,
        strikeRate: 95.0,
        economy: 7.92,
        form: [8, 9, 8, 7, 9],
        recentScores: ['0', '1*', '0', '0', '0'],
        catchSuccessRate: 83.4,
        runOutAssists: 3,
        matchesPlayed: 92,
        careerRuns: 60,
        careerWickets: 110,
        bestBowling: '5/22',
        dotBallPercentage: 51.0,
        pitchWeakness: 'Slogging right-handers down the ground',
        strongPointArea: 'Inimitable slower cutters',
        pitchingLength: 'Good length off-cutters',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 2, runs: 12, wickets: 4, average: 6.0, strikeRate: 8.2, economy: 3.45, highestScore: '8*', bestBowling: '2/35' },
          ODI: { matchesPlayed: 22, runs: 28, wickets: 32, average: 5.6, strikeRate: 7.1, economy: 5.12, highestScore: '12', bestBowling: '5/22' },
          T20: { matchesPlayed: 30, runs: 10, wickets: 38, average: 3.3, strikeRate: 5.1, economy: 7.65, highestScore: '4*', bestBowling: '4/12' }
        }
      }
    ]
  },
  {
    id: 'sa',
    name: 'South Africa',
    shortName: 'RSA',
    color: '#047857',
    secondaryColor: '#facc15',
    logo: '🇿🇦',
    battingStrength: 92,
    bowlingStrength: 94,
    recentForm: ['W', 'W', 'L', 'W', 'L'],
    type: 'international',
    players: [
      {
        id: 'dekock_rsa',
        name: 'Quinton de Kock',
        role: 'Wicketkeeper',
        average: 44.8,
        strikeRate: 145.2,
        form: [9, 8, 6, 10, 8],
        recentScores: ['109', '4', '174', '21', '81'],
        catchSuccessRate: 96.2,
        runOutAssists: 17,
        matchesPlayed: 155,
        careerRuns: 6720,
        careerWickets: 0,
        highestScore: 178,
        dotBallPercentage: 34.0,
        pitchWeakness: 'Left-arm orthodox spin on sluggish tracks',
        strongPointArea: 'Pull shots and slashing off-side cuts',
        runsScoredSide: { offside: 40, legside: 45, straight: 15 },
        formats: {
          Test: { matchesPlayed: 2, runs: 110, wickets: 0, average: 27.5, strikeRate: 75.2, highestScore: '65', bestBowling: '0/0' },
          ODI: { matchesPlayed: 25, runs: 1240, wickets: 0, average: 51.6, strikeRate: 108.5, highestScore: '174', bestBowling: '0/0' },
          T20: { matchesPlayed: 28, runs: 950, wickets: 0, average: 38.0, strikeRate: 145.2, highestScore: '109', bestBowling: '0/0' }
        }
      },
      {
        id: 'klaasen_rsa',
        name: 'Heinrich Klaasen',
        role: 'Batsman',
        average: 41.5,
        strikeRate: 168.4,
        form: [9, 10, 8, 7, 9],
        recentScores: ['109', '47', '12', '56*', '104*'],
        catchSuccessRate: 93.6,
        runOutAssists: 6,
        matchesPlayed: 54,
        careerRuns: 1720,
        careerWickets: 0,
        highestScore: 119,
        dotBallPercentage: 32.1,
        pitchWeakness: 'Wide sliding yorkers',
        strongPointArea: 'Backfoot punches & monstrous pulls',
        runsScoredSide: { offside: 30, legside: 40, straight: 30 },
        formats: {
          Test: { matchesPlayed: 4, runs: 180, wickets: 0, average: 22.5, strikeRate: 65.4, highestScore: '45', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 920, wickets: 0, average: 46.0, strikeRate: 124.5, highestScore: '119', bestBowling: '0/0' },
          T20: { matchesPlayed: 30, runs: 1180, wickets: 0, average: 49.1, strikeRate: 171.4, highestScore: '104*', bestBowling: '0/0' }
        }
      },
      {
        id: 'miller_rsa',
        name: 'David Miller',
        role: 'Batsman',
        average: 42.1,
        strikeRate: 139.8,
        form: [7, 8, 9, 6, 8],
        recentScores: ['101*', '24', '35', '43*', '11'],
        catchSuccessRate: 94.0,
        runOutAssists: 5,
        matchesPlayed: 165,
        careerRuns: 4150,
        careerWickets: 0,
        highestScore: 139,
        dotBallPercentage: 35.0,
        pitchWeakness: 'Outside off stump slow sliders',
        strongPointArea: 'Deep crease lofts over long-on',
        runsScoredSide: { offside: 25, legside: 45, straight: 30 },
        formats: {
          Test: { matchesPlayed: 0, runs: 0, wickets: 0, average: 0, strikeRate: 0, highestScore: '—', bestBowling: '0/0' },
          ODI: { matchesPlayed: 24, runs: 850, wickets: 0, average: 42.5, strikeRate: 101.4, highestScore: '101*', bestBowling: '0/0' },
          T20: { matchesPlayed: 32, runs: 920, wickets: 0, average: 38.3, strikeRate: 139.8, highestScore: '85*', bestBowling: '0/0' }
        }
      },
      {
        id: 'rabada_rsa',
        name: 'Kagiso Rabada',
        role: 'Bowler',
        average: 16.2,
        strikeRate: 120.0,
        economy: 7.95,
        form: [9, 8, 10, 6, 8],
        recentScores: ['1', '0', '4*', '0', '0'],
        catchSuccessRate: 85.1,
        runOutAssists: 4,
        matchesPlayed: 101,
        careerRuns: 340,
        careerWickets: 157,
        bestBowling: '5/16',
        dotBallPercentage: 51.0,
        pitchWeakness: 'Express pace paddle sweeps',
        strongPointArea: 'Heavy high-arm seam bounce',
        pitchingLength: 'Hard good lengths & heavy bouncers',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 12, runs: 180, wickets: 55, average: 15.0, strikeRate: 18.2, economy: 3.12, highestScore: '34', bestBowling: '6/50' },
          ODI: { matchesPlayed: 22, runs: 95, wickets: 38, average: 8.6, strikeRate: 9.8, economy: 4.95, highestScore: '21', bestBowling: '5/16' },
          T20: { matchesPlayed: 28, runs: 32, wickets: 32, average: 5.3, strikeRate: 6.8, economy: 7.82, highestScore: '12*', bestBowling: '4/21' }
        }
      }
    ]
  },
  {
    id: 'nz',
    name: 'New Zealand',
    shortName: 'NZ',
    color: '#0f172a',
    secondaryColor: '#64748b',
    logo: '🇳🇿',
    battingStrength: 91,
    bowlingStrength: 90,
    recentForm: ['L', 'W', 'W', 'L', 'W'],
    type: 'international',
    players: [
      {
        id: 'conway_nz',
        name: 'Devon Conway',
        role: 'Wicketkeeper',
        average: 46.5,
        strikeRate: 135.2,
        form: [8, 9, 7, 9, 8],
        recentScores: ['152*', '20', '45', '12', '76'],
        catchSuccessRate: 95.5,
        runOutAssists: 14,
        matchesPlayed: 46,
        careerRuns: 1850,
        careerWickets: 0,
        highestScore: 152,
        dotBallPercentage: 34.6,
        pitchWeakness: 'Express pace inside-edge',
        strongPointArea: 'Flicks off pads & square cuts',
        runsScoredSide: { offside: 40, legside: 40, straight: 20 },
        formats: {
          Test: { matchesPlayed: 12, runs: 850, wickets: 0, average: 42.5, strikeRate: 52.4, highestScore: '122', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 1020, wickets: 0, average: 51.0, strikeRate: 92.5, highestScore: '152*', bestBowling: '0/0' },
          T20: { matchesPlayed: 28, runs: 880, wickets: 0, average: 36.6, strikeRate: 135.2, highestScore: '92*', bestBowling: '0/0' }
        }
      },
      {
        id: 'williamson_nz',
        name: 'Kane Williamson',
        role: 'Batsman',
        average: 50.8,
        strikeRate: 126.5,
        form: [9, 9, 8, 10, 8],
        recentScores: ['104', '45', '78', '92*', '33'],
        catchSuccessRate: 94.2,
        runOutAssists: 12,
        matchesPlayed: 165,
        careerRuns: 6840,
        careerWickets: 1,
        highestScore: 148,
        bestBowling: '1/10',
        dotBallPercentage: 35.8,
        pitchWeakness: 'Left-arm seam swing outside off',
        strongPointArea: 'Soft hands late cut & cover drive',
        runsScoredSide: { offside: 50, legside: 25, straight: 25 },
        formats: {
          Test: { matchesPlayed: 14, runs: 1180, wickets: 0, average: 59.0, strikeRate: 46.5, highestScore: '148', bestBowling: '0/0' },
          ODI: { matchesPlayed: 20, runs: 920, wickets: 0, average: 51.1, strikeRate: 85.2, highestScore: '104', bestBowling: '1/10' },
          T20: { matchesPlayed: 24, runs: 780, wickets: 0, average: 39.0, strikeRate: 126.5, highestScore: '92*', bestBowling: '0/0' }
        }
      },
      {
        id: 'phillips_nz',
        name: 'Glenn Phillips',
        role: 'All-Rounder',
        average: 35.8,
        strikeRate: 145.4,
        economy: 7.95,
        form: [7, 8, 9, 6, 7],
        recentScores: ['45*', '12', '24', '104', '5'],
        catchSuccessRate: 93.1,
        runOutAssists: 11,
        matchesPlayed: 60,
        careerRuns: 1650,
        careerWickets: 12,
        highestScore: 108,
        bestBowling: '3/15',
        dotBallPercentage: 38.5,
        pitchWeakness: 'Turning off-breaks',
        strongPointArea: 'Monstrous flat lofts over legside',
        runsScoredSide: { offside: 25, legside: 45, straight: 30 },
        formats: {
          Test: { matchesPlayed: 10, runs: 480, wickets: 12, average: 32.0, strikeRate: 75.4, economy: 3.42, highestScore: '87', bestBowling: '3/45' },
          ODI: { matchesPlayed: 22, runs: 710, wickets: 10, average: 39.4, strikeRate: 102.5, economy: 5.15, highestScore: '72*', bestBowling: '2/20' },
          T20: { matchesPlayed: 30, runs: 820, wickets: 8, average: 34.1, strikeRate: 145.4, economy: 7.92, highestScore: '104', bestBowling: '3/15' }
        }
      },
      {
        id: 'boult_nz',
        name: 'Trent Boult',
        role: 'Bowler',
        average: 14.5,
        strikeRate: 110.0,
        economy: 7.85,
        form: [8, 9, 10, 6, 7],
        recentScores: ['1', '8*', '0', '0', '0'],
        catchSuccessRate: 92.5,
        runOutAssists: 10,
        matchesPlayed: 114,
        careerRuns: 180,
        careerWickets: 211,
        bestBowling: '5/34',
        dotBallPercentage: 51.5,
        pitchWeakness: 'Slicing right-handed sweeps',
        strongPointArea: 'Elite powerplay swing',
        pitchingLength: 'Full length swingers & pitching yorkers',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 4, runs: 52, wickets: 16, average: 13.0, strikeRate: 15.2, economy: 2.98, highestScore: '21*', bestBowling: '5/43' },
          ODI: { matchesPlayed: 22, runs: 45, wickets: 38, average: 7.5, strikeRate: 8.4, economy: 4.85, highestScore: '12', bestBowling: '5/34' },
          T20: { matchesPlayed: 28, runs: 12, wickets: 34, average: 4.0, strikeRate: 5.5, economy: 7.62, highestScore: '8*', bestBowling: '4/13' }
        }
      }
    ]
  },
  {
    id: 'wi',
    name: 'West Indies',
    shortName: 'WI',
    color: '#881337',
    secondaryColor: '#fbbf24',
    logo: '🌴',
    battingStrength: 90,
    bowlingStrength: 86,
    recentForm: ['W', 'L', 'W', 'W', 'L'],
    type: 'international',
    players: [
      {
        id: 'pooran_wi',
        name: 'Nicholas Pooran',
        role: 'Batsman',
        average: 39.2,
        strikeRate: 166.4,
        form: [9, 8, 9, 7, 7],
        recentScores: ['75*', '12', '45', '18', '61'],
        catchSuccessRate: 90.5,
        runOutAssists: 6,
        matchesPlayed: 75,
        careerRuns: 1850,
        careerWickets: 0,
        highestScore: 89,
        dotBallPercentage: 34.0,
        pitchWeakness: 'Slow spin away off stump',
        strongPointArea: 'Clean swing over deep midwicket',
        runsScoredSide: { offside: 25, legside: 50, straight: 25 },
        formats: {
          Test: { matchesPlayed: 0, runs: 0, wickets: 0, average: 0, strikeRate: 0, highestScore: '—', bestBowling: '0/0' },
          ODI: { matchesPlayed: 20, runs: 780, wickets: 0, average: 43.3, strikeRate: 102.5, highestScore: '115', bestBowling: '0/0' },
          T20: { matchesPlayed: 34, runs: 1250, wickets: 0, average: 44.6, strikeRate: 166.4, highestScore: '89*', bestBowling: '0/0' }
        }
      },
      {
        id: 'hope_wi',
        name: 'Shai Hope',
        role: 'Wicketkeeper',
        average: 42.5,
        strikeRate: 124.8,
        form: [8, 9, 7, 8, 6],
        recentScores: ['45', '82', '12', '51', '20'],
        catchSuccessRate: 94.1,
        runOutAssists: 9,
        matchesPlayed: 115,
        careerRuns: 4320,
        careerWickets: 0,
        highestScore: 146,
        dotBallPercentage: 37.5,
        pitchWeakness: 'Nipping back seam',
        strongPointArea: 'Elegant classical cover drives',
        runsScoredSide: { offside: 45, legside: 30, straight: 25 },
        formats: {
          Test: { matchesPlayed: 6, runs: 320, wickets: 0, average: 32.0, strikeRate: 45.4, highestScore: '85', bestBowling: '0/0' },
          ODI: { matchesPlayed: 24, runs: 1080, wickets: 0, average: 49.0, strikeRate: 88.5, highestScore: '146', bestBowling: '0/0' },
          T20: { matchesPlayed: 22, runs: 580, wickets: 0, average: 30.5, strikeRate: 124.8, highestScore: '62', bestBowling: '0/0' }
        }
      },
      {
        id: 'russell_wi',
        name: 'Andre Russell',
        role: 'All-Rounder',
        average: 30.5,
        strikeRate: 182.4,
        economy: 8.92,
        form: [8, 9, 7, 6, 8],
        recentScores: ['15*', '24', '41*', '5', '10'],
        catchSuccessRate: 90.0,
        runOutAssists: 10,
        matchesPlayed: 79,
        careerRuns: 1100,
        careerWickets: 52,
        highestScore: 88,
        bestBowling: '3/14',
        dotBallPercentage: 42.8,
        pitchWeakness: 'Hard pace short ball under nose',
        strongPointArea: 'Severe standing lofts over cow corner',
        runsScoredSide: { offside: 30, legside: 45, straight: 25 },
        formats: {
          Test: { matchesPlayed: 0, runs: 0, wickets: 0, average: 0, strikeRate: 0, highestScore: '—', bestBowling: '0/0' },
          ODI: { matchesPlayed: 10, runs: 280, wickets: 12, average: 35.0, strikeRate: 145.4, economy: 5.85, highestScore: '52', bestBowling: '3/25' },
          T20: { matchesPlayed: 32, runs: 720, wickets: 28, average: 30.0, strikeRate: 182.4, economy: 8.92, highestScore: '88*', bestBowling: '3/14' }
        }
      },
      {
        id: 'joseph_wi',
        name: 'Alzarri Joseph',
        role: 'Bowler',
        average: 13.5,
        strikeRate: 105.0,
        economy: 8.45,
        form: [7, 8, 9, 6, 7],
        recentScores: ['2', '0*', '0', '1', '0'],
        catchSuccessRate: 85.0,
        runOutAssists: 2,
        matchesPlayed: 48,
        careerRuns: 120,
        careerWickets: 68,
        bestBowling: '4/19',
        dotBallPercentage: 46.2,
        pitchWeakness: 'Slick batsmen redirecting pace',
        strongPointArea: 'Steep bouncers with express speed',
        pitchingLength: 'Back of length bouncers & good lengths',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 12, runs: 210, wickets: 38, average: 17.5, strikeRate: 21.0, economy: 3.42, highestScore: '45', bestBowling: '4/62' },
          ODI: { matchesPlayed: 22, runs: 65, wickets: 32, average: 8.1, strikeRate: 9.5, economy: 5.45, highestScore: '15', bestBowling: '4/45' },
          T20: { matchesPlayed: 28, runs: 22, wickets: 30, average: 5.5, strikeRate: 6.8, economy: 8.24, highestScore: '10*', bestBowling: '4/19' }
        }
      }
    ]
  },
  {
    id: 'sl',
    name: 'Sri Lanka',
    shortName: 'SL',
    color: '#1e3a8a',
    secondaryColor: '#fbbf24',
    logo: '🇱🇰',
    battingStrength: 87,
    bowlingStrength: 88,
    recentForm: ['L', 'W', 'L', 'W', 'W'],
    type: 'international',
    players: [
      {
        id: 'nissanka_sl',
        name: 'Pathum Nissanka',
        role: 'Batsman',
        average: 39.8,
        strikeRate: 132.4,
        form: [8, 9, 7, 8, 8],
        recentScores: ['72', '12', '101*', '45', '19'],
        catchSuccessRate: 91.0,
        runOutAssists: 5,
        matchesPlayed: 52,
        careerRuns: 1650,
        careerWickets: 0,
        highestScore: 137,
        dotBallPercentage: 35.2,
        pitchWeakness: 'Nipping left arm swing',
        strongPointArea: 'Exquisite point punch and cover drives',
        runsScoredSide: { offside: 45, legside: 35, straight: 20 },
        formats: {
          Test: { matchesPlayed: 10, runs: 680, wickets: 0, average: 37.7, strikeRate: 54.2, highestScore: '112', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 950, wickets: 0, average: 47.5, strikeRate: 88.5, highestScore: '137', bestBowling: '0/0' },
          T20: { matchesPlayed: 28, runs: 720, wickets: 0, average: 27.6, strikeRate: 132.4, highestScore: '101*', bestBowling: '0/0' }
        }
      },
      {
        id: 'mendis_sl',
        name: 'Kusal Mendis',
        role: 'Wicketkeeper',
        average: 35.1,
        strikeRate: 135.8,
        form: [7, 8, 6, 9, 8],
        recentScores: ['41', '23', '64', '11', '83'],
        catchSuccessRate: 93.6,
        runOutAssists: 8,
        matchesPlayed: 114,
        careerRuns: 3120,
        careerWickets: 0,
        highestScore: 119,
        dotBallPercentage: 34.1,
        pitchWeakness: 'Short bouncers at high speed',
        strongPointArea: 'Crisp square cuts & sweeps',
        runsScoredSide: { offside: 35, legside: 40, straight: 25 },
        formats: {
          Test: { matchesPlayed: 12, runs: 780, wickets: 0, average: 35.4, strikeRate: 52.8, highestScore: '145', bestBowling: '0/0' },
          ODI: { matchesPlayed: 22, runs: 820, wickets: 0, average: 39.0, strikeRate: 85.5, highestScore: '119', bestBowling: '0/0' },
          T20: { matchesPlayed: 30, runs: 740, wickets: 0, average: 26.4, strikeRate: 135.8, highestScore: '83', bestBowling: '0/0' }
        }
      },
      {
        id: 'hasaranga_sl',
        name: 'Wanindu Hasaranga',
        role: 'All-Rounder',
        average: 24.5,
        strikeRate: 148.2,
        economy: 7.15,
        form: [9, 8, 10, 7, 8],
        recentScores: ['31*', '0', '15', '2*', '42'],
        catchSuccessRate: 93.5,
        runOutAssists: 15,
        matchesPlayed: 68,
        careerRuns: 850,
        careerWickets: 112,
        highestScore: 71,
        bestBowling: '4/9',
        dotBallPercentage: 49.0,
        pitchWeakness: 'Off spinners drift outside-off',
        strongPointArea: 'Slog sweeps over deep midwicket',
        runsScoredSide: { offside: 20, legside: 55, straight: 25 },
        formats: {
          Test: { matchesPlayed: 2, runs: 80, wickets: 4, average: 20.0, strikeRate: 82.5, economy: 3.45, highestScore: '59', bestBowling: '2/30' },
          ODI: { matchesPlayed: 22, runs: 450, wickets: 32, average: 25.0, strikeRate: 110.4, economy: 4.95, highestScore: '80*', bestBowling: '5/24' },
          T20: { matchesPlayed: 30, runs: 420, wickets: 42, average: 18.2, strikeRate: 148.2, economy: 7.15, highestScore: '71', bestBowling: '4/9' }
        }
      },
      {
        id: 'theekshana_sl',
        name: 'Maheesh Theekshana',
        role: 'Bowler',
        average: 12.0,
        strikeRate: 110.0,
        economy: 6.95,
        form: [8, 7, 9, 8, 8],
        recentScores: ['0', '1*', '0', '0', '0'],
        catchSuccessRate: 85.0,
        runOutAssists: 2,
        matchesPlayed: 54,
        careerRuns: 80,
        careerWickets: 58,
        bestBowling: '4/20',
        dotBallPercentage: 51.5,
        pitchWeakness: 'Aggressive sweep play',
        strongPointArea: 'Mystery carrom ball',
        pitchingLength: 'Good length skidders & carrom loops',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 2, runs: 15, wickets: 5, average: 7.5, strikeRate: 9.0, economy: 2.85, highestScore: '10', bestBowling: '3/64' },
          ODI: { matchesPlayed: 22, runs: 45, wickets: 30, average: 5.6, strikeRate: 6.8, economy: 4.45, highestScore: '14*', bestBowling: '4/25' },
          T20: { matchesPlayed: 28, runs: 20, wickets: 32, average: 4.0, strikeRate: 5.2, economy: 6.95, highestScore: '8*', bestBowling: '4/20' }
        }
      }
    ]
  },
  {
    id: 'zim',
    name: 'Zimbabwe',
    shortName: 'ZIM',
    color: '#b91c1c',
    secondaryColor: '#fbbf24',
    logo: '🇿🇼',
    battingStrength: 82,
    bowlingStrength: 83,
    recentForm: ['L', 'L', 'W', 'L', 'W'],
    type: 'international',
    players: [
      {
        id: 'raza_zim',
        name: 'Sikandar Raza',
        role: 'All-Rounder',
        average: 38.5,
        strikeRate: 139.4,
        economy: 7.35,
        form: [9, 8, 9, 7, 8],
        recentScores: ['82', '14', '62*', '11', '45'],
        catchSuccessRate: 91.5,
        runOutAssists: 12,
        matchesPlayed: 85,
        careerRuns: 1950,
        careerWickets: 62,
        highestScore: 133,
        bestBowling: '4/15',
        dotBallPercentage: 45.1,
        pitchWeakness: 'Left-arm orthodox spin away from body',
        strongPointArea: 'Clean flat pull and down-the-ground loft',
        runsScoredSide: { offside: 30, legside: 40, straight: 30 },
        formats: {
          Test: { matchesPlayed: 2, runs: 120, wickets: 4, average: 30.0, strikeRate: 54.5, economy: 3.12, highestScore: '80', bestBowling: '3/60' },
          ODI: { matchesPlayed: 20, runs: 740, wickets: 24, average: 41.1, strikeRate: 89.2, economy: 4.85, highestScore: '115*', bestBowling: '4/35' },
          T20: { matchesPlayed: 30, runs: 890, wickets: 28, average: 34.2, strikeRate: 139.4, economy: 7.35, highestScore: '133', bestBowling: '4/15' }
        }
      },
      {
        id: 'ervine_zim',
        name: 'Craig Ervine',
        role: 'Batsman',
        average: 34.2,
        strikeRate: 122.5,
        form: [7, 8, 6, 7, 8],
        recentScores: ['31', '52', '12', '45', '8'],
        catchSuccessRate: 89.2,
        runOutAssists: 4,
        matchesPlayed: 92,
        careerRuns: 2100,
        careerWickets: 0,
        highestScore: 121,
        dotBallPercentage: 38.5,
        pitchWeakness: 'High pace incoming swingers',
        strongPointArea: 'Elegant sweeps and cover drives',
        runsScoredSide: { offside: 40, legside: 40, straight: 20 },
        formats: {
          Test: { matchesPlayed: 4, runs: 240, wickets: 0, average: 34.2, strikeRate: 45.2, highestScore: '104', bestBowling: '0/0' },
          ODI: { matchesPlayed: 20, runs: 680, wickets: 0, average: 37.7, strikeRate: 78.5, highestScore: '121', bestBowling: '0/0' },
          T20: { matchesPlayed: 22, runs: 410, wickets: 0, average: 21.5, strikeRate: 122.5, highestScore: '52', bestBowling: '0/0' }
        }
      },
      {
        id: 'burl_zim',
        name: 'Ryan Burl',
        role: 'All-Rounder',
        average: 26.8,
        strikeRate: 132.4,
        economy: 7.92,
        form: [8, 6, 8, 7, 7],
        recentScores: ['15*', '22', '34', '0', '19*'],
        catchSuccessRate: 88.0,
        runOutAssists: 5,
        matchesPlayed: 54,
        careerRuns: 850,
        careerWickets: 32,
        highestScore: 54,
        bestBowling: '3/14',
        dotBallPercentage: 41.2,
        pitchWeakness: 'Bouncers at extreme speed',
        strongPointArea: 'Brutal hitting through square leg',
        runsScoredSide: { offside: 25, legside: 50, straight: 25 },
        formats: {
          Test: { matchesPlayed: 2, runs: 85, wickets: 2, average: 21.2, strikeRate: 55.4, economy: 3.20, highestScore: '45', bestBowling: '1/15' },
          ODI: { matchesPlayed: 20, runs: 450, wickets: 14, average: 28.1, strikeRate: 92.4, economy: 5.12, highestScore: '54', bestBowling: '3/25' },
          T20: { matchesPlayed: 28, runs: 420, wickets: 18, average: 20.0, strikeRate: 132.4, economy: 7.92, highestScore: '42*', bestBowling: '3/14' }
        }
      },
      {
        id: 'muzarabani_zim',
        name: 'Blessing Muzarabani',
        role: 'Bowler',
        average: 11.2,
        strikeRate: 98.0,
        economy: 7.82,
        form: [8, 9, 7, 8, 9],
        recentScores: ['0', '2*', '0', '0', '0'],
        catchSuccessRate: 84.1,
        runOutAssists: 2,
        matchesPlayed: 45,
        careerRuns: 45,
        careerWickets: 51,
        bestBowling: '4/18',
        dotBallPercentage: 49.5,
        pitchWeakness: 'Batsmen sweeping down fine-leg',
        strongPointArea: 'Elite steep bounce and lift',
        pitchingLength: 'Steep bouncers & good lengths',
        runsScoredSide: { offside: 30, legside: 30, straight: 40 },
        formats: {
          Test: { matchesPlayed: 6, runs: 34, wickets: 18, average: 8.5, strikeRate: 10.2, economy: 3.02, highestScore: '12*', bestBowling: '4/18' },
          ODI: { matchesPlayed: 20, runs: 22, wickets: 25, average: 5.5, strikeRate: 6.5, economy: 5.15, highestScore: '8*', bestBowling: '4/25' },
          T20: { matchesPlayed: 24, runs: 12, wickets: 22, average: 3.0, strikeRate: 4.8, economy: 7.82, highestScore: '4*', bestBowling: '3/21' }
        }
      }
    ]
  }
];

export const headToHeadRecords = [
  // Domestic H2H
  { team1: 'csk', team2: 'rcb', matches: 33, wins1: 21, wins2: 11, nr: 1 },
  { team1: 'mi', team2: 'csk', matches: 37, wins1: 20, wins2: 17, nr: 0 },
  { team1: 'kkr', team2: 'rcb', matches: 34, wins1: 19, wins2: 15, nr: 0 },
  { team1: 'srh', team2: 'rcb', matches: 25, wins1: 13, wins2: 11, nr: 1 },
  { team1: 'rr', team2: 'rcb', matches: 31, wins1: 13, wins2: 15, nr: 3 },
  { team1: 'mi', team2: 'kkr', matches: 33, wins1: 23, wins2: 10, nr: 0 },
  { team1: 'rr', team2: 'csk', matches: 29, wins1: 13, wins2: 16, nr: 0 },
  { team1: 'srh', team2: 'csk', matches: 21, wins1: 6, wins2: 15, nr: 0 },
  { team1: 'srh', team2: 'mi', matches: 23, wins1: 10, wins2: 13, nr: 0 },
  { team1: 'srh', team2: 'kkr', matches: 27, wins1: 9, wins2: 18, nr: 0 },
  // International H2H
  { team1: 'ind', team2: 'aus', matches: 152, wins1: 58, wins2: 85, nr: 9 },
  { team1: 'ind', team2: 'eng', matches: 110, wins1: 57, wins2: 44, nr: 9 },
  { team1: 'ind', team2: 'sa', matches: 92, wins1: 39, wins2: 51, nr: 2 },
  { team1: 'ind', team2: 'nz', matches: 118, wins1: 60, wins2: 51, nr: 7 },
  { team1: 'aus', team2: 'eng', matches: 158, wins1: 89, wins2: 63, nr: 6 },
  { team1: 'aus', team2: 'sa', matches: 108, wins1: 50, wins2: 54, nr: 4 },
  { team1: 'aus', team2: 'nz', matches: 142, wins1: 97, wins2: 40, nr: 5 },
  { team1: 'eng', team2: 'sa', matches: 70, wins1: 32, wins2: 34, nr: 4 },
  { team1: 'eng', team2: 'nz', matches: 95, wins1: 44, wins2: 45, nr: 6 },
  { team1: 'sa', team2: 'nz', matches: 84, wins1: 42, wins2: 30, nr: 12 }
];

export const historicalMatches: HistoricalMatch[] = [
  // Domestic Matches
  { id: 'm1', date: '2025-05-26', season: '2025', teamAId: 'kkr', teamBId: 'srh', teamAScore: '187/5', teamBScore: '183/8', winnerId: 'kkr', margin: '4 runs', venueId: 'ahmedabad', playerOfMatch: 'Sunil Narine', stage: 'Final' },
  { id: 'm2', date: '2025-05-24', season: '2025', teamAId: 'rr', teamBId: 'srh', teamAScore: '165/9', teamBScore: '166/3', winnerId: 'srh', margin: '7 wickets', venueId: 'chepauk', playerOfMatch: 'Travis Head', stage: 'Playoffs' },
  { id: 'm3', date: '2025-05-21', season: '2025', teamAId: 'kkr', teamBId: 'rr', teamAScore: '201/4', teamBScore: '172/10', winnerId: 'kkr', margin: '29 runs', venueId: 'ahmedabad', playerOfMatch: 'Mitchell Starc', stage: 'Playoffs' },
  { id: 'm4', date: '2025-05-18', season: '2025', teamAId: 'rcb', teamBId: 'csk', teamAScore: '218/5', teamBScore: '191/7', winnerId: 'rcb', margin: '27 runs', venueId: 'chinnaswamy', playerOfMatch: 'Virat Kohli', stage: 'League' },
  { id: 'm5', date: '2025-05-12', season: '2025', teamAId: 'mi', teamBId: 'kkr', teamAScore: '157/10', teamBScore: '162/6', winnerId: 'kkr', margin: '5 wickets', venueId: 'wankhede', playerOfMatch: 'Varun Chakaravarthy', stage: 'League' },
  // International Matches
  { id: 'mi1', date: '2023-11-19', season: 'World Cup 2023', teamAId: 'ind', teamBId: 'aus', teamAScore: '240/10', teamBScore: '241/4', winnerId: 'aus', margin: '6 wickets', venueId: 'ahmedabad', playerOfMatch: 'Travis Head', stage: 'Final' },
  { id: 'mi2', date: '2024-06-29', season: 'T20 World Cup 2024', teamAId: 'ind', teamBId: 'sa', teamAScore: '176/7', teamBScore: '169/8', winnerId: 'ind', margin: '7 runs', venueId: 'kensington', playerOfMatch: 'Virat Kohli', stage: 'Final' },
  { id: 'mi3', date: '2023-06-11', season: 'WTC 2023', teamAId: 'ind', teamBId: 'aus', teamAScore: '296/10 & 234/10', teamBScore: '469/10 & 270/8d', winnerId: 'aus', margin: '209 runs', venueId: 'lords', playerOfMatch: 'Travis Head', stage: 'Final' },
  { id: 'mi4', date: '2019-07-14', season: 'World Cup 2019', teamAId: 'nz', teamBId: 'eng', teamAScore: '241/8', teamBScore: '241/10', winnerId: 'eng', margin: '0 runs (Boundary Count)', venueId: 'lords', playerOfMatch: 'Ben Stokes', stage: 'Final' },
  { id: 'mi5', date: '2023-11-15', season: 'World Cup 2023', teamAId: 'ind', teamBId: 'nz', teamAScore: '397/4', teamBScore: '327/10', winnerId: 'ind', margin: '70 runs', venueId: 'wankhede', playerOfMatch: 'Mohammed Shami', stage: 'Playoffs' }
];
