// Generate CET-6 exam-style remote question packs with all question types
// Produces original content mimicking real CET-6 exam format
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = join(__dirname, '..', 'question-packs');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============== SENTENCE QUESTIONS (sentence type) ==============
const SENTENCE_POOL = [
  // --- Technology & AI ---
  { prompt: '"The integration of artificial intelligence into healthcare diagnostics has significantly improved early detection rates of various diseases, though concerns about data privacy remain paramount." 这句话说明了什么？', options: ['AI has fully resolved all healthcare issues.', 'AI improves early disease detection but raises privacy concerns.', 'Data privacy is no longer a concern in healthcare.', 'AI diagnostics are less effective than traditional methods.'], answer: 1, explanation: '"Improved early detection rates...concerns about data privacy remain paramount" = 提高了早期检测率，但数据隐私仍是首要问题。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The proliferation of smartphones has fundamentally altered consumer behavior, with mobile commerce now accounting for a substantial portion of global retail transactions." 这意味着？', options: ['Smartphones have had minimal impact on shopping.', 'Mobile commerce represents a significant share of retail.', 'Physical stores are completely obsolete.', 'Consumers prefer desktop computers for shopping.'], answer: 1, explanation: '"Mobile commerce now accounting for a substantial portion of global retail transactions" = 移动商务占全球零售交易的很大一部分。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"Despite the remarkable advances in autonomous vehicle technology, widespread adoption remains hindered by regulatory hurdles, infrastructure limitations, and public skepticism about safety." 自动驾驶汽车面临什么问题？', options: ['The technology is not advanced enough.', 'Regulatory, infrastructure, and safety concerns hinder adoption.', 'No cars are currently autonomous.', 'The public fully trusts the technology.'], answer: 1, explanation: '"Hindered by regulatory hurdles, infrastructure limitations, and public skepticism" = 受到监管障碍、基础设施限制和公众质疑的阻碍。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The digital divide refers not merely to access to technology but also to the skills and literacy necessary to effectively utilize digital resources in an increasingly connected world." 数字鸿沟的本质是？', options: ['Only about having internet access.', 'About access, skills, and literacy to use digital resources.', 'No longer a problem in developed countries.', 'Only affects the elderly population.'], answer: 1, explanation: '"Not merely to access...but also to the skills and literacy necessary to effectively utilize digital resources" = 不仅关乎接入，还关乎技能和素养。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The emergence of blockchain technology has extended far beyond cryptocurrency applications, finding utility in supply chain management, digital identity verification, and secure voting systems." 区块链技术的特点是什么？', options: ['Only useful for cryptocurrency.', 'Has applications beyond cryptocurrency in various fields.', 'Blockchain is no longer relevant.', 'It can only be used for voting.'], answer: 1, explanation: '"Extended far beyond cryptocurrency applications, finding utility in supply chain management, digital identity verification, and secure voting systems" = 应用远超加密货币范畴。', sourceEvent: '敌方消耗', difficulty: 2 },

  // --- Environment & Climate ---
  { prompt: '"The transition to a low-carbon economy requires not only technological innovation but also fundamental changes in industrial processes and consumer behavior patterns." 实现低碳经济的关键是？', options: ['Only new technology is needed.', 'Technological innovation plus changes in industry and consumer behavior.', 'Consumer behavior does not matter.', 'Industrial processes should remain unchanged.'], answer: 1, explanation: '"Not only technological innovation but also fundamental changes in industrial processes and consumer behavior" = 不仅需要技术创新，还需要产业和消费者行为的根本变化。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"Ocean acidification, often called climate change\'s \'evil twin,\' poses a severe threat to marine ecosystems by reducing the availability of carbonate ions essential for shell-forming organisms like corals and mollusks." 海洋酸化的主要威胁是什么？', options: ['It creates more acidic rain on land.', 'It reduces carbonate ions needed by shell-forming organisms.', 'It boosts coral growth significantly.', 'It only affects fish species.'], answer: 1, explanation: '"Reducing the availability of carbonate ions essential for shell-forming organisms" = 减少了造壳生物所需的碳酸根离子。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The concept of a circular economy, which emphasizes reuse and recycling over the traditional linear take-make-dispose model, has gained traction among policymakers seeking sustainable development solutions." 循环经济的核心理念是什么？', options: ['Taking, making, and disposing of products.', 'Reusing and recycling rather than discarding.', 'Focusing only on recycling plastics.', 'Producing more goods faster.'], answer: 1, explanation: '"Emphasizes reuse and recycling over the traditional linear take-make-dispose model" = 强调重用和回收，而非传统的取-造-弃模式。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"Deforestation in the Amazon rainforest has accelerated to its highest rate in over a decade, threatening not only biodiversity but also the global climate regulation services that the forest provides." 亚马逊森林砍伐加速的影响是什么？', options: ['Only plants are affected.', 'It threatens biodiversity and the forest\'s climate regulation role.', 'It has no effect outside the Amazon region.', 'It benefits agricultural development.'], answer: 1, explanation: '"Threatening not only biodiversity but also the global climate regulation services" = 不仅威胁生物多样性，还威胁全球气候调节功能。', sourceEvent: '对线补兵', difficulty: 2 },

  // --- Education & Society ---
  { prompt: '"The rising cost of higher education has led to an unprecedented level of student debt, prompting debates about the accessibility and value of university degrees in the modern economy." 大学学费上涨导致了什么？', options: ['Higher education has become more accessible.', 'Student debt has reached unprecedented levels.', 'Students are paying less for education.', 'University degrees have become more valuable.'], answer: 1, explanation: '"Rising cost...led to an unprecedented level of student debt" = 上涨的费用导致了前所未有的学生债务水平。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The growing emphasis on STEM education reflects a recognition that future economic competitiveness depends on a workforce equipped with scientific and technological skills." STEM教育受重视的原因是？', options: ['STEM subjects are easier to teach.', 'Economic competitiveness depends on scientific and technological skills.', 'The humanities are no longer valuable.', 'Students prefer STEM subjects exclusively.'], answer: 1, explanation: '"Future economic competitiveness depends on a workforce equipped with scientific and technological skills" = 未来的经济竞争力取决于具备科技技能的劳动力。', sourceEvent: '1v1单杀', difficulty: 2 },
  { prompt: '"Lifelong learning has become an imperative rather than an option in an era where technological obsolescence can render professional skills outdated within a matter of years." 终身学习的必要性来自哪里？', options: ['Technology now makes skills obsolete quickly.', 'People want to learn new hobbies.', 'Schools require ongoing attendance.', 'Professional skills never become outdated.'], answer: 0, explanation: '"Technological obsolescence can render professional skills outdated within a matter of years" = 技术过时可能导致专业技能在几年内过时。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The phenomenon of brain drain — the emigration of highly educated individuals from developing to developed countries — represents a significant loss of human capital for source countries." 人才流失对来源国的影响是？', options: ['It brings more investment to source countries.', 'It represents a significant loss of human capital.', 'It always benefits developing countries.', 'It has no economic impact.'], answer: 1, explanation: '"Represents a significant loss of human capital for source countries" = 对来源国来说是重大的人力资本损失。', sourceEvent: '1v1单杀', difficulty: 3 },

  // --- Health & Psychology ---
  { prompt: '"The gut microbiome plays a far more significant role in overall health than previously understood, influencing not only digestion but also immune function, mood regulation, and even cognitive performance." 肠道微生物组的作用是什么？', options: ['Only affects digestion.', 'Influences digestion, immunity, mood, and cognition.', 'Has no measurable effect on health.', 'Only affects cognitive performance.'], answer: 1, explanation: '"Influencing not only digestion but also immune function, mood regulation, and even cognitive performance" = 不仅影响消化，还影响免疫、情绪和认知。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The placebo effect demonstrates the remarkable power of the mind over the body, with patients often experiencing real physiological improvements from treatments they believe will work, even when those treatments contain no active ingredients." 安慰剂效应说明了什么？', options: ['All medical treatments are fake.', 'The mind can produce real physiological effects through belief.', 'The body has no influence on health.', 'Only active ingredients can improve health.'], answer: 1, explanation: '"Patients experiencing real physiological improvements from treatments they believe will work" = 患者因相信治疗有效而产生真实的生理改善。', sourceEvent: '1v1单杀', difficulty: 2 },
  { prompt: '"The alarming rise in antibiotic-resistant bacteria has been attributed to the overuse and misuse of antibiotics in both human medicine and agriculture, underscoring the urgent need for new antimicrobial strategies." 抗生素耐药性细菌增加的原因是什么？', options: ['Bacteria have become naturally stronger.', 'Overuse and misuse of antibiotics in medicine and agriculture.', 'New antibiotics are too effective.', 'The immune system has weakened globally.'], answer: 1, explanation: '"Attributed to the overuse and misuse of antibiotics in both human medicine and agriculture" = 归因于人类医药和农业中抗生素的过度使用和滥用。', sourceEvent: '敌方消耗', difficulty: 2 },

  // --- Economy & Business ---
  { prompt: '"The concept of universal basic income has moved from the fringes of political debate to the mainstream, with several countries launching pilot programs to evaluate its feasibility and impact on poverty reduction." 全民基本收入的概念目前处于什么状态？', options: ['It has been completely rejected.', 'It has moved to the mainstream with pilot programs in several countries.', 'Only theoretical, with no practical trials.', 'Limited to one country.'], answer: 1, explanation: '"Moved from the fringes of political debate to the mainstream, with several countries launching pilot programs" = 从边缘走向主流，多国已启动试点。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The phenomenon of inflation, characterized by a sustained increase in the general price level of goods and services, erodes purchasing power and can have particularly severe effects on fixed-income households." 通货膨胀对谁的影响尤其严重？', options: ['People with variable incomes.', 'Fixed-income households.', 'Wealthy investors.', 'Government employees.'], answer: 1, explanation: '"Can have particularly severe effects on fixed-income households" = 对固定收入家庭的影响尤其严重。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The sharing economy, exemplified by platforms like Airbnb and Uber, has disrupted traditional industries by enabling peer-to-peer transactions and challenging existing regulatory frameworks." 共享经济如何影响了传统行业？', options: ['It has strengthened traditional business models.', 'It disrupted industries through peer-to-peer transactions and challenged regulations.', 'It has no effect on traditional industries.', 'Only the transportation sector was affected.'], answer: 1, explanation: '"Disrupted traditional industries by enabling peer-to-peer transactions and challenging existing regulatory frameworks" = 通过P2P交易和挑战监管框架颠覆了传统行业。', sourceEvent: '1v1单杀', difficulty: 2 },
  { prompt: '"The trend toward deglobalization, accelerated by trade tensions and the pandemic, has prompted multinational corporations to reassess their supply chain dependencies and diversify manufacturing locations." 去全球化趋势导致了什么？', options: ['Companies are ignoring supply chain issues.', 'Multinationals are reassessing supply chain dependencies and diversifying manufacturing.', 'Global trade has completely stopped.', 'Supply chains have become less important.'], answer: 1, explanation: '"Prompted multinational corporations to reassess their supply chain dependencies and diversify manufacturing locations" = 促使跨国公司重新评估供应链依赖并分散制造地点。', sourceEvent: '敌方消耗', difficulty: 3 },

  // --- Culture & Media ---
  { prompt: '"The phenomenon of cancel culture has sparked intense debate about accountability and forgiveness in the digital age, with critics arguing that it often precludes meaningful dialogue and redemption." 关于抵制文化，批评者认为？', options: ['It promotes meaningful dialogue.', 'It often prevents meaningful dialogue and redemption.', 'It has no effect on public discourse.', 'It is universally accepted.'], answer: 1, explanation: '"Critics arguing that it often precludes meaningful dialogue and redemption" = 批评者认为它往往阻碍了有意义的对话和改过自新的机会。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The dominance of streaming platforms has fundamentally transformed the entertainment industry, shifting power from traditional studios to technology companies that control distribution algorithms." 流媒体平台的统治地位如何改变了娱乐业？', options: ['Strengthened traditional studios.', 'Shifted power from traditional studios to tech companies controlling algorithms.', 'Had no effect on distribution.', 'Increased the role of theaters.'], answer: 1, explanation: '"Shifting power from traditional studios to technology companies that control distribution algorithms" = 权力从传统制片厂转移到控制分发算法的科技公司。', sourceEvent: '敌方消耗', difficulty: 2 },

  // --- More sentences ---
  { prompt: '"The housing affordability crisis in major cities worldwide has been exacerbated by a combination of rising property prices, stagnant wages, and insufficient housing supply." 住房可负担性危机加剧的原因是？', options: ['Only rising property prices.', 'Rising prices, stagnant wages, and insufficient supply combined.', 'Housing is now more affordable.', 'Wages have risen faster than property prices.'], answer: 1, explanation: '"Exacerbated by a combination of rising property prices, stagnant wages, and insufficient housing supply" = 由房价上涨、工资停滞和住房供应不足共同加剧。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The concept of \'filter bubbles\' in social media algorithms has raised concerns about the fragmentation of public discourse and the reinforcement of existing biases through personalized content curation." 过滤气泡现象引发了什么担忧？', options: ['People are exposed to too many perspectives.', 'Public discourse fragmentation and bias reinforcement.', 'Algorithms are not personalized enough.', 'Social media has no effect on opinions.'], answer: 1, explanation: '"Raised concerns about the fragmentation of public discourse and the reinforcement of existing biases" = 引发了对公共话语碎片化和偏见强化的担忧。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The aging population in developed countries presents significant challenges for healthcare systems, pension schemes, and labor markets, requiring comprehensive policy responses." 人口老龄化带来的挑战包括什么？', options: ['Only affects healthcare.', 'Challenges for healthcare, pensions, and labor markets.', 'Labor markets will benefit greatly.', 'No policy response is needed.'], answer: 1, explanation: '"Presents significant challenges for healthcare systems, pension schemes, and labor markets" = 对医疗体系、养老金计划和劳动力市场构成重大挑战。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The rapid urbanization of developing countries has created a dual reality: modern skylines alongside sprawling informal settlements lacking basic infrastructure services." 发展中国家的快速城市化导致了什么现象？', options: ['All citizens have access to modern infrastructure.', 'A dual reality of modern skylines and informal settlements lacking basic services.', 'Informal settlements no longer exist.', 'All urban areas are equally developed.'], answer: 1, explanation: '"Created a dual reality: modern skylines alongside sprawling informal settlements lacking basic infrastructure services" = 创造了现代天际线与缺乏基础设施的非正规住区并存的双重现实。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The outsourcing of manufacturing to countries with lower labor costs has been a double-edged sword, boosting corporate profits while contributing to job losses in developed economies." 制造业外包的影响是？', options: ['Only benefits developed economies.', 'A double-edged sword: boosts profits but causes job losses in developed countries.', 'Has no effect on employment.', 'Only benefits developing countries.'], answer: 1, explanation: '"A double-edged sword, boosting corporate profits while contributing to job losses in developed economies" = 一把双刃剑，提高企业利润的同时也导致发达经济体失业。', sourceEvent: '1v1单杀', difficulty: 2 },
  { prompt: '"The preservation of indigenous languages has gained recognition as an urgent priority, given that a language dies approximately every two weeks, taking with it an entire system of knowledge and cultural heritage." 为什么保护土著语言是当务之急？', options: ['Languages naturally evolve and change.', 'A language dies every two weeks, taking unique knowledge and cultural heritage with it.', 'Preserving languages is not important.', 'Only written languages need preservation.'], answer: 1, explanation: '"A language dies approximately every two weeks, taking with it an entire system of knowledge and cultural heritage" = 大约每两周就有一种语言消亡，带走整个知识体系和文化遗产。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The gig economy has created a paradox: unprecedented flexibility for workers coupled with the erosion of traditional employment protections and benefits." 零工经济的悖论是什么？', options: ['All workers prefer traditional employment.', 'Flexibility combined with erosion of employment protections.', 'Zero flexibility for workers.', 'Employment protections have become stronger.'], answer: 1, explanation: '"Unprecedented flexibility...coupled with the erosion of traditional employment protections and benefits" = 前所未有的灵活性与传统就业保护和福利的侵蚀并存。', sourceEvent: '1v1单杀', difficulty: 2 },
  { prompt: '"The concept of \'soft power\' — a country\'s ability to influence others through cultural attraction and values rather than military force — has become increasingly relevant in international relations." 软实力的本质是什么？', options: ['Military strength and economic power.', 'Influencing others through cultural attraction and values.', 'Only about trade agreements.', 'Hard power is no longer relevant.'], answer: 1, explanation: '"A country\'s ability to influence others through cultural attraction and values rather than military force" = 通过文化吸引力和价值观而非军事力量影响他国的能力。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The increasing polarization of political discourse in many democracies has been attributed to the fragmentation of media consumption patterns and the proliferation of echo chambers on social media." 政治话语极化的原因包括？', options: ['Media consumption has unified.', 'Fragmentation of media and echo chambers on social media.', 'Social media has reduced polarization.', 'Political discourse has become less divided.'], answer: 1, explanation: '"Attributed to the fragmentation of media consumption patterns and the proliferation of echo chambers" = 归因于媒体消费模式的分裂和社交媒体上同温层的扩散。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The global water crisis is not primarily about scarcity but about inequitable distribution, inefficient use, and inadequate infrastructure for water treatment and delivery." 全球水危机的根本原因是什么？', options: ['There is not enough water on Earth.', 'Inequitable distribution, inefficient use, and inadequate infrastructure.', 'Population growth is the only factor.', 'Technology cannot solve water problems.'], answer: 1, explanation: '"Not primarily about scarcity but about inequitable distribution, inefficient use, and inadequate infrastructure" = 主要不是稀缺问题，而是分配不均、使用低效和基础设施不足。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The interdisciplinary nature of modern scientific research means that breakthroughs increasingly occur at the intersection of traditional academic disciplines rather than within them." 现代科学研究的突破通常发生在哪里？', options: ['Within single academic disciplines.', 'At the intersection of different academic disciplines.', 'Outside of academia entirely.', 'Only in applied sciences.'], answer: 1, explanation: '"Breakthroughs increasingly occur at the intersection of traditional academic disciplines" = 突破越来越多地发生在传统学科的交叉领域。', sourceEvent: '对线补兵', difficulty: 2 },

  // --- More CET-6 level sentences ---
  { prompt: '"The correlation between educational attainment and life expectancy is well-documented, with higher levels of education generally associated with better health outcomes and longer lifespans." 教育与预期寿命的关系是？', options: ['No correlation exists.', 'Higher education is associated with better health and longer life.', 'Education reduces life expectancy.', 'The relationship only applies to certain groups.'], answer: 1, explanation: '"Higher levels of education generally associated with better health outcomes and longer lifespans" = 更高的教育水平通常与更好的健康结果和更长的寿命相关。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The rapid advancement of gene-editing technology, particularly CRISPR, has opened up unprecedented possibilities for treating genetic disorders while simultaneously raising profound ethical questions about the boundaries of human intervention in evolution." 基因编辑技术带来了什么矛盾？', options: ['No ethical concerns exist.', 'Unprecedented treatment possibilities alongside profound ethical questions.', 'The technology cannot treat any diseases.', 'Evolution is no longer relevant.'], answer: 1, explanation: '"Opened up unprecedented possibilities for treating genetic disorders while simultaneously raising profound ethical questions" = 开辟了治疗遗传疾病的前所未有的可能性，同时也引发了深刻的伦理问题。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The concept of work-life balance has evolved from a fringe concern to a central consideration in talent retention, with companies offering flexible arrangements as a competitive advantage in attracting skilled employees." 工作与生活平衡的概念在企业中有什么变化？', options: ['Companies still ignore it.', 'It has become central to talent retention and competitive advantage.', 'Only small companies consider it.', 'It is no longer discussed.'], answer: 1, explanation: '"Evolved from a fringe concern to a central consideration in talent retention" = 从边缘问题演变为人才保留的核心考量。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The phenomenon of \'ghost cities\' — newly built urban developments that remain largely unoccupied — has been observed in several countries, representing a massive misallocation of resources in the real estate sector." 鬼城现象代表了什么？', options: ['Successful urban planning.', 'Massive misallocation of resources in real estate.', 'Overpopulation in cities.', 'Affordable housing for everyone.'], answer: 1, explanation: '"Representing a massive misallocation of resources in the real estate sector" = 代表了房地产行业资源的重大错配。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"The transition from fossil fuels to renewable energy sources is not merely a technological challenge but also a political and economic one, given the entrenched interests of the fossil fuel industry." 向可再生能源的转型面临什么困难？', options: ['Only a technological problem.', 'Technological, political, and economic challenges due to entrenched fossil fuel interests.', 'No obstacles exist.', 'Only political opposition matters.'], answer: 1, explanation: '"Not merely a technological challenge but also a political and economic one, given the entrenched interests of the fossil fuel industry" = 不仅是技术挑战，也是政治和经济挑战。', sourceEvent: '1v1单杀', difficulty: 3 },
  { prompt: '"The increasing use of surveillance technologies in public spaces has sparked a contentious debate between advocates of national security and defenders of individual privacy rights." 关于公共监控的争议是什么？', options: ['Everyone supports surveillance.', 'Between national security advocates and privacy rights defenders.', 'Privacy is no longer a concern.', 'Surveillance has no impact on privacy.'], answer: 1, explanation: '"A contentious debate between advocates of national security and defenders of individual privacy rights" = 国家安全倡导者与个人隐私权捍卫者之间的激烈辩论。', sourceEvent: '敌方消耗', difficulty: 2 },
  { prompt: '"Mental health awareness has increased significantly in recent years, yet the stigma surrounding mental illness continues to prevent many individuals from seeking the help they need." 关于心理健康的认识和污名化，正确的是？', options: ['Awareness has increased but stigma still prevents help-seeking.', 'Stigma has been completely eliminated.', 'Awareness is at an all-time low.', 'Stigma encourages people to seek help.'], answer: 0, explanation: '"Awareness has increased significantly...yet the stigma...continues to prevent many individuals from seeking the help they need" = 认知提高，但污名化仍阻止人们寻求帮助。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The proliferation of misinformation and disinformation online has eroded public trust in traditional media institutions, creating new challenges for democratic discourse and civic engagement." 错误信息和虚假信息的扩散导致了什么？', options: ['Increased trust in media.', 'Eroded public trust in media, challenging democratic discourse.', 'No effect on democracy.', 'Strengthened civic engagement.'], answer: 1, explanation: '"Eroded public trust in traditional media institutions, creating new challenges for democratic discourse and civic engagement" = 侵蚀了对传统媒体的信任，给民主讨论和公民参与带来新挑战。', sourceEvent: '1v1单杀', difficulty: 2 },
  { prompt: '"The doctrine of sustainable development has been criticized for being too vague to guide concrete policy decisions, while others argue that its flexibility is precisely its strength." 关于可持续发展原则的主要争议是？', options: ['Everyone sees it as perfect.', 'Critics call it too vague; supporters value its flexibility.', 'It has been abandoned entirely.', 'It only applies to environmental issues.'], answer: 1, explanation: '"Criticized for being too vague...others argue that its flexibility is precisely its strength" = 被批评过于模糊，但其他人认为其灵活性正是优势所在。', sourceEvent: '对线补兵', difficulty: 2 },
  { prompt: '"The democratization of content creation through social media platforms has empowered individuals to become producers of information rather than merely consumers, fundamentally changing the dynamics of public discourse." 社交媒体如何改变了内容创作？', options: ['Only professionals create content.', 'Empowered individuals to become content producers, changing public discourse dynamics.', 'People are only consumers of content.', 'Traditional media remains dominant.'], answer: 1, explanation: '"Democratization of content creation...empowered individuals to become producers of information rather than merely consumers" = 内容创作的大众化使个人成为信息生产者而不仅仅是消费者。', sourceEvent: '敌方消耗', difficulty: 2 },
];

// ============== SHORT READING QUESTIONS (shortReading type) ==============
const SHORT_READING_POOL = [
  {
    passage: '"Cognitive behavioral therapy (CBT) has emerged as one of the most effective treatments for anxiety disorders. Unlike traditional psychoanalysis, which often explores past experiences, CBT focuses on identifying and changing current thought patterns and behaviors. Research indicates that CBT can produce lasting improvements in symptoms, often in a relatively short period. The structured nature of CBT makes it particularly suitable for integration into digital health platforms, potentially expanding access to mental health treatment."',
    prompt: '认知行为疗法与传统心理分析有什么不同？',
    options: ['It explores past experiences more deeply.', 'It focuses on current thoughts and behaviors rather than past experiences.', 'It takes much longer than traditional methods.', 'It does not require a therapist.'],
    answer: 1,
    explanation: '"Unlike traditional psychoanalysis...CBT focuses on identifying and changing current thought patterns and behaviors" = 不同于传统心理分析，CBT关注当前思维模式和行为。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The rise of fintech has revolutionized the banking industry, with digital payment systems, peer-to-peer lending platforms, and robo-advisors challenging traditional financial institutions. In developing countries, mobile banking has been particularly transformative, bringing financial services to populations previously excluded from the formal banking system. However, concerns about data security, algorithmic bias, and the digital divide persist as significant challenges to the fintech revolution."',
    prompt: '金融科技在发展中国家起到了什么特殊作用？',
    options: ['Had little impact in developing countries.', 'Brought financial services to those previously excluded from formal banking.', 'Only benefited wealthy individuals.', 'Increased the digital divide.'],
    answer: 1,
    explanation: '"Bringing financial services to populations previously excluded from the formal banking system" = 将金融服务带给以前被排除在正规银行体系之外的人群。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The concept of \'nudge theory\' in public policy suggests that subtle changes in how choices are presented can significantly influence people\'s decisions without restricting their freedom of choice. For example, automatically enrolling employees in pension plans while allowing them to opt out has dramatically increased retirement savings rates. Critics argue that nudges can be manipulative, particularly when citizens are unaware of their influence. Proponents counter that well-designed nudges preserve autonomy while helping people make better decisions."',
    prompt: '助推理论的核心特点是什么？',
    options: ['Forcing people to make specific choices.', 'Influencing decisions subtly while preserving freedom of choice.', 'Replacing all existing policies.', 'Only effective in financial contexts.'],
    answer: 1,
    explanation: '"Subtle changes in how choices are presented can significantly influence people\'s decisions without restricting their freedom of choice" = 在不限制选择自由的情况下通过微调呈现方式影响决策。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"Vertical farming — the practice of growing crops in stacked layers within controlled environments — offers a potential solution to agricultural challenges in urban areas. These facilities use up to 95% less water than traditional farming and can produce crops year-round regardless of weather conditions. However, the high energy costs of artificial lighting and climate control remain significant economic barriers, and the technology currently is mainly viable for high-value crops like leafy greens and herbs."',
    prompt: '垂直农业目前面临的主要制约是什么？',
    options: ['It uses too much water.', 'High energy costs make it only viable for certain high-value crops.', 'Crops cannot grow year-round.', 'It requires too much land.'],
    answer: 1,
    explanation: '"High energy costs of artificial lighting and climate control remain significant economic barriers...mainly viable for high-value crops" = 高能耗成本使其目前主要适用于高价值作物。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The study of epigenetics has revealed that environmental factors can influence gene expression without changing the DNA sequence itself. Stress, diet, and exposure to toxins can cause chemical modifications to DNA that affect how genes are activated or silenced. These epigenetic changes can sometimes be passed to future generations, suggesting that the experiences of one generation may have biological consequences for their descendants."',
    prompt: '表观遗传学揭示了什么重要发现？',
    options: ['DNA sequence is the only thing that matters.', 'Environmental factors can influence gene expression without changing DNA, and these effects can be inherited.', 'Genes cannot be influenced by the environment.', 'Epigenetic changes never affect future generations.'],
    answer: 1,
    explanation: '"Environmental factors can influence gene expression without changing the DNA sequence itself...these epigenetic changes can sometimes be passed to future generations" = 环境因素可影响基因表达而不改变DNA序列，且这些变化可以遗传。',
    sourceEvent: '打野来抓',
    difficulty: 3,
  },
  {
    passage: '"The sharing of personal data has become a cornerstone of the digital economy, enabling personalized services and targeted advertising that drive revenue for tech companies. However, increasing awareness of data collection practices has led to growing demands for stronger privacy protections. Regulations like the EU\'s General Data Protection Regulation (GDPR) represent attempts to balance the economic value of data with individuals\' rights to privacy and control over their personal information."',
    prompt: 'GDPR这类法规的目的是什么？',
    options: ['To ban all data collection.', 'To balance the economic value of data with individual privacy rights.', 'Only to protect business interests.', 'To eliminate the digital economy.'],
    answer: 1,
    explanation: '"Represent attempts to balance the economic value of data with individuals\' rights to privacy and control over their personal information" = 在数据的经济价值与个人隐私权和控制权之间取得平衡。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"Marine biotechnology has emerged as a promising field for drug discovery, with organisms from extreme ocean environments producing unique compounds with pharmaceutical potential. Deep-sea sponges, corals, and microorganisms have yielded substances with anti-cancer, anti-inflammatory, and antiviral properties. Despite this potential, the exploration of marine biodiversity for medical applications remains limited by the technical challenges of deep-sea collection and the difficulties of cultivating these organisms in laboratory conditions."',
    prompt: '海洋生物技术药物发现的障碍是什么？',
    options: ['Marine organisms have no medicinal value.', 'Technical challenges of deep-sea collection and laboratory cultivation.', 'The field has been fully explored already.', 'There is no pharmaceutical potential.'],
    answer: 1,
    explanation: '"Limited by the technical challenges of deep-sea collection and the difficulties of cultivating these organisms in laboratory conditions" = 受限于深海采集的技术挑战和实验室培养的困难。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The practice of mindfulness meditation has gained substantial empirical support for its mental health benefits. Regular practitioners report reduced stress, improved focus, and greater emotional regulation. Neuroimaging studies have shown that consistent meditation practice can actually change brain structure, increasing gray matter density in regions associated with memory and emotional control. These findings have led to the integration of mindfulness-based interventions into clinical psychology and workplace wellness programs."',
    prompt: '关于冥想，神经影像学研究发现了什么？',
    options: ['Meditation has no effect on the brain.', 'It can change brain structure, increasing gray matter in memory and emotional control regions.', 'Brain changes from meditation are not possible.', 'Only emotional changes occur without brain changes.'],
    answer: 1,
    explanation: '"Consistent meditation practice can actually change brain structure, increasing gray matter density in regions associated with memory and emotional control" = 持续的冥想练习可以改变大脑结构。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The concept of \'cultural intelligence\' (CQ) has become increasingly valued in global business contexts. Unlike emotional intelligence, which focuses on interpersonal sensitivity within one\'s own culture, CQ refers to the ability to adapt effectively across different cultural contexts. Individuals with high CQ demonstrate awareness of cultural differences, knowledge of other cultures, and the ability to adjust their behavior appropriately. Research suggests that CQ can be developed through international experiences and targeted training."',
    prompt: '文化智商与情商的主要区别是什么？',
    options: ['They are the same thing.', 'CQ focuses on adapting across different cultures, while EQ focuses on interpersonal sensitivity within one\'s own culture.', 'EQ is more important in business.', 'CQ cannot be developed through training.'],
    answer: 1,
    explanation: '"Unlike emotional intelligence, which focuses on interpersonal sensitivity within one\'s own culture, CQ refers to the ability to adapt effectively across different cultural contexts" = 情商关注本文化内的人际敏感度，而文化智商关注跨文化适应能力。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The circular economy represents a fundamental shift from the traditional linear model of production and consumption. In a circular system, products are designed for durability, reuse, and recyclability from the outset. Materials are kept in use for as long as possible through repair, remanufacturing, and recycling. This approach not only reduces waste but also decreases the demand for virgin resources. The European Union has adopted circular economy action plans, setting ambitious targets for waste reduction and recycling rates."',
    prompt: '循环经济与线性经济模式的主要区别是什么？',
    options: ['They are essentially the same.', 'Circular economy designs for durability, reuse, and recyclability instead of the take-make-dispose model.', 'Linear economy is more sustainable.', 'Circular economy produces more waste.'],
    answer: 1,
    explanation: '"Products are designed for durability, reuse, and recyclability...Materials are kept in use for as long as possible" = 产品从一开始就设计为耐用、可重复使用和可回收。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The decline of insect populations worldwide, sometimes called the \'insect apocalypse,\' has alarmed scientists. Insects are essential for pollination, nutrient cycling, and as a food source for many animals. Studies estimate that insect biomass has declined by 75% or more in some protected areas. The primary drivers include habitat loss, pesticide use, climate change, and light pollution. Restoring insect populations will require coordinated action across agriculture, urban planning, and conservation policy."',
    prompt: '昆虫数量下降的主要原因包括什么？',
    options: ['Only pesticide use.', 'Habitat loss, pesticide use, climate change, and light pollution.', 'Insects are naturally declining.', 'Climate change is the only factor.'],
    answer: 1,
    explanation: '"The primary drivers include habitat loss, pesticide use, climate change, and light pollution" = 主要驱动因素包括栖息地丧失、农药使用、气候变化和光污染。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The field of behavioral economics has challenged the traditional economic assumption that humans are rational actors who always make decisions in their own best interest. Through experiments and field studies, researchers like Daniel Kahneman and Richard Thaler have demonstrated that cognitive biases systematically influence our choices. These insights have practical applications in everything from retirement savings design to health policy, where understanding how people actually behave leads to more effective interventions."',
    prompt: '行为经济学对传统经济学提出了什么挑战？',
    options: ['Humans always act rationally.', 'Cognitive biases systematically influence choices, challenging the assumption of rational decision-making.', 'Economic models are perfect.', 'Behavior is irrelevant to economics.'],
    answer: 1,
    explanation: '"Challenged the traditional economic assumption that humans are rational actors...cognitive biases systematically influence our choices" = 挑战了人是理性行为者的传统假设。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The Arctic region is warming nearly four times faster than the global average, a phenomenon known as Arctic amplification. This rapid warming has profound consequences: sea ice is declining at an accelerating rate, permafrost is thawing and releasing greenhouse gases, and Arctic ecosystems are undergoing dramatic changes. The melting of Arctic sea ice does not significantly raise sea levels, but the Greenland ice sheet — which is also losing mass — contains enough water to raise global sea levels by about seven meters."',
    prompt: '关于北极变暖，哪项描述是正确的？',
    options: ['Arctic sea ice melt is the main cause of sea level rise.', 'Arctic warming is about four times faster than the global average, with consequences including ice loss and permafrost thaw.', 'The Arctic is not warming faster than other regions.', 'Permafrost thaw releases no greenhouse gases.'],
    answer: 1,
    explanation: '"The Arctic region is warming nearly four times faster than the global average...sea ice is declining...permafrost is thawing and releasing greenhouse gases" = 北极变暖速度约为全球平均的四倍。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The phenomenon of \'technological unemployment\' — job displacement caused by technological change — has historically been offset by the creation of new types of employment. However, the current wave of automation driven by artificial intelligence and robotics may be qualitatively different. Some economists argue that AI could automate not only manual labor but also cognitive tasks previously considered safe from automation. Others contend that, as in past industrial revolutions, new human roles will emerge that we cannot yet envision."',
    prompt: '关于AI导致的失业，文中提到了什么不同的观点？',
    options: ['All economists agree on the outcome.', 'Some fear AI may automate cognitive tasks, while others believe new job types will emerge as before.', 'AI will not affect employment at all.', 'Only manual jobs are at risk.'],
    answer: 1,
    explanation: '"Some economists argue that AI could automate not only manual labor but also cognitive tasks...Others contend that...new human roles will emerge" = 一些经济学家认为AI可以自动化认知任务，另一些人则认为新角色会出现。',
    sourceEvent: '打野来抓',
    difficulty: 3,
  },
  {
    passage: '"The global trade in counterfeit goods has reached unprecedented levels, with the OECD estimating that counterfeits account for up to 3.3% of global trade. Beyond the economic damage to legitimate businesses and the risks to consumer health and safety, counterfeiting is increasingly linked to organized crime and even the funding of terrorist activities. E-commerce platforms have become major channels for the distribution of fake goods, presenting significant challenges for enforcement agencies and online marketplaces."',
    prompt: '除经济损失外，假冒商品贸易还有什么其他危害？',
    options: ['No other harms exist.', 'Linked to organized crime and terrorism funding.', 'Only affects luxury brands.', 'Consumers prefer counterfeit goods.'],
    answer: 1,
    explanation: '"Counterfeiting is increasingly linked to organized crime and even the funding of terrorist activities" = 假冒商品与有组织犯罪甚至恐怖主义融资存在关联。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
  {
    passage: '"The concept of \'peak car\' — the idea that per capita car usage has reached its maximum and will decline — has gained support from trends in many developed countries. Young adults in particular are driving less, obtaining licenses later, and showing greater preference for urban living and multimodal transportation including public transit, cycling, and ride-sharing services. However, car ownership and usage continue to rise in developing countries, suggesting that global car use may not have peaked yet."',
    prompt: '"峰值汽车"概念在不同国家的情况如何？',
    options: ['Car usage is declining everywhere.', 'In developed countries usage may have peaked, but it continues to rise in developing countries.', 'The concept has been proven false globally.', 'Developing countries show declining car usage.'],
    answer: 1,
    explanation: '"In many developed countries...car usage has reached its maximum...however, car ownership and usage continue to rise in developing countries" = 发达国家可能已达峰值，但发展中国家仍在增长。',
    sourceEvent: '打野来抓',
    difficulty: 2,
  },
];

// ============== READING GROUP CONTENT ==============
// Each group = 1 long passage + 3 questions
const READING_GROUPS = [
  {
    groupId: 'rg5',
    title: '人工智能与就业市场',
    passage: '"The impact of artificial intelligence on the labor market has become one of the most debated economic issues of our time. Unlike previous technological revolutions that primarily affected manual and routine cognitive tasks, AI has demonstrated capabilities in areas once considered uniquely human, such as creative work, strategic decision-making, and complex problem-solving. A 2023 report by Goldman Sachs estimated that AI could expose the equivalent of 300 million full-time jobs to automation, while also noting that the technology could create new job categories and boost productivity.\n\nHowever, the net effect on employment remains uncertain. Historical evidence from the Industrial Revolution and the computer age suggests that while technological change displaces workers in the short term, it ultimately creates more jobs than it destroys in the long run. But the speed of AI adoption may be unprecedented, potentially outpacing workers\' ability to reskill and adapt. Furthermore, the distribution of AI\'s benefits is likely to be uneven, potentially exacerbating inequality between high-skilled and low-skilled workers.\n\nPolicymakers face the challenge of ensuring that the benefits of AI are broadly shared. Proposals include investing in education and reskilling programs, strengthening social safety nets, exploring new tax models, and potentially implementing universal basic income pilots. International cooperation will also be essential, as the development and deployment of AI is a global phenomenon that transcends national borders."',
    questions: [
      { prompt: '与以往的技术革命相比，AI对就业市场的影响有何不同？', options: ['AI only affects manual labor.', 'Previous revolutions affected manual tasks; AI also affects creative and strategic work once considered uniquely human.', 'AI has less impact than previous revolutions.', 'Previous revolutions were faster than AI.'], answer: 1, explanation: '"Unlike previous technological revolutions that primarily affected manual and routine cognitive tasks, AI has demonstrated capabilities in areas once considered uniquely human" = 不同于以往，AI还能影响创造性工作。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: 'AI对就业的长期影响，文中是如何描述的？', options: ['AI will definitely destroy more jobs than it creates.', 'The net effect remains uncertain; history suggests new jobs emerge but AI\'s speed may be unprecedented.', 'AI will create no new jobs.', 'All workers will equally benefit from AI.'], answer: 1, explanation: '"The net effect on employment remains uncertain...the speed of AI adoption may be unprecedented, potentially outpacing workers\' ability to reskill" = 净影响仍不确定，AI的采用速度可能前所未有。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '政策制定者应该采取什么措施来应对AI带来的挑战？', options: ['Ignore AI development.', 'Invest in education, strengthen safety nets, explore new tax models, and pursue international cooperation.', 'Only focus on tax models.', 'Stop AI development entirely.'], answer: 1, explanation: '"Investing in education and reskilling programs, strengthening social safety nets, exploring new tax models...International cooperation" = 投资教育、加强安全网、探索新税收模式和国际合作。', sourceEvent: '小龙团战', difficulty: 2 },
    ],
  },
  {
    groupId: 'rg6',
    title: '全球粮食安全',
    passage: '"Feeding a global population projected to reach nearly 10 billion by 2050 presents one of the most formidable challenges of the twenty-first century. Agriculture already accounts for approximately 70% of global freshwater use and is a major contributor to greenhouse gas emissions. Climate change compounds these challenges through increased frequency of extreme weather events, shifting growing seasons, and the spread of pests and diseases. The COVID-19 pandemic and geopolitical conflicts have further exposed the fragility of global food supply chains.\n\nTechnological innovations offer promising avenues for addressing these challenges. Precision agriculture uses sensors, satellite imagery, and data analytics to optimize water and fertilizer use, potentially reducing environmental impact while maintaining yields. Alternative protein sources — including plant-based meats, cultivated meat, and insect protein — could reduce the environmental footprint of food production. Genetic improvement of crops through both conventional breeding and gene-editing techniques can develop varieties more resistant to drought, pests, and diseases.\n\nYet technology alone is insufficient. Reducing food waste — currently estimated at one-third of all food produced globally — requires changes in consumer behavior, supply chain logistics, and regulatory frameworks. Smallholder farmers, who produce much of the world\'s food in developing countries, need access to markets, credit, and knowledge. Addressing the root causes of food insecurity also requires tackling poverty, inequality, and conflict, which are the primary drivers of hunger worldwide."',
    questions: [
      { prompt: '到2050年前，全球粮食安全面临的主要挑战是什么？', options: ['Population growth, climate change, water scarcity, and fragile supply chains.', 'Only population growth matters.', 'There is no challenge to food security.', 'Technology has solved all food problems.'], answer: 0, explanation: '"Population projected to reach nearly 10 billion...Agriculture uses 70% of freshwater...Climate change compounds challenges...fragility of global food supply chains" = 多重挑战并存。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '文中提到的解决粮食问题的技术方法有哪些？', options: ['Only genetic modification.', 'Precision agriculture, alternative proteins, and genetic improvement of crops.', 'None of the technologies work.', 'Only precision agriculture is mentioned.'], answer: 1, explanation: '"Precision agriculture...Alternative protein sources...Genetic improvement of crops" = 精准农业、替代蛋白和作物基因改良。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '根据文章，解决粮食问题还需要哪些非技术措施？', options: ['Technology alone can solve everything.', 'Reducing food waste, supporting smallholders, and addressing poverty and inequality.', 'No non-technical measures are needed.', 'Only government regulation is sufficient.'], answer: 1, explanation: '"Reducing food waste...Smallholder farmers need access to markets, credit, and knowledge...tackling poverty, inequality, and conflict" = 减少浪费、支持小农户和解决贫困等根本问题。', sourceEvent: '小龙团战', difficulty: 2 },
    ],
  },
  {
    groupId: 'rg7',
    title: '社交媒体与心理健康',
    passage: '"The relationship between social media use and mental health has become a subject of intense scrutiny and debate among researchers, policymakers, and the public. On one hand, social media platforms offer opportunities for social connection, community building, and access to mental health resources. For marginalized groups and individuals with rare conditions, online communities can provide invaluable support and validation. During the pandemic, platforms served as crucial lifelines for maintaining social ties during lockdowns.\n\nOn the other hand, a growing body of research has identified potential negative effects. Studies have found correlations between heavy social media use and increased rates of anxiety, depression, and loneliness among adolescents and young adults. The mechanisms proposed include social comparison — the tendency to evaluate oneself against others\' curated highlights — as well as sleep disruption, reduced face-to-face interaction, and the addictive design of platform algorithms. Cyberbullying and exposure to harmful content represent additional risks.\n\nThe evidence, however, is far from conclusive. Critics argue that much of the research is correlational and cannot establish causation. The effects of social media may vary significantly depending on individual differences, usage patterns, and content consumed. Active use (such as direct messaging and posting) appears to have different effects than passive use (scrolling and viewing). Some studies suggest that the key factor is not how much time people spend on social media but how they engage with it."',
    questions: [
      { prompt: '社交媒体可能带来哪些积极影响？', options: ['No positive effects exist.', 'Social connection, community building, access to mental health resources, and support for marginalized groups.', 'Only negative effects are documented.', 'Social media only benefits businesses.'], answer: 1, explanation: '"Opportunities for social connection, community building, and access to mental health resources...invaluable support and validation" = 社交连接、社区建设和心理健康资源的机会。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '研究发现社交媒体可能对青少年产生哪些负面影响？', options: ['No negative effects on young people.', 'Correlations with anxiety, depression, and loneliness through social comparison, sleep disruption, and addictive design.', 'Only positive effects are found.', 'Social media improves mental health for everyone.'], answer: 1, explanation: '"Studies have found correlations between heavy social media use and increased rates of anxiety, depression, and loneliness" = 重度使用与焦虑、抑郁和孤独感之间存在相关性。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '关于社交媒体与心理健康的研究，文中指出了什么局限？', options: ['The research is conclusive and definitive.', 'Much research is correlational and cannot establish causation; effects vary by individual and usage type.', 'All studies agree on the findings.', 'No research has been conducted on this topic.'], answer: 1, explanation: '"Much of the research is correlational and cannot establish causation...effects may vary significantly depending on individual differences, usage patterns" = 多为相关性研究而非因果研究，效果因人而异。', sourceEvent: '小龙团战', difficulty: 3 },
    ],
  },
  {
    groupId: 'rg8',
    title: '可再生能源转型',
    passage: '"The global transition to renewable energy has accelerated significantly in recent years, driven by declining costs, policy support, and growing awareness of climate change. Solar photovoltaic and wind power have become the cheapest sources of new electricity generation in most parts of the world, with costs declining by 90% and 70% respectively over the past decade. Renewable energy now accounts for an increasing share of global electricity generation, with some countries already achieving over 50% renewable electricity.\n\nDespite this progress, significant challenges remain. The intermittency of solar and wind power — they only generate when the sun shines or the wind blows — creates challenges for grid stability. Energy storage technologies, particularly batteries, are essential but remain expensive for grid-scale applications. The existing grid infrastructure was designed for centralized, dispatchable power plants and requires substantial upgrading to accommodate distributed and variable renewable sources. Furthermore, the manufacturing of renewable energy technologies relies on critical minerals such as lithium, cobalt, and rare earth elements, whose extraction raises environmental and geopolitical concerns.\n\nThe transition also involves complex social and economic dimensions. Workers in fossil fuel industries face job displacement, requiring just transition policies that include retraining and economic diversification. The siting of large-scale renewable energy projects sometimes conflicts with land use priorities, including agriculture and conservation. Community engagement and equitable distribution of benefits — both within and between countries — are increasingly recognized as essential for a successful and just energy transition."',
    questions: [
      { prompt: '可再生能源成本在过去十年中有什么变化？', options: ['Costs have remained stable.', 'Solar costs declined by 90% and wind by 70% over the past decade.', 'Costs have increased due to demand.', 'Only solar costs have decreased.'], answer: 1, explanation: '"Costs declining by 90% and 70% respectively over the past decade" = 太阳能和风能成本分别下降了90%和70%。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '可再生能源转型面临的主要技术挑战是什么？', options: ['No technical challenges exist.', 'Intermittency, energy storage costs, grid infrastructure upgrades, and critical mineral supply concerns.', 'Only storage is a problem.', 'Technology is not important for the transition.'], answer: 1, explanation: '"Intermittency...energy storage technologies...expensive...grid infrastructure requires substantial upgrading...critical minerals" = 间歇性、储能成本、电网升级和关键矿物供应问题。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '文中提到的"公正转型"指的是什么？', options: ['Ignoring displaced workers.', 'Supporting fossil fuel workers through retraining and economic diversification, and ensuring equitable distribution of benefits.', 'Only environmental protection matters.', 'Faster transition regardless of social impact.'], answer: 1, explanation: '"Workers in fossil fuel industries face job displacement, requiring just transition policies that include retraining and economic diversification" = 帮助化石燃料行业工人再培训和实现经济多元化。', sourceEvent: '小龙团战', difficulty: 3 },
    ],
  },
  {
    groupId: 'rg9',
    title: '移民与全球化',
    passage: '"International migration has emerged as one of the defining issues of the twenty-first century, shaped by economic disparities, demographic changes, conflict, climate change, and the forces of globalization. According to the United Nations, the number of international migrants reached approximately 281 million in 2020, representing about 3.6% of the global population. While this proportion has remained relatively stable over recent decades, the political and social salience of migration has increased dramatically.\n\nEconomic research generally finds that migration produces net positive effects for both host countries and countries of origin. Immigrants contribute to economic growth, fill labor shortages in key sectors, and bring diverse skills and perspectives. In many developed countries with aging populations, immigration helps sustain the workforce and support social welfare systems. Remittances sent by migrants to their home countries — estimated at over $600 billion annually — often exceed official development assistance and represent a vital source of income for millions of households.\n\nYet migration also presents genuine challenges. Rapid demographic change in receiving communities can strain public services and infrastructure. The integration of migrants into labor markets and societies takes time and investment in language training, education, and anti-discrimination measures. Irregular migration creates vulnerabilities for migrants themselves and challenges for border management. Public attitudes toward migration are often shaped more by perceptions than by evidence, with fears about competition for jobs and cultural change sometimes diverging from economic realities."',
    questions: [
      { prompt: '根据联合国数据，国际移民的情况如何？', options: ['Migrants make up over half the global population.', 'About 281 million international migrants exist, roughly 3.6% of the global population, a proportion that has remained relatively stable.', 'Migration has decreased significantly.', 'Most of the world\'s population are migrants.'], answer: 1, explanation: '"281 million...about 3.6% of the global population...has remained relatively stable" = 约2.81亿国际移民，约占全球人口的3.6%，比例相对稳定。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '移民对输出国（母国）有什么积极作用？', options: ['No positive effects for origin countries.', 'Remittances sent home — over $600 billion annually — exceed official development assistance.', 'Migration harms origin countries.', 'Only negative effects are documented.'], answer: 1, explanation: '"Remittances...estimated at over $600 billion annually...often exceed official development assistance" = 汇款每年超过6000亿美元，往往超过官方发展援助。', sourceEvent: '小龙团战', difficulty: 2 },
      { prompt: '关于公众对移民的态度，文中指出了什么？', options: ['Public attitudes are always based on evidence.', 'Attitudes are often shaped more by perceptions than evidence, with fears sometimes diverging from economic realities.', 'The public fully supports migration.', 'Economic research supports restricting migration.'], answer: 1, explanation: '"Public attitudes toward migration are often shaped more by perceptions than by evidence...fears sometimes diverging from economic realities" = 公众态度往往更多地由感知而非证据决定。', sourceEvent: '小龙团战', difficulty: 2 },
    ],
  },
];

// ============== TRANSLATION QUESTIONS (translation type) ==============
const TRANSLATION_POOL = [
  {
    prompt: '理解并翻译：\n\n"It is universally acknowledged that education serves as the cornerstone of personal development and social progress, empowering individuals with the knowledge and skills necessary to navigate an increasingly complex world."\n\n这段话的核心观点是什么？',
    options: ['Education is only about personal development.', 'Education is the foundation of personal and social development, equipping people with essential knowledge and skills.', 'Social progress does not require education.', 'Education is less important in a complex world.'],
    answer: 1,
    explanation: '"Education serves as the cornerstone of personal development and social progress" = 教育是个人发展和社会进步的基石。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },
  {
    prompt: '理解并翻译：\n\n"The rapid advancement of biotechnology has ushered in an era of unprecedented possibilities for treating previously incurable diseases, yet simultaneously raises complex ethical questions that society has only begun to grapple with."\n\n这段话的主要意思是？',
    options: ['Biotechnology has no ethical implications.', 'Biotechnology offers unprecedented treatment possibilities while raising complex ethical questions.', 'All diseases are now curable.', 'Ethical questions have been fully resolved.'],
    answer: 1,
    explanation: '"Ushered in an era of unprecedented possibilities...yet simultaneously raises complex ethical questions" = 开创了前所未有的可能性，同时引发了复杂的伦理问题。',
    sourceEvent: '水晶终结',
    difficulty: 3,
  },
  {
    prompt: '理解并翻译：\n\n"The disparity in access to quality education between urban and rural areas remains a persistent challenge in many developing countries, perpetuating cycles of poverty and limiting social mobility for millions of children."\n\n这段话描述了什么？',
    options: ['Urban and rural education are equal.', 'The urban-rural education gap perpetuates poverty and limits social mobility.', 'Rural education is better than urban.', 'The education gap has been solved.'],
    answer: 1,
    explanation: '"Disparity in access to quality education...perpetuating cycles of poverty and limiting social mobility" = 教育差距使贫困循环持续并限制社会流动。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },
  {
    prompt: '理解并翻译：\n\n"It is imperative that governments, businesses, and individuals collaborate on a global scale to combat the multifaceted challenges posed by climate change, as unilateral efforts are insufficient to address the scale and complexity of the crisis."\n\n这段话强调了什么？',
    options: ['Countries should act alone.', 'Global collaboration between governments, businesses, and individuals is essential because unilateral efforts are insufficient.', 'Climate change is not a serious issue.', 'Only individuals need to take action.'],
    answer: 1,
    explanation: '"Imperative that governments, businesses, and individuals collaborate on a global scale...unilateral efforts are insufficient" = 政府、企业和个人必须在全球范围内合作。',
    sourceEvent: '水晶终结',
    difficulty: 2,
  },
  {
    prompt: '理解并翻译：\n\n"The proliferation of digital technology has fundamentally reshaped the landscape of interpersonal communication, with the convenience of instant connectivity often coming at the expense of the depth and quality of face-to-face interactions."\n\n这段话的含义是？',
    options: ['Digital technology has no downside.', 'The convenience of digital communication often comes at the cost of deep face-to-face interaction quality.', 'Face-to-face communication has become more convenient.', 'Interpersonal communication quality has improved.'],
    answer: 1,
    explanation: '"Convenience of instant connectivity often coming at the expense of the depth and quality of face-to-face interactions" = 即时连接的便利往往以牺牲面对面交流的深度和质量为代价。',
    sourceEvent: '高地防守',
    difficulty: 3,
  },
  {
    prompt: '理解并翻译：\n\n"Nothing is more crucial for the sustainable development of human society than the transition to clean energy, which holds the key to mitigating climate change and ensuring a livable planet for future generations."\n\n这句话的意思是什么？',
    options: ['Clean energy transition is optional.', 'The transition to clean energy is the most crucial factor for sustainable development and mitigating climate change.', 'Fossil fuels are more important than clean energy.', 'Climate change does not require energy transition.'],
    answer: 1,
    explanation: '"Nothing is more crucial...than the transition to clean energy...holds the key to mitigating climate change" = 向清洁能源转型是最关键的。',
    sourceEvent: '水晶终结',
    difficulty: 2,
  },
  {
    prompt: '理解并翻译：\n\n"The phenomenon of information overload in the digital age has paradoxically made it more difficult for individuals to make well-informed decisions, as the sheer volume of available data often overwhelms rather than empowers."\n\n这段话揭示了什么？',
    options: ['More information always leads to better decisions.', 'Information overload makes it harder to make well-informed decisions because the volume of data overwhelms rather than empowers.', 'Digital age has no impact on decision-making.', 'People make better decisions with more information.'],
    answer: 1,
    explanation: '"Information overload...has...made it more difficult...the sheer volume of available data often overwhelms rather than empowers" = 信息过载使决策更困难，数据量压垮而非赋能。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },
  {
    prompt: '理解并翻译：\n\n"So intertwined are the challenges of poverty, inequality, and environmental degradation that no single issue can be effectively addressed in isolation from the others."\n\n这句话强调了什么？',
    options: ['Each problem can be solved separately.', 'Poverty, inequality, and environmental degradation are interconnected and cannot be solved in isolation.', 'Environmental issues are not related to poverty.', 'Inequality is the only important issue.'],
    answer: 1,
    explanation: '"So intertwined...that no single issue can be effectively addressed in isolation" = 三者紧密交织，任何问题都无法孤立解决。',
    sourceEvent: '水晶终结',
    difficulty: 3,
  },
  {
    prompt: '理解并翻译：\n\n"The preservation of cultural heritage, both tangible and intangible, is not merely an act of nostalgia but a vital investment in the identity, resilience, and creativity of communities facing rapid globalization."\n\n这句话的观点是？',
    options: ['Cultural preservation is just about nostalgia.', 'Preserving cultural heritage is vital for community identity, resilience, and creativity in the face of globalization.', 'Globalization has no impact on culture.', 'Only tangible heritage matters.'],
    answer: 1,
    explanation: '"Not merely an act of nostalgia but a vital investment in the identity, resilience, and creativity of communities" = 不仅仅是怀旧，而是对社区的认同感、韧性和创造力的重要投资。',
    sourceEvent: '高地防守',
    difficulty: 2,
  },
  {
    prompt: '理解并翻译：\n\n"So profound have been the changes wrought by the digital revolution that virtually every aspect of modern life — from how we work and learn to how we form relationships and perceive the world — has been fundamentally transformed."\n\n这句话的意思是？',
    options: ['The digital revolution has had minimal impact.', 'The digital revolution has profoundly transformed nearly every aspect of modern life, including work, learning, relationships, and worldview.', 'Only work has been affected by the digital revolution.', 'Learning methods remain unchanged.'],
    answer: 1,
    explanation: '"So profound have been the changes...virtually every aspect of modern life...has been fundamentally transformed" = 数字革命带来的变化如此深刻，几乎现代生活的方方面面都已被根本性改变。',
    sourceEvent: '水晶终结',
    difficulty: 2,
  },
];

// ============== VOCABULARY QUESTIONS (vocabulary type) ==============
const VOCAB_POOL = [
  { def: '自治的，自主的', word: 'autonomous', difficulty: 2 },
  { def: '催化，促进', word: 'catalyze', difficulty: 3 },
  { def: '核实的，经过验证的', word: 'corroborated', difficulty: 3 },
  { def: '多学科的', word: 'interdisciplinary', difficulty: 2 },
  { def: '不可逆转的', word: 'irreversible', difficulty: 2 },
  { def: '先例的，史无前例的', word: 'unprecedented', difficulty: 2 },
  { def: '脆弱的，易碎的', word: 'fragile', difficulty: 1 },
  { def: '错综复杂的', word: 'intricate', difficulty: 2 },
  { def: '可再生的', word: 'renewable', difficulty: 1 },
  { def: '可持续的', word: 'sustainable', difficulty: 1 },
  { def: '不成比例地', word: 'disproportionately', difficulty: 3 },
  { def: '边缘化的', word: 'marginalized', difficulty: 2 },
  { def: '前所未有的', word: 'unprecedented', difficulty: 1 },
  { def: '合作，协作', word: 'collaboration', difficulty: 1 },
  { def: '综合的，全面的', word: 'comprehensive', difficulty: 2 },
  { def: '中断，停止', word: 'disruption', difficulty: 2 },
  { def: '指数级地', word: 'exponentially', difficulty: 3 },
  { def: '巨大的，庞大的', word: 'immense', difficulty: 1 },
  { def: '不可避免的', word: 'inevitable', difficulty: 1 },
  { def: '创新的, 革新的', word: 'innovative', difficulty: 1 },
  { def: '整合，一体化', word: 'integration', difficulty: 2 },
  { def: '多方面的', word: 'multifaceted', difficulty: 3 },
  { def: '消极的，负面的', word: 'negative', difficulty: 1 },
  { def: '乐观的', word: 'optimistic', difficulty: 1 },
  { def: '范式，典范', word: 'paradigm', difficulty: 2 },
  { def: '两极分化', word: 'polarization', difficulty: 3 },
  { def: '主动的，积极的', word: 'proactive', difficulty: 2 },
  { def: '有争议的', word: 'contentious', difficulty: 3 },
  { def: '波动，动荡', word: 'volatility', difficulty: 2 },
  { def: '倡导者', word: 'advocate', difficulty: 2 },
  { def: '分配，分布', word: 'distribution', difficulty: 1 },
  { def: '显着的，引人注目的', word: 'dramatic', difficulty: 1 },
  { def: '新兴的', word: 'emerging', difficulty: 1 },
  { def: '授权，赋能', word: 'empower', difficulty: 2 },
  { def: '增强，加强', word: 'enhance', difficulty: 1 },
  { def: '创立，建立', word: 'establish', difficulty: 1 },
  { def: '评估，评价', word: 'evaluate', difficulty: 1 },
  { def: '利用，开发', word: 'exploit', difficulty: 2 },
  { def: '波动起伏的', word: 'fluctuating', difficulty: 2 },
  { def: '基础的，根本的', word: 'fundamental', difficulty: 1 },
  { def: '代际的', word: 'intergenerational', difficulty: 3 },
  { def: '内在的，本质的', word: 'inherent', difficulty: 2 },
  { def: '相互作用', word: 'interaction', difficulty: 1 },
  { def: '操纵，控制', word: 'manipulate', difficulty: 2 },
  { def: '缓和，减轻', word: 'mitigate', difficulty: 2 },
  { def: '监督，监管', word: 'oversight', difficulty: 2 },
  { def: '持续存在的', word: 'persistent', difficulty: 2 },
  { def: '激增，扩散', word: 'proliferation', difficulty: 3 },
  { def: '稳健的，强健的', word: 'robust', difficulty: 2 },
  { def: '重大转变', word: 'shift', difficulty: 1 },
  { def: '实质性的', word: 'substantial', difficulty: 1 },
  { def: '充足的，丰富的', word: 'abundant', difficulty: 2 },
  { def: '获得，收购', word: 'acquisition', difficulty: 2 },
  { def: '管理，行政', word: 'administration', difficulty: 2 },
  { def: '先进的', word: 'advanced', difficulty: 1 },
  { def: '归因于', word: 'attribute', difficulty: 2 },
  { def: '分类，归类', word: 'categorize', difficulty: 2 },
  { def: '共存', word: 'coexist', difficulty: 2 },
  { def: '凝聚力', word: 'cohesion', difficulty: 2 },
  { def: '商业化', word: 'commercialization', difficulty: 3 },
  { def: '承诺，投入', word: 'commitment', difficulty: 1 },
  { def: '补偿, 弥补', word: 'compensate', difficulty: 2 },
  { def: '竞争，对手', word: 'competitor', difficulty: 1 },
  { def: '概念，观念', word: 'conception', difficulty: 2 },
  { def: '实施，贯彻执行', word: 'implementation', difficulty: 2 },
  { def: '隐含的，暗示的', word: 'implicit', difficulty: 3 },
  { def: '煽动，激发', word: 'ignite', difficulty: 2 },
  { def: '阻碍；障碍', word: 'impediment', difficulty: 3 },
  { def: '融合，吸收', word: 'assimilation', difficulty: 3 },
  { def: '扩大，放大', word: 'amplify', difficulty: 2 },
  { def: '对抗，缓解', word: 'counteract', difficulty: 3 },
  { def: '关键的，决定性的', word: 'crucial', difficulty: 1 },
  { def: '辩论，争论', word: 'debate', difficulty: 1 },
  { def: '下降，衰退', word: 'decline', difficulty: 1 },
  { def: '提倡，主张', word: 'advocacy', difficulty: 2 },
  { def: '联盟，同盟', word: 'alliance', difficulty: 2 },
  { def: '焦虑的，不安的', word: 'apprehensive', difficulty: 3 },
  { def: '断言，主张', word: 'assert', difficulty: 2 },
  { def: '评估，估价', word: 'assessment', difficulty: 2 },
  { def: '假定，假设', word: 'assumption', difficulty: 2 },
  { def: '归属，归因', word: 'attribution', difficulty: 3 },
  { def: '促进，培育', word: 'foster', difficulty: 2 },
  { def: '生成，产生', word: 'generate', difficulty: 1 },
  { def: '全球的', word: 'global', difficulty: 1 },
  { def: '同质化', word: 'homogenization', difficulty: 3 },
  { def: '假设，假定', word: 'hypothesis', difficulty: 2 },
  { def: '识别，认同', word: 'identification', difficulty: 2 },
  { def: '不活跃，久坐', word: 'inactivity', difficulty: 2 },
  { def: '事件，事故', word: 'incident', difficulty: 1 },
  { def: '收入，收益', word: 'income', difficulty: 1 },
  { def: '表明，暗示', word: 'indicate', difficulty: 1 },
  { def: '个人，个体', word: 'individual', difficulty: 1 },
  { def: '诱导，引发', word: 'induce', difficulty: 2 },
  { def: '不平等的', word: 'inequitable', difficulty: 3 },
  { def: '推断', word: 'inference', difficulty: 3 },
  { def: '告知，通知', word: 'inform', difficulty: 1 },
  { def: '基础设施', word: 'infrastructure', difficulty: 2 },
  { def: '固有的，与生俱来的', word: 'innate', difficulty: 3 },
  { def: '创新，革新', word: 'innovation', difficulty: 1 },
  { def: '制度；机构', word: 'institution', difficulty: 1 },
  { def: '工具性的，有帮助的', word: 'instrumental', difficulty: 3 },
  { def: '充足的', word: 'adequate', difficulty: 1 },
  { def: '公认的，被广泛接受的', word: 'established', difficulty: 2 },
  { def: '伦理的，道德的', word: 'ethical', difficulty: 2 },
  { def: '最终，归根结底', word: 'ultimately', difficulty: 1 },
  { def: '普遍的', word: 'prevalent', difficulty: 2 },
  { def: '首要的，主要的', word: 'primary', difficulty: 1 },
  { def: '原则', word: 'principle', difficulty: 1 },
  { def: '优先级', word: 'priority', difficulty: 1 },
  { def: '收益的，盈利的', word: 'profitable', difficulty: 2 },
  { def: '深刻的，深远的', word: 'profound', difficulty: 2 },
  { def: '设想', word: 'envision', difficulty: 2 },
  { def: '根除，消灭', word: 'eradicate', difficulty: 3 },
  { def: '必要的', word: 'essential', difficulty: 1 },
  { def: '加剧，恶化', word: 'exacerbate', difficulty: 3 },
  { def: '范例', word: 'exemplify', difficulty: 2 },
  { def: '扩展，扩张', word: 'expansion', difficulty: 1 },
  { def: '暴露', word: 'exposure', difficulty: 1 },
  { def: '外在的', word: 'external', difficulty: 2 },
  { def: '可行的', word: 'feasible', difficulty: 2 },
  { def: '波动', word: 'fluctuation', difficulty: 2 },
  { def: '预测，预报', word: 'forecast', difficulty: 2 },
  { def: '框架', word: 'framework', difficulty: 1 },
  { def: '摩擦，冲突', word: 'friction', difficulty: 2 },
  { def: '愤怒，愤慨', word: 'indignation', difficulty: 3 },
  { def: '不可避免的', word: 'unavoidable', difficulty: 2 },
  { def: '潜在的', word: 'underlying', difficulty: 2 },
  { def: '承担', word: 'undertake', difficulty: 2 },
  { def: '巨大的', word: 'tremendous', difficulty: 1 },
  { def: '引发，触发', word: 'trigger', difficulty: 2 },
  { def: '最终地', word: 'ultimately', difficulty: 1 },
  { def: '冲突的，矛盾的', word: 'conflicting', difficulty: 2 },
  { def: '后果', word: 'consequence', difficulty: 1 },
  { def: '因此，从而', word: 'consequently', difficulty: 1 },
  { def: '保护', word: 'conservation', difficulty: 2 },
  { def: '大量的', word: 'considerable', difficulty: 1 },
  { def: '限制，约束', word: 'constraint', difficulty: 2 },
  { def: '消耗，消费', word: 'consumption', difficulty: 1 },
  { def: '污染', word: 'contamination', difficulty: 2 },
  { def: '矛盾的', word: 'contradictory', difficulty: 2 },
  { def: '贡献', word: 'contribute', difficulty: 1 },
  { def: '争议', word: 'controversy', difficulty: 2 },
  { def: '趋同，汇集', word: 'convergence', difficulty: 3 },
  { def: '令人信服的', word: 'convincing', difficulty: 2 },
  { def: '合作', word: 'cooperative', difficulty: 1 },
  { def: '应对，处理', word: 'cope', difficulty: 1 },
  { def: '相关的', word: 'corresponding', difficulty: 2 },
  { def: '有创造力的', word: 'creative', difficulty: 1 },
  { def: '标准，准则', word: 'criterion', difficulty: 2 },
  { def: '关键的，决定性的', word: 'critical', difficulty: 1 },
  { def: '耕作，培养', word: 'cultivate', difficulty: 2 },
  { def: '积累', word: 'accumulate', difficulty: 2 },
  { def: '准确的', word: 'accurate', difficulty: 1 },
  { def: '成就，成绩', word: 'achievement', difficulty: 1 },
  { def: '承认', word: 'acknowledge', difficulty: 2 },
  { def: '收购', word: 'acquire', difficulty: 2 },
  { def: '适应性', word: 'adaptability', difficulty: 2 },
  { def: '充足的', word: 'adequate', difficulty: 1 },
  { def: '调整', word: 'adjustment', difficulty: 1 },
  { def: '采纳，采用', word: 'adoption', difficulty: 2 },
  { def: '先进的', word: 'advanced', difficulty: 1 },
  { def: '逆境', word: 'adversity', difficulty: 2 },
  { def: '倡导，提倡', word: 'advocate', difficulty: 2 },
  { def: '审美，美学', word: 'aesthetic', difficulty: 3 },
  { def: '情感，感情', word: 'affection', difficulty: 1 },
  { def: '聚合，集合', word: 'aggregate', difficulty: 3 },
  { def: '侵略的，有进取心的', word: 'aggressive', difficulty: 2 },
  { def: '敏捷的', word: 'agile', difficulty: 2 },
  { def: '分配', word: 'allocate', difficulty: 2 },
  { def: '选择，替代方案', word: 'alternative', difficulty: 1 },
  { def: '雄心壮志', word: 'ambition', difficulty: 1 },
  { def: '可适用的', word: 'applicable', difficulty: 2 },
  { def: '任命', word: 'appointment', difficulty: 1 },
  { def: '鉴赏，感激', word: 'appreciation', difficulty: 2 },
  { def: '适当的', word: 'appropriate', difficulty: 1 },
  { def: '任意的', word: 'arbitrary', difficulty: 2 },
  { def: '唤醒，引起', word: 'arouse', difficulty: 2 },
  { def: '人为的', word: 'artificial', difficulty: 1 },
  { def: '提升，提高', word: 'ascend', difficulty: 2 },
  { def: '方面', word: 'aspect', difficulty: 1 },
  { def: '渴望，志向', word: 'aspiration', difficulty: 2 },
  { def: '组装，集合', word: 'assemble', difficulty: 2 },
  { def: '评估', word: 'assess', difficulty: 1 },
  { def: '资产', word: 'asset', difficulty: 1 },
  { def: '同化', word: 'assimilate', difficulty: 3 },
  { def: '假设', word: 'assume', difficulty: 1 },
  { def: '保证，确保', word: 'ensure', difficulty: 1 },
  { def: '企业，事业', word: 'enterprise', difficulty: 2 },
  { def: '本质', word: 'essence', difficulty: 2 },
  { def: '评价', word: 'evaluation', difficulty: 1 },
  { def: '证据', word: 'evidence', difficulty: 1 },
  { def: '演变，进化', word: 'evolution', difficulty: 2 },
  { def: '夸大', word: 'exaggerate', difficulty: 2 },
  { def: '卓越的', word: 'excellent', difficulty: 1 },
  { def: '例外', word: 'exception', difficulty: 1 },
  { def: '过剩的', word: 'excessive', difficulty: 2 },
  { def: '交换，交流', word: 'exchange', difficulty: 1 },
  { def: '排他的', word: 'exclusive', difficulty: 2 },
  { def: '执行，实施', word: 'execute', difficulty: 2 },
  { def: '消耗，耗尽', word: 'exhaust', difficulty: 2 },
  { def: '展示', word: 'exhibit', difficulty: 1 },
  { def: '期望', word: 'expectation', difficulty: 1 },
  { def: '开支', word: 'expenditure', difficulty: 2 },
  { def: '专门知识', word: 'expertise', difficulty: 2 },
  { def: '明确的', word: 'explicit', difficulty: 2 },
  { def: '开发，开采', word: 'exploration', difficulty: 1 },
  { def: '爆炸性的', word: 'explosive', difficulty: 2 },
  { def: '接触，暴露', word: 'exposure', difficulty: 1 },
  { def: '延长，扩展', word: 'extend', difficulty: 1 },
  { def: '广泛的', word: 'extensive', difficulty: 1 },
  { def: '外部的', word: 'external', difficulty: 1 },
  { def: '提取', word: 'extract', difficulty: 2 },
  { def: '非凡的', word: 'extraordinary', difficulty: 1 },
  { def: '促进', word: 'facilitate', difficulty: 2 },
  { def: '因素', word: 'factor', difficulty: 1 },
  { def: '繁荣', word: 'flourish', difficulty: 2 },
  { def: '聚焦，集中', word: 'focus', difficulty: 1 },
  { def: '前兆', word: 'forecast', difficulty: 2 },
  { def: '外表', word: 'external', difficulty: 1 },
  { def: '预测', word: 'foresee', difficulty: 2 },
  { def: '基础', word: 'foundation', difficulty: 1 },
  { def: '摩擦', word: 'friction', difficulty: 2 },
  { def: '完成', word: 'fulfill', difficulty: 1 },
  { def: '功能', word: 'function', difficulty: 1 },
  { def: '资金', word: 'funding', difficulty: 1 },
  { def: '融合，合并', word: 'fusion', difficulty: 2 },
  { def: '一代，产生', word: 'generation', difficulty: 1 },
  { def: '巨大的', word: 'enormous', difficulty: 1 },
  { def: '丰富的', word: 'enrich', difficulty: 1 },
  { def: '确保', word: 'ensure', difficulty: 1 },
  { def: '企业', word: 'enterprise', difficulty: 2 },
  { def: '娱乐', word: 'entertainment', difficulty: 1 },
  { def: '整体，实体', word: 'entity', difficulty: 2 },
  { def: '企业家', word: 'entrepreneur', difficulty: 2 },
  { def: '环境', word: 'environment', difficulty: 1 },
  { def: '公平', word: 'equity', difficulty: 2 },
  { def: '相当于', word: 'equivalent', difficulty: 2 },
  { def: '侵蚀', word: 'erosion', difficulty: 3 },
  { def: '基本的', word: 'essential', difficulty: 1 },
  { def: '建立', word: 'establish', difficulty: 1 },
  { def: '估计', word: 'estimate', difficulty: 1 },
  { def: '永久的', word: 'permanent', difficulty: 1 },
  { def: '允许，许可', word: 'permission', difficulty: 1 },
  { def: '持续', word: 'persist', difficulty: 2 },
  { def: '个性，人格', word: 'personality', difficulty: 1 },
  { def: '说服', word: 'persuade', difficulty: 1 },
  { def: '现象', word: 'phenomenon', difficulty: 2 },
  { def: '哲学的', word: 'philosophical', difficulty: 2 },
  { def: '试点', word: 'pilot', difficulty: 2 },
  { def: '潜力', word: 'potential', difficulty: 1 },
  { def: '务实的', word: 'pragmatic', difficulty: 3 },
  { def: '先例', word: 'precedent', difficulty: 3 },
  { def: '精确的', word: 'precise', difficulty: 1 },
  { def: '预测', word: 'predict', difficulty: 1 },
  { def: '倾向', word: 'predisposition', difficulty: 3 },
  { def: '占主导地位的', word: 'dominant', difficulty: 2 },
  { def: '戏剧性的', word: 'dramatic', difficulty: 1 },
  { def: '持久的', word: 'enduring', difficulty: 2 },
  { def: '精力充沛的', word: 'energetic', difficulty: 1 },
  { def: '参与', word: 'engage', difficulty: 1 },
  { def: '巨大的', word: 'enormous', difficulty: 1 },
  { def: '丰富的', word: 'enrich', difficulty: 1 },
  { def: '确保', word: 'ensure', difficulty: 1 },
  { def: '企业', word: 'enterprise', difficulty: 2 },
  { def: '积极性', word: 'initiative', difficulty: 2 },
  { def: '创新', word: 'innovation', difficulty: 1 },
  { def: '投入，输入', word: 'input', difficulty: 1 },
  { def: '洞察力', word: 'insight', difficulty: 2 },
  { def: '检查', word: 'inspection', difficulty: 1 },
  { def: '不稳定', word: 'instability', difficulty: 2 },
  { def: '安装', word: 'install', difficulty: 1 },
  { def: '本能', word: 'instinct', difficulty: 2 },
  { def: '制度', word: 'institution', difficulty: 1 },
  { def: '工具', word: 'instrument', difficulty: 1 },
  { def: '保险', word: 'insurance', difficulty: 1 },
  { def: '整合', word: 'integrate', difficulty: 2 },
  { def: '诚信', word: 'integrity', difficulty: 2 },
  { def: '智力', word: 'intellectual', difficulty: 2 },
  { def: '激烈的', word: 'intense', difficulty: 1 },
  { def: '互相作用', word: 'interact', difficulty: 1 },
  { def: '学科间的', word: 'interdisciplinary', difficulty: 3 },
  { def: '干涉', word: 'interfere', difficulty: 2 },
  { def: '中间的', word: 'intermediate', difficulty: 2 },
  { def: '间歇', word: 'intermittent', difficulty: 3 },
  { def: '解释', word: 'interpretation', difficulty: 2 },
  { def: '打断', word: 'interrupt', difficulty: 1 },
  { def: '干预', word: 'intervention', difficulty: 2 },
  { def: '亲密的', word: 'intimate', difficulty: 2 },
  { def: '复杂的', word: 'intricate', difficulty: 2 },
  { def: '直觉', word: 'intuition', difficulty: 2 },
  { def: '创造', word: 'creation', difficulty: 1 },
  { def: '危急的', word: 'critical', difficulty: 1 },
  { def: '文化', word: 'culture', difficulty: 1 },
  { def: '积累', word: 'cumulative', difficulty: 2 },
  { def: '习俗', word: 'custom', difficulty: 1 },
  { def: '数据', word: 'data', difficulty: 1 },
  { def: '辩论', word: 'debate', difficulty: 1 },
  { def: '数十年', word: 'decade', difficulty: 1 },
  { def: '衰落', word: 'decline', difficulty: 1 },
  { def: '不足', word: 'deficiency', difficulty: 2 },
  { def: '明确的', word: 'definite', difficulty: 1 },
  { def: '退化', word: 'degradation', difficulty: 3 },
  { def: '授权', word: 'delegate', difficulty: 2 },
  { def: '民主', word: 'democracy', difficulty: 2 },
  { def: '描述', word: 'depict', difficulty: 2 },
  { def: '萧条', word: 'depression', difficulty: 1 },
  { def: '衍生的', word: 'derivative', difficulty: 3 },
  { def: '尽管', word: 'despite', difficulty: 1 },
  { def: '毁灭', word: 'destruction', difficulty: 1 },
  { def: '检测', word: 'detect', difficulty: 1 },
  { def: '恶化', word: 'deteriorate', difficulty: 3 },
  { def: '确定', word: 'determine', difficulty: 1 },
  { def: '发展中国家', word: 'developing', difficulty: 1 },
  { def: '偏差', word: 'deviation', difficulty: 3 },
  { def: '诊断', word: 'diagnose', difficulty: 2 },
  { def: '对话', word: 'dialogue', difficulty: 1 },
  { def: '二分法', word: 'dichotomy', difficulty: 3 },
  { def: '不同', word: 'differ', difficulty: 1 },
  { def: '扩散', word: 'diffusion', difficulty: 3 },
  { def: '数字的', word: 'digital', difficulty: 1 },
  { def: '维度', word: 'dimension', difficulty: 2 },
  { def: '直接的', word: 'direct', difficulty: 1 },
  { def: '劣势', word: 'disadvantage', difficulty: 1 },
  { def: '灾难', word: 'disaster', difficulty: 1 },
  { def: '纪律', word: 'discipline', difficulty: 1 },
  { def: '揭露', word: 'disclose', difficulty: 2 },
  { def: '折扣', word: 'discount', difficulty: 1 },
  { def: '歧视', word: 'discrimination', difficulty: 2 },
  { def: '讨论', word: 'discussion', difficulty: 1 },
  { def: '疾病', word: 'disease', difficulty: 1 },
  { def: '失望', word: 'disillusionment', difficulty: 3 },
  { def: '无视', word: 'disregard', difficulty: 3 },
  { def: '扰乱', word: 'disrupt', difficulty: 2 },
  { def: '遥远的', word: 'distant', difficulty: 1 },
  { def: '鲜明的', word: 'distinct', difficulty: 1 },
  { def: '区分', word: 'distinguish', difficulty: 1 },
  { def: '扭曲', word: 'distortion', difficulty: 3 },
  { def: '分布', word: 'distribution', difficulty: 2 },
  { def: '多样性', word: 'diversity', difficulty: 1 },
  { def: '分离', word: 'division', difficulty: 1 },
  { def: '统治', word: 'dominate', difficulty: 1 },
  { def: '捐赠', word: 'donation', difficulty: 1 },
  { def: '草案', word: 'draft', difficulty: 1 },
  { def: '驱动', word: 'drive', difficulty: 1 },
  { def: '干旱', word: 'drought', difficulty: 2 },
  { def: '持久的', word: 'durable', difficulty: 2 },
];

// ============== PACK GENERATION ==============
const ALL_VOCAB_WORDS = VOCAB_POOL.map(e => e.word);
const ALL_WORDS_SET = new Set(ALL_VOCAB_WORDS);

function genVocabQuestions(pool, sourceEvents, count) {
  const shuffled = shuffle(pool).slice(0, count);
  return shuffled.map((item, i) => {
    const others = pool.filter(e => e.word !== item.word).map(e => e.word);
    const wrongWords = shuffle(others).slice(0, 3);
    const allOptions = shuffle([item.word, ...wrongWords]);
    const correctIndex = allOptions.indexOf(item.word);
    return {
      type: 'vocabulary',
      prompt: `选择与「${item.def}」对应的英文单词：`,
      options: allOptions,
      answer: correctIndex,
      explanation: `${item.word} 意为「${item.def}」。`,
      sourceEvent: sourceEvents[i % sourceEvents.length],
      difficulty: item.difficulty,
    };
  });
}

function genSentenceQuestions(pool, count) {
  return shuffle(pool).slice(0, count).map(item => ({
    type: 'sentence',
    prompt: item.prompt,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation,
    sourceEvent: item.sourceEvent,
    difficulty: item.difficulty,
  }));
}

function genShortReadingQuestions(pool, count) {
  return shuffle(pool).slice(0, count).map(item => ({
    type: 'shortReading',
    prompt: `阅读下文回答问题：\n\n"${item.passage}"\n\n${item.prompt}`,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation,
    sourceEvent: item.sourceEvent,
    difficulty: item.difficulty,
  }));
}

function genReadingGroupQuestions(group, packIndex, groupIndex) {
  return group.questions.map((q, qi) => ({
    type: 'readingGroup',
    groupId: group.groupId,
    passage: `阅读下面文章，回答3个问题：\n\n"${group.passage}"`,
    prompt: q.prompt,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    sourceEvent: q.sourceEvent,
    difficulty: q.difficulty,
  }));
}

function genTranslationQuestions(pool, count) {
  return shuffle(pool).slice(0, count).map(item => ({
    type: 'translation',
    prompt: item.prompt,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation,
    sourceEvent: item.sourceEvent,
    difficulty: item.difficulty,
  }));
}

// ============== BUILD PACKS ==============
const packs = [];

// Pack 1: Sentence-heavy + vocabulary
const pack1Questions = [
  ...genSentenceQuestions(SENTENCE_POOL, 20).map(q => ({ ...q, id: undefined })),
  ...genShortReadingQuestions(SHORT_READING_POOL, 10).map(q => ({ ...q, id: undefined })),
  ...genVocabQuestions(VOCAB_POOL, ['对线补兵', '敌方消耗', '1v1单杀'], 70).map(q => ({ ...q, id: undefined })),
];
packs.push({
  packId: 'exam-001',
  version: 1,
  title: '六级真题风格扩展包 #1',
  description: '100 道CET-6真题风格题（句子理解+短阅读+词汇）',
  questions: [],
});

// Pack 2: Reading groups + translation + vocabulary
const pack2Questions = [
  ...READING_GROUPS.slice(0, 2).flatMap(g => genReadingGroupQuestions(g, 2, 0)).map(q => ({ ...q, id: undefined })),
  ...genTranslationQuestions(TRANSLATION_POOL, 6).map(q => ({ ...q, id: undefined })),
  ...genSentenceQuestions(SENTENCE_POOL, 14).map(q => ({ ...q, id: undefined })),
  ...genVocabQuestions(VOCAB_POOL, ['对线补兵', '敌方消耗', '1v1单杀'], 50).map(q => ({ ...q, id: undefined })),
];
packs.push({
  packId: 'exam-002',
  version: 1,
  title: '六级真题风格扩展包 #2',
  description: '100 道CET-6真题风格题（阅读组+翻译+句子+词汇）',
  questions: [],
});

// Pack 3: Short reading + vocabulary + reading groups
const pack3Questions = [
  ...genShortReadingQuestions(SHORT_READING_POOL, 10).map(q => ({ ...q, id: undefined })),
  ...READING_GROUPS.slice(2, 4).flatMap(g => genReadingGroupQuestions(g, 3, 2)).map(q => ({ ...q, id: undefined })),
  ...genVocabQuestions(VOCAB_POOL, ['对线补兵', '敌方消耗', '1v1单杀'], 60).map(q => ({ ...q, id: undefined })),
  ...genSentenceQuestions(SENTENCE_POOL, 6).map(q => ({ ...q, id: undefined })),
];
packs.push({
  packId: 'exam-003',
  version: 1,
  title: '六级真题风格扩展包 #3',
  description: '100 道CET-6真题风格题（短阅读+阅读组+词汇+句子）',
  questions: [],
});

// Pack 4: Reading group + translation + sentence
const pack4Questions = [
  ...READING_GROUPS.slice(4).flatMap(g => genReadingGroupQuestions(g, 4, 4)).map(q => ({ ...q, id: undefined })),
  ...genTranslationQuestions(TRANSLATION_POOL, 4).map(q => ({ ...q, id: undefined })),
  ...genSentenceQuestions(SENTENCE_POOL, 10).map(q => ({ ...q, id: undefined })),
  ...genVocabQuestions(VOCAB_POOL, ['对线补兵', '敌方消耗', '1v1单杀'], 60).map(q => ({ ...q, id: undefined })),
];
packs.push({
  packId: 'exam-004',
  version: 1,
  title: '六级真题风格扩展包 #4',
  description: '100 道CET-6真题风格题（阅读组+翻译+句子+词汇）',
  questions: [],
});

// Pack 5: All-around mix
const pack5Questions = [
  ...genSentenceQuestions(SENTENCE_POOL, 15).map(q => ({ ...q, id: undefined })),
  ...genShortReadingQuestions(SHORT_READING_POOL, 10).map(q => ({ ...q, id: undefined })),
  ...genTranslationQuestions(TRANSLATION_POOL, 5).map(q => ({ ...q, id: undefined })),
  ...genVocabQuestions(VOCAB_POOL, ['对线补兵', '敌方消耗', '1v1单杀'], 70).map(q => ({ ...q, id: undefined })),
];
packs.push({
  packId: 'exam-005',
  version: 1,
  title: '六级真题风格扩展包 #5',
  description: '100 道CET-6真题风格题（综合混合）',
  questions: [],
});

// Assign IDs and finalize
for (let pi = 0; pi < packs.length; pi++) {
  const pack = packs[pi];
  const allQuestions = [pack1Questions, pack2Questions, pack3Questions, pack4Questions, pack5Questions][pi];
  pack.questions = allQuestions.map((q, qi) => ({
    ...q,
    id: `exam_${String(pi + 1).padStart(2, '0')}_${String(qi + 1).padStart(4, '0')}`,
  }));
}

// Write packs
mkdirSync(PACKS_DIR, { recursive: true });
for (const pack of packs) {
  const filePath = join(PACKS_DIR, `${pack.packId}.json`);
  writeFileSync(filePath, JSON.stringify(pack, null, 2), 'utf-8');
  const types = {};
  for (const q of pack.questions) {
    types[q.type] = (types[q.type] || 0) + 1;
  }
  console.log(`${pack.packId}.json → ${pack.questions.length} questions (${Object.entries(types).map(([k, v]) => `${k}: ${v}`).join(', ')})`);
}

// Update manifest — replace any existing exam packs, keep vocab packs
const manifestPath = join(PACKS_DIR, 'manifest.json');
const oldManifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const newPackIds = new Set(packs.map(p => p.packId));
oldManifest.packs = oldManifest.packs.filter(p => !newPackIds.has(p.id));
for (const pack of packs) {
  oldManifest.packs.push({
    id: pack.packId,
    version: pack.version,
    title: pack.title,
    description: pack.description,
    questionCount: pack.questions.length,
  });
}
oldManifest.version = (oldManifest.version || 0) + 1;
writeFileSync(manifestPath, JSON.stringify(oldManifest, null, 2), 'utf-8');
console.log(`\nmanifest.json updated: ${oldManifest.packs.length} packs total`);

const totalQs = packs.reduce((s, p) => s + p.questions.length, 0);
console.log(`\nGenerated ${packs.length} new packs with ${totalQs} total questions!`);
