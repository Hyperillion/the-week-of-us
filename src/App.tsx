import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BEHAVIORAL_ITEMS,
  FEEL_ITEMS,
  getSliderDescription,
  calculateScores
} from './constants';
import { RadarChart } from './RadarChart';
import { HistoryLineChart } from './HistoryLineChart';

interface RubricReport {
  unlocked: boolean;
  progress: { A: boolean; B: boolean };
  A?: any;
  B?: any;
}

interface JoinInfo {
  coupleId: string;
  nameA: string;
  nameB: string;
  role: 'A' | 'B';
}

export default function App() {
  // Screens: 'onboarding' | 'share' | 'join' | 'app'
  const [screen, setScreen] = useState<'onboarding' | 'share' | 'join' | 'app'>('onboarding');
  
  // Settings & Session info
  const [coupleId, setCoupleId] = useState<string>("");
  const [myRole, setMyRole] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const [partnerName, setPartnerName] = useState<string>("");
  const [inviteUrl, setInviteUrl] = useState<string>("");
  
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem("couple_rubric_theme");
    if (saved === 'dark' || saved === 'light') return saved;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    return media.matches ? 'dark' : 'light';
  });

  // Settings Modal Open
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // App screen tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fill' | 'history'>('dashboard');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  // Global Week Selector
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const [weeksList, setWeeksList] = useState<{ key: string; text: string; isCurrent: boolean }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Rubric Data for currently selected week
  const [reportData, setReportData] = useState<RubricReport | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Form input states
  const [partnerScores, setPartnerScores] = useState<Record<string, number>>({});
  const [selfScores, setSelfScores] = useState<Record<string, number>>({});
  const [feelScores, setFeelScores] = useState<Record<string, number>>({});
  const [conflictHappened, setConflictHappened] = useState(false);
  const [conflictHandling, setConflictHandling] = useState<'avoid' | 'resolve' | 'winwin'>('avoid');
  const [noteHappy, setNoteHappy] = useState("");
  const [noteImprove, setNoteImprove] = useState("");
  const [noteAction, setNoteAction] = useState("");

  // History logs tab
  const [historyWeeks, setHistoryWeeks] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Join invitation info
  const [joinInfo, setJoinInfo] = useState<JoinInfo | null>(null);

  // Create Cabin Form Inputs
  const [createNameA, setCreateNameA] = useState("");
  const [createNameB, setCreateNameB] = useState("");

  // Questionnaire Item Comments
  const [selfComments, setSelfComments] = useState<Record<string, string>>({});
  const [partnerComments, setPartnerComments] = useState<Record<string, string>>({});
  const [feelComments, setFeelComments] = useState<Record<string, string>>({});

  // Expandable comments tracking in form
  const [expandedSelfComments, setExpandedSelfComments] = useState<Record<string, boolean>>({});
  const [expandedPartnerComments, setExpandedPartnerComments] = useState<Record<string, boolean>>({});
  const [expandedFeelComments, setExpandedFeelComments] = useState<Record<string, boolean>>({});

  // Expandable comments tracking in unlocked report Dashboard
  const [expandedReportItems, setExpandedReportItems] = useState<Record<string, boolean>>({});

  // Dashboard state whisper letters tab
  const [activeWhisperTab, setActiveWhisperTab] = useState<'A' | 'B'>('A');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Copy helper
  const copyInviteLink = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const targetRole = myRole === 'B' ? 'A' : 'B';
    const url = `${window.location.origin}/?coupleId=${coupleId}&role=${targetRole}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => showToast("专属邀请链接已复制到剪贴板，快发送给TA吧！", "success"))
        .catch(() => fallbackCopyText(url));
    } else {
      fallbackCopyText(url);
    }
  };

  const fallbackCopyText = (text: string) => {
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
      showToast("专属邀请链接已复制到剪贴板，快发送给TA吧！", "success");
    } catch (err) {
      console.error('Fallback copy failed', err);
      showToast("复制链接失败，请手动复制：" + text, "error");
    }
    document.body.removeChild(textArea);
  };

  // Inject mock data helper if backend is empty
  /*
  const injectMockDataIfEmpty = async (cid: string) => {
    try {
      const response = await fetch(`/api/history?coupleId=${cid}`);
      if (response.ok) {
        const data = await response.json();
        if (!data.weeks || data.weeks.length === 0) {
          console.log("Database is empty, injecting mock weeks...");
          for (const week of ["2026-W24", "2026-W25"]) {
            await fetch('/api/rubric', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                coupleId: cid,
                week,
                partner: "A",
                data: MOCK_DATABASE[week].A
              })
            });
            await fetch('/api/rubric', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                coupleId: cid,
                week,
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
  };
  */

  // Session checks and mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCoupleId = params.get("coupleId");
    const urlRole = params.get("role");
    const savedCoupleId = localStorage.getItem("us_couple_id");

    if (urlCoupleId && (urlRole === "A" || urlRole === "B")) {
      setScreen('join');
      fetch(`/api/couple?id=${urlCoupleId}`)
        .then(res => {
          if (!res.ok) throw new Error("Cabin not found");
          return res.json();
        })
        .then(data => {
          setJoinInfo({
            coupleId: urlCoupleId,
            nameA: data.nameA,
            nameB: data.nameB,
            role: urlRole as 'A' | 'B'
          });
        })
        .catch(err => {
          console.error(err);
          showToast("邀请链接无效或房间已被删除。", "error");
          setScreen(savedCoupleId ? 'app' : 'onboarding');
        });
    } else if (savedCoupleId) {
      const savedRole = localStorage.getItem("us_my_role") || "A";
      const savedName = localStorage.getItem("us_my_name") || "我";
      const savedPartner = localStorage.getItem("us_partner_name") || "TA";
      
      setCoupleId(savedCoupleId);
      setMyRole(savedRole);
      setMyName(savedName);
      setPartnerName(savedPartner);
      setScreen('app');

      if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      setScreen('onboarding');
    }
  }, [showToast]);

  // Theme effect
  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("couple_rubric_theme", theme);
  }, [theme]);

  // Handle OS theme changes automatically
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleOsChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("couple_rubric_theme");
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener("change", handleOsChange);
    return () => media.removeEventListener("change", handleOsChange);
  }, []);

  // Fetch history list dropdown options
  const fetchHistoryWeeks = useCallback(async () => {
    if (!coupleId) return;
    try {
      const response = await fetch(`/api/history?coupleId=${coupleId}`);
      if (!response.ok) throw new Error("Failed to fetch history weeks");
      const data = await response.json();
      const hist = data.weeks || [];

      // Generate current week ISO string
      const today = new Date();
      const getISOWeek = (date: Date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return { year: d.getUTCFullYear(), week: weekNo };
      };

      const currentISO = getISOWeek(today);
      const currentWeekKey = `${currentISO.year}-W${currentISO.week.toString().padStart(2, '0')}`;

      const weeksSet = new Set<string>();
      weeksSet.add(currentWeekKey);
      hist.forEach((w: string) => {
        if (w) weeksSet.add(w);
      });

      const sortedWeeks = Array.from(weeksSet).sort().reverse();

      const getWeekRangeString = (weekKey: string) => {
        const parts = weekKey.split("-W");
        if (parts.length !== 2) return "";
        const year = parseInt(parts[0]);
        const week = parseInt(parts[1]);

        const simple = new Date(year, 0, 4);
        const day = simple.getDay();
        const diff = simple.getDate() - day + (day === 0 ? -6 : 1);
        const week1Monday = new Date(simple.setDate(diff));

        const monday = new Date(week1Monday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
        const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);

        return `${(monday.getMonth() + 1).toString().padStart(2, '0')}/${monday.getDate().toString().padStart(2, '0')} - ${(sunday.getMonth() + 1).toString().padStart(2, '0')}/${sunday.getDate().toString().padStart(2, '0')}`;
      };

      const list = sortedWeeks.map(key => {
        const range = getWeekRangeString(key);
        const parts = key.split("-W");
        const weekNum = parts.length === 2 ? parseInt(parts[1]) : key;
        const isCurrent = key === currentWeekKey;
        const text = `${parts[0]}年 第${weekNum}周 (${range})${isCurrent ? " [本周]" : ""}`;
        return { key, text, isCurrent };
      });

      setWeeksList(list);

      if (!currentWeek) {
        setCurrentWeek(currentWeekKey);
      }
    } catch (err) {
      console.error(err);
    }
  }, [coupleId, currentWeek]);

  // Load week list once app starts
  useEffect(() => {
    if (screen === 'app' && coupleId) {
      fetchHistoryWeeks();
    }
  }, [screen, coupleId, fetchHistoryWeeks]);

  // Fetch weekly report data
  const fetchWeeklyReport = useCallback(async (weekKey: string) => {
    if (!coupleId || !weekKey || !myRole) return;
    try {
      const response = await fetch(`/api/rubric?coupleId=${coupleId}&week=${weekKey}&partner=${myRole}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data: RubricReport = await response.json();
      setReportData(data);

      if (data.unlocked) {
        setInsightsLoading(true);
        try {
          const insightResponse = await fetch(`/api/insight?coupleId=${coupleId}&week=${weekKey}`);
          if (insightResponse.ok) {
            const insightData = await insightResponse.json();
            setInsights(insightData.insights || []);
          } else {
            console.error("Failed to fetch LLM insights");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setInsightsLoading(false);
        }
      } else {
        setInsights([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [coupleId, myRole]);

  // Auto trigger report fetch
  useEffect(() => {
    if (screen === 'app' && coupleId && currentWeek && myRole) {
      fetchWeeklyReport(currentWeek);
    }
  }, [screen, coupleId, currentWeek, myRole, fetchWeeklyReport]);

  // Load history list data when history tab is active
  const loadHistoryData = useCallback(async () => {
    if (!coupleId) return;
    setHistoryLoading(true);
    try {
      const response = await fetch(`/api/history?coupleId=${coupleId}`);
      if (!response.ok) throw new Error("Failed to load history list");
      const data = await response.json();
      const weeks: string[] = (data.weeks || []).sort().reverse();

      if (weeks.length === 0) {
        setHistoryWeeks([]);
        return;
      }

      const fetches = weeks.map(async (week) => {
        const resp = await fetch(`/api/rubric?coupleId=${coupleId}&week=${week}`);
        if (!resp.ok) return { week, unlocked: false, progress: { A: false, B: false } };
        const rData = await resp.json();
        return { week, ...rData };
      });

      const results = await Promise.all(fetches);
      setHistoryWeeks(results);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  }, [coupleId]);

  useEffect(() => {
    if (screen === 'app' && activeTab === 'history') {
      loadHistoryData();
    }
  }, [screen, activeTab, loadHistoryData]);

  // Populate or reset form states based on loaded report data
  useEffect(() => {
    const myData = myRole === 'A' ? reportData?.A : reportData?.B;
    if (myData) {
      const newPartnerScores: Record<string, number> = {};
      const newSelfScores: Record<string, number> = {};
      const newFeelScores: Record<string, number> = {};

      const newSelfComments: Record<string, string> = {};
      const newPartnerComments: Record<string, string> = {};
      const newFeelComments: Record<string, string> = {};

      BEHAVIORAL_ITEMS.forEach(item => {
        const cap = item.id.charAt(0).toUpperCase() + item.id.slice(1);
        newSelfScores[item.id] = myData[`self${cap}`] ?? 3;
        newPartnerScores[item.id] = myData[`partner${cap}`] ?? 3;
        newSelfComments[item.id] = myData[`selfComment${cap}`] || "";
        newPartnerComments[item.id] = myData[`partnerComment${cap}`] || "";
      });

      FEEL_ITEMS.forEach(item => {
        const cap = item.id.charAt(0).toUpperCase() + item.id.slice(1);
        newFeelScores[item.id] = myData[`feel${cap}`] ?? 3;
        newFeelComments[item.id] = myData[`feelComment${cap}`] || "";
      });

      setSelfScores(newSelfScores);
      setPartnerScores(newPartnerScores);
      setFeelScores(newFeelScores);

      setSelfComments(newSelfComments);
      setPartnerComments(newPartnerComments);
      setFeelComments(newFeelComments);

      setConflictHappened(!!myData.conflictHappened);
      setConflictHandling(myData.conflictHandling || 'avoid');
      setNoteHappy(myData.noteHappy || "");
      setNoteImprove(myData.noteImprove || "");
      setNoteAction(myData.noteAction || "");
    } else {
      const defaultPartnerScores: Record<string, number> = {};
      const defaultSelfScores: Record<string, number> = {};
      const defaultFeelScores: Record<string, number> = {};

      BEHAVIORAL_ITEMS.forEach(item => {
        defaultSelfScores[item.id] = 3;
        defaultPartnerScores[item.id] = 3;
      });
      FEEL_ITEMS.forEach(item => {
        defaultFeelScores[item.id] = 3;
      });

      setSelfScores(defaultSelfScores);
      setPartnerScores(defaultPartnerScores);
      setFeelScores(defaultFeelScores);

      setSelfComments({});
      setPartnerComments({});
      setFeelComments({});

      setConflictHappened(false);
      setConflictHandling('avoid');
      setNoteHappy("");
      setNoteImprove("");
      setNoteAction("");
    }
  }, [reportData, myRole]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const dropdown = document.getElementById("custom-week-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [isDropdownOpen]);

  // Sliding Nav Indicator Position Sync
  const updateNavIndicator = useCallback(() => {
    if (!tabsRef.current) return;
    const activeBtn = tabsRef.current.querySelector(".tab-btn.active") as HTMLElement | null;
    if (activeBtn) {
      setIndicatorStyle({
        width: `${activeBtn.offsetWidth}px`,
        transform: `translateX(${activeBtn.offsetLeft}px)`,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateNavIndicator, 100);
    window.addEventListener("resize", updateNavIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateNavIndicator);
    };
  }, [activeTab, screen, updateNavIndicator]);

  // Screen 1 form submission: Create Room
  const handleCreateCabin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameA = createNameA.trim();
    const nameB = createNameB.trim();
    if (!nameA || !nameB) return;

    try {
      const response = await fetch('/api/couple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameA, nameB })
      });
      if (!response.ok) throw new Error("Failed to create room");
      const data = await response.json();

      setCoupleId(data.coupleId);
      setMyRole("A");
      setMyName(nameA);
      setPartnerName(nameB);

      const invite = `${window.location.origin}/?coupleId=${data.coupleId}&role=B`;
      setInviteUrl(invite);
      setScreen('share');
    } catch (err) {
      console.error(err);
      showToast("创建小屋失败，请稍后重试。", "error");
    }
  };

  // Screen 2 Share room: entering cabin
  const handleEnterMySide = async () => {
    localStorage.setItem("us_couple_id", coupleId);
    localStorage.setItem("us_my_role", "A");
    localStorage.setItem("us_my_name", myName);
    localStorage.setItem("us_partner_name", partnerName);

    // await injectMockDataIfEmpty(coupleId);
    setScreen('app');
  };

  // Screen 3 Join room: accepting invite
  const handleAcceptInvite = async () => {
    if (!joinInfo) return;
    const { coupleId: cid, nameA, nameB, role } = joinInfo;

    const myRoleVal = role;
    const myNameVal = role === 'A' ? nameA : nameB;
    const partnerNameVal = role === 'A' ? nameB : nameA;

    localStorage.setItem("us_couple_id", cid);
    localStorage.setItem("us_my_role", myRoleVal);
    localStorage.setItem("us_my_name", myNameVal);
    localStorage.setItem("us_partner_name", partnerNameVal);

    setCoupleId(cid);
    setMyRole(myRoleVal);
    setMyName(myNameVal);
    setPartnerName(partnerNameVal);

    window.history.replaceState({}, document.title, window.location.pathname);
    // await injectMockDataIfEmpty(cid);
    setScreen('app');
  };

  // Settings: leave room
  const handleLeaveRoom = () => {
    if (window.confirm("确定要注销并退出当前小屋吗？所有历史数据保留在云端，本地缓存将被清空。")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Submit evaluation form
  const handleRubricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: Record<string, any> = {};
    BEHAVIORAL_ITEMS.forEach(item => {
      const cap = item.id.charAt(0).toUpperCase() + item.id.slice(1);
      data[`self${cap}`] = selfScores[item.id] ?? 3;
      data[`partner${cap}`] = partnerScores[item.id] ?? 3;
      data[`selfComment${cap}`] = selfComments[item.id] || "";
      data[`partnerComment${cap}`] = partnerComments[item.id] || "";
    });

    FEEL_ITEMS.forEach(item => {
      const cap = item.id.charAt(0).toUpperCase() + item.id.slice(1);
      data[`feel${cap}`] = feelScores[item.id] ?? 3;
      data[`feelComment${cap}`] = feelComments[item.id] || "";
    });

    data.conflictHappened = conflictHappened;
    data.conflictHandling = conflictHandling;
    data.noteHappy = noteHappy.trim();
    data.noteImprove = noteImprove.trim();
    data.noteAction = noteAction.trim();

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
      showToast("提交成功！感谢你的真诚反馈。", "success");

      // Reload report data
      await fetchWeeklyReport(currentWeek);
      await fetchHistoryWeeks();
      
      // Navigate to Dashboard
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      showToast("提交失败，请检查网络连接并重试。", "error");
    }
  };

  // Calculations for report UI
  const hasReport = reportData && reportData.unlocked && reportData.A && reportData.B;
  const reportResults = hasReport ? calculateScores(reportData.A, reportData.B) : null;
  const insightsList = insights.length > 0 ? insights : (hasReport && reportResults ? (() => {
    const list: { type: 'warning' | 'info' | 'success'; icon: string; title: string; desc: string }[] = [];
    const nameA = myRole === 'A' ? `${myName} (我)` : `${partnerName} (TA)`;
    const nameB = myRole === 'B' ? `${myName} (我)` : `${partnerName} (TA)`;

    const gapA = reportResults.selfAvgA - reportResults.partnerAvgA;
    const gapB = reportResults.selfAvgB - reportResults.partnerAvgB;

    if (gapA >= 0.7) {
      const descA = myRole === 'A'
        ? `${nameA} 的自评平均分 (${reportResults.selfAvgA.toFixed(1)}) 明显高于TA评评分 (${reportResults.partnerAvgA.toFixed(1)})。这说明我可能低估了自己的某些行为对TA造成的实际影响，建议温和倾听TA的心声。`
        : `${nameA} 的自评平均分 (${reportResults.selfAvgA.toFixed(1)}) 明显高于TA评评分 (${reportResults.partnerAvgA.toFixed(1)})。这说明TA可能低估了其某些行为对我造成的实际影响，建议温和倾听我的心声。`;
      list.push({ type: "warning", icon: "⚠️", title: `${nameA} 的自我认知偏差`, desc: descA });
    }

    if (gapB >= 0.7) {
      const descB = myRole === 'B'
        ? `${nameB} 的自评平均分 (${reportResults.selfAvgB.toFixed(1)}) 明显高于TA评评分 (${reportResults.partnerAvgB.toFixed(1)})。这说明我可能低估了自己的某些行为对TA造成的实际影响，建议温和倾听TA的心声。`
        : `${nameB} 的自评平均分 (${reportResults.selfAvgB.toFixed(1)}) 明显高于TA评评分 (${reportResults.partnerAvgB.toFixed(1)})。这说明TA可能低估了其某些行为对我造成的实际影响，建议温和倾听我的心声。`;
      list.push({ type: "warning", icon: "⚠️", title: `${nameB} 的自我认知偏差`, desc: descB });
    }

    const behaviorAvgA = (reportResults.selfAvgA + reportResults.partnerAvgB) / 2;
    const behaviorAvgB = (reportResults.selfAvgB + reportResults.partnerAvgA) / 2;

    if (behaviorAvgA >= 4.0 && reportResults.feelAvgA < 3.2) {
      const descFeelA = myRole === 'A'
        ? `我这周在日常相处行为上的评分较高 (${behaviorAvgA.toFixed(1)})，但我的幸福感体感较低 (${reportResults.feelAvgA.toFixed(1)})。这说明我表面上虽然做了很多具体的事情，但心里对关系的幸福感体感仍然有些低落，需要和TA多聊聊核心深层问题。`
        : `TA这周在日常相处行为上的评分较高 (${behaviorAvgA.toFixed(1)})，但TA的幸福感体感较低 (${reportResults.feelAvgA.toFixed(1)})。这说明TA表面上虽然做了很多具体的事情，但TA在关系里可能有些底层的安全感或核心问题仍未得到有效照顾，我需要多给TA一些关心和倾听。`;
      list.push({ type: "info", icon: "💡", title: `${nameA} 的行为与体感温差`, desc: descFeelA });
    }

    if (behaviorAvgB >= 4.0 && reportResults.feelAvgB < 3.2) {
      const descFeelB = myRole === 'B'
        ? `我这周在日常相处行为上的评分较高 (${behaviorAvgB.toFixed(1)})，但我的幸福感体感较低 (${reportResults.feelAvgB.toFixed(1)})。这说明我表面上虽然做了很多具体的事情，但心里对关系的幸福感体感仍然有些低落，需要和TA多聊聊核心深层问题。`
        : `TA这周在日常相处行为上的评分较高 (${behaviorAvgB.toFixed(1)})，但TA的幸福感体感较低 (${reportResults.feelAvgB.toFixed(1)})。这说明TA表面上虽然做了很多具体的事情，但TA在关系里可能有些底层的安全感或核心问题仍未得到有效照顾，我需要多给TA一些关心 and 倾听。`;
      list.push({ type: "info", icon: "💡", title: `${nameB} 的行为与体感温差`, desc: descFeelB });
    }

    if (list.length === 0) {
      list.push({
        type: "success",
        icon: "✨",
        title: "双向心智同频共鸣",
        desc: "本周我和TA的认知匹配度极高！我们在日常付出与行为表现上取得了极高共识，且幸福感体感非常均衡健康。这是一种极度成熟且彼此珍惜的亲密姿态，请继续保持！"
      });
    }
    return list;
  })() : []);

  // Breakdown render calculation values
  const myNameLabelA = myRole === 'A' ? myName : partnerName;
  const myNameLabelB = myRole === 'B' ? myName : partnerName;
  
  const dimsToRender = [
    { name: "尊重意愿与边界", key: "Respect" },
    { name: "有话好好说 (沟通)", key: "Comm" },
    { name: "规矩说到做到 (共识)", key: "Consensus" },
    { name: "心安与坚定的偏爱 (安全感)", key: "Safety" }
  ];

  // Conflict Badge details
  const conflictBadgeInfo = hasReport ? (() => {
    const dataA = reportData.A;
    const dataB = reportData.B;
    const hasConflict = dataA.conflictHappened || dataB.conflictHappened;

    if (!hasConflict) {
      return {
        icon: "🌸",
        badgeClass: "perfect",
        name: "岁月静好",
        desc: "这周过得温和又平静，没有发生明显的摩擦，祝贺我们度过了甜美的一周"
      };
    } else {
      const isAvoid = dataA.conflictHandling === "avoid" || dataB.conflictHandling === "avoid";
      const isWinWin = dataA.conflictHandling === "winwin" && dataB.conflictHandling === "winwin";
      
      if (isAvoid) {
        return {
          icon: "🔴",
          badgeClass: "warning",
          name: "回避预警",
          desc: "这周存在冷处理、逃避沟通或情绪攻击的情况。逃避会积压心结，请试着为了爱向前一步"
        };
      } else if (isWinWin) {
        return {
          icon: "🟢",
          badgeClass: "perfect",
          name: "完美协作",
          desc: "太赞了！面对摩擦，我们坦然接纳缺点，寻求共赢方案，不争谁对谁错。我们是完美的灵魂队友"
        };
      } else {
        return {
          icon: "🟡",
          badgeClass: "good",
          name: "直面修复",
          desc: "我们选择直面矛盾，并通过积极沟通解决了问题，给我们的真诚和关系修复效率点赞"
        };
      }
    }
  })() : null;

  // Selected dropdown text label helper
  const selectedWeekObj = weeksList.find(w => w.key === currentWeek);
  const selectedWeekText = selectedWeekObj ? selectedWeekObj.text : "加载中...";

  // Progress filling states labels
  const hasA = reportData?.progress?.A || false;
  const hasB = reportData?.progress?.B || false;
  const myDone = myRole === 'A' ? hasA : hasB;
  const partnerDone = myRole === 'A' ? hasB : hasA;

  // History stats computation
  const historyStats = (() => {
    let count = 0;
    let totalScore = 0;
    let badges = 0;
    const unlockedList: any[] = [];

    historyWeeks.forEach(item => {
      if (item.unlocked) {
        count++;
        const scores = calculateScores(item.A, item.B);
        totalScore += scores.harmonyScore;
        
        const hasConflict = item.A.conflictHappened || item.B.conflictHappened;
        const isAvoid = item.A.conflictHandling === "avoid" || item.B.conflictHandling === "avoid";
        if (!hasConflict || !isAvoid) {
          badges++;
        }
        unlockedList.push(item);
      }
    });

    return {
      count,
      avgHarmony: count > 0 ? Math.round(totalScore / count) : "--",
      badges,
      unlockedList: unlockedList.sort((a, b) => a.week.localeCompare(b.week))
    };
  })();
  return (
    <div className="app-root-container">
      {/* Background Decorative Blobs */}
      <div className="bg-blobs-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* App Header */}
      <header className="app-header">
        <div className="header-container">
          <div
            className={`brand ${screen === 'app' ? 'clickable' : ''}`}
            onClick={() => {
              if (screen === 'app') {
                setIsSettingsOpen(true);
              }
            }}
          >
            <span className="brand-cursive">The Week of Us</span>
            <h1 className="brand-title" id="app-title-text">
              {screen === 'app' ? `${myName} ❤️ ${partnerName}` : "每周双向互评 Rubric"}
            </h1>
          </div>
          <div className="header-actions">
            {/* Global Week Selector (Only visible on screen-app) */}
            {screen === 'app' && (
              <div className="week-selector-bar" id="header-week-selector">
                <div className={`custom-dropdown ${isDropdownOpen ? 'active' : ''}`} id="custom-week-dropdown">
                  <button
                    type="button"
                    className="dropdown-trigger"
                    id="week-dropdown-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                  >
                    <span className="selected-value">{selectedWeekText}</span>
                    <span className="dropdown-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="arrow-svg">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div className="dropdown-menu" id="week-dropdown-menu" role="listbox">
                    {weeksList.map(item => (
                      <div
                        key={item.key}
                        className={`dropdown-item ${currentWeek === item.key ? 'active' : ''}`}
                        role="option"
                        aria-selected={currentWeek === item.key}
                        data-value={item.key}
                        onClick={() => {
                          setCurrentWeek(item.key);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">

        {/* ==================== SCREEN 1: ONBOARDING (CREATE CABIN) ==================== */}
        {screen === 'onboarding' && (
          <section id="screen-onboarding" className="screen">
            <div className="card onboarding-card">
              <div className="card-badge">第一步</div>
              <h2>创建我们的默契小屋</h2>
              <p className="section-desc">输入我和TA的名字，生成我们的专属小屋以及给TA的邀请链接</p>
              
              <form id="create-cabin-form" className="form-standard" onSubmit={handleCreateCabin}>
                <div className="form-group">
                  <label htmlFor="create-name-a">我的名字</label>
                  <input
                    type="text"
                    id="create-name-a"
                    required
                    autoComplete="name"
                    maxLength={15}
                    value={createNameA}
                    onChange={(e) => setCreateNameA(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="create-name-b">TA的名字</label>
                  <input
                    type="text"
                    id="create-name-b"
                    required
                    maxLength={15}
                    value={createNameB}
                    onChange={(e) => setCreateNameB(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-large btn-full">开启默契小屋</button>
              </form>
            </div>
          </section>
        )}

        {/* ==================== SCREEN 2: INVITATION / SHARE ==================== */}
        {screen === 'share' && (
          <section id="screen-share" className="screen">
            <div className="card onboarding-card">
              <div className="card-badge">第二步</div>
              <h2>小屋创建成功！🏡</h2>
              <p className="section-desc">请将下方的专属邀请链接复制发送给TA，TA点击后即可加入这间小屋</p>
              
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="invite-link-input">专属邀请链接</label>
                <div className="share-box" style={{ margin: '0.4rem 0 0 0' }}>
                  <input type="text" id="invite-link-input" readOnly value={inviteUrl} />
                  <button id="copy-link-btn" className="btn btn-primary" onClick={() => copyInviteLink()}>
                    复制链接
                  </button>
                </div>
              </div>

              <div className="onboarding-actions">
                <button
                  id="enter-my-side-btn"
                  className="btn btn-primary btn-large btn-full"
                  onClick={handleEnterMySide}
                >
                  进入我的一侧
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================== SCREEN 3: WELCOME / JOIN INVITATION ==================== */}
        {screen === 'join' && (
          <section id="screen-join" className="screen">
            <div className="card onboarding-card">
              <div className="card-badge">欢迎加入</div>
              <h2>双向默契小屋邀请 💌</h2>
              <p className="section-desc" id="join-desc-text">
                {joinInfo ? `TA ${joinInfo.role === 'A' ? joinInfo.nameB : joinInfo.nameA} 正在邀请我加入我们的默契互评小屋，我们将能共同见证每一周的幸福指数` : "TA正在邀请我加入我们的默契互评小屋"}
              </p>
              
              <div className="join-info-card">
                <div className="filling-progress">
                  <div className="partner-progress-card">
                    <div className="avatar-circle partner-a-avatar" id="join-avatar-a">
                      {joinInfo ? (joinInfo.role === 'A' ? joinInfo.nameB.charAt(0) : joinInfo.nameA.charAt(0)) : "屋主"}
                    </div>
                    <div className="progress-details">
                      <span className="partner-name" id="join-name-a">
                        {joinInfo ? (joinInfo.role === 'A' ? joinInfo.nameB : joinInfo.nameA) : "屋主"}
                      </span>
                      <span className="fill-status complete">屋主</span>
                    </div>
                  </div>
                  <div className="heart-divider">❤</div>
                  <div className="partner-progress-card">
                    <div className="avatar-circle partner-b-avatar" id="join-avatar-b">
                      {joinInfo ? (joinInfo.role === 'A' ? joinInfo.nameA.charAt(0) : joinInfo.nameB.charAt(0)) : "你"}
                    </div>
                    <div className="progress-details">
                      <span className="partner-name" id="join-name-b">
                        {joinInfo ? (joinInfo.role === 'A' ? joinInfo.nameA : joinInfo.nameB) : "你"}
                      </span>
                      <span className="fill-status text-muted">待加入</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="onboarding-actions">
                <button
                  id="accept-invite-btn"
                  className="btn btn-primary btn-large btn-full"
                  onClick={handleAcceptInvite}
                >
                  接受邀请并进入小屋
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================== MAIN APPLICATION CONTENT (APP SCREEN) ==================== */}
        {screen === 'app' && (
          <section id="screen-app" className="screen">
            
            {/* Navigation Tabs */}
            <nav className="nav-tabs" aria-label="应用导航" ref={tabsRef}>
              <div className="nav-tabs-indicator" id="nav-indicator" style={indicatorStyle}></div>
              <button
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>周看板</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'fill' ? 'active' : ''}`}
                onClick={() => setActiveTab('fill')}
              >
                <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>填写问卷</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>历史评分</span>
              </button>
            </nav>

            {/* Container for active tab content */}
            <div className="tab-content">
              
              {/* ==================== DASHBOARD TAB ==================== */}
              {activeTab === 'dashboard' && (
                <section id="dashboard-tab" className="tab-panel active">
                  
                  {/* Cozy Banner Image */}
                  <div className="hero-banner">
                    <img src="/couple_cozy.jpg" alt="Cozy couple sitting together" className="banner-img" fetchPriority="high" />
                    <div className="banner-overlay">
                      <h2>倾听、接纳、共同成长</h2>
                      <p>“我们不是为了争个对错，而是为了在彼此的差异中，找到最舒适的距离”</p>
                    </div>
                  </div>

                  {/* Status Card (Who filled / Lock status) */}
                  <div className="card status-card">
                    <div className="status-header">
                      <span className={`status-indicator-dot ${hasReport ? 'ready' : 'pending'}`} id="status-dot"></span>
                      <h3 id="status-title">
                        {hasA && hasB
                          ? "本周默契报告已解锁！"
                          : myDone && !partnerDone
                          ? "我已填写，等待TA"
                          : !myDone && partnerDone
                          ? "TA已填，等我填写"
                          : "本周互评等待开启"}
                      </h3>
                    </div>
                    <p className="status-description" id="status-desc">
                      {hasA && hasB
                        ? "我和TA已全部完成自评与TA评，请在下方查阅本周的双向心智剖析"
                        : myDone && !partnerDone
                        ? `我已经完成了本周的互评，一旦 ${partnerName} 提交评分，即可揭晓报告`
                        : !myDone && partnerDone
                        ? `${partnerName} 已经完成了互评，现在轮到我了，填写后将立即解锁报告`
                        : "本周互评需要我和TA独立填写，完成后，系统将解锁本周的默契报告"}
                    </p>
                    
                    <div className="filling-progress">
                      <div className="partner-progress-card" id="progress-partner-a">
                        <div className="avatar-circle partner-a-avatar" id="avatar-label-a">
                          {myRole === 'A' ? myName.charAt(0) : partnerName.charAt(0)}
                        </div>
                        <div className="progress-details">
                          <span className="partner-name" id="name-label-a">
                            {myRole === 'A' ? `${myName} (我)` : partnerName}
                          </span>
                          <span className={`fill-status ${hasA ? 'complete' : 'pending'}`}>
                            {hasA ? '已完成' : '未完成'}
                          </span>
                        </div>
                      </div>
                      <div className="heart-divider">❤</div>
                      <div className="partner-progress-card" id="progress-partner-b">
                        <div className="avatar-circle partner-b-avatar" id="avatar-label-b">
                          {myRole === 'B' ? myName.charAt(0) : partnerName.charAt(0)}
                        </div>
                        <div className="progress-details">
                          <span className="partner-name" id="name-label-b">
                            {myRole === 'B' ? `${myName} (我)` : partnerName}
                          </span>
                          <span className={`fill-status ${hasB ? 'complete' : 'pending'}`}>
                            {hasB ? '已完成' : '未完成'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!hasReport && (
                      <div className="status-actions">
                        <button
                          id="quick-fill-btn"
                          className="btn btn-primary"
                          onClick={() => setActiveTab('fill')}
                        >
                          立即去填写
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lock Overlay Container for Report */}
                  <div id="report-container" className={`report-section ${hasReport ? '' : 'locked'}`}>
                    
                    {/* Locked State Message */}
                    {!hasReport && (
                      <div className="lock-overlay">
                        <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <h3>解锁本周报告</h3>
                        <p>我和TA都提交评分后，此处的默契深度分析、雷达图与悄悄话留言板将会解锁显示</p>
                      </div>
                    )}

                    {/* Unlocked Report Elements */}
                    {hasReport && reportResults && (
                      <div className="report-grid">
                        
                        {/* Summary Score Card */}
                        <div className="card report-card-summary">
                          <div className="harmony-score-container">
                            <span className="harmony-label">本周关系得分</span>
                            <div className="harmony-value" id="harmony-score">
                              {reportResults.harmonyScore}
                            </div>
                            <div
                              className="harmony-level"
                              id="harmony-level"
                              style={
                                reportResults.harmonyScore >= 88
                                  ? { backgroundColor: "var(--accent-green-light)", color: "var(--accent-green)" }
                                  : reportResults.harmonyScore >= 75
                                  ? { backgroundColor: "var(--accent-gold-light)", color: "var(--accent-gold)" }
                                  : { backgroundColor: "var(--accent-red-light)", color: "var(--accent-red)" }
                              }
                            >
                              {reportResults.harmonyLevel}
                            </div>
                          </div>
                          <div className="weekly-verdict" id="weekly-verdict">
                            {reportResults.verdict}
                          </div>
                        </div>

                        {/* SVG Radar Chart Card */}
                        <div className="card report-card-chart">
                          <h3>我和TA的表现对照雷达图</h3>
                          <p className="chart-desc">
                            展现我和TA在这周 10 项日常表现中的<br />
                            综合评分<br />
                            （自评和TA评的加权均值）
                          </p>
                          <div className="chart-wrapper">
                            <RadarChart dataA={reportData.A} dataB={reportData.B} />
                          </div>
                          <div className="chart-legend">
                            <span className="legend-item">
                              <span className="legend-color color-a"></span>
                              <span id="chart-legend-a">{myRole === 'A' ? myName : partnerName}</span> 的表现
                            </span>
                            <span className="legend-item">
                              <span className="legend-color color-b"></span>
                              <span id="chart-legend-b">{myRole === 'B' ? myName : partnerName}</span> 的表现
                            </span>
                          </div>
                        </div>

                        {/* Relationship Deep Insights Card */}
                        <div className="card report-card-insights full-width">
                          <h3>关系深度洞察 🔍</h3>
                          <div className="insights-content" id="insights-container">
                            {insightsLoading ? (
                              <div className="insights-loading">
                                <span className="loading-spinner"></span>
                                <span className="loading-text">AI 正在深度解析双向问卷与悄悄话备注中...</span>
                              </div>
                            ) : (
                              insightsList.map((item, index) => (
                                <div className={`insight-card ${item.type}`} key={index}>
                                  <span className="insight-icon">{item.icon}</span>
                                  <div className="insight-text">
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Score breakdown detail list */}
                        <div className="card report-card-details">
                          <h3>细分项目评分明细</h3>
                          <div className="breakdown-list" id="breakdown-list">
                            {dimsToRender.map(dim => {
                              const valA = ((reportData.A[`self${dim.key}`] || 3) + (reportData.B[`partner${dim.key}`] || 3)) / 2;
                              const valB = ((reportData.B[`self${dim.key}`] || 3) + (reportData.A[`partner${dim.key}`] || 3)) / 2;
                              return (
                                <div className="breakdown-item" key={dim.key}>
                                  <div className="breakdown-info">
                                    <span className="breakdown-dim-name">{dim.name}</span>
                                    <span className="breakdown-vals">
                                      {myNameLabelA}: <strong>{valA.toFixed(1)}</strong> vs {myNameLabelB}: <strong>{valB.toFixed(1)}</strong>
                                    </span>
                                  </div>
                                  {/* Requirements: stacked double tracks without one thin and one thick */}
                                  <div className="breakdown-bars-group">
                                    <div className="breakdown-track">
                                      <div className="breakdown-bar-fill bar-a" style={{ width: `${(valA / 5) * 100}%` }}></div>
                                    </div>
                                    <div className="breakdown-track">
                                      <div className="breakdown-bar-fill bar-b" style={{ width: `${(valB / 5) * 100}%` }}></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {/* Feelings average bar */}
                            {(() => {
                              const getFeelAvg = (data: any) => {
                                let sum = 0;
                                FEEL_ITEMS.forEach(item => {
                                  const key = `feel${item.id.charAt(0).toUpperCase()}${item.id.slice(1)}`;
                                  sum += (data[key] || 3);
                                });
                                return sum / FEEL_ITEMS.length;
                              };
                              const feelA = getFeelAvg(reportData.A);
                              const feelB = getFeelAvg(reportData.B);
                              return (
                                <div className="breakdown-item">
                                  <div className="breakdown-info">
                                    <span className="breakdown-dim-name">关系幸福度综合体感</span>
                                    <span className="breakdown-vals">
                                      {myNameLabelA}: <strong>{feelA.toFixed(1)}</strong> vs {myNameLabelB}: <strong>{feelB.toFixed(1)}</strong>
                                    </span>
                                  </div>
                                  <div className="breakdown-bars-group">
                                    <div className="breakdown-track">
                                      <div className="breakdown-bar-fill bar-a" style={{ width: `${(feelA / 5) * 100}%` }}></div>
                                    </div>
                                    <div className="breakdown-track">
                                      <div className="breakdown-bar-fill bar-b" style={{ width: `${(feelB / 5) * 100}%` }}></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Conflict Handling badge & analysis */}
                        <div className="card report-card-conflict">
                          <h3>本周摩擦沟通模式</h3>
                          <div className="conflict-badge-container" id="conflict-badge-container">
                            {conflictBadgeInfo && (
                              <>
                                <div className={`badge-art ${conflictBadgeInfo.badgeClass}`}>
                                  {conflictBadgeInfo.icon}
                                </div>
                                <div className="conflict-badge-name">{conflictBadgeInfo.name}</div>
                                <div className="conflict-badge-desc">{conflictBadgeInfo.desc}</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Private Messages / Letters Box */}
                        <div className="card report-card-messages full-width">
                          <div className="messages-header-row">
                            <h3>彼此的三句话碎碎念 📝</h3>
                            <div className="whisper-tabs">
                              <button
                                className={`whisper-tab ${activeWhisperTab === 'A' ? 'active' : ''}`}
                                onClick={() => setActiveWhisperTab('A')}
                              >
                                {myRole === 'A' ? `${myName} (我)` : `${partnerName} (TA)`} 的留言
                              </button>
                              <button
                                className={`whisper-tab ${activeWhisperTab === 'B' ? 'active' : ''}`}
                                onClick={() => setActiveWhisperTab('B')}
                              >
                                {myRole === 'B' ? `${myName} (我)` : `${partnerName} (TA)`} 的留言
                              </button>
                            </div>
                          </div>
                          
                          <div className="letters-container">
                            <div className={`letter-card partner-a-letter ${activeWhisperTab === 'A' ? '' : 'hidden'}`}>
                              <div className="letter-card-tape"></div>
                              <div className="letter-body">
                                <div className="whisper-list">
                                  <div className="whisper-item">
                                    <div className="whisper-label label-happy">
                                      这周最让我感到幸福的一件事 💖
                                    </div>
                                    <p className="whisper-content">{reportData.A.noteHappy || '未填写'}</p>
                                  </div>
                                  <div className="whisper-item">
                                    <div className="whisper-label label-improve">
                                      这周最希望被理解或改善的一件事 💡
                                    </div>
                                    <p className="whisper-content">{reportData.A.noteImprove || '未填写'}</p>
                                  </div>
                                  <div className="whisper-item">
                                    <div className="whisper-label label-action">
                                      下周我愿意为关系做出的一个具体行动 🏃‍♂️
                                    </div>
                                    <p className="whisper-content">{reportData.A.noteAction || '未填写'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className={`letter-card partner-b-letter ${activeWhisperTab === 'B' ? '' : 'hidden'}`}>
                              <div className="letter-card-tape"></div>
                              <div className="letter-body">
                                <div className="whisper-list">
                                  <div className="whisper-item">
                                    <div className="whisper-label label-happy">
                                      这周最让我感到幸福的一件事 💖
                                    </div>
                                    <p className="whisper-content">{reportData.B.noteHappy || '未填写'}</p>
                                  </div>
                                  <div className="whisper-item">
                                    <div className="whisper-label label-improve">
                                      这周最希望被理解或改善的一件事 💡
                                    </div>
                                    <p className="whisper-content">{reportData.B.noteImprove || '未填写'}</p>
                                  </div>
                                  <div className="whisper-item">
                                    <div className="whisper-label label-action">
                                      下周我愿意为关系做出的一个具体行动 🏃‍♂️
                                    </div>
                                    <p className="whisper-content">{reportData.B.noteAction || '未填写'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Score & Comments Detail Card */}
                        <div className="card report-card-comments full-width">
                          <h3>各项打分与原因备注明细 📝</h3>
                          <p className="section-desc">点击具体题目，可查看我和TA为该题撰写的具体打分与原因说明（折叠面板）</p>
                          <div className="comments-detail-list">
                            
                            <h4 className="detail-category-title">10 项日常相处表现评估</h4>
                            {BEHAVIORAL_ITEMS.map(item => {
                              const cap = item.id.charAt(0).toUpperCase() + item.id.slice(1);
                              const isExpanded = !!expandedReportItems[item.id];
                              
                              const aSelfVal = reportData.A[`self${cap}`] || 3;
                              const bPartnerVal = reportData.B[`partner${cap}`] || 3;
                              const bSelfVal = reportData.B[`self${cap}`] || 3;
                              const aPartnerVal = reportData.A[`partner${cap}`] || 3;
                              
                              const valA = (aSelfVal + bPartnerVal) / 2;
                              const valB = (bSelfVal + aPartnerVal) / 2;
                              
                              const aSelfComment = reportData.A[`selfComment${cap}`];
                              const bPartnerComment = reportData.B[`partnerComment${cap}`];
                              const bSelfComment = reportData.B[`selfComment${cap}`];
                              const aPartnerComment = reportData.A[`partnerComment${cap}`];
                              
                              const hasAnyComment = !!(aSelfComment || bPartnerComment || bSelfComment || aPartnerComment);
                              
                              return (
                                <div className={`detail-item-box ${isExpanded ? 'expanded' : ''}`} key={item.id}>
                                  <div className="detail-item-header" onClick={() => setExpandedReportItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}>
                                    <div className="detail-item-title-group">
                                      <span className="detail-item-name">{item.name}</span>
                                      {hasAnyComment && <span className="comment-indicator-badge">有备注</span>}
                                    </div>
                                    <div className="detail-item-scores-summary">
                                      <span className="score-summary-span">{myNameLabelA}: <strong>{valA.toFixed(1)}</strong></span>
                                      <span className="score-summary-span">{myNameLabelB}: <strong>{valB.toFixed(1)}</strong></span>
                                      <span className="expand-chevron">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chevron-icon">
                                          <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {isExpanded && (
                                    <div className="detail-item-body">
                                      <div className="detail-eval-grid">
                                        
                                        <div className="eval-col col-partner-a">
                                          <h5>{myNameLabelA} 的表现评价</h5>
                                          
                                          <div className="eval-sub-row">
                                            <span className="sub-row-label">自评得分:</span>
                                            <span className="sub-row-value">{aSelfVal}分 ({getSliderDescription(`self-${item.id}`, aSelfVal)})</span>
                                          </div>
                                          {aSelfComment ? (
                                            <div className="eval-comment-bubble self-bubble">
                                              <p>{aSelfComment}</p>
                                            </div>
                                          ) : (
                                            <div className="eval-comment-bubble empty">无自评备注</div>
                                          )}
                                          
                                          <div className="eval-sub-row mt-3">
                                            <span className="sub-row-label">{myNameLabelB}评TA:</span>
                                            <span className="sub-row-value">{bPartnerVal}分 ({getSliderDescription(`partner-${item.id}`, bPartnerVal)})</span>
                                          </div>
                                          {bPartnerComment ? (
                                            <div className="eval-comment-bubble partner-bubble">
                                              <p>{bPartnerComment}</p>
                                            </div>
                                          ) : (
                                            <div className="eval-comment-bubble empty">无评分备注</div>
                                          )}
                                        </div>
                                        
                                        <div className="eval-col col-partner-b">
                                          <h5>{myNameLabelB} 的表现评价</h5>
                                          
                                          <div className="eval-sub-row">
                                            <span className="sub-row-label">自评得分:</span>
                                            <span className="sub-row-value">{bSelfVal}分 ({getSliderDescription(`self-${item.id}`, bSelfVal)})</span>
                                          </div>
                                          {bSelfComment ? (
                                            <div className="eval-comment-bubble self-bubble">
                                              <p>{bSelfComment}</p>
                                            </div>
                                          ) : (
                                            <div className="eval-comment-bubble empty">无自评备注</div>
                                          )}
                                          
                                          <div className="eval-sub-row mt-3">
                                            <span className="sub-row-label">{myNameLabelA}评TA:</span>
                                            <span className="sub-row-value">{aPartnerVal}分 ({getSliderDescription(`partner-${item.id}`, aPartnerVal)})</span>
                                          </div>
                                          {aPartnerComment ? (
                                            <div className="eval-comment-bubble partner-bubble">
                                              <p>{aPartnerComment}</p>
                                            </div>
                                          ) : (
                                            <div className="eval-comment-bubble empty">无评分备注</div>
                                          )}
                                        </div>
                                        
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            <h4 className="detail-category-title mt-4">8 项日常相处体感评估</h4>
                            {FEEL_ITEMS.map(item => {
                              const cap = item.id.charAt(0).toUpperCase() + item.id.slice(1);
                              const isExpanded = !!expandedReportItems[`feel-${item.id}`];
                              
                              const feelValA = reportData.A[`feel${cap}`] || 3;
                              const feelValB = reportData.B[`feel${cap}`] || 3;
                              
                              const aFeelComment = reportData.A[`feelComment${cap}`];
                              const bFeelComment = reportData.B[`feelComment${cap}`];
                              
                              const hasAnyComment = !!(aFeelComment || bFeelComment);
                              
                              return (
                                <div className={`detail-item-box feel-box ${isExpanded ? 'expanded' : ''}`} key={`feel-${item.id}`}>
                                  <div className="detail-item-header" onClick={() => setExpandedReportItems(prev => ({ ...prev, [`feel-${item.id}`]: !prev[`feel-${item.id}`] }))}>
                                    <div className="detail-item-title-group">
                                      <span className="detail-item-name">{item.name.split(" ")[0]}</span>
                                      {hasAnyComment && <span className="comment-indicator-badge">有备注</span>}
                                    </div>
                                    <div className="detail-item-scores-summary">
                                      <span className="score-summary-span">{myNameLabelA}: <strong>{feelValA}分</strong></span>
                                      <span className="score-summary-span">{myNameLabelB}: <strong>{feelValB}分</strong></span>
                                      <span className="expand-chevron">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chevron-icon">
                                          <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {isExpanded && (
                                    <div className="detail-item-body">
                                      <div className="detail-eval-grid">
                                        
                                        <div className="eval-col col-partner-a">
                                          <h5>{myNameLabelA} 的幸福体感</h5>
                                          <div className="eval-sub-row">
                                            <span className="sub-row-label">体感得分:</span>
                                            <span className="sub-row-value">{feelValA}分 ({getSliderDescription(`feel-${item.id}`, feelValA)})</span>
                                          </div>
                                          {aFeelComment ? (
                                            <div className="eval-comment-bubble feel-bubble">
                                              <p>{aFeelComment}</p>
                                            </div>
                                          ) : (
                                            <div className="eval-comment-bubble empty">无体验备注</div>
                                          )}
                                        </div>
                                        
                                        <div className="eval-col col-partner-b">
                                          <h5>{myNameLabelB} 的幸福体感</h5>
                                          <div className="eval-sub-row">
                                            <span className="sub-row-label">体感得分:</span>
                                            <span className="sub-row-value">{feelValB}分 ({getSliderDescription(`feel-${item.id}`, feelValB)})</span>
                                          </div>
                                          {bFeelComment ? (
                                            <div className="eval-comment-bubble feel-bubble">
                                              <p>{bFeelComment}</p>
                                            </div>
                                          ) : (
                                            <div className="eval-comment-bubble empty">无体验备注</div>
                                          )}
                                        </div>
                                        
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </section>
              )}

              {/* ==================== FILL RUBRIC TAB ==================== */}
              {activeTab === 'fill' && (
                <section id="fill-tab" className="tab-panel active">
                  
                  <form id="rubric-form" className="rubric-form-element" onSubmit={handleRubricSubmit}>
                    
                    {/* Identity Information */}
                    <div className="card form-card">
                      <h3>评分人身份</h3>
                      <p className="section-desc" id="fill-identity-desc">
                        正在以 {myName} 的身份填写本周评分
                      </p>
                      <div
                        className="identity-confirm-box"
                        id="identity-display-box"
                        style={myRole === 'B' ? { backgroundColor: "var(--accent-gold-light)" } : {}}
                      >
                        <div
                          className={`avatar-circle ${myRole === 'B' ? 'partner-b-avatar' : 'partner-a-avatar'}`}
                          id="fill-avatar"
                        >
                          {myName.charAt(0)}
                        </div>
                        <div className="identity-confirm-details">
                          <span
                            className="identity-role"
                            id="fill-role-title"
                            style={myRole === 'B' ? { color: "var(--accent-gold)" } : {}}
                          >
                            {myRole === 'A' ? '我 (发起者)' : '我 (受邀人)'}
                          </span>
                          <span className="identity-name" id="fill-name-display">{myName}</span>
                        </div>
                      </div>
                      <div className="share-invite-shortcut">
                        <p>TA还没加入？<a href="#" id="shortcut-invite-link" onClick={copyInviteLink}>复制邀请链接发给TA</a></p>
                      </div>
                    </div>

                    {/* Score Standards Table Reference */}
                    <div className="card form-card rating-standards-card">
                      <h3>评分标准说明</h3>
                      <ul className="standards-list">
                        <li><span>5分</span>做得非常好，我或TA有主动、稳定且具体的表现</li>
                        <li><span>4分</span>整体较好，偶有不足但能及时调整</li>
                        <li><span>3分</span>基本做到，但稳定性或主动性不足</li>
                        <li><span>2分</span>多次没有做到，已经影响关系体验</li>
                        <li><span>1分</span>严重缺失，或明知有问题仍持续回避、违反</li>
                      </ul>
                    </div>

                    {/* Partner Evaluation Section */}
                    <div className="card form-card">
                      <div className="card-badge">维度一</div>
                      <h3>我对TA的评价 (TA评)</h3>
                      <p className="section-desc">评价本周TA的相处细节，带着包容与鼓励为爱打分</p>
                      <div id="partner-eval-container">
                        {BEHAVIORAL_ITEMS.map(item => (
                          <div className="form-group-rubric" key={`partner-${item.id}`}>
                            <div className="rubric-header">
                              <label className="rubric-title" htmlFor={`partner-${item.id}`}>{item.partnerName}</label>
                              <span className="rubric-hint">{item.partnerHint}</span>
                              <span className="rubric-question-text" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--accent-pink)', marginTop: '0.15rem' }}>
                                {item.partnerQuestion}
                              </span>
                            </div>
                            <div className="score-slider-container">
                              <input
                                type="range"
                                id={`partner-${item.id}`}
                                min="1"
                                max="5"
                                value={partnerScores[item.id] || 3}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setPartnerScores(prev => ({ ...prev, [item.id]: val }));
                                }}
                                className="score-slider"
                              />
                              <div className="slider-ticks">
                                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                              </div>
                            </div>
                            {/* Requirement: question-specific text under the slider dynamically */}
                            <div className="score-description">
                              {getSliderDescription(`partner-${item.id}`, partnerScores[item.id] || 3)}
                            </div>
                            {/* Expandable Comment Section */}
                            <div className="comment-toggle-section">
                              <button
                                type="button"
                                className={`toggle-comment-btn ${(expandedPartnerComments[item.id] || partnerComments[item.id]) ? 'active' : ''}`}
                                onClick={() => setExpandedPartnerComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              >
                                {(expandedPartnerComments[item.id] || partnerComments[item.id]) ? "收起备注 💬" : "+ 添加打分原因备注"}
                              </button>
                              {(expandedPartnerComments[item.id] || partnerComments[item.id]) && (
                                <textarea
                                  placeholder="写下打这个分的原因或具体的小故事（选填）..."
                                  value={partnerComments[item.id] || ""}
                                  onChange={(e) => setPartnerComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="comment-textarea"
                                  rows={2}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Self Evaluation Section */}
                    <div className="card form-card">
                      <div className="card-badge">维度二</div>
                      <h3>我的自我反思 (自评)</h3>
                      <p className="section-desc">回顾本周我自己的行为表现，坦诚地为自己打分</p>
                      <div id="self-eval-container">
                        {BEHAVIORAL_ITEMS.map(item => (
                          <div className="form-group-rubric" key={`self-${item.id}`}>
                            <div className="rubric-header">
                              <label className="rubric-title" htmlFor={`self-${item.id}`}>{item.selfName}</label>
                              <span className="rubric-hint">{item.selfHint}</span>
                              <span className="rubric-question-text" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--accent-pink)', marginTop: '0.15rem' }}>
                                {item.selfQuestion}
                              </span>
                            </div>
                            <div className="score-slider-container">
                              <input
                                type="range"
                                id={`self-${item.id}`}
                                min="1"
                                max="5"
                                value={selfScores[item.id] || 3}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setSelfScores(prev => ({ ...prev, [item.id]: val }));
                                }}
                                className="score-slider"
                              />
                              <div className="slider-ticks">
                                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                              </div>
                            </div>
                            <div className="score-description">
                              {getSliderDescription(`self-${item.id}`, selfScores[item.id] || 3)}
                            </div>
                            {/* Expandable Comment Section */}
                            <div className="comment-toggle-section">
                              <button
                                type="button"
                                className={`toggle-comment-btn ${(expandedSelfComments[item.id] || selfComments[item.id]) ? 'active' : ''}`}
                                onClick={() => setExpandedSelfComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              >
                                {(expandedSelfComments[item.id] || selfComments[item.id]) ? "收起备注 💬" : "+ 添加自评原因备注"}
                              </button>
                              {(expandedSelfComments[item.id] || selfComments[item.id]) && (
                                <textarea
                                  placeholder="写下打这个分的原因或具体的小故事（选填）..."
                                  value={selfComments[item.id] || ""}
                                  onChange={(e) => setSelfComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="comment-textarea"
                                  rows={2}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* General feeling Section */}
                    <div className="card form-card">
                      <div className="card-badge">维度三</div>
                      <h3>每周综合体感</h3>
                      <p className="section-desc">这周我在这段关系里的主观感受如何</p>
                      <div id="feel-eval-container">
                        {FEEL_ITEMS.map(item => (
                          <div className="form-group-rubric" key={`feel-${item.id}`}>
                            <div className="rubric-header">
                              <label className="rubric-title" htmlFor={`feel-${item.id}`}>{item.name}</label>
                              <span className="rubric-hint">{item.hint}</span>
                              <span className="rubric-question-text" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--accent-pink)', marginTop: '0.15rem' }}>
                                {item.question}
                              </span>
                            </div>
                            <div className="score-slider-container">
                              <input
                                type="range"
                                id={`feel-${item.id}`}
                                min="1"
                                max="5"
                                value={feelScores[item.id] || 3}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setFeelScores(prev => ({ ...prev, [item.id]: val }));
                                }}
                                className="score-slider"
                              />
                              <div className="slider-ticks">
                                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                              </div>
                            </div>
                            <div className="score-description">
                              {getSliderDescription(`feel-${item.id}`, feelScores[item.id] || 3)}
                            </div>
                            {/* Expandable Comment Section */}
                            <div className="comment-toggle-section">
                              <button
                                type="button"
                                className={`toggle-comment-btn ${(expandedFeelComments[item.id] || feelComments[item.id]) ? 'active' : ''}`}
                                onClick={() => setExpandedFeelComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              >
                                {(expandedFeelComments[item.id] || feelComments[item.id]) ? "收起备注 💬" : "+ 添加体感原因备注"}
                              </button>
                              {(expandedFeelComments[item.id] || feelComments[item.id]) && (
                                <textarea
                                  placeholder="写下打这个分的原因或具体的小故事（选填）..."
                                  value={feelComments[item.id] || ""}
                                  onChange={(e) => setFeelComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="comment-textarea"
                                  rows={2}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conflict Resolution Section */}
                    <div className="card form-card">
                      <div className="card-badge">特别机制</div>
                      <h3>本周摩擦与矛盾解决</h3>
                      <p className="section-desc">发生矛盾本身不扣分，逃避沟通、只想争输赢会扣分，但诚实面对并积极修复会获得满分肯定</p>

                      <div className="form-group-toggle">
                        <div className="toggle-label-group">
                          <span className="toggle-title">本周是否有发生过摩擦或矛盾？</span>
                          <span className="toggle-desc">勾选后将展开冲突解决方式评估</span>
                        </div>
                        <label className="switch-container">
                          <input
                            type="checkbox"
                            id="conflict-happened"
                            name="conflict-happened"
                            checked={conflictHappened}
                            onChange={(e) => setConflictHappened(e.target.checked)}
                          />
                          <span className="switch-slider"></span>
                        </label>
                      </div>

                      {/* Hidden section showing conflict handling options */}
                      <div className={`conflict-details-group ${conflictHappened ? '' : 'hidden'}`} id="conflict-details-group">
                        <span className="radio-group-title">面对摩擦，我们采取了怎样的态度？</span>
                        
                        <div className="conflict-options">
                          <label className="conflict-option-card penalty">
                            <input
                              type="radio"
                              name="conflict-handling"
                              value="avoid"
                              checked={conflictHandling === 'avoid'}
                              onChange={() => setConflictHandling('avoid')}
                            />
                            <div className="option-content">
                              <span className="option-icon">🔴</span>
                              <div className="option-text">
                                <span className="option-name">逃避、冷处理、欺骗、攻击，或只想争输赢</span>
                                <span className="option-impact text-penalty">关系警告：回避或对抗性处理会伤害感情，本周评分扣 15 分</span>
                              </div>
                            </div>
                          </label>

                          <label className="conflict-option-card bonus">
                            <input
                              type="radio"
                              name="conflict-handling"
                              value="resolve"
                              checked={conflictHandling === 'resolve'}
                              onChange={() => setConflictHandling('resolve')}
                            />
                            <div className="option-content">
                              <span className="option-icon">🟡</span>
                              <div className="option-text">
                                <span className="option-name">直面问题、认真倾听、承担责任，并努力修复</span>
                                <span className="option-impact text-bonus">积极解决：愿意为修复关系付出诚意，本周评分加 5 分</span>
                              </div>
                            </div>
                          </label>

                          <label className="conflict-option-card double-bonus">
                            <input
                              type="radio"
                              name="conflict-handling"
                              value="winwin"
                              checked={conflictHandling === 'winwin'}
                              onChange={() => setConflictHandling('winwin')}
                            />
                            <div className="option-content">
                              <span className="option-icon">🟢</span>
                              <div className="option-text">
                                <span className="option-name">接纳TA不完美，在守住核心底线时找到我和TA都满意的方案</span>
                                <span className="option-impact text-double-bonus">完美方案：最高默契表现！在包容中达成一致，本周评分加 10 分</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Three sentences board */}
                    {/* Requirement: Title identical in dashboard & fill panel */}
                    <div className="card form-card">
                      <div className="card-badge">心声</div>
                      <h3>彼此的三句话碎碎念 📝</h3>
                      <p className="section-desc">留下我最真实的心声（提交后仅在解锁报告时TA可见）</p>
                      
                      <div className="form-group-textarea">
                        <label htmlFor="note-happy">这周最让我感到幸福的一件事 💖：</label>
                        <textarea
                          id="note-happy"
                          required
                          className="custom-textarea"
                          placeholder="例如：星期二下班回家看到TA买了我爱吃的草莓..."
                          rows={2}
                          value={noteHappy}
                          onChange={(e) => setNoteHappy(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group-textarea">
                        <label htmlFor="note-improve">这周最希望被理解或改善的一件事 💡：</label>
                        <textarea
                          id="note-improve"
                          required
                          className="custom-textarea"
                          placeholder="例如：那天商量聚会时我觉得有点累，语气有点硬，希望TA别介意..."
                          rows={2}
                          value={noteImprove}
                          onChange={(e) => setNoteImprove(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group-textarea">
                        <label htmlFor="note-action">下周我愿意为关系做出的一个具体行动 🏃‍♂️：</label>
                        <textarea
                          id="note-action"
                          required
                          className="custom-textarea"
                          placeholder="例如：下周三晚上我来下厨做晚餐，让TA下班能吃现成的..."
                          rows={2}
                          value={noteAction}
                          onChange={(e) => setNoteAction(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-submit-container">
                      <button type="submit" id="submit-rubric-btn" className="btn btn-primary btn-large">提交本周评分</button>
                    </div>

                  </form>

                </section>
              )}

              {/* ==================== HISTORY TAB ==================== */}
              {activeTab === 'history' && (
                <section id="history-tab" className="tab-panel active">
                  <div className="card history-intro-card">
                    <h3>我们的爱之轨迹</h3>
                    <p className="section-desc">这里记录了我们过去每周的互评得分和分数走势</p>
                    <div className="history-stats">
                      <div className="stat-box">
                        <span className="stat-num" id="stat-weeks-count">{historyStats.count}</span>
                        <span className="stat-label">共同记录周数</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-num" id="stat-avg-harmony">{historyStats.avgHarmony}</span>
                        <span className="stat-label">历史平均评分</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-num" id="stat-badges-count">{historyStats.badges}</span>
                        <span className="stat-label">获得合璧勋章</span>
                      </div>
                    </div>
                  </div>

                  {/* Line Chart Card */}
                  {historyStats.unlockedList.length > 0 && (
                    <div id="history-chart-card" className="card history-chart-card">
                      <h3>评分走势图 📈</h3>
                      <p className="chart-desc">展现每周我们之间评分的变化趋势（加权总满意度）</p>
                      <div className="line-chart-wrapper">
                        <HistoryLineChart unlockedWeeks={historyStats.unlockedList} />
                      </div>
                    </div>
                  )}

                  <div className="card history-list-card">
                    <h3>往期互评记录</h3>
                    <div className="history-list" id="history-list-container">
                      {historyLoading ? (
                        <div className="empty-state"><p>正在加载历史记录...</p></div>
                      ) : historyWeeks.length === 0 ? (
                        <div className="empty-state">
                          <p>暂无历史评分数据，赶快和TA一起提交第一周的互评吧</p>
                        </div>
                      ) : (
                        historyWeeks.map(item => {
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

                            return (
                              <div
                                key={item.week}
                                className="history-item-row"
                                onClick={() => {
                                  setCurrentWeek(item.week);
                                  setActiveTab('dashboard');
                                  window.scrollTo(0, 0);
                                }}
                              >
                                <div className="history-item-info">
                                  <span className="history-week-name">{weekLabel}</span>
                                  <span className="history-summary-text">{emoji} {scores.harmonyLevel} · 我和TA已填</span>
                                </div>
                                <div className="history-item-score-group">
                                  <div className="history-score-display">
                                    <span className="history-score-label">总满意度</span>
                                    <span className="history-score-val">{scores.harmonyScore}</span>
                                  </div>
                                  <span className="history-arrow">❯</span>
                                </div>
                              </div>
                            );
                          } else {
                            const myDoneStatus = myRole === 'A' ? item.progress?.A : item.progress?.B;
                            const statusText = myDoneStatus ? "等待TA填写..." : "我还没填，去填写";
                            return (
                              <div
                                key={item.week}
                                className="history-item-row"
                                onClick={() => {
                                  setCurrentWeek(item.week);
                                  if (myDoneStatus) {
                                    setActiveTab('dashboard');
                                  } else {
                                    setActiveTab('fill');
                                  }
                                  window.scrollTo(0, 0);
                                }}
                              >
                                <div className="history-item-info">
                                  <span className="history-week-name">{weekLabel}</span>
                                  <span className="history-summary-text">{statusText}</span>
                                </div>
                                <div className="history-item-score-group">
                                  <div className="history-score-display">
                                    <span className="history-score-label">状态</span>
                                    <span className="history-score-val" style={{ color: "var(--text-muted)" }}>未解锁</span>
                                  </div>
                                  <span className="history-arrow">❯</span>
                                </div>
                              </div>
                            );
                          }
                        })
                      )}
                    </div>
                  </div>

                </section>
              )}

            </div>
          </section>
        )}
      </main>

      {/* Settings Modal */}
      <div id="settings-modal" className={`modal-overlay ${isSettingsOpen ? 'active' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setIsSettingsOpen(false);
      }}>
        <div className="modal-card">
          <div className="modal-header">
            <h3>小屋设置 & 偏好</h3>
            <button onClick={() => setIsSettingsOpen(false)} className="btn-close" aria-label="关闭设置">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="modal-body">
            
            {/* Theme Toggle Section in Settings */}
            <div className="settings-section">
              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-title">夜间模式</span>
                  <span className="settings-desc">开启夜间模式以获得更舒适的暗光视觉体验</span>
                </div>
                <label className="switch-container">
                  <input
                    type="checkbox"
                    id="modal-theme-toggle"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>

            {/* Room Settings Section */}
            <div className="settings-section">
              <h4 className="settings-section-title">小屋管理</h4>
              <div className="room-settings-box">
                <p className="settings-desc">你可以复制当前小屋的邀请链接发送给TA，或者退出当前的小屋</p>
                <div className="settings-actions-vertical">
                  <button
                    id="settings-modal-copy-invite-btn"
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      copyInviteLink();
                      setIsSettingsOpen(false);
                    }}
                  >
                    复制分享邀请链接
                  </button>
                  <button
                    id="settings-modal-leave-room-btn"
                    className="btn btn-danger-outline btn-full"
                    onClick={() => {
                      handleLeaveRoom();
                      setIsSettingsOpen(false);
                    }}
                  >
                    退出当前小屋
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* App Footer */}
      <footer className="app-footer">
        <p>© 2026 The Week of Us. 为更有温度的亲密关系而设计。</p>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-container ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✨' : toast.type === 'error' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
