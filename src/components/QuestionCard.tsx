import { useState } from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean, selectedAnswer: string, selectedIndex: number) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === question.answer;
    setTimeout(() => {
      onAnswer(correct, question.options[idx], idx);
    }, 1200);
  };

  const getOptionClass = (idx: number) => {
    if (!answered) return '';
    if (idx === question.answer) return 'show-correct';
    if (idx === selected && idx !== question.answer) return 'wrong';
    return '';
  };

  return (
    <div className="question-card">
      {question.passage && (
        <div className="question-passage">{question.passage}</div>
      )}
      <div className="question-prompt">{question.prompt}</div>
      <div>
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${getOptionClass(idx)}`}
            onClick={() => handleSelect(idx)}
            disabled={answered}
          >
            {String.fromCharCode(65 + idx)}. {opt}
          </button>
        ))}
      </div>
      {answered && (
        <div style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 8,
          background: selected === question.answer
            ? 'rgba(34,197,94,0.15)'
            : 'rgba(239,68,68,0.15)',
          color: selected === question.answer ? 'var(--accent-green)' : 'var(--accent-red)',
          fontSize: '0.85rem',
        }}>
          {selected === question.answer ? '✓ 正确！' : `✗ 错误！正确答案: ${String.fromCharCode(65 + question.answer)}`}
          <div style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
