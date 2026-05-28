import { HeroState, Hero } from '../types';

export function createHeroState(hero: Hero): HeroState {
  return {
    heroId: hero.id,
    heroName: hero.name,
    currentHP: 100,
    maxHP: 100,
    level: 1,
    gold: 0,
    windStacks: 0,
    isAlive: true,
  };
}

export function calculateDamage(
  correct: boolean,
  combo: number,
  heroId: string,
  baseDamage: number,
): number {
  if (!correct) return 0;
  let multiplier = 1;
  if (heroId === 'zed') {
    multiplier += Math.min(combo * 0.15, 0.6);
  } else {
    multiplier += Math.min(combo * 0.1, 0.5);
  }
  return Math.floor(baseDamage * multiplier);
}

export function calculateXP(
  correct: boolean,
  combo: number,
  difficulty: number,
  heroId: string,
): number {
  if (!correct) return 0;
  let base = 5;
  let comboBonus = Math.min(combo * 2, 15);
  let difficultyBonus = difficulty * 2;
  let total = base + comboBonus + difficultyBonus;
  if (heroId === 'garen') {
    total = Math.floor(total * 0.8);
  }
  return total;
}

export function calculateGold(correct: boolean, phase: string): number {
  if (!correct) return 0;
  if (phase === 'laning') return 20;
  if (phase === 'gank') return 15;
  return 10;
}

export function getComboDisplay(combo: number): string {
  if (combo >= 5) return `${combo}连击 🔥🔥`;
  if (combo >= 3) return `${combo}连击 🔥`;
  if (combo > 0) return `${combo}连击`;
  return '';
}

export function getPhaseLabel(phaseType: string): string {
  const labels: Record<string, string> = {
    laning: '1v1 对线阶段',
    gank: '1v2 打野来抓',
    'counter-fight': '反打阶段',
    teamfight: '3v3 团战阶段',
    highGround: '高地防守',
    finale: '水晶终结',
  };
  return labels[phaseType] || phaseType;
}
