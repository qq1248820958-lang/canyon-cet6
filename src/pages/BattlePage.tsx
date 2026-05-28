import { useState, useCallback, useRef } from 'react';
import { Hero, Lineup, Question, GamePhase, HeroState, BattleState } from '../types';
import { createHeroState, calculateDamage, calculateXP, calculateGold, getComboDisplay, getPhaseLabel } from '../utils/battle';
import { allQuestions, getReadingGroupQuestions } from '../data/questions';
import { addReviewItem } from '../utils/storage';
import StatBar from '../components/StatBar';
import SkillButton from '../components/SkillButton';
import QuestionCard from '../components/QuestionCard';
import BattleLog from '../components/BattleLog';
import TeamPanel from '../components/TeamPanel';

interface BattlePageProps {
  lineup: Lineup;
  onEnd: (result: BattleResult) => void;
}

export interface BattleResult {
  winner: 'player' | 'enemy';
  playerHero: Hero;
  allyHeroes: [Hero, Hero];
  enemyHeroes: [Hero, Hero, Hero];
  kills: number;
  deaths: number;
  assists: number;
  correctCount: number;
  totalCount: number;
  xpGained: number;
  laningResult: string;
  gankResult: string;
  teamfightResult: string;
  wrongQuestions: { prompt: string; correct: string; userAnswer: string }[];
  allAnsweredQuestions: {
    id: string;
    type: string;
    prompt: string;
    passage?: string;
    options: string[];
    correctAnswer: string;
    userAnswer: string;
    explanation: string;
    correct: boolean;
  }[];
}

export default function BattlePage({ lineup, onEnd }: BattlePageProps) {
  const wrongAnswersRef = useRef<{ prompt: string; correct: string; userAnswer: string }[]>([]);
  const allAnswersRef = useRef<BattleResult['allAnsweredQuestions']>([]);
  const pendingAnswerRef = useRef<{ correct: boolean; question: Question; selectedAnswer: string } | null>(null);

  const [battle, setBattle] = useState<BattleState>(() => {
    const p = createHeroState(lineup.playerHero);
    p.gold = 500;
    return {
      phase: { type: 'laning', eventIndex: 0 },
      player: p,
      enemyLaning: createHeroState(lineup.enemyLaning),
      enemyJungle: createHeroState(lineup.enemyJungle),
      enemyTeamFight: createHeroState(lineup.enemyTeamFight),
      allies: [createHeroState(lineup.allyHeroes[0]), createHeroState(lineup.allyHeroes[1])],
      combo: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      correctCount: 0,
      totalCount: 0,
      battleLog: [`对局开始！你使用 ${lineup.playerHero.name}`],
      laningResult: null,
      gankResult: null,
      teamfightResult: null,
      highGroundResult: null,
      winner: null,
      xpGained: 0,
      usedQuestionIds: [],
    };
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerState, setAnswerState] = useState<'waiting' | 'answering' | 'result'>('waiting');
  const [questionKey, setQuestionKey] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  const pickQuestion = useCallback((type: string, used: string[]): Question | null => {
    let pool: Question[] = [];
    switch (type) {
      case 'laning-lasthit':
        pool = allQuestions.filter(q => q.type === 'vocabulary' && q.sourceEvent === '对线补兵');
        break;
      case 'laning-poke':
        pool = allQuestions.filter(q => q.type === 'sentence' && q.sourceEvent === '敌方消耗');
        break;
      case 'laning-kill':
        pool = allQuestions.filter(q =>
          (q.type === 'vocabulary' || q.type === 'sentence') && q.sourceEvent === '1v1单杀'
        );
        break;
      case 'gank':
        pool = allQuestions.filter(q => q.type === 'shortReading' && q.sourceEvent === '打野来抓');
        break;
      case 'teamfight':
        pool = getReadingGroupQuestions('rg1');
        break;
      case 'highground':
        pool = getReadingGroupQuestions('rg2');
        break;
      case 'highground-trans':
        pool = allQuestions.filter(q => q.type === 'translation' && q.sourceEvent === '高地防守');
        break;
      case 'finale':
        pool = allQuestions.filter(q => q.type === 'translation' && q.sourceEvent === '水晶终结');
        break;
    }
    const available = pool.filter(q => !used.includes(q.id) && !answeredIds.has(q.id));
    if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
    const fallback = pool.filter(q => !answeredIds.has(q.id));
    if (fallback.length > 0) return fallback[0];
    return pool.length > 0 ? pool[0] : null;
  }, [answeredIds]);

  const handleAnswer = useCallback((correct: boolean, selectedAnswer: string, selectedIndex: number) => {
    if (!currentQuestion) return;

    const q = currentQuestion;
    const options = 'ABCD';

    // Track ALL answered questions
    allAnswersRef.current.push({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      passage: q.passage,
      options: q.options,
      correctAnswer: `${options[q.answer]}. ${q.options[q.answer]}`,
      userAnswer: selectedAnswer,
      explanation: q.explanation,
      correct,
    });

    // Track wrong answers for review room
    if (!correct) {
      addReviewItem(
        q.id,
        q.prompt,
        `${options[q.answer]}. ${q.options[q.answer]}`,
        selectedAnswer,
        q.explanation,
        q.sourceEvent,
      );
      wrongAnswersRef.current.push({
        prompt: q.prompt,
        correct: `${options[q.answer]}. ${q.options[q.answer]}`,
        userAnswer: selectedAnswer,
      });
    }

    setAnsweredIds(prev => new Set(prev).add(q.id));

    // Store pending answer result (applied on continue)
    pendingAnswerRef.current = { correct, question: q, selectedAnswer };
  }, [currentQuestion]);

  const handleContinue = useCallback(() => {
    const pending = pendingAnswerRef.current;
    if (!pending) return;
    const { correct, q } = pending;
    pendingAnswerRef.current = null;

    setBattle(prev => {
      const next = { ...prev };
      next.totalCount += 1;
      next.usedQuestionIds = [...next.usedQuestionIds, q.id];

      const heroId = lineup.playerHero.id;
      const combo = correct ? next.combo + 1 : 0;
      next.combo = correct ? combo : 0;

      if (correct) {
        next.correctCount += 1;
      }

      const ptype = prev.phase.type;

      if (ptype === 'laning') {
        const ei = (prev.phase as any).eventIndex;
        if (correct) {
          const dmg = calculateDamage(correct, combo, heroId, ei === 2 ? 15 : ei === 1 ? 10 : 5);
          if (ei === 0) {
            next.player.gold += 20;
            next.battleLog.push(`✅ 补兵成功！金币 +20${combo > 1 ? ' ' + getComboDisplay(combo) : ''}`);
          } else if (ei === 1) {
            next.enemyLaning.currentHP = Math.max(0, next.enemyLaning.currentHP - dmg);
            next.battleLog.push(`✅ 躲开技能并反击！${lineup.enemyLaning.name} HP -${dmg}${combo > 1 ? ' ' + getComboDisplay(combo) : ''}`);
          } else {
            next.enemyLaning.currentHP = Math.max(0, next.enemyLaning.currentHP - dmg);
            next.battleLog.push(`✅ 精彩单杀机会！${lineup.enemyLaning.name} HP -${dmg}${combo > 1 ? ' ' + getComboDisplay(combo) : ''}`);
          }
          const xp = calculateXP(correct, combo, q.difficulty, heroId);
          next.xpGained += xp;
          next.player.gold += 10;
        } else {
          const dmg = ei === 0 ? 5 : 10;
          const actualDmg = heroId === 'garen' ? Math.floor(dmg * 0.7) : dmg;
          next.player.currentHP = Math.max(0, next.player.currentHP - actualDmg);
          next.battleLog.push(`❌ 失误！HP -${actualDmg}${heroId === 'garen' ? ' (盖伦减伤)' : ''}`);
        }

        const nextEi = ei + 1;
        if (nextEi >= 3) {
          next.laningResult = next.enemyLaning.currentHP <= 30 ? 'win' : 'loss';
          next.battleLog.push(`--- 对线阶段结束：${next.laningResult === 'win' ? '优势' : '劣势'} ---`);
          next.phase = { type: 'gank', eventIndex: 0 };
        } else {
          next.phase = { type: 'laning', eventIndex: nextEi };
        }
      } else if (ptype === 'gank') {
        if (correct) {
          next.gankResult = 'escaped';
          next.battleLog.push(`✅ 发现打野，成功撤退！XP +10`);
          next.xpGained += 10;
          next.phase = { type: 'counter-choice' };
        } else {
          const dmg = 25;
          const actualDmg = heroId === 'garen' ? Math.floor(dmg * 0.7) : dmg;
          next.player.currentHP = Math.max(0, next.player.currentHP - actualDmg);
          next.battleLog.push(`❌ 被抓！HP -${actualDmg}${heroId === 'garen' ? ' (盖伦减伤)' : ''}`);
          next.gankResult = 'killed';
          next.deaths += 1;
          next.battleLog.push(`--- 打野来抓结束：被抓 ---`);
          next.phase = { type: 'teamfight', questionIndex: 0, totalTeamfightQuestions: 3 };
        }
      } else if (ptype === 'counter-fight') {
        if (correct) {
          next.kills += 1;
          next.gankResult = 'countered';
          next.enemyJungle.currentHP = 0;
          next.battleLog.push(`🔥 反打成功！击杀 ${lineup.enemyJungle.name}！`);
          next.xpGained += 30;
          next.player.gold += 50;
        } else {
          const dmg = heroId === 'garen' ? 14 : 20;
          next.player.currentHP = Math.max(0, next.player.currentHP - dmg);
          next.battleLog.push(`❌ 反打失败！HP -${dmg}`);
          next.gankResult = 'killed';
          next.deaths += 1;
        }
        next.battleLog.push(`--- 反打结束 ---`);
        next.phase = { type: 'teamfight', questionIndex: 0, totalTeamfightQuestions: 3 };
      } else if (ptype === 'teamfight') {
        const tpq = (prev.phase as any).questionIndex;
        const total = (prev.phase as any).totalTeamfightQuestions;
        if (correct) {
          next.player.gold += 15;
          next.xpGained += 8;
          next.battleLog.push(`✅ 团战动作成功！${combo > 1 ? getComboDisplay(combo) : ''}`);
        } else {
          next.player.currentHP = Math.max(0, next.player.currentHP - 12);
          next.battleLog.push(`❌ 团战失误！HP -12`);
        }
        const nextTq = tpq + 1;
        if (nextTq >= total) {
          const correctInTf = next.correctCount - (prev.correctCount) + (correct ? 1 : 0);
          const totalInTf = total;
          const tfAccuracy = correctInTf / totalInTf;
          let tfResult: string;
          if (tfAccuracy >= 1) {
            tfResult = 'perfect';
            next.battleLog.push(`🏆 完美团战！0换3，拿下小龙！`);
            next.kills += 3;
            next.xpGained += 50;
          } else if (tfAccuracy >= 0.67) {
            tfResult = 'win';
            next.battleLog.push(`✅ 团战胜利！击杀2人，拿下小龙`);
            next.kills += 2;
            next.xpGained += 30;
          } else if (tfAccuracy >= 0.33) {
            tfResult = 'trade';
            next.battleLog.push(`🤝 团战小亏，换掉1人`);
            next.kills += 1;
            next.deaths += 1;
          } else {
            tfResult = 'loss';
            next.battleLog.push(`💀 团战失败，被团灭！`);
            next.deaths += 3;
            next.player.currentHP = Math.max(0, next.player.currentHP - 20);
          }
          next.teamfightResult = tfResult as any;
          next.phase = { type: 'highGround' };
        } else {
          next.phase = { type: 'teamfight', questionIndex: nextTq, totalTeamfightQuestions: total };
        }
      } else if (ptype === 'highGround') {
        // Check how many rg2 questions have been answered
        const answeredRg2 = next.usedQuestionIds.filter(id =>
          allQuestions.find(qq => qq.id === id && qq.groupId === 'rg2')
        ).length;
        // We want to show all 3 rg2 questions before moving on
        if (q.groupId === 'rg2' && answeredRg2 < 3) {
          if (correct) {
            next.battleLog.push(`✅ 高地防守成功！`);
          } else {
            next.battleLog.push(`❌ 高地防守受挫！`);
            next.player.currentHP = Math.max(0, next.player.currentHP - 15);
          }
          next.phase = { type: 'highGround' };
        } else {
          // After all rg2 questions (or if non-rg2), do the high ground resolution
          // Check if we already did rg2 questions
          if (answeredRg2 >= 3 || q.groupId !== 'rg2') {
            if (correct) {
              next.highGroundResult = 'win';
              next.battleLog.push(`🏰 成功守住高地！反推一波！`);
              next.xpGained += 20;
            } else {
              next.highGroundResult = 'loss';
              next.player.currentHP = Math.max(0, next.player.currentHP - 20);
              next.battleLog.push(`💀 高地被破！`);
            }
            next.phase = { type: 'finale' };
          } else {
            // Still doing rg2 questions
            if (correct) {
              next.battleLog.push(`✅ 高地防守成功！`);
            } else {
              next.battleLog.push(`❌ 高地防守受挫！`);
              next.player.currentHP = Math.max(0, next.player.currentHP - 15);
            }
            next.phase = { type: 'highGround' };
          }
        }
      } else if (ptype === 'finale') {
        if (correct) {
          next.battleLog.push(`🏆 推掉水晶！胜利！`);
          next.winner = 'player';
          next.xpGained += 40;
        } else {
          next.battleLog.push(`💀 被翻盘，水晶被破...`);
          next.winner = 'enemy';
          if (next.deaths === 0) next.deaths += 1;
        }
        next.phase = { type: 'result' };
      }

      // Check death
      if (next.player.currentHP <= 0 && next.winner === null) {
        next.player.currentHP = 0;
        next.player.isAlive = false;
        next.deaths += 1;
        next.winner = 'enemy';
        next.phase = { type: 'result' };
        next.battleLog.push(`💀 你已被击杀...`);
      }

      return next;
    });

    setCurrentQuestion(null);
    setAnswerState('waiting');
    setQuestionKey(k => k + 1);
  }, [lineup]);

  const startEvent = useCallback(() => {
    const used = battle.usedQuestionIds;
    let q: Question | null = null;

    const p = battle.phase;
    if (p.type === 'laning') {
      const ei = p.eventIndex;
      if (ei === 0) q = pickQuestion('laning-lasthit', used);
      else if (ei === 1) q = pickQuestion('laning-poke', used);
      else q = pickQuestion('laning-kill', used);
    } else if (p.type === 'gank') {
      q = pickQuestion('gank', used);
    } else if (p.type === 'counter-fight') {
      const pool = allQuestions.filter(qq => qq.type === 'shortReading' && !used.includes(qq.id) && !answeredIds.has(qq.id));
      q = pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : pickQuestion('gank', used);
    } else if (p.type === 'teamfight') {
      q = pickQuestion('teamfight', used);
    } else if (p.type === 'highGround') {
      const answeredRg2 = used.filter(id =>
        allQuestions.find(qq => qq.id === id && qq.groupId === 'rg2')
      ).length;
      if (answeredRg2 < 3) {
        q = pickQuestion('highground', used);
      }
      if (!q) {
        q = pickQuestion('highground-trans', used);
      }
    } else if (p.type === 'finale') {
      q = pickQuestion('finale', used);
    }

    if (q) {
      setCurrentQuestion(q);
      setAnswerState('answering');
    }
  }, [battle.phase, battle.usedQuestionIds, pickQuestion, answeredIds]);

  const handleSkillUse = useCallback((_skillKey: string) => {
    if (answerState !== 'waiting') return;
    startEvent();
  }, [answerState, startEvent]);

  const handleCounterChoice = useCallback((choice: 'retreat' | 'fight') => {
    setBattle(prev => ({
      ...prev,
      battleLog: [
        ...prev.battleLog,
        choice === 'retreat'
          ? '🛡 选择撤退发育，安全离开'
          : '⚔ 选择反打！',
      ],
      xpGained: prev.xpGained + (choice === 'retreat' ? 5 : 0),
      phase: choice === 'retreat'
        ? { type: 'teamfight', questionIndex: 0, totalTeamfightQuestions: 3 }
        : { type: 'counter-fight' },
    }));
    setQuestionKey(k => k + 1);
  }, []);

  const phase = battle.phase;

  // Result transition
  if (phase.type === 'result' && battle.winner) {
    const result: BattleResult = {
      winner: battle.winner,
      playerHero: lineup.playerHero,
      allyHeroes: lineup.allyHeroes,
      enemyHeroes: [lineup.enemyLaning, lineup.enemyJungle, lineup.enemyTeamFight],
      kills: battle.kills,
      deaths: battle.deaths,
      assists: battle.assists,
      correctCount: battle.correctCount,
      totalCount: battle.totalCount,
      xpGained: battle.xpGained,
      laningResult: battle.laningResult === 'win' ? '对线优势' : '对线劣势',
      gankResult: battle.gankResult === 'escaped' ? '成功逃脱' : battle.gankResult === 'countered' ? '反打成功' : '被击杀',
      teamfightResult: battle.teamfightResult === 'perfect' ? '完美团战' : battle.teamfightResult === 'win' ? '团战胜利' : battle.teamfightResult === 'trade' ? '团战平局' : '团战失败',
      wrongQuestions: wrongAnswersRef.current,
      allAnsweredQuestions: allAnswersRef.current,
    };
    setTimeout(() => onEnd(result), 300);
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{battle.winner === 'player' ? '🏆' : '💀'}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{battle.winner === 'player' ? '胜利！' : '失败...'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>计算对局结果...</div>
        </div>
      </div>
    );
  }

  const getEventDescription = () => {
    if (phase.type === 'laning') {
      const ei = phase.eventIndex;
      if (ei === 0) return { desc: '对线补兵——使用 Q 技能补刀', skill: lineup.playerHero.skills.Q };
      if (ei === 1) return { desc: '敌方消耗——使用 W 技能防守', skill: lineup.playerHero.skills.W };
      return { desc: '1v1 单杀机会——使用 E 技能追击', skill: lineup.playerHero.skills.E };
    }
    if (phase.type === 'gank') return { desc: '打野来抓——使用 R 技能洞察全局', skill: lineup.playerHero.skills.R };
    if (phase.type === 'counter-fight') return { desc: '反打！使用 R 技能终结', skill: lineup.playerHero.skills.R };
    if (phase.type === 'teamfight') {
      const qi = phase.questionIndex;
      const labels = ['抢视野/站位', '躲关键控制', '集火目标'];
      return { desc: `团战——${labels[qi] || '团战操作'}`, skill: lineup.playerHero.skills[qi === 0 ? 'Q' : qi === 1 ? 'W' : 'E'] };
    }
    if (phase.type === 'highGround') return { desc: '高地防守——使用 W 技能坚守', skill: lineup.playerHero.skills.W };
    if (phase.type === 'finale') return { desc: '水晶终结——使用 R 技能终结比赛', skill: lineup.playerHero.skills.R };
    return { desc: '', skill: lineup.playerHero.skills.Q };
  };

  const eventInfo = getEventDescription();

  return (
    <div className="page" style={{ paddingBottom: 32 }}>
      {/* Phase Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="phase-badge">{getPhaseLabel(phase.type)}</span>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--gold)' }}>{battle.player.gold}G</span>
          <span style={{ color: 'var(--accent-green)' }}>{battle.correctCount}/{battle.totalCount}</span>
        </div>
      </div>

      {/* Player Status */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>
            {battle.player.heroName}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Lv.{battle.player.level} | {battle.kills}/{battle.deaths}/{battle.assists}
          </span>
        </div>
        <StatBar
          label="HP"
          current={battle.player.currentHP}
          max={battle.player.maxHP}
          color={battle.player.currentHP <= 30 ? 'var(--accent-red)' : 'var(--hp-bar)'}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>段位经验 +{battle.xpGained}</span>
          {battle.combo > 0 && <span style={{ color: 'var(--accent-purple)' }}>{getComboDisplay(battle.combo)}</span>}
        </div>
      </div>

      {/* Enemy Status (laning/gank) */}
      {(phase.type === 'laning' || phase.type === 'gank' || phase.type === 'counter-fight') && (
        <div className="card" style={{ borderLeft: '2px solid var(--accent-red)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>
            {battle.enemyLaning.heroName}
            {!battle.enemyLaning.isAlive && <span style={{ color: 'var(--accent-red)', marginLeft: 8 }}>已阵亡</span>}
          </div>
          {battle.enemyLaning.isAlive && (
            <StatBar
              label="HP"
              current={battle.enemyLaning.currentHP}
              max={battle.enemyLaning.maxHP}
              color="var(--accent-red)"
            />
          )}
          {phase.type === 'gank' && (
            <div style={{ marginTop: 4, fontSize: '0.8rem', color: 'var(--accent-orange)' }}>
              ⚠ {battle.enemyJungle.heroName}(打野) 正在路上
            </div>
          )}
        </div>
      )}

      {/* Teamfight - show full teams */}
      {(phase.type === 'teamfight') && (
        <div className="card">
          <TeamPanel title="我方阵容" members={[battle.player, ...battle.allies]} color="var(--accent-blue)" />
          <div style={{ height: 8 }} />
          <TeamPanel title="敌方阵容" members={[battle.enemyLaning, battle.enemyJungle, battle.enemyTeamFight]} color="var(--accent-red)" />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 6 }}>
            团战 第 {phase.questionIndex + 1}/{phase.totalTeamfightQuestions} 题
          </div>
        </div>
      )}

      {/* High Ground */}
      {(phase.type === 'highGround') && (
        <div className="card">
          <TeamPanel title="我方防守" members={[battle.player, ...battle.allies]} color="var(--accent-blue)" />
          <div style={{ height: 8 }} />
          <TeamPanel title="敌方进攻" members={[battle.enemyLaning, battle.enemyJungle, battle.enemyTeamFight]} color="var(--accent-red)" />
        </div>
      )}

      {/* Counter Choice */}
      {phase.type === 'counter-choice' && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
            成功发现打野！选择行动：
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => handleCounterChoice('retreat')} style={{ flex: 1 }}>
              🛡 撤退发育
            </button>
            <button className="btn btn-danger" onClick={() => handleCounterChoice('fight')} style={{ flex: 1 }}>
              ⚔ 尝试反打
            </button>
          </div>
        </div>
      )}

      {/* Event Description + Skill */}
      {answerState === 'waiting' && phase.type !== 'counter-choice' && (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', marginBottom: 12 }}>{eventInfo.desc}</div>
          <div className="skill-grid">
            {(['Q', 'W', 'E', 'R'] as const).map(k => (
              <SkillButton key={k} skill={lineup.playerHero.skills[k]} onUse={handleSkillUse} />
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            点击任意技能开始作答
          </div>
        </div>
      )}

      {/* Question */}
      {currentQuestion && answerState === 'answering' && (
        <QuestionCard
          key={currentQuestion.id + questionKey}
          question={currentQuestion}
          onAnswer={(correct, selectedAnswer, idx) => {
            handleAnswer(correct, selectedAnswer, idx);
          }}
          onContinue={handleContinue}
        />
      )}

      {/* Battle Log */}
      <BattleLog entries={battle.battleLog} />
    </div>
  );
}
