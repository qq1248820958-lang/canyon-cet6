import { HeroState } from '../types';
import StatBar from './StatBar';

interface TeamPanelProps {
  title: string;
  members: HeroState[];
  color: string;
}

export default function TeamPanel({ title, members, color }: TeamPanelProps) {
  return (
    <div className="team-panel">
      <div className="team-panel-title" style={{ color }}>{title}</div>
      {members.map((m, i) => (
        <div className="team-member" key={i}>
          <span className="member-name">{m.heroName}</span>
          <div className="member-hp">
            <StatBar
              label=""
              current={m.currentHP}
              max={m.maxHP}
              showText={true}
              color={m.currentHP <= 30 ? 'var(--accent-red)' : 'var(--hp-bar)'}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
