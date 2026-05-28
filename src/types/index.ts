export interface Hero {
  id: string;
  name: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  key: 'Q' | 'W' | 'E' | 'R';
  type: string;
  description: string;
  cooldown: number;
}

export interface Question {
  id: string;
  type: 'vocabulary' | 'sentence' | 'shortReading' | 'readingGroup' | 'translation';
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  sourceEvent: string;
  difficulty: number;
  passage?: string;
  groupId?: string;
}

export interface Lineup {
  playerHero: Hero;
  allyHeroes: [Hero, Hero];
  enemyLaning: Hero;
  enemyJungle: Hero;
  enemyTeamFight: Hero;
}

export interface HeroState {
  heroId: string;
  heroName: string;
  currentHP: number;
  maxHP: number;
  level: number;
  gold: number;
  isAlive: boolean;
}

export type GamePhase =
  | { type: 'laning'; eventIndex: number }
  | { type: 'gank'; eventIndex: number }
  | { type: 'counter-choice' }
  | { type: 'counter-fight' }
  | { type: 'teamfight'; questionIndex: number; totalTeamfightQuestions: number }
  | { type: 'highGround' }
  | { type: 'finale' }
  | { type: 'result' };

export interface BattleState {
  phase: GamePhase;
  player: HeroState;
  enemyLaning: HeroState;
  enemyJungle: HeroState;
  enemyTeamFight: HeroState;
  allies: [HeroState, HeroState];
  combo: number;
  kills: number;
  deaths: number;
  assists: number;
  correctCount: number;
  totalCount: number;
  battleLog: string[];
  laningResult: 'win' | 'loss' | null;
  gankResult: 'escaped' | 'countered' | 'killed' | null;
  teamfightResult: 'perfect' | 'win' | 'trade' | 'loss' | 'ace' | null;
  highGroundResult: 'win' | 'loss' | null;
  winner: 'player' | 'enemy' | null;
  xpGained: number;
  usedQuestionIds: string[];
}

export interface ReviewItem {
  id: string;
  questionId: string;
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  sourceEvent: string;
  mistakeCount: number;
  mastered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  playerHero: string;
  allyHeroes: string[];
  enemyHeroes: string[];
  result: 'victory' | 'defeat';
  accuracy: number;
  gainedXP: number;
  kills: number;
  deaths: number;
  assists: number;
  laningResult: string;
  gankResult: string;
  teamfightResult: string;
  wrongQuestions: string[];
}

export interface UserProgress {
  totalXP: number;
  rank: string;
  gamesPlayedToday: number;
  totalGames: number;
  wins: number;
  losses: number;
  lastPlayedDate: string;
}
