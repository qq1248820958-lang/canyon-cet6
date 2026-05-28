import { heroes } from '../data/heroes';
import { Hero, Lineup } from '../types';

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateLineup(fixedPlayerId?: string): Lineup {
  if (fixedPlayerId) {
    const fixed = heroes.find(h => h.id === fixedPlayerId)!;
    const others = shuffleArray(heroes.filter(h => h.id !== fixedPlayerId));
    return {
      playerHero: fixed,
      allyHeroes: [others[0], others[1]],
      enemyLaning: others[2],
      enemyJungle: others[3],
      enemyTeamFight: others[4],
    };
  }
  const shuffled = shuffleArray(heroes);
  return {
    playerHero: shuffled[0],
    allyHeroes: [shuffled[1], shuffled[2]],
    enemyLaning: shuffled[3],
    enemyJungle: shuffled[4],
    enemyTeamFight: shuffled[5],
  };
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = shuffleArray(arr);
  return shuffled.slice(0, n);
}
