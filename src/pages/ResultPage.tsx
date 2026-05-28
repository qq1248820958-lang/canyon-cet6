import { useMemo } from 'react';
import { BattleResult } from './BattlePage';
import { getUserProgress, saveUserProgress, saveMatchHistoryItem } from '../utils/storage';
import { getRank, getXPProgress } from '../utils/rank';

interface ResultPageProps {
  result: BattleResult;
  onRestart: () => void;
  onHome: () => void;
  onReview: () => void;
}

export default function ResultPage({ result, onRestart, onHome, onReview }: ResultPageProps) {
  const savedData = useMemo(() => {
    const progress = getUserProgress();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const isNewDay = progress.lastPlayedDate !== today;

    const updated: typeof progress = {
      totalXP: progress.totalXP + result.xpGained,
      rank: getRank(progress.totalXP + result.xpGained),
      gamesPlayedToday: isNewDay ? 1 : progress.gamesPlayedToday + 1,
      totalGames: progress.totalGames + 1,
      wins: progress.wins + (result.winner === 'player' ? 1 : 0),
      losses: progress.losses + (result.winner === 'enemy' ? 1 : 0),
      lastPlayedDate: today,
    };

    saveUserProgress(updated);

    const accuracy = result.totalCount > 0
      ? Math.round((result.correctCount / result.totalCount) * 100)
      : 0;

    const matchItem = {
      id: `match_${Date.now()}`,
      date: now.toISOString(),
      playerHero: result.playerHero.name,
      allyHeroes: result.allyHeroes.map(h => h.name),
      enemyHeroes: result.enemyHeroes.map(h => h.name),
      result: result.winner === 'player' ? 'victory' as const : 'defeat' as const,
      accuracy,
      gainedXP: result.xpGained,
      kills: result.kills,
      deaths: result.deaths,
      assists: result.assists,
      laningResult: result.laningResult,
      gankResult: result.gankResult,
      teamfightResult: result.teamfightResult,
      wrongQuestions: result.wrongQuestions.map(w => w.prompt),
    };

    saveMatchHistoryItem(matchItem);

    return { updated, accuracy };
  }, [result]);

  const xpInfo = getXPProgress(savedData.updated.totalXP);

  let rating: string;
  const accuracy = savedData.accuracy;
  if (accuracy >= 90) rating = 'S';
  else if (accuracy >= 75) rating = 'A';
  else if (accuracy >= 60) rating = 'B';
  else if (accuracy >= 40) rating = 'C';
  else rating = 'D';

  return (
    <div className="page">
      <div style={{ textAlign: 'center', margin: '20px 0 16px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>
          {result.winner === 'player' ? '🏆' : '💀'}
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          {result.winner === 'player' ? '胜利！' : '失败...'}
        </h1>
        <div style={{
          display: 'inline-block',
          marginTop: 8,
          padding: '8px 24px',
          borderRadius: 20,
          background: accuracy >= 75 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
          color: accuracy >= 75 ? 'var(--accent-green)' : 'var(--accent-red)',
          fontSize: '2rem',
          fontWeight: 800,
        }}>
          {rating}
        </div>
      </div>

      {/* 经验条 */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {getRank(savedData.updated.totalXP)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)' }}>
            +{result.xpGained} XP
          </span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar-fill" style={{ width: `${xpInfo.percentage}%` }} />
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
          距离下段位还需 {Math.max(0, xpInfo.needed - xpInfo.current)} XP
        </div>
      </div>

      {/* 本局数据 */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: 10 }}>本局数据</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85rem' }}>
          <div>使用英雄：<strong>{result.playerHero.name}</strong></div>
          <div>正确率：<strong style={{ color: accuracy >= 60 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{accuracy}%</strong></div>
          <div>KDA：<strong>{result.kills}/{result.deaths}/{result.assists}</strong></div>
          <div>获经验：<strong style={{ color: 'var(--accent-blue)' }}>+{result.xpGained}</strong></div>
          <div>对线结果：<strong>{result.laningResult}</strong></div>
          <div>被抓处理：<strong>{result.gankResult}</strong></div>
          <div>团战结果：<strong>{result.teamfightResult}</strong></div>
          <div>答对题数：<strong>{result.correctCount}/{result.totalCount}</strong></div>
        </div>
      </div>

      {/* 己方队友 */}
      <div className="card">
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>己方队友</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {result.allyHeroes.map((h, i) => (
            <span key={i} style={{
              padding: '4px 12px',
              background: 'var(--bg-input)',
              borderRadius: 6,
              fontSize: '0.85rem',
            }}>{h.name}</span>
          ))}
        </div>
      </div>

      {/* 敌方阵容 */}
      <div className="card">
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>敌方阵容</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {result.enemyHeroes.map((h, i) => (
            <span key={i} style={{
              padding: '4px 12px',
              background: 'var(--bg-input)',
              borderRadius: 6,
              fontSize: '0.85rem',
            }}>{h.name}</span>
          ))}
        </div>
      </div>

      {/* 错题 */}
      {result.wrongQuestions.length > 0 && (
        <div className="card" style={{ borderLeft: '3px solid var(--accent-red)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-red)', marginBottom: 6 }}>
            本局错题 ({result.wrongQuestions.length})
          </div>
          {result.wrongQuestions.map((w, i) => (
            <div key={i} style={{
              fontSize: '0.8rem',
              padding: '4px 0',
              borderBottom: i < result.wrongQuestions.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              {w.prompt.length > 60 ? w.prompt.slice(0, 60) + '...' : w.prompt}
            </div>
          ))}
        </div>
      )}

      {/* 按钮 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, marginBottom: 40 }}>
        <button className="btn btn-primary" onClick={onRestart}>
          🔄 再来一局
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          🏠 返回首页
        </button>
        <button className="btn btn-secondary" onClick={onReview}>
          📝 去复盘室
        </button>
      </div>
    </div>
  );
}
