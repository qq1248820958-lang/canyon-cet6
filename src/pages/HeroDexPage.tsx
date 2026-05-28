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
        <div className="card" key={hero.id} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{hero.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 8 }}>{hero.title}</span>
            </div>
            <span style={{
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: 10,
              background: 'var(--bg-input)',
              color: 'var(--text-secondary)',
            }}>
              {hero.role}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            {hero.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
            {(['Q', 'W', 'E', 'R'] as const).map(key => {
              const skill = hero.skills[key];
              const skillColors: Record<string, string> = {
                Q: 'var(--skill-q)',
                W: 'var(--skill-w)',
                E: 'var(--skill-e)',
                R: 'var(--skill-r)',
              };
              return (
                <div key={key} style={{
                  background: 'var(--bg-input)',
                  borderRadius: 8,
                  padding: 8,
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: skillColors[key],
                  }}>{key}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {skill.name}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {skill.type}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--accent-purple)',
            background: 'rgba(168,85,247,0.1)',
            padding: '8px 10px',
            borderRadius: 6,
          }}>
            <strong>特殊机制：</strong>{hero.specialMechanic}
          </div>
        </div>
      ))}
    </div>
  );
}
