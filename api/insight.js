import { getRubrics, getCouple, saveRubric } from './db.js';

function generateRuleBasedInsightsAndActions(dataA, dataB, nameA, nameB) {
  const insights = [];
  const actionGuideA = [];
  const actionGuideB = [];
  
  const getAverage = (data, prefix) => {
    const itemIds = ["Respect", "Comm", "Consensus", "Honest", "Confront", "Repair", "Accept", "Care", "Reliable", "Safety"];
    let sum = 0;
    itemIds.forEach(id => {
      const key = `${prefix}${id}`;
      sum += (data[key] || 3);
    });
    return sum / itemIds.length;
  };

  const getFeelAverage = (data) => {
    const feelIds = ["Happy", "Trust", "Connect", "Resolve_exp", "Tolerate", "Teamwork", "Hopeful", "Satisfy"];
    let sum = 0;
    feelIds.forEach(id => {
      const key = `feel${id}`;
      sum += (data[key] || 3);
    });
    return sum / feelIds.length;
  };

  const selfAvgA = getAverage(dataA, "self");
  const selfAvgB = getAverage(dataB, "self");
  const partnerAvgA = getAverage(dataB, "partner"); // B's rating of A
  const partnerAvgB = getAverage(dataA, "partner"); // A's rating of B

  const feelAvgA = getFeelAverage(dataA);
  const feelAvgB = getFeelAverage(dataB);

  const gapA = selfAvgA - partnerAvgA;
  const gapB = selfAvgB - partnerAvgB;

  if (gapA >= 0.7) {
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: `${nameA} 的自我认知偏差`,
      desc: `${nameA} 的自评平均分 (${selfAvgA.toFixed(1)}) 明显高于对TA评评分 (${partnerAvgA.toFixed(1)})。这说明他/她可能低估了自己某些行为对 ${nameB} 造成的实际影响，建议温和倾听对方心声。`
    });
    actionGuideA.push(`主动询问 ${nameB} 本周在哪些细节上感到被忽视，并温和倾听`);
    actionGuideB.push(`在氛围轻松时，温和且具体地向 ${nameA} 表达你的真实感受和边界`);
  }

  if (gapB >= 0.7) {
    insights.push({
      type: "warning",
      icon: "⚠️",
      title: `${nameB} 的自我认知偏差`,
      desc: `${nameB} 的自评平均分 (${selfAvgB.toFixed(1)}) 明显高于对TA评评分 (${partnerAvgB.toFixed(1)})。这说明他/她可能低估了自己某些行为对 ${nameA} 造成的实际影响，建议温和倾听对方心声。`
    });
    actionGuideB.push(`主动询问 ${nameA} 本周在哪些细节上感到被忽视，并温和倾听`);
    actionGuideA.push(`在氛围轻松时，温和且具体地向 ${nameB} 表达你的真实感受和边界`);
  }

  const behaviorAvgA = (selfAvgA + partnerAvgB) / 2;
  const behaviorAvgB = (selfAvgB + partnerAvgA) / 2;

  if (behaviorAvgA >= 4.0 && feelAvgA < 3.2) {
    insights.push({
      type: "info",
      icon: "💡",
      title: `${nameA} 的行为与体感温差`,
      desc: `${nameA} 这周在日常相处行为上的评分较高 (${behaviorAvgA.toFixed(1)})，但幸福感体感较低 (${feelAvgA.toFixed(1)})。这说明他/她表面上虽然做了很多具体的事情，但心里对关系的幸福感体感仍然有些低落，需要多聊聊核心深层问题。`
    });
    actionGuideA.push(`试着向 ${nameB} 分享你内心的压力和疲惫，卸下独自承担的包袱`);
    actionGuideB.push(`给 ${nameA} 准备一个温暖的拥抱，体恤他/她本周的默默付出`);
  }

  if (behaviorAvgB >= 4.0 && feelAvgB < 3.2) {
    insights.push({
      type: "info",
      icon: "💡",
      title: `${nameB} 的行为与体感温差`,
      desc: `${nameB} 这周在日常相处行为上的评分较高 (${behaviorAvgB.toFixed(1)})，但幸福感体感较低 (${feelAvgB.toFixed(1)})。这说明他/她表面上虽然做了很多具体的事情，但心里对关系的幸福感体感仍然有些低落，需要多聊聊核心深层问题。`
    });
    actionGuideB.push(`试着向 ${nameA} 分享你内心的压力和疲惫，卸下独自承担的包袱`);
    actionGuideA.push(`给 ${nameB} 准备一个温暖的拥抱，体恤他/她本周的默默付出`);
  }

  if (insights.length === 0) {
    insights.push({
      type: "success",
      icon: "✨",
      title: "双向心智同频共鸣",
      desc: "本周双方的认知匹配度极高！在日常付出与行为表现上取得了极高共识，且幸福感体感非常均衡健康。这是一种极度成熟且彼此珍惜的亲密姿态，请继续保持！"
    });
  }

  // Ensure there are at least 2 actions for A and B
  if (actionGuideA.length < 2) {
    actionGuideA.push(`给 ${nameB} 留一张爱意悄悄话卡片，感谢他/她本周的陪伴`);
    actionGuideA.push(`本周找个时间，和 ${nameB} 进行一次 10 分钟的心灵深聊`);
  }
  if (actionGuideB.length < 2) {
    actionGuideB.push(`给 ${nameA} 留一张爱意悄悄话卡片，感谢他/她本周的陪伴`);
    actionGuideB.push(`本周找个时间，和 ${nameA} 进行一次 10 分钟的心灵深聊`);
  }

  return { insights, actionGuideA, actionGuideB };
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { coupleId, week, partner } = req.query;
    if (!coupleId || !week) {
      return res.status(400).json({ error: "Missing required parameters: 'coupleId' and 'week'" });
    }

    const couple = await getCouple(coupleId);
    if (!couple) {
      return res.status(404).json({ error: "Couple not found" });
    }

    const rubrics = await getRubrics(coupleId, week);
    if (!rubrics.A || !rubrics.B) {
      return res.status(200).json({ insights: [], actionGuide: [], message: "Waiting for both partners to submit" });
    }

    const dataA = rubrics.A;
    const dataB = rubrics.B;
    const nameA = couple.nameA || "伴侣A";
    const nameB = couple.nameB || "伴侣B";

    // Return cached insights and filter action guide based on requesting partner
    if (rubrics.insights) {
      const cacheData = rubrics.insights;
      let insightsList = [];
      let actionGuide = [];

      if (Array.isArray(cacheData)) {
        // Legacy cache format (insights array only)
        insightsList = cacheData;
      } else if (cacheData && cacheData.insights) {
        // New cache format (object with insights and guides)
        insightsList = cacheData.insights;
        if (partner === 'A') {
          actionGuide = cacheData.actionGuideA || [];
        } else if (partner === 'B') {
          actionGuide = cacheData.actionGuideB || [];
        }
      }

      return res.status(200).json({
        insights: insightsList,
        actionGuide: actionGuide,
        fallback: false,
        cached: true
      });
    }

    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      console.warn("MINIMAX_API_KEY is not configured. Falling back to rule-based insights.");
      const fallbackData = generateRuleBasedInsightsAndActions(dataA, dataB, nameA, nameB);
      let actionGuide = [];
      if (partner === 'A') {
        actionGuide = fallbackData.actionGuideA;
      } else if (partner === 'B') {
        actionGuide = fallbackData.actionGuideB;
      }
      return res.status(200).json({
        insights: fallbackData.insights,
        actionGuide: actionGuide,
        fallback: true
      });
    }

    // Prepare prompt
    const systemPrompt = `你是一位资深的亲密关系专家和情感咨询师。
请根据伴侣双方填写的周度默契互评表数据（包括各自的自评、TA评、主观幸福体感、冲突处理方式以及详细的悄悄话备注），进行深度的关系洞察分析，并为双方指引定制专属的“下周行动指南”。
你必须分析：
1. 双方评分的默契程度（例如：自评与TA评是否存在明显的分歧/认知温差，即一方觉得自己做得很好，但另一方觉得不够）。
2. 双方的幸福感体感和连结感是否平衡。
3. 双方提到的悄悄话备注（"最开心的瞬间"、"需要改善的细节"、"下周行动承诺"），寻找其中的闪光点、心结或未被满足的期待。
4. 冲突发生情况及处理方式（冷处理回避 vs 积极沟通修复 vs 寻求共赢）。

输出格式规范：
你必须直接返回一个合法的 JSON 对象，绝对不能包含 \`\`\`json 等任何 Markdown 格式标记，确保可以直接被 JSON.parse 解析。
该 JSON 对象包含三个属性：
1. "insights": 一个数组，包含 3 到 4 条深度关系洞察。每个条目必须是包含 type ("success"|"info"|"warning"), icon (表情符号), title (8字内标题), desc (极简点评，70字内，不含英文双引号) 的对象。
2. "actionGuideA": 一个数组，包含 2 到 3 条给伴侣A（姓名：${nameA}）下周的具体行动建议指南（每条建议在 30 字以内，动作要具体可执行）。
3. "actionGuideB": 一个数组，包含 2 到 3 条给伴侣B（姓名：${nameB}）下周的具体行动建议指南（每条建议在 30 字以内，动作要具体可执行）。

注意：
- 关系洞察在 "insights" 中，是伴侣双方都可以看到的共享内容。
- 行动指南 "actionGuideA" 专属给 ${nameA} 一个人看，"actionGuideB" 专属给 ${nameB} 一个人看，请指导各自人称的独立行动。
- 在所有文本中，绝对不能出现未经转义的英文双引号（"），如果需要引用词语，请使用中文双引号（“和”）或单引号。
- 对于 "A" 和 "B" 这两个占位代称，你应该替换为他们的真实名字（${nameA} 和 ${nameB}）。

示例输出：
{
  "insights": [
    {
      "type": "success",
      "icon": "✨",
      "title": "温柔的退让",
      "desc": "本周 ${nameB} 提到吵架时 ${nameA} 给了自己台阶下很感动，这与 ${nameA} 评分中表现出的高包容度完全契合。你们能在冲突中看见彼此的爱，这非常难得！"
    },
    {
      "type": "warning",
      "icon": "⚠️",
      "title": "偏爱温差",
      "desc": "${nameA} 认为在安全感上做得很好，但 ${nameB} 的对TA评分仅给了2分。结合备注来看，${nameA} 因为工作疲惫忽略了 ${nameB} 的陪伴诉求，建议双方下周就此进行一次温柔的谈心。"
    }
  ],
  "actionGuideA": [
    "周三提前半小时下班，为 ${nameB} 准备其期待的日式咖喱饭作为惊喜",
    "当听到 ${nameB} 抱怨时，先停下手头工作注视对方 10 秒，倾听其委屈"
  ],
  "actionGuideB": [
    "主动分担周六的打扫卫生，让疲累的 ${nameA} 可以多休息补个觉",
    "在 ${nameA} 表现急躁时，用拥抱代替讲道理，包容其近期的工作压力"
  ]
}`;

    const userPrompt = `本周伴侣双方的打分和备注数据如下：

伴侣A的姓名：${nameA}
伴侣B的姓名：${nameB}

=======================================
【${nameA} 的数据】
- 针对 10 项日常相处行为的自我评分 (self) 和对 ${nameB} 的评分 (partner)：
  1. 尊重边界: 自评 ${dataA.selfRespect || 3} 分, 对TA评 ${dataA.partnerRespect || 3} 分
  2. 好好沟通: 自评 ${dataA.selfComm || 3} 分, 对TA评 ${dataA.partnerComm || 3} 分
  3. 说到做到: 自评 ${dataA.selfConsensus || 3} 分, 对TA评 ${dataA.partnerConsensus || 3} 分
  4. 坦诚与真实: 自评 ${dataA.selfHonest || 3} 分, 对TA评 ${dataA.partnerHonest || 3} 分
  5. 直面分歧: 自评 ${dataA.selfConfront || 3} 分, 对TA评 ${dataA.partnerConfront || 3} 分
  6. 积极修复: 自评 ${dataA.selfRepair || 3} 分, 对TA评 ${dataA.partnerRepair || 3} 分
  7. 包容与接纳: 自评 ${dataA.selfAccept || 3} 分, 对TA评 ${dataA.partnerAccept || 3} 分
  8. 体贴与关怀: 自评 ${dataA.selfCare || 3} 分, 对TA评 ${dataA.partnerCare || 3} 分
  9. 靠谱与执行力: 自评 ${dataA.selfReliable || 3} 分, 对TA评 ${dataA.partnerReliable || 3} 分
  10. 安全感: 自评 ${dataA.selfSafety || 3} 分, 对TA评 ${dataA.partnerSafety || 3} 分

- 幸福感体感评分 (feel):
  - 幸福感: ${dataA.feelHappy || 3} 分
  - 信任感: ${dataA.feelTrust || 3} 分
  - 连结感: ${dataA.feelConnect || 3} 分
  - 解决摩擦的信心: ${dataA.feelResolve_exp || 3} 分
  - 被包容度: ${dataA.feelTolerate || 3} 分
  - 团队协作默契: ${dataA.feelTeamwork || 3} 分
  - 对未来的期待: ${dataA.feelHopeful || 3} 分
  - 整体满意度: ${dataA.feelSatisfy || 3} 分

- 冲突情况:
  - 这周是否发生冲突？: ${dataA.conflictHappened ? '是' : '否'}
  - 冲突处理方式: ${dataA.conflictHandling === 'avoid' ? '冷处理/回避沟通' : dataA.conflictHandling === 'winwin' ? '双赢/寻求共识' : '直面修复/有话好好说'}

- 详细悄悄话备注：
  - 本周最开心的瞬间: "${dataA.noteHappy || '无'}"
  - 需要改善的细节: "${dataA.noteImprove || '无'}"
  - 下周的行动承诺: "${dataA.noteAction || '无'}"

=======================================
【${nameB} 的数据】
- 针对 10 项日常相处行为的自我评分 (self) 和对 ${nameA} 的评分 (partner)：
  1. 尊重边界: 自评 ${dataB.selfRespect || 3} 分, 对TA评 ${dataB.partnerRespect || 3} 分
  2. 好好沟通: 自评 ${dataB.selfComm || 3} 分, 对TA评 ${dataB.partnerComm || 3} 分
  3. 说到做到: 自评 ${dataB.selfConsensus || 3} 分, 对TA评 ${dataB.partnerConsensus || 3} 分
  4. 坦诚与真实: 自评 ${dataB.selfHonest || 3} 分, 对TA评 ${dataB.partnerHonest || 3} 分
  5. 直面分歧: 自评 ${dataB.selfConfront || 3} 分, 对TA评 ${dataB.partnerConfront || 3} 分
  6. 积极修复: 自评 ${dataB.selfRepair || 3} 分, 对TA评 ${dataB.partnerRepair || 3} 分
  7. 包容与接纳: 自评 ${dataB.selfAccept || 3} 分, 对TA评 ${dataB.partnerAccept || 3} 分
  8. 体贴与关怀: 自评 ${dataB.selfCare || 3} 分, 对TA评 ${dataB.partnerCare || 3} 分
  9. 靠谱与执行力: 自评 ${dataB.selfReliable || 3} 分, 对TA评 ${dataB.partnerReliable || 3} 分
  10. 安全感: 自评 ${dataB.selfSafety || 3} 分, 对TA评 ${dataB.partnerSafety || 3} 分

- 幸福感体感评分 (feel):
  - 幸福感: ${dataB.feelHappy || 3} 分
  - 信任感: ${dataB.feelTrust || 3} 分
  - 连结感: ${dataB.feelConnect || 3} 分
  - 解决摩擦的信心: ${dataB.feelResolve_exp || 3} 分
  - 被包容度: ${dataB.feelTolerate || 3} 分
  - 团队协作默契: ${dataB.feelTeamwork || 3} 分
  - 对未来的期待: ${dataB.feelHopeful || 3} 分
  - 整体满意度: ${dataB.feelSatisfy || 3} 分

- 冲突情况:
  - 这周是否发生冲突？: ${dataB.conflictHappened ? '是' : '否'}
  - 冲突处理方式: ${dataB.conflictHandling === 'avoid' ? '冷处理/回避沟通' : dataB.conflictHandling === 'winwin' ? '双赢/寻求共识' : '直面修复/有话好好说'}

- 详细悄悄话备注：
  - 本周最开心的瞬间: "${dataB.noteHappy || '无'}"
  - 需要改善的细节: "${dataB.noteImprove || '无'}"
  - 下周的行动承诺: "${dataB.noteAction || '无'}"

请根据以上打分数据和悄悄话描述，分析出 3-4 个深度关系洞察以及给小红、小明的下周各2-3条专属行动指南。直接返回合法的 JSON 对象。`;

    const apiBody = {
      model: "MiniMax-M3",
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            }
          ]
        }
      ],
      max_tokens: 1500,
      thinking: {
        type: "disabled"
      }
    };

    const minimaxResponse = await fetch("https://api.minimaxi.com/anthropic/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(apiBody)
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      console.error(`MiniMax API error: ${minimaxResponse.status} ${minimaxResponse.statusText} - ${errorText}`);
      const fallbackData = generateRuleBasedInsightsAndActions(dataA, dataB, nameA, nameB);
      let actionGuide = [];
      if (partner === 'A') {
        actionGuide = fallbackData.actionGuideA;
      } else if (partner === 'B') {
        actionGuide = fallbackData.actionGuideB;
      }
      return res.status(200).json({ insights: fallbackData.insights, actionGuide: actionGuide, fallback: true });
    }

    const result = await minimaxResponse.json();
    let replyText = "";
    if (result && Array.isArray(result.content)) {
      for (const block of result.content) {
        if (block.type === 'text' && block.text) {
          replyText += block.text;
        }
      }
    }

    let cleanText = replyText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    let parsedInsights;
    try {
      parsedInsights = JSON.parse(cleanText);
    } catch (e) {
      // JSON parse failed. Try to fix potential unquoted or partially quoted icon/emoji fields.
      let fixedText = cleanText;
      // Case 1: "icon": 💕", -> "icon": "💕",
      fixedText = fixedText.replace(/"icon":\s*([^"\s,\{\}\[\]]+)"/g, '"icon": "$1"');
      // Case 2: "icon": "💕, -> "icon": "💕",
      fixedText = fixedText.replace(/"icon":\s*"([^"\s,\{\}\[\]]+),/g, '"icon": "$1",');
      // Case 3: "icon": 💕, -> "icon": "💕",
      fixedText = fixedText.replace(/"icon":\s*([^"\s,\{\}\[\]]+),/g, '"icon": "$1",');

      try {
        parsedInsights = JSON.parse(fixedText);
      } catch (innerError) {
        console.error("Failed to parse MiniMax JSON output, raw text:", replyText);
        const fallbackData = generateRuleBasedInsightsAndActions(dataA, dataB, nameA, nameB);
        let actionGuide = [];
        if (partner === 'A') {
          actionGuide = fallbackData.actionGuideA;
        } else if (partner === 'B') {
          actionGuide = fallbackData.actionGuideB;
        }
        return res.status(200).json({ insights: fallbackData.insights, actionGuide: actionGuide, fallback: true });
      }
    }

    // Persist successfully generated AI insights (containing actionGuideA and actionGuideB) to database
    await saveRubric(coupleId, week, "insights", parsedInsights);

    let actionGuide = [];
    if (partner === 'A') {
      actionGuide = parsedInsights.actionGuideA || [];
    } else if (partner === 'B') {
      actionGuide = parsedInsights.actionGuideB || [];
    }

    return res.status(200).json({
      insights: parsedInsights.insights || [],
      actionGuide: actionGuide,
      fallback: false
    });

  } catch (error) {
    console.error("Error in api/insight.js:", error);
    const fallbackData = generateRuleBasedInsightsAndActions(rubrics.A, rubrics.B, couple.nameA, couple.nameB);
    let actionGuide = [];
    if (partner === 'A') {
      actionGuide = fallbackData.actionGuideA;
    } else if (partner === 'B') {
      actionGuide = fallbackData.actionGuideB;
    }
    return res.status(200).json({ insights: fallbackData.insights, actionGuide: actionGuide, fallback: true });
  }
}
