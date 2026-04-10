import { useState, useRef } from "react";

const ESCALATION_LEVELS = [
  { min: 0,  max: 20,  label: "DIPLOMATIC TENSION",  color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { min: 21, max: 40,  label: "COERCIVE PRESSURE",   color: "#65a30d", bg: "#f7fee7", border: "#d9f99d" },
  { min: 41, max: 60,  label: "LIMITED CONFLICT",    color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  { min: 61, max: 75,  label: "REGIONAL WAR",        color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  { min: 76, max: 88,  label: "FULL-SCALE WAR",      color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  { min: 89, max: 96,  label: "CATASTROPHIC WAR",    color: "#b91c1c", bg: "#fff1f2", border: "#fecdd3" },
  { min: 97, max: 100, label: "NUCLEAR THRESHOLD",   color: "#7e22ce", bg: "#faf5ff", border: "#e9d5ff" },
];
const getLevel = v => ESCALATION_LEVELS.find(l => v >= l.min && v <= l.max) || ESCALATION_LEVELS[0];

const P1_INITIAL = {
  id:"p1", name:"US + Israel", flags:["🇺🇸","🇮🇱"], color:"#1d4ed8",
  escalate:[
    "Strike remaining buried nuclear sites (Fordow / Pickaxe Mountain tunnels)",
    "Deploy B-2 bombers with GBU-57 bunker-busters on Esfahan enrichment halls",
    "Tactical nuclear signalling — forward-position nuclear assets (Israel)",
    "Threaten nuclear strike if Iran assembles dirty bomb",
    "Assassinate Mojtaba Khamenei & Assembly of Experts leadership",
    "Targeted killing of all remaining IRGC general staff",
    "Decapitate Iran's cyber warfare command & intelligence infrastructure",
    "Kill remaining nuclear scientists and program directors",
    "Deploy US Marine Expeditionary Force inside Iran",
    "Launch Delta Force / Shayetet 13 raids on uranium storage sites",
    "Seize and hold Iranian islands (Abu Musa, Greater & Lesser Tunbs)",
    "Extract enriched uranium stockpiles by force — secure & remove",
    "Special forces ground corridor to secure Strait of Hormuz coastline",
    "Establish buffer zone inside Iranian border (10–20km)",
    "Strike Iranian power grid — rolling blackouts across all provinces",
    "Strike South Pars gas fields & all remaining energy infrastructure",
    "Complete naval blockade of all Iranian ports (Bandar Abbas, Chabahar)",
    "Strike Iranian drone & missile factories (Isfahan, Parchin complexes)",
    "Destroy entire Iranian Revolutionary Guard naval fleet",
    "Strike Iranian military communications & satellite infrastructure",
    "Expand Lebanon ground operation — full destruction of Hezbollah military wing",
    "Massive sustained air campaign on all Houthi infrastructure across Yemen",
    "Strike Iraqi PMF headquarters and weapons depots in Iraq & Syria",
    "Destroy Iran–Iraq–Syria–Lebanon land corridor permanently",
    "Support Iranian opposition forces (MEK, Reza Pahlavi, Kurdish factions)",
    "Covert operations to trigger mass internal uprising in Iran",
    "Full secondary sanctions — cut any nation trading with Iran from SWIFT",
    "Annex additional West Bank territory under cover of wartime distraction",
    "Expand Abraham Accords publicly — bring new Arab states in during war",
    "Cyber offensive — take down Iranian banking, power, and transport systems",
  ],
  deescalate:[
    "Pursue ceasefire via Oman back-channel (Witkoff–Araghchi direct contact)",
    "Accept Pakistan / Qatar as neutral mediators for talks",
    "Open direct back-channel with Mojtaba Khamenei's office",
    "Propose 30-day humanitarian pause in exchange for Hormuz reopening",
    "Accept UN Security Council-led ceasefire framework",
    "Invite China to co-sponsor peace negotiations in Beijing",
    "Accept limited Iranian enrichment (under 5%) with full IAEA inspections",
    "Offer full JCPOA-plus deal: sanctions relief for total dismantlement",
    "Demand enrichment halt but allow civilian nuclear power reactors",
    "Offer phased sanctions relief tied to verified dismantlement milestones",
    "Accept Iranian nuclear program under IAEA permanent monitoring only",
    "Declare victory — halt offensive operations, shift to defensive posture",
    "Halt all strikes on Iranian civilian & energy infrastructure immediately",
    "Accept 'heavily diminished Iran' outcome — drop full regime change demand",
    "Withdraw carrier strike groups from Gulf — reduce military presence",
    "Suspend Israeli arms supply to pressure Netanyahu toward ceasefire",
    "Prioritize Indo-Pacific redeployment — hand Gulf off to regional partners",
    "Normalize US–Saudi + Israel–Saudi as post-war regional architecture",
    "Offer Palestinian statehood recognition as part of broader regional deal",
    "Lift Syria sanctions — use as regional stabilization lever",
    "Announce $50bn+ reconstruction fund for Iran post-ceasefire",
    "Recognize new Iranian government if IRGC influence is reduced",
    "Propose joint US–Russia–China security guarantee for Iran's borders",
  ],
};

const P2_INITIAL = {
  id:"p2", name:"Iran + Proxies", flags:["🇮🇷","⚔️"], color:"#b91c1c",
  escalate:[
    "Mass ballistic missile barrage targeting Tel Aviv, Haifa, Ben Gurion Airport",
    "Strike Israeli nuclear reactor at Dimona",
    "Target Israeli gas platforms in Mediterranean (Leviathan, Tamar fields)",
    "Deploy hypersonic Fattah missiles against Iron Dome blind spots",
    "Strike Israeli military HQ — Kirya base Tel Aviv",
    "Simultaneous strikes on all US bases: Bahrain, Al Udeid, Al Dhafra, Ali Al Salem",
    "Suicide drone swarms targeting US carrier strike groups in Gulf",
    "Strike US CENTCOM forward HQ command & logistics hub (Qatar)",
    "Attack US embassies and diplomatic compounds across Middle East",
    "IRGC cyber attack — disable US military communications grid",
    "Strike Gulf oil refineries: Ras Tanura (KSA), Ruwais (UAE), Jazan (KSA)",
    "Attack desalination plants — cut water supply to Saudi, UAE, Kuwait cities",
    "Mine the Strait of Hormuz — full closure to oil tanker traffic",
    "Strike Ras Laffan LNG terminal — destroy 30%+ of global LNG supply",
    "Attack undersea oil & gas pipelines across Gulf seabed",
    "Strike major regional airports: Dubai, Doha, Riyadh, Kuwait City, Abu Dhabi",
    "Hezbollah: full-scale rocket barrage (3,000+/day) on all Israeli cities",
    "Hezbollah: ground incursion into northern Israel — simultaneous with Iran strikes",
    "Hezbollah: assassinate senior IDF commanders and Israeli officials",
    "Houthis: full maritime blockade of Bab el-Mandeb — close Red Sea entirely",
    "Houthis: ballistic missiles targeting UAE and Saudi ports and cities",
    "Iraqi PMF: simultaneous attack on all 15 US installations in Iraq",
    "Iraqi PMF: assassinate Iraqi PM and all US-aligned government officials",
    "Iraqi PMF: open resupply corridor Iran→Syria→Lebanon for Hezbollah",
    "Syrian militias: attack Israeli Golan Heights positions",
    "Activate IRGC sleeper cells — mass casualty attacks in Western cities",
    "Deploy radiological device (dirty bomb) in Gulf city as deterrent signal",
    "Sprint to 90% enrichment — nuclear weapons breakout declaration",
    "Issue formal fatwa / global jihad declaration against US & Israel",
    "Strike US homeland — cyberattack on power grid and financial system",
    "Execute hostages and prisoners as political escalation signal",
  ],
  deescalate:[
    "Accept Oman-brokered ceasefire — halt all offensive operations immediately",
    "Propose 72-hour humanitarian pause as prelude to formal talks",
    "Accept Pakistan as neutral mediator for nuclear deal",
    "Open direct back-channel with US via Swiss embassy in Tehran",
    "Signal willingness to negotiate via China as primary intermediary",
    "New IRGC leadership formally distances from Khamenei hardline posture",
    "Freeze all uranium enrichment above 20% immediately",
    "Allow emergency IAEA inspection of all known nuclear sites",
    "Transfer enriched uranium stockpiles to third country (Russia or China)",
    "Formally renounce nuclear weapons in exchange for security guarantee",
    "Accept 'zero enrichment' deal in exchange for civilian nuclear cooperation",
    "Order Hezbollah to stand down — full ceasefire on Lebanon front",
    "Instruct Houthis to reopen Red Sea — lift maritime blockade entirely",
    "Iraqi PMF ordered to halt all attacks on US forces",
    "Withdraw all IRGC advisors from Iraq, Syria, Lebanon, Yemen",
    "Cut financial and weapons supply lines to all proxy forces",
    "Reopen Strait of Hormuz unconditionally — allow full oil flow",
    "Accept Russian-drafted UN Security Council ceasefire resolution",
    "Signal acceptance of Gulf Arab mediation to end the war",
    "Propose prisoner exchange as confidence-building measure",
    "Release all dual-national prisoners as goodwill gesture",
    "New Iranian government offers direct negotiations with Israel (via third party)",
    "Propose regional non-aggression framework including Gulf states",
  ],
};

const INFLUENTIAL = [
  { id:"russia",  name:"Russia",       flag:"🇷🇺", color:"#be123c",
    options:["Supply Iran S-400/S-500 air defense","Veto all UNSC resolutions","Broker Iran–West ceasefire via Moscow","Provide satellite intelligence to Iran","Threaten NATO escalation if Iran regime collapses","Offer Iran energy alliance & sanctions evasion","Stay focused on Ukraine — strategic restraint"] },
  { id:"china",   name:"China",        flag:"🇨🇳", color:"#c2410c",
    options:["Massively increase Iranian oil purchases","Provide Iran dual-use military technology","Host multilateral ceasefire conference","Threaten Taiwan action as strategic distraction","Pressure Iran to accept ceasefire (BRI protection)","Deploy PLAN vessels to Persian Gulf","Recall ambassador from Israel"] },
  { id:"ksa",     name:"Saudi Arabia", flag:"🇸🇦", color:"#b45309",
    options:["Normalize with Israel (post-war architecture)","Flood oil markets to offset Hormuz disruption","Demand US formal defense pact","Host post-war regional summit","Covertly support Iranian opposition","Pivot toward China if US proves unreliable","Halt US basing access as leverage"] },
  { id:"europe",  name:"Europe (EU)",  flag:"🇪🇺", color:"#4338ca",
    options:["Legal challenge to US/Israel under UN Charter","Reinstate JCPOA snapback sanctions on Iran","Impose arms embargo on Israel","Recognize Palestinian state formally","Lead humanitarian corridor to Iran & Gaza","Host Iran–US peace negotiations","Deploy naval assets to protect Hormuz shipping"] },
  { id:"uk",      name:"UK",           flag:"🇬🇧", color:"#0369a1",
    options:["Allow US use of Diego Garcia & RAF Fairford","Deploy RAF in defensive capacity over Gulf","Suspend arms exports to Israel","Recognize Palestinian state","Break from US — independent diplomatic track","Lead multilateral humanitarian mission"] },
  { id:"pakistan",name:"Pakistan",     flag:"🇵🇰", color:"#15803d",
    options:["Nuclear deterrence signalling toward Israel","Offer to mediate Iran–US de-escalation","Allow US basing access","Accept Iranian refugees — humanitarian corridor","Align with China–Saudi axis","Maintain strict neutrality"] },
  { id:"turkey",  name:"Turkey",       flag:"🇹🇷", color:"#b45309",
    options:["Close Bosphorus to US warships (Montreux Convention)","Offer to mediate as NATO member with Iran ties","Host Iran–US back-channel talks in Istanbul","Distance from NATO over Iran war","Provide humanitarian corridor to Iran"] },
  { id:"gcc",     name:"Qatar / GCC",  flag:"🏛️",  color:"#0f766e",
    options:["Qatar: mediate Iran ceasefire talks","Qatar: close Hamas political bureau","Oman: host Iran–US secret talks","Bahrain: expand US 5th Fleet basing","Kuwait: declare neutrality","GCC: joint statement condemning Iran attacks"] },
];

function escalationDelta(choices) {
  const escalateKW = ["nuclear","strike","assassin","ground","barrage","blockade","mine","seize","sleeper","jihad","cyber","bomb","invade","destroy","decapitate","kill"];
  const deescKW    = ["ceasefire","diplomatic","accept","halt","freeze","withdraw","pause","sanction","negotiate","relief","recognize","propose","reopen","suspend","mediat"];
  let delta = 0;
  for (const c of choices) {
    const l = c.toLowerCase();
    if (escalateKW.some(k => l.includes(k))) delta += 7;
    else if (deescKW.some(k => l.includes(k))) delta -= 6;
    else delta += 3;
  }
  return Math.max(-20, Math.min(30, delta));
}

async function fetchNextOptions(history, nextPlayer, escalation) {
  const level = getLevel(escalation);
  const histText = history.map((h,i) => `Round ${Math.floor(i/2)+1} — ${h.player}: ${h.choices.join("; ")}`).join("\n");
  const prompt = `You are a geopolitical game engine. April 2026. US-Israel war on Iran (Operation Epic Fury) ongoing. Khamenei assassinated. Mojtaba is new Supreme Leader. Hormuz partially blocked.

DECISION HISTORY:
${histText}

ESCALATION: ${escalation}/100 (${level.label})

Generate NEXT TURN options for: ${nextPlayer.name}
Options must be directly REACTIVE to the most recent opposing moves, grounded in April 2026 reality.

Return ONLY valid JSON (no markdown, no explanation):
{"escalate":["opt1","opt2","opt3","opt4","opt5","opt6","opt7","opt8"],"deescalate":["opt9","opt10","opt11","opt12","opt13","opt14"],"context":"One sentence on why these are the realistic next moves."}

Generate 8 escalatory and 6 de-escalatory options. Be specific, operational, and realistic.`;

  const res = await fetch("/api/chat", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.content?.find(c=>c.type==="text")?.text || "{}";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

async function fetchResolution(history, escalation, infSel) {
  const level = getLevel(escalation);
  const histText = history.map((h,i) => `Round ${Math.floor(i/2)+1} — ${h.player}: ${h.choices.join("; ")}`).join("\n");
  const infText = INFLUENTIAL.filter(p=>(infSel[p.id]||[]).length>0).map(p=>`${p.name}: ${(infSel[p.id]||[]).join(", ")}`).join("\n");
  const prompt = `Senior geopolitical analyst. April 2026. Assess the final state of this decision chain.

FULL DECISION CHAIN:
${histText}

INFLUENTIAL PARTIES:
${infText||"None specified"}

FINAL ESCALATION: ${escalation}/100 (${level.label})

## 🏁 END STATE
Name the most likely end state in 3-6 words.

## 📊 OUTCOME PROBABILITIES
3 outcomes with probabilities (total 100%):
- **[Outcome]** (~X%): One sentence.

## ⚡ CRITICAL TURNING POINT
Which single decision was most consequential and why?

## 🌍 REGIONAL FALLOUT
3 bullet points on broader regional consequences.

## 🕊️ PATH NOT TAKEN
What one decision could have changed everything?

## 📋 FINAL VERDICT
Two sentences: what this chain leads to, and how history will judge it.`;

  const res = await fetch("/api/chat", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.find(c=>c.type==="text")?.text || "";
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────

const EscalationMeter = ({ value }) => {
  const level = getLevel(value);
  return (
    <div style={{padding:"0.6rem 0.75rem",background:level.bg,border:`1px solid ${level.border}`,borderRadius:"6px",marginBottom:"0.6rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.3rem"}}>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.58rem",color:level.color,letterSpacing:"0.1em",fontWeight:600}}>ESCALATION</span>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",color:level.color,fontWeight:700}}>{value}/100</span>
      </div>
      <div style={{height:"5px",background:"#e2e8f0",borderRadius:"3px",overflow:"hidden",marginBottom:"0.3rem"}}>
        <div style={{height:"100%",width:`${value}%`,background:"linear-gradient(90deg,#16a34a,#d97706,#dc2626,#7e22ce)",borderRadius:"3px",transition:"width 0.6s ease"}}/>
      </div>
      <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.57rem",color:level.color,letterSpacing:"0.1em",textAlign:"center",fontWeight:600}}>{level.label}</div>
    </div>
  );
};

const ChoiceBtn = ({ label, active, onClick, type, disabled, custom }) => {
  const isEsc = type==="escalate";
  const activeColor = isEsc ? "#dc2626" : "#15803d";
  const activeBg = isEsc ? "#fef2f2" : "#f0fdf4";
  const activeBorder = isEsc ? "#fca5a5" : "#86efac";
  const idleBorder = isEsc ? "#fecaca" : "#bbf7d0";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", textAlign:"left", padding:"0.45rem 0.6rem",
      background: active ? activeBg : "#ffffff",
      border: `1px solid ${active ? activeBorder : idleBorder}`,
      borderRadius:"5px",
      cursor: disabled ? "not-allowed" : "pointer",
      display:"flex", gap:"0.45rem", alignItems:"flex-start",
      transition:"all 0.15s", opacity: disabled ? 0.5 : 1,
      boxShadow: active ? `0 1px 4px ${activeColor}18` : "0 1px 2px rgba(0,0,0,0.04)",
    }}>
      <span style={{color: active ? activeColor : "#cbd5e1", marginTop:"3px", fontSize:"0.58rem", flexShrink:0}}>{active?"◉":"○"}</span>
      <span style={{fontSize:"0.72rem", color: active ? activeColor : "#374151", lineHeight:1.45, transition:"color 0.15s", fontStyle: custom?"italic":"normal", fontWeight: active ? 500 : 400}}>
        {custom && <span style={{color:"#9ca3af",fontSize:"0.62rem",marginRight:"0.25rem"}}>✏</span>}
        {label}
      </span>
    </button>
  );
};

const LogEntry = ({ entry, index }) => {
  const isP1 = entry.playerId==="p1";
  const color = isP1 ? "#1d4ed8" : "#b91c1c";
  const bg = isP1 ? "#eff6ff" : "#fef2f2";
  const border = isP1 ? "#bfdbfe" : "#fecaca";
  return (
    <div style={{padding:"0.5rem 0.6rem",background:bg,border:`1px solid ${border}`,borderLeft:`3px solid ${color}`,borderRadius:"0 5px 5px 0",marginBottom:"0.35rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.2rem"}}>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",color,letterSpacing:"0.08em",fontWeight:600}}>R{Math.floor(index/2)+1} · {entry.player}</span>
        {entry.escalationDelta!==0 && (
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.5rem",color:entry.escalationDelta>0?"#dc2626":"#15803d",fontWeight:700}}>
            {entry.escalationDelta>0?`+${entry.escalationDelta}`:entry.escalationDelta}
          </span>
        )}
      </div>
      {entry.choices.map((c,i)=>(
        <div key={i} style={{display:"flex",gap:"0.28rem",marginBottom:"0.1rem"}}>
          <span style={{color,fontSize:"0.55rem",marginTop:"2px",flexShrink:0,opacity:0.5}}>·</span>
          <span style={{fontSize:"0.64rem",color:"#374151",lineHeight:1.35}}>{c}</span>
        </div>
      ))}
    </div>
  );
};

const renderMD = text => text.split("\n").map((line,i) => {
  if (line.startsWith("## ")) return <h2 key={i} style={{color:"#92400e",fontSize:"0.88rem",fontFamily:"'Share Tech Mono',monospace",marginTop:"1.1rem",marginBottom:"0.35rem",letterSpacing:"0.04em",borderBottom:"2px solid #fde68a",paddingBottom:"0.2rem"}}>{line.slice(3)}</h2>;
  if (line.startsWith("- **")) { const m=line.match(/^- \*\*(.+?)\*\*(.*)$/); if(m) return <div key={i} style={{display:"flex",gap:"0.4rem",marginBottom:"0.3rem",paddingLeft:"0.4rem"}}><span style={{color:"#d97706",flexShrink:0,marginTop:"1px"}}>▸</span><p style={{margin:0,color:"#1e293b",fontSize:"0.8rem"}}><strong style={{color:"#0f172a"}}>{m[1]}</strong>{m[2]}</p></div>; }
  if (line.startsWith("- ")) return <div key={i} style={{display:"flex",gap:"0.4rem",marginBottom:"0.25rem",paddingLeft:"0.4rem"}}><span style={{color:"#94a3b8",flexShrink:0,fontSize:"0.62rem",marginTop:"2px"}}>·</span><p style={{margin:0,color:"#374151",fontSize:"0.8rem"}}>{line.slice(2)}</p></div>;
  if (!line.trim()) return <div key={i} style={{height:"0.3rem"}}/>;
  return <p key={i} style={{color:"#374151",fontSize:"0.8rem",lineHeight:1.7,marginBottom:"0.2rem"}}>{line}</p>;
});

// ─── MAIN ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("setup");
  const [currentOptions, setCurrentOptions] = useState({escalate:P1_INITIAL.escalate,deescalate:P1_INITIAL.deescalate,context:""});
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [customType, setCustomType] = useState("escalate");
  const [history, setHistory] = useState([]);
  const [escalation, setEscalation] = useState(55);
  const [infSel, setInfSel] = useState({});
  const [infOpen, setInfOpen] = useState({});
  const [resolution, setResolution] = useState(null);
  const [error, setError] = useState(null);
  const [roundNum, setRoundNum] = useState(1);
  const [maxRounds] = useState(5);
  const [aiContext, setAiContext] = useState("");
  const logRef = useRef(null);
  const mainRef = useRef(null);
  const customRef = useRef(null);

  const isP1Turn = phase==="p1turn";
  const isP2Turn = phase==="p2turn";
  const currentPlayer = isP1Turn ? P1_INITIAL : P2_INITIAL;

  const toggleChoice = c => setSelectedChoices(p => p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  const toggleInf = (pid,opt) => setInfSel(p=>{const c=p[pid]||[];return{...p,[pid]:c.includes(opt)?c.filter(x=>x!==opt):[...c,opt]};});
  const toggleInfOpen = id => setInfOpen(p=>({...p,[id]:!p[id]}));

  const addCustom = () => {
    const txt = customInput.trim();
    if (!txt) return;
    const label = `[Custom] ${txt}`;
    if (!selectedChoices.includes(label)) setSelectedChoices(p=>[...p,label]);
    setCustomInput("");
    customRef.current?.focus();
  };

  const scrollLog = () => setTimeout(()=>logRef.current?.scrollTo({top:logRef.current.scrollHeight,behavior:"smooth"}),100);
  const startGame = () => { setPhase("p1turn"); setCurrentOptions({escalate:P1_INITIAL.escalate,deescalate:P1_INITIAL.deescalate,context:""}); };

  const confirmTurn = async () => {
    if (!selectedChoices.length) return;
    const delta = escalationDelta(selectedChoices);
    const newEsc = Math.max(0,Math.min(100,escalation+delta));
    const entry = {player:currentPlayer.name,playerId:currentPlayer.id,choices:[...selectedChoices],escalationDelta:delta,round:roundNum};
    const newHistory = [...history,entry];
    setHistory(newHistory); setEscalation(newEsc); setSelectedChoices([]); setCustomInput(""); scrollLog();

    const isLastRound = roundNum>=maxRounds && isP2Turn;
    const isNuclear = newEsc>=97;
    if (isLastRound||isNuclear) {
      setPhase("resolving");
      try { const r=await fetchResolution(newHistory,newEsc,infSel); setResolution(r); setPhase("resolved"); }
      catch(e) { setError(e.message); setPhase("resolved"); }
      return;
    }
    setPhase("loading");
    const nextPlayer = isP1Turn ? P2_INITIAL : P1_INITIAL;
    try {
      const opts = await fetchNextOptions(newHistory,nextPlayer,newEsc);
      setCurrentOptions(opts); setAiContext(opts.context||"");
      if (isP2Turn) setRoundNum(r=>r+1);
      setPhase(isP1Turn?"p2turn":"p1turn");
      setTimeout(()=>mainRef.current?.scrollTo({top:0,behavior:"smooth"}),100);
    } catch(e) { setError(e.message); setPhase(isP1Turn?"p2turn":"p1turn"); }
  };

  const resolveNow = async () => {
    setPhase("resolving");
    try { const r=await fetchResolution(history,escalation,infSel); setResolution(r); setPhase("resolved"); }
    catch(e) { setError(e.message); setPhase("resolved"); }
  };

  const reset = () => { setPhase("setup"); setHistory([]); setEscalation(55); setSelectedChoices([]); setResolution(null); setError(null); setRoundNum(1); setInfSel({}); setAiContext(""); setCustomInput(""); };

  const level = getLevel(escalation);
  const infCount = Object.values(infSel).flat().length;
  const customChoices = selectedChoices.filter(c=>c.startsWith("[Custom]"));

  const p1Color = "#1d4ed8";
  const p2Color = "#b91c1c";
  const activeColor = isP1Turn ? p1Color : p2Color;

  return (
    <div style={{height:"100vh",background:"#f1f5f9",color:"#0f172a",fontFamily:"'Barlow',system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}
        button{font-family:inherit;cursor:pointer}
        input{font-family:inherit}
        input::placeholder{color:#94a3b8}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.3s ease forwards}
        .pulse{animation:pulse 1.4s infinite}
      `}</style>

      {/* HEADER */}
      <header style={{flexShrink:0,zIndex:100,background:"#ffffff",borderBottom:"1px solid #e2e8f0",padding:"0 1.25rem",height:"48px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.15rem",fontWeight:700,color:"#0f172a",letterSpacing:"0.03em"}}>
            MIDEAST <span style={{color:"#d97706"}}>WARGAME</span>
          </span>
          <div style={{height:"1rem",width:"1px",background:"#e2e8f0"}}/>
          <span style={{fontSize:"0.55rem",fontFamily:"'Share Tech Mono',monospace",color:"#94a3b8",letterSpacing:"0.1em"}}>GAME THEORY ENGINE // APR 2026</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.65rem"}}>
          {phase!=="setup" && <>
            <div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
              {[...Array(maxRounds)].map((_,i)=>(
                <div key={i} style={{width:"6px",height:"6px",borderRadius:"50%",background:i<roundNum?level.color:"#e2e8f0",transition:"background 0.3s"}}/>
              ))}
            </div>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.58rem",color:level.color,letterSpacing:"0.08em",fontWeight:600}}>
              {phase==="resolved"?"RESOLVED":phase==="resolving"?"RESOLVING...":`ROUND ${roundNum}/${maxRounds}`}
            </span>
            <div style={{height:"1rem",width:"1px",background:"#e2e8f0"}}/>
            {history.length>0 && phase!=="resolved" && (
              <button onClick={resolveNow} style={{fontSize:"0.6rem",fontFamily:"'Share Tech Mono',monospace",color:"#d97706",background:"#fffbeb",border:"1px solid #fde68a",padding:"0.22rem 0.55rem",borderRadius:"4px",letterSpacing:"0.06em",fontWeight:600}}>RESOLVE NOW</button>
            )}
            <button onClick={reset} style={{fontSize:"0.6rem",fontFamily:"'Share Tech Mono',monospace",color:"#64748b",background:"#f8fafc",border:"1px solid #e2e8f0",padding:"0.22rem 0.55rem",borderRadius:"4px",letterSpacing:"0.06em"}}>RESET</button>
          </>}
        </div>
      </header>

      {/* BODY */}
      <div style={{flex:1,display:"flex",minHeight:0}}>

        {/* LOG */}
        {phase!=="setup" && (
          <div style={{width:"220px",flexShrink:0,borderRight:"1px solid #e2e8f0",background:"#ffffff",display:"flex",flexDirection:"column"}}>
            <div style={{flexShrink:0,padding:"0.5rem 0.75rem",borderBottom:"1px solid #f1f5f9",background:"#f8fafc"}}>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",color:"#64748b",letterSpacing:"0.1em",fontWeight:600}}>DECISION LOG</span>
            </div>
            <div ref={logRef} style={{flex:1,overflowY:"auto",padding:"0.5rem 0.6rem"}}>
              {history.length===0 && (
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.56rem",color:"#cbd5e1",textAlign:"center",marginTop:"2rem",letterSpacing:"0.1em"}}>NO MOVES YET</div>
              )}
              {history.map((e,i)=><LogEntry key={i} entry={e} index={i}/>)}
              {(phase==="loading"||phase==="resolving") && (
                <div style={{display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.4rem 0.5rem"}}>
                  <div style={{width:"10px",height:"10px",border:"2px solid #fde68a",borderTop:"2px solid #d97706",borderRadius:"50%",animation:"spin 0.9s linear infinite",flexShrink:0}}/>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.54rem",color:"#d97706",letterSpacing:"0.06em"}}>{phase==="resolving"?"RESOLVING...":"GENERATING..."}</span>
                </div>
              )}
            </div>
            <div style={{flexShrink:0,padding:"0.5rem 0.6rem",borderTop:"1px solid #f1f5f9",background:"#f8fafc"}}>
              <EscalationMeter value={escalation}/>
            </div>
          </div>
        )}

        {/* MAIN */}
        <div ref={mainRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",minWidth:0,background:"#f8fafc"}}>

          {/* SETUP */}
          {phase==="setup" && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2.5rem",gap:"1.5rem",background:"#ffffff"}}>
              <div className="fade-up" style={{textAlign:"center",maxWidth:"540px"}}>
                <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>⚔️</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.2rem",fontWeight:700,color:"#0f172a",letterSpacing:"0.03em",marginBottom:"0.35rem"}}>
                  MIDEAST WARGAME
                </div>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"#d97706",letterSpacing:"0.15em",marginBottom:"1rem",fontWeight:600}}>
                  GAME THEORY SCENARIO ENGINE // APRIL 2026
                </div>
                <div style={{fontSize:"0.85rem",color:"#475569",lineHeight:1.75,marginBottom:"1.5rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"1rem 1.25rem",textAlign:"left"}}>
                  <strong style={{color:"#0f172a"}}>Operation Epic Fury</strong> began February 28, 2026. Ali Khamenei was assassinated. <strong style={{color:"#0f172a"}}>Mojtaba Khamenei</strong> leads Iran. The Strait of Hormuz is partially blocked. Play sequential decisions — each response shapes the next. You can also add your own moves at any turn.
                </div>
                <div style={{display:"flex",gap:"0.65rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.75rem"}}>
                  {[["🇺🇸🇮🇱","US + Israel",p1Color,"#eff6ff","#bfdbfe"],["🇮🇷⚔️","Iran + Proxies",p2Color,"#fef2f2","#fecaca"],["📊",`${maxRounds} Rounds`,"#b45309","#fffbeb","#fde68a"],["✏️","Custom Moves","#6d28d9","#f5f3ff","#ddd6fe"]].map(([icon,label,color,bg,border])=>(
                    <div key={label} style={{display:"flex",alignItems:"center",gap:"0.4rem",background:bg,border:`1px solid ${border}`,padding:"0.4rem 0.8rem",borderRadius:"6px"}}>
                      <span style={{fontSize:"0.9rem"}}>{icon}</span>
                      <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.63rem",color,letterSpacing:"0.06em",fontWeight:600}}>{label}</span>
                    </div>
                  ))}
                </div>
                <button onClick={startGame} style={{padding:"0.8rem 3rem",background:"#d97706",border:"none",color:"#ffffff",borderRadius:"7px",fontSize:"0.82rem",fontFamily:"'Share Tech Mono',monospace",letterSpacing:"0.15em",fontWeight:700,boxShadow:"0 4px 14px rgba(217,119,6,0.35)",cursor:"pointer"}}>
                  BEGIN SCENARIO ▶
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE TURN */}
          {(phase==="p1turn"||phase==="p2turn"||phase==="loading") && (
            <div style={{padding:"0.9rem 1.1rem 0.75rem"}}>
              {/* Turn banner */}
              <div className="fade-up" style={{marginBottom:"0.75rem",padding:"0.65rem 0.9rem",background:isP1Turn?"#eff6ff":"#fef2f2",border:`1px solid ${isP1Turn?"#bfdbfe":"#fecaca"}`,borderLeft:`4px solid ${activeColor}`,borderRadius:"6px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <div style={{display:"flex",gap:"0.2rem"}}>{currentPlayer.flags.map((f,i)=><span key={i} style={{fontSize:"1.05rem"}}>{f}</span>)}</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:700,color:activeColor,letterSpacing:"0.04em"}}>{currentPlayer.name}</div>
                      <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.54rem",color:"#64748b",letterSpacing:"0.08em"}}>ROUND {roundNum} · {currentPlayer.id==="p1"?"INITIATING MOVE":"RESPONDING TO P1"}</div>
                    </div>
                  </div>
                  {selectedChoices.length>0 && (
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",color:activeColor,background:"#ffffff",border:`1px solid ${isP1Turn?"#bfdbfe":"#fecaca"}`,padding:"0.22rem 0.55rem",borderRadius:"4px",fontWeight:700}}>
                      {selectedChoices.length} SELECTED
                    </div>
                  )}
                </div>
                {aiContext && (
                  <div style={{marginTop:"0.4rem",fontSize:"0.7rem",color:"#64748b",fontStyle:"italic",borderTop:`1px solid ${isP1Turn?"#dbeafe":"#fee2e2"}`,paddingTop:"0.35rem"}}>
                    ⚡ {aiContext}
                  </div>
                )}
              </div>

              {/* Options grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
                {[
                  {type:"escalate",   label:"ESCALATE",    color:"#dc2626", bg:"#fef2f2", border:"#fecaca"},
                  {type:"deescalate", label:"DE-ESCALATE", color:"#15803d", bg:"#f0fdf4", border:"#bbf7d0"},
                ].map(({type,label,color,bg,border})=>(
                  <div key={type} style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"0.7rem",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.58rem",color,letterSpacing:"0.14em",marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.4rem",fontWeight:700}}>
                      <div style={{height:"2px",flex:1,background:`${color}30`,borderRadius:"1px"}}/>{label}<div style={{height:"2px",flex:1,background:`${color}30`,borderRadius:"1px"}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:"0.22rem"}}>
                      {(currentOptions[type]||[]).map(opt=>(
                        <ChoiceBtn key={opt} label={opt} active={selectedChoices.includes(opt)} onClick={()=>toggleChoice(opt)} type={type} disabled={phase==="loading"}/>
                      ))}
                      {customChoices.map(c=>(
                        <ChoiceBtn key={c} label={c.replace("[Custom] ","")} active={true} onClick={()=>toggleChoice(c)} type={type} disabled={phase==="loading"} custom={true}/>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom input */}
              <div style={{marginTop:"0.75rem",padding:"0.7rem 0.85rem",background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:"8px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.56rem",color:"#64748b",letterSpacing:"0.1em",marginBottom:"0.45rem",fontWeight:600}}>✏ ADD YOUR OWN MOVE</div>
                <div style={{display:"flex",gap:"0.5rem",alignItems:"center",marginBottom:"0.4rem"}}>
                  <input
                    ref={customRef}
                    value={customInput}
                    onChange={e=>setCustomInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addCustom()}
                    placeholder="Describe a decision not listed above..."
                    disabled={phase==="loading"}
                    style={{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"5px",padding:"0.42rem 0.6rem",fontSize:"0.72rem",color:"#1e293b",outline:"none"}}
                  />
                  <div style={{display:"flex",gap:"0.3rem"}}>
                    <button onClick={()=>setCustomType("escalate")} style={{padding:"0.38rem 0.55rem",background:customType==="escalate"?"#fef2f2":"#f8fafc",border:`1px solid ${customType==="escalate"?"#fca5a5":"#e2e8f0"}`,borderRadius:"4px",fontSize:"0.6rem",fontFamily:"'Share Tech Mono',monospace",color:customType==="escalate"?"#dc2626":"#94a3b8",letterSpacing:"0.06em",fontWeight:600}}>ESC</button>
                    <button onClick={()=>setCustomType("deescalate")} style={{padding:"0.38rem 0.55rem",background:customType==="deescalate"?"#f0fdf4":"#f8fafc",border:`1px solid ${customType==="deescalate"?"#86efac":"#e2e8f0"}`,borderRadius:"4px",fontSize:"0.6rem",fontFamily:"'Share Tech Mono',monospace",color:customType==="deescalate"?"#15803d":"#94a3b8",letterSpacing:"0.06em",fontWeight:600}}>DE-ESC</button>
                    <button onClick={addCustom} disabled={!customInput.trim()||phase==="loading"} style={{padding:"0.38rem 0.7rem",background:customInput.trim()?"#d97706":"#f1f5f9",border:`1px solid ${customInput.trim()?"#d97706":"#e2e8f0"}`,borderRadius:"4px",fontSize:"0.6rem",fontFamily:"'Share Tech Mono',monospace",color:customInput.trim()?"#ffffff":"#cbd5e1",letterSpacing:"0.06em",fontWeight:700}}>+ ADD</button>
                  </div>
                </div>
                {customChoices.length>0 && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginTop:"0.3rem"}}>
                    {customChoices.map(c=>(
                      <div key={c} style={{display:"flex",alignItems:"center",gap:"0.25rem",background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:"4px",padding:"0.2rem 0.45rem"}}>
                        <span style={{fontSize:"0.65rem",color:"#6d28d9",fontWeight:500}}>{c.replace("[Custom] ","")}</span>
                        <button onClick={()=>toggleChoice(c)} style={{background:"transparent",border:"none",color:"#a78bfa",fontSize:"0.65rem",padding:"0",lineHeight:1,fontWeight:700}}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div style={{marginTop:"0.75rem",paddingBottom:"1rem"}}>
                {phase==="loading" ? (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",padding:"0.65rem",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"6px"}}>
                    <div style={{width:"14px",height:"14px",border:"2px solid #fde68a",borderTop:"2px solid #d97706",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"#92400e",letterSpacing:"0.1em",fontWeight:600}} className="pulse">GENERATING OPPONENT RESPONSE...</span>
                  </div>
                ) : (
                  <button onClick={confirmTurn} disabled={selectedChoices.length===0} style={{
                    width:"100%", padding:"0.7rem",
                    background: selectedChoices.length>0 ? activeColor : "#f1f5f9",
                    border: "none",
                    color: selectedChoices.length>0 ? "#ffffff" : "#94a3b8",
                    borderRadius:"6px", fontSize:"0.75rem", fontFamily:"'Share Tech Mono',monospace",
                    letterSpacing:"0.12em", fontWeight:700, transition:"all 0.2s",
                    boxShadow: selectedChoices.length>0 ? `0 4px 12px ${activeColor}35` : "none",
                    cursor: selectedChoices.length===0 ? "not-allowed" : "pointer",
                  }}>
                    {selectedChoices.length>0
                      ?`CONFIRM ${selectedChoices.length} DECISION${selectedChoices.length>1?"S":""} → ${roundNum>=maxRounds&&phase==="p2turn"?"RESOLVE":"NEXT TURN"}`
                      :"SELECT OR ADD AT LEAST ONE DECISION"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESOLVING */}
          {phase==="resolving" && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",padding:"3rem",background:"#ffffff"}}>
              <div style={{width:"2.5rem",height:"2.5rem",border:`3px solid ${level.border}`,borderTop:`3px solid ${level.color}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.72rem",color:level.color,letterSpacing:"0.14em",fontWeight:700}} className="pulse">COMPUTING FINAL STATE...</div>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"#94a3b8",letterSpacing:"0.1em"}}>ANALYZING {history.length} DECISION NODES</div>
            </div>
          )}

          {/* RESOLVED */}
          {phase==="resolved" && (
            <div style={{padding:"1rem 1.25rem",background:"#ffffff",minHeight:"100%"}} className="fade-up">
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.85rem",padding:"0.65rem 0.9rem",background:level.bg,border:`1px solid ${level.border}`,borderRadius:"6px"}}>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:level.color,flexShrink:0}}/>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",color:level.color,letterSpacing:"0.08em",fontWeight:700,flex:1}}>
                  RESOLVED · {history.length} MOVES · ESCALATION {escalation}/100 · {level.label}
                </span>
                <button onClick={reset} style={{fontSize:"0.62rem",fontFamily:"'Share Tech Mono',monospace",color:"#d97706",background:"#fffbeb",border:"1px solid #fde68a",padding:"0.22rem 0.55rem",borderRadius:"4px",letterSpacing:"0.06em",fontWeight:600}}>NEW GAME</button>
              </div>
              {error && <div style={{padding:"0.7rem",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"6px",color:"#dc2626",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.68rem",marginBottom:"0.75rem"}}>⚠ {error}</div>}
              {resolution && renderMD(resolution)}
            </div>
          )}
        </div>

        {/* INFLUENTIAL PARTIES */}
        {phase!=="setup" && (
          <div style={{width:"210px",flexShrink:0,borderLeft:"1px solid #e2e8f0",background:"#ffffff",overflowY:"auto",display:"flex",flexDirection:"column"}}>
            <div style={{flexShrink:0,padding:"0.5rem 0.75rem",borderBottom:"1px solid #f1f5f9",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",color:"#64748b",letterSpacing:"0.1em",fontWeight:600}}>INFLUENTIAL PARTIES</span>
              {infCount>0 && <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.55rem",color:"#d97706",background:"#fffbeb",border:"1px solid #fde68a",padding:"0.1rem 0.35rem",borderRadius:"3px",fontWeight:700}}>{infCount}</span>}
            </div>
            <div style={{fontSize:"0.58rem",color:"#94a3b8",fontFamily:"'Share Tech Mono',monospace",padding:"0.4rem 0.75rem",letterSpacing:"0.06em",borderBottom:"1px solid #f1f5f9",background:"#f8fafc"}}>
              SET BACKGROUND STANCE
            </div>
            {INFLUENTIAL.map(party=>{
              const sel=infSel[party.id]||[];
              const isOpen=infOpen[party.id];
              return (
                <div key={party.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                  <button onClick={()=>toggleInfOpen(party.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:"0.35rem",padding:"0.45rem 0.75rem",background:sel.length>0?"#fffbeb":"#ffffff",border:"none",transition:"background 0.15s",borderBottom:isOpen?"1px solid #f1f5f9":"none"}}>
                    <span style={{fontSize:"0.8rem"}}>{party.flag}</span>
                    <span style={{fontSize:"0.7rem",color:sel.length>0?party.color:"#374151",fontWeight:sel.length>0?700:500,flex:1,textAlign:"left"}}>{party.name}</span>
                    {sel.length>0 && <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.54rem",color:party.color,fontWeight:700,background:"#ffffff",border:`1px solid ${party.color}40`,padding:"0.08rem 0.28rem",borderRadius:"3px"}}>{sel.length}</span>}
                    <span style={{fontSize:"0.5rem",color:"#94a3b8",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{padding:"0.25rem 0.75rem 0.45rem",background:"#f8fafc"}}>
                      {party.options.map(opt=>{
                        const active=sel.includes(opt);
                        return (
                          <button key={opt} onClick={()=>toggleInf(party.id,opt)} style={{width:"100%",display:"flex",gap:"0.3rem",alignItems:"flex-start",padding:"0.3rem 0.35rem",marginBottom:"0.15rem",textAlign:"left",background:active?"#ffffff":"transparent",border:`1px solid ${active?party.color+"40":"transparent"}`,borderRadius:"4px",transition:"all 0.12s",boxShadow:active?"0 1px 3px rgba(0,0,0,0.06)":"none"}}>
                            <span style={{color:active?party.color:"#cbd5e1",fontSize:"0.52rem",marginTop:"2px",flexShrink:0}}>{active?"◉":"○"}</span>
                            <span style={{fontSize:"0.66rem",color:active?"#1e293b":"#64748b",lineHeight:1.4,fontWeight:active?500:400}}>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function hexRgb(hex) {
  if (!hex?.startsWith("#")) return "128,128,128";
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}