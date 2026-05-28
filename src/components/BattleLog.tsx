import { useEffect, useRef } from 'react';

interface BattleLogProps {
  entries: string[];
}

export default function BattleLog({ entries }: BattleLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="card">
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
        战斗日志
      </div>
      <div className="battle-log">
        {entries.length === 0 && (
          <div className="battle-log-entry log-info">对局开始...</div>
        )}
        {entries.map((entry, i) => {
          let className = 'battle-log-entry';
          if (entry.includes('击杀') || entry.includes('双杀') || entry.includes('完美团战')) {
            className += ' log-kill';
          } else if (entry.includes('伤害') || entry.includes('死亡') || entry.includes('被抓')) {
            className += ' log-damage';
          } else if (entry.includes('金币') || entry.includes('补兵')) {
            className += ' log-gold';
          } else if (entry.includes('连击') || entry.includes('风')) {
            className += ' log-combo';
          } else {
            className += ' log-info';
          }
          return <div key={i} className={className}>{entry}</div>;
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
