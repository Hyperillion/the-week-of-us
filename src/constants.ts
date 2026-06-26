export interface BehavioralItem {
  id: string;
  name: string;
  selfName: string;
  partnerName: string;
  selfHint: string;
  partnerHint: string;
  selfQuestion: string;
  partnerQuestion: string;
  selfDesc: { [key: number]: string };
  partnerDesc: { [key: number]: string };
}

export interface FeelItem {
  id: string;
  name: string;
  hint: string;
  question: string;
  desc: { [key: number]: string };
}

export const SCORE_DESCRIPTIONS: { [key: number]: string } = {
  1: "严重缺失，或明知有问题仍持续回避、违反",
  2: "多次没有做到，已经影响关系体验",
  3: "基本做到，但稳定性或主动性不足",
  4: "整体较好，偶有不足但能及时调整",
  5: "做得非常好，有主动、稳定且具体的表现"
};

export const BEHAVIORAL_ITEMS: BehavioralItem[] = [
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
      5: "TA爱我最真实、最不完美的模样，让TA感到被全然拥抱"
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
      2: "TA只有廉价的口头关心，在实际家务或生病时当甩手岗柜",
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

export const FEEL_ITEMS: FeelItem[] = [
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

export function getSliderDescription(id: string, value: number): string {
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

export function calculateScores(dataA: any, dataB: any) {
  // Helper to calculate average of behavioral array
  const getAverage = (data: any, prefix: string, itemsList: BehavioralItem[]) => {
    let sum = 0;
    itemsList.forEach(item => {
      const key = `${prefix}${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
      sum += (data[key] || 3);
    });
    return sum / itemsList.length;
  };

  const getFeelAverage = (data: any) => {
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
    selfAvgA, selfAvgB,
    partnerAvgA, partnerAvgB,
    feelAvgA, feelAvgB
  };
}

export const MOCK_DATABASE: { [key: string]: { A: any; B: any } } = {
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
