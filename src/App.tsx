import { useState, useEffect } from 'react';
import { Hero, Lineup } from './types';
import { generateLineup } from './utils/random';
import { syncRemotePacks } from './utils/questionLoader';
import { getHeroById } from './data/heroes';
import HomePage from './pages/HomePage';
import HeroDexPage from './pages/HeroDexPage';
import HeroSelectPage from './pages/HeroSelectPage';
import LineupPage from './pages/LineupPage';
import BattlePage, { BattleResult } from './pages/BattlePage';
import ReviewPage from './pages/ReviewPage';
import ResultPage from './pages/ResultPage';

type Page =
  | { name: 'home' }
  | { name: 'herodex' }
  | { name: 'heroSelect' }
  | { name: 'lineup'; lineup: Lineup }
  | { name: 'battle'; lineup: Lineup }
  | { name: 'result'; result: BattleResult }
  | { name: 'review' };

export default function App() {
  const [page, setPage] = useState<Page>({ name: 'home' });

  // Sync remote question packs on startup (fire-and-forget)
  useEffect(() => {
    syncRemotePacks();
  }, []);

  const handleStart = () => {
    setPage({ name: 'heroSelect' });
  };

  const handleHeroSelect = (selectedHero: Hero | null) => {
    if (selectedHero) {
      // Player chose 杨雪 — put remaining heroes into the random pool
      const lineup = generateLineup('yangxue');
      setPage({ name: 'lineup', lineup });
    } else {
      // Skip — random lineup, 杨雪 goes into the pool
      const lineup = generateLineup();
      setPage({ name: 'lineup', lineup });
    }
  };

  const handleEnterBattle = () => {
    if (page.name === 'lineup') {
      setPage({ name: 'battle', lineup: page.lineup });
    }
  };

  const handleBattleEnd = (result: BattleResult) => {
    setPage({ name: 'result', result });
  };

  switch (page.name) {
    case 'home':
      return (
        <HomePage
          onStart={handleStart}
          onHeroDex={() => setPage({ name: 'herodex' })}
          onReview={() => setPage({ name: 'review' })}
        />
      );
    case 'herodex':
      return <HeroDexPage onBack={() => setPage({ name: 'home' })} />;
    case 'heroSelect':
      return <HeroSelectPage onSelect={handleHeroSelect} onBack={() => setPage({ name: 'home' })} />;
    case 'lineup':
      return <LineupPage lineup={page.lineup} onStart={handleEnterBattle} />;
    case 'battle':
      return <BattlePage lineup={page.lineup} onEnd={handleBattleEnd} />;
    case 'result':
      return (
        <ResultPage
          result={page.result}
          onRestart={handleStart}
          onHome={() => setPage({ name: 'home' })}
          onReview={() => setPage({ name: 'review' })}
        />
      );
    case 'review':
      return <ReviewPage onBack={() => setPage({ name: 'home' })} />;
  }
}
