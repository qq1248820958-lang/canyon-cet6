import { Skill } from '../types';

interface SkillButtonProps {
  skill: Skill;
  onUse: (key: string) => void;
  disabled?: boolean;
  cooldown?: boolean;
}

export default function SkillButton({ skill, onUse, disabled, cooldown }: SkillButtonProps) {
  return (
    <button
      className={`skill-btn skill-btn-${skill.key}${cooldown ? ' cooldown' : ''}`}
      onClick={() => onUse(skill.key)}
      disabled={disabled || cooldown}
    >
      <span className="skill-key">{skill.key}</span>
      <span className="skill-name">{skill.name}</span>
    </button>
  );
}
