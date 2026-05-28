import { useState } from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean, selectedAnswer: string, selectedIndex: number) => void;
  onContinue: () => void;
}

export default function QuestionCard({ question, onAnswer, onContinue }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === question.answer;
    onAnswer(correct, question.options[idx], idx);
  };

  const getOptionClass = (idx: number) => {
    if (!answered) return '';
    if (idx === question.answer) return 'show-correct';
    if (idx === selected && idx !== question.answer) return 'wrong';
    return '';
  };

  const renderTranslation = () => {
    if (question.type === 'vocabulary') {
      return null;
    }
    // For sentence/reading/translation types, highlight the explanation as the translation
    return null;
  };

  return (
    <div className="question-card">
      {question.passage && (
        <div className="question-passage">{question.passage}</div>
      )}
      <div className="question-prompt">{question.prompt}</div>
      {question.type === 'vocabulary' && !answered && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
          选择正确的中文释义
        </div>
      )}
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
          marginTop: 12,
          padding: 12,
          borderRadius: 8,
          background: 'var(--bg-input)',
        }}>
          <div style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: selected === question.answer ? 'var(--accent-green)' : 'var(--accent-red)',
            marginBottom: 6,
          }}>
            {selected === question.answer
              ? '✓ 正确！'
              : `✗ 错误！正确答案: ${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}`}
          </div>

          {/* 详细解析 / 翻译 */}
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            padding: 8,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 6,
          }}>
            {question.explanation}
          </div>

          {/* 继续按钮 */}
          <button
            className="btn btn-primary"
            onClick={onContinue}
            style={{
              width: '100%',
              marginTop: 12,
              padding: '12px 0',
              fontSize: '0.9rem',
            }}
          >
            继续 ▶
          </button>
        </div>
      )}
    </div>
  );
}
