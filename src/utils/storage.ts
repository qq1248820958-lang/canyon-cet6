import { UserProgress, ReviewItem, MatchHistoryItem } from '../types';

const KEYS = {
  userProgress: 'canyon_cet6_progress',
  reviewItems: 'canyon_cet6_review',
  matchHistory: 'canyon_cet6_history',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
}

export function getUserProgress(): UserProgress {
  return safeGet(KEYS.userProgress, {
    totalXP: 0,
    rank: '黑铁',
    gamesPlayedToday: 0,
    totalGames: 0,
    wins: 0,
    losses: 0,
    lastPlayedDate: '',
  });
}

export function saveUserProgress(p: UserProgress): void {
  safeSet(KEYS.userProgress, p);
}

export function getReviewItems(): ReviewItem[] {
  return safeGet(KEYS.reviewItems, []);
}

export function saveReviewItems(items: ReviewItem[]): void {
  safeSet(KEYS.reviewItems, items);
}

export function addReviewItem(
  questionId: string,
  prompt: string,
  correctAnswer: string,
  userAnswer: string,
  explanation: string,
  sourceEvent: string,
): void {
  const items = getReviewItems();
  const existing = items.find(i => i.questionId === questionId);
  const now = new Date().toISOString();
  if (existing) {
    existing.mistakeCount += 1;
    existing.userAnswer = userAnswer;
    existing.updatedAt = now;
  } else {
    items.push({
      id: `review_${Date.now()}`,
      questionId,
      prompt,
      correctAnswer,
      userAnswer,
      explanation,
      sourceEvent,
      mistakeCount: 1,
      mastered: false,
      createdAt: now,
      updatedAt: now,
    });
  }
  saveReviewItems(items);
}

export function getMatchHistory(): MatchHistoryItem[] {
  return safeGet(KEYS.matchHistory, []);
}

export function saveMatchHistoryItem(item: MatchHistoryItem): void {
  const history = getMatchHistory();
  history.unshift(item);
  safeSet(KEYS.matchHistory, history);
}

export function resetAllData(): void {
  try {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('reset failed:', e);
  }
}
