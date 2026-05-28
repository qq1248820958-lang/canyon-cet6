const RANKS = [
  { name: '黑铁', minXP: 0 },
  { name: '青铜', minXP: 300 },
  { name: '白银', minXP: 800 },
  { name: '黄金', minXP: 1500 },
  { name: '铂金', minXP: 2500 },
  { name: '钻石', minXP: 4000 },
  { name: '大师', minXP: 6000 },
  { name: '王者', minXP: 9000 },
];

export function getRank(totalXP: number): string {
  let rank = RANKS[0].name;
  for (const r of RANKS) {
    if (totalXP >= r.minXP) {
      rank = r.name;
    }
  }
  return rank;
}

export function getNextRankXP(totalXP: number): number {
  for (const r of RANKS) {
    if (totalXP < r.minXP) {
      return r.minXP;
    }
  }
  return RANKS[RANKS.length - 1].minXP;
}

export function getCurrentRankIndex(totalXP: number): number {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].minXP) {
      return i;
    }
  }
  return 0;
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percentage: number } {
  const currentIdx = getCurrentRankIndex(totalXP);
  const currentMin = RANKS[currentIdx].minXP;
  const nextMin = currentIdx < RANKS.length - 1 ? RANKS[currentIdx + 1].minXP : currentMin + 3000;
  const progress = totalXP - currentMin;
  const needed = nextMin - currentMin;
  const percentage = Math.min(100, Math.floor((progress / needed) * 100));
  return { current: progress, needed, percentage };
}
