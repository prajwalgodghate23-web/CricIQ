/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Team, Venue, MatchScenario, PredictionResult, LiveMatchState, BallEvent, HistoricalMatch } from './src/types';
import { teams, venues, headToHeadRecords, historicalMatches } from './src/data/cricketData';

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini Client Lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. SEEDED DATABASE (Teams, Venues, Historical Stats) - Imported from /src/data/cricketData.ts

// Static response for predictions if Gemini API fails or is not configured
function getStaticPrediction(teamA: Team, teamB: Team, venue: Venue, scenario: MatchScenario): PredictionResult {
  const scoreA = teamA.battingStrength * 0.6 + teamA.bowlingStrength * 0.4;
  const scoreB = teamB.battingStrength * 0.6 + teamB.bowlingStrength * 0.4;

  let factorA = 0;
  let factorB = 0;

  // 1. Leverage Historical Match Context
  const h2hMatches = historicalMatches.filter(
    m => (m.teamAId === teamA.id && m.teamBId === teamB.id) || (m.teamAId === teamB.id && m.teamBId === teamA.id)
  );
  if (h2hMatches.length > 0) {
    const winsA = h2hMatches.filter(m => m.winnerId === teamA.id).length;
    const ratioA = winsA / h2hMatches.length;
    factorA += ratioA * 6; // up to 6% boost based on H2H history
    factorB += (1 - ratioA) * 6;
  }

  // 2. Leverage Individual Advanced Player Metrics (Fielding & Specialty)
  const avgCatchRateA = teamA.players.reduce((acc, p) => acc + (p.catchSuccessRate || 85), 0) / teamA.players.length;
  const avgCatchRateB = teamB.players.reduce((acc, p) => acc + (p.catchSuccessRate || 85), 0) / teamB.players.length;
  factorA += (avgCatchRateA - 85) * 0.15; // Reward high catch rates
  factorB += (avgCatchRateB - 85) * 0.15;

  const totalAssistsA = teamA.players.reduce((acc, p) => acc + (p.runOutAssists || 5), 0);
  const totalAssistsB = teamB.players.reduce((acc, p) => acc + (p.runOutAssists || 5), 0);
  factorA += totalAssistsA * 0.1;
  factorB += totalAssistsB * 0.1;

  // Venue bias
  if (venue.pitchType === 'Spinner Friendly') {
    // CSK and KKR have excellent spinners (Narine, Jadeja, Chahal etc)
    if (teamA.id === 'csk' || teamA.id === 'kkr') factorA += 5;
    if (teamB.id === 'csk' || teamB.id === 'kkr') factorB += 5;
  } else if (venue.pitchType === 'Batting Friendly') {
    // SRH, RCB, MI are highly aggressive batting units
    if (teamA.id === 'srh' || teamA.id === 'rcb' || teamA.id === 'mi') factorA += 6;
    if (teamB.id === 'srh' || teamB.id === 'rcb' || teamB.id === 'mi') factorB += 6;
  }

  // Pitch scenario bias
  if (scenario.pitchType === 'Spinner Friendly') {
    const spinnersA = teamA.players.filter(p => p.name.includes('Jadeja') || p.name.includes('Narine') || p.name.includes('Chahal') || p.name.includes('Ashwin'));
    if (spinnersA.length > 0) factorA += 4;
    const spinnersB = teamB.players.filter(p => p.name.includes('Jadeja') || p.name.includes('Narine') || p.name.includes('Chahal') || p.name.includes('Ashwin'));
    if (spinnersB.length > 0) factorB += 4;
  }

  // Weather dew factor (favors team batting second, but here we just add general humidity adjustments)
  if (scenario.weather === 'Humid & Dew') {
    factorA += 2; // general adjustments
  }

  const finalScoreA = scoreA + factorA;
  const finalScoreB = scoreB + factorB;
  const total = finalScoreA + finalScoreB;

  const probA = Math.round((finalScoreA / total) * 100);
  const probB = 100 - probA;

  const batsmenA = teamA.players.filter(p => p.role === 'Batsman' || p.role === 'Wicketkeeper');
  const batsmenB = teamB.players.filter(p => p.role === 'Batsman' || p.role === 'Wicketkeeper');
  const bowlerA = teamA.players.filter(p => p.role === 'Bowler' || p.role === 'All-Rounder');
  const bowlerB = teamB.players.filter(p => p.role === 'Bowler' || p.role === 'All-Rounder');

  const topScorer = batsmenA[0] || { name: 'Player A', strikeRate: 140 };
  const topBowler = bowlerB[0] || { name: 'Player B', economy: 7.5 };

  return {
    matchup: {
      teamA: teamA.name,
      teamB: teamB.name,
      venue: venue.name,
    },
    winProbability: {
      teamA: probA,
      teamB: probB,
    },
    keyFactors: [
      `Overall team rating bias favors ${probA > probB ? teamA.shortName : teamB.shortName} based on historical balance.`,
      `Pitch condition (${scenario.pitchType}) matches the ${venue.pitchType} characteristics of ${venue.name}.`,
      `${scenario.weather} conditions will impact bowl grip and swing assistance.`,
    ],
    keyMatchupAnalysis: `The main faceoff will be between ${teamA.shortName}'s opening batsmanship vs ${teamB.shortName}'s death bowlers (particularly ${teamB.players.find(p => p.id === 'jasprit_bumrah' || p.id === 'matheesha_pathirana')?.name || 'key bowlers'}). ${venue.name} has small boundaries which highly favors spin containment if bowlers hit hard lengths.`,
    predictedTopScorer: {
      playerName: topScorer.name,
      predictedRuns: Math.floor(Math.random() * 25) + 45,
      reason: `Boasts a superb tournament strike rate of ${topScorer.strikeRate} and favors high-scoring conditions.`,
    },
    predictedTopWicketeer: {
      playerName: topBowler.name,
      predictedWickets: Math.floor(Math.random() * 2) + 2,
      reason: `Consistently exploits early swing and death-overs variations with a low economy.`,
    },
    tacticalInsights: [
      `Powerplay targeting: The team batting first must exploit early fielding restrictions since dew will make chase easier later on.`,
      `Spin choke: Deploy spinner matchups in the middle overs (9-15) to curb run rate inflation.`,
      `Death overs acceleration: Save at least 3 overs of primary pace bowlers for the final overs.`,
    ],
    predictionReason: `Mathematical projection indicates a ${probA}% win chance for ${teamA.shortName}, driven by historical match-ups and custom ${scenario.pitchType} characteristics at ${venue.name}. ${teamA.shortName} possesses a ${teamA.battingStrength}/100 batting strength which matches perfectly against ${teamB.shortName}'s bowling configuration under ${scenario.weather} conditions.`,
    playSuggestions: {
      teamA: `Focus on establishing a deep batting anchor in the middle-overs and target the shorter boundary dimensions of ${venue.name} early on. Bowlers must stick to standard hard-length cutters to prevent free straight hits.`,
      teamB: `Leverage extreme pace options to trigger early wickets in the powerplay. If chasing under dew conditions, hold wickets back until the 14th over to trigger a high-momentum final assault.`
    }
  };
}

// Static fallback generator for Spoda Search Queries
function getStaticSpodaResponse(prompt: string) {
  const p = prompt.toLowerCase();
  
  if (p.includes('virat') || p.includes('dhoni') || p.includes('comparison') || p.includes('compare') || p.includes('rohit')) {
    return {
      queryType: "matchup_comparison",
      title: "Advanced Matchup Analysis: Virat Kohli vs MS Dhoni",
      primarySummary: "A statistical comparison between two IPL legends. Virat Kohli serves as a prolific top-order anchor, maximizing powerplay boundaries and controlling run chases, while MS Dhoni is the ultimate lower-order finisher, known for his high-pressure strike rate and tactical captaincy behind the wickets.",
      visualMetrics: [
        { label: "IPL Matches", valueA: "252", valueB: "264", teamAName: "Virat Kohli (RCB)", teamBName: "MS Dhoni (CSK)" },
        { label: "Win Percentage", valueA: "48.2%", valueB: "58.4%", teamAName: "Virat Kohli (RCB)", teamBName: "MS Dhoni (CSK)" }
      ],
      statsTable: [
        { metric: "Batting Average", playerA: "38.7", playerB: "39.1", nameA: "Virat Kohli", nameB: "MS Dhoni" },
        { metric: "Strike Rate", playerA: "130.4", playerB: "137.5", nameA: "Virat Kohli", nameB: "MS Dhoni" },
        { metric: "Highest Score", playerA: "113*", playerB: "84*", nameA: "Virat Kohli", nameB: "MS Dhoni" },
        { metric: "Career Runs", playerA: "8004", playerB: "5243", nameA: "Virat Kohli", nameB: "MS Dhoni" }
      ],
      chartData: [
        { name: "Powerplay SR", value: 124 },
        { name: "Middle Overs SR", value: 132 },
        { name: "Death Overs SR", value: 188 }
      ],
      tacticalInsights: [
        "Kohli is highly vulnerable against left-arm orthodox spinners in the 8-12 overs bracket.",
        "Dhoni's strike rate increases by 44% when facing express pace (>140km/h) in the final two overs.",
        "Deploying heavy wide-line yorkers is the most effective containment strategy against Dhoni's deep-stance pulls."
      ]
    };
  } else if (p.includes('stadium') || p.includes('chinnaswamy') || p.includes('wankhede') || p.includes('chepauk') || p.includes('pitch') || p.includes('starc') || p.includes('bumrah')) {
    return {
      queryType: "stadium_analysis",
      title: "Stadium Intelligence: M. Chinnaswamy Stadium (Bengaluru)",
      primarySummary: "Chinnaswamy is notoriously a batsmen's paradise. Featuring short boundaries (average 58-65m) and a fast-outfield turf, any score under 200 is highly vulnerable to chasing squads. Spinners experience a heavy toll, with average economies climbing to 8.92.",
      visualMetrics: [
        { label: "Avg 1st Innings Score", valueA: "188", valueB: "168", teamAName: "Chinnaswamy", teamBName: "IPL Avg" },
        { label: "Dew Impact Factor", valueA: "High", valueB: "Moderate", teamAName: "Chinnaswamy", teamBName: "IPL Avg" }
      ],
      statsTable: [
        { metric: "Avg Sixes Per Match", playerA: "14.2", playerB: "8.5", nameA: "Chinnaswamy", nameB: "IPL Avg" },
        { metric: "Spin Bowler Economy", playerA: "8.92", playerB: "7.64", nameA: "Chinnaswamy", nameB: "IPL Avg" },
        { metric: "Pace Bowler Economy", playerA: "9.14", playerB: "8.21", nameA: "Chinnaswamy", nameB: "IPL Avg" }
      ],
      chartData: [
        { name: "Matches Won Batting 1st", value: 42 },
        { name: "Matches Won Chasing", value: 58 }
      ],
      tacticalInsights: [
        "Winning the toss demands choosing to bowl second to exploit the high dew factor starting at 8:30 PM.",
        "Spinner containment relies heavily on bowling wider lines to drag batsmen away from short square boundaries.",
        "Pace bowlers should leverage hard cutter variations to prevent simple straight-ground lofts."
      ]
    };
  } else if (p.includes('simulate') || p.includes('simulation') || p.includes('final') || p.includes('play') || p.includes('chase') || p.includes('over')) {
    return {
      queryType: "game_simulation",
      title: "Play Simulation: RCB vs CSK High-Stakes Chase",
      primarySummary: "An algorithmic simulation of Royal Challengers Bengaluru chasing 18 runs in the final over bowled by Matheesha Pathirana (CSK) with Dinesh Karthik on strike.",
      visualMetrics: [
        { label: "RCB Win Chance", valueA: "41.5%", valueB: "58.5%", teamAName: "RCB Chasing", teamBName: "CSK Defending" }
      ],
      statsTable: [
        { metric: "Ball 1", playerA: "Wide (1 run)", playerB: "Pathirana", nameA: "Dinesh Karthik", nameB: "Pathirana" },
        { metric: "Ball 1 (Re-bowl)", playerA: "Dot (Yorker length)", playerB: "Pathirana", nameA: "Dinesh Karthik", nameB: "Pathirana" },
        { metric: "Ball 2", playerA: "FOUR (Thick outside edge)", playerB: "Pathirana", nameA: "Dinesh Karthik", nameB: "Pathirana" },
        { metric: "Ball 3", playerA: "SIX (Spectacular flick over fine leg)", playerB: "Pathirana", nameA: "Dinesh Karthik", nameB: "Pathirana" },
        { metric: "Ball 4", playerA: "1 Run (Direct tap to cover)", playerB: "Pathirana", nameA: "Dinesh Karthik", nameB: "Pathirana" },
        { metric: "Ball 5", playerA: "WICKET (Bowled - yorker crushes stumps)", playerB: "Pathirana", nameA: "RCB Batsman", nameB: "Pathirana" },
        { metric: "Ball 6", playerA: "Dot Ball (Pathirana seals victory)", playerB: "Pathirana", nameA: "RCB Tailender", nameB: "Pathirana" }
      ],
      chartData: [
        { name: "Ball 1-3 RCB Edge", value: 65 },
        { name: "Ball 4-6 CSK Edge", value: 85 }
      ],
      tacticalInsights: [
        "Pathirana's low-slung release creates extreme blindspots for lower-order batsmen when angling inward.",
        "Chasing teams must sit deep inside the crease to gain crucial milliseconds against yorker lengths.",
        "CSK's win probability surged by 38% after the critical Ball 5 wicket."
      ],
      simulatedOutcome: "CSK wins a nail-biting simulation by 6 runs! Pathirana successfully defended 18 runs under immense pressure."
    };
  } else {
    return {
      queryType: "general_stats",
      title: `General Sports Analytics: "${prompt}"`,
      primarySummary: `Parsed query for custom intelligence: "${prompt}". Re-evaluating player stats, pitch parameters, and historical metrics to generate responsive dashboards.`,
      visualMetrics: [
        { label: "Model Confidence", valueA: "92%", valueB: "8%", teamAName: "Slick Data", teamBName: "Uncertainty" }
      ],
      statsTable: [
        { metric: "Form Index", playerA: "Excellent", playerB: "Good", nameA: "Batting", nameB: "Bowling" },
        { metric: "Historical Matchups", playerA: "CSK (54%)", playerB: "RCB (46%)", nameA: "CSK", nameB: "RCB" }
      ],
      chartData: [
        { name: "Powerplay Index", value: 78 },
        { name: "Middle Overs Index", value: 82 },
        { name: "Death Overs Index", value: 91 }
      ],
      tacticalInsights: [
        "Review detailed Player Profiles and Metrics panels to drill down into specific micro-statistics.",
        "Adjust dew factors and surface overlays in the Scenario Simulator to observe shifts in win probabilities."
      ]
    };
  }
}

// 2. HTTP ROUTES
app.get('/api/metadata', (req, res) => {
  res.json({
    teams,
    venues,
    headToHeadRecords,
    historicalMatches,
  });
});

// Spoda Conversational Analytics search endpoint
app.post('/api/spoda-query', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      console.log('Gemini API key not configured for Spoda search. Using high-fidelity deterministic static fallback.');
      const fallbackResult = getStaticSpodaResponse(prompt);
      return res.json({ ...fallbackResult, isAiGenerated: false });
    }

    const cleanTeams = teams.map(t => ({
      id: t.id,
      name: t.name,
      short: t.shortName,
      battingStrength: t.battingStrength,
      bowlingStrength: t.bowlingStrength,
      form: t.recentForm,
      players: t.players.map(p => ({
        name: p.name,
        role: p.role,
        average: p.average,
        strikeRate: p.strikeRate,
        economy: p.economy || null,
        recentScores: p.recentScores,
        matchesPlayed: p.matchesPlayed || 50,
        careerRuns: p.careerRuns || 0,
        careerWickets: p.careerWickets || 0
      }))
    }));

    const geminiPrompt = `
      You are Spoda AI Cricket, an elite, hyper-focused conversational sports analytics engine built for professional franchises, scouts, and fans.
      Analyze the user's natural language query and synthesize a highly structured response utilizing our local database:
      - Teams & Players Database: ${JSON.stringify(cleanTeams)}
      - Stadium Venues: ${JSON.stringify(venues)}
      - Query: "${prompt}"

      Classify the query into one of these query types:
      - "matchup_comparison": For comparing players, squads, or specific match facets.
      - "stadium_analysis": For analysing venue properties, pitches, boundaries, or historical average patterns.
      - "game_simulation": For simulating over-by-over plays, run chases, or dynamic game situations.
      - "general_stats": For generic squad standings or metric records.

      Format the response strictly as a JSON object containing EXACTLY these keys:
      1. "queryType" - string (must be one of: "matchup_comparison", "stadium_analysis", "game_simulation", "general_stats").
      2. "title" - string, descriptive and premium.
      3. "primarySummary" - string, 2-3 sentences of conversational, deep analytical synthesis answering the user's question.
      4. "visualMetrics" - array of objects (can be empty if not applicable), each with keys: "label", "valueA", "valueB", "teamAName", "teamBName". Used to compare metrics.
      5. "statsTable" - array of objects (can be empty if not applicable), each with keys: "metric", "playerA" (value), "playerB" (value), "nameA" (name/label), "nameB" (name/label).
      6. "chartData" - array of objects, each with keys "name" (label) and "value" (numeric value) suitable for graphing.
      7. "tacticalInsights" - array of 3 highly actionable, stats-driven tactical bullets.
      8. "simulatedOutcome" - string (optional, specify only if queryType is "game_simulation").

      Ensure the JSON is strictly structured. Do not wrap in markdown quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: geminiPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            queryType: { type: Type.STRING },
            title: { type: Type.STRING },
            primarySummary: { type: Type.STRING },
            visualMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  valueA: { type: Type.STRING },
                  valueB: { type: Type.STRING },
                  teamAName: { type: Type.STRING },
                  teamBName: { type: Type.STRING }
                },
                required: ['label', 'valueA', 'valueB']
              }
            },
            statsTable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  playerA: { type: Type.STRING },
                  playerB: { type: Type.STRING },
                  nameA: { type: Type.STRING },
                  nameB: { type: Type.STRING }
                },
                required: ['metric', 'playerA', 'playerB']
              }
            },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ['name', 'value']
              }
            },
            tacticalInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            simulatedOutcome: { type: Type.STRING }
          },
          required: [
            'queryType',
            'title',
            'primarySummary',
            'visualMetrics',
            'statsTable',
            'chartData',
            'tacticalInsights'
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json({
      ...parsedData,
      isAiGenerated: true
    });
  } catch (error: any) {
    console.error('Spoda AI search query error:', error);
    const fallbackResult = getStaticSpodaResponse(req.body.prompt || '');
    return res.json({ ...fallbackResult, isAiGenerated: false, error: error.message });
  }
});

// AI Prediction route using Google GenAI SDK (Server-Side)
app.post('/api/predict', async (req, res) => {
  try {
    const { teamAId, teamBId, venueId, pitchType, weather, customFactor } = req.body;

    const teamA = teams.find(t => t.id === teamAId);
    const teamB = teams.find(t => t.id === teamBId);
    const venue = venues.find(v => v.id === venueId);

    if (!teamA || !teamB || !venue) {
      return res.status(400).json({ error: 'Invalid team or venue selected.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback if no API key is set
      console.log('Gemini API key not configured. Using high-fidelity deterministic prediction fallback.');
      const fallbackResult = getStaticPrediction(teamA, teamB, venue, { teamAId, teamBId, venueId, pitchType, weather, customFactor });
      return res.json({ ...fallbackResult, isAiGenerated: false });
    }

    const prompt = `
      You are an expert IPL and Cricket Analytics Engine powered by statistical data and team histories.
      Analyze this match scenario and predict the match outcomes using historical matchups and advanced player metrics:
      - Team A: ${teamA.name} (${teamA.shortName})
        * Batting Strength: ${teamA.battingStrength}/100
        * Bowling Strength: ${teamA.bowlingStrength}/100
        * Form: ${teamA.recentForm.join(', ')}
        * Top Players: ${teamA.players.map(p => `${p.name} (${p.role}, Avg: ${p.average}, SR: ${p.strikeRate}, Matches: ${p.matchesPlayed || 50}, Career Runs: ${p.careerRuns || 0}, Career Wickets: ${p.careerWickets || 0}, Catch Success: ${p.catchSuccessRate || 85}%, Runout Assists: ${p.runOutAssists || 0})`).join('; ')}
      - Team B: ${teamB.name} (${teamB.shortName})
        * Batting Strength: ${teamB.battingStrength}/100
        * Bowling Strength: ${teamB.bowlingStrength}/100
        * Form: ${teamB.recentForm.join(', ')}
        * Top Players: ${teamB.players.map(p => `${p.name} (${p.role}, Avg: ${p.average}, SR: ${p.strikeRate}, Matches: ${p.matchesPlayed || 50}, Career Runs: ${p.careerRuns || 0}, Career Wickets: ${p.careerWickets || 0}, Catch Success: ${p.catchSuccessRate || 85}%, Runout Assists: ${p.runOutAssists || 0})`).join('; ')}
      - Venue: ${venue.name} in ${venue.city} (Avg First Innings: ${venue.avgFirstInningsScore}, Natural Pitch: ${venue.pitchType}, Boundary: ${venue.boundarySize})
      - Selected Pitch Overlay: ${pitchType}
      - Weather: ${weather}
      - Custom Factor: ${customFactor || 'None'}
      - Historical Match Context (Head-to-Head and Season history between these squads):
        ${JSON.stringify(historicalMatches.filter(m => (m.teamAId === teamA.id && m.teamBId === teamB.id) || (m.teamAId === teamB.id && m.teamBId === teamA.id)))}

      Generate a detailed prediction JSON response containing exactly the following keys:
      1. "winProbability" with "teamA" and "teamB" percentages (must sum to 100).
      2. "keyFactors" - string array of 3 critical statistical drivers for the match.
      3. "keyMatchupAnalysis" - detailed string explaining player head-to-head or battle.
      4. "predictedTopScorer" with keys "playerName" (must be an actual player from Team A or Team B), "predictedRuns" (integer), and "reason" (string).
      5. "predictedTopWicketeer" with keys "playerName" (must be an actual bowler/allrounder from Team A or Team B), "predictedWickets" (integer), and "reason" (string).
      6. "tacticalInsights" - array of 3 actionable strategies each team must utilize based on statistics and conditions.
      7. "predictionReason" - a detailed paragraph giving the exact reason for the prediction, backing it up with statistics and conditions.
      8. "playSuggestions" - object with "teamA" and "teamB" explaining how each team should play to maximize win chances.

      Ensure the JSON is strictly structured, do not wrap in markdown quotes in your text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winProbability: {
              type: Type.OBJECT,
              properties: {
                teamA: { type: Type.INTEGER },
                teamB: { type: Type.INTEGER },
              },
              required: ['teamA', 'teamB'],
            },
            keyFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyMatchupAnalysis: { type: Type.STRING },
            predictedTopScorer: {
              type: Type.OBJECT,
              properties: {
                playerName: { type: Type.STRING },
                predictedRuns: { type: Type.INTEGER },
                reason: { type: Type.STRING },
              },
              required: ['playerName', 'predictedRuns', 'reason'],
            },
            predictedTopWicketeer: {
              type: Type.OBJECT,
              properties: {
                playerName: { type: Type.STRING },
                predictedWickets: { type: Type.INTEGER },
                reason: { type: Type.STRING },
              },
              required: ['playerName', 'predictedWickets', 'reason'],
            },
            tacticalInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            predictionReason: { type: Type.STRING },
            playSuggestions: {
              type: Type.OBJECT,
              properties: {
                teamA: { type: Type.STRING },
                teamB: { type: Type.STRING },
              },
              required: ['teamA', 'teamB'],
            },
          },
          required: [
            'winProbability',
            'keyFactors',
            'keyMatchupAnalysis',
            'predictedTopScorer',
            'predictedTopWicketeer',
            'tacticalInsights',
            'predictionReason',
            'playSuggestions',
          ],
        },
      },
    });

    const predictionData = JSON.parse(response.text.trim());
    return res.json({
      ...predictionData,
      matchup: {
        teamA: teamA.name,
        teamB: teamB.name,
        venue: venue.name,
      },
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.error('Gemini AI prediction error:', error);
    // In case of an unexpected error, return a high-quality static prediction instead of crashing
    const { teamAId, teamBId, venueId, pitchType, weather, customFactor } = req.body;
    const teamA = teams.find(t => t.id === teamAId) || teams[0];
    const teamB = teams.find(t => t.id === teamBId) || teams[1];
    const venue = venues.find(v => v.id === venueId) || venues[0];
    const fallbackResult = getStaticPrediction(teamA, teamB, venue, { teamAId, teamBId, venueId, pitchType, weather, customFactor });
    return res.json({ ...fallbackResult, isAiGenerated: false, error: error.message });
  }
});

// 3. LIVE MATCH SIMULATION ENGINE
// Simulates the next ball event based on current match status.
app.post('/api/simulate-next-ball', (req, res) => {
  const currentState: LiveMatchState = req.body;

  if (currentState.isCompleted) {
    return res.json(currentState);
  }

  const { teamA, teamB, venue, currentInnings, overs, balls, runs, wickets, target } = currentState;

  // Identify who is batting and bowling
  const battingTeam = currentInnings === 1 ? teamA : teamB;
  const bowlingTeam = currentInnings === 1 ? teamB : teamA;

  // Core Simulation Variables
  let newOvers = overs;
  let newBalls = balls + 1;
  if (newBalls >= 6) {
    newOvers += 1;
    newBalls = 0;
  }

  // Calculate random event based on strengths and a small random range
  // Events: dot, 1 run, 2 runs, 3 runs, 4 runs, 6 runs, wicket, extra
  const rand = Math.random();
  let eventRuns = 0;
  let isWicket = false;
  let wicketType = undefined;
  let isBoundary = false;
  let isExtra = false;
  let extraType = undefined;
  let commentary = '';

  const batsmanName = currentState.batsman1.name;
  const bowlerName = currentState.currentBowler.name;

  // Let's bias the simulation based on batting/bowling strength & pitch
  const battingBias = battingTeam.battingStrength / 100; // e.g. 0.92
  const bowlingBias = bowlingTeam.bowlingStrength / 100; // e.g. 0.82
  const ratio = battingBias / (battingBias + bowlingBias); // around 0.52 for heavy batting, 0.48 for bowling

  // Pitch modifier for boundaries
  let boundaryMultiplier = 1.0;
  if (venue.pitchType === 'Batting Friendly') boundaryMultiplier = 1.25;
  if (venue.pitchType === 'Spinner Friendly') boundaryMultiplier = 0.85;

  if (rand < 0.05) {
    // Extra (wide, noball, bye)
    isExtra = true;
    eventRuns = 1;
    extraType = Math.random() > 0.6 ? 'Noball' : 'Wide';
    commentary = extraType === 'Wide' 
      ? `Wide ball! ${bowlerName} strays down the leg side. One run added.`
      : `No ball! ${bowlerName} oversteps. Free hit awarded!`;
    // If extra, the ball doesn't count in the over (re-bowl)
    // Decrement ball count to keep it realistic
    newBalls = balls; // keep it unchanged
  } else if (rand < 0.13) {
    // Wicket!
    isWicket = true;
    const wicketTypes = ['Caught', 'Bowled', 'LBW', 'Run Out', 'Stumped'];
    wicketType = wicketTypes[Math.floor(Math.random() * wicketTypes.length)];
    commentary = wicketType === 'Bowled'
      ? `OUT! Clean bowled! ${bowlerName} fires a perfect yorker. ${batsmanName} is gone!`
      : wicketType === 'LBW'
      ? `OUT! Plumb in front! ${bowlerName} appeals, umpire's finger goes up! ${batsmanName} dismissed.`
      : wicketType === 'Caught'
      ? `OUT! Taken! ${batsmanName} lofts it high in the air, caught safely at deep midwicket by fielders.`
      : `OUT! ${batsmanName} goes for a quick single but is caught short by a brilliant direct hit!`;
  } else if (rand < 0.45) {
    // Dot ball or small run
    const smallRand = Math.random();
    if (smallRand < 0.4) {
      eventRuns = 0;
      commentary = `No run. ${batsmanName} defends solid to mid-off.`;
    } else if (smallRand < 0.85) {
      eventRuns = 1;
      commentary = `${batsmanName} taps it to deep cover for a single.`;
    } else {
      eventRuns = 2;
      commentary = `Excellent running! ${batsmanName} punches it to deep square leg and pushes hard for two.`;
    }
  } else if (rand < 0.52) {
    eventRuns = 3;
    commentary = `Sublime timing! Driven past extra cover, the outfield is large so they complete three runs.`;
  } else {
    // Boundary!
    isBoundary = true;
    const boundaryRand = Math.random() * boundaryMultiplier;
    if (boundaryRand < 0.6) {
      eventRuns = 4;
      const boundaryShot = ['glorious cover drive', 'powerful pull shot', 'crisp square cut', 'delicate sweep shot'];
      commentary = `FOUR! That's a ${boundaryShot[Math.floor(Math.random() * boundaryShot.length)]} from ${batsmanName}, racing away to the boundary fence.`;
    } else {
      eventRuns = 6;
      const sixShot = ['massive pull over deep midwicket', 'lofted straight drive over bowler\'s head', 'spectacular switch hit over backward point'];
      commentary = `SIX! Out of the stadium! ${batsmanName} launches this ${sixShot[Math.floor(Math.random() * sixShot.length)]} with unbelievable timing.`;
    }
  }

  // Update scores
  let newRuns = runs + eventRuns;
  let newWickets = wickets + (isWicket ? 1 : 0);
  let inningsCompleted = false;

  // Batsman score updates
  let b1Runs = currentState.batsman1.runs;
  let b1Balls = currentState.batsman1.balls;
  let b2Runs = currentState.batsman2.runs;
  let b2Balls = currentState.batsman2.balls;

  // Bowler score updates
  let bowlerOvers = currentState.currentBowler.overs;
  let bowlerRuns = currentState.currentBowler.runs + eventRuns;
  let bowlerWickets = currentState.currentBowler.wickets + (isWicket ? 1 : 0);

  // Balls update for active batsman
  b1Balls += isExtra && extraType === 'Wide' ? 0 : 1;
  b1Runs += eventRuns;

  if (isWicket && newWickets < 10) {
    // Get next batsman from batting squad who hasn't batted yet
    const currentBattersNames = [currentState.batsman1.name, currentState.batsman2.name];
    const availableSquad = battingTeam.players.filter(p => !currentBattersNames.includes(p.name));
    const nextBatsmanName = availableSquad[newWickets + 1]?.name || 'Tailender';

    // Replace the dismissed batsman
    b1Runs = 0;
    b1Balls = 0;
    currentState.batsman1.name = nextBatsmanName;
    commentary += ` Incoming batsman is ${nextBatsmanName}.`;
  }

  // Over completion bowler updates
  if (newBalls === 0 && newOvers > 0) {
    bowlerOvers += 1;
    // Rotate batsman strike
    const tempBName = currentState.batsman1.name;
    const tempBRuns = b1Runs;
    const tempBBalls = b1Balls;

    currentState.batsman1.name = currentState.batsman2.name;
    b1Runs = b2Runs;
    b1Balls = b2Balls;

    currentState.batsman2.name = tempBName;
    b2Runs = tempBRuns;
    b2Balls = tempBBalls;

    // Switch bowler
    const bowlersList = bowlingTeam.players.filter(p => p.role === 'Bowler' || p.role === 'All-Rounder');
    const randomBowler = bowlersList[Math.floor(Math.random() * bowlersList.length)];
    currentState.currentBowler = {
      name: randomBowler.name,
      overs: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
    };
  } else {
    // If runs is odd, rotate strike
    if (eventRuns % 2 === 1) {
      const tempBName = currentState.batsman1.name;
      const tempBRuns = b1Runs;
      const tempBBalls = b1Balls;

      currentState.batsman1.name = currentState.batsman2.name;
      b1Runs = b2Runs;
      b1Balls = b2Balls;

      currentState.batsman2.name = tempBName;
      b2Runs = tempBRuns;
      b2Balls = tempBBalls;
    }
  }

  // Apply values
  currentState.batsman1.runs = b1Runs;
  currentState.batsman1.balls = b1Balls;
  currentState.batsman2.runs = b2Runs;
  currentState.batsman2.balls = b2Balls;

  currentState.currentBowler.overs = bowlerOvers;
  currentState.currentBowler.runs = bowlerRuns;
  currentState.currentBowler.wickets = bowlerWickets;

  currentState.overs = newOvers;
  currentState.balls = newBalls;
  currentState.runs = newRuns;
  currentState.wickets = newWickets;

  // Check innings/match completion
  if (currentInnings === 1) {
    if (newOvers >= 20 || newWickets >= 10) {
      inningsCompleted = true;
    }
  } else {
    if (target && newRuns >= target) {
      currentState.isCompleted = true;
      currentState.winnerId = teamB.id;
      currentState.statusText = `${teamB.name} won by ${10 - newWickets} wickets!`;
    } else if (newOvers >= 20 || newWickets >= 10) {
      currentState.isCompleted = true;
      if (target && newRuns < target - 1) {
        currentState.winnerId = teamA.id;
        currentState.statusText = `${teamA.name} won by ${target - 1 - newRuns} runs!`;
      } else {
        currentState.winnerId = 'draw';
        currentState.statusText = `Match tied! Both squads finished on equal scores.`;
      }
    }
  }

  if (inningsCompleted) {
    currentState.currentInnings = 2;
    currentState.target = newRuns + 1;
    currentState.runs = 0;
    currentState.wickets = 0;
    currentState.overs = 0;
    currentState.balls = 0;
    currentState.batsman1 = { name: teamB.players[0].name, runs: 0, balls: 0 };
    currentState.batsman2 = { name: teamB.players[1].name, runs: 0, balls: 0 };
    currentState.currentBowler = { name: teamA.players[teamA.players.length - 1].name, overs: 0, maidens: 0, runs: 0, wickets: 0 };
    currentState.statusText = `Innings Break: ${teamB.name} needs ${currentState.target} runs to win!`;
    commentary += ` Innings break! ${teamA.name} finished on ${newRuns}/${newWickets}. Target is ${currentState.target} runs.`;
  }

  // 4. LIVE WIN PROBABILITY DYNAMIC CALCULATION
  let winProbA = 50;
  let winProbB = 50;

  if (currentState.currentInnings === 1) {
    // Innings 1: Win prob driven by: runs, wickets, overs completed, team strengths
    const oversLeft = 20 - newOvers;
    const projectedRuns = newRuns + (oversLeft * 8.5) * (1 - newWickets * 0.08);
    const avgScore = venue.avgFirstInningsScore;

    // Normalize
    const diff = projectedRuns - avgScore;
    winProbA = Math.round(50 + (diff / 3) + (teamA.battingStrength - teamB.bowlingStrength) / 3);
  } else {
    // Innings 2: Win prob driven by: runs needed, balls left, wickets left
    const targetScore = target || 180;
    const runsNeeded = targetScore - newRuns;
    const ballsLeft = (20 - newOvers) * 6 - newBalls;
    const wicketsLeft = 10 - newWickets;

    if (runsNeeded <= 0) {
      winProbA = 0;
      winProbB = 100;
    } else if (ballsLeft <= 0 || wicketsLeft <= 0) {
      winProbA = 100;
      winProbB = 0;
    } else {
      const reqRunRate = (runsNeeded / ballsLeft) * 6;
      const currentRunRate = newRuns / (newOvers + newBalls / 6 || 1);

      // Formula integrating req rate and wickets remaining
      let chaseDifficulty = reqRunRate * 10 - wicketsLeft * 12;
      // standard win probability curve
      winProbB = Math.round(100 / (1 + Math.exp(chaseDifficulty / 22)));
      winProbA = 100 - winProbB;
    }
  }

  // Clamp probabilities
  winProbA = Math.max(1, Math.min(99, winProbA));
  winProbB = 100 - winProbA;

  currentState.winProbabilityA = winProbA;
  currentState.winProbabilityB = winProbB;

  // Append new event
  const ballEvent: BallEvent = {
    over: newOvers,
    ball: newBalls,
    batsman: batsmanName,
    bowler: bowlerName,
    runs: eventRuns,
    isWicket,
    wicketType,
    isExtra,
    extraType,
    isBoundary,
    commentary,
    teamAScore: currentInnings === 1 ? newRuns : target ? target - 1 : 180,
    teamAWickets: currentInnings === 1 ? newWickets : currentState.teamAWickets || 0,
    teamBScore: currentInnings === 2 ? newRuns : 0,
    teamBWickets: currentInnings === 2 ? newWickets : 0,
    target,
    currentInnings,
    winProbA,
    winProbB,
  };

  if (!currentState.eventsHistory) {
    currentState.eventsHistory = [];
  }
  currentState.eventsHistory.push(ballEvent);

  res.json({
    state: currentState,
    event: ballEvent,
  });
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IPL Prediction Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
