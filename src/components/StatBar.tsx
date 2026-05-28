interface StatBarProps {
  label: string;
  current: number;
  max: number;
  color?: string;
  showText?: boolean;
}

export default function StatBar({ label, current, max, color = 'var(--hp-bar)', showText = true }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
        <span>{label}</span>
        {showText && <span>{current}/{max}</span>}
      </div>
      <div className="hp-bar-container">
        <div className="hp-bar-fill" style={{ width: `${pct}%`, background: color }} />
        {!showText && <div className="hp-bar-text">{current}/{max}</div>}
      </div>
    </div>
  );
}
