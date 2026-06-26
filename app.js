/**
 * The Week of Us - Couple Evaluation Rubric Client Application
 */

// ==========================================================================
// 1. Dynamic Rubric Definition & Chinese Rephrasing (Couple-Cozy Terminology)
// ==========================================================================

const SCORE_DESCRIPTIONS = {
  1: "严重缺失，或明知有问题仍持续回避、违反",
  2: "多次没有做到，已经影响关系体验",
  3: "基本做到，但稳定性或主动性不足",
  4: "整体较好，偶有不足但能及时调整",
  5: "做得非常好，有主动、稳定且具体的表现"
};

// 10 Relationship qualities for Self-eval and Partner-eval
const BEHAVIORAL_ITEMS = [
  {
    id: "respect",
    name: "尊重边界",
    selfName: "把TA的话当回事",
    partnerName: "把我的话当回事",
    selfHint: "我认真听取TA的想法和边界，不强迫、施压、替TA做决定",
    partnerHint: "TA认真听取我的想法和边界，不强迫、施压、替我做决定",
    selfQuestion: "我这周有没有把TA的话当回事，尊重TA的边界，不强迫或替TA做决定？",
    partnerQuestion: "TA这周有没有把我的话当回事，尊重我的边界，不强迫或替我做决定？",
    selfDesc: {
      1: "完全忽视TA的底线，强迫或代替TA做决定",
      2: "多次敷衍TA的要求，或决策时态度有些强硬",
      3: "基本能听进去，但主动尊重边界的意识不够",
      4: "整体做得较好，能体恤TA的独立想法和隐私",
      5: "极度尊重TA的边界，事事商量，让TA充分自主"
    },
    partnerDesc: {
      1: "完全被TA无视或强加意志，我的边界被践踏",
      2: "我的想法常被TA敷衍，做决定时很少问我意见",
      3: "TA基本能尊重我，但偶尔仍需我强力声明底线",
      4: "TA整体做得很好，体贴我的喜好且极少越界",
      5: "TA极度尊重我的边界，事事商量并以我的舒适为先"
    }
  },
  {
    id: "comm",
    name: "好好沟通",
    selfName: "有话和TA好好说",
    partnerName: "有话和我好好说",
    selfHint: "我愿意把事情说清楚，不冷暴力、讽刺、羞辱、威胁或故意激怒TA",
    partnerHint: "TA愿意把事情说清楚，不冷暴力、讽刺、羞辱、威胁或故意激怒我",
    selfQuestion: "我这周遇到摩擦时有没有和TA好好沟通，控制住赌气冷战或用言语伤害TA的念头？",
    partnerQuestion: "TA这周遇到摩擦时有没有和我好好沟通，不冷战、不讽刺或故意激怒我？",
    selfDesc: {
      1: "频繁使用冷暴力、嘲讽、威胁或言语攻击",
      2: "情绪上来时故意不理TA，或说了带刺难听的话",
      3: "遇到分歧能表达但容易带情绪，缺乏主动沟通",
      4: "整体温和，能平心静气说明原因，偶有急躁",
      5: "沟通极其温柔坦诚，坚决不冷战，能拥抱TA的情绪"
    },
    partnerDesc: {
      1: "TA对我频繁冷暴力，嘲讽、贬低或言语伤害",
      2: "有摩擦时TA故意不理我，或者说话语气带刺",
      3: "TA能和我沟通但有些情绪化，缺乏心平气和",
      4: "TA整体能温和沟通，偶尔急躁但能及时软化",
      5: "TA极其温柔坦诚，绝不冷战，引导我一起把话聊透"
    }
  },
  {
    id: "consensus",
    name: "说到做到",
    selfName: "说到做到不掉链子",
    partnerName: "说到做到不掉链子",
    selfHint: "我能履行已经达成的约定；无法做到时会提前说明并重新协商",
    partnerHint: "TA能履行已经达成的约定；无法做到时会提前说明并重新协商",
    selfQuestion: "我们定好的规矩或约定，我这周有没有说到做到不掉链子？做不到时有没有提前说明？",
    partnerQuestion: "我们约定好的事情，TA这周有没有靠谱履行、说到做到不掉链子？",
    selfDesc: {
      1: "彻底把约定当儿戏，掉链子且事后毫无交代",
      2: "数次违背承诺或丢三落四，让TA感到被放鸽子",
      3: "基本能做到，但偶尔会忘，或没提前主动说明",
      4: "约定好的事情整体能搞定，偶有突发也能及时重商",
      5: "事事有回音，承诺的事无一掉链子，让人极度踏实"
    },
    partnerDesc: {
      1: "TA完全不守信用，答应的事情全部泡汤且无交代",
      2: "TA多次违背我们的承诺，让我觉得不被重视",
      3: "TA基本能信守诺言，但偶尔还是需要我反复提醒",
      4: "TA答应我的大部分都能做到，有意外也会告知",
      5: "TA靠谱度爆表，答应的事情事事有落实且交代清楚"
    }
  },
  {
    id: "honest",
    name: "坦诚相待",
    selfName: "坦坦荡荡不隐瞒",
    partnerName: "坦坦荡荡不隐瞒",
    selfHint: "我不隐瞒会影响关系的重要信息，不用谎言逃避责任",
    partnerHint: "TA不隐瞒会影响关系的重要信息，不用谎言逃避责任",
    selfQuestion: "我这周对TA是否坦坦荡荡，没有隐瞒任何会影响感情的重要事，不用谎言逃避？",
    partnerQuestion: "TA这周对我是否坦坦荡荡，没有任何会影响我们感情的隐瞒，真诚面对我？",
    selfDesc: {
      1: "故意隐瞒严重事情，或被识破后继续编造谎言",
      2: "出于防备隐瞒了一些敏感事，心存戒备不坦白",
      3: "虽然不主动骗人，但在坦白心事时仍有保留",
      4: "整体坦荡，重要事情都向TA报备，几乎无隐瞒",
      5: "100%毫无防备的赤诚，内心想法都对TA清澈坦白"
    },
    partnerDesc: {
      1: "TA对我隐瞒重大事情，被发现后仍试图编谎",
      2: "我感觉TA隐瞒了一些敏感事，不愿对我敞开心扉",
      3: "TA没有说谎，但有些个人私事TA似乎刻意回避",
      4: "TA整体坦白，重大的财务、社交等都主动交代",
      5: "TA对我毫无保留，连内心深处的脆弱与小秘密都分享"
    }
  },
  {
    id: "confront",
    name: "直面问题",
    selfName: "直面问题不装死",
    partnerName: "直面问题不装死",
    selfHint: "出现矛盾时我不消失、不敷衍，愿意和TA讨论真正的问题",
    partnerHint: "出现矛盾时TA不消失、不敷衍，愿意和我讨论真正的问题",
    selfQuestion: "闹别扭时，我有没有主动站出来直面核心分歧，而不是当做没事发生一样装死逃避？",
    partnerQuestion: "出现摩擦或冷战时，TA有没有正面沟通，而不是消极敷衍或当没事发生一样装死逃避？",
    selfDesc: {
      1: "遇事绝对装死消失，一沟通就退缩敷衍或挂断电话",
      2: "矛盾发生时习惯性回避不谈，或者当没事发生",
      3: "被动配合讨论问题，但不会主动挑起解决的话头",
      4: "发生分歧能直面剖析，偶有情绪时会缓一缓再谈",
      5: "以极大勇气直面我们的分歧，绝不冷处理或敷衍"
    },
    partnerDesc: {
      1: "遇事TA绝对装死消失，拒绝沟通且消极抵抗",
      2: "发生冲突TA就假装没事，或者顾左右而言他",
      3: "我推着TA去聊TA才肯开口，态度有些勉强被动",
      4: "TA能正面回应矛盾并与我探讨，偶尔需要点时间",
      5: "TA非常有担当，主动邀请我深层谈话，绝不当逃兵"
    }
  },
  {
    id: "repair",
    name: "主动修复",
    selfName: "主动给台阶与修复",
    partnerName: "主动给台阶与修复",
    selfHint: "我不执着于争输赢对错，能够道歉、调整，并和TA一起寻找可执行的方案",
    partnerHint: "TA不执着于争输赢对错，能够道歉、调整，并和我一起寻找可执行的方案",
    selfQuestion: "吵架以后，我有没有主动给台阶下，先退一步积极寻求解决和修复，不执着于争输赢？",
    partnerQuestion: "发生争执后，TA是否愿意主动作出修复，给台阶下，不执着于非要分个对错输赢？",
    selfDesc: {
      1: "吵架后顽固不化，拼死坚持自己没错，拒绝台阶",
      2: "冷脸等TA来哄我，即使自己错了也不肯先开口",
      3: "接受TA给的台阶，但自己很少做主动和解的那一方",
      4: "能主动哄TA或道歉，妥协和退让的姿态比较温和",
      5: "绝不纠结输赢，发现气氛不对立即送上拥抱与台阶"
    },
    partnerDesc: {
      1: "争执后TA极度固执，非要我道歉，完全不让步",
      2: "TA只等着我去哄，自己错在先也绝对不低头",
      3: "我主动找TA和解时TA愿意接受，但TA自己不主动",
      4: "TA能主动逗我开心、缓和气氛，或者向我真诚道歉",
      5: "TA是和解大师，总是先一步抱住我，把爱放在第一位"
    }
  },
  {
    id: "accept",
    name: "包容接纳",
    selfName: "抱抱TA的不完美",
    partnerName: "抱抱我的不完美",
    selfHint: "我能接受TA的缺点、情绪和差异，不要求TA完全按照我的期待改变",
    partnerHint: "TA能接受我的缺点、情绪和差异，不要求我完全按照其期待改变",
    selfQuestion: "我这周有没有接纳TA的缺点、情绪和差异，抱抱TA的不完美，而不是一味挑剔或强求TA改变？",
    partnerQuestion: "TA这周有没有接纳我的缺点、情绪和不足，抱抱我的不完美，而不是挑剔或急着改变我？",
    selfDesc: {
      1: "极度挑剔和嫌弃TA的缺点，不断否定指责和嫌恶TA",
      2: "习惯拿自己的标准要求TA，经常唠叨要TA改这改那",
      3: "努力克制嫌弃的心态，但有时还是忍不住会抱怨指责",
      4: "能接纳TA的普通与缺点，允许TA用TA的节奏生活",
      5: "全然爱着TA的不完美，包容TA的怪癖，从不强求"
    },
    partnerDesc: {
      1: "TA对我百般嫌弃，挑刺我的外貌、性格或能力",
      2: "TA试图控制和改造我，总数落我这做得不够那不对",
      3: "TA基本能容忍我，但在我暴露出弱点时TA仍显烦躁",
      4: "TA能尊重我的生活习惯和性格缺点，不挑我的刺",
      5: "TA爱我最真实、最不完美的模样，让我感到被全然拥抱"
    }
  },
  {
    id: "care",
    name: "用心付出",
    selfName: "用心疼爱与付出",
    partnerName: "用心疼爱与付出",
    selfHint: "我会关注TA的感受与需求，用实际行动体贴和照顾TA",
    partnerHint: "TA会关注我的感受与需求，用实际行动体贴和照顾我",
    selfQuestion: "我这周有没有用心疼爱TA、关注TA的细节和情绪，用实际行动为TA体贴付出？",
    partnerQuestion: "TA这周有没有用心疼爱我、主动关心我的感受与身体，用实际行动为我付出？",
    selfDesc: {
      1: "完全冷漠自私，视TA的辛劳和生病为无物，只顾自己",
      2: "口头关心很多但没有任何行动，习惯性推卸家务和关怀",
      3: "需要TA提出要求才动身干活或照顾，主动性还不够",
      4: "会主动分担家务，关注TA的情感变化并送去体贴",
      5: "细节控式的极致体贴，用切实的温暖把TA宠坏"
    },
    partnerDesc: {
      1: "TA对我冰冷漠然，生病或疲惫时完全得不到关照",
      2: "TA只有廉价的口头关心，在实际家务或生病时当甩手掌柜",
      3: "我向TA提了TA才会帮我，平时不太注意我的情绪波动",
      4: "TA日常对我很暖心，能分担家事，经常嘘寒问暖",
      5: "TA把我放在第一位，用各种暖心的小细节将我包围"
    }
  },
  {
    id: "reliable",
    name: "靠谱负责",
    selfName: "靠谱负责有担当",
    partnerName: "靠谱负责有担当",
    selfHint: "我对自己的言行负责，不推卸责任，答应TA的事情有落实和交代",
    partnerHint: "TA对TA的言行负责，不推卸责任，答应我的事情有落实和交代",
    selfQuestion: "我这周做人做事靠不靠谱？对我的承诺和言行是否负责，答应TA的事有没有落实交代？",
    partnerQuestion: "TA这周表现得靠不靠谱？对TA自己的承诺和言行是否负责，答应我的事有没有落实交代？",
    selfDesc: {
      1: "极度敷衍塞责，出事第一反应是甩锅、推卸和狡辩",
      2: "推托责任，做事做一半就丢开，让TA总在后面擦屁股",
      3: "完成了本分任务，但缺乏更积极的主动担当与交代",
      4: "能独当一面把事情办好，做决定考虑后果且积极落实",
      5: "极具责任感，遇到问题冲在前头，是TA的坚实港湾"
    },
    partnerDesc: {
      1: "TA遇到事就推脱责任、找借口开溜，把烂摊子留给我",
      2: "TA做事草率粗心，总是丢三落四让我去收尾，没有落实",
      3: "TA能做好本职工作，但在共同负担重大责任时略显被动",
      4: "TA做事靠谱稳重，说到做到，能够分担生活中的难处",
      5: "TA有天塌下来能顶住的担当，做任何事都让我感到极其安心"
    }
  },
  {
    id: "safety",
    name: "偏爱心安",
    selfName: "给TA心安与坚定的偏爱",
    partnerName: "心安与坚定的偏爱",
    selfHint: "我让TA感到稳定、被尊重、被坚定选择，不用反复猜测或不安",
    partnerHint: "TA让TA感到稳定、被尊重、被坚定选择，不用反复猜测或不安",
    selfQuestion: "我这周的行为有没有让TA感到踏实、被我坚定偏爱着，不需要小心翼翼猜疑？",
    partnerQuestion: "TA这周的行为是否让我感到踏实与被坚定选择，不用我反复猜测或不安？",
    selfDesc: {
      1: "频繁与他人情意绵绵，甚至用出轨、突然失联来伤害TA",
      2: "经常让TA感到被边缘化，社交距离没分寸或忽冷忽热",
      3: "虽然忠诚，但情绪稳定性不足，让TA偶尔感到焦虑",
      4: "给足安全感，社交分寸清晰，情绪温和让TA很踏实",
      5: "用极致的偏爱让TA傲娇，是TA这辈子最笃定的安全感"
    },
    partnerDesc: {
      1: "TA常与别人越界，或者突然消失失联，让我极度焦虑",
      2: "TA的社交界限模糊，或是对我忽冷忽热，让我极度不安",
      3: "TA虽然顾家，但不够笃定，有时我仍会患得患失",
      4: "TA社交边界非常干净，情绪稳定，让我觉得安全舒心",
      5: "TA用满分的专宠偏爱让我笃定，我是TA世界的唯一主角"
    }
  }
];

// 8 Items for General Feelings (Dimension 3)
const FEEL_ITEMS = [
  {
    id: "happy",
    name: "这周过得开不开心？ (开心幸福)",
    hint: "这周在两人的相处中，整体感到幸福、快乐、温暖和舒服",
    question: "我这周在我们的相处中，整体感到快乐、温暖和舒服吗？",
    desc: {
      1: "感到非常压抑、烦闷、甚至痛苦，几乎每天都在内耗中度过",
      2: "整体不开心，相处有些别扭尴尬，偶尔甚至想逃离",
      3: "普普通通的平静生活，没有特别的高光但也没有大的郁闷",
      4: "整体感到轻松愉快，有很多温暖有爱的互动时光",
      5: "快乐得像在云朵里，有极其浓厚的幸福与充实满足感"
    }
  },
  {
    id: "trust",
    name: "在你面前轻松做自己 (安全信任)",
    hint: "这周对TA感到完全的信任，不需要频繁防备、小心揣测或担忧被否定",
    question: "在TA面前我这周能完全放松、轻松自由地做最真实的自己吗？",
    desc: {
      1: "草木皆兵，时刻防备TA的挑剔指责，小心翼翼或者充满猜忌",
      2: "有些拘束，不敢说真话，害怕露出底牌会被TA嫌弃",
      3: "能说出大部分想法，但敏感话题仍有些顾虑，会有所掩饰",
      4: "感到比较安全，能暴露自己的小缺点，不用戴着面具相处",
      5: "完全的清澈信任，能轻松露出最傻最真实的一面，无比自如"
    }
  },
  {
    id: "connect",
    name: "心贴得很近 (亲密连接)",
    hint: "能感到被TA深深理解和关心，觉得我们的情感是紧密相连的",
    question: "这周我有觉得我们心贴得很近、我被TA深深地懂了吗？",
    desc: {
      1: "灵魂被孤立在冰天雪地，感到同床异梦，完全是同租室友",
      2: "觉得TA不够懂我，我们各过各的，内心深处没有被触及",
      3: "能日常陪伴，但本周没有深度的思想碰撞或灵魂共鸣",
      4: "有暖流在流淌，觉得我的情绪被看到了，TA的心向我敞开",
      5: "深度的灵魂同频，相视一笑就心知肚明，被TA深深抱紧与理解"
    }
  },
  {
    id: "resolve_exp",
    name: "摩擦解决的满意度 (解决体验)",
    hint: "即使发生了吵架或分歧，我们也能心平气和沟通并解决，而不是草草收尾积压心结",
    question: "本周如果发生了矛盾，我对我们共同面对和积极修复的解决体验满意吗？",
    desc: {
      1: "发生分歧就只剩嘶吼吵架或死灰般的冷战，旧账越积越多",
      2: "问题虽然过去了，但只是各退一步糊弄掩盖，心结根本没解开",
      3: "基本能说明白，但妥协得有些勉强，情绪并没有完全舒展开",
      4: "沟通通畅，能找出共同的改进措施，心里的结基本上解开了",
      5: "极佳的解决体验！吵架反而成了拥抱的契机，越吵感情越深"
    }
  },
  {
    id: "tolerate",
    name: "不急着指责与否定TA (接纳包容)",
    hint: "我能平静地接纳TA与我的不同，没有急着用我的标准去指责或否定TA",
    question: "这周我遇到分歧时，有没有做到不急着指责、否定或急着改造TA？",
    desc: {
      1: "我稍微有些地方不合TA的心意，就会立刻遭到嫌弃和改造指令",
      2: "本周经常会觉得彼此在暗中较劲和挑剔对方的坏习惯",
      3: "基本做到了相安无事，但心里偶尔仍会暗暗嫌弃对方",
      4: "能用平常心看待性格差异，极少出现强行让对方认错的情况",
      5: "有大智慧的全然接纳，我们尊重各自的独特，求同存异"
    }
  },
  {
    id: "teamwork",
    name: "并肩作战的队友感 (并肩作战)",
    hint: "觉得我和TA是共同解决生活琐碎和矛盾的盟友，而不是把矛头对准彼此的对手",
    question: "这周我是否觉得我和TA是共同抗击问题的并肩战友，而不是相互指责的对手？",
    desc: {
      1: "孤立无援，所有的压力都是自己扛，觉得TA是派来折磨我的对手",
      2: "没有默契，家务或压力分配不均，常陷入单打独斗的怨气中",
      3: "日常分工合作没有问题，但遇到大事或变故时仍有点像外人",
      4: "整体像一支很好的队伍，有问题能一起商量，是彼此的支柱",
      5: "同甘共苦的终极盟友！后背完全交给TA，面对风雨有无限底气"
    }
  },
  {
    id: "hopeful",
    name: "对未来充满亮晶晶的期待 (未来信心)",
    hint: "对我们长远的未来方向和目标充满坚定的期待，愿意继续为我们的未来投入",
    question: "我对我们长远的未来方向和目标依然充满亮晶晶的期待和坚定的信心吗？",
    desc: {
      1: "对我们的未来感到一片黑暗，甚至开始质疑我们是否真的合适",
      2: "迷茫困惑，不知道未来的蓝图是什么，或者方向有严重分歧",
      3: "按部就班地生活，没有想得太长远，对未来不温不火",
      4: "对未来的蓝图有明确的共识，能看到我们共同前进的微光",
      5: "信心值拉满！未来的每一格风景里都有TA，迫不及待奔向明天"
    }
  },
  {
    id: "satisfy",
    name: "相处状态满意度 (整体满意)",
    hint: "综合这一周的相处节奏和日常质量，对两人的整体生活状态感到满意",
    question: "总的来说，我对这周两人的生活状态和整体相处感到满意吗？",
    desc: {
      1: "极度糟糕，对这一周两人的相处极度失望，甚至感到精疲力竭",
      2: "不太满意，两人的生活节奏有点乱，矛盾频发体验不佳",
      3: "普通的三餐四季，不差但也没有什么特别亮眼的回忆",
      4: "非常满意，两人的情绪和陪伴都很和谐舒服",
      5: "无可挑剔的黄金周！每一天都觉得非常舒适、合拍且滋润"
    }
  }
];

// ==========================================================================
// 2. Mock Database pre-populated with new schemas
// ==========================================================================

const MOCK_DATABASE = {
  "2026-W24": {
    "A": {
      selfRespect: 4, selfComm: 4, selfConsensus: 4, selfHonest: 5, selfConfront: 4, selfRepair: 4, selfAccept: 4, selfCare: 4, selfReliable: 4, selfSafety: 4,
      partnerRespect: 4, partnerComm: 4, partnerConsensus: 4, partnerHonest: 4, partnerConfront: 4, partnerRepair: 4, partnerAccept: 4, partnerCare: 4, partnerReliable: 4, partnerSafety: 4,
      feelHappy: 4, feelTrust: 4, feelConnect: 4, feelResolve_exp: 4, feelTolerate: 4, feelTeamwork: 4, feelHopeful: 4, feelSatisfy: 4,
      conflictHappened: false, conflictHandling: "resolve",
      noteHappy: "一起去海边散步吹风，看着落日非常平静幸福，感到被TA坚定地爱着。",
      noteImprove: "工作稍微有点疲惫，周三冷落了TA一会儿，下周我会注意调节工作和家庭的平衡。",
      noteAction: "下周三我提早下班，准备TA喜欢的日式咖喱饭！"
    },
    "B": {
      selfRespect: 4, selfComm: 4, selfConsensus: 4, selfHonest: 4, selfConfront: 4, selfRepair: 4, selfAccept: 4, selfCare: 4, selfReliable: 4, selfSafety: 4,
      partnerRespect: 4, partnerComm: 4, partnerConsensus: 4, partnerHonest: 5, partnerConfront: 4, partnerRepair: 4, partnerAccept: 4, partnerCare: 4, partnerReliable: 4, partnerSafety: 4,
      feelHappy: 5, feelTrust: 4, feelConnect: 4, feelResolve_exp: 4, feelTolerate: 4, feelTeamwork: 5, feelHopeful: 4, feelSatisfy: 4,
      conflictHappened: false, conflictHandling: "resolve",
      noteHappy: "在海边踩水的时候，TA主动牵着我的手，感觉我们心贴得非常近。",
      noteImprove: "希望TA有时候能主动和我说说工作上的烦心事，不要一个人闷在心里。",
      noteAction: "下周六下午由我来打扫全屋卫生，让TA舒舒服服休息！"
    }
  },
  "2026-W25": {
    "A": {
      selfRespect: 3, selfComm: 4, selfConsensus: 4, selfHonest: 4, selfConfront: 4, selfRepair: 5, selfAccept: 3, selfCare: 4, selfReliable: 4, selfSafety: 4,
      partnerRespect: 4, partnerComm: 3, partnerConsensus: 5, partnerHonest: 4, partnerConfront: 4, partnerRepair: 3, partnerAccept: 4, partnerCare: 4, partnerReliable: 4, partnerSafety: 4,
      feelHappy: 4, feelTrust: 4, feelConnect: 4, feelResolve_exp: 4, feelTolerate: 3, feelTeamwork: 4, feelHopeful: 4, feelSatisfy: 4,
      conflictHappened: true, conflictHandling: "winwin",
      noteHappy: "周三关于周末聚会的安排有点分歧，但我很开心我们没有互相指责，而是作为并肩作战的队友把事情聊开了。",
      noteImprove: "吵架的时候我稍微有些急躁，说话语气硬，希望TA能理解我是因为疲惫。",
      noteAction: "在争执时，下周我会深呼吸三秒，有话好好说，绝不对TA甩脸色。"
    },
    "B": {
      selfRespect: 4, selfComm: 3, selfConsensus: 5, selfHonest: 4, selfConfront: 4, selfRepair: 3, selfAccept: 4, selfCare: 4, selfReliable: 4, selfSafety: 4,
      partnerRespect: 3, partnerComm: 4, partnerConsensus: 4, partnerHonest: 4, partnerConfront: 4, partnerRepair: 5, partnerAccept: 3, partnerCare: 4, partnerReliable: 4, partnerSafety: 4,
      feelHappy: 3, feelTrust: 4, feelConnect: 3, feelResolve_exp: 4, feelTolerate: 4, feelTeamwork: 4, feelHopeful: 4, feelSatisfy: 3,
      conflictHappened: true, conflictHandling: "winwin",
      noteHappy: "争论聚会安排时，TA主动退了一步，给了我台阶下，这让我很感动并感到被包容。",
      noteImprove: "闹摩擦时我习惯保持沉默，下次我会努力主动表达我的边界，而不是闷着不说话。",
      noteAction: "下周做决定时，我会主动先询问TA的想法，把TA的心声放在最前面。"
    }
  }
};

// ==========================================================================
// 3. Client State
// ==========================================================================

let clientState = {
  coupleId: "",
  myRole: "",
  myName: "",
  partnerName: "",
  currentWeek: "",
  activeTab: "dashboard-tab"
};

// ==========================================================================
// 4. Lifecycle Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  renderFormSliders();
  setupConflictToggle();
  setupTabNavigation();
  setupSettingsModal();
  setupWhisperTabs();
  
  // Dynamic onboarding session check
  await checkSessionAndUrl();
});

function initTheme() {
  const savedTheme = localStorage.getItem("couple_rubric_theme");
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
  const isDark = savedTheme === "dark" || (!savedTheme && mediaQuery.matches);
  document.body.classList.toggle("dark-theme", isDark);
  
  const modalThemeToggle = document.getElementById("modal-theme-toggle");
  if (modalThemeToggle) {
    modalThemeToggle.checked = isDark;
    modalThemeToggle.addEventListener("change", (e) => {
      const nextDark = e.target.checked;
      document.body.classList.toggle("dark-theme", nextDark);
      localStorage.setItem("couple_rubric_theme", nextDark ? "dark" : "light");
    });
  }

  // Automatically adapt to OS system theme changes
  mediaQuery.addEventListener("change", (e) => {
    const currentSaved = localStorage.getItem("couple_rubric_theme");
    if (!currentSaved) {
      const nextDark = e.matches;
      document.body.classList.toggle("dark-theme", nextDark);
      if (modalThemeToggle) {
        modalThemeToggle.checked = nextDark;
      }
    }
  });
}

function setupSettingsModal() {
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  
  if (settingsToggle && settingsModal && closeSettingsBtn) {
    settingsToggle.addEventListener("click", () => {
      settingsModal.classList.remove("hidden");
      // Trigger reflow to make transition animate
      void settingsModal.offsetWidth;
      settingsModal.classList.add("active");
      document.body.classList.add("no-scroll");
    });
    
    closeSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.remove("active");
      document.body.classList.remove("no-scroll");
      setTimeout(() => {
        if (!settingsModal.classList.contains("active")) {
          settingsModal.classList.add("hidden");
        }
      }, 300);
    });
    
    // Close modal when clicking outside of modal card
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        closeSettingsBtn.click();
      }
    });
  }
}

// Helper function to resolve dynamic question-specific score descriptions
function getSliderDescription(id, value) {
  const parts = id.split('-');
  const type = parts[0];
  const itemId = parts[1];
  
  if (type === 'self') {
    const item = BEHAVIORAL_ITEMS.find(i => i.id === itemId);
    if (item && item.selfDesc && item.selfDesc[value]) {
      return item.selfDesc[value];
    }
  } else if (type === 'partner') {
    const item = BEHAVIORAL_ITEMS.find(i => i.id === itemId);
    if (item && item.partnerDesc && item.partnerDesc[value]) {
      return item.partnerDesc[value];
    }
  } else if (type === 'feel') {
    const item = FEEL_ITEMS.find(i => i.id === itemId);
    if (item && item.desc && item.desc[value]) {
      return item.desc[value];
    }
  }
  
  return SCORE_DESCRIPTIONS[value] || "基本做到，但稳定性或主动性不足";
}

// Generate the sliders dynamically in the HTML containers
function renderFormSliders() {
  const selfContainer = document.getElementById("self-eval-container");
  const partnerContainer = document.getElementById("partner-eval-container");
  const feelContainer = document.getElementById("feel-eval-container");
  
  selfContainer.innerHTML = "";
  partnerContainer.innerHTML = "";
  feelContainer.innerHTML = "";

  const createSliderHtml = (id, title, hint, question) => {
    const defaultVal = 3;
    const descText = getSliderDescription(id, defaultVal);
    return `
      <div class="form-group-rubric">
        <div class="rubric-header">
          <label class="rubric-title" for="${id}">${title}</label>
          <span class="rubric-hint">${hint}</span>
          <span class="rubric-question-text" style="font-size: 0.9rem; font-style: italic; color: var(--accent-pink); margin-top: 0.15rem;">${question}</span>
        </div>
        <div class="score-slider-container">
          <input type="range" id="${id}" name="${id}" min="1" max="5" value="${defaultVal}" class="score-slider">
          <div class="slider-ticks">
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
          </div>
        </div>
        <div class="score-description" id="desc-${id}">${descText}</div>
      </div>
    `;
  };

  // 1. Render Partner-eval sliders (TA评) first
  BEHAVIORAL_ITEMS.forEach(item => {
    partnerContainer.insertAdjacentHTML('beforeend', createSliderHtml(
      `partner-${item.id}`,
      item.partnerName,
      item.partnerHint,
      item.partnerQuestion
    ));
  });

  // 2. Render Self-eval sliders (自评) second
  BEHAVIORAL_ITEMS.forEach(item => {
    selfContainer.insertAdjacentHTML('beforeend', createSliderHtml(
      `self-${item.id}`,
      item.selfName,
      item.selfHint,
      item.selfQuestion
    ));
  });

  // 3. Render Feel-eval sliders
  FEEL_ITEMS.forEach(item => {
    feelContainer.insertAdjacentHTML('beforeend', createSliderHtml(
      `feel-${item.id}`,
      item.name,
      item.hint,
      item.question
    ));
  });

  // Register slider event listeners
  const allSliderIds = [
    ...BEHAVIORAL_ITEMS.map(i => `self-${i.id}`),
    ...BEHAVIORAL_ITEMS.map(i => `partner-${i.id}`),
    ...FEEL_ITEMS.map(i => `feel-${i.id}`)
  ];

  allSliderIds.forEach(id => {
    const el = document.getElementById(id);
    const desc = document.getElementById(`desc-${id}`);
    if (el && desc) {
      el.addEventListener("input", (e) => {
        desc.textContent = getSliderDescription(id, e.target.value);
      });
    }
  });
}

function setupConflictToggle() {
  const checkbox = document.getElementById("conflict-happened");
  const details = document.getElementById("conflict-details-group");
  checkbox.addEventListener("change", (e) => {
    details.classList.toggle("hidden", !e.target.checked);
  });
}

function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const button = e.currentTarget;
      const targetId = button.getAttribute("data-target");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      
      const panels = document.querySelectorAll(".tab-panel");
      panels.forEach(p => p.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");
      
      clientState.activeTab = targetId;
      
      // Update sliding pill position
      updateNavIndicator();
      
      if (targetId === "history-tab") {
        loadHistoryTab();
      } else if (targetId === "dashboard-tab") {
        fetchWeeklyReport();
      }
    });
  });

  document.getElementById("quick-fill-btn").addEventListener("click", () => {
    const fillBtn = document.querySelector('.tab-btn[data-target="fill-tab"]');
    if (fillBtn) fillBtn.click();
  });

  window.addEventListener("resize", updateNavIndicator);
}

function updateNavIndicator() {
  const indicator = document.getElementById("nav-indicator");
  const activeBtn = document.querySelector(".tab-btn.active");
  if (indicator && activeBtn) {
    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
  }
}

function setupWhisperTabs() {
  const tabA = document.getElementById("whisper-tab-a");
  const tabB = document.getElementById("whisper-tab-b");
  const cardA = document.getElementById("letter-card-a");
  const cardB = document.getElementById("letter-card-b");
  
  if (tabA && tabB && cardA && cardB) {
    tabA.addEventListener("click", () => {
      tabA.classList.add("active");
      tabB.classList.remove("active");
      cardA.classList.remove("hidden");
      cardB.classList.add("hidden");
    });
    
    tabB.addEventListener("click", () => {
      tabB.classList.add("active");
      tabA.classList.remove("active");
      cardB.classList.remove("hidden");
      cardA.classList.add("hidden");
    });
  }
}

// ==========================================================================
// 5. Onboarding & Session checks
// ==========================================================================

async function checkSessionAndUrl() {
  const params = new URLSearchParams(window.location.search);
  const urlCoupleId = params.get("coupleId");
  const urlRole = params.get("role");
  
  const savedCoupleId = localStorage.getItem("us_couple_id");
  
  if (urlCoupleId && urlRole === "B") {
    showScreen("screen-join");
    await handleJoinScreen(urlCoupleId);
  } else if (savedCoupleId) {
    clientState.coupleId = savedCoupleId;
    clientState.myRole = localStorage.getItem("us_my_role") || "A";
    clientState.myName = localStorage.getItem("us_my_name") || "我";
    clientState.partnerName = localStorage.getItem("us_partner_name") || "TA";
    
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Inject mock data if DB is empty to showcase history logs
    await checkAndInjectMockData();
    setupMainApp();
  } else {
    showScreen("screen-onboarding");
    setupOnboardingForm();
  }
}

async function checkAndInjectMockData() {
  // Check history from API, if empty, pre-populate with mock weeks
  try {
    const response = await fetch(`/api/history?coupleId=${clientState.coupleId}`);
    if (response.ok) {
      const data = await response.json();
      if (!data.weeks || data.weeks.length === 0) {
        // DB is empty, push mock weeks
        console.log("Database is empty, injecting mock weeks...");
        for (const week of ["2026-W24", "2026-W25"]) {
          await fetch('/api/rubric', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coupleId: clientState.coupleId,
              week: week,
              partner: "A",
              data: MOCK_DATABASE[week].A
            })
          });
          await fetch('/api/rubric', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              coupleId: clientState.coupleId,
              week: week,
              partner: "B",
              data: MOCK_DATABASE[week].B
            })
          });
        }
      }
    }
  } catch (e) {
    console.error("Failed checking/injecting mock weeks", e);
  }
}

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
  
  // Toggle header week selector visibility
  const weekSelector = document.getElementById("header-week-selector");
  if (weekSelector) {
    if (screenId === "screen-app") {
      weekSelector.classList.remove("hidden");
    } else {
      weekSelector.classList.add("hidden");
    }
  }
}

function setupOnboardingForm() {
  const form = document.getElementById("create-cabin-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nameA = document.getElementById("create-name-a").value.trim();
    const nameB = document.getElementById("create-name-b").value.trim();
    
    try {
      const response = await fetch('/api/couple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameA, nameB })
      });
      
      if (!response.ok) throw new Error("Failed to create room");
      
      const data = await response.json();
      
      clientState.coupleId = data.coupleId;
      clientState.myRole = "A";
      clientState.myName = nameA;
      clientState.partnerName = nameB;
      
      const inviteUrl = `${window.location.origin}/?coupleId=${data.coupleId}&role=B`;
      document.getElementById("invite-link-input").value = inviteUrl;
      
      showScreen("screen-share");
      setupSharingScreen(inviteUrl);
      
    } catch (err) {
      console.error(err);
      alert("创建小屋失败，请稍后重试。");
    }
  });
}

function setupSharingScreen(inviteUrl) {
  const copyBtn = document.getElementById("copy-link-btn");
  copyBtn.addEventListener("click", () => {
    copyTextToClipboard(inviteUrl);
    copyBtn.textContent = "已复制！";
    setTimeout(() => { copyBtn.textContent = "复制链接"; }, 2000);
  });
  
  document.getElementById("enter-my-side-btn").addEventListener("click", async () => {
    localStorage.setItem("us_couple_id", clientState.coupleId);
    localStorage.setItem("us_my_role", clientState.myRole);
    localStorage.setItem("us_my_name", clientState.myName);
    localStorage.setItem("us_partner_name", clientState.partnerName);
    
    await checkAndInjectMockData();
    setupMainApp();
  });
}

async function handleJoinScreen(coupleId) {
  try {
    const response = await fetch(`/api/couple?id=${coupleId}`);
    if (!response.ok) throw new Error("Couple room not found");
    
    const data = await response.json();
    
    document.getElementById("join-avatar-a").textContent = data.nameA.charAt(0);
    document.getElementById("join-name-a").textContent = data.nameA;
    document.getElementById("join-avatar-b").textContent = data.nameB.charAt(0);
    document.getElementById("join-name-b").textContent = data.nameB;
    
    document.getElementById("join-desc-text").textContent = `TA ${data.nameA} 正在邀请我加入我们的默契互评小屋，我们将能共同见证每一周的幸福指数`;
    
    const acceptBtn = document.getElementById("accept-invite-btn");
    acceptBtn.addEventListener("click", async () => {
      localStorage.setItem("us_couple_id", coupleId);
      localStorage.setItem("us_my_role", "B");
      localStorage.setItem("us_my_name", data.nameB);
      localStorage.setItem("us_partner_name", data.nameA);
      
      clientState.coupleId = coupleId;
      clientState.myRole = "B";
      clientState.myName = data.nameB;
      clientState.partnerName = data.nameA;
      
      window.history.replaceState({}, document.title, window.location.pathname);
      await checkAndInjectMockData();
      setupMainApp();
    });
    
  } catch (err) {
    console.error(err);
    alert("邀请链接无效或房间已被删除。");
    showScreen("screen-onboarding");
    setupOnboardingForm();
  }
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(err => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

// ==========================================================================
// 6. Setup main app structure
// ==========================================================================

function setupMainApp() {
  showScreen("screen-app");
  
  document.getElementById("app-title-text").textContent = `${clientState.myName} ❤️ ${clientState.partnerName}`;
  
  const labelA = document.getElementById("name-label-a");
  const labelB = document.getElementById("name-label-b");
  const avatarA = document.getElementById("avatar-label-a");
  const avatarB = document.getElementById("avatar-label-b");
  
  labelA.textContent = clientState.myRole === 'A' ? `${clientState.myName} (我)` : clientState.partnerName;
  labelB.textContent = clientState.myRole === 'B' ? `${clientState.myName} (我)` : clientState.partnerName;
  
  avatarA.textContent = clientState.myRole === 'A' ? clientState.myName.charAt(0) : clientState.partnerName.charAt(0);
  avatarB.textContent = clientState.myRole === 'B' ? clientState.myName.charAt(0) : clientState.partnerName.charAt(0);
  
  document.getElementById("chart-legend-a").textContent = clientState.myRole === 'A' ? clientState.myName : clientState.partnerName;
  document.getElementById("chart-legend-b").textContent = clientState.myRole === 'B' ? clientState.myName : clientState.partnerName;
  
  const letterAvatarA = document.getElementById("letter-avatar-a");
  const letterAvatarB = document.getElementById("letter-avatar-b");
  const letterTitleA = document.getElementById("letter-title-a");
  const letterTitleB = document.getElementById("letter-title-b");
  
  if (letterAvatarA) letterAvatarA.textContent = clientState.myRole === 'A' ? clientState.myName.charAt(0) : clientState.partnerName.charAt(0);
  if (letterAvatarB) letterAvatarB.textContent = clientState.myRole === 'B' ? clientState.myName.charAt(0) : clientState.partnerName.charAt(0);
  if (letterTitleA) letterTitleA.textContent = clientState.myRole === 'A' ? "我写下的留言：" : `${clientState.partnerName} 写下的留言：`;
  if (letterTitleB) letterTitleB.textContent = clientState.myRole === 'B' ? "我写下的留言：" : `${clientState.partnerName} 写下的留言：`;
  
  document.getElementById("fill-avatar").textContent = clientState.myName.charAt(0);
  document.getElementById("fill-role-title").textContent = clientState.myRole === 'A' ? '我 (发起者)' : '我 (受邀人)';
  document.getElementById("fill-name-display").textContent = clientState.myName;
  document.getElementById("fill-identity-desc").textContent = `正在以 ${clientState.myName} 的身份填写本周评分`;
  
  if (clientState.myRole === 'B') {
    document.getElementById("fill-avatar").className = "avatar-circle partner-b-avatar";
    document.getElementById("identity-display-box").style.backgroundColor = "var(--accent-gold-light)";
    document.getElementById("fill-role-title").style.color = "var(--accent-gold)";
  }
  
  const inviteUrl = `${window.location.origin}/?coupleId=${clientState.coupleId}&role=B`;
  
  const setupInviteCopy = (btnId) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      copyTextToClipboard(inviteUrl);
      alert("专属邀请链接已复制到剪贴板，快发送给TA吧！");
    });
  };
  setupInviteCopy("shortcut-invite-link");
  setupInviteCopy("settings-modal-copy-invite-btn");

  const leaveBtn = document.getElementById("settings-modal-leave-room-btn");
  if (leaveBtn) {
    leaveBtn.addEventListener("click", () => {
      if (confirm("确定要注销并退出当前小屋吗？所有历史数据保留在云端，本地缓存将被清空。")) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }

  generateWeeksDropdown();
  
  const rubricForm = document.getElementById("rubric-form");
  rubricForm.onsubmit = handleRubricSubmit;
  
  // Set initial navigation indicator position
  setTimeout(updateNavIndicator, 100);
}

function generateWeeksDropdown() {
  const select = document.getElementById("global-week-select");
  const customDropdown = document.getElementById("custom-week-dropdown");
  const trigger = document.getElementById("week-dropdown-trigger");
  const menu = document.getElementById("week-dropdown-menu");
  
  if (!select || !customDropdown || !trigger || !menu) return;

  // Set initial loading indicator
  const valEl = trigger.querySelector(".selected-value");
  if (valEl) valEl.textContent = "加载中...";

  // Fetch weeks with data dynamically
  fetch(`/api/history?coupleId=${clientState.coupleId}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch history weeks");
      return response.json();
    })
    .then(data => {
      populateWeeks(data.weeks || []);
    })
    .catch(err => {
      console.error("Error fetching history weeks:", err);
      // Fallback to only displaying current week if API fails
      populateWeeks([]);
    });

  function populateWeeks(historyWeeks) {
    select.innerHTML = "";
    menu.innerHTML = "";

    const today = new Date();
    const getISOWeek = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
      return { year: d.getUTCFullYear(), week: weekNo };
    };

    const currentISO = getISOWeek(today);
    const currentWeekKey = `${currentISO.year}-W${currentISO.week.toString().padStart(2, '0')}`;
    
    // Always include current week so users can fill the rubric
    const weeksSet = new Set();
    weeksSet.add(currentWeekKey);

    // Add all historical weeks that contain data
    (historyWeeks || []).forEach(w => {
      if (w) weeksSet.add(w);
    });

    // Convert Set back to a sorted list of weeks (latest first)
    const sortedWeeks = Array.from(weeksSet).sort().reverse();

    // Helper to calculate start/end dates for a given ISO week string
    const getWeekRangeString = (weekKey) => {
      const parts = weekKey.split("-W");
      if (parts.length !== 2) return "";
      const year = parseInt(parts[0]);
      const week = parseInt(parts[1]);
      
      // Calculate week 1 Monday of target year
      const simple = new Date(year, 0, 4); // Jan 4th is always in ISO Week 1
      const day = simple.getDay();
      const diff = simple.getDate() - day + (day === 0 ? -6 : 1);
      const week1Monday = new Date(simple.setDate(diff));
      
      // Add weeks offset
      const monday = new Date(week1Monday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
      const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);
      
      return `${(monday.getMonth() + 1).toString().padStart(2, '0')}/${monday.getDate().toString().padStart(2, '0')} - ${(sunday.getMonth() + 1).toString().padStart(2, '0')}/${sunday.getDate().toString().padStart(2, '0')}`;
    };

    const weeksList = sortedWeeks.map(key => {
      const range = getWeekRangeString(key);
      const parts = key.split("-W");
      const weekNum = parts.length === 2 ? parseInt(parts[1]) : key;
      const isCurrent = key === currentWeekKey;
      const text = `${parts[0]}年 第${weekNum}周 (${range})${isCurrent ? " [本周]" : ""}`;
      return { key, text, isCurrent };
    });

    window.updateCustomDropdownLabel = () => {
      const selectedOpt = select.options[select.selectedIndex];
      if (selectedOpt) {
        const valEl = trigger.querySelector(".selected-value");
        if (valEl) valEl.textContent = selectedOpt.textContent;
      }
    };

    weeksList.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.key;
      opt.textContent = item.text;
      
      if (clientState.currentWeek) {
        if (item.key === clientState.currentWeek) {
          opt.selected = true;
        }
      } else if (item.isCurrent) {
        opt.selected = true;
        clientState.currentWeek = item.key;
      }
      select.appendChild(opt);

      const customItem = document.createElement("div");
      customItem.className = `dropdown-item${(clientState.currentWeek === item.key) ? " active" : ""}`;
      customItem.setAttribute("role", "option");
      customItem.setAttribute("data-value", item.key);
      customItem.textContent = item.text;
      
      customItem.addEventListener("click", () => {
        menu.querySelectorAll(".dropdown-item").forEach(el => el.classList.remove("active"));
        customItem.classList.add("active");
        
        select.value = item.key;
        clientState.currentWeek = item.key;
        
        customDropdown.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        window.updateCustomDropdownLabel();
        
        fetchWeeklyReport();
      });
      
      menu.appendChild(customItem);
    });

    // Handle fallback if clientState.currentWeek is out of bounds
    if (weeksList.length > 0) {
      const hasCurrent = weeksList.some(item => item.key === clientState.currentWeek);
      if (!hasCurrent) {
        clientState.currentWeek = weeksList[0].key;
        select.value = clientState.currentWeek;
      }
    }
    
    window.updateCustomDropdownLabel();
    
    // Fetch initial report
    fetchWeeklyReport();
  }
  
  trigger.onclick = (e) => {
    e.stopPropagation();
    const isActive = customDropdown.classList.toggle("active");
    trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
  };
  
  document.addEventListener("click", (e) => {
    if (!customDropdown.contains(e.target)) {
      customDropdown.classList.remove("active");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  select.onchange = (e) => {
    clientState.currentWeek = e.target.value;
    window.updateCustomDropdownLabel();
    menu.querySelectorAll(".dropdown-item").forEach(el => {
      if (el.getAttribute("data-value") === e.target.value) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
    fetchWeeklyReport();
  };
}

// ==========================================================================
// 7. API calls & Report rendering with Gaps & Insights
// ==========================================================================

async function fetchWeeklyReport() {
  const { coupleId, currentWeek, myRole } = clientState;
  
  if (typeof window.updateCustomDropdownLabel === "function") {
    const select = document.getElementById("global-week-select");
    if (select) {
      select.value = currentWeek;
      window.updateCustomDropdownLabel();
      const menu = document.getElementById("week-dropdown-menu");
      if (menu) {
        menu.querySelectorAll(".dropdown-item").forEach(el => {
          if (el.getAttribute("data-value") === currentWeek) {
            el.classList.add("active");
          } else {
            el.classList.remove("active");
          }
        });
      }
    }
  }
  
  try {
    const response = await fetch(`/api/rubric?coupleId=${coupleId}&week=${currentWeek}&partner=${myRole}`);
    if (!response.ok) throw new Error("Failed to fetch rubric data");
    
    const data = await response.json();
    
    updateProgressStatus(data.progress);
    
    const reportContainer = document.getElementById("report-container");
    
    if (data.unlocked) {
      reportContainer.classList.remove("locked");
      
      const reportResults = calculateScores(data.A, data.B);
      
      document.getElementById("harmony-score").textContent = reportResults.harmonyScore;
      const levelEl = document.getElementById("harmony-level");
      levelEl.textContent = reportResults.harmonyLevel;
      
      if (reportResults.harmonyScore >= 88) {
        levelEl.style.backgroundColor = "var(--accent-green-light)";
        levelEl.style.color = "var(--accent-green)";
      } else if (reportResults.harmonyScore >= 75) {
        levelEl.style.backgroundColor = "var(--accent-gold-light)";
        levelEl.style.color = "var(--accent-gold)";
      } else {
        levelEl.style.backgroundColor = "var(--accent-red-light)";
        levelEl.style.color = "var(--accent-red)";
      }
      
      document.getElementById("weekly-verdict").textContent = reportResults.verdict;
      
      // Render components
      renderRadarChart(data.A, data.B);
      renderBreakdown(data.A, data.B);
      renderConflictBadge(data.A, data.B);
      renderDeepInsights(data.A, data.B, reportResults);
      
      // Render three sentence messages
      renderMessages(data.A, data.B);
      
      // Feed my inputs if loaded
      populateFormWithSubmittedData(myRole === 'A' ? data.A : data.B);
      
    } else {
      reportContainer.classList.add("locked");
      document.getElementById("harmony-score").textContent = "--";
      document.getElementById("harmony-level").textContent = "--";
      document.getElementById("weekly-verdict").textContent = "";
      
      document.getElementById("letter-content-a").textContent = "--";
      document.getElementById("letter-content-b").textContent = "--";
      
      const mySavedData = myRole === 'A' ? data.A : data.B;
      if (mySavedData) {
        populateFormWithSubmittedData(mySavedData);
      } else {
        resetFormInputs();
      }
    }
    
  } catch (err) {
    console.error(err);
  }
}

function updateProgressStatus(progress) {
  const hasA = progress ? !!progress.A : false;
  const hasB = progress ? !!progress.B : false;
  
  const statusTitle = document.getElementById("status-title");
  const statusDesc = document.getElementById("status-desc");
  const statusDot = document.getElementById("status-dot");
  
  const progressA = document.querySelector("#progress-partner-a .fill-status");
  const progressB = document.querySelector("#progress-partner-b .fill-status");
  
  const setStatus = (el, done) => {
    if (done) {
      el.textContent = "已完成";
      el.className = "fill-status complete";
    } else {
      el.textContent = "未完成";
      el.className = "fill-status pending";
    }
  };
  setStatus(progressA, hasA);
  setStatus(progressB, hasB);
  
  const myDone = clientState.myRole === 'A' ? hasA : hasB;
  const partnerDone = clientState.myRole === 'A' ? hasB : hasA;

  if (hasA && hasB) {
    statusTitle.textContent = "本周默契报告已解锁！";
    statusDesc.textContent = "我和TA已全部完成自评与TA评，请在下方查阅本周的双向心智剖析";
    statusDot.className = "status-indicator-dot ready";
    document.getElementById("quick-fill-btn").style.display = "none";
  } else if (myDone && !partnerDone) {
    statusTitle.textContent = "我已填写，等待TA";
    statusDesc.textContent = `我已经完成了本周的互评，一旦 ${clientState.partnerName} 提交评分，即可揭晓报告`;
    statusDot.className = "status-indicator-dot pending";
    document.getElementById("quick-fill-btn").style.display = "none";
  } else if (!myDone && partnerDone) {
    statusTitle.textContent = "TA已填，等我填写";
    statusDesc.textContent = `${clientState.partnerName} 已经完成了互评，现在轮到我了，填写后将立即解锁报告`;
    statusDot.className = "status-indicator-dot pending";
    document.getElementById("quick-fill-btn").style.display = "inline-flex";
    document.getElementById("quick-fill-btn").textContent = "立即去填写";
  } else {
    statusTitle.textContent = "本周互评等待开启";
    statusDesc.textContent = "本周互评需要我和TA独立填写，完成后，系统将解锁本周的默契报告";
    statusDot.className = "status-indicator-dot pending";
    document.getElementById("quick-fill-btn").style.display = "inline-flex";
    document.getElementById("quick-fill-btn").textContent = "立即去填写";
  }
}

function populateFormWithSubmittedData(data) {
  if (!data) return;
  
  // Dynamic self sliders
  BEHAVIORAL_ITEMS.forEach(item => {
    const slider = document.getElementById(`self-${item.id}`);
    if (slider) slider.value = data[item.id] || data[`self${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`] || 3;
  });
  
  // Dynamic partner sliders
  BEHAVIORAL_ITEMS.forEach(item => {
    const slider = document.getElementById(`partner-${item.id}`);
    // Handle historical key translation
    const key = `partner${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
    if (slider) slider.value = data[key] || 3;
  });
  
  // Dynamic feel sliders
  FEEL_ITEMS.forEach(item => {
    const slider = document.getElementById(`feel-${item.id}`);
    const key = `feel${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
    if (slider) slider.value = data[key] || 3;
  });
  
  const conflictCheckbox = document.getElementById("conflict-happened");
  conflictCheckbox.checked = data.conflictHappened;
  conflictCheckbox.dispatchEvent(new Event('change'));
  
  if (data.conflictHappened) {
    const radio = document.querySelector(`input[name="conflict-handling"][value="${data.conflictHandling}"]`);
    if (radio) radio.checked = true;
  }
  
  // Heart 3 statements
  document.getElementById("note-happy").value = data.noteHappy || "";
  document.getElementById("note-improve").value = data.noteImprove || "";
  document.getElementById("note-action").value = data.noteAction || "";
  
  // Refresh descriptions
  const slidersList = [
    ...BEHAVIORAL_ITEMS.map(i => `self-${i.id}`),
    ...BEHAVIORAL_ITEMS.map(i => `partner-${i.id}`),
    ...FEEL_ITEMS.map(i => `feel-${i.id}`)
  ];
  slidersList.forEach(id => {
    const slider = document.getElementById(id);
    if (slider) slider.dispatchEvent(new Event('input'));
  });
}

function resetFormInputs() {
  const slidersList = [
    ...BEHAVIORAL_ITEMS.map(i => `self-${i.id}`),
    ...BEHAVIORAL_ITEMS.map(i => `partner-${i.id}`),
    ...FEEL_ITEMS.map(i => `feel-${i.id}`)
  ];
  
  slidersList.forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.value = 3;
      slider.dispatchEvent(new Event('input'));
    }
  });
  
  document.getElementById("conflict-happened").checked = false;
  document.getElementById("conflict-happened").dispatchEvent(new Event('change'));
  
  document.getElementById("note-happy").value = "";
  document.getElementById("note-improve").value = "";
  document.getElementById("note-action").value = "";
}

// Score calculations: TA评 35%, 自评 25%, 综合体感 40%
function calculateScores(dataA, dataB) {
  // Helper to calculate average of behavioral array
  const getAverage = (data, prefix, itemsList) => {
    let sum = 0;
    itemsList.forEach(item => {
      // Keys are camelCased e.g. selfRespect or partnerRespect
      const key = `${prefix}${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
      sum += (data[key] || 3);
    });
    return sum / itemsList.length;
  };

  const getFeelAverage = (data) => {
    let sum = 0;
    FEEL_ITEMS.forEach(item => {
      const key = `feel${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
      sum += (data[key] || 3);
    });
    return sum / FEEL_ITEMS.length;
  };

  // Partner evaluations averages
  const partnerAvgA = getAverage(dataB, "partner", BEHAVIORAL_ITEMS); // B eval A
  const partnerAvgB = getAverage(dataA, "partner", BEHAVIORAL_ITEMS); // A eval B
  const partnerAvgTotal = (partnerAvgA + partnerAvgB) / 2;

  // Self evaluations averages
  const selfAvgA = getAverage(dataA, "self", BEHAVIORAL_ITEMS);
  const selfAvgB = getAverage(dataB, "self", BEHAVIORAL_ITEMS);
  const selfAvgTotal = (selfAvgA + selfAvgB) / 2;

  // Feelings averages
  const feelAvgA = getFeelAverage(dataA);
  const feelAvgB = getFeelAverage(dataB);
  const feelAvgTotal = (feelAvgA + feelAvgB) / 2;

  // Weighted total (1-5 scale)
  const weightedAvg = partnerAvgTotal * 0.35 + selfAvgTotal * 0.25 + feelAvgTotal * 0.40;
  
  // Convert to 100-point scale
  let baseScore = weightedAvg * 20;

  // Conflict resolution adjustments
  let conflictAdjust = 0;
  const hasConflict = dataA.conflictHappened || dataB.conflictHappened;
  
  if (hasConflict) {
    let count = 0;
    let sumAdjust = 0;
    
    if (dataA.conflictHappened) {
      count++;
      if (dataA.conflictHandling === "avoid") sumAdjust -= 15;
      else if (dataA.conflictHandling === "resolve") sumAdjust += 5;
      else if (dataA.conflictHandling === "winwin") sumAdjust += 10;
    }
    if (dataB.conflictHappened) {
      count++;
      if (dataB.conflictHandling === "avoid") sumAdjust -= 15;
      else if (dataB.conflictHandling === "resolve") sumAdjust += 5;
      else if (dataB.conflictHandling === "winwin") sumAdjust += 10;
    }
    conflictAdjust = sumAdjust / count;
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore + conflictAdjust)));

  let level = "";
  let verdict = "";
  
  if (finalScore >= 88) {
    level = "灵魂共振";
    verdict = hasConflict 
      ? "本周虽然经历了小插曲，但我们以温柔包容的方式，并肩守护了我们的心安边界。神仙情侣莫过于此！" 
      : "岁月静好，心照不宣。这一周相处温馨踏实，无风无雨，彼此都在用行动守护坚定的偏爱。";
  } else if (finalScore >= 75) {
    level = "甜蜜默契";
    verdict = "总体互动非常健康，大部分情况下都能有话好好说，尊重彼此的个人空间并踏实执行共识。";
  } else if (finalScore >= 60) {
    level = "磨合进阶";
    verdict = "这周发生了一些沟通盲区或摩擦，情绪有些许波动。需要多加注意，努力克服回避与冷暴力问题哦。";
  } else {
    level = "情感预警";
    verdict = "本周自评、TA评或综合体感存在较大落差，我们在坦诚沟通、尊重意愿或共识落实上可能出现了阻碍。建议我和TA进行一次温和的深入谈心。";
  }

  return {
    harmonyScore: finalScore,
    harmonyLevel: level,
    verdict: verdict,
    // Store individuals averages for insights
    selfAvgA, selfAvgB,
    partnerAvgA, partnerAvgB,
    feelAvgA, feelAvgB
  };
}

// Draw dynamic SVG radar chart (10 Axes representation)
function renderRadarChart(dataA, dataB) {
  const svg = document.getElementById("radar-chart");
  svg.innerHTML = "";
  
  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 140;
  const levels = 5;
  
  // 10 behavioral dimensions short labels
  const axisLabels = BEHAVIORAL_ITEMS.map(item => (item.name || item.selfName || "").split(" ")[0]);

  // Performance calculation (Self + Partner evaluation) / 2
  const getDimensionValue = (dataSelf, dataPartner, itemId) => {
    const keySelf = `self${itemId.charAt(0).toUpperCase()}${itemId.slice(1)}`;
    const keyPartner = `partner${itemId.charAt(0).toUpperCase()}${itemId.slice(1)}`;
    return ((dataSelf[keySelf] || 3) + (dataPartner[keyPartner] || 3)) / 2;
  };

  const valuesA = BEHAVIORAL_ITEMS.map(item => getDimensionValue(dataA, dataB, item.id));
  const valuesB = BEHAVIORAL_ITEMS.map(item => getDimensionValue(dataB, dataA, item.id));

  const getCoordinates = (index, value) => {
    // 360 degrees / 10 axes = 36 degrees spacing
    const angle = (index * 36 - 90) * (Math.PI / 180);
    const radius = (value / 5) * maxRadius;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  };

  // Background circular grids
  for (let level = 1; level <= levels; level++) {
    const radius = (level / levels) * maxRadius;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "var(--text-muted)");
    circle.setAttribute("stroke-width", "0.5");
    circle.setAttribute("stroke-dasharray", "3,3");
    svg.appendChild(circle);
    
    if (level > 1) {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", cx + 5);
      text.setAttribute("y", cy - radius + 4);
      text.setAttribute("fill", "var(--text-muted)");
      text.setAttribute("font-size", "10px");
      text.textContent = level;
      svg.appendChild(text);
    }
  }

  // Axes lines and text labels
  axisLabels.forEach((label, i) => {
    const angle = (i * 36 - 90) * (Math.PI / 180);
    
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", cx);
    axisLine.setAttribute("y1", cy);
    axisLine.setAttribute("x2", cx + maxRadius * Math.cos(angle));
    axisLine.setAttribute("y2", cy + maxRadius * Math.sin(angle));
    axisLine.setAttribute("stroke", "var(--card-border)");
    axisLine.setAttribute("stroke-width", "1");
    svg.appendChild(axisLine);
    
    // Position labels
    const labelDistance = maxRadius + 22;
    const labelX = cx + labelDistance * Math.cos(angle);
    const labelY = cy + labelDistance * Math.sin(angle) + 4;
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", labelX);
    text.setAttribute("y", labelY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "var(--text-primary)");
    text.setAttribute("font-size", "12px");
    text.setAttribute("font-weight", "600");
    text.textContent = label;
    svg.appendChild(text);
  });

  // Draw Polygon A (Partner A's consensus score)
  const pointsA = valuesA.map((val, i) => {
    const coords = getCoordinates(i, val);
    return `${coords.x},${coords.y}`;
  }).join(" ");
  
  const polyA = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polyA.setAttribute("points", pointsA);
  polyA.setAttribute("fill", "rgba(212, 136, 136, 0.22)");
  polyA.setAttribute("stroke", "var(--accent-pink)");
  polyA.setAttribute("stroke-width", "2.5");
  svg.appendChild(polyA);

  // Draw Polygon B (Partner B's consensus score)
  const pointsB = valuesB.map((val, i) => {
    const coords = getCoordinates(i, val);
    return `${coords.x},${coords.y}`;
  }).join(" ");
  
  const polyB = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polyB.setAttribute("points", pointsB);
  polyB.setAttribute("fill", "rgba(217, 160, 91, 0.22)");
  polyB.setAttribute("stroke", "var(--accent-gold)");
  polyB.setAttribute("stroke-width", "2.5");
  svg.appendChild(polyB);
  
  // Data points circles
  const drawDots = (values, color) => {
    values.forEach((val, i) => {
      const coords = getCoordinates(i, val);
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", coords.x);
      dot.setAttribute("cy", coords.y);
      dot.setAttribute("r", "3.5");
      dot.setAttribute("fill", color);
      dot.setAttribute("stroke", "#fff");
      dot.setAttribute("stroke-width", "1");
      svg.appendChild(dot);
    });
  };
  drawDots(valuesA, "var(--accent-pink)");
  drawDots(valuesB, "var(--accent-gold)");
}

// Deep Insights (Gap checks)
function renderDeepInsights(dataA, dataB, results) {
  const container = document.getElementById("insights-container");
  container.innerHTML = "";
  
  const nameA = clientState.myRole === 'A' ? `${clientState.myName} (我)` : `${clientState.partnerName} (TA)`;
  const nameB = clientState.myRole === 'B' ? `${clientState.myName} (我)` : `${clientState.partnerName} (TA)`;

  const insights = [];

  // Insight 1: Check self-eval versus partner-eval gap (Overestimating)
  // Self average - Partner's evaluation of you
  const gapA = results.selfAvgA - results.partnerAvgA;
  const gapB = results.selfAvgB - results.partnerAvgB;

  if (gapA >= 0.7) {
    const descA = clientState.myRole === 'A'
      ? `${nameA} 的自评平均分 (${results.selfAvgA.toFixed(1)}) 明显高于TA评评分 (${results.partnerAvgA.toFixed(1)})。这说明我可能低估了自己的某些行为对TA造成的实际影响，建议温和倾听TA的心声。`
      : `${nameA} 的自评平均分 (${results.selfAvgA.toFixed(1)}) 明显高于TA评评分 (${results.partnerAvgA.toFixed(1)})。这说明TA可能低估了其某些行为对我造成的实际影响，建议温和倾听我的心声。`;
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: `${nameA} 的自我认知偏差`,
      desc: descA
    });
  }
  
  if (gapB >= 0.7) {
    const descB = clientState.myRole === 'B'
      ? `${nameB} 的自评平均分 (${results.selfAvgB.toFixed(1)}) 明显高于TA评评分 (${results.partnerAvgB.toFixed(1)})。这说明我可能低估了自己的某些行为对TA造成的实际影响，建议温和倾听TA的心声。`
      : `${nameB} 的自评平均分 (${results.selfAvgB.toFixed(1)}) 明显高于TA评评分 (${results.partnerAvgB.toFixed(1)})。这说明TA可能低估了其某些行为对我造成的实际影响，建议温和倾听我的心声。`;
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: `${nameB} 的自我认知偏差`,
      desc: descB
    });
  }

  // Insight 2: High behavior score but low general feeling
  // Average of (Self + Partner) vs General feelings
  const behaviorAvgA = (results.selfAvgA + results.partnerAvgB) / 2;
  const behaviorAvgB = (results.selfAvgB + results.partnerAvgA) / 2;

  if (behaviorAvgA >= 4.0 && results.feelAvgA < 3.2) {
    const descFeelA = clientState.myRole === 'A'
      ? `我这周在日常相处行为上的评分较高 (${behaviorAvgA.toFixed(1)})，但我的幸福感体感较低 (${results.feelAvgA.toFixed(1)})。这说明我表面上虽然做了很多具体的事情，但心里对关系的幸福感体感仍然有些低落，需要和TA多聊聊核心深层问题。`
      : `TA这周在日常相处行为上的评分较高 (${behaviorAvgA.toFixed(1)})，但TA的幸福感体感较低 (${results.feelAvgA.toFixed(1)})。这说明TA表面上虽然做了很多具体的事情，但TA在关系里可能有些底层的安全感或核心问题仍未得到有效照顾，我需要多给TA一些关心和倾听。`;
    insights.push({
      type: "info",
      icon: "💡",
      title: `${nameA} 的行为与体感温差`,
      desc: descFeelA
    });
  }

  if (behaviorAvgB >= 4.0 && results.feelAvgB < 3.2) {
    const descFeelB = clientState.myRole === 'B'
      ? `我这周在日常相处行为上的评分较高 (${behaviorAvgB.toFixed(1)})，但我的幸福感体感较低 (${results.feelAvgB.toFixed(1)})。这说明我表面上虽然做了很多具体的事情，但心里对关系的幸福感体感仍然有些低落，需要和TA多聊聊核心深层问题。`
      : `TA这周在日常相处行为上的评分较高 (${behaviorAvgB.toFixed(1)})，但TA的幸福感体感较低 (${results.feelAvgB.toFixed(1)})。这说明TA表面上虽然做了很多具体的事情，但TA在关系里可能有些底层的安全感或核心问题仍未得到有效照顾，我需要多给TA一些关心和倾听。`;
    insights.push({
      type: "info",
      icon: "💡",
      title: `${nameB} 的行为与体感温差`,
      desc: descFeelB
    });
  }

  // Empty state fallback -> Sweet and positive check
  if (insights.length === 0) {
    insights.push({
      type: "success",
      icon: "✨",
      title: "双向心智同频共鸣",
      desc: `本周我和TA的认知匹配度极高！我们在日常付出与行为表现上取得了极高共识，且幸福感体感非常均衡健康。这是一种极度成熟且彼此珍惜的亲密姿态，请继续保持！`
    });
  }

  // Render cards
  insights.forEach(item => {
    container.insertAdjacentHTML('beforeend', `
      <div class="insight-card ${item.type}">
        <span class="insight-icon">${item.icon}</span>
        <div class="insight-text">
          <strong>${item.title}</strong>
          <span>${item.desc}</span>
        </div>
      </div>
    `);
  });
}

// Renders dimension progress list
function renderBreakdown(dataA, dataB) {
  const container = document.getElementById("breakdown-list");
  container.innerHTML = "";

  const nameA = clientState.myRole === 'A' ? clientState.myName : clientState.partnerName;
  const nameB = clientState.myRole === 'B' ? clientState.myName : clientState.partnerName;

  // Let's list a few key dimensions
  const dimsToRender = [
    { name: "尊重意愿与边界", key: "Respect" },
    { name: "有话好好说 (沟通)", key: "Comm" },
    { name: "规矩说到做到 (共识)", key: "Consensus" },
    { name: "心安与坚定的偏爱 (安全感)", key: "Safety" }
  ];

  dimsToRender.forEach(dim => {
    // Score of A = (A self + B eval A) / 2
    const keySelf = `self${dim.key}`;
    const keyPartner = `partner${dim.key}`;
    
    const valA = ((dataA[keySelf] || 3) + (dataB[keyPartner] || 3)) / 2;
    const valB = ((dataB[keySelf] || 3) + (dataA[keyPartner] || 3)) / 2;
    
    container.insertAdjacentHTML('beforeend', `
      <div class="breakdown-item">
        <div class="breakdown-info">
          <span class="breakdown-dim-name">${dim.name}</span>
          <span class="breakdown-vals">${nameA}: <strong>${valA.toFixed(1)}</strong> vs ${nameB}: <strong>${valB.toFixed(1)}</strong></span>
        </div>
        <div class="breakdown-bars-group">
          <div class="breakdown-track">
            <div class="breakdown-bar-fill bar-a" style="width: ${(valA / 5) * 100}%"></div>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-bar-fill bar-b" style="width: ${(valB / 5) * 100}%"></div>
          </div>
        </div>
      </div>
    `);
  });

  // Add average feeling bar
  const getFeelAvg = (data) => {
    let sum = 0;
    FEEL_ITEMS.forEach(item => {
      const key = `feel${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
      sum += (data[key] || 3);
    });
    return sum / FEEL_ITEMS.length;
  };
  
  const feelA = getFeelAvg(dataA);
  const feelB = getFeelAvg(dataB);

  container.insertAdjacentHTML('beforeend', `
    <div class="breakdown-item">
      <div class="breakdown-info">
        <span class="breakdown-dim-name">关系幸福度综合体感</span>
        <span class="breakdown-vals">${nameA}: <strong>${feelA.toFixed(1)}</strong> vs ${nameB}: <strong>${feelB.toFixed(1)}</strong></span>
      </div>
      <div class="breakdown-bars-group">
        <div class="breakdown-track">
          <div class="breakdown-bar-fill bar-a" style="width: ${(feelA / 5) * 100}%"></div>
        </div>
        <div class="breakdown-track">
          <div class="breakdown-bar-fill bar-b" style="width: ${(feelB / 5) * 100}%"></div>
        </div>
      </div>
    </div>
  `);
}

// Renders the conflict badge
function renderConflictBadge(dataA, dataB) {
  const container = document.getElementById("conflict-badge-container");
  container.innerHTML = "";
  
  const hasConflict = dataA.conflictHappened || dataB.conflictHappened;
  
  let icon = "";
  let badgeClass = "";
  let name = "";
  let desc = "";
  
  if (!hasConflict) {
    icon = "🌸";
    badgeClass = "perfect";
    name = "岁月静好";
    desc = "这周过得温和又平静，没有发生明显的摩擦，祝贺我们度过了甜美的一周。";
  } else {
    const isAvoid = dataA.conflictHandling === "avoid" || dataB.conflictHandling === "avoid";
    const isWinWin = dataA.conflictHandling === "winwin" && dataB.conflictHandling === "winwin";
    
    if (isAvoid) {
      icon = "🔴";
      badgeClass = "warning";
      name = "回避预警";
      desc = "这周存在冷处理、逃避沟通或情绪攻击的情况。逃避会积压心结，请试着为了爱向前一步。";
    } else if (isWinWin) {
      icon = "🟢";
      badgeClass = "perfect";
      name = "完美协作";
      desc = "太赞了！面对摩擦，我们坦然接纳缺点，寻求共赢方案，不争谁对谁错。我们是完美的灵魂队友！";
    } else {
      icon = "🟡";
      badgeClass = "good";
      name = "直面修复";
      desc = "我们选择直面矛盾，并通过积极沟通解决了问题，给我们的真诚和关系修复效率点赞！";
    }
  }
  
  container.innerHTML = `
    <div class="badge-art ${badgeClass}">${icon}</div>
    <div class="conflict-badge-name">${name}</div>
    <div class="conflict-badge-desc">${desc}</div>
  `;
}

// Renders the 3 statements in report
function renderMessages(dataA, dataB) {
  const bodyA = document.getElementById("letter-content-a");
  const bodyB = document.getElementById("letter-content-b");

  // Dynamically name the tab buttons
  const tabA = document.getElementById("whisper-tab-a");
  const tabB = document.getElementById("whisper-tab-b");
  
  if (tabA && tabB) {
    const nameA = clientState.myRole === 'A' ? `${clientState.myName} (我)` : `${clientState.partnerName} (TA)`;
    const nameB = clientState.myRole === 'B' ? `${clientState.myName} (我)` : `${clientState.partnerName} (TA)`;
    tabA.textContent = `${nameA} 的留言`;
    tabB.textContent = `${nameB} 的留言`;
  }

  const buildMessageContent = (data, isA) => {
    return `
      <div class="whisper-list">
        <div class="whisper-item">
          <div class="whisper-label label-happy">
            这周最让我感到幸福的一件事 <span class="whisper-icon">💖</span>
          </div>
          <p class="whisper-content">${data.noteHappy || '未填写'}</p>
        </div>
        <div class="whisper-item">
          <div class="whisper-label label-improve">
            这周最希望被理解或改善的一件事 <span class="whisper-icon">💡</span>
          </div>
          <p class="whisper-content">${data.noteImprove || '未填写'}</p>
        </div>
        <div class="whisper-item">
          <div class="whisper-label label-action">
            下周我愿意为关系做出的一个具体行动 <span class="whisper-icon">🏃‍♂️</span>
          </div>
          <p class="whisper-content">${data.noteAction || '未填写'}</p>
        </div>
      </div>
    `;
  };

  bodyA.innerHTML = buildMessageContent(dataA, true);
  bodyB.innerHTML = buildMessageContent(dataB, false);
}

// ==========================================================================
// 8. Submit rubric to API
// ==========================================================================

async function handleRubricSubmit(e) {
  e.preventDefault();
  
  const data = {};
  
  // Gather self items
  BEHAVIORAL_ITEMS.forEach(item => {
    data[`self${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`] = parseInt(document.getElementById(`self-${item.id}`).value);
  });
  
  // Gather partner items
  BEHAVIORAL_ITEMS.forEach(item => {
    data[`partner${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`] = parseInt(document.getElementById(`partner-${item.id}`).value);
  });
  
  // Gather feel items
  FEEL_ITEMS.forEach(item => {
    data[`feel${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`] = parseInt(document.getElementById(`feel-${item.id}`).value);
  });
  
  // Conflict
  data.conflictHappened = document.getElementById("conflict-happened").checked;
  data.conflictHandling = document.querySelector('input[name="conflict-handling"]:checked').value;
  
  // Three statements
  data.noteHappy = document.getElementById("note-happy").value.trim();
  data.noteImprove = document.getElementById("note-improve").value.trim();
  data.noteAction = document.getElementById("note-action").value.trim();
  
  const { coupleId, currentWeek, myRole } = clientState;
  
  try {
    const response = await fetch('/api/rubric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coupleId,
        week: currentWeek,
        partner: myRole,
        data
      })
    });
    
    if (!response.ok) throw new Error("Failed to submit rubric");
    
    alert("提交成功！感谢你的真诚反馈。");
    
    // Reset Form statements
    resetFormInputs();
    
    // Switch to Dashboard
    const dashboardBtn = document.querySelector('.tab-btn[data-target="dashboard-tab"]');
    if (dashboardBtn) dashboardBtn.click();
    
  } catch (err) {
    console.error(err);
    alert("提交失败，请检查网络连接并重试。");
  }
}

// ==========================================================================
// 9. History records tab
// ==========================================================================

async function loadHistoryTab() {
  const container = document.getElementById("history-list-container");
  container.innerHTML = `<div class="empty-state"><p>正在加载历史记录...</p></div>`;
  
  try {
    const response = await fetch(`/api/history?coupleId=${clientState.coupleId}`);
    if (!response.ok) throw new Error("Failed to load history");
    const historyData = await response.json();
    
    const weeks = (historyData.weeks || []).sort().reverse();
    
    if (weeks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>暂无历史互评记录。我和TA都填写后即可在此查看历史曲线。</p>
        </div>
      `;
      updateHistoryStats([]);
      return;
    }
    
    container.innerHTML = "";
    
    const weekFetches = weeks.map(async (week) => {
      const resp = await fetch(`/api/rubric?coupleId=${clientState.coupleId}&week=${week}`);
      if (!resp.ok) return { week, unlocked: false };
      const data = await resp.json();
      return { week, ...data };
    });
    
    const weekResults = await Promise.all(weekFetches);
    
    updateHistoryStats(weekResults);
    
    weekResults.forEach(item => {
      const row = document.createElement("div");
      row.className = "history-item-row";
      
      const parts = item.week.split("-W");
      const weekLabel = parts.length === 2 ? `${parts[0]}年 第${parseInt(parts[1])}周` : item.week;
      
      if (item.unlocked) {
        const scores = calculateScores(item.A, item.B);
        const hasConflict = item.A.conflictHappened || item.B.conflictHappened;
        
        let emoji = "🌸";
        if (hasConflict) {
          const isAvoid = item.A.conflictHandling === "avoid" || item.B.conflictHandling === "avoid";
          const isWinWin = item.A.conflictHandling === "winwin" && item.B.conflictHandling === "winwin";
          emoji = isAvoid ? "🔴" : (isWinWin ? "🟢" : "🟡");
        }
        
        row.innerHTML = `
          <div class="history-item-info">
            <span class="history-week-name">${weekLabel}</span>
            <span class="history-summary-text">${emoji} ${scores.harmonyLevel} · 我和TA已填</span>
          </div>
          <div class="history-item-score-group">
            <div class="history-score-display">
              <span class="history-score-label">总满意度</span>
              <span class="history-score-val">${scores.harmonyScore}</span>
            </div>
            <span class="history-arrow">❯</span>
          </div>
        `;
      } else {
        const myDone = clientState.myRole === 'A' ? item.progress.A : item.progress.B;
        const statusText = myDone ? "等待TA填写..." : "我还没填，去填写";
        
        row.innerHTML = `
          <div class="history-item-info">
            <span class="history-week-name">${weekLabel}</span>
            <span class="history-summary-text">${statusText}</span>
          </div>
          <div class="history-item-score-group">
            <div class="history-score-display">
              <span class="history-score-label">状态</span>
              <span class="history-score-val" style="color: var(--text-muted)">未解锁</span>
            </div>
            <span class="history-arrow">❯</span>
          </div>
        `;
      }
      
      row.addEventListener("click", () => {
        document.getElementById("global-week-select").value = item.week;
        clientState.currentWeek = item.week;
        
        const dashboardBtn = document.querySelector('.tab-btn[data-target="dashboard-tab"]');
        if (dashboardBtn) {
          dashboardBtn.click();
          window.scrollTo(0, 0);
        }
      });
      
      container.appendChild(row);
    });
    
  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="empty-state"><p>加载历史记录失败，请刷新重试。</p></div>`;
  }
}

function updateHistoryStats(weekResults) {
  let count = 0;
  let totalScore = 0;
  let badges = 0;
  
  weekResults.forEach(item => {
    if (item.unlocked) {
      count++;
      const scores = calculateScores(item.A, item.B);
      totalScore += scores.harmonyScore;
      
      const hasConflict = item.A.conflictHappened || item.B.conflictHappened;
      const isAvoid = item.A.conflictHandling === "avoid" || item.B.conflictHandling === "avoid";
      if (!hasConflict || !isAvoid) {
        badges++;
      }
    }
  });
  
  document.getElementById("stat-weeks-count").textContent = count;
  document.getElementById("stat-avg-harmony").textContent = count > 0 ? Math.round(totalScore / count) : "--";
  document.getElementById("stat-badges-count").textContent = badges;
  
  // Render line chart for score trends
  const chartCard = document.getElementById("history-chart-card");
  if (chartCard) {
    const unlockedWeeks = weekResults.filter(item => item.unlocked).sort((a, b) => a.week.localeCompare(b.week));
    if (unlockedWeeks.length > 0) {
      chartCard.classList.remove("hidden");
      renderHistoryLineChart(unlockedWeeks);
    } else {
      chartCard.classList.add("hidden");
    }
  }
}

function renderHistoryLineChart(unlockedWeeks) {
  const svg = document.getElementById("history-line-chart");
  if (!svg) return;
  svg.innerHTML = ""; // Clear existing content

  const width = 500;
  const height = 250;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 40;
  
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  
  // 1. Grid and Y labels
  const yTicks = [0, 25, 50, 75, 100];
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridGroup.setAttribute("class", "chart-grid");
  
  yTicks.forEach(tick => {
    const y = padTop + chartH - (tick / 100) * chartH;
    
    // Grid line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", padLeft);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - padRight);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "var(--card-border)");
    line.setAttribute("stroke-dasharray", "4,4");
    gridGroup.appendChild(line);
    
    // Label
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", padLeft - 8);
    text.setAttribute("y", y + 4);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("font-size", "10");
    text.setAttribute("fill", "var(--text-muted)");
    text.textContent = tick;
    gridGroup.appendChild(text);
  });
  svg.appendChild(gridGroup);
  
  // 2. Gradients Defs
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="history-chart-fill-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--accent-pink)" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="var(--accent-pink)" stop-opacity="0.05"/>
    </linearGradient>
  `;
  svg.appendChild(defs);
  
  // 3. Compute points
  const points = [];
  const N = unlockedWeeks.length;
  
  unlockedWeeks.forEach((item, idx) => {
    const scores = calculateScores(item.A, item.B);
    const score = scores.harmonyScore;
    
    let x = padLeft + chartW / 2; // Default for single point
    if (N > 1) {
      x = padLeft + idx * (chartW / (N - 1));
    }
    
    const y = padTop + chartH - (score / 100) * chartH;
    
    const parts = item.week.split("-W");
    const weekLabel = parts.length === 2 ? `W${parseInt(parts[1])}` : item.week;
    
    points.push({ x, y, score, label: weekLabel });
  });
  
  // 4. Draw area under the curve
  if (points.length > 0) {
    const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = `M ${points[0].x} ${padTop + chartH} `; // Start at baseline
    points.forEach(p => {
      d += `L ${p.x} ${p.y} `;
    });
    d += `L ${points[points.length - 1].x} ${padTop + chartH} Z`; // Close path to baseline
    areaPath.setAttribute("d", d);
    areaPath.setAttribute("fill", "url(#history-chart-fill-grad)");
    svg.appendChild(areaPath);
  }
  
  // 5. Draw the main stroke line
  if (points.length > 0) {
    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      d += `L ${points[i].x} ${points[i].y} `;
    }
    linePath.setAttribute("d", d);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", "var(--accent-pink)");
    linePath.setAttribute("stroke-width", "3");
    linePath.setAttribute("stroke-linecap", "round");
    linePath.setAttribute("stroke-linejoin", "round");
    svg.appendChild(linePath);
  }
  
  // 6. Draw dots, score text and week labels
  points.forEach(p => {
    // Circle dot
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", "var(--card-bg)");
    circle.setAttribute("stroke", "var(--accent-pink)");
    circle.setAttribute("stroke-width", "3");
    svg.appendChild(circle);
    
    // Score value above dot
    const scoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    scoreText.setAttribute("x", p.x);
    scoreText.setAttribute("y", p.y - 12);
    scoreText.setAttribute("text-anchor", "middle");
    scoreText.setAttribute("font-size", "10");
    scoreText.setAttribute("font-weight", "700");
    scoreText.setAttribute("fill", "var(--text-primary)");
    scoreText.textContent = p.score;
    svg.appendChild(scoreText);
    
    // Week label underneath
    const weekText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    weekText.setAttribute("x", p.x);
    weekText.setAttribute("y", padTop + chartH + 20);
    weekText.setAttribute("text-anchor", "middle");
    weekText.setAttribute("font-size", "10");
    weekText.setAttribute("fill", "var(--text-secondary)");
    weekText.textContent = p.label;
    svg.appendChild(weekText);
  });
}
