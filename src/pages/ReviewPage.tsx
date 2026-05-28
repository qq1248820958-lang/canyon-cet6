import { useState } from 'react';
import { ReviewItem } from '../types';
import { getReviewItems, saveReviewItems } from '../utils/storage';

interface ReviewPageProps {
  onBack: () => void;
}

export default function ReviewPage({ onBack }: ReviewPageProps) {
  const [items, setItems] = useState<ReviewItem[]>(getReviewItems);
  const [filter, setFilter] = useState<'all' | 'unmastered'>('unmastered');

  const displayed = filter === 'unmastered' ? items.filter(i => !i.mastered) : items;

  const toggleMastered = (id: string) => {
    const updated = items.map(i =>
      i.id === id ? { ...i, mastered: !i.mastered, updatedAt: new Date().toISOString() } : i
    );
    setItems(updated);
    saveReviewItems(updated);
  };

  const clearAll = () => {
    if (window.confirm('确定清空所有错题吗？')) {
      setItems([]);
      saveReviewItems([]);
    }
  };

  const clearMastered = () => {
    const unmastered = items.filter(i => !i.mastered);
    setItems(unmastered);
    saveReviewItems(unmastered);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-small btn-secondary" onClick={onBack}>← 返回</button>
        <h2 style={{ fontSize: '1.3rem' }}>复盘室</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {items.filter(i => !i.mastered).length} 题未掌握
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          className={`btn btn-small ${filter === 'unmastered' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('unmastered')}
        >
          未掌握 ({items.filter(i => !i.mastered).length})
        </button>
        <button
          className={`btn btn-small ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          全部 ({items.length})
        </button>
      </div>

      {displayed.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✨</div>
          <div>暂无错题</div>
        </div>
      )}

      {displayed.map(item => (
        <div className="card" key={item.id} style={{
          opacity: item.mastered ? 0.6 : 1,
          borderLeft: `3px solid ${item.mastered ? 'var(--accent-green)' : 'var(--accent-red)'}`,
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            来源：{item.sourceEvent} | 错误 {item.mistakeCount} 次
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
            {item.prompt.length > 100 ? item.prompt.slice(0, 100) + '...' : item.prompt}
          </div>
          <div style={{ fontSize: '0.85rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--accent-green)' }}>✓ 正确答案：{item.correctAnswer}</span>
          </div>
          <div style={{ fontSize: '0.85rem', marginBottom: 8 }}>
            <span style={{ color: 'var(--accent-red)' }}>✗ 你的答案：{item.userAnswer}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            {item.explanation}
          </div>
          <button
            className="btn btn-small"
            style={{
              background: item.mastered ? 'var(--bg-input)' : 'var(--accent-green)',
              color: item.mastered ? 'var(--text-secondary)' : 'white',
              width: 'auto',
            }}
            onClick={() => toggleMastered(item.id)}
          >
            {item.mastered ? '✅ 已掌握' : '标记已掌握'}
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 40 }}>
          <button className="btn btn-secondary btn-small" onClick={clearMastered}>
            清除已掌握
          </button>
          <button className="btn btn-danger btn-small" onClick={clearAll}>
            清空全部错题
          </button>
        </div>
      )}
    </div>
  );
}
