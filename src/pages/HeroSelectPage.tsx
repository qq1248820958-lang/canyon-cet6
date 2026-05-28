import { heroes, getHeroById } from '../data/heroes';
import { Hero } from '../types';

interface HeroSelectPageProps {
  onSelect: (selectedHero: Hero | null) => void;
  onBack: () => void;
}

const yangxue = getHeroById('yangxue')!;

export default function HeroSelectPage({ onSelect, onBack }: HeroSelectPageProps) {
  const handlePick = () => {
    onSelect(yangxue);
  };

  const handleSkip = () => {
    onSelect(null);
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ textAlign: 'center', fontSize: '1.4rem', margin: '20px 0 0' }}>
        选择英雄
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
        你可以选择特殊英雄「杨雪」，或交由系统随机分配
      </p>

      <div className="card" style={{
        borderLeft: '4px solid var(--accent-purple)',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1))',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 800,
          color: 'white',
          margin: '0 auto 12px',
        }}>
          雪
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{yangxue.name}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{yangxue.title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 260, margin: '0 auto' }}>
          {yangxue.description}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handlePick} style={{ fontSize: '1.1rem', padding: '16px 24px' }}>
        ⚡ 使用杨雪
      </button>

      <button className="btn btn-secondary" onClick={handleSkip} style={{ fontSize: '1rem', padding: '14px 24px' }}>
        🎲 随机分配（杨雪将进入随机池）
      </button>

      <button className="btn btn-small" onClick={onBack} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
        返回首页
      </button>
    </div>
  );
}
