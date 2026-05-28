import { getUserProgress, resetAllData } from '../utils/storage';
import { getRank, getXPProgress } from '../utils/rank';
import { getReviewItems } from '../utils/storage';
import { allQuestions } from '../data/questions';
import { getRemoteQuestionCount } from '../utils/questionLoader';

interface HomePageProps {
  onStart: () => void;
  onHeroDex: () => void;
  onReview: () => void;
}

export default function HomePage({ onStart, onHeroDex, onReview }: HomePageProps) {
  const progress = getUserProgress();
  const rank = getRank(progress.totalXP);
  const xpInfo = getXPProgress(progress.totalXP);
  const reviewCount = getReviewItems().filter(i => !i.mastered).length;

  const handleReset = () => {
    if (window.confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: 2 }}>
          六级峡谷
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: '0.9rem' }}>
          CET-6 Canyon
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>当前段位</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{rank}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>总经验</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--xp-bar)' }}>{progress.totalXP} XP</div>
          </div>
        </div>
        <div style={{ marginBottom: 4 }}>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${xpInfo.percentage}%` }} />
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>{xpInfo.current} / {xpInfo.needed} XP</span>
          <span>{xpInfo.percentage}%</span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>总局数</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{progress.totalGames}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>胜利</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-green)' }}>{progress.wins}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>失败</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-red)' }}>{progress.losses}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>题库</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-yellow)' }}>{allQuestions.length}</div>
          </div>
        </div>
        {getRemoteQuestionCount() > 0 && (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
            含 {getRemoteQuestionCount()} 道远程题
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={onStart} style={{ fontSize: '1.1rem', padding: '16px 24px' }}>
        ⚔ 开始随机对局
      </button>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-secondary" onClick={onHeroDex} style={{ flex: 1 }}>
          📖 英雄图鉴
        </button>
        <button className="btn btn-secondary" onClick={onReview} style={{ flex: 1 }} disabled={reviewCount === 0}>
          📝 复盘室 {reviewCount > 0 ? `(${reviewCount})` : ''}
        </button>
      </div>

      <button
        className="btn btn-small"
        onClick={handleReset}
        style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.75rem' }}
      >
        重置数据
      </button>
    </div>
  );
}
