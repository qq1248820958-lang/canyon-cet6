// Generate vocabulary questions with English options for the built-in question pool
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WORD_LIST = [
  ["abstract", "抽象的，理论上的"],
  ["academy", "学院，研究院"],
  ["accumulate", "积累，积聚"],
  ["acquisition", "获得，习得"],
  ["administer", "管理，执行"],
  ["adolescent", "青少年，青春期的"],
  ["agenda", "议程，日程"],
  ["aggravate", "加重，恶化"],
  ["allege", "声称，断言"],
  ["allocate", "分配，拨出"],
  ["alternative", "替代的，选择"],
  ["altitude", "高度，海拔"],
  ["amaze", "使惊奇，使惊愕"],
  ["ambassador", "大使，使节"],
  ["anniversary", "周年纪念日"],
  ["anonymous", "匿名的，无名的"],
  ["apparatus", "设备，仪器"],
  ["appetite", "食欲，胃口"],
  ["applaud", "鼓掌，称赞"],
  ["applicable", "适用的，合适的"],
  ["appraisal", "评价，估价"],
  ["arbitrary", "任意的，武断的"],
  ["architecture", "建筑学，建筑风格"],
  ["arithmetic", "算术，计算"],
  ["arouse", "唤醒，激起"],
  ["articulate", "清晰表达，善于表达的"],
  ["ascend", "上升，攀登"],
  ["aspiration", "渴望，志向"],
  ["assault", "攻击，袭击"],
  ["assurance", "保证，保险"],
  ["astronomy", "天文学"],
  ["attendance", "出席，出勤"],
  ["attribute", "属性，归因于"],
  ["authentic", "真正的，正宗的"],
  ["automate", "使自动化"],
  ["auxiliary", "辅助的，备用的"],
  ["avenue", "大街，途径"],
  ["aviation", "航空，飞行"],
  ["bachelor", "学士，单身汉"],
  ["banner", "横幅，旗帜"],
  ["barren", "贫瘠的，不毛的"],
  ["bearing", "关系，方位"],
  ["beforehand", "事先，预先"],
  ["beneath", "在…下方"],
  ["benevolent", "仁慈的，慈善的"],
  ["betray", "背叛，泄露"],
  ["bewilder", "使迷惑，使困惑"],
  ["bias", "偏见，偏差"],
  ["biological", "生物的，生物学的"],
  ["bizarre", "奇异的，怪诞的"],
  ["blaze", "火焰，燃烧"],
  ["bloom", "开花，繁盛"],
  ["blueprint", "蓝图，计划"],
  ["blunder", "大错，犯错误"],
  ["bonus", "奖金，红利"],
  ["boom", "繁荣，激增"],
  ["bother", "打扰，烦恼"],
  ["bounce", "反弹，弹跳"],
  ["bound", "界限，限制"],
  ["brand", "品牌，商标"],
  ["breach", "违反，突破"],
  ["breakthrough", "突破，重大发现"],
  ["breed", "繁殖，饲养"],
  ["bribe", "贿赂，行贿"],
  ["brief", "简短的，摘要"],
  ["brink", "边缘"],
  ["broaden", "加宽，扩大"],
  ["bronze", "青铜，古铜色"],
  ["bruise", "瘀伤，擦伤"],
  ["brutal", "残忍的，野蛮的"],
  ["bubble", "气泡，泡沫"],
  ["bucket", "水桶，桶"],
  ["bud", "芽，花蕾"],
  ["bulk", "体积，大批"],
  ["bulletin", "公告，公报"],
  ["bunch", "束，串，群"],
  ["bureau", "局，办事处"],
  ["cabinet", "内阁，橱柜"],
  ["cable", "电缆，有线电视"],
  ["calendar", "日历，日程表"],
  ["calorie", "卡路里"],
  ["campus", "校园，校区"],
  ["canal", "运河，水道"],
  ["candidate", "候选人，应试者"],
  ["capable", "有能力的，能干的"],
  ["cape", "海角，披肩"],
  ["captive", "俘虏，被俘的"],
  ["cargo", "货物，船货"],
  ["carrier", "运输工具，载体"],
  ["cashier", "收银员，出纳员"],
  ["catalog", "目录，编目"],
  ["category", "类别，种类"],
  ["cautious", "谨慎的，小心的"],
  ["cease", "停止，终止"],
  ["census", "人口普查，统计"],
  ["certificate", "证书，证明"],
  ["chamber", "房间，室"],
  ["character", "性格，角色"],
  ["charity", "慈善，施舍"],
  ["charm", "魅力，吸引力"],
  ["charter", "宪章，特许"],
  ["chase", "追逐，追赶"],
  ["cherish", "珍爱，珍惜"],
  ["chief", "主要的，首领"],
  ["childhood", "童年，幼年"],
  ["chill", "寒冷，寒意"],
  ["chip", "碎片，芯片"],
  ["choke", "窒息，阻塞"],
  ["chop", "砍，剁碎"],
  ["circuit", "电路，环行"],
  ["circular", "圆形的，循环的"],
  ["circulate", "循环，流通"],
  ["cite", "引用，引证"],
  ["citizen", "公民，市民"],
  ["civil", "公民的，文明的"],
  ["claim", "声称，要求"],
  ["clarify", "澄清，阐明"],
  ["clash", "冲突，碰撞"],
  ["classic", "经典的，典型的"],
  ["clause", "条款，从句"],
  ["client", "客户，委托人"],
  ["cliff", "悬崖，峭壁"],
  ["climate", "气候，风气"],
  ["cling", "坚持，依附"],
  ["clinic", "诊所，门诊部"],
  ["clip", "剪辑，夹子"],
  ["cluster", "集群，聚集"],
  ["coach", "教练，长途汽车"],
  ["coarse", "粗糙的，粗劣的"],
  ["cognitive", "认知的，认识的"],
  ["coherent", "连贯的，一致的"],
  ["coincide", "同时发生，巧合"],
  ["collaborate", "合作，协作"],
  ["colleague", "同事，同僚"],
  ["collective", "集体的，共同的"],
  ["collision", "碰撞，冲突"],
  ["colonial", "殖民的，殖民地的"],
  ["combat", "战斗，与…战斗"],
  ["comet", "彗星"],
  ["commemorate", "纪念，庆祝"],
  ["commence", "开始，着手"],
  ["comment", "评论，意见"],
  ["commerce", "商业，贸易"],
  ["commission", "委员会，佣金"],
  ["commodity", "商品，货物"],
  ["commonplace", "平凡的，常见的"],
  ["communal", "公共的，社区的"],
  ["compact", "紧凑的，简洁的"],
  ["comparable", "可比较的，类似的"],
  ["compassion", "同情，怜悯"],
  ["compatible", "兼容的，相容的"],
  ["compel", "强迫，迫使"],
  ["compensate", "补偿，赔偿"],
  ["competence", "能力，胜任"],
  ["compile", "编译，汇编"],
  ["complement", "补充，互补"],
  ["complexion", "肤色，局面"],
  ["compliance", "服从，遵守"],
  ["compliment", "赞美，恭维"],
  ["comply", "遵从，服从"],
  ["compose", "组成，创作"],
  ["compound", "化合物，复合的"],
  ["comprehension", "理解，理解力"],
  ["compress", "压缩，精简"],
  ["comprise", "包括，由…组成"],
  ["compulsory", "强制的，必修的"],
  ["conceal", "隐藏，隐瞒"],
  ["concede", "承认，让步"],
  ["conceive", "构思，设想"],
  ["conception", "概念，观念"],
  ["concise", "简明的，简洁的"],
  ["condemn", "谴责，判刑"],
  ["condense", "浓缩，压缩"],
  ["confer", "授予，商议"],
  ["confine", "限制，禁闭"],
  ["conform", "符合，遵守"],
  ["confrontation", "对抗，冲突"],
  ["congress", "国会，代表大会"],
  ["conjunction", "连接，结合"],
  ["conquer", "征服，克服"],
  ["conscience", "良心，良知"],
  ["conscientious", "认真的，尽责的"],
  ["consecutive", "连续的，连贯的"],
  ["consensus", "共识，一致意见"],
  ["consent", "同意，允许"],
  ["conservation", "保护，保存"],
  ["considerate", "体贴的，考虑周到的"],
  ["consistent", "一致的，始终如一的"],
  ["consolidate", "巩固，合并"],
  ["conspicuous", "显眼的，引人注目的"],
  ["constitute", "组成，构成"],
  ["constrain", "约束，限制"],
  ["consult", "咨询，查阅"],
  ["contemplate", "沉思，冥想"],
  ["contemporary", "当代的，同时代的"],
  ["contempt", "轻视，蔑视"],
  ["contend", "竞争，主张"],
  ["continent", "大陆，洲"],
  ["contradict", "矛盾，反驳"],
  ["controversial", "有争议的"],
  ["convenience", "方便，便利"],
  ["conventional", "传统的，惯例的"],
  ["converge", "汇聚，集中"],
  ["conversely", "相反地"],
  ["convert", "转换，转变"],
  ["convey", "传达，运输"],
  ["convict", "定罪，证明…有罪"],
  ["conviction", "信念，定罪"],
  ["coordinate", "协调，坐标"],
  ["copyright", "版权，著作权"],
  ["cordial", "热情的，真诚的"],
  ["corporate", "公司的，法人的"],
  ["correlate", "相关，关联"],
  ["correspondence", "通信，信件"],
  ["corridor", "走廊，通道"],
  ["corrode", "腐蚀，侵蚀"],
  ["corrupt", "腐败的，贪污的"],
  ["costume", "服装，戏服"],
  ["council", "委员会，理事会"],
  ["counterpart", "对应的人或物"],
  ["courtesy", "礼貌，好意"],
  ["coverage", "覆盖范围，报道"],
  ["crack", "裂缝，破裂"],
  ["cradle", "摇篮，发源地"],
  ["craft", "工艺，手艺"],
  ["crash", "碰撞，坠毁"],
  ["credible", "可信的，可靠的"],
  ["crisis", "危机，紧要关头"],
  ["criterion", "标准，准则"],
  ["critical", "批判的，关键的"],
  ["crown", "王冠，皇冠"],
  ["crucial", "关键的，决定性的"],
  ["crude", "粗糙的，天然的"],
  ["cruise", "巡航，游轮"],
  ["crush", "压碎，压碎"],
  ["crystal", "水晶，晶体"],
  ["cubic", "立方的，立方体的"],
  ["cuisine", "烹饪，菜肴"],
  ["cultivate", "培养，耕作"],
  ["curb", "抑制，控制"],
  ["curiosity", "好奇心，求知欲"],
  ["currency", "货币，流通"],
  ["curriculum", "课程，全部课程"],
  ["curse", "诅咒，咒骂"],
  ["curve", "曲线，弯曲"],
  ["cushion", "垫子，缓冲"],
  ["custody", "监护，拘留"],
  ["cycle", "循环，周期"],
  ["cynical", "愤世嫉俗的"],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Two directions of questions:
// Direction 1: English word → meaning (options are English short definitions)
// Direction 2: Chinese definition → English word (options are English words)

function generateDirection1(list, count = 100) {
  // For direction 1, we need English short definitions as options
  // We'll use the English word itself as the correct concept being tested
  // and other English words as distractors
  const selected = shuffle(list).slice(0, count);
  const questions = [];

  for (let i = 0; i < selected.length; i++) {
    const [word, def] = selected[i];
    const others = list.filter(w => w[0] !== word).map(w => w[0]);
    const wrongDefs = shuffle(others).slice(0, 3);

    // For direction 1: "word" 最接近的意思是？
    // Options: use other English words from the list as distractors
    // But we need the correct answer to be a SYNONYM in English
    // Since we don't have synonyms, we use the word itself as correct,
    // but phrase it as: options include the word + 3 other English words

    // Actually, let's use this format:
    // Prompt: Chinese definition → pick the right English word
    // But we already do that in direction 2

    // For direction 1, let's use: "word" — which definition matches?
    // Options: short English meaning descriptions

    // We'll construct the correct option as the Chinese def (the user wants English options)
    // So let's use the English word as the correct option with 3 other English words as distractors
    // Prompt format: "word" 最接近的意思是？
    // But the options are English words... this only works if the answer IS the word itself

    // BETTER: Chinese definition → English word
    // We handle this in direction 2

    // For direction 1 variety: English word → pick English synonym
    // We'll pick from words that have close relationships

    // Skip direction 1 — use direction 2 exclusively for generated questions
  }

  return questions;
}

function generateDirection2(list, count = 200) {
  // Format: 选择与"${chinese_def}"对应的英文单词：
  // Options: 4 English words (1 correct + 3 random)
  const selected = shuffle(list).slice(0, count);
  const questions = [];
  const sourceEvents = ['对线补兵', '敌方消耗', '1v1单杀'];

  for (let i = 0; i < selected.length; i++) {
    const [word, def] = selected[i];
    const others = list.filter(w => w[0] !== word).map(w => w[0]);
    const wrongWords = shuffle(others).slice(0, 3);
    const allOptions = shuffle([word, ...wrongWords]);
    const correctIndex = allOptions.indexOf(word);

    questions.push({
      id: `vocab_gen_${String(i + 1).padStart(3, '0')}`,
      type: 'vocabulary',
      prompt: `选择与「${def}」对应的英文单词：`,
      options: allOptions,
      answer: correctIndex,
      explanation: `${word} 意为「${def}」。`,
      sourceEvent: sourceEvents[i % 3],
      difficulty: i % 10 === 0 ? 3 : i % 5 === 0 ? 2 : 1,
    });
  }

  return questions;
}

// Generate 200 vocabulary questions (Direction 2: Chinese definition → English word)
const questions = generateDirection2(WORD_LIST, 200);

// Write TypeScript file
function escapeJS(str) {
  // Escape backslashes, backticks, and dollar signs for template literals
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

const lines = [
  '// Auto-generated vocabulary questions (200 total, English options format)',
  '// Generated by scripts/generate-vocab.mjs',
  'import { Question } from \'../types\';',
  '',
  'export const generatedQuestions: Question[] = [',
];

for (const q of questions) {
  lines.push('  {');
  lines.push(`    id: '${escapeJS(q.id)}',`);
  lines.push(`    type: 'vocabulary',`);
  lines.push(`    prompt: \`${escapeJS(q.prompt)}\`,`);
  lines.push(`    options: ${JSON.stringify(q.options)},`);
  lines.push(`    answer: ${q.answer},`);
  lines.push(`    explanation: \`${escapeJS(q.explanation)}\`,`);
  lines.push(`    sourceEvent: '${escapeJS(q.sourceEvent)}',`);
  lines.push(`    difficulty: ${q.difficulty}`);
  lines.push('  },');
}

lines.push('];');
lines.push('');

const content = lines.join('\n');
const outputPath = join(__dirname, '..', 'src', 'data', 'generated-questions.ts');
writeFileSync(outputPath, content, 'utf-8');
console.log(`Generated ${questions.length} vocabulary questions → ${outputPath}`);
