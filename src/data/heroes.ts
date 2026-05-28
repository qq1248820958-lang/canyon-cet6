import { Hero } from '../types';

export const heroes: Hero[] = [
  {
    id: 'yasuo',
    name: '亚索',
    title: '疾风剑豪',
    description: '连续答对可叠连击，连击越高伤害越高。',
  },
  {
    id: 'zed',
    name: '劫',
    title: '影流之主',
    description: '答题速度越快伤害越高，连击有额外加成。',
  },
  {
    id: 'lux',
    name: '拉克丝',
    title: '光辉女郎',
    description: '答对可控制敌人，适合远程消耗。',
  },
  {
    id: 'garen',
    name: '盖伦',
    title: '德玛西亚之力',
    description: '容错型英雄，答错惩罚较低，适合新手。',
  },
  {
    id: 'jinx',
    name: '金克丝',
    title: '暴走萝莉',
    description: '后期型英雄，前期积累连击后期伤害暴发。',
  },
  {
    id: 'thresh',
    name: '锤石',
    title: '魂锁典狱长',
    description: '辅助型英雄，团战保护队友，正确率影响团战结果。',
  },
  {
    id: 'yangxue',
    name: '杨雪',
    title: '雪落无声',
    description: '全能型英雄，答题全面均衡，无论对线、团战还是高地均有出色表现。',
  },
];

export function getHeroById(id: string): Hero | undefined {
  return heroes.find(h => h.id === id);
}

export function getHeroByName(name: string): Hero | undefined {
  return heroes.find(h => h.name === name);
}
