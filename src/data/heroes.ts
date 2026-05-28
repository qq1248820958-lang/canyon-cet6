import { Hero } from '../types';

export const heroes: Hero[] = [
  {
    id: 'yasuo',
    name: '亚索',
    title: '疾风剑豪',
    role: '连击反打型',
    description: '连续答对单词题可叠风，有风状态时大招可触发反杀判定。',
    skills: {
      Q: { key: 'Q', name: '斩钢闪', type: '单词题', description: '答对叠一层风。连续答对3个Q叠满获得"风"状态。', cooldown: 0 },
      W: { key: 'W', name: '风之障壁', type: '短句理解题', description: '答对挡技能，减少伤害。', cooldown: 1 },
      E: { key: 'E', name: '踏前斩', type: '快速词义题', description: '答对位移逃跑或追击。', cooldown: 0 },
      R: { key: 'R', name: '狂风绝息斩', type: '阅读题', description: '有"风"状态时答对可反杀终结。', cooldown: 2 },
    },
    specialMechanic: '连续答对3个Q单词题获得"风"状态，风状态下R可触发反杀判定。',
    difficulty: 2,
  },
  {
    id: 'zed',
    name: '劫',
    title: '影流之主',
    role: '限时爆发型',
    description: '答题速度越快伤害越高，R需要连续答对两题，答错反噬更明显。',
    skills: {
      Q: { key: 'Q', name: '影镖', type: '词汇题', description: '答对造成伤害，速度越快伤害越高。', cooldown: 0 },
      W: { key: 'W', name: '影分身', type: '短句理解题', description: '答对换位躲技能。', cooldown: 1 },
      E: { key: 'E', name: '鬼斩', type: '限时词义题', description: '答对消耗敌人。', cooldown: 0 },
      R: { key: 'R', name: '禁奥义·瞬狱影杀阵', type: '限时两连题', description: '连续答对两题完成击杀。', cooldown: 2 },
    },
    specialMechanic: '答题速度越快伤害越高。R需要连续答对两题。答错反噬更明显。',
    difficulty: 3,
  },
  {
    id: 'lux',
    name: '拉克丝',
    title: '光辉女郎',
    role: '控制消耗型',
    description: 'Q答对后下一次技能命中率提高，W答对获得护盾，R适合低血量收割。',
    skills: {
      Q: { key: 'Q', name: '光之束缚', type: '短句理解题', description: '答对控制敌人。', cooldown: 1 },
      W: { key: 'W', name: '曲光屏障', type: '防御题', description: '答对获得护盾，减少失败惩罚。', cooldown: 1 },
      E: { key: 'E', name: '透光奇点', type: '词汇题', description: '答对远程消耗敌人。', cooldown: 0 },
      R: { key: 'R', name: '终极闪光', type: '阅读主旨题', description: '答对远程收割低血量敌人。', cooldown: 2 },
    },
    specialMechanic: 'Q答对后下一次技能命中率提高。W答对减少失败惩罚。',
    difficulty: 1,
  },
  {
    id: 'garen',
    name: '盖伦',
    title: '德玛西亚之力',
    role: '新手容错型',
    description: '答错惩罚比其他英雄低，W答对可以抵消部分伤害，适合上手。',
    skills: {
      Q: { key: 'Q', name: '致命打击', type: '基础单词题', description: '答对造成伤害，答错惩罚较低。', cooldown: 0 },
      W: { key: 'W', name: '勇气', type: '防御题', description: '答对减伤。', cooldown: 1 },
      E: { key: 'E', name: '审判', type: '连续词汇题', description: '答对多段伤害。', cooldown: 0 },
      R: { key: 'R', name: '德玛西亚正义', type: '判断题', description: '敌方低血量时答对斩杀。', cooldown: 2 },
    },
    specialMechanic: '答错惩罚比其他英雄低30%。适合新手。',
    difficulty: 1,
  },
  {
    id: 'jinx',
    name: '金克丝',
    title: '暴走萝莉',
    role: '后期收割型',
    description: '前期答对补兵题叠攻速，后期团战伤害高。团战连续答对可触发收割。',
    skills: {
      Q: { key: 'Q', name: '鱼骨头', type: '单词补兵题', description: '答对叠攻速，增加后期伤害。', cooldown: 0 },
      W: { key: 'W', name: '震荡电磁波', type: '短句理解题', description: '答对远程消耗。', cooldown: 1 },
      E: { key: 'E', name: '嚼火者', type: '防守题', description: '答对摆脱突进。', cooldown: 1 },
      R: { key: 'R', name: '超究极死神飞弹', type: '阅读题', description: '答对远程收割。', cooldown: 2 },
    },
    specialMechanic: '前期答对Q次数影响后期团战伤害。团战连续答对触发收割。前期较弱后期强。',
    difficulty: 2,
  },
  {
    id: 'thresh',
    name: '锤石',
    title: '魂锁典狱长',
    role: '阅读辅助型',
    description: '团战可通过答题保护队友，阅读题答对时团战结果加成。',
    skills: {
      Q: { key: 'Q', name: '死亡判决', type: '阅读定位题', description: '答对命中钩子。', cooldown: 1 },
      W: { key: 'W', name: '魂引之灯', type: '救援题', description: '答对保护队友。', cooldown: 1 },
      E: { key: 'E', name: '厄运钟摆', type: '选项陷阱题', description: '答对打断敌人。', cooldown: 0 },
      R: { key: 'R', name: '幽冥监牢', type: '团战阅读题', description: '正确率决定团战结果加成。', cooldown: 2 },
    },
    specialMechanic: '阅读题正确率高时团战结果获得加成。适合阅读能力强的玩家。',
    difficulty: 2,
  },
];

export function getHeroById(id: string): Hero | undefined {
  return heroes.find(h => h.id === id);
}

export function getHeroByName(name: string): Hero | undefined {
  return heroes.find(h => h.name === name);
}
