import { Lineup } from '../types';

interface LineupPageProps {
  lineup: Lineup;
  onStart: () => void;
}

export default function LineupPage({ lineup, onStart }: LineupPageProps) {
  const { playerHero, allyHeroes, enemyLaning, enemyJungle, enemyTeamFight } = lineup;

  return (
    <div className="page">
      <h2 style={{ textAlign: 'center', fontSize: '1.4rem', margin: '20px 0' }}>
        本局阵容
      </h2>

      <div className="card" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
        <div className="team-panel-title" style={{ color: 'var(--accent-blue)', marginBottom: 8 }}>
          我方阵容
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: 'rgba(59,130,246,0.15)',
            borderRadius: 8,
            border: '1px solid rgba(59,130,246,0.3)',
          }}>
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--accent-blue)',
              color: 'white',
              fontWeight: 600,
            }}>玩家</span>
            <span style={{ fontWeight: 700 }}>{playerHero.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{playerHero.title}</span>
          </div>
          {allyHeroes.map((hero, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              background: 'var(--bg-input)',
              borderRadius: 8,
            }}>
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: 4,
                background: 'var(--accent-green)',
                color: 'white',
                fontWeight: 600,
              }}>队友{i + 1}</span>
              <span style={{ fontWeight: 600 }}>{hero.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hero.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ borderLeft: '3px solid var(--accent-red)' }}>
        <div className="team-panel-title" style={{ color: 'var(--accent-red)', marginBottom: 8 }}>
          敌方阵容
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--accent-red)',
              color: 'white',
              fontWeight: 600,
            }}>对线</span>
            <span style={{ fontWeight: 600 }}>{enemyLaning.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enemyLaning.title}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--accent-orange)',
              color: 'white',
              fontWeight: 600,
            }}>打野</span>
            <span style={{ fontWeight: 600 }}>{enemyJungle.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enemyJungle.title}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: 8,
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--accent-purple)',
              color: 'white',
              fontWeight: 600,
            }}>团战</span>
            <span style={{ fontWeight: 600 }}>{enemyTeamFight.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enemyTeamFight.title}</span>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart} style={{ fontSize: '1.1rem', padding: '16px', marginTop: 8 }}>
        ⚔ 进入对线
      </button>
    </div>
  );
}
