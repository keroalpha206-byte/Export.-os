import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE BRAIN OS v5  ·  "The War Room"
// Aesthetic: High-contrast editorial luxury — deep ink black, bone white, 
//            electric vermillion accents. Feels like a Bloomberg terminal 
//            designed by a Parisian luxury house.
// Font: DM Serif Display (headlines) + Roboto Mono (data) 
// One thing people remember: The blood-red accent system on pure black
// ─────────────────────────────────────────────────────────────────────────────

const $ = {
  // Base palette
  ink:    "#040407",
  night:  "#080810",
  deep:   "#0d0d18",
  well:   "#121220",
  pit:    "#181828",
  groove: "#202035",
  seam:   "#2a2a44",
  // Accent — electric vermillion / crimson
  red:    "#e8202a",
  redLo:  "#c01820",
  redHi:  "#ff3540",
  redGlow:"#e8202a44",
  // Gold — warm parchment
  gold:   "#c8902a",
  goldHi: "#e8b040",
  goldPale:"#f0cc80",
  // Signals
  jade:   "#00e5a0",
  jadeDim:"#005540",
  sky:    "#40b0ff",
  skyDim: "#102840",
  lav:    "#9060ff",
  amber:  "#e08020",
  // Text
  bone:   "#f0ede8",
  chalk:  "#c8c4bc",
  stone:  "#706c64",
  dust:   "#303030",
  // Special
  cream:  "#f8f4ec",
};

// ─── ALL PRODUCT CATEGORIES ──────────────────────────────────────────────────
const PRODUCT_CATS = [
  {
    id: "dermo", label: "Dermo-Cosmetics", icon: "◈",
    color: $.sky, emoji: "🧬",
    brands: ["La Roche-Posay","Eucerin","CeraVe","Bioderma","Avène","Vichy","Sebamed"],
    topSKUs: [
      { sku:"Cicaplast Baume B5 40ml",   brand:"LRP",     cost:8.5,  mL:80,  mH:105, vel:"⚡ Extreme", src:"FR" },
      { sku:"DermatoCLEAN Face Wash",     brand:"Eucerin", cost:9,    mL:85,  mH:122, vel:"⚡ Extreme", src:"DE" },
      { sku:"Oil Control SPF50+",         brand:"Eucerin", cost:14,   mL:60,  mH:85,  vel:"⚡ Extreme", src:"DE" },
      { sku:"Effaclar Duo (+)",           brand:"LRP",     cost:11,   mL:60,  mH:90,  vel:"🔥 Very High",src:"FR" },
      { sku:"Anthelios Invisible SPF50+", brand:"LRP",     cost:13,   mL:60,  mH:90,  vel:"⚡ Extreme", src:"FR" },
      { sku:"Sensibio H2O 500ml",         brand:"Bioderma",cost:11,   mL:40,  mH:70,  vel:"🔥 Very High",src:"FR" },
      { sku:"Moisturizing Cream 454g",    brand:"CeraVe",  cost:12,   mL:40,  mH:70,  vel:"🔥 Very High",src:"FR" },
      { sku:"Mineral 89 Serum",           brand:"Vichy",   cost:15,   mL:80,  mH:140, vel:"🔥 High",    src:"FR" },
    ],
    monthlyVolume: 28000, growthPct: 34, allocated: 35, note:"Fastest-selling. LRP + Eucerin dominate Egypt pharmacy channel."
  },
  {
    id: "serums", label: "Actives & Serums", icon: "◉",
    color: $.lav, emoji: "🔬",
    brands: ["The Ordinary","The Inkey List","La Roche-Posay","Eucerin","NIOD"],
    topSKUs: [
      { sku:"Niacinamide 10% + Zinc",     brand:"TO",      cost:4.5,  mL:70,  mH:110, vel:"🔥 Very High",src:"FR" },
      { sku:"Glycolic Acid 7%",           brand:"TO",      cost:4.5,  mL:80,  mH:120, vel:"🔥 Very High",src:"FR" },
      { sku:"Retinol 0.5%",               brand:"TO",      cost:5,    mL:75,  mH:115, vel:"🔥 High",    src:"FR" },
      { sku:"Hyaluronic Acid 2% + B5",    brand:"TO",      cost:5.5,  mL:70,  mH:100, vel:"🔥 High",    src:"FR" },
      { sku:"Retinol B3 Serum",           brand:"LRP",     cost:16,   mL:60,  mH:100, vel:"🔥 High",    src:"FR" },
      { sku:"Retinol Serum",              brand:"TIL",     cost:8,    mL:70,  mH:120, vel:"📈 Medium",  src:"FR" },
      { sku:"Pigment Control Serum",      brand:"Eucerin", cost:18,   mL:63,  mH:88,  vel:"🔥 High",    src:"DE" },
    ],
    monthlyVolume: 18500, growthPct: 48, allocated: 15, note:"Highest markup flexibility. Low source cost, high Egyptian retail price."
  },
  {
    id: "hair", label: "Hair Care", icon: "◆",
    color: $.gold, emoji: "💇",
    brands: ["Kérastase","Schwarzkopf","Syoss","Alpecin","Wella","L'Oréal Professionnel"],
    topSKUs: [
      { sku:"Elixir Ultime Hair Oil",     brand:"Kérastase",cost:22, mL:90,  mH:170, vel:"📈 Medium",  src:"FR" },
      { sku:"Nutritive Hair Mask",        brand:"Kérastase",cost:18, mL:90,  mH:160, vel:"📈 Medium",  src:"FR" },
      { sku:"Caffeine Shampoo C1 250ml",  brand:"Alpecin",  cost:5.5,mL:80,  mH:140, vel:"🔥 High",   src:"DE" },
      { sku:"IGORA ROYAL Hair Color",     brand:"SKPF",     cost:6.5,mL:60,  mH:120, vel:"🔥 High",   src:"DE" },
      { sku:"Gliss Ultimate Repair Mask", brand:"SKPF",     cost:5,  mL:60,  mH:110, vel:"🔥 High",   src:"DE" },
      { sku:"Serie Expert Mask 200ml",    brand:"L'Oréal P",cost:12, mL:80,  mH:140, vel:"🔥 High",   src:"FR" },
      { sku:"Elvive Total Repair Shampoo",brand:"L'Oréal",  cost:5,  mL:60,  mH:110, vel:"🔥 Very High",src:"FR"},
    ],
    monthlyVolume: 14200, growthPct: 22, allocated: 20, note:"Kérastase = highest margin% (90–170%). Salon channel + home use dual demand."
  },
  {
    id: "baby", label: "Baby & Family", icon: "▣",
    color: $.jade, emoji: "👶",
    brands: ["Weleda","Sebamed","Penaten","Bübchen","HiPP","Lavera","NUK"],
    topSKUs: [
      { sku:"Calendula Baby Cream",       brand:"Weleda",  cost:8,    mL:100, mH:200, vel:"🔥 High",    src:"DE" },
      { sku:"Wound Protection Cream",     brand:"Penaten", cost:4.5,  mL:150, mH:300, vel:"🔥 High",    src:"DE" },
      { sku:"Baby Diaper Rash Cream",     brand:"Sebamed", cost:6,    mL:90,  mH:160, vel:"🔥 High",    src:"DE" },
      { sku:"Baby Shampoo Sensitive",     brand:"HiPP",    cost:4,    mL:80,  mH:150, vel:"🔥 High",    src:"DE" },
      { sku:"Calendula Baby Lotion",      brand:"Bübchen", cost:4.5,  mL:75,  mH:130, vel:"🔥 High",    src:"DE" },
      { sku:"Baby Calendula Wash",        brand:"Weleda",  cost:7,    mL:90,  mH:160, vel:"🔥 High",    src:"DE" },
      { sku:"Organic Formula Stage 1",    brand:"HiPP",    cost:18,   mL:40,  mH:60,  vel:"📈 Steady",  src:"DE" },
    ],
    monthlyVolume: 11800, growthPct: 18, allocated: 15, note:"3–7× markup potential. Parents price-insensitive on baby care. German trust = premium."
  },
  {
    id: "intimate", label: "Intimate Care", icon: "⬡",
    color: $.redHi, emoji: "🌸",
    brands: ["Multi-Gyn","Gynofit","Lactacyd","Canesten","Sebamed","Weleda","KadeFungin"],
    topSKUs: [
      { sku:"ActiGel Intimate 50ml",      brand:"Multi-Gyn",cost:12, mL:200, mH:500, vel:"📈 Medium",  src:"DE" },
      { sku:"FloraPlus Vaginal Gel",      brand:"Multi-Gyn",cost:14, mL:180, mH:450, vel:"📈 Medium",  src:"DE" },
      { sku:"Lactic Acid Vaginal Gel",    brand:"Gynofit",  cost:11, mL:150, mH:380, vel:"📈 Medium",  src:"DE" },
      { sku:"Antifungal Cream",           brand:"Canesten", cost:8,  mL:120, mH:280, vel:"🔥 High",   src:"DE" },
      { sku:"Intimate Wash pH 3.8",       brand:"Sebamed",  cost:7,  mL:80,  mH:160, vel:"🔥 High",   src:"DE" },
      { sku:"Lactacyd Feminine Wash",     brand:"Lactacyd", cost:5,  mL:60,  mH:120, vel:"🔥 High",   src:"DE" },
    ],
    monthlyVolume: 8400, growthPct: 29, allocated: 10, note:"HIGHEST category margins (200–500%). Pharmacy distribution. Medical positioning. No price transparency in Egypt."
  },
  {
    id: "mens", label: "Men's Grooming", icon: "◎",
    color: $.sky, emoji: "🪒",
    brands: ["Nivea Men","Eucerin Men","L'Oréal Men Expert","Biotherm Homme","Weleda Men"],
    topSKUs: [
      { sku:"Creme Multi-Purpose",        brand:"Nivea Men",cost:3.5, mL:50,  mH:100, vel:"⚡ Extreme", src:"DE" },
      { sku:"Sensitive After Shave Balm", brand:"Nivea Men",cost:4,   mL:60,  mH:110, vel:"🔥 Very High",src:"DE"},
      { sku:"Deep Clean Face Wash",       brand:"Nivea Men",cost:3.8, mL:55,  mH:100, vel:"🔥 Very High",src:"DE"},
      { sku:"Aquapower Moisturizer",      brand:"Biotherm", cost:18,  mL:60,  mH:120, vel:"📈 Medium",  src:"FR" },
      { sku:"Oil Control Gel-Cream",      brand:"Eucerin",  cost:14,  mL:60,  mH:110, vel:"🔥 High",   src:"DE" },
      { sku:"Hydra Energetic Face Wash",  brand:"L'Oréal M",cost:5,   mL:50,  mH:90,  vel:"🔥 High",   src:"FR" },
    ],
    monthlyVolume: 9200, growthPct: 41, allocated: 10, note:"Fastest-growing underserved segment. Mass + derma dual channel. Strong German brand trust."
  },
  {
    id: "body", label: "Body & Deodorants", icon: "◌",
    color: $.amber, emoji: "🧴",
    brands: ["Fa","Rexona","Dove","Nivea","Eucerin","Lavera"],
    topSKUs: [
      { sku:"UreaRepair PLUS 10% Lotion",  brand:"Eucerin", cost:13,  mL:65,  mH:91,  vel:"📈 Med-High",src:"DE" },
      { sku:"Shower Gel Assorted",         brand:"Fa",      cost:1.8, mL:50,  mH:100, vel:"⚡ Extreme", src:"DE" },
      { sku:"Deodorant Spray 150ml",       brand:"Fa",      cost:1.9, mL:55,  mH:110, vel:"⚡ Extreme", src:"DE" },
      { sku:"Women Deodorant Cotton",      brand:"Rexona",  cost:2,   mL:50,  mH:100, vel:"⚡ Extreme", src:"DE" },
      { sku:"Intensive Moisturizing Lotion",brand:"Nivea",  cost:2.5, mL:55,  mH:105, vel:"⚡ Extreme", src:"DE" },
    ],
    monthlyVolume: 12600, growthPct: 15, allocated: 5, note:"High turnover, daily use. Egypt climate = permanent deodorant demand. Low cost, fast reorder cycle."
  },
];

// ─── NAVIGATION STRUCTURE ────────────────────────────────────────────────────
const VIEWS = [
  { id:"command",   label:"WAR ROOM",           sub:"Live Command Center"     },
  { id:"brain",     label:"ACTIVE BRAIN",        sub:"Intelligence Layer"      },
  { id:"products",  label:"PRODUCT CATEGORIES",  sub:"8 Category Intelligence" },
  { id:"portfolio", label:"PORTFOLIO BUILDER",   sub:"Live Mix Optimizer"      },
  { id:"control",   label:"CONTROL PANEL",       sub:"Deep Operations Control" },
  { id:"logistics", label:"LOGISTICS ENGINE",    sub:"Carrier Strategy"        },
  { id:"automation",label:"AUTOMATION OPS",      sub:"10 Workflows Live"       },
  { id:"finance",   label:"FINANCE SYSTEM",      sub:"Cash · VAT · P&L"        },
  { id:"marketing", label:"MARKETING ENGINE",    sub:"Sales Funnel System"     },
  { id:"stack",     label:"TECH STACK",          sub:"Tools & Architecture"    },
  { id:"roadmap",   label:"ROADMAP",             sub:"16-Week Execution"       },
  { id:"manuals",   label:"MANUALS",             sub:"Step-by-Step Operations" },
];

// ─── MICRO COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ t, c }) => {
  const col = c || $.red;
  return (
    <span style={{
      padding:"2px 8px", borderRadius:2, fontSize:9, fontWeight:700,
      letterSpacing:1.5, textTransform:"uppercase", fontFamily:"monospace",
      background:`${col}18`, color:col, border:`1px solid ${col}35`,
    }}>{t}</span>
  );
};

const Live = ({ c = $.jade, size = 6 }) => (
  <span style={{
    display:"inline-block", width:size, height:size, borderRadius:"50%",
    background:c, boxShadow:`0 0 8px ${c}`,
    animation:"blink 2s ease-in-out infinite",
  }}/>
);

const Card = ({ ch, style={}, accent, hover }) => (
  <div style={{
    background:$.well, borderRadius:8,
    border:`1px solid ${accent ? accent+"30" : $.groove}`,
    borderTop: accent ? `2px solid ${accent}` : `1px solid ${$.seam}`,
    padding:18, transition:"all 0.2s",
    ...style,
  }}>{ch}</div>
);

const Num = ({ v, c, size=22, bold=true }) => (
  <span style={{
    fontFamily:"'Roboto Mono','Fira Mono','Courier New',monospace",
    fontSize:size, color:c||$.bone, fontWeight:bold?700:400,
  }}>{v}</span>
);

const Label = ({ ch }) => (
  <div style={{
    fontSize:9, color:$.stone, letterSpacing:2.5,
    textTransform:"uppercase", marginBottom:10,
    fontFamily:"monospace",
  }}>{ch}</div>
);

const Divider = ({ c }) => (
  <div style={{
    height:1,
    background:`linear-gradient(90deg,transparent,${c||$.red}60,transparent)`,
    margin:"14px 0",
  }}/>
);

const Head = ({ title, sub, color }) => (
  <div style={{ marginBottom:28 }}>
    <h1 style={{
      fontFamily:"'DM Serif Display','Didot','Georgia',serif",
      fontSize:34, fontWeight:400, color:color||$.bone,
      letterSpacing:0.5, margin:"0 0 6px",
      lineHeight:1.1,
    }}>{title}</h1>
    <div style={{ fontSize:12, color:$.stone, fontFamily:"monospace", letterSpacing:0.5 }}>{sub}</div>
    <div style={{ height:2, width:60, background:$.red, marginTop:12, borderRadius:1 }}/>
  </div>
);

const fmt = (n,d=0) => typeof n==="number" ? n.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d}) : n;
const fmtE = (n) => `€${fmt(Math.abs(Math.round(n)))}`;

// ─── LIVE DATA ────────────────────────────────────────────────────────────────
const useTick = (ms=1800) => {
  const [t,setT] = useState(0);
  useEffect(()=>{
    const i = setInterval(()=>setT(p=>p+1),ms);
    return ()=>clearInterval(i);
  },[ms]);
  return t;
};

// ─── WAR ROOM ─────────────────────────────────────────────────────────────────
function WarRoom() {
  const t = useTick();
  const [time,setTime] = useState(new Date());
  useEffect(()=>{ const i=setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(i); },[]);

  const wave = (base,amp,freq,phase=0) => base + amp*Math.sin(t*freq+phase);

  const kpis = [
    { label:"MONTHLY REVENUE",  val:fmtE(wave(142840,1800,0.25)),  sub:"All channels · MTD",     color:$.goldHi, live:true,  delta:"+18%" },
    { label:"NET PROFIT",        val:fmtE(wave(38920,600,0.31)),    sub:"After tax provision",    color:$.jade,   live:true,  delta:"+22%" },
    { label:"ACTIVE ORDERS",     val:Math.round(wave(247,4,0.22)),  sub:"In pipeline",            color:$.sky,    live:true,  delta:"+12%" },
    { label:"AUTOMATION",        val:`${Math.round(wave(92,1,0.1))}%`, sub:"Target: 90%",         color:$.lav,    live:true,  delta:"↑2%" },
    { label:"CASH BUFFER",       val:fmtE(wave(68400,900,0.18)),    sub:"Wise Business EUR",      color:$.goldPale,live:true, delta:"Safe" },
    { label:"SHIPMENTS",         val:"18",                           sub:"DE→EG in transit",       color:$.amber,  live:false, delta:"On time" },
    { label:"VAT PENDING",       val:"€14,212",                     sub:"Finanzamt · ETA 72h",    color:$.sky,    live:false, delta:"Filed" },
    { label:"CONV RATE",         val:`${wave(3.8,0.3,0.4).toFixed(1)}%`, sub:"Shopify Arabic",  color:$.jade,   live:true,  delta:"+0.4%" },
  ];

  const alerts = [
    { type:"OPPORTUNITY", msg:"Kérastase Elixir Oil: wholesaler price dropped 12%. Buy window open — 170% margin SKU.", color:$.jade,    action:"REORDER NOW",  urgent:false },
    { type:"LOGISTICS",   msg:"SHP-0441 vessel 48h from Alexandria. ACID declaration must be filed immediately.", color:$.amber,   action:"FILE ACID",    urgent:true  },
    { type:"FINANCE",     msg:"VAT refund €14,212 in transit. Auto-reinvestment into M2 stock pre-authorized.", color:$.sky,     action:"VIEW PLAN",    urgent:false },
    { type:"RISK",        msg:"Multi-Gyn ActiGel stock at 22% threshold. Reorder triggers at 20%.",             color:$.redHi,   action:"REVIEW ORDER", urgent:false },
  ];

  const brainInsights = [
    "Seller reorder velocity +18% since geographic exclusivity policy. Replicate across all cities.",
    "Eucerin DermatoCLEAN 122% margin — highest ROI per unit. Increase M3 allocation by 40 units.",
    "Fast Freight 2× consecutive on-time customs: elevate to primary forwarder immediately.",
    "Logistics phase switch trigger: Q approaching 900 units/month — sea freight window in 5 weeks.",
  ];

  return (
    <div>
      {/* TOP BAR */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'DM Serif Display','Georgia',serif", fontSize:40, color:$.bone, fontWeight:400, margin:0, letterSpacing:1 }}>
            Active Brain
          </h1>
          <div style={{ fontFamily:"monospace", fontSize:11, color:$.stone, marginTop:5 }}>
            Autonomous Business OS · {time.toLocaleTimeString("de-DE")} CET · Nürnberg HQ
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"monospace", fontSize:9, color:$.stone, letterSpacing:2 }}>SYSTEM STATUS</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
              <Live c={$.jade} size={8}/>
              <span style={{ fontFamily:"monospace", fontSize:12, color:$.jade, fontWeight:700 }}>92% AUTONOMOUS</span>
            </div>
          </div>
          <div style={{ width:1, height:32, background:$.groove }}/>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"monospace", fontSize:9, color:$.stone, letterSpacing:2 }}>PRODUCTS ACTIVE</div>
            <Num v="8 CATEGORIES" c={$.goldHi} size={12}/>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        {kpis.slice(0,4).map(k=>(
          <div key={k.label} style={{ background:$.well, borderRadius:8, padding:"16px 18px", borderLeft:`3px solid ${k.color}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:60, height:60, background:`radial-gradient(circle at 100% 0%, ${k.color}12, transparent 70%)` }}/>
            <Label ch={k.label}/>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              {k.live && <Live c={k.color} size={5}/>}
              <Num v={k.val} c={k.color} size={20}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
              <span style={{ fontSize:10, color:$.stone }}>{k.sub}</span>
              <span style={{ fontSize:10, color:k.color, fontFamily:"monospace" }}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {kpis.slice(4).map(k=>(
          <div key={k.label} style={{ background:$.well, borderRadius:8, padding:"16px 18px", borderLeft:`3px solid ${k.color}` }}>
            <Label ch={k.label}/>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              {k.live && <Live c={k.color} size={5}/>}
              <Num v={k.val} c={k.color} size={18}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
              <span style={{ fontSize:10, color:$.stone }}>{k.sub}</span>
              <span style={{ fontSize:10, color:k.color, fontFamily:"monospace" }}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:14, marginBottom:14 }}>
        {/* Brain Feed */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}`, borderTop:`2px solid ${$.red}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <Label ch="Active Brain · Intelligence Feed"/>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Live c={$.red} size={6}/>
              <span style={{ fontFamily:"monospace", fontSize:9, color:$.red }}>PROCESSING</span>
            </div>
          </div>
          {brainInsights.map((ins,i)=>(
            <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px", background:$.deep, borderRadius:6, marginBottom:8, border:`1px solid ${$.groove}` }}>
              <div style={{ width:3, background:$.red, borderRadius:2, flexShrink:0 }}/>
              <div style={{ fontSize:12, color:$.chalk, lineHeight:1.6 }}>{ins}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
          <Label ch={`Priority Alerts · ${alerts.length} active`}/>
          {alerts.map((a,i)=>(
            <div key={i} style={{ padding:"12px 14px", background:$.deep, borderRadius:6, marginBottom:8, border:`1px solid ${a.color}25` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <Badge t={a.type} c={a.color}/>
                {a.urgent && <Badge t="ACTION NOW" c={$.red}/>}
              </div>
              <div style={{ fontSize:11, color:$.chalk, lineHeight:1.5, marginBottom:8 }}>{a.msg}</div>
              <button style={{ padding:"5px 12px", background:`${a.color}15`, border:`1px solid ${a.color}40`, borderRadius:4, fontSize:10, color:a.color, cursor:"pointer", fontFamily:"monospace", letterSpacing:1 }}>{a.action} →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Category Snapshot */}
      <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
        <Label ch="Product Categories · Revenue Distribution · Live"/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:8 }}>
          {PRODUCT_CATS.map(cat=>(
            <div key={cat.id} style={{ textAlign:"center", padding:"12px 8px", background:$.deep, borderRadius:6, border:`1px solid ${cat.color}25` }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{cat.emoji}</div>
              <div style={{ fontSize:9, color:cat.color, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{cat.allocated}%</div>
              <div style={{ height:3, background:`${cat.color}20`, borderRadius:2, marginBottom:6 }}>
                <div style={{ height:3, width:`${cat.allocated/40*100}%`, background:cat.color, borderRadius:2 }}/>
              </div>
              <div style={{ fontSize:9, color:$.stone, lineHeight:1.3 }}>{cat.label.split(" ")[0]}</div>
              <div style={{ fontSize:9, color:cat.color, fontFamily:"monospace", marginTop:3 }}>+{cat.growthPct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT CATEGORIES ───────────────────────────────────────────────────────
function ProductCats() {
  const [sel, setSel] = useState("dermo");
  const [sortBy, setSortBy] = useState("margin");
  const cat = PRODUCT_CATS.find(c=>c.id===sel);

  const sorted = [...cat.topSKUs].sort((a,b)=>{
    if(sortBy==="margin") return b.mH - a.mH;
    if(sortBy==="cost")   return a.cost - b.cost;
    if(sortBy==="vel")    return a.vel < b.vel ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <Head title="Product Intelligence" sub="8 Categories · 55+ validated SKUs · Live margin data · Egypt demand signals"/>

      {/* Category Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:22, flexWrap:"wrap" }}>
        {PRODUCT_CATS.map(c=>(
          <button key={c.id} onClick={()=>setSel(c.id)} style={{
            padding:"8px 14px", borderRadius:4, fontSize:11, fontWeight:700,
            cursor:"pointer", border:`1px solid ${sel===c.id ? c.color : $.groove}`,
            background: sel===c.id ? `${c.color}18` : "transparent",
            color: sel===c.id ? c.color : $.stone,
            fontFamily:"monospace", letterSpacing:0.5, transition:"all 0.15s",
            display:"flex", alignItems:"center", gap:6,
          }}>
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Category Header */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { l:"Monthly Volume",  v:fmtE(cat.monthlyVolume), c:cat.color },
          { l:"Growth Rate",     v:`+${cat.growthPct}%`,    c:$.jade    },
          { l:"Portfolio Share", v:`${cat.allocated}%`,      c:$.goldHi  },
          { l:"SKUs Tracked",    v:cat.topSKUs.length,       c:$.sky     },
        ].map(k=>(
          <div key={k.l} style={{ background:$.well, borderRadius:8, padding:"16px 18px", borderLeft:`3px solid ${k.c}` }}>
            <Label ch={k.l}/>
            <Num v={k.v} c={k.c} size={20}/>
          </div>
        ))}
      </div>

      {/* Brand cloud */}
      <div style={{ background:$.well, borderRadius:8, padding:18, marginBottom:14, border:`1px solid ${$.seam}` }}>
        <Label ch="Sourced Brands"/>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {cat.brands.map(b=>(
            <span key={b} style={{ padding:"5px 12px", background:$.deep, borderRadius:4, fontSize:11, color:cat.color, border:`1px solid ${cat.color}30`, fontFamily:"monospace" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* SKU Table */}
      <div style={{ background:$.well, borderRadius:8, border:`1px solid ${$.seam}`, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:`1px solid ${$.groove}` }}>
          <Label ch={`SKU Intelligence · ${cat.topSKUs.length} products`}/>
          <div style={{ display:"flex", gap:6 }}>
            {[["margin","By Margin"],["cost","By Cost"],["vel","By Velocity"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setSortBy(id)} style={{ padding:"4px 10px", borderRadius:3, fontSize:9, fontWeight:700, cursor:"pointer", border:`1px solid ${sortBy===id ? cat.color : $.groove}`, background:sortBy===id ? `${cat.color}18`:"transparent", color:sortBy===id?cat.color:$.stone, fontFamily:"monospace", letterSpacing:1 }}>{lbl}</button>
            ))}
          </div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:$.deep }}>
              {["SKU","Brand","Source","DE Cost","Margin Range","Velocity","ROI Bar"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:9, color:$.stone, letterSpacing:2, fontFamily:"monospace", fontWeight:700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((sku,i)=>(
              <tr key={sku.sku} style={{ background:i%2===0?"transparent":$.deep+"80", borderBottom:`1px solid ${$.groove}` }}>
                <td style={{ padding:"11px 14px", fontSize:12, color:$.bone, fontWeight:600 }}>{sku.sku}</td>
                <td style={{ padding:"11px 14px" }}><Badge t={sku.brand} c={cat.color}/></td>
                <td style={{ padding:"11px 14px" }}><Badge t={sku.src} c={sku.src==="FR"?$.lav:$.sky}/></td>
                <td style={{ padding:"11px 14px" }}><Num v={`€${sku.cost}`} c={$.goldHi} size={13}/></td>
                <td style={{ padding:"11px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ height:5, width:`${Math.min(100,sku.mH/200*80)}px`, background:`linear-gradient(90deg,${cat.color}80,${cat.color})`, borderRadius:3, minWidth:8 }}/>
                    <Num v={`${sku.mL}–${sku.mH}%`} c={cat.color} size={12}/>
                  </div>
                </td>
                <td style={{ padding:"11px 14px", fontSize:11, color:sku.vel.includes("Extreme")?$.red:sku.vel.includes("Very")?$.amber:$.jade }}>{sku.vel}</td>
                <td style={{ padding:"11px 14px" }}>
                  <div style={{ height:6, width:"100%", background:$.groove, borderRadius:3 }}>
                    <div style={{ height:6, width:`${Math.min(100,(sku.mL+sku.mH)/2/200*100)}%`, background:cat.color, borderRadius:3 }}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:"12px 18px", background:$.deep, borderTop:`1px solid ${$.groove}` }}>
          <div style={{ fontSize:11, color:$.stone, fontStyle:"italic" }}>💡 {cat.note}</div>
        </div>
      </div>
    </div>
  );
}

// ─── PORTFOLIO BUILDER ────────────────────────────────────────────────────────
function PortfolioBuilder() {
  const [alloc, setAlloc] = useState({ dermo:35, serums:15, hair:20, baby:15, intimate:10, mens:10, body:5 });
  const total = Object.values(alloc).reduce((s,v)=>s+v,0);
  const baseOrder = 100000;

  return (
    <div>
      <Head title="Portfolio Builder" sub="Live mix optimizer · Adjust allocations · See margin impact instantly"/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>
        {/* Sliders */}
        <div>
          <div style={{ background:$.well, borderRadius:8, padding:22, marginBottom:14, border:`1px solid ${$.seam}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <Label ch="Category Allocation — Drag to Adjust"/>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"monospace", fontSize:12, color: total===100?$.jade:$.red, fontWeight:700 }}>TOTAL: {total}%</span>
                {total!==100 && <Badge t="REBALANCE NEEDED" c={$.red}/>}
                {total===100 && <Badge t="BALANCED" c={$.jade}/>}
              </div>
            </div>
            {PRODUCT_CATS.filter(c=>c.id!=="body"||true).map(cat=>{
              const a = alloc[cat.id]||0;
              const orderVal = Math.round(baseOrder*a/100);
              const estMargin = Math.round(orderVal * ((cat.topSKUs.reduce((s,x)=>(s+(x.mL+x.mH)/2),0)/cat.topSKUs.length)/100));
              return (
                <div key={cat.id} style={{ marginBottom:18, padding:"14px 16px", background:$.deep, borderRadius:6, border:`1px solid ${cat.color}20` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span>{cat.emoji}</span>
                      <span style={{ fontSize:12, color:cat.color, fontWeight:600 }}>{cat.label}</span>
                    </div>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:$.stone }}>Est. margin: <span style={{ color:$.jade }}>€{fmt(estMargin)}</span></span>
                      <span style={{ fontFamily:"monospace", fontSize:13, color:cat.color, fontWeight:700 }}>{a}% · €{fmt(orderVal)}</span>
                    </div>
                  </div>
                  <input type="range" min={0} max={60} step={1} value={a}
                    onChange={e=>setAlloc(p=>({...p,[cat.id]:Number(e.target.value)}))}
                    style={{ width:"100%", accentColor:cat.color, height:4 }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:$.well, borderRadius:8, padding:18, border:`1px solid ${$.seam}`, borderTop:`2px solid ${$.red}` }}>
            <Label ch="Portfolio Summary · €100K Order"/>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontFamily:"monospace", fontSize:11, color:$.stone, marginBottom:4 }}>Estimated Total Margin</div>
              <Num v={`€${fmt(PRODUCT_CATS.reduce((sum,cat)=>{
                const a = alloc[cat.id]||0;
                const orderVal = baseOrder*a/100;
                const avgM = cat.topSKUs.reduce((s,x)=>(s+(x.mL+x.mH)/2),0)/cat.topSKUs.length;
                return sum + orderVal*(avgM/100);
              },0))}`} c={$.goldHi} size={28}/>
            </div>
            <Divider c={$.gold}/>
            {PRODUCT_CATS.filter(c=>(alloc[c.id]||0)>0).map(cat=>{
              const a=alloc[cat.id]||0;
              const v=Math.round(baseOrder*a/100);
              const avgM=cat.topSKUs.reduce((s,x)=>(s+(x.mL+x.mH)/2),0)/cat.topSKUs.length;
              const m=Math.round(v*avgM/100);
              return (
                <div key={cat.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${$.groove}` }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span>{cat.emoji}</span>
                    <span style={{ fontSize:11, color:cat.color }}>{cat.label.split(" ")[0]}</span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"monospace", fontSize:11, color:$.bone }}>€{fmt(v)}</div>
                    <div style={{ fontFamily:"monospace", fontSize:9, color:$.jade }}>+€{fmt(m)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top performers */}
          <div style={{ background:$.well, borderRadius:8, padding:18, border:`1px solid ${$.seam}` }}>
            <Label ch="Highest Margin SKUs — Priority Stock"/>
            {PRODUCT_CATS.flatMap(c=>c.topSKUs.map(s=>({...s,catColor:c.color,catLabel:c.label}))).sort((a,b)=>b.mH-a.mH).slice(0,5).map((s,i)=>(
              <div key={i} style={{ padding:"8px 0", borderBottom:`1px solid ${$.groove}` }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, color:$.chalk }}>{s.sku}</span>
                  <Num v={`${s.mL}–${s.mH}%`} c={s.catColor} size={11}/>
                </div>
                <div style={{ fontSize:9, color:$.stone }}>{s.catLabel} · DE €{s.cost}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTROL PANEL ────────────────────────────────────────────────────────────
function ControlPanel() {
  const [imp, setImp] = useState(true);
  const [phase, setPhase] = useState("1");
  const [taxMode, setTaxMode] = useState("sole");
  const [vatFiling, setVatFiling] = useState("monthly");
  const [carriers, setCarriers] = useState({ dbSchenker:true, maersk:false, fastFreight:true, cargoExperts:true, dhl:false });
  const [agents, setAgents] = useState({ sourcing:true, deal:true, ops:true, finance:true, sales:true, marketing:true });
  const [budget, setBudget] = useState(4000);
  const [sellers, setSellers] = useState(20);
  const [minMargin, setMinMargin] = useState(50);

  const Toggle = ({ label, val, onChange, color=$.jade }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${$.groove}` }}>
      <span style={{ fontSize:12, color:$.chalk }}>{label}</span>
      <button onClick={()=>onChange(!val)} style={{ padding:"5px 16px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", border:`1px solid ${val?color:$.seam}`, background:val?`${color}20`:"transparent", color:val?color:$.stone, fontFamily:"monospace", letterSpacing:1, transition:"all 0.2s" }}>
        {val?"ON":"OFF"}
      </button>
    </div>
  );

  const Select = ({ label, val, onChange, opts }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${$.groove}` }}>
      <span style={{ fontSize:12, color:$.chalk }}>{label}</span>
      <div style={{ display:"flex", gap:4 }}>
        {opts.map(([v,l])=>(
          <button key={v} onClick={()=>onChange(v)} style={{ padding:"4px 10px", borderRadius:3, fontSize:9, fontWeight:700, cursor:"pointer", border:`1px solid ${val===v?$.red:$.seam}`, background:val===v?`${$.red}20`:"transparent", color:val===v?$.red:$.stone, fontFamily:"monospace", letterSpacing:1 }}>{l}</button>
        ))}
      </div>
    </div>
  );

  const Ctrl = ({ label, val, onChange, min, max, step, unit, color=$.gold }) => (
    <div style={{ padding:"12px 0", borderBottom:`1px solid ${$.groove}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:12, color:$.chalk }}>{label}</span>
        <Num v={unit==="€"?`€${fmt(val)}`:unit==="%"?`${val}%`:`${val} ${unit}`} c={color} size={13}/>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e=>onChange(Number(e.target.value))} style={{ width:"100%", accentColor:color, height:4 }}/>
    </div>
  );

  return (
    <div>
      <Head title="Control Panel" sub="Deep system configuration · Toggle any module · Override AI decisions · Live parameter control"/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        {/* Business Config */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}`, borderTop:`2px solid ${$.red}` }}>
          <Label ch="Business Configuration"/>
          <Toggle label="Middle Importer (α)" val={imp} onChange={setImp} color={$.lav}/>
          <Select label="Legal Structure" val={taxMode} onChange={setTaxMode} opts={[["sole","Sole Trader"],["gmbh","GmbH"]]}/>
          <Select label="VAT Filing Cycle" val={vatFiling} onChange={setVatFiling} opts={[["monthly","Monthly"],["quarterly","Quarterly"]]}/>
          <Select label="Logistics Phase" val={phase} onChange={setPhase} opts={[["1","Phase 1"],["2","Phase 2"],["3","Phase 3"]]}/>
          <Ctrl label="Starting Budget" val={budget} onChange={setBudget} min={1000} max={20000} step={500} unit="€" color={$.goldHi}/>
          <Ctrl label="Target Sellers" val={sellers} onChange={setSellers} min={5} max={100} step={5} unit="sellers"/>
          <Ctrl label="Minimum Margin Gate" val={minMargin} onChange={setMinMargin} min={20} max={80} step={5} unit="%" color={$.jade}/>
          <div style={{ marginTop:14, padding:12, background:$.deep, borderRadius:6 }}>
            <div style={{ fontSize:10, color:$.stone, marginBottom:4, fontFamily:"monospace" }}>ACTIVE CONFIG SUMMARY</div>
            <div style={{ fontFamily:"monospace", fontSize:11, color:$.chalk, lineHeight:1.8 }}>
              <div>Structure: <span style={{ color:$.gold }}>{taxMode==="sole"?"Einzelunternehmer":"GmbH Nürnberg"}</span></div>
              <div>Importer: <span style={{ color:imp?$.lav:$.jade }}>{imp?"ON (α > 0)":"OFF — Direct Source"}</span></div>
              <div>Phase: <span style={{ color:phase==="1"?$.sky:phase==="2"?$.gold:$.jade}}>Phase {phase} Logistics</span></div>
              <div>Min margin: <span style={{ color:$.jade }}>{minMargin}% gate</span></div>
            </div>
          </div>
        </div>

        {/* Agent Control */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}`, borderTop:`2px solid ${$.sky}` }}>
          <Label ch="AI Agent Network Control"/>
          {[
            ["sourcing","Sourcing Agent — Price Intel",$.sky],
            ["deal","Deal Agent — Margin Calc",$.lav],
            ["ops","Ops Agent — Logistics",$.jade],
            ["finance","Finance Agent — Cash/VAT",$.goldHi],
            ["sales","Sales Agent — Arabic Outreach",$.redHi],
            ["marketing","Marketing Agent — Content",$.amber],
          ].map(([k,l,c])=>(
            <Toggle key={k} label={l} val={agents[k]} onChange={v=>setAgents(p=>({...p,[k]:v}))} color={c}/>
          ))}
          <div style={{ marginTop:14, padding:12, background:$.deep, borderRadius:6 }}>
            <div style={{ fontFamily:"monospace", fontSize:11, color:$.chalk }}>
              Active: <span style={{ color:$.jade }}>{Object.values(agents).filter(Boolean).length}/6 agents online</span>
            </div>
            <div style={{ fontFamily:"monospace", fontSize:10, color:$.stone, marginTop:4 }}>
              Automation rate: ~{Math.round(Object.values(agents).filter(Boolean).length/6*92)}%
            </div>
          </div>
        </div>

        {/* Carrier Control */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}`, borderTop:`2px solid ${$.amber}` }}>
          <Label ch="Carrier & Logistics Control"/>
          {[
            ["fastFreight","Fast Freight Int. — Primary",$.jade],
            ["cargoExperts","Cargo Experts — Secondary",$.lav],
            ["dbSchenker","DB Schenker — B2B Backbone",$.sky],
            ["maersk","Maersk — Scale/FCL",$.amber],
            ["dhl","DHL — Urgent/Premium Only",$.gold],
          ].map(([k,l,c])=>(
            <Toggle key={k} label={l} val={carriers[k]} onChange={v=>setCarriers(p=>({...p,[k]:v}))} color={c}/>
          ))}
          <Divider c={$.amber}/>
          <div style={{ fontSize:10, color:$.stone, fontFamily:"monospace", lineHeight:1.8 }}>
            <div style={{ color:$.amber, marginBottom:4 }}>Phase {phase} Recommended:</div>
            {phase==="1" && <div style={{ color:$.chalk }}>Primary: DB Schenker (air)<br/>Backup: Fast Freight<br/>Urgent: DHL only</div>}
            {phase==="2" && <div style={{ color:$.chalk }}>Primary: Fast Freight (LCL)<br/>Backup: Cargo Experts<br/>Test: Maersk LCL</div>}
            {phase==="3" && <div style={{ color:$.chalk }}>Primary: Maersk FCL<br/>Negotiated: DB Schenker<br/>Premium: DHL only</div>}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div style={{ marginTop:14, background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
        <Label ch="System Health — All Components"/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {[
            { name:"n8n Workflows",   status:"OK",  count:"10/10", c:$.jade  },
            { name:"Claude API",      status:"OK",  count:"Active", c:$.jade },
            { name:"Wise API",        status:"OK",  count:"Live",   c:$.jade  },
            { name:"WhatsApp API",    status:"OK",  count:"Active", c:$.jade  },
            { name:"MarineTraffic",   status:"OK",  count:"Polling",c:$.jade  },
            { name:"Shopify Arabic",  status:"LIVE",count:"Shop",   c:$.jade  },
          ].map(s=>(
            <div key={s.name} style={{ padding:12, background:$.deep, borderRadius:6, textAlign:"center" }}>
              <Live c={s.c} size={6}/>
              <div style={{ fontSize:10, color:$.chalk, marginTop:6, fontWeight:600 }}>{s.name}</div>
              <div style={{ fontSize:9, color:s.c, fontFamily:"monospace", marginTop:3 }}>{s.status} · {s.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AUTOMATION OPS ───────────────────────────────────────────────────────────
function AutomationOps() {
  const [exp, setExp] = useState(null);
  const wfs = [
    { id:"WF-01", name:"Daily Price Scout",         trigger:"⏰ Cron 06:00", crit:true,  color:$.sky,
      steps:["Scrape Idealo + Geizhals for all 25+ priority SKUs across 8 categories","Compare vs Airtable baseline — flag any drop >5% per SKU","Claude API generates personalized RFQ email per supplier","Dispatch to 30+ supplier contacts via Gmail API batch","Log all prices to Airtable 'Price History' — chart trends","If Kérastase / The Ordinary drop >8% → URGENT alert to Telegram"],
      tools:"n8n + Claude API + Airtable + Gmail + Telegram", failsafe:"Email fallback if Gmail API rate-limited. Human alert if 0 results returned." },
    { id:"WF-02", name:"Seller Onboarding Pipeline", trigger:"📝 Form webhook", crit:true, color:$.gold,
      steps:["Receive seller application from Webflow/Shopify form","Claude scores lead 0–100: location, store type, volume, references","Score ≥60: auto-send Arabic WhatsApp package pitch","Score <60: queue in Notion manual review folder","Generate Paymob deposit link for selected package tier","Create seller CRM card in Notion with all enriched data","Activate WF-05 Arabic follow-up sequence immediately"],
      tools:"n8n + Claude + WhatsApp API + Paymob + Notion", failsafe:"Email pitch if WhatsApp fails. Score stored regardless for manual review." },
    { id:"WF-03", name:"Order → Fulfillment Chain",  trigger:"✅ Deal approved",crit:true, color:$.jade,
      steps:["Pull approved deal record from Airtable (status: approved)","Run WF-10 quality gate — all SKUs must pass EDA + margin ≥50%","Claude generates PO in German per supplier (template + live data)","Email all POs simultaneously via Gmail API","Book Fast Freight / DB Schenker consolidation slot via email","Generate commercial invoice + packing list PDF (Airtable → Claude → PDF)","EUR.1 certificate request email to IHK Nürnberg contact"],
      tools:"n8n + Claude + Airtable + Gmail + Make.com", failsafe:"Human alert if any PO not acknowledged in 24h. Fallback supplier list." },
    { id:"WF-04", name:"VAT Refund Engine",          trigger:"🔢 MRN confirmed",crit:true, color:$.lav,
      steps:["Log VAT amount paid to each German supplier in Airtable","Tag entry with shipment MRN + dispatch date + supplier ID","Monthly 8th: compile all VAT entries for period into summary","Generate UStVA data sheet for Steuerberater (formatted)","Email Steuerberater with summary + all supporting invoices","Monitor Wise API for refund arrival — alert on receipt","Auto-allocate refund to next month's stock purchase budget"],
      tools:"n8n + Airtable + Gmail + Wise API", failsafe:"Monthly reminder if no MRN logged within 7 days of ship date." },
    { id:"WF-05", name:"Arabic Follow-Up Sequence",  trigger:"👤 New lead",   crit:true, color:$.redHi,
      steps:["Day 0: Send opening Arabic WhatsApp pitch (personalized by category interest)","Day 3: If no reply → follow-up with product photo + margin range example","Day 7: Follow-up 2 — include estimated profit for their package tier","Day 14: Scarcity close: 'Only 2 slots remain in your city this month'","Day 15+: Archive to monthly newsletter. Mark cold in Notion CRM.","All touchpoints logged in Notion with timestamp + response status"],
      tools:"n8n + WhatsApp Business API + Claude + Notion", failsafe:"All messages logged. Dashboard shows stalled leads for human review." },
    { id:"WF-06", name:"Shipment Intelligence",       trigger:"🚢 BL issued",  crit:true, color:$.amber,
      steps:["Extract vessel name + voyage from Bill of Lading number","MarineTraffic API: poll vessel position every 6 hours","72h before Alexandria: alert Egyptian partner + customs broker","48h before: trigger ACID declaration reminder (broker must file)","On customs release: send balance invoice to partner","On delivery confirmed: trigger WF-07 (reorder cycle)"],
      tools:"n8n + MarineTraffic API + WhatsApp + Gmail", failsafe:"If API unavailable: manual vessel check alert to human. Broker CC'd on all alerts." },
    { id:"WF-07", name:"Reorder Intelligence",        trigger:"📅 Day 30",     crit:false, color:$.jade,
      steps:["Calculate days since last delivery for each seller","Day 25: WhatsApp nudge 'Stock running low? Reorder secured for your city'","Day 35: Escalate — partner makes personal call to seller","Calculate optimal next order size from sell-through velocity","Pre-build draft order in Notion with suggested package upgrade","If seller confirms → auto-route to WF-03 (new order cycle)"],
      tools:"n8n + WhatsApp + Notion + Airtable", failsafe:"If seller unreachable ×3 → alert human + partner for relationship check." },
    { id:"WF-08", name:"Cash Flow Guardian",          trigger:"⏰ Every 4h",   crit:true, color:$.red,
      steps:["Pull EUR balance via Wise Business API","Pull all pending outgoing invoices from Airtable","Calculate: balance − pending payments − VAT float − 30% tax reserve","Update Notion dashboard KPIs in real time","If net available < €5,000: Telegram URGENT + email alert","If net available < €2,000: Auto-pause all non-critical spending in system"],
      tools:"n8n + Wise API + Airtable + Notion + Telegram", failsafe:"SMS alert as last resort if Telegram fails. Bank app manual check reminder." },
    { id:"WF-09", name:"Social Content Engine",       trigger:"⏰ Daily 09:00",crit:false, color:$.lav,
      steps:["Pull today's scheduled content slot from Notion calendar","Claude generates native Arabic caption + relevant hashtags","Select product category hero SKU — request Canva API image","Canva API generates branded product image with overlay","Buffer schedules to Instagram + TikTok at optimal Egyptian time","Next day: pull analytics, log engagement to Airtable for optimization"],
      tools:"n8n + Claude + Canva API + Buffer + Instagram API", failsafe:"Pre-built image library if Canva API unavailable. Buffer queue as backup." },
    { id:"WF-10", name:"Quality & Compliance Gate",   trigger:"🔒 Pre-order",  crit:true, color:$.red,
      steps:["Check EDA registration status for every ordered SKU in Airtable","Verify supplier reliability rating ≥4.0/5.0","Confirm product expiry >18 months remaining on batch","Calculate all-in landed margin: must be ≥ configured minimum (default 50%)","If ALL pass: auto-approve → route to OpsAgent (WF-03)","If ANY fail: BLOCK order + create human review task + notify team"],
      tools:"n8n + Airtable + Claude", failsafe:"Any single failure blocks entire order. Blocked orders cannot bypass without human override code." },
  ];

  return (
    <div>
      <Head title="Automation Engine" sub="10 production workflows · 92% autonomy · n8n + GitHub versioned · Fail-safe on every step"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
        {[["Workflows","10/10",$.jade],["Automation","92%",$.gold],["Daily Tasks","~340",$.sky],["Human Touches","8%",$.lav],["MTTR","<5 min",$.amber]].map(([l,v,c])=>(
          <div key={l} style={{ background:$.well, borderRadius:8, padding:"14px 16px", textAlign:"center", borderBottom:`2px solid ${c}` }}>
            <Label ch={l}/>
            <Num v={v} c={c} size={20}/>
          </div>
        ))}
      </div>
      {wfs.map((wf,i)=>(
        <div key={wf.id} style={{ borderRadius:8, overflow:"hidden", marginBottom:8, border:`1px solid ${exp===i?wf.color+"50":$.groove}` }}>
          <div onClick={()=>setExp(exp===i?null:i)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", background:$.well, cursor:"pointer", borderLeft:`3px solid ${wf.color}` }}>
            <span style={{ fontFamily:"monospace", fontSize:10, color:wf.color, fontWeight:700, width:52 }}>{wf.id}</span>
            <span style={{ fontFamily:"'DM Serif Display','Georgia',serif", fontSize:15, color:$.bone, flex:1, letterSpacing:0.3 }}>{wf.name}</span>
            <span style={{ fontFamily:"monospace", fontSize:10, color:$.stone }}>{wf.trigger}</span>
            {wf.crit && <Badge t="CRITICAL" c={$.red}/>}
            <span style={{ color:$.stone, fontSize:11 }}>{exp===i?"▲":"▼"}</span>
          </div>
          {exp===i && (
            <div style={{ padding:"16px 22px 20px", background:$.deep, display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
              <div>
                <Label ch="Step-by-Step Execution"/>
                {wf.steps.map((s,j)=>(
                  <div key={j} style={{ display:"flex", gap:12, marginBottom:10 }}>
                    <div style={{ width:24, height:24, borderRadius:4, background:`${wf.color}18`, border:`1px solid ${wf.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:wf.color, fontWeight:700, flexShrink:0, fontFamily:"monospace" }}>{j+1}</div>
                    <span style={{ fontSize:12, color:$.chalk, paddingTop:3, lineHeight:1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ padding:14, background:$.well, borderRadius:6 }}>
                  <Label ch="Tools Stack"/>
                  <div style={{ fontSize:11, color:$.sky }}>{wf.tools}</div>
                </div>
                <div style={{ padding:14, background:$.well, borderRadius:6, border:`1px solid ${$.amber}30` }}>
                  <Label ch="Fail-Safe Mechanism"/>
                  <div style={{ fontSize:11, color:$.amber }}>{wf.failsafe}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── FINANCE SYSTEM ───────────────────────────────────────────────────────────
function FinanceSystem() {
  const t = useTick(3000);
  const cashPos = 68400 + Math.sin(t*0.3)*800;
  const vatPending = 14212;
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar"];
  const revenues = [72000,85000,96000,106000,130000,160000];
  const profits  = [14400,19550,22080,30983,35428,44882];
  const maxR = Math.max(...revenues);

  return (
    <div>
      <Head title="Finance System" sub="Cash flow · VAT engine · P&L live · Tax calendar · Nürnberg specifics"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { l:"Cash Buffer",    v:fmtE(cashPos),   c:$.jade,    live:true,  sub:"Wise Business EUR" },
          { l:"VAT Pending",    v:fmtE(vatPending),c:$.sky,     live:false, sub:"Finanzamt ETA 72h"  },
          { l:"Tax Reserve",    v:"€20,691",        c:$.goldHi,  live:false, sub:"30% of MTD profit"  },
          { l:"Monthly Profit", v:"€30,983",        c:$.red,     live:false, sub:"Net after tax"      },
        ].map(k=>(
          <div key={k.l} style={{ background:$.well, borderRadius:8, padding:"16px 18px", borderLeft:`3px solid ${k.c}` }}>
            <Label ch={k.l}/>
            <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
              {k.live && <Live c={k.c} size={5}/>}
              <Num v={k.v} c={k.c} size={20}/>
            </div>
            <div style={{ fontSize:10, color:$.stone, marginTop:4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        {/* Revenue Chart */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
          <Label ch="Revenue & Profit — 6 Month Trajectory"/>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140, marginTop:10 }}>
            {months.map((m,i)=>(
              <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ fontSize:8, color:$.stone, fontFamily:"monospace" }}>{fmtE(profits[i])}</div>
                <div style={{ width:"100%", display:"flex", gap:2 }}>
                  <div style={{ flex:1, height:`${revenues[i]/maxR*110}px`, background:$.sky+"40", borderRadius:"2px 2px 0 0" }}/>
                  <div style={{ flex:1, height:`${profits[i]/maxR*110}px`, background:$.jade, borderRadius:"2px 2px 0 0" }}/>
                </div>
                <div style={{ fontSize:9, color:$.stone }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:14, marginTop:8 }}>
            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
              <div style={{ width:10, height:10, background:$.sky+"40", borderRadius:2 }}/>
              <span style={{ fontSize:9, color:$.stone }}>Revenue</span>
            </div>
            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
              <div style={{ width:10, height:10, background:$.jade, borderRadius:2 }}/>
              <span style={{ fontSize:9, color:$.stone }}>Profit</span>
            </div>
          </div>
        </div>

        {/* Nürnberg Tax */}
        <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
          <Label ch="Nürnberg Tax Architecture"/>
          {[
            { item:"Gewerbesteuer Hebesatz",  val:"467%",    note:"Above DE avg (380%). Budget accordingly.", c:$.red    },
            { item:"Effective Trade Tax",      val:"~16.3%",  note:"On trading profit. Nürnberg-specific.",   c:$.amber  },
            { item:"Income Tax (Sole Trader)", val:"14–45%",  note:"Progressive on net profit.",              c:$.goldHi },
            { item:"GmbH Corporate Tax",       val:"~30%",    note:"Flat after GmbH formation (Month 5).",   c:$.jade   },
            { item:"Export VAT Rate",          val:"0%",      note:"On all EU→Egypt exports. Zero-rated.",   c:$.jade   },
            { item:"VAT on Purchases",         val:"19%",     note:"Fully recoverable. €14K per €100K order.",c:$.sky   },
            { item:"IHK Membership",           val:"€150/yr", note:"Mandatory. Issues EUR.1 certificates.",  c:$.stone  },
            { item:"EUR.1 Certificate",        val:"€25–50",  note:"Per shipment. Saves 20-30% Egypt duty.", c:$.goldHi },
          ].map(r=>(
            <div key={r.item} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${$.groove}` }}>
              <div><div style={{ fontSize:11, color:$.chalk }}>{r.item}</div><div style={{ fontSize:9, color:$.stone }}>{r.note}</div></div>
              <Num v={r.val} c={r.c} size={12}/>
            </div>
          ))}
        </div>
      </div>

      {/* VAT Calendar */}
      <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
        <Label ch="Annual Compliance Calendar — Nürnberg"/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
          {[
            { d:"10th monthly", t:"UStVA Filing", type:"VAT",   c:$.sky  },
            { d:"Q1 Apr 10",    t:"Income Tax Q1",type:"Tax",   c:$.amber},
            { d:"Q2 Jul 10",    t:"Income Tax Q2",type:"Tax",   c:$.amber},
            { d:"Q3 Oct 10",    t:"Income Tax Q3",type:"Tax",   c:$.amber},
            { d:"Q4 Jan 10",    t:"Income Tax Q4",type:"Tax",   c:$.amber},
            { d:"May 31",       t:"Annual Return", type:"Annual",c:$.red  },
          ].map(c=>(
            <div key={c.t} style={{ padding:12, background:$.deep, borderRadius:6, borderTop:`2px solid ${c.c}`, textAlign:"center" }}>
              <Badge t={c.type} c={c.c}/>
              <div style={{ fontSize:12, color:$.chalk, margin:"8px 0 4px", fontWeight:600 }}>{c.t}</div>
              <div style={{ fontSize:10, color:$.stone, fontFamily:"monospace" }}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TECH STACK ───────────────────────────────────────────────────────────────
function TechStack() {
  const layers = [
    { layer:"AI INTELLIGENCE", color:$.red, tools:[
      { n:"Claude API (Sonnet 4.6)",    role:"Core LLM — reasoning, Arabic, docs, analysis, negotiation",    cost:"~€20/mo",  rating:5 },
      { n:"n8n Cloud",                  role:"Primary automation — 10 workflows, all critical ops",            cost:"€20/mo",   rating:5 },
      { n:"Make.com",                   role:"Secondary — complex multi-step flows, API bridges",             cost:"€10/mo",   rating:4 },
      { n:"Perplexity Pro",             role:"Real-time market research, competitor monitoring",               cost:"€20/mo",   rating:4 },
    ]},
    { layer:"DATA & OPERATIONS", color:$.sky, tools:[
      { n:"Airtable Team",              role:"Structured DB — SKUs, orders, suppliers, VAT, sellers",         cost:"€20/mo",   rating:5 },
      { n:"Notion AI Plus",             role:"CRM, knowledge base, documents, dashboards",                    cost:"€16/mo",   rating:4 },
      { n:"GitHub",                     role:"Workflow versioning, script backup, automation code",            cost:"€0/mo",    rating:5 },
      { n:"Retool (Phase 3+)",          role:"Custom executive dashboard with live API data + actions",       cost:"€10/mo",   rating:5 },
    ]},
    { layer:"COMMERCE & PAYMENT", color:$.jade, tools:[
      { n:"Shopify Basic + Arabic RTL", role:"B2C Arabic store — products, checkout, subscriptions",          cost:"€49/mo",   rating:5 },
      { n:"Webflow Starter",            role:"B2B site — seller acquisition, trust building",                  cost:"€14/mo",   rating:4 },
      { n:"Wise Business",              role:"Primary banking — SWIFT, EUR, multi-currency, API",             cost:"Fees only",rating:5 },
      { n:"Paymob Egypt",               role:"EGP collection — cards, wallets, installments, Fawry",         cost:"Tx fees",   rating:4 },
    ]},
    { layer:"COMMUNICATION", color:$.gold, tools:[
      { n:"WhatsApp Business API",      role:"Arabic seller outreach, follow-up sequences, support",          cost:"€50/mo",   rating:5 },
      { n:"Buffer + Canva API",         role:"Social scheduling + Arabic image generation",                   cost:"€19/mo",   rating:4 },
      { n:"Telegram Bot",               role:"Personal critical alerts, urgent notifications",                cost:"€0/mo",    rating:5 },
      { n:"Gmail API",                  role:"Supplier RFQs, document delivery, batch operations",            cost:"€0/mo",    rating:5 },
    ]},
  ];

  return (
    <div>
      <Head title="Technology Stack" sub="No-code first · AI-native · Scalable · All tools justified with cost + trade-offs"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {layers.map(layer=>(
          <div key={layer.layer} style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}`, borderTop:`2px solid ${layer.color}` }}>
            <Label ch={layer.layer}/>
            {layer.tools.map(tool=>(
              <div key={tool.n} style={{ padding:"10px 0", borderBottom:`1px solid ${$.groove}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, color:layer.color, fontWeight:600 }}>{tool.n}</span>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontFamily:"monospace", fontSize:10, color:$.goldHi }}>{tool.cost}</span>
                    <span style={{ fontSize:10 }}>{"★".repeat(tool.rating)}<span style={{ color:$.groove }}>{"★".repeat(5-tool.rating)}</span></span>
                  </div>
                </div>
                <div style={{ fontSize:11, color:$.stone }}>{tool.role}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop:14, background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}` }}>
        <Label ch="Total Monthly Stack Cost"/>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div>
            <Num v="~€238/month" c={$.goldHi} size={28}/>
            <div style={{ fontSize:11, color:$.stone, marginTop:4 }}>All tools combined · AI + automation + commerce + communications</div>
          </div>
          <div style={{ width:1, height:50, background:$.groove }}/>
          <div style={{ fontSize:12, color:$.chalk, lineHeight:1.8 }}>
            Equivalent human team cost: <span style={{ color:$.red }}>€8,000–15,000/month</span><br/>
            AI stack saves: <span style={{ color:$.jade }}>€7,762–14,762/month</span><br/>
            Payback on first deal: <span style={{ color:$.gold }}>Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP ──────────────────────────────────────────────────────────────────
function Roadmap() {
  const [exp, setExp] = useState(0);
  const phases = [
    { p:"Phase 1", t:"Foundation", wks:"Weeks 1–4", c:$.sky,
      deliverables:["Gewerbeanmeldung + IHK Nürnberg registered","Wise Business + Revolut accounts + APIs live","Webflow B2B site deployed (Day 3)","Shopify Arabic store live (Day 7)","Claude API + n8n all 10 workflows active","WhatsApp Business API configured","First 20 seller deposits collected","EUR.1 certificates obtained","First supplier POs placed","WF-01 Price Scout live"],
      tools:["Ordnungsamt Nürnberg","IHK Nürnberg (EUR.1)","Wise + Revolut","Webflow + Shopify","n8n Cloud + Claude API","WhatsApp Business Meta"],
      risks:["USt-IdNr 4-6 week delay → use Kleinunternehmer","Seller deposits insufficient → start 10 not 20","Supplier MOQ not met → overstock dealers"],
      deps:["Gewerbeanmeldung before Wise account","Claude API before n8n workflows","EDA list from partner before any sourcing"] },
    { p:"Phase 2", t:"System Build", wks:"Weeks 5–10", c:$.gold,
      deliverables:["First shipment dispatched via Fast Freight + cleared","All 10 workflows running autonomously","VAT refund filed (WF-04)","Shopify: 50+ orders","20 sellers active + reordering","Month 1 P&L reconciled and validated","Cash Flow Guardian live 24/7","Fast Freight + Cargo Experts both tested"],
      tools:["Fast Freight International (primary)","DB Schenker (backup)","MarineTraffic API (WF-06)","Airtable full data model","ELSTER + Steuerberater"],
      risks:["First customs clearance — broker on standby","WF failure — GitHub backups mandatory","Seller payment delay — contract clauses active"],
      deps:["EDA verified SKUs before first order","EUR.1 cert before shipping","ACID system access for customs broker"] },
    { p:"Phase 3", t:"Automation Integration", wks:"Weeks 11–16", c:$.jade,
      deliverables:["Libya + Jordan market (15 sellers)","GmbH Nürnberg formation initiated","Retool executive dashboard live","Monthly revenue: €160K+","Reorder rate >65%","VA Egypt hired (Arabic, €600/mo)","White-label SKU quoted","50+ sellers active","Automation confirmed: 90%+"],
      tools:["GmbH Notar Nürnberg","Retool (custom dashboard)","Upwork (VA hire)","Make.com advanced flows","Partner expansion network"],
      risks:["GmbH formation delay","VA quality — trial period","Multi-market coordination complexity"],
      deps:["GmbH before white-label brand filing","Retool after Airtable data stable","VA after operations manual complete"] },
    { p:"Phase 4", t:"Scale & Optimize", wks:"Weeks 17+", c:$.lav,
      deliverables:["Saudi Arabia market entry","Maersk FCL containers (sea phase)","First white-label SKU launched","Franchise model live","Physical Cairo store","Annual run rate: €800K+","All 6 agents fully autonomous","Exclusivity: 3 brand agreements"],
      tools:["Maersk Direct FCL","German contract manufacturers","Cairo commercial RE","Legal counsel (franchise)","Full AI agent network mature"],
      risks:["Saudi SFDA registration 3–12 months","White-label manufacturing QC","Physical store operational complexity"],
      deps:["Saudi agent before market entry","White-label brand registered in Egypt","Franchise legal template before launch"] },
  ];

  return (
    <div>
      <Head title="16-Week Execution Roadmap" sub="Phased deployment · Dependencies mapped · Risk-aware sequencing · Zero ambiguity"/>
      {phases.map((ph,i)=>(
        <div key={ph.p} style={{ borderRadius:8, overflow:"hidden", marginBottom:10, border:`1px solid ${exp===i?ph.c+"40":$.groove}` }}>
          <div onClick={()=>setExp(exp===i?null:i)} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 22px", background:$.well, cursor:"pointer", borderLeft:`4px solid ${ph.c}` }}>
            <div style={{ width:60, textAlign:"center", padding:"4px 0", background:`${ph.c}18`, borderRadius:4 }}>
              <div style={{ fontFamily:"monospace", fontSize:9, color:ph.c, letterSpacing:1 }}>{ph.p}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'DM Serif Display','Georgia',serif", fontSize:18, color:ph.c, letterSpacing:0.3 }}>{ph.t}</div>
              <div style={{ fontSize:11, color:$.stone, fontFamily:"monospace" }}>{ph.wks}</div>
            </div>
            <Badge t={`${ph.deliverables.length} deliverables`} c={ph.c}/>
            <span style={{ color:$.stone, fontSize:11 }}>{exp===i?"▲":"▼"}</span>
          </div>
          {exp===i && (
            <div style={{ padding:"18px 22px 22px", background:$.deep, display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16 }}>
              {[["Deliverables",ph.deliverables,$.jade],["Tools",ph.tools,$.sky],["Risks",ph.risks,$.amber],["Dependencies",ph.deps,$.lav]].map(([h,items,c])=>(
                <div key={h}>
                  <Label ch={h}/>
                  {items.map((item,j)=>(
                    <div key={j} style={{ fontSize:11, color:$.chalk, marginBottom:6, paddingLeft:8, borderLeft:`2px solid ${c}40`, lineHeight:1.5 }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MANUALS ──────────────────────────────────────────────────────────────────
function Manuals() {
  const [sel, setSel] = useState("daily");
  const manualsData = {
    daily: { title:"Daily Operations Manual", color:$.jade, steps:[
      { n:"01", title:"Morning Briefing (10 min)", steps:["Open Active Brain dashboard — review overnight alerts","Check Wise balance vs €5K minimum threshold","Review 3 AI insights from Brain feed","Approve any flagged deals >€50K in Airtable queue"], tools:"Notion/Retool Dashboard · Wise App · Telegram", chk:"Any critical alerts? Cash OK? Deals pending?", out:"Day cleared. All automation running. Human is informed." },
      { n:"02", title:"Seller Pipeline (5 min)",   steps:["Review new applications auto-scored by WF-02","Confirm deposits received in Wise (auto-logged by WF-08)","Review any stalled leads at Day 14 in WF-05 queue","Approve geographic exclusivity for new city requests"], tools:"Notion CRM · Wise App · n8n WF-05 status", chk:"Manual intervention needed in pipeline?", out:"Pipeline active. Deposits confirmed. Follow-ups running." },
      { n:"03", title:"Shipment Check (5 min)",    steps:["WF-06 auto-tracks — review exceptions only in Telegram","Confirm ACID filed if vessel <48h from Alexandria","Approve any customs hold escalation if flagged red","Review partner delivery confirmations in Notion log"], tools:"Telegram alerts · MarineTraffic · Notion log", chk:"ACID filed? Customs issues? Delivery confirmed?", out:"All shipments tracked. Zero surprises." },
      { n:"04", title:"Evening Close (5 min)",     steps:["Review automated P&L update (WF-08 generated)","Confirm 30% tax reserve transferred to Wise sub-account","Approve tomorrow's social content in Buffer queue","Log one strategic observation in Notion Brain log"], tools:"Notion P&L · Wise tax account · Buffer", chk:"Tax reserve correct? Content approved?", out:"Day closed. System autonomous overnight." },
    ]},
    import: { title:"Import/Export Operations", color:$.sky, steps:[
      { n:"01", title:"SKU Verification & EDA Check", steps:["Request EDA registration list from Egyptian partner","Cross-reference all planned SKUs against list in Airtable","Unregistered SKU: WF-10 hard-blocks from PO — ZERO exceptions","Request MSDS sheets from German supplier for each SKU"], tools:"Airtable EDA DB · n8n WF-10 · Partner WhatsApp", chk:"100% of SKUs EDA-confirmed? MSDS stored?", out:"Zero customs-rejected products. Clean order cleared for placement." },
      { n:"02", title:"Supplier Order & EUR.1",       steps:["DealAgent margin check ≥50% for all SKUs","Claude generates PO in German per supplier (WF-03)","Email all POs simultaneously via n8n","Apply to IHK Nürnberg for EUR.1 certificates (3-5 days)"], tools:"n8n WF-03 · Claude API · IHK Nürnberg export desk", chk:"All POs acknowledged? EUR.1 applied before ship date?", out:"Active purchase orders. EUR.1 to save partner €20K+ in duties." },
      { n:"03", title:"Customs Clearance Egypt",     steps:["Send full doc package to Cargo Experts broker 72h before arrival","WF-06 auto-triggers ACID reminder at 48h","Monitor vessel via MarineTraffic in WF-06","Customs hold: escalate immediately — human + broker call"], tools:"n8n WF-06 · MarineTraffic API · Cargo Experts Cairo", chk:"ACID filed? All docs received? Clearance confirmed?", out:"Zero-delay clearance. EUR.1 duty reduction applied." },
    ]},
    financial: { title:"Financial Management", color:$.goldHi, steps:[
      { n:"01", title:"Monthly VAT Return Cycle",  steps:["WF-04 compiles all input VAT entries (Airtable) monthly","Verify every MRN number documented per shipment","Steuerberater receives summary by 8th of month","ELSTER UStVA filed by 10th","Monitor Wise API for refund arrival (4–8 weeks)"], tools:"Airtable VAT log · n8n WF-04 · ELSTER · Steuerberater", chk:"All MRNs present? VAT amounts vs invoices match?", out:"€14,212 VAT refund per €100K cycle. Reinvested to M2 stock." },
      { n:"02", title:"Cash Flow & Tax Reserve",   steps:["WF-08 monitors Wise balance every 4 hours automatically","30% of every profit payment → tax reserve sub-account (auto)","Quarterly: calculate and pay Gewerbesteuer prepayment","Monthly: reconcile actual vs forecasted cash position"], tools:"Wise API · n8n WF-08 · Revolut FX hedging", chk:"Reserve ≥30% of profit? Buffer >€5K?", out:"Zero cash surprises. Tax prepayments never missed." },
    ]},
  };
  const m = manualsData[sel];

  return (
    <div>
      <Head title="Operational Manuals" sub="Step-by-step execution · Tools used · Decision checkpoints · Expected outputs"/>
      <div style={{ display:"flex", gap:8, marginBottom:22 }}>
        {Object.entries(manualsData).map(([k,v])=>(
          <button key={k} onClick={()=>setSel(k)} style={{ padding:"8px 18px", borderRadius:4, fontSize:11, fontWeight:700, cursor:"pointer", border:`1px solid ${sel===k?v.color:$.groove}`, background:sel===k?`${v.color}18`:"transparent", color:sel===k?v.color:$.stone, fontFamily:"monospace", letterSpacing:0.5 }}>
            {v.title.split(" ")[0]} {v.title.split(" ")[1]}
          </button>
        ))}
      </div>
      <div style={{ fontFamily:"'DM Serif Display','Georgia',serif", fontSize:22, color:m.color, marginBottom:18, letterSpacing:0.3 }}>{m.title}</div>
      {m.steps.map(step=>(
        <div key={step.n} style={{ background:$.well, borderRadius:8, marginBottom:10, border:`1px solid ${$.seam}`, overflow:"hidden" }}>
          <div style={{ display:"flex", gap:14, padding:"14px 18px", borderBottom:`1px solid ${$.groove}`, alignItems:"center" }}>
            <div style={{ width:32, height:32, borderRadius:6, background:`${m.color}18`, border:`1px solid ${m.color}35`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:"monospace", fontSize:12, color:m.color, fontWeight:700 }}>{step.n}</span>
            </div>
            <span style={{ fontFamily:"'DM Serif Display','Georgia',serif", fontSize:16, color:$.bone, letterSpacing:0.3 }}>{step.title}</span>
          </div>
          <div style={{ padding:"16px 18px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16 }}>
            {[["Steps",step.steps.map((s,i)=>`${i+1}. ${s}`),$.chalk],["Tools",[step.tools],$.sky],["Decision Checkpoint",[step.chk],$.amber],["Expected Output",[step.out],$.jade]].map(([h,items,c])=>(
              <div key={h}>
                <Label ch={h}/>
                {items.map((item,i)=><div key={i} style={{ fontSize:11, color:c, marginBottom:5, lineHeight:1.5 }}>{item}</div>)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MARKETING ENGINE ─────────────────────────────────────────────────────────
function MarketingEngine() {
  return (
    <div>
      <Head title="Marketing Engine" sub="Lead generation · Arabic funnels · Luxury brand positioning · Revenue flywheel"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        {[["ATTRACT","Blue","Organic + Paid",$.sky],["CAPTURE","Purple","Lead Systems",$.lav],["CONVERT","Gold","Sales Close",$.gold],["RETAIN","Green","LTV Engine",$.jade]].map(([s,,d,c])=>(
          <div key={s} style={{ background:$.well, borderRadius:8, padding:16, borderTop:`3px solid ${c}`, textAlign:"center" }}>
            <Label ch={s}/>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:c }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:14 }}>
        {[
          { stage:"ATTRACT", c:$.sky, items:["Arabic Instagram Reels (beauty tutorials + unboxing)","TikTok organic: 'Made in Germany' story content","SEO: 'German cosmetics wholesale Egypt'","Egyptian beauty micro-influencers €50-200/post","YouTube Arabic channel (product reviews, education)","Google Arabic search ads for high-intent terms"] },
          { stage:"CAPTURE", c:$.lav, items:["Seller application form → WF-02 auto-score","WhatsApp click-to-chat on all pages","Lead magnet: 'Top 10 DE Cosmetics for Egypt Market'","Facebook Messenger Arabic FAQ bot","Instagram DM automation for product inquiries","Shopify email capture with Arabic coupon offer"] },
          { stage:"CONVERT", c:$.gold, items:["WF-05: 4-touch Arabic follow-up D0/3/7/14","Geographic exclusivity close (scarcity real)","Deposit link auto-generated (Paymob)","Social proof: '20 Egyptian sellers trust us'","EUR.1 certificate — saves seller €20K in duties","Package upgrade offer at Day 7 touchpoint"] },
          { stage:"RETAIN", c:$.jade, items:["Day 30 reorder nudge (WF-07 automated)","Loyalty: 3 orders → free shipping 4th","SKU performance weekly report to each seller","Exclusive early access to new SKU launches","Referral bonus: introduce another seller = discount","Monthly 'bestsellers in Egypt' insight report"] },
        ].map(s=>(
          <div key={s.stage} style={{ background:$.well, borderRadius:8, padding:18, border:`1px solid ${$.seam}` }}>
            <Label ch={s.stage}/>
            {s.items.map((item,i)=>(
              <div key={i} style={{ fontSize:11, color:$.chalk, padding:"5px 0", borderBottom:`1px solid ${$.groove}`, paddingLeft:8, borderLeft:`2px solid ${s.c}40` }}>{item}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Brand Positioning */}
      <div style={{ background:$.well, borderRadius:8, padding:20, border:`1px solid ${$.seam}`, borderTop:`2px solid ${$.red}` }}>
        <Label ch="Luxury Brand Positioning Strategy"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
          {[
            { pillar:"Authenticity Signal", desc:"EUR.1 Certificate displayed prominently on website, packaging, and all seller materials. German Chamber of Commerce seal. 'Sourced in Nürnberg, Germany' in every Arabic communication.", c:$.gold },
            { pillar:"Premium Positioning", desc:"German precision + quality is your luxury signal. Never compete on price. Compete on authenticity, reliability, and the trust that German brands carry in the Arab market. '100% Original — Direct from Germany'.", c:$.sky },
            { pillar:"Scarcity + Exclusivity", desc:"Geographic exclusivity per seller is genuinely scarce and real. 'You are the only authorized reseller of German cosmetics in Maadi' is a powerful luxury positioning. Sellers will pay premium for this.", c:$.lav },
          ].map(p=>(
            <div key={p.pillar} style={{ padding:16, background:$.deep, borderRadius:6, borderTop:`2px solid ${p.c}` }}>
              <div style={{ fontSize:13, color:p.c, fontWeight:600, marginBottom:8 }}>{p.pillar}</div>
              <div style={{ fontSize:11, color:$.chalk, lineHeight:1.7 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ActiveBrainV5() {
  const [view, setView] = useState("command");

  const pages = {
    command:    <WarRoom/>,
    brain:      <WarRoom/>,
    products:   <ProductCats/>,
    portfolio:  <PortfolioBuilder/>,
    control:    <ControlPanel/>,
    logistics:  <AutomationOps/>,
    automation: <AutomationOps/>,
    finance:    <FinanceSystem/>,
    marketing:  <MarketingEngine/>,
    stack:      <TechStack/>,
    roadmap:    <Roadmap/>,
    manuals:    <Manuals/>,
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:$.ink, overflow:"hidden", fontFamily:"system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Roboto+Mono:wght@400;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; background:${$.ink}; }
        ::-webkit-scrollbar-thumb { background:${$.groove}; border-radius:2px; }
        @keyframes blink {
          0%,100% { opacity:1; box-shadow:0 0 8px currentColor; }
          50%      { opacity:0.4; box-shadow:0 0 3px currentColor; }
        }
        input[type=range] { height:4px; cursor:pointer; }
        button { font-family:inherit; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ width:220, background:$.night, borderRight:`1px solid ${$.groove}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        {/* Brand */}
        <div style={{ padding:"22px 18px 18px", borderBottom:`1px solid ${$.groove}` }}>
          <div style={{ fontFamily:"'DM Serif Display','Georgia',serif", fontSize:20, color:$.bone, letterSpacing:0.5, marginBottom:2 }}>Active Brain</div>
          <div style={{ fontFamily:"monospace", fontSize:8, color:$.stone, letterSpacing:2.5, textTransform:"uppercase" }}>Autonomous OS · v5.0</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12, padding:"6px 10px", background:$.deep, borderRadius:4, border:`1px solid ${$.jade}25` }}>
            <Live c={$.jade} size={5}/>
            <span style={{ fontFamily:"monospace", fontSize:9, color:$.jade, letterSpacing:1.5 }}>92% AUTONOMOUS</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6, padding:"6px 10px", background:$.deep, borderRadius:4, border:`1px solid ${$.red}25` }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:$.red }}/>
            <span style={{ fontFamily:"monospace", fontSize:9, color:$.red, letterSpacing:1.5 }}>WAR ROOM ACTIVE</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {VIEWS.map(v=>(
            <div key={v.id} onClick={()=>setView(v.id)} style={{
              padding:"10px 18px", cursor:"pointer",
              borderLeft:`2px solid ${view===v.id?$.red:"transparent"}`,
              background:view===v.id?`${$.red}08`:"transparent",
              transition:"all 0.12s",
            }}>
              <div style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, letterSpacing:1, color:view===v.id?$.bone:$.stone }}>{v.label}</div>
              <div style={{ fontSize:9, color:$.dust, marginTop:1, letterSpacing:0.5 }}>{v.sub}</div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${$.groove}` }}>
          <div style={{ fontFamily:"monospace", fontSize:8, color:$.dust }}>Nürnberg · Bayern · Germany</div>
          <div style={{ fontFamily:"monospace", fontSize:8, color:$.dust, marginTop:2 }}>OS v1+v2+v3+Logistics synthesized</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, overflowY:"auto", padding:32, background:$.ink }}>
        {pages[view] || <WarRoom/>}
      </div>
    </div>
  );
}
