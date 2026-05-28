import { heroes } from '../data/heroes';

interface HeroDexPageProps {
  onBack: () => void;
}

export default function HeroDexPage({ onBack }: HeroDexPageProps) {
  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-small btn-secondary" onClick={onBack}>← 返回</button>
        <h2 style={{ fontSize: '1.3rem' }}>英雄图鉴</h2>
      </div>

      {heroes.map(hero => (
        <div className="card" key={hero.id} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{hero.name}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{hero.title}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {hero.description}
          </p>
        </div>
      ))}
    </div>
  );
}
