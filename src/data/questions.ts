import { Question } from '../types';

export const allQuestions: Question[] = [
  // ===== 15 六级词汇题 (vocabulary) =====
  {
    id: 'vocab_01',
    type: 'vocabulary',
    prompt: '"Ubiquitous" 最接近的意思是？',
    options: ['稀有的', '无处不在的', '危险的', '隐形的'],
    answer: 1,
    explanation: 'Ubiquitous 意为"无处不在的"，形容随处可见的事物。',
    sourceEvent: '对线补兵',
    difficulty: 2,
  },
  {
    id: 'vocab_02',
    type: 'vocabulary',
    prompt: '"Mitigate" 的意思是？',
    options: ['减轻、缓和', '恶化', '庆祝', '忽视'],
    answer: 0,
    explanation: 'Mitigate 意为"减轻、缓和"，指使某事物变得不那么严重。',
    sourceEvent: '对线消耗',
    difficulty: 2,
  },
  {
    id: 'vocab_03',
    type: 'vocabulary',
    prompt: '"Pragmatic" 形容一个人是？',
    options: ['情绪化的', '鲁莽的', '务实的', '理想主义的'],
    answer: 2,
    explanation: 'Pragmatic 意为"务实的、实用的"，注重实际效果而非理论。',
    sourceEvent: '对线补兵',
    difficulty: 2,
  },
  {
    id: 'vocab_04',
    type: 'vocabulary',
    prompt: '"Eloquent" 最接近的意思是？',
    options: ['有说服力的', '安静的', '笨拙的', '愤怒的'],
    answer: 0,
    explanation: 'Eloquent 意为"雄辩的、有说服力的"，指表达能力强。',
    sourceEvent: '1v1单杀',
    difficulty: 2,
  },
  {
    id: 'vocab_05',
    type: 'vocabulary',
    prompt: '"Ambiguous" 的意思是？',
    options: ['有多种含义的', '清晰的', '简单的', '美丽的'],
    answer: 0,
    explanation: 'Ambiguous 意为"模棱两可的、有多种含义的"。',
    sourceEvent: '对线补兵',
    difficulty: 1,
  },
  {
    id: 'vocab_06',
    type: 'vocabulary',
    prompt: '"Conspicuous" 的意思是？',
    options: ['隐藏的', '普通的', '引人注目的', '微小的'],
    answer: 2,
    explanation: 'Conspicuous 意为"引人注目的、显眼的"。',
    sourceEvent: '对线消耗',
    difficulty: 1,
  },
  {
    id: 'vocab_07',
    type: 'vocabulary',
    prompt: '"Diligent" 形容一个人是？',
    options: ['懒惰的', '勤奋的', '粗心的', '缓慢的'],
    answer: 1,
    explanation: 'Diligent 意为"勤奋的、勤勉的"。',
    sourceEvent: '对线补兵',
    difficulty: 1,
  },
  {
    id: 'vocab_08',
    type: 'vocabulary',
    prompt: '"Inevitable" 的意思是？',
    options: ['可避免的', '可选的', '不太可能的', '必然发生的'],
    answer: 3,
    explanation: 'Inevitable 意为"不可避免的、必然发生的"。',
    sourceEvent: '1v1单杀',
    difficulty: 1,
  },
  {
    id: 'vocab_09',
    type: 'vocabulary',
    prompt: '"Profound" 最接近的意思是？',
    options: ['浅薄的', '深刻的', '宽阔的', '狭窄的'],
    answer: 1,
    explanation: 'Profound 意为"深刻的、深远的"。',
    sourceEvent: '对线消耗',
    difficulty: 1,
  },
  {
    id: 'vocab_10',
    type: 'vocabulary',
    prompt: '"Resilient" 描述某物能？',
    options: ['容易破碎', '保持不变', '快速恢复', '消失不见'],
    answer: 2,
    explanation: 'Resilient 意为"有弹性的、快速恢复的"。',
    sourceEvent: '对线补兵',
    difficulty: 2,
  },
  {
    id: 'vocab_11',
    type: 'vocabulary',
    prompt: '"Skeptical" 的意思是？',
    options: ['信任的', '怀疑的', '确定的', '兴奋的'],
    answer: 1,
    explanation: 'Skeptical 意为"怀疑的、持怀疑态度的"。',
    sourceEvent: '1v1单杀',
    difficulty: 1,
  },
  {
    id: 'vocab_12',
    type: 'vocabulary',
    prompt: '"Tenacious" 形容一个人是？',
    options: ['轻易放弃的', '坚持不懈的', '困惑的', '虚弱的'],
    answer: 1,
    explanation: 'Tenacious 意为"坚韧的、坚持不懈的"。',
    sourceEvent: '对线消耗',
    difficulty: 2,
  },
  {
    id: 'vocab_13',
    type: 'vocabulary',
    prompt: '"Vulnerable" 的意思是？',
    options: ['受保护的', '强大的', '易受伤害的', '隐形的'],
    answer: 2,
    explanation: 'Vulnerable 意为"易受伤害的、脆弱的"。',
    sourceEvent: '对线补兵',
    difficulty: 1,
  },
  {
    id: 'vocab_14',
    type: 'vocabulary',
    prompt: '"Whimsical" 形容某事物是？',
    options: ['严肃的', '反复无常的', '危险的', '无聊的'],
    answer: 1,
    explanation: 'Whimsical 意为"异想天开的、反复无常的"。',
    sourceEvent: '对线消耗',
    difficulty: 2,
  },
  {
    id: 'vocab_15',
    type: 'vocabulary',
    prompt: '"Zealous" 的意思是？',
    options: ['冷漠的', '热情的', '懒惰的', '冷静的'],
    answer: 1,
    explanation: 'Zealous 意为"热情的、狂热的"。',
    sourceEvent: '1v1单杀',
    difficulty: 2,
  },

  // ===== 8 短句理解题 (sentence) =====
  {
    id: 'sent_01',
    type: 'sentence',
    prompt: '"The experiment\'s results were inconclusive, prompting the research team to redesign their methodology." 这句话的意思是？',
    options: ['实验完全成功。', '团队需要改变方法。', '方法论很完美。', '结果立即发表了。'],
    answer: 1,
    explanation: 'Inconclusive 意为"非决定性的"，因此需要重新设计方法。',
    sourceEvent: '敌方消耗',
    difficulty: 2,
  },
  {
    id: 'sent_02',
    type: 'sentence',
    prompt: '"Despite the economic downturn, the company managed to remain profitable through strategic cost-cutting." 这意味着？',
    options: ['公司破产了。', '经济形势好转了。', '公司保持了盈利。', '削减成本失败了。'],
    answer: 2,
    explanation: 'Despite 表示让步，"尽管经济下行，公司仍保持盈利"。',
    sourceEvent: '对线补兵',
    difficulty: 2,
  },
  {
    id: 'sent_03',
    type: 'sentence',
    prompt: '"The professor\'s lecture on quantum mechanics was so abstruse that most students left feeling bewildered." 可以推断出？',
    options: ['讲座很容易理解。', '学生觉得讲座很清晰。', '讲座非常难懂。', '教授教得不好。'],
    answer: 2,
    explanation: 'Abstruse 意为"深奥难懂的"，bewildered 意为"困惑的"。',
    sourceEvent: '敌方消耗',
    difficulty: 2,
  },
  {
    id: 'sent_04',
    type: 'sentence',
    prompt: '"The new policy was implemented to preempt potential security breaches rather than to address existing ones." 政策实施的原因是？',
    options: ['解决当前问题。', '预防未来问题。', '制造安全问题。', '替换旧政策。'],
    answer: 1,
    explanation: 'Preempt 意为"预先阻止"，而不是解决现有问题。',
    sourceEvent: '1v1单杀',
    difficulty: 2,
  },
  {
    id: 'sent_05',
    type: 'sentence',
    prompt: '"The correlation between exercise and mental health is well-documented, yet many people remain sedentary." 这句话暗示？',
    options: ['运动对心理健康没影响。', '大多数人经常运动。', '人们知道运动有益却不行动。', '心理健康不重要。'],
    answer: 2,
    explanation: 'Yet 表转折，"尽管有充分证据，许多人仍久坐不动"。',
    sourceEvent: '敌方消耗',
    difficulty: 2,
  },
  {
    id: 'sent_06',
    type: 'sentence',
    prompt: '"The artist\'s work, though critically acclaimed, failed to garner commercial success during his lifetime." 这意味着？',
    options: ['艺术家既获评论界好评又有商业成功。', '作品取得了商业成功。', '评论界和消费者都不接受作品。', '艺术家生前商业上不成功。'],
    answer: 3,
    explanation: '"Though critically acclaimed" = 虽然获好评，"failed to garner commercial success" = 未能获得商业成功。',
    sourceEvent: '1v1单杀',
    difficulty: 2,
  },
  {
    id: 'sent_07',
    type: 'sentence',
    prompt: '"The negotiations reached an impasse when neither party was willing to compromise." 发生了什么？',
    options: ['谈判成功了。', '双方都妥协了。', '谈判陷入僵局。', '一方让步了。'],
    answer: 2,
    explanation: 'Impasse 意为"僵局、死路"，双方都不愿妥协导致谈判停滞。',
    sourceEvent: '敌方消耗',
    difficulty: 2,
  },
  {
    id: 'sent_08',
    type: 'sentence',
    prompt: '"The phenomenon of globalization has raised concerns about cultural homogenization." 提到的负面问题是？',
    options: ['文化交流', '全球化本身', '文化同质化', '前所未有的程度'],
    answer: 2,
    explanation: 'Homogenization 意为"同质化"，指文化变得单一的担忧。',
    sourceEvent: '对线补兵',
    difficulty: 2,
  },

  // ===== 3 打野短阅读题 (shortReading) =====
  {
    id: 'gank_01',
    type: 'shortReading',
    prompt: '阅读下文回答问题：\n\n"Climate change poses a significant threat to global biodiversity. Rising temperatures have forced many species to migrate to higher latitudes or elevations. However, the speed of climate change often exceeds the adaptive capacity of many organisms, particularly those with limited dispersal abilities."\n\n根据文章，为什么有些物种特别脆弱？',
    options: ['它们喜欢更暖的温度。', '它们不容易迁移到新栖息地。', '它们已经适应了气候变化。', '保护措施太有效了。'],
    answer: 1,
    explanation: '"Limited dispersal abilities" = 有限的扩散能力，指它们不容易迁移。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    id: 'gank_02',
    type: 'shortReading',
    prompt: '阅读下文回答问题：\n\n"The concept of \'digital natives\' refers to those who grew up in the digital age. While often characterized as intuitively skilled with technology, research suggests their competence is largely limited to communication and entertainment. When it comes to critical evaluation of online information, digital natives often show significant gaps."\n\n研究揭示了关于数字原住民的什么？',
    options: ['他们擅长所有类型的技术。', '他们在通讯应用上很挣扎。', '他们的技术能力局限于某些领域。', '他们很了解隐私问题。'],
    answer: 2,
    explanation: '研究显示他们的能力"largely limited to communication and entertainment"（主要局限于通讯和娱乐）。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    id: 'gank_03',
    type: 'shortReading',
    prompt: '阅读下文回答问题：\n\n"Urban green spaces play a crucial role in mitigating the urban heat island effect. Studies show that well-designed green infrastructure can lower city temperatures by up to 4°C, reducing energy consumption for cooling and improving air quality. However, the distribution of green spaces is often unequal, with lower-income neighborhoods having significantly less access."\n\n除了降温，文章还提到了城市绿地的什么好处？',
    options: ['提高房产价值。', '改善空气质量。', '提供更多停车位。', '改善网络连接。'],
    answer: 1,
    explanation: '"Improving air quality"（改善空气质量）是提到的另一个好处。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },

  // ===== 2 个阅读题组 (readingGroup) × 3 题 =====
  // 阅读组 1
  {
    id: 'rg1_q1',
    type: 'readingGroup',
    groupId: 'rg1',
    passage: '阅读下面文章，回答3个问题：\n\n"Artificial intelligence (AI) has transformed various sectors, from healthcare to finance. In medicine, AI algorithms can analyze medical images with accuracy comparable to or exceeding human experts. Machine learning models can predict patient outcomes based on vast amounts of clinical data. In the financial sector, AI systems detect fraudulent transactions in real-time. Despite these advances, concerns about job displacement and ethical implications of AI decision-making continue to spark debate. Critics argue that AI systems can perpetuate existing biases present in training data, leading to unfair outcomes. Proponents counter that with proper regulation, AI can augment human capabilities rather than replace them."',
    prompt: 'AI在医学领域展示了什么能力？',
    options: ['完全取代医生。', '准确分析医学影像。', '降低医疗成本。', '消除医疗错误。'],
    answer: 1,
    explanation: '文中提到AI可以"analyze medical images with accuracy comparable to or exceeding human experts"。',
    sourceEvent: '小龙团战',
    difficulty: 2,
  },
  {
    id: 'rg1_q2',
    type: 'readingGroup',
    groupId: 'rg1',
    passage: '',
    prompt: '文中提到的对AI的担忧是什么？',
    options: ['实施成本太高。', '无法处理足够数据。', '可能延续现有偏见。', '准确度不够。'],
    answer: 2,
    explanation: '批评者认为AI系统可能"perpetuate existing biases present in training data"。',
    sourceEvent: '小龙团战',
    difficulty: 2,
  },
  {
    id: 'rg1_q3',
    type: 'readingGroup',
    groupId: 'rg1',
    passage: '',
    prompt: '支持者认为AI应该怎样？',
    options: ['严格限制AI发展。', '增强人类能力。', '取代所有工作。', '太危险不能使用。'],
    answer: 1,
    explanation: '支持者认为AI可以"augment human capabilities rather than replace them"（增强而非取代人类能力）。',
    sourceEvent: '小龙团战',
    difficulty: 2,
  },

  // 阅读组 2
  {
    id: 'rg2_q1',
    type: 'readingGroup',
    groupId: 'rg2',
    passage: '阅读下面文章，回答3个问题：\n\n"The sharing economy has fundamentally altered how people access goods and services. Platforms like Uber and Airbnb have enabled individuals to monetize their assets and skills. This economic model emphasizes access over ownership, allowing consumers to use products without the burden of full ownership. Proponents argue that the sharing economy promotes resource efficiency and creates income opportunities. However, critics raise concerns about labor rights, as many platform workers are classified as independent contractors rather than employees. Regulatory frameworks have struggled to keep pace with the rapid growth of these platforms, leading to legal ambiguities."',
    prompt: '共享经济的一个关键特征是什么？',
    options: ['强调所有权。', '注重使用权而非所有权。', '取代所有传统服务。', '受到严格监管。'],
    answer: 1,
    explanation: '文中说共享经济"emphasizes access over ownership"（强调使用权而非所有权）。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },
  {
    id: 'rg2_q2',
    type: 'readingGroup',
    groupId: 'rg2',
    passage: '',
    prompt: '文章指出了什么劳工问题？',
    options: ['工人收入太高。', '工人缺乏雇员保护。', '雇员太多。', '工人更喜欢独立合同。'],
    answer: 1,
    explanation: '许多平台工人被归类为独立承包商而非雇员，缺乏劳动保护。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },
  {
    id: 'rg2_q3',
    type: 'readingGroup',
    groupId: 'rg2',
    passage: '',
    prompt: '为什么监管落后于发展？',
    options: ['平台是非法的。', '经济正在萎缩。', '平台增长太快了。', '没有工人。'],
    answer: 2,
    explanation: '"Regulatory frameworks have struggled to keep pace with the rapid growth"（监管框架难以跟上快速增长）。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },

  // ===== 3 翻译/长句理解题 (translation) =====
  {
    id: 'trans_01',
    type: 'translation',
    prompt: '理解并翻译：\n\n"The rapid advancement of technology has rendered many traditional skills obsolete, necessitating continuous learning and adaptation in the modern workforce."\n\n这段话的核心意思是？',
    options: ['技术让传统技能变得不再需要。', '传统技能比以往更重要。', '职场应该拒绝技术。', '学习不再重要。'],
    answer: 0,
    explanation: '"Rendered many traditional skills obsolete" = 使许多传统技能变得过时。',
    sourceEvent: '高地防守',
    difficulty: 3,
  },
  {
    id: 'trans_02',
    type: 'translation',
    prompt: '理解并翻译：\n\n"It is widely acknowledged that a healthy lifestyle, characterized by balanced nutrition and regular physical activity, significantly reduces the risk of chronic diseases."\n\n这句话强调了什么？',
    options: ['慢性病无法避免。', '仅靠均衡饮食就能预防疾病。', '健康生活方式降低疾病风险。', '体育活动比饮食更重要。'],
    answer: 2,
    explanation: '核心信息是"healthy lifestyle significantly reduces the risk of chronic diseases"。',
    sourceEvent: '水晶终结',
    difficulty: 2,
  },
  {
    id: 'trans_03',
    type: 'translation',
    prompt: '理解并翻译：\n\n"The university\'s commitment to fostering critical thinking skills among students is evident in its curriculum design, which emphasizes analytical reasoning and independent research."\n\n关于这所大学，这段话暗示了什么？',
    options: ['只注重研究。', '在课程中优先培养批判性思维。', '不鼓励独立思考。', '重视记忆胜过分析。'],
    answer: 1,
    explanation: '"Commitment to fostering critical thinking" = 致力于培养批判性思维。',
    sourceEvent: '水晶终结',
    difficulty: 3,
  },
];

export function getQuestionsByType(type: Question['type']): Question[] {
  return allQuestions.filter(q => q.type === type);
}

export function getReadingGroupQuestions(groupId: string): Question[] {
  return allQuestions.filter(q => q.groupId === groupId);
}

export function getQuestionsForEvent(eventType: string): Question[] {
  switch (eventType) {
    case 'laning-lasthit':
      return allQuestions.filter(q => q.type === 'vocabulary' && q.sourceEvent === '对线补兵');
    case 'laning-poke':
      return allQuestions.filter(q => q.type === 'sentence' && q.sourceEvent === '敌方消耗');
    case 'laning-kill':
      return allQuestions.filter(q =>
        (q.type === 'vocabulary' || q.type === 'sentence') && q.sourceEvent === '1v1单杀'
      );
    case 'gank':
      return allQuestions.filter(q => q.type === 'shortReading' && q.sourceEvent === '打野来抓');
    case 'teamfight-dragon':
      return getReadingGroupQuestions('rg1');
    case 'highground':
      return allQuestions.filter(q => q.type === 'translation' && q.sourceEvent === '高地防守');
    case 'finale':
      return allQuestions.filter(q => q.type === 'translation' && q.sourceEvent === '水晶终结');
    default:
      return allQuestions;
  }
}
