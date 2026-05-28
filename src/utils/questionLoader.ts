import { Question } from '../types';

const STORAGE_KEY = 'canyon_cet6_remote_packs';
const MANIFEST_URL = 'https://raw.githubusercontent.com/qq1248820958-lang/canyon-cet6/main/question-packs/manifest.json';
const PACK_BASE_URL = 'https://raw.githubusercontent.com/qq1248820958-lang/canyon-cet6/main/question-packs/';

interface PackInfo {
  id: string;
  version: number;
  title: string;
  description: string;
  questionCount: number;
}

interface Manifest {
  version: number;
  packs: PackInfo[];
}

interface RemoteQuestionPack {
  packId: string;
  version: number;
  questions: Question[];
}

function getCachedPacks(): Record<string, RemoteQuestionPack> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getLastSyncDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY + '_last_sync');
  } catch {
    return null;
  }
}

function setLastSyncDate(): void {
  try {
    localStorage.setItem(STORAGE_KEY + '_last_sync', new Date().toISOString());
  } catch { /* ignore */ }
}

async function fetchManifest(): Promise<Manifest | null> {
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-cache' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchPack(packId: string): Promise<RemoteQuestionPack | null> {
  try {
    const res = await fetch(`${PACK_BASE_URL}${packId}.json`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function syncRemotePacks(): Promise<void> {
  const manifest = await fetchManifest();
  if (!manifest) return;

  const cached = getCachedPacks();
  let changed = false;

  for (const packInfo of manifest.packs) {
    const cachedPack = cached[packInfo.id];
    if (!cachedPack || cachedPack.version < packInfo.version) {
      const pack = await fetchPack(packInfo.id);
      if (pack) {
        cached[packInfo.id] = pack;
        changed = true;
      }
    }
  }

  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
    } catch (e) {
      console.warn('Failed to cache remote packs:', e);
    }
  }
  setLastSyncDate();
}

export function getCachedRemoteQuestions(): Question[] {
  const cached = getCachedPacks();
  const all: Question[] = [];
  const seenIds = new Set<string>();

  for (const pack of Object.values(cached)) {
    for (const q of pack.questions) {
      if (!seenIds.has(q.id)) {
        seenIds.add(q.id);
        all.push({
          id: q.id,
          type: q.type,
          prompt: q.prompt,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          sourceEvent: q.sourceEvent || '远程题库',
          difficulty: q.difficulty ?? 1,
        });
      }
    }
  }

  return all;
}

export function getRemoteQuestionCount(): number {
  return getCachedRemoteQuestions().length;
}

export function getLastSyncInfo(): { date: string | null; count: number } {
  return {
    date: getLastSyncDate(),
    count: getRemoteQuestionCount(),
  };
}
