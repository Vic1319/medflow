import { useState, useEffect, useCallback } from "react";
function useIsMobile(bp=768){const[m,setM]=useState(()=>typeof window!=="undefined"?window.innerWidth<bp:false);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
const T={cyan:"#00B4D8",cyanDim:"#CAF0F8",blue:"#0077B6",blueDark:"#023E8A",navy:"#03045E",bg:"#F0F7FF",surface:"#FFFFFF",surfaceAlt:"#F8FBFF",border:"#DDEEFF",borderMid:"#B8D4EE",success:"#059669",successBg:"#ECFDF5",warning:"#D97706",warningBg:"#FFFBEB",danger:"#DC2626",dangerBg:"#FEF2F2",purple:"#7C3AED",purpleBg:"#F5F3FF",ink:"#0A1628",inkMid:"#3D5A80",inkLight:"#7A93B0",inkFaint:"#A8C0D6",r8:"8px",r12:"12px",r16:"16px",r24:"24px",rFull:"9999px",shadowSm:"0 1px 3px rgba(0,100,200,0.08)",shadowLg:"0 12px 40px rgba(0,100,200,0.14)"};
const GS=()=>(<style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:${T.bg};color:${T.ink};overflow-x:hidden}input,select,textarea,button{font-family:inherit;font-size:16px}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.borderMid};border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fade-up{animation:fadeUp .35s ease both}
.btn-p{background:linear-gradient(135deg,${T.blue},${T.blueDark});color:#fff;border:none;border-radius:${T.r8};padding:10px 18px;font-size:14px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer;transition:all .18s;box-shadow:0 2px 8px rgba(0,119,182,.3);white-space:nowrap}.btn-p:active{transform:scale(.97)}.btn-p:disabled{opacity:.5;cursor:not-allowed}
.btn-g{background:${T.surface};color:${T.inkMid};border:1.5px solid ${T.border};border-radius:${T.r8};padding:9px 16px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap;transition:all .15s}.btn-g:hover{border-color:${T.cyan};color:${T.blue}}
.btn-d{background:${T.dangerBg};color:${T.danger};border:1.5px solid #FECACA;border-radius:${T.r8};padding:9px 14px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.btn-s{background:${T.successBg};color:${T.success};border:1.5px solid #A7F3D0;border-radius:${T.r8};padding:9px 14px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.inp{width:100%;padding:11px 13px;background:${T.surface};border:1.5px solid ${T.border};border-radius:${T.r8};font-size:16px;color:${T.ink};outline:none;transition:border-color .15s}.inp:focus{border-color:${T.cyan};box-shadow:0 0 0 3px rgba(0,180,216,.12)}.inp::placeholder{color:${T.inkFaint}}
.sel{width:100%;padding:11px 36px 11px 13px;background:${T.surface} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A93B0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;border:1.5px solid ${T.border};border-radius:${T.r8};font-size:16px;color:${T.ink};outline:none;appearance:none}
.card{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r16};box-shadow:${T.shadowSm}}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:${T.rFull};font-size:12px;font-weight:700;white-space:nowrap}.dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.ovl{position:fixed;inset:0;background:rgba(3,4,94,.45);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;animation:fadeUp .15s ease}.modal{background:${T.surface};border-radius:${T.r24};box-shadow:${T.shadowLg};width:600px;max-width:95vw;max-height:90vh;overflow-y:auto}
@media(max-width:767px){.modal{width:100%;max-width:100%;max-height:95vh;border-radius:${T.r24} ${T.r24} 0 0;margin-top:auto}.ovl{align-items:flex-end}}
.sb{display:flex;align-items:center;gap:10px;background:${T.surface};border:1.5px solid ${T.border};border-radius:${T.rFull};padding:10px 16px}.sb:focus-within{border-color:${T.cyan}}.sb input{border:none;outline:none;background:transparent;font-size:16px;color:${T.ink};flex:1;min-width:0}.sb input::placeholder{color:${T.inkFaint}}
.pbar{height:6px;border-radius:3px;background:${T.border};overflow:hidden}.pfill{height:100%;border-radius:3px;transition:width .6s ease}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0}
.bnav{position:fixed;bottom:0;left:0;right:0;background:${T.surface};border-top:1px solid ${T.border};display:flex;z-index:50;padding:4px 0;padding-bottom:max(4px,env(safe-area-inset-bottom))}.bnav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;padding:8px 2px;font-size:10px;font-weight:600;color:${T.inkFaint};cursor:pointer;position:relative}.bnav button.on{color:${T.blue}}.bnav button.on::before{content:'';position:absolute;top:0;left:25%;right:25%;height:2.5px;background:linear-gradient(90deg,${T.blue},${T.cyan});border-radius:0 0 2px 2px}
.chip{padding:6px 14px;border-radius:${T.rFull};border:1.5px solid ${T.border};background:${T.surface};color:${T.inkMid};font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s}.chip.on{border-color:${T.blue};background:#EFF6FF;color:${T.blue}}
.lcard{transition:all .2s;cursor:pointer;border:2px solid transparent}.lcard:hover{border-color:${T.cyan};transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,100,200,.1)}
.toggle{position:relative;width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;transition:background .2s;padding:0}.toggle .knob{position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:left .2s}.toggle.on{background:${T.success}}.toggle.on .knob{left:22px}.toggle.off{background:${T.borderMid}}.toggle.off .knob{left:2px}
`}</style>);

const Ic=({n,s=16,c="currentColor"})=>{const d={home:<><rect x="3" y="9" width="18" height="13" rx="2"/><polyline points="3 9 12 2 21 9"/></>,users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,cal:<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,steth:<><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></>,bar:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,srch:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,left:<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,chk:<><polyline points="20 6 9 17 4 12"/></>,alrt:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,cfg:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,ph:<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-5.87-5.86 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2z"/></>,shld:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,clip:<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,save:<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,file:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,lock:<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,user:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,msg:<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,star:<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,link:<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,qr:<><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4"/><rect x="20" y="14" width="2" height="2"/><rect x="14" y="20" width="2" height="2"/><rect x="20" y="20" width="2" height="2"/></>,svc:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,heart:<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></>,mail:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,menu:<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,info:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,dl:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,act:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>};return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>);};

const age=dob=>{try{const b=new Date(dob),n=new Date();let a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;return a;}catch{return 0;}};
const fmt=d=>{try{return new Date((d.length===10?d+"T12:00:00":d)).toLocaleDateString("ro-RO",{day:"2-digit",month:"short",year:"numeric"});}catch{return d;}};
const fmtS=d=>{try{return new Date(d+"T12:00:00").toLocaleDateString("ro-RO",{day:"2-digit",month:"short"});}catch{return d;}};

function Tag({children,v="default",dot=false}){const m={default:{bg:T.border,c:T.inkMid,d:T.inkLight},green:{bg:T.successBg,c:T.success,d:T.success},yellow:{bg:T.warningBg,c:T.warning,d:T.warning},red:{bg:T.dangerBg,c:T.danger,d:T.danger},blue:{bg:"#EFF6FF",c:T.blue,d:T.blue},cyan:{bg:T.cyanDim,c:"#0077A8",d:T.cyan},purple:{bg:T.purpleBg,c:T.purple,d:T.purple},orange:{bg:"#FFF7ED",c:"#EA580C",d:"#EA580C"}};const s=m[v]||m.default;return <span className="tag" style={{background:s.bg,color:s.c}}>{dot&&<span className="dot" style={{background:s.d}}/>}{children}</span>;}
function Av({name="",size=36,variant="blue"}){const ini=name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();const p={blue:{f:T.blue,t:T.blueDark},cyan:{f:T.cyan,t:T.blue},purple:{f:"#7C3AED",t:"#4C1D95"},green:{f:"#059669",t:"#065F46"},orange:{f:"#EA580C",t:"#9A3412"}};const q=p[variant]||p.blue;return <div className="av" style={{width:size,height:size,fontSize:size*.34,background:`linear-gradient(135deg,${q.f},${q.t})`,color:"#fff"}}>{ini}</div>;}
function Div(){return <div style={{height:1,background:T.border}}/>;}
function Empty({icon,title,desc}){return (<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{width:48,height:48,borderRadius:T.r16,background:`linear-gradient(135deg,${T.cyanDim},${T.border})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Ic n={icon} s={20} c={T.blue}/></div><div style={{fontWeight:700,fontSize:15,marginBottom:5}}>{title}</div><div style={{fontSize:13,color:T.inkLight}}>{desc}</div></div>);}
function Toast({msg,type="success",onClose}){const mob=useIsMobile();useEffect(()=>{const t=setTimeout(onClose,3200);return()=>clearTimeout(t);},[]);const c={success:{bg:T.success,ic:"chk"},error:{bg:T.danger,ic:"x"},info:{bg:T.blue,ic:"bell"},warning:{bg:T.warning,ic:"alrt"}}[type]||{bg:T.blue,ic:"bell"};return (<div style={{position:"fixed",bottom:mob?72:28,left:mob?12:"auto",right:mob?12:28,zIndex:200,background:c.bg,color:"#fff",borderRadius:T.r12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:T.shadowLg,animation:"fadeUp .3s ease",fontSize:14,fontWeight:600}}><Ic n={c.ic} s={15} c="#fff"/><span style={{flex:1}}>{msg}</span><button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer"}}><Ic n="x" s={13} c="rgba(255,255,255,.7)"/></button></div>);}
function FF({label,required,children}){return (<div style={{display:"flex",flexDirection:"column",gap:5}}><label style={{fontSize:12,fontWeight:700,color:T.inkMid,letterSpacing:".04em",textTransform:"uppercase"}}>{label}{required&&<span style={{color:T.danger}}>*</span>}</label>{children}</div>);}
function FG({children,mob}){return <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14}}>{children}</div>;}
function Header({name,variant,role,onLogout,mob}){const bg=role==="admin"?"linear-gradient(135deg,#EA580C,#9A3412)":role==="doctor"?`linear-gradient(135deg,${T.cyan},${T.navy})`:`linear-gradient(135deg,${T.success},#047857)`;return (<header style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:40}}><div style={{width:32,height:32,borderRadius:T.r8,background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg></div><span style={{fontWeight:800,fontSize:15,color:T.navy}}>MedFlow</span><Tag v={role==="admin"?"orange":role==="doctor"?"blue":"green"}>{role==="admin"?"Admin":role==="doctor"?"Medic":"Pacient"}</Tag><div style={{flex:1}}/><Av name={name} size={28} variant={variant}/>{!mob&&<span style={{fontSize:13,fontWeight:600,color:T.inkMid}}>{name.replace("Dr. ","")}</span>}<button className="btn-g" style={{padding:"6px 10px"}} onClick={onLogout}><Ic n="logout" s={14}/></button></header>);}
function BNav({items,active,set}){return (<nav className="bnav">{items.map(i=>(<button key={i.id} className={active===i.id?"on":""} onClick={()=>set(i.id)}><Ic n={i.ic} s={20} c={active===i.id?T.blue:T.inkFaint}/><span>{i.l}</span>{i.badge>0&&<span style={{position:"absolute",top:4,right:"30%",width:8,height:8,borderRadius:"50%",background:T.danger}}/>}</button>))}</nav>);}
function QRCode({text,size=160}){const hash=text.split("").reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0)|0,0);const bits=[];for(let i=0;i<441;i++)bits.push(((hash*((i+1)*7))%100)>38);const g=21,cs=size/g;return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:T.r8}}><rect width={size} height={size} fill="white"/>{bits.map((b,i)=>b?<rect key={i} x={(i%g)*cs} y={Math.floor(i/g)*cs} width={cs} height={cs} fill={T.navy} rx={cs*0.15}/>:null)}{[[0,0],[0,(g-7)*cs],[(g-7)*cs,0]].map(([x,y],i)=>(<g key={`m${i}`}><rect x={x} y={y} width={7*cs} height={7*cs} fill={T.navy} rx={cs*0.5}/><rect x={x+cs} y={y+cs} width={5*cs} height={5*cs} fill="white" rx={cs*0.3}/><rect x={x+2*cs} y={y+2*cs} width={3*cs} height={3*cs} fill={T.blue} rx={cs*0.4}/></g>))}</svg>);}

/* ── Stat card helper ── */
function StatBox({label,value,icon,color,bg,onClick}){return (<div className="card" style={{padding:14,borderTop:`4px solid ${color}`,cursor:onClick?"pointer":"default"}} onClick={onClick}><div style={{width:34,height:34,borderRadius:T.r12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}><Ic n={icon} s={16} c={color}/></div><div style={{fontSize:22,fontWeight:800}}>{value}</div><div style={{fontSize:11,color:T.inkLight}}>{label}</div></div>);}

/* ── HISTORY/REPORT component (reusable) ── */
function HistoryReport({title,patient,doctorFilter,allAppts,allRx,allMsgs,allDocs,allPats,mob,onBack}){
  // compute data for this patient, optionally filtered by a doctor
  const pAppts=allAppts.filter(a=>a.patientId===patient.id&&(doctorFilter?a.doctorId===doctorFilter:true)).sort((a,b)=>b.date.localeCompare(a.date));
  const pRx=allRx.filter(r=>r.patientId===patient.id&&(doctorFilter?r.doctorId===doctorFilter:true)).sort((a,b)=>b.date.localeCompare(a.date));
  const pMsgs=allMsgs.filter(m=>((m.fromRole==="patient"&&m.fromId===patient.id)||(m.toRole==="patient"&&m.toId===patient.id))&&(doctorFilter?((m.fromRole==="doctor"&&m.fromId===doctorFilter)||(m.toRole==="doctor"&&m.toId===doctorFilter)):true)).sort((a,b)=>b.id-a.id);
  // unique doctors this patient visited
  const docIds=[...new Set(allAppts.filter(a=>a.patientId===patient.id).map(a=>a.doctorId))];
  const visitedDocs=docIds.map(id=>allDocs.find(d=>d.id===id)).filter(Boolean);
  const totalAppts=allAppts.filter(a=>a.patientId===patient.id).length;
  const finalized=allAppts.filter(a=>a.patientId===patient.id&&a.status==="Finalizată").length;
  const cancelled=allAppts.filter(a=>a.patientId===patient.id&&a.status==="Anulată").length;
  const activeRx=allRx.filter(r=>r.patientId===patient.id&&r.status==="Activă").length;
  const firstAppt=allAppts.filter(a=>a.patientId===patient.id).sort((a,b)=>a.date.localeCompare(b.date))[0];

  const [tab,setTab]=useState("overview");

  return (
    <div className="fade-up">
      <button className="btn-g" onClick={onBack} style={{marginBottom:14}}><Ic n="left" s={14}/> Înapoi</button>
      <div className="card" style={{padding:mob?16:24,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
          <Av name={patient.name} size={mob?50:64} variant="green"/>
          <div>
            <div style={{fontSize:mob?18:22,fontWeight:800}}>{patient.name}</div>
            <div style={{fontSize:13,color:T.inkMid}}>{age(patient.dob)} ani · Grupa {patient.group} · {patient.doctor}</div>
            <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
              <Tag v={{"Sănătos":"green","În tratament":"yellow","Control periodic":"blue","Urgență":"red"}[patient.status]||"default"} dot>{patient.status}</Tag>
              {patient.allergies&&patient.allergies!=="Niciuna"&&<Tag v="red" dot>⚠ {patient.allergies}</Tag>}
            </div>
          </div>
        </div>
        <Div/>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:10,marginTop:14}}>
          {[["cal","Total vizite",totalAppts],["chk","Finalizate",finalized],["file","Rețete active",activeRx],["steth","Medici",visitedDocs.length]].map(([ic,lb,vl])=>(
            <div key={lb} style={{background:T.surfaceAlt,borderRadius:T.r12,padding:"10px 12px",border:`1px solid ${T.border}`,textAlign:"center"}}>
              <Ic n={ic} s={14} c={T.blue}/>
              <div style={{fontSize:18,fontWeight:800,marginTop:4}}>{vl}</div>
              <div style={{fontSize:10,color:T.inkFaint}}>{lb}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {[["overview","Sumar"],["appointments","Programări"],["prescriptions","Rețete"],["messages","Mesaje"],["doctors","Medici"]].map(([id,l])=>(
          <button key={id} className={`chip ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{l}</button>
        ))}
      </div>

      {tab==="overview"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card" style={{padding:16}}>
            <div style={{fontWeight:700,marginBottom:10}}>Informații generale</div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
              {[["users","Părinte/Tutore",patient.parent],["ph","Telefon",patient.phone],["mail","Email",patient.email],["cal","Data nașterii",fmt(patient.dob)],["steth","Medic curant",patient.doctor],["clock","Pacient din",firstAppt?fmt(firstAppt.date):"—"],["heart","Alergii",patient.allergies||"Niciuna"],["file","Total rețete",allRx.filter(r=>r.patientId===patient.id).length]].map(([ic,lb,vl])=>(
                <div key={lb} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <Ic n={ic} s={14} c={T.blue}/>
                  <div><div style={{fontSize:10,fontWeight:700,color:T.inkFaint,textTransform:"uppercase"}}>{lb}</div><div style={{fontSize:13,fontWeight:600}}>{vl||"—"}</div></div>
                </div>
              ))}
            </div>
          </div>
          {patient.notes&&<div className="card" style={{padding:16}}><div style={{fontWeight:700,marginBottom:8}}>Observații medicale</div><div style={{fontSize:14,color:T.inkMid,background:T.surfaceAlt,borderRadius:T.r12,padding:12,border:`1px solid ${T.border}`,lineHeight:1.7}}>{patient.notes}</div></div>}
          <div className="card" style={{padding:16}}>
            <div style={{fontWeight:700,marginBottom:10}}>Rata completării</div>
            {[{l:"Confirmate",v:allAppts.filter(a=>a.patientId===patient.id&&a.status==="Confirmată").length,c:T.success},{l:"Finalizate",v:finalized,c:T.blue},{l:"Anulate",v:cancelled,c:T.danger}].map(item=>(
              <div key={item.l} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:T.inkMid}}>{item.l}</span><span style={{fontSize:13,fontWeight:700}}>{item.v}/{totalAppts||1}</span></div>
                <div className="pbar"><div className="pfill" style={{width:`${(item.v/Math.max(totalAppts,1))*100}%`,background:item.c}}/></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="appointments"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {pAppts.length===0?<div className="card"><Empty icon="cal" title="Nicio programare" desc=""/></div>:pAppts.map(a=>(
            <div key={a.id} className="card" style={{padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{background:`linear-gradient(135deg,${T.blue},${T.cyan})`,borderRadius:T.r8,padding:"6px 10px",textAlign:"center",minWidth:48}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{a.time}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>{fmtS(a.date)}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{a.type}</div>
                  <div style={{fontSize:12,color:T.inkLight}}>{a.doctor} · {a.room}</div>
                </div>
                <Tag v={{"Confirmată":"green","În așteptare":"yellow","Anulată":"red","Finalizată":"cyan"}[a.status]||"default"} dot>{a.status}</Tag>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="prescriptions"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {pRx.length===0?<div className="card"><Empty icon="file" title="Nicio rețetă" desc=""/></div>:pRx.map(r=>(
            <div key={r.id} className="card" style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontWeight:700}}>{r.diagnosis}</span>
                <Tag v={r.status==="Activă"?"green":"default"}>{r.status}</Tag>
              </div>
              <div style={{fontSize:14,color:T.blue,fontWeight:600}}>{r.medicines}</div>
              <div style={{fontSize:12,color:T.inkFaint,marginTop:4}}>{r.doctorName} · {fmt(r.date)}</div>
            </div>
          ))}
        </div>
      )}

      {tab==="messages"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {pMsgs.length===0?<div className="card"><Empty icon="msg" title="Nicio conversație" desc=""/></div>:pMsgs.map(m=>(
            <div key={m.id} className="card" style={{padding:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <Av name={m.from} size={24} variant={m.fromRole==="doctor"?"blue":"green"}/>
                <span style={{fontWeight:600,fontSize:13}}>{m.from}</span>
                <span style={{fontSize:11,color:T.inkFaint,marginLeft:"auto"}}>{fmt(m.date)}</span>
              </div>
              <div style={{fontSize:14,color:T.inkMid,paddingLeft:32}}>{m.text}</div>
            </div>
          ))}
        </div>
      )}

      {tab==="doctors"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {visitedDocs.length===0?<div className="card"><Empty icon="steth" title="Niciun medic" desc=""/></div>:visitedDocs.map(d=>{
            const dAppts=allAppts.filter(a=>a.patientId===patient.id&&a.doctorId===d.id);
            const dRx=allRx.filter(r=>r.patientId===patient.id&&r.doctorId===d.id);
            return (
              <div key={d.id} className="card" style={{padding:16}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <Av name={d.name} size={44} variant={d.av||"blue"}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{d.name}</div>
                    <div style={{fontSize:12,color:T.inkMid}}>{d.spec}</div>
                  </div>
                  {d.name===patient.doctor&&<Tag v="cyan" dot>Curant</Tag>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["Vizite",dAppts.length,T.blue],["Finalizate",dAppts.filter(a=>a.status==="Finalizată").length,T.success],["Rețete",dRx.length,T.purple]].map(([l,v,c])=>(
                    <div key={l} style={{background:T.surfaceAlt,borderRadius:T.r8,padding:8,textAlign:"center",border:`1px solid ${T.border}`}}>
                      <div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
                      <div style={{fontSize:10,color:T.inkFaint}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── SEED DATA ── */
const PSTATUS={"Sănătos":"green","În tratament":"yellow","Control periodic":"blue","Urgență":"red"};
const ASTATUS={"Confirmată":"green","În așteptare":"yellow","Anulată":"red","Finalizată":"cyan"};
const ATYPE={"Consultație":"blue","Control":"cyan","Vaccinare":"green","Urgență":"red"};
const INIT_DOCS=[
  {id:1,name:"Dr. Ionescu Alexandra",spec:"Pediatrie generală",exp:"12 ani",patients:148,today:6,on:true,email:"ionescu@medflow.ro",av:"cyan",phone:"0722 100 001",password:"doctor1",schedule:{Luni:"08-16",Marți:"08-16",Miercuri:"08-14",Joi:"08-16",Vineri:"08-12",Sâmbătă:"Liber",Duminică:"Liber"},bio:"Specialist pediatrie.",services:[1,2,3]},
  {id:2,name:"Dr. Popa Gheorghe",spec:"Neonatologie",exp:"8 ani",patients:112,today:4,on:true,email:"popa@medflow.ro",av:"blue",phone:"0722 100 002",password:"doctor2",schedule:{Luni:"09-17",Marți:"09-17",Miercuri:"09-17",Joi:"09-15",Vineri:"09-17",Sâmbătă:"Liber",Duminică:"Liber"},bio:"Specialist neonatologie.",services:[1,2,4]},
  {id:3,name:"Dr. Vasilescu Ioana",spec:"Cardiologie pediatrică",exp:"15 ani",patients:93,today:3,on:false,email:"vasilescu@medflow.ro",av:"purple",phone:"0722 100 003",password:"doctor3",schedule:{Luni:"10-18",Marți:"10-18",Miercuri:"Liber",Joi:"10-18",Vineri:"10-16",Sâmbătă:"Liber",Duminică:"Liber"},bio:"Specialist cardiologie.",services:[1,5]},
  {id:4,name:"Dr. Marinescu Radu",spec:"Neurologie pediatrică",exp:"10 ani",patients:76,today:5,on:true,email:"marinescu@medflow.ro",av:"green",phone:"0722 100 004",password:"doctor4",schedule:{Luni:"07-15",Marți:"07-15",Miercuri:"07-15",Joi:"07-15",Vineri:"07-13",Sâmbătă:"09-13",Duminică:"Liber"},bio:"Specialist neurologie.",services:[1,6]},
];
const INIT_PATS=[
  {id:101,name:"Popescu Andrei",dob:"2018-03-12",parent:"Popescu Maria",phone:"0722 111 222",doctor:"Dr. Ionescu Alexandra",group:"B+",allergies:"Polen",lastVisit:"2024-11-20",status:"Sănătos",notes:"Control anual. Vaccinuri la zi. Dezvoltare normală.",password:"pacient1",email:"popescu.m@email.ro"},
  {id:102,name:"Dumitrescu Elena",dob:"2020-07-04",parent:"Dumitrescu Ion",phone:"0733 222 333",doctor:"Dr. Popa Gheorghe",group:"A+",allergies:"Niciuna",lastVisit:"2024-12-01",status:"În tratament",notes:"Otită medie. Tratament antibiotic în curs.",password:"pacient2",email:"dumitrescu.i@email.ro"},
  {id:103,name:"Ionescu Mihai",dob:"2016-11-22",parent:"Ionescu Cristina",phone:"0744 333 444",doctor:"Dr. Ionescu Alexandra",group:"O-",allergies:"Penicilină",lastVisit:"2024-10-15",status:"Sănătos",notes:"Alergie severă penicilină. Necesită alternativă antibiotică.",password:"pacient3",email:"ionescu.c@email.ro"},
];
const INIT_APPTS=[
  {id:1,patient:"Popescu Andrei",patientId:101,doctor:"Dr. Ionescu Alexandra",doctorId:1,date:"2025-01-15",time:"09:00",type:"Control",status:"Finalizată",room:"Sala 1",serviceId:2},
  {id:2,patient:"Dumitrescu Elena",patientId:102,doctor:"Dr. Popa Gheorghe",doctorId:2,date:"2025-01-15",time:"10:30",type:"Consultație",status:"Finalizată",room:"Sala 2",serviceId:1},
  {id:3,patient:"Ionescu Mihai",patientId:103,doctor:"Dr. Ionescu Alexandra",doctorId:1,date:"2025-01-16",time:"08:30",type:"Vaccinare",status:"Confirmată",room:"Sala 1",serviceId:3},
  {id:4,patient:"Popescu Andrei",patientId:101,doctor:"Dr. Popa Gheorghe",doctorId:2,date:"2024-11-20",time:"11:00",type:"Consultație",status:"Finalizată",room:"Sala 2",serviceId:1},
  {id:5,patient:"Popescu Andrei",patientId:101,doctor:"Dr. Ionescu Alexandra",doctorId:1,date:"2024-10-05",time:"09:00",type:"Vaccinare",status:"Finalizată",room:"Sala 1",serviceId:3},
  {id:6,patient:"Popescu Andrei",patientId:101,doctor:"Dr. Vasilescu Ioana",doctorId:3,date:"2024-08-12",time:"14:00",type:"Consultație",status:"Finalizată",room:"Sala 3",serviceId:5},
  {id:7,patient:"Ionescu Mihai",patientId:103,doctor:"Dr. Marinescu Radu",doctorId:4,date:"2024-09-10",time:"10:00",type:"Consultație",status:"Finalizată",room:"Sala 2",serviceId:6},
  {id:8,patient:"Dumitrescu Elena",patientId:102,doctor:"Dr. Popa Gheorghe",doctorId:2,date:"2025-01-20",time:"09:00",type:"Control",status:"În așteptare",room:"Sala 2",serviceId:2},
];
const INIT_MSGS=[
  {id:1,from:"Dr. Ionescu Alexandra",fromRole:"doctor",fromId:1,to:"Popescu Andrei",toRole:"patient",toId:101,text:"Rezultatele analizelor sunt bune. Vitamina D în parametri normali acum.",date:"2025-01-14",read:false},
  {id:2,from:"Popescu Maria",fromRole:"patient",fromId:101,to:"Dr. Ionescu Alexandra",toRole:"doctor",toId:1,text:"Mulțumim frumos! Ne vedem la control.",date:"2025-01-14",read:true},
  {id:3,from:"Dr. Popa Gheorghe",fromRole:"doctor",fromId:2,to:"Dumitrescu Elena",toRole:"patient",toId:102,text:"Continuați tratamentul. Ne vedem la reevaluare.",date:"2025-01-13",read:false},
  {id:4,from:"Dr. Popa Gheorghe",fromRole:"doctor",fromId:2,to:"Popescu Andrei",toRole:"patient",toId:101,text:"Consult OK. Totul în regulă.",date:"2024-11-20",read:true},
];
const INIT_RX=[
  {id:1,patientId:101,doctorId:1,patientName:"Popescu Andrei",doctorName:"Dr. Ionescu Alexandra",date:"2025-01-10",medicines:"Vitamina D 1000UI — 1/zi",diagnosis:"Deficit vitamina D",status:"Activă"},
  {id:2,patientId:102,doctorId:2,patientName:"Dumitrescu Elena",doctorName:"Dr. Popa Gheorghe",date:"2025-01-05",medicines:"Amoxicilină 250mg — 3x/zi, 7 zile",diagnosis:"Otită medie acută",status:"Activă"},
  {id:3,patientId:101,doctorId:2,patientName:"Popescu Andrei",doctorName:"Dr. Popa Gheorghe",date:"2024-11-20",medicines:"Paracetamol 250mg — la nevoie",diagnosis:"Febră virală",status:"Expirată"},
  {id:4,patientId:103,doctorId:4,patientName:"Ionescu Mihai",doctorName:"Dr. Marinescu Radu",date:"2024-09-10",medicines:"Evaluare EEG — programată",diagnosis:"Screening neurologic",status:"Expirată"},
];
const INIT_SVCS=[
  {id:1,name:"Consultație pediatru",desc:"Consultație generală",price:"150 RON",duration:"30 min",active:true},
  {id:2,name:"Control periodic",desc:"Control de rutină",price:"120 RON",duration:"20 min",active:true},
  {id:3,name:"Vaccinare",desc:"Administrare vaccinuri",price:"80 RON",duration:"15 min",active:true},
  {id:4,name:"Consultație neonatologie",desc:"Evaluare nou-născuți",price:"200 RON",duration:"40 min",active:true},
  {id:5,name:"Ecografie cardiacă",desc:"Ecocardiografie pediatrică",price:"350 RON",duration:"45 min",active:true},
  {id:6,name:"Evaluare neurologică",desc:"Neurologie pediatrică",price:"250 RON",duration:"40 min",active:true},
];
const ADMIN_ACC={email:"admin@medflow.ro",password:"admin123",name:"Admin Clinică"};

/* ═══════════════════
   MAIN APP
   ═══════════════════ */
export default function App(){
  const mob=useIsMobile();
  const [auth,setAuth]=useState(null);
  const [docs,setDocs]=useState(INIT_DOCS);
  const [pats,setPats]=useState(INIT_PATS);
  const [appts,setAppts]=useState(INIT_APPTS);
  const [msgs,setMsgs]=useState(INIT_MSGS);
  const [rxs,setRxs]=useState(INIT_RX);
  const [svcs,setSvcs]=useState(INIT_SVCS);
  const [delReqs,setDelReqs]=useState([]);
  const [toastD,setToastD]=useState(null);
  const toast=useCallback((m,t="success")=>setToastD({msg:m,type:t,k:Date.now()}),[]);
  const doLogin=(role,userId)=>{setAuth({role,userId});toast(`Autentificat ca ${role==="admin"?"administrator":role==="doctor"?"medic":"pacient"}`);};
  const doLogout=()=>{setAuth(null);toast("Deconectat","info");};

  /* ── BookingModal ── */
  function BookingModal({onClose,preDocId,preServiceId,patientId,patientName}){
    const [selSvc,setSelSvc]=useState(preServiceId||svcs.filter(s=>s.active)[0]?.id||0);
    const [selDoc,setSelDoc]=useState(preDocId||0);
    const [date,setDate]=useState("");const [time,setTime]=useState("09:00");
    const avDocs=docs.filter(d=>d.on&&d.services?.includes(selSvc));
    useEffect(()=>{if(!preDocId&&avDocs.length>0&&!avDocs.find(d=>d.id===selDoc))setSelDoc(avDocs[0].id);},[selSvc]);
    const book=()=>{if(!date||!selDoc)return;const doc=docs.find(d=>d.id===selDoc);const svc=svcs.find(s=>s.id===selSvc);setAppts(a=>[...a,{id:Date.now(),patient:patientName,patientId,doctor:doc.name,doctorId:doc.id,date,time,type:svc?.name||"Consultație",status:"În așteptare",room:"Sala 1",serviceId:selSvc}]);toast("Programare creată!");onClose();};
    return (<div className="ovl" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{padding:24}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontWeight:700,fontSize:17}}>Programare nouă</span><button className="btn-g" style={{padding:6}} onClick={onClose}><Ic n="x" s={15}/></button></div><FG mob={mob}>{!preServiceId&&<FF label="Serviciu" required><select className="sel" value={selSvc} onChange={e=>setSelSvc(Number(e.target.value))}>{svcs.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{s.name} — {s.price}</option>)}</select></FF>}{!preDocId&&<FF label="Medic" required><select className="sel" value={selDoc} onChange={e=>setSelDoc(Number(e.target.value))}>{avDocs.length===0?<option>Niciun medic</option>:avDocs.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></FF>}<FF label="Data" required><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)}/></FF><FF label="Ora"><input className="inp" type="time" value={time} onChange={e=>setTime(e.target.value)}/></FF></FG><button className="btn-p" style={{width:"100%",justifyContent:"center",marginTop:16,padding:14}} onClick={book} disabled={!date||!selDoc}>Confirmă programarea</button></div></div>);
  }
  function QRModal({onClose,title,linkText}){const url=`https://medflow.ro/book/${linkText}`;const [cp,setCp]=useState(false);return (<div className="ovl" onClick={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{padding:28,textAlign:"center"}}><div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{title}</div><div style={{display:"flex",justifyContent:"center",marginBottom:16}}><QRCode text={url} size={180}/></div><div style={{display:"flex",gap:8,background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:T.r8,padding:"10px 12px",alignItems:"center",marginBottom:16}}><Ic n="link" s={14} c={T.inkFaint}/><span style={{flex:1,fontSize:13,color:T.inkMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</span><button className="btn-g" style={{padding:"4px 12px",fontSize:12}} onClick={()=>{try{navigator.clipboard.writeText(url);}catch{}setCp(true);setTimeout(()=>setCp(false),2000);}}>{cp?"Copiat!":"Copiază"}</button></div><button className="btn-g" onClick={onClose} style={{width:"100%",justifyContent:"center"}}>Închide</button></div></div>);}

  /* ── AUTH ── */
  const AuthScr=()=>{
    const [mode,setMode]=useState("login");const [role,setRole]=useState(null);
    const [email,setEmail]=useState("");const [pw,setPw]=useState("");const [err,setErr]=useState("");
    const [rName,setRName]=useState("");const [rEmail,setREmail]=useState("");const [rPw,setRPw]=useState("");const [rRole,setRRole]=useState("patient");const [rPhone,setRPhone]=useState("");const [rSpec,setRSpec]=useState("");
    const [rChild,setRChild]=useState("");const [rDob,setRDob]=useState("");const [rDoc,setRDoc]=useState(docs[0]?.name||"");const [rGroup,setRGroup]=useState("A+");
    const tryLogin=()=>{setErr("");if(mode==="admin"){if(email===ADMIN_ACC.email&&pw===ADMIN_ACC.password){doLogin("admin","admin");return;}setErr("Credențiale incorecte!");return;}const list=role==="doctor"?docs:pats;const u=list.find(x=>x.email===email);if(!u){setErr("Cont negăsit!");return;}if(u.password!==pw){setErr("Parolă incorectă!");return;}doLogin(role,u.id);};
    const tryReg=()=>{setErr("");if(!rName||!rEmail||!rPw){setErr("Completează obligatoriile!");return;}if(rRole==="patient"&&(!rChild||!rDob)){setErr("Completează datele copilului!");return;}if(rRole==="doctor"&&!rSpec){setErr("Completează specializarea!");return;}if([...docs.map(d=>d.email),...pats.map(p=>p.email)].includes(rEmail)){setErr("Email existent!");return;}const nid=Date.now();if(rRole==="doctor"){setDocs(d=>[...d,{id:nid,name:rName,spec:rSpec,exp:"0 ani",patients:0,today:0,on:true,email:rEmail,av:["blue","cyan","purple","green"][docs.length%4],phone:rPhone,password:rPw,schedule:{Luni:"08-16",Marți:"08-16",Miercuri:"08-16",Joi:"08-16",Vineri:"08-14",Sâmbătă:"Liber",Duminică:"Liber"},bio:"",services:[]}]);}else{setPats(p=>[...p,{id:nid,name:rChild,dob:rDob,parent:rName,phone:rPhone,doctor:rDoc,group:rGroup,allergies:"Niciuna",lastVisit:new Date().toISOString().slice(0,10),status:"Sănătos",notes:"",password:rPw,email:rEmail}]);}doLogin(rRole,nid);};
    const bgS={minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${T.navy} 0%,${T.blueDark} 40%,${T.blue} 100%)`,padding:20,position:"relative"};
    const admBtn=<button onClick={()=>{setMode("admin");setErr("");}} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:T.r8,color:"rgba(255,255,255,.5)",padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Ic n="shld" s={12} c="rgba(255,255,255,.5)"/> Admin</button>;
    const back=fn=><button onClick={fn} style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:T.r8,color:"#fff",padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:12,display:"inline-flex",alignItems:"center",gap:6}}><Ic n="left" s={14} c="#fff"/> Înapoi</button>;

    if(mode==="login"&&!role)return (<div style={bgS}>{admBtn}<div className="fade-up" style={{maxWidth:520,width:"100%",textAlign:"center"}}><div style={{width:70,height:70,borderRadius:T.r16,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/><path d="M12 7v5l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="white"/></svg></div><h1 style={{color:"#fff",fontSize:mob?28:36,fontWeight:800,marginBottom:6}}>MedFlow</h1><p style={{color:"rgba(255,255,255,.6)",fontSize:15,marginBottom:32}}>Clinică Pediatrică — Cabinet Digital</p><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:16}}><div className="lcard card" onClick={()=>setRole("doctor")} style={{padding:mob?24:32}}><div style={{width:56,height:56,borderRadius:T.r16,background:`linear-gradient(135deg,${T.cyan},${T.blue})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Ic n="steth" s={26} c="#fff"/></div><div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Medic</div><div style={{fontSize:13,color:T.inkLight}}>Cabinet medical</div></div><div className="lcard card" onClick={()=>setRole("patient")} style={{padding:mob?24:32}}><div style={{width:56,height:56,borderRadius:T.r16,background:`linear-gradient(135deg,${T.success},#047857)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Ic n="user" s={26} c="#fff"/></div><div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Pacient</div><div style={{fontSize:13,color:T.inkLight}}>Fișa ta medicală</div></div></div></div></div>);
    if(mode==="admin")return (<div style={bgS}><div className="fade-up" style={{maxWidth:400,width:"100%"}}><div style={{textAlign:"center",marginBottom:24}}>{back(()=>{setMode("login");setRole(null);setErr("");})}<div style={{width:48,height:48,borderRadius:T.r12,background:"linear-gradient(135deg,#EA580C,#9A3412)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Ic n="shld" s={22} c="#fff"/></div><h2 style={{color:"#fff",fontSize:22,fontWeight:800}}>Administrator</h2></div><div className="card" style={{padding:mob?20:28}}><FF label="Email" required><input className="inp" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}/></FF><div style={{height:12}}/><FF label="Parolă" required><input className="inp" type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/></FF>{err&&<div style={{color:T.danger,fontSize:13,fontWeight:600,marginTop:10}}>{err}</div>}<div style={{fontSize:11,color:T.inkFaint,marginTop:8}}>Demo: admin@medflow.ro / admin123</div><button className="btn-p" style={{width:"100%",justifyContent:"center",marginTop:16,padding:14,background:"linear-gradient(135deg,#EA580C,#9A3412)"}} onClick={tryLogin} disabled={!email||!pw}><Ic n="lock" s={15} c="#fff"/> Autentificare</button></div></div></div>);
    if(mode==="register")return (<div style={bgS}><div className="fade-up" style={{maxWidth:480,width:"100%"}}><div style={{textAlign:"center",marginBottom:20}}>{back(()=>{setMode("login");setErr("");})}<h2 style={{color:"#fff",fontSize:22,fontWeight:800}}>Cont nou</h2></div><div className="card" style={{padding:mob?20:28}}><FF label="Tip cont"><div style={{display:"flex",gap:8}}>{[["patient","Pacient"],["doctor","Medic"]].map(([v,l])=>(<button key={v} className={`chip ${rRole===v?"on":""}`} onClick={()=>setRRole(v)} style={{flex:1,justifyContent:"center",padding:10}}>{l}</button>))}</div></FF><div style={{height:10}}/><FG mob={mob}><FF label={rRole==="doctor"?"Nume complet":"Numele tău (părinte)"} required><input className="inp" value={rName} onChange={e=>setRName(e.target.value)}/></FF><FF label="Email" required><input className="inp" type="email" value={rEmail} onChange={e=>setREmail(e.target.value)}/></FF><FF label="Parolă" required><input className="inp" type="password" value={rPw} onChange={e=>setRPw(e.target.value)}/></FF><FF label="Telefon"><input className="inp" type="tel" value={rPhone} onChange={e=>setRPhone(e.target.value)}/></FF>{rRole==="doctor"&&<FF label="Specializare" required><input className="inp" value={rSpec} onChange={e=>setRSpec(e.target.value)}/></FF>}{rRole==="patient"&&<><FF label="Copil" required><input className="inp" value={rChild} onChange={e=>setRChild(e.target.value)}/></FF><FF label="Data nașterii" required><input className="inp" type="date" value={rDob} onChange={e=>setRDob(e.target.value)}/></FF><FF label="Medic"><select className="sel" value={rDoc} onChange={e=>setRDoc(e.target.value)}>{docs.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}</select></FF><FF label="Grupa"><select className="sel" value={rGroup} onChange={e=>setRGroup(e.target.value)}>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g=><option key={g}>{g}</option>)}</select></FF></>}</FG>{err&&<div style={{color:T.danger,fontSize:13,fontWeight:600,marginTop:10}}>{err}</div>}<button className="btn-p" style={{width:"100%",justifyContent:"center",marginTop:16,padding:14}} onClick={tryReg}><Ic n="plus" s={15} c="#fff"/> Creează cont</button></div></div></div>);
    return (<div style={bgS}>{admBtn}<div className="fade-up" style={{maxWidth:420,width:"100%"}}><div style={{textAlign:"center",marginBottom:24}}>{back(()=>{setRole(null);setErr("");})}<h2 style={{color:"#fff",fontSize:22,fontWeight:800}}>Autentificare {role==="doctor"?"Medic":"Pacient"}</h2></div><div className="card" style={{padding:mob?20:28}}><FF label="Email" required><input className="inp" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}/></FF><div style={{height:12}}/><FF label="Parolă" required><input className="inp" type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryLogin()}/></FF>{err&&<div style={{color:T.danger,fontSize:13,fontWeight:600,marginTop:10}}>{err}</div>}<div style={{fontSize:11,color:T.inkFaint,marginTop:8}}>Demo: {role==="doctor"?"ionescu@medflow.ro / doctor1":"popescu.m@email.ro / pacient1"}</div><button className="btn-p" style={{width:"100%",justifyContent:"center",marginTop:16,padding:14,background:role==="patient"?`linear-gradient(135deg,${T.success},#047857)`:undefined}} onClick={tryLogin} disabled={!email||!pw}><Ic n="lock" s={15} c="#fff"/> Intră</button><div style={{textAlign:"center",marginTop:16}}><span style={{fontSize:13,color:T.inkLight}}>Nu ai cont? </span><button onClick={()=>{setMode("register");setRRole(role);setErr("");}} style={{background:"none",border:"none",color:role==="doctor"?T.blue:T.success,fontSize:13,fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>Creează cont</button></div></div></div></div>);
  };

  /* ── PATIENT APP ── */
  const PatApp=()=>{
    const pat=pats.find(p=>p.id===auth.userId);const [page,setPage]=useState("dashboard");const [showBook,setShowBook]=useState(false);const [viewDocId,setViewDocId]=useState(null);
    if(!pat){doLogout();return null;}
    const myAppt=appts.filter(a=>a.patientId===pat.id);const myRx=rxs.filter(r=>r.patientId===pat.id);
    const myMsgs=msgs.filter(m=>(m.fromRole==="patient"&&m.fromId===pat.id)||(m.toRole==="patient"&&m.toId===pat.id));
    const unread=myMsgs.filter(m=>!m.read&&m.toRole==="patient").length;
    // unique doctors
    const myDocIds=[...new Set(myAppt.map(a=>a.doctorId))];const myDocs=myDocIds.map(id=>docs.find(d=>d.id===id)).filter(Boolean);
    const nav=[{id:"dashboard",l:"Acasă",ic:"home",badge:0},{id:"appointments",l:"Programări",ic:"cal",badge:0},{id:"services",l:"Servicii",ic:"svc",badge:0},{id:"doctors",l:"Medici",ic:"steth",badge:0},{id:"messages",l:"Mesaje",ic:"msg",badge:unread}];

    if(viewDocId){
      const vDoc=docs.find(d=>d.id===viewDocId);
      if(!vDoc)return null;
      return (<div style={{minHeight:"100vh",background:T.bg}}><Header name={pat.parent||pat.name} variant="green" role="patient" onLogout={doLogout} mob={mob}/><main style={{padding:mob?"16px 16px 80px":"24px 28px",maxWidth:700,margin:"0 auto"}}>
        <HistoryReport title={`Istoric cu ${vDoc.name}`} patient={pat} doctorFilter={vDoc.id} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={docs} allPats={pats} mob={mob} onBack={()=>setViewDocId(null)}/>
      </main><BNav items={nav} active={page} set={p=>{setViewDocId(null);setPage(p);}}/>{showBook&&<BookingModal onClose={()=>setShowBook(false)} preDocId={typeof showBook==="object"?showBook.docId:null} preServiceId={typeof showBook==="object"?showBook.svcId:null} patientId={pat.id} patientName={pat.name}/>}</div>);
    }

    const Dash=()=>(<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:mob?14:20}}>
      <div className="card" style={{padding:mob?16:24,background:`linear-gradient(135deg,${T.success},#047857)`,color:"#fff",border:"none"}}><div style={{display:"flex",alignItems:"center",gap:16}}><Av name={pat.name} size={mob?50:64} variant="green"/><div><div style={{fontSize:mob?18:22,fontWeight:800}}>Bun venit, {pat.parent?.split(" ")[0]||pat.name}</div><div style={{fontSize:13,opacity:.8,marginTop:3}}>{pat.name} · {age(pat.dob)} ani</div></div></div></div>
      <button className="btn-p" style={{width:"100%",justifyContent:"center",padding:14,background:`linear-gradient(135deg,${T.success},#047857)`}} onClick={()=>setShowBook(true)}><Ic n="cal" s={16} c="#fff"/> Programează-te</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{l:"Programări",v:myAppt.length,ic:"cal",c:T.cyan,bg:T.cyanDim,p:"appointments"},{l:"Rețete active",v:myRx.filter(r=>r.status==="Activă").length,ic:"file",c:T.purple,bg:T.purpleBg,p:null},{l:"Medici vizitați",v:myDocs.length,ic:"steth",c:T.blue,bg:"#EFF6FF",p:"doctors"},{l:"Servicii",v:svcs.filter(s=>s.active).length,ic:"svc",c:T.success,bg:T.successBg,p:"services"}].map((s,i)=>(<div key={i} className="card" style={{padding:14,borderTop:`4px solid ${s.c}`,cursor:s.p?"pointer":"default"}} onClick={()=>s.p&&setPage(s.p)}><div style={{width:34,height:34,borderRadius:T.r8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}><Ic n={s.ic} s={16} c={s.c}/></div><div style={{fontSize:22,fontWeight:800}}>{s.v}</div><div style={{fontSize:11,color:T.inkLight}}>{s.l}</div></div>))}
      </div>
    </div>);

    const Appts=()=>(<div className="fade-up"><div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button className="btn-p" style={{background:`linear-gradient(135deg,${T.success},#047857)`}} onClick={()=>setShowBook(true)}><Ic n="plus" s={15} c="#fff"/> Programare</button></div>{myAppt.length===0?<div className="card"><Empty icon="cal" title="Nicio programare" desc=""/></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{myAppt.sort((a,b)=>b.date.localeCompare(a.date)).map(a=><div key={a.id} className="card" style={{padding:14}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{background:`linear-gradient(135deg,${T.success},#047857)`,borderRadius:T.r8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{a.time}</div><div style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>{fmtS(a.date)}</div></div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{a.type}</div><div style={{fontSize:12,color:T.inkLight}}>{a.doctor}</div></div><Tag v={ASTATUS[a.status]||"default"} dot>{a.status}</Tag></div></div>)}</div>}</div>);

    const Svcs=()=>(<div className="fade-up">{svcs.filter(s=>s.active).map(s=>{const sd=docs.filter(d=>d.on&&d.services?.includes(s.id));return (<div key={s.id} className="card" style={{padding:16,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontWeight:700,fontSize:15}}>{s.name}</span><Tag v="blue">{s.price}</Tag></div><div style={{fontSize:13,color:T.inkMid,marginBottom:8}}>{s.desc} · {s.duration}</div><div style={{fontSize:12,color:T.inkLight,marginBottom:8}}>Medici: {sd.length===0?"—":sd.map(d=>d.name).join(", ")}</div><button className="btn-p" style={{width:"100%",justifyContent:"center",fontSize:13,padding:10,background:`linear-gradient(135deg,${T.success},#047857)`}} onClick={()=>setShowBook({svcId:s.id})}><Ic n="cal" s={14} c="#fff"/> Programează</button></div>);})}</div>);

    const Docs=()=>(<div className="fade-up"><div style={{fontSize:14,color:T.inkMid,marginBottom:14}}>Medicii la care ai fost — apasă pentru istoricul complet:</div>{myDocs.length===0?<div className="card"><Empty icon="steth" title="Niciun medic" desc=""/></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{myDocs.map(d=>{const da=appts.filter(a=>a.patientId===pat.id&&a.doctorId===d.id);return (<div key={d.id} className="card" style={{padding:16,cursor:"pointer"}} onClick={()=>setViewDocId(d.id)}><div style={{display:"flex",alignItems:"center",gap:12}}><Av name={d.name} size={48} variant={d.av||"blue"}/><div style={{flex:1}}><div style={{fontWeight:700}}>{d.name}</div><div style={{fontSize:12,color:T.inkMid}}>{d.spec}</div><div style={{fontSize:12,color:T.inkLight,marginTop:2}}>{da.length} vizite · {da.filter(a=>a.status==="Finalizată").length} finalizate</div></div>{d.name===pat.doctor&&<Tag v="cyan" dot>Curant</Tag>}<Ic n="eye" s={16} c={T.blue}/></div></div>);})}</div>}</div>);

    const MsgsP=()=>{const [nm,setNm]=useState("");const myDoc=docs.find(d=>d.name===pat.doctor);const conv=myMsgs.sort((a,b)=>a.id-b.id);const send=()=>{if(!nm.trim()||!myDoc)return;setMsgs(ms=>[...ms,{id:Date.now(),from:pat.parent||pat.name,fromRole:"patient",fromId:pat.id,to:myDoc.name,toRole:"doctor",toId:myDoc.id,text:nm,date:new Date().toISOString().slice(0,10),read:false}]);setNm("");toast("Trimis");};return (<div className="fade-up"><div style={{fontSize:13,color:T.inkLight,marginBottom:10}}>Cu: <strong>{myDoc?.name||"—"}</strong></div><div className="card" style={{minHeight:300,display:"flex",flexDirection:"column"}}><div style={{flex:1,padding:16,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>{conv.length===0?<Empty icon="msg" title="Niciun mesaj" desc=""/>:conv.map(m=>(<div key={m.id} style={{display:"flex",justifyContent:m.fromRole==="patient"&&m.fromId===pat.id?"flex-end":"flex-start"}}><div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:T.r12,background:m.fromRole==="patient"&&m.fromId===pat.id?`linear-gradient(135deg,${T.success},#047857)`:T.surfaceAlt,color:m.fromRole==="patient"&&m.fromId===pat.id?"#fff":T.ink,fontSize:14,lineHeight:1.5}}>{m.text}<div style={{fontSize:10,marginTop:4,opacity:.6}}>{fmt(m.date)}</div></div></div>))}</div><div style={{borderTop:`1px solid ${T.border}`,padding:12,display:"flex",gap:8}}><input className="inp" placeholder="Scrie..." value={nm} onChange={e=>setNm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} style={{flex:1}}/><button className="btn-p" style={{background:`linear-gradient(135deg,${T.success},#047857)`}} onClick={send} disabled={!nm.trim()}><Ic n="msg" s={14} c="#fff"/></button></div></div></div>);};

    const titles={dashboard:"Cabinetul Meu",appointments:"Programări",services:"Servicii",doctors:"Medicii Mei",messages:"Mesaje"};
    const content={dashboard:<Dash/>,appointments:<Appts/>,services:<Svcs/>,doctors:<Docs/>,messages:<MsgsP/>};
    return (<div style={{minHeight:"100vh",background:T.bg}}><Header name={pat.parent||pat.name} variant="green" role="patient" onLogout={doLogout} mob={mob}/><main style={{padding:mob?"16px 16px 80px":"24px 28px",maxWidth:700,margin:"0 auto"}}><h1 style={{fontSize:mob?20:22,fontWeight:800,marginBottom:16}}>{titles[page]}</h1>{content[page]}</main><BNav items={nav} active={page} set={setPage}/>{showBook&&<BookingModal onClose={()=>setShowBook(false)} preDocId={typeof showBook==="object"?showBook.docId:null} preServiceId={typeof showBook==="object"?showBook.svcId:null} patientId={pat.id} patientName={pat.name}/>}</div>);
  };

  /* ── DOCTOR APP ── */
  const DocApp=()=>{
    const doc=docs.find(d=>d.id===auth.userId);const [page,setPage]=useState("dashboard");const [showQR,setShowQR]=useState(false);const [viewPatId,setViewPatId]=useState(null);
    if(!doc){doLogout();return null;}
    const myPat=pats.filter(p=>p.doctor===doc.name);const myAppt=appts.filter(a=>a.doctorId===doc.id);const myRx=rxs.filter(r=>r.doctorId===doc.id);
    const myMsgs=msgs.filter(m=>(m.fromRole==="doctor"&&m.fromId===doc.id)||(m.toRole==="doctor"&&m.toId===doc.id));const unread=myMsgs.filter(m=>!m.read&&m.toRole==="doctor").length;
    // all patients who ever had an appointment with this doctor
    const allMyPatIds=[...new Set(myAppt.map(a=>a.patientId))];const allMyPats=allMyPatIds.map(id=>pats.find(p=>p.id===id)).filter(Boolean);
    const nav=[{id:"dashboard",l:"Acasă",ic:"home",badge:0},{id:"patients",l:"Pacienți",ic:"users",badge:0},{id:"appointments",l:"Programări",ic:"cal",badge:0},{id:"messages",l:"Mesaje",ic:"msg",badge:unread},{id:"prescriptions",l:"Rețete",ic:"file",badge:0}];

    if(viewPatId){
      const vPat=pats.find(p=>p.id===viewPatId);
      if(!vPat)return null;
      return (<div style={{minHeight:"100vh",background:T.bg}}><Header name={doc.name} variant={doc.av} role="doctor" onLogout={doLogout} mob={mob}/><main style={{padding:mob?"16px 16px 80px":"24px 28px",maxWidth:900,margin:"0 auto"}}>
        <HistoryReport title={`Istoric — ${vPat.name}`} patient={vPat} doctorFilter={doc.id} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={docs} allPats={pats} mob={mob} onBack={()=>setViewPatId(null)}/>
      </main><BNav items={nav} active={page} set={p=>{setViewPatId(null);setPage(p);}}/></div>);
    }

    const Dash=()=>(<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:mob?14:20}}>
      <div className="card" style={{padding:mob?16:24,background:`linear-gradient(135deg,${T.blue},${T.blueDark})`,color:"#fff",border:"none"}}><div style={{display:"flex",alignItems:"center",gap:16}}><Av name={doc.name} size={mob?50:64} variant={doc.av}/><div><div style={{fontSize:mob?18:22,fontWeight:800}}>Bun venit, {doc.name.replace("Dr. ","")}</div><div style={{fontSize:13,opacity:.8,marginTop:3}}>{doc.spec} · {doc.exp}</div></div></div></div>
      <div style={{display:"flex",gap:8}}><button className="btn-g" style={{flex:1,justifyContent:"center"}} onClick={()=>setShowQR(true)}><Ic n="qr" s={14}/> Link & QR</button></div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:mob?10:16}}>
        {[{l:"Pacienți",v:allMyPats.length,ic:"users",c:T.blue,bg:"#EFF6FF",p:"patients"},{l:"Programări",v:myAppt.length,ic:"cal",c:T.cyan,bg:T.cyanDim,p:"appointments"},{l:"Așteptare",v:myAppt.filter(a=>a.status==="În așteptare").length,ic:"clock",c:T.warning,bg:T.warningBg,p:"appointments"},{l:"Mesaje",v:unread,ic:"msg",c:T.purple,bg:T.purpleBg,p:"messages"}].map((s,i)=>(<StatBox key={i} {...s} onClick={()=>setPage(s.p)}/>))}
      </div>
    </div>);

    const Pat=()=>{const [q,setQ]=useState("");const list=allMyPats.filter(p=>!q||p.name.toLowerCase().includes(q.toLowerCase()));return (<div className="fade-up"><div className="sb" style={{marginBottom:14}}><Ic n="srch" s={14} c={T.inkFaint}/><input placeholder="Caută..." value={q} onChange={e=>setQ(e.target.value)}/></div><div style={{fontSize:13,color:T.inkLight,marginBottom:10}}>Apasă pe un pacient pentru istoricul complet:</div>{list.length===0?<div className="card"><Empty icon="users" title="Niciun pacient" desc=""/></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{list.map(p=>{const pa=appts.filter(a=>a.patientId===p.id&&a.doctorId===doc.id);return (<div key={p.id} className="card" style={{padding:16,cursor:"pointer"}} onClick={()=>setViewPatId(p.id)}><div style={{display:"flex",alignItems:"center",gap:12}}><Av name={p.name} size={42} variant="green"/><div style={{flex:1}}><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:12,color:T.inkLight}}>{age(p.dob)} ani · {pa.length} vizite · {pa.filter(a=>a.status==="Finalizată").length} finalizate</div></div><Tag v={PSTATUS[p.status]||"default"} dot>{p.status}</Tag><Ic n="eye" s={16} c={T.blue}/></div></div>);})}</div>}</div>);};

    const Appts=()=>{const [flt,setFlt]=useState("all");const list=myAppt.filter(a=>flt==="all"||a.status===flt).sort((a,b)=>b.date.localeCompare(a.date));return (<div className="fade-up"><div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{["all",...Object.keys(ASTATUS)].map(s=><button key={s} className={`chip ${flt===s?"on":""}`} onClick={()=>setFlt(s)}>{s==="all"?"Toate":s}</button>)}</div>{list.length===0?<div className="card"><Empty icon="cal" title="Nimic" desc=""/></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{list.map(a=><div key={a.id} className="card" style={{padding:16}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{background:`linear-gradient(135deg,${T.blue},${T.cyan})`,borderRadius:T.r8,padding:"7px 10px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.time}</div><div style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>{fmtS(a.date)}</div></div><div style={{flex:1}}><div style={{fontWeight:600}}>{a.patient}</div><div style={{fontSize:12,color:T.inkLight}}>{a.type}</div></div><Tag v={ATYPE[a.type]||"blue"} dot>{a.type}</Tag></div><div style={{display:"flex",gap:8}}>{a.status!=="Anulată"&&a.status!=="Finalizată"&&<button className="btn-d" style={{flex:1,justifyContent:"center"}} onClick={()=>{setAppts(p=>p.map(x=>x.id===a.id?{...x,status:"Anulată"}:x));toast("Anulată","info");}}>Anulează</button>}{a.status==="Confirmată"&&<button className="btn-s" style={{flex:1,justifyContent:"center"}} onClick={()=>{setAppts(p=>p.map(x=>x.id===a.id?{...x,status:"Finalizată"}:x));toast("Finalizată");}}>Finalizează</button>}</div></div>)}</div>}</div>);};

    const MsgsD=()=>{const [nm,setNm]=useState("");const [selP,setSelP]=useState(myPat[0]?.id||null);const conv=msgs.filter(m=>(m.fromRole==="doctor"&&m.fromId===doc.id&&m.toId===selP)||(m.toRole==="doctor"&&m.toId===doc.id&&m.fromId===selP)).sort((a,b)=>a.id-b.id);const send=()=>{if(!nm.trim()||!selP)return;const p=pats.find(x=>x.id===selP);setMsgs(ms=>[...ms,{id:Date.now(),from:doc.name,fromRole:"doctor",fromId:doc.id,to:p?.name||"",toRole:"patient",toId:selP,text:nm,date:new Date().toISOString().slice(0,10),read:false}]);setNm("");toast("Trimis");};return (<div className="fade-up"><FF label="Pacient"><select className="sel" value={selP||""} onChange={e=>setSelP(Number(e.target.value))}>{myPat.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FF><div className="card" style={{marginTop:14,minHeight:300,display:"flex",flexDirection:"column"}}><div style={{flex:1,padding:16,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>{conv.length===0?<Empty icon="msg" title="Niciun mesaj" desc=""/>:conv.map(m=>(<div key={m.id} style={{display:"flex",justifyContent:m.fromRole==="doctor"&&m.fromId===doc.id?"flex-end":"flex-start"}}><div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:T.r12,background:m.fromRole==="doctor"&&m.fromId===doc.id?`linear-gradient(135deg,${T.blue},${T.blueDark})`:T.surfaceAlt,color:m.fromRole==="doctor"&&m.fromId===doc.id?"#fff":T.ink,fontSize:14,lineHeight:1.5}}>{m.text}<div style={{fontSize:10,marginTop:4,opacity:.6}}>{fmt(m.date)}</div></div></div>))}</div><div style={{borderTop:`1px solid ${T.border}`,padding:12,display:"flex",gap:8}}><input className="inp" placeholder="Scrie..." value={nm} onChange={e=>setNm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} style={{flex:1}}/><button className="btn-p" onClick={send} disabled={!nm.trim()}><Ic n="msg" s={14} c="#fff"/></button></div></div></div>);};

    const RxD=()=>{const [show,setShow]=useState(false);const [form,setForm]=useState({patientId:myPat[0]?.id||0,diagnosis:"",medicines:""});const add=()=>{if(!form.diagnosis||!form.medicines)return;const p=pats.find(x=>x.id===form.patientId);setRxs(r=>[...r,{id:Date.now(),patientId:form.patientId,doctorId:doc.id,patientName:p?.name||"",doctorName:doc.name,date:new Date().toISOString().slice(0,10),medicines:form.medicines,diagnosis:form.diagnosis,status:"Activă"}]);setShow(false);setForm({patientId:myPat[0]?.id||0,diagnosis:"",medicines:""});toast("Rețetă emisă");};return (<div className="fade-up"><div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><button className="btn-p" onClick={()=>setShow(true)}><Ic n="plus" s={15} c="#fff"/> Rețetă</button></div>{show&&<div className="ovl" onClick={e=>e.target===e.currentTarget&&setShow(false)}><div className="modal" style={{padding:24}}><div style={{fontWeight:700,fontSize:17,marginBottom:16}}>Rețetă nouă</div><FG mob={mob}><FF label="Pacient" required><select className="sel" value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:Number(e.target.value)}))}>{myPat.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FF><FF label="Diagnostic" required><input className="inp" value={form.diagnosis} onChange={e=>setForm(f=>({...f,diagnosis:e.target.value}))}/></FF><div style={{gridColumn:"1/-1"}}><FF label="Medicamente" required><textarea className="inp" rows={3} value={form.medicines} onChange={e=>setForm(f=>({...f,medicines:e.target.value}))}/></FF></div></FG><div style={{display:"flex",gap:10,marginTop:16}}><button className="btn-g" onClick={()=>setShow(false)}>Anulează</button><button className="btn-p" onClick={add} style={{flex:1}} disabled={!form.diagnosis||!form.medicines}>Emite</button></div></div></div>}{myRx.length===0?<div className="card"><Empty icon="file" title="Nicio rețetă" desc=""/></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{myRx.map(r=><div key={r.id} className="card" style={{padding:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontWeight:700}}>{r.patientName}</span><Tag v={r.status==="Activă"?"green":"default"}>{r.status}</Tag></div><div style={{fontSize:14,fontWeight:600,color:T.blue}}>{r.diagnosis}</div><div style={{fontSize:13,color:T.inkMid,marginTop:4}}>{r.medicines}</div></div>)}</div>}</div>);};

    const titles={dashboard:"Cabinet Medical",patients:"Pacienții Mei",appointments:"Programări",messages:"Mesaje",prescriptions:"Rețete"};
    const content={dashboard:<Dash/>,patients:<Pat/>,appointments:<Appts/>,messages:<MsgsD/>,prescriptions:<RxD/>};
    return (<div style={{minHeight:"100vh",background:T.bg}}><Header name={doc.name} variant={doc.av} role="doctor" onLogout={doLogout} mob={mob}/><main style={{padding:mob?"16px 16px 80px":"24px 28px",maxWidth:900,margin:"0 auto"}}><h1 style={{fontSize:mob?20:22,fontWeight:800,marginBottom:16}}>{titles[page]}</h1>{content[page]}</main><BNav items={nav} active={page} set={setPage}/>{showQR&&<QRModal onClose={()=>setShowQR(false)} title={`Programare — ${doc.name}`} linkText={`doctor/${doc.id}`}/>}</div>);
  };

  /* ── ADMIN APP ── */
  const AdmApp=()=>{
    const [page,setPage]=useState("dashboard");const [viewPatId,setViewPatId]=useState(null);const [showAddSvc,setShowAddSvc]=useState(false);const [svcForm,setSvcForm]=useState({name:"",desc:"",price:"",duration:"",docIds:[]});const [showSvcQR,setShowSvcQR]=useState(false);
    const nav=[{id:"dashboard",l:"Panou",ic:"home",badge:0},{id:"patients",l:"Pacienți",ic:"users",badge:0},{id:"doctors",l:"Medici",ic:"steth",badge:0},{id:"appointments",l:"Programări",ic:"cal",badge:0},{id:"services",l:"Servicii",ic:"svc",badge:0},{id:"requests",l:"Cereri",ic:"bell",badge:delReqs.filter(r=>r.status==="pending").length}];

    if(viewPatId){
      const vPat=pats.find(p=>p.id===viewPatId);
      if(!vPat)return null;
      return (<div style={{minHeight:"100vh",background:T.bg}}><Header name="Admin Clinică" variant="orange" role="admin" onLogout={doLogout} mob={mob}/><main style={{padding:mob?"16px 16px 80px":"24px 28px",maxWidth:1000,margin:"0 auto"}}>
        <HistoryReport title={`Raport complet — ${vPat.name}`} patient={vPat} doctorFilter={null} allAppts={appts} allRx={rxs} allMsgs={msgs} allDocs={docs} allPats={pats} mob={mob} onBack={()=>setViewPatId(null)}/>
      </main><BNav items={nav} active={page} set={p=>{setViewPatId(null);setPage(p);}}/></div>);
    }

    const Dash=()=>(<div className="fade-up" style={{display:"flex",flexDirection:"column",gap:mob?14:20}}>
      <div className="card" style={{padding:mob?16:24,background:"linear-gradient(135deg,#EA580C,#9A3412)",color:"#fff",border:"none"}}><div style={{display:"flex",alignItems:"center",gap:16}}><Av name="Admin" size={mob?50:64} variant="orange"/><div><div style={{fontSize:mob?18:22,fontWeight:800}}>Panou Administrator</div><div style={{fontSize:13,opacity:.8,marginTop:3}}>{pats.length} pacienți · {docs.length} medici · {svcs.length} servicii</div></div></div></div>
      {delReqs.filter(r=>r.status==="pending").length>0&&<div className="card" style={{padding:16,borderLeft:`4px solid ${T.warning}`,cursor:"pointer"}} onClick={()=>setPage("requests")}><div style={{display:"flex",alignItems:"center",gap:8}}><Ic n="bell" s={16} c={T.warning}/><span style={{fontWeight:700,color:T.warning}}>{delReqs.filter(r=>r.status==="pending").length} cereri în așteptare</span></div></div>}
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"repeat(4,1fr)",gap:mob?10:16}}>
        {[{l:"Pacienți",v:pats.length,ic:"users",c:T.blue,bg:"#EFF6FF",p:"patients"},{l:"Medici",v:docs.length,ic:"steth",c:T.purple,bg:T.purpleBg,p:"doctors"},{l:"Programări",v:appts.length,ic:"cal",c:T.cyan,bg:T.cyanDim,p:"appointments"},{l:"Servicii",v:svcs.length,ic:"svc",c:T.success,bg:T.successBg,p:"services"}].map((s,i)=>(<StatBox key={i} {...s} onClick={()=>setPage(s.p)}/>))}
      </div>
      <div className="card" style={{padding:mob?16:24}}>
        <div style={{fontWeight:700,marginBottom:14}}>Raport rapid</div>
        {[{l:"Programări finalizate",v:appts.filter(a=>a.status==="Finalizată").length,c:T.success},{l:"Programări în așteptare",v:appts.filter(a=>a.status==="În așteptare").length,c:T.warning},{l:"Programări anulate",v:appts.filter(a=>a.status==="Anulată").length,c:T.danger}].map(item=>(
          <div key={item.l} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:T.inkMid}}>{item.l}</span><span style={{fontSize:13,fontWeight:700}}>{item.v}/{appts.length}</span></div><div className="pbar"><div className="pfill" style={{width:`${(item.v/Math.max(appts.length,1))*100}%`,background:item.c}}/></div></div>
        ))}
      </div>
    </div>);

    const AllPat=()=>{const [q,setQ]=useState("");const list=pats.filter(p=>!q||p.name.toLowerCase().includes(q.toLowerCase())||p.email?.toLowerCase().includes(q.toLowerCase()));return (<div className="fade-up"><div className="sb" style={{marginBottom:14}}><Ic n="srch" s={14} c={T.inkFaint}/><input placeholder="Caută pacient..." value={q} onChange={e=>setQ(e.target.value)}/></div><div style={{fontSize:13,color:T.inkLight,marginBottom:10}}>Apasă pe un pacient pentru raportul complet:</div>{list.map(p=>{const pDocs=[...new Set(appts.filter(a=>a.patientId===p.id).map(a=>a.doctorId))].length;return (<div key={p.id} className="card" style={{padding:14,marginBottom:8,cursor:"pointer"}} onClick={()=>setViewPatId(p.id)}><div style={{display:"flex",alignItems:"center",gap:12}}><Av name={p.name} size={40} variant="green"/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600}}>{p.name} <span style={{fontWeight:400,color:T.inkFaint,fontSize:12}}>({p.email})</span></div><div style={{fontSize:12,color:T.inkLight}}>{age(p.dob)} ani · {p.doctor} · {pDocs} medici vizitați</div></div><Tag v={PSTATUS[p.status]||"default"} dot>{p.status}</Tag><Ic n="eye" s={16} c={T.blue}/><button className="btn-d" style={{padding:"6px 8px"}} onClick={e=>{e.stopPropagation();setPats(ps=>ps.filter(x=>x.id!==p.id));toast("Șters","info");}}><Ic n="trash" s={13}/></button></div></div>);})}</div>);};

    const AllDoc=()=>(<div className="fade-up"><div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>{docs.map(d=>{const dPats=pats.filter(p=>p.doctor===d.name).length;const dAppts=appts.filter(a=>a.doctorId===d.id).length;return (<div key={d.id} className="card" style={{padding:0,overflow:"hidden"}}><div style={{height:4,background:d.on?`linear-gradient(90deg,${T.blue},${T.cyan})`:T.border}}/><div style={{padding:16}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><Av name={d.name} size={48} variant={d.av}/><div style={{flex:1}}><div style={{fontWeight:700}}>{d.name}</div><div style={{fontSize:12,color:T.inkMid}}>{d.spec} · {d.email}</div></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>{[["Pac.",dPats,T.blue],["Prog.",dAppts,T.cyan],["Exp.",d.exp,T.purple]].map(([k,v,c])=><div key={k} style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,borderRadius:T.r8,padding:8,textAlign:"center"}}><div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:T.inkFaint}}>{k}</div></div>)}</div><div style={{display:"flex",gap:6}}><button className="btn-g" style={{flex:1,justifyContent:"center",fontSize:12}} onClick={()=>{setDocs(ds=>ds.map(x=>x.id===d.id?{...x,on:!x.on}:x));toast(d.on?"Dezactivat":"Activat");}}>{d.on?"Dezactivează":"Activează"}</button><button className="btn-d" style={{padding:"8px 10px"}} onClick={()=>{setDocs(ds=>ds.filter(x=>x.id!==d.id));toast("Șters","info");}}><Ic n="trash" s={13}/></button></div></div></div>);})}</div></div>);

    const AllAppt=()=>{const [flt,setFlt]=useState("all");const list=appts.filter(a=>flt==="all"||a.status===flt);return (<div className="fade-up"><div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{["all",...Object.keys(ASTATUS)].map(s=><button key={s} className={`chip ${flt===s?"on":""}`} onClick={()=>setFlt(s)}>{s==="all"?"Toate":s}</button>)}</div>{list.map(a=><div key={a.id} className="card" style={{padding:14,marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{background:"linear-gradient(135deg,#EA580C,#9A3412)",borderRadius:T.r8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{a.time}</div><div style={{fontSize:9,color:"rgba(255,255,255,.7)"}}>{fmtS(a.date)}</div></div><div style={{flex:1}}><div style={{fontWeight:600}}>{a.patient}</div><div style={{fontSize:12,color:T.inkLight}}>{a.doctor} · {a.type}</div></div><Tag v={ASTATUS[a.status]||"default"} dot>{a.status}</Tag></div><div style={{display:"flex",gap:8}}><select value={a.status} onChange={e=>{setAppts(p=>p.map(x=>x.id===a.id?{...x,status:e.target.value}:x));toast("Actualizat");}} style={{flex:1,border:`1.5px solid ${T.border}`,background:T.surface,borderRadius:T.r8,padding:8,fontSize:14,fontWeight:700,outline:"none"}}>{Object.keys(ASTATUS).map(s=><option key={s}>{s}</option>)}</select><button className="btn-d" style={{padding:"8px 10px"}} onClick={()=>{setAppts(p=>p.filter(x=>x.id!==a.id));toast("Șters","info");}}><Ic n="trash" s={13}/></button></div></div>)}</div>);};

    const SvcsAdm=()=>(<div className="fade-up"><div style={{display:"flex",gap:8,marginBottom:14,justifyContent:"space-between"}}><button className="btn-g" onClick={()=>setShowSvcQR(true)}><Ic n="qr" s={14}/> QR Servicii</button><button className="btn-p" onClick={()=>setShowAddSvc(true)}><Ic n="plus" s={15} c="#fff"/> Serviciu nou</button></div>{svcs.map(s=>{const sd=docs.filter(d=>d.services?.includes(s.id));return (<div key={s.id} className="card" style={{padding:16,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontWeight:700}}>{s.name}</span><div style={{display:"flex",gap:6}}><Tag v={s.active?"green":"default"}>{s.active?"Activ":"Inactiv"}</Tag><Tag v="blue">{s.price}</Tag></div></div><div style={{fontSize:13,color:T.inkMid,marginBottom:6}}>{s.desc} · {s.duration}</div><div style={{fontSize:12,color:T.inkLight,marginBottom:8}}>Medici: {sd.length===0?"—":sd.map(d=>d.name).join(", ")}</div><div style={{display:"flex",gap:6}}><button className="btn-g" style={{flex:1,justifyContent:"center",fontSize:12}} onClick={()=>{setSvcs(sv=>sv.map(x=>x.id===s.id?{...x,active:!x.active}:x));toast(s.active?"Dezactivat":"Activat");}}>{s.active?"Dezactivează":"Activează"}</button><button className="btn-d" style={{padding:"8px 10px"}} onClick={()=>{setSvcs(sv=>sv.filter(x=>x.id!==s.id));toast("Șters","info");}}><Ic n="trash" s={13}/></button></div></div>);})}</div>);

    const Reqs=()=>(<div className="fade-up">{delReqs.length===0?<div className="card"><Empty icon="bell" title="Nicio cerere" desc=""/></div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>{delReqs.map(r=><div key={r.id} className="card" style={{padding:16}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av name={r.doctorName} size={36} variant="blue"/><div style={{flex:1}}><div style={{fontWeight:600}}>{r.doctorName}</div><div style={{fontSize:12,color:T.inkLight}}>Ștergere: <strong>{r.patientName}</strong></div></div><Tag v={r.status==="pending"?"yellow":r.status==="approved"?"green":"red"} dot>{r.status==="pending"?"Așteptare":r.status==="approved"?"Aprobată":"Respinsă"}</Tag></div>{r.status==="pending"&&<div style={{display:"flex",gap:8}}><button className="btn-s" style={{flex:1,justifyContent:"center"}} onClick={()=>{setPats(p=>p.filter(x=>x.id!==r.patientId));setDelReqs(rs=>rs.map(x=>x.id===r.id?{...x,status:"approved"}:x));toast("Aprobată");}}>Aprobă</button><button className="btn-d" style={{flex:1,justifyContent:"center"}} onClick={()=>{setDelReqs(rs=>rs.map(x=>x.id===r.id?{...x,status:"rejected"}:x));toast("Respinsă","info");}}>Respinge</button></div>}</div>)}</div>}</div>);

    const titles={dashboard:"Panou Administrare",patients:`Pacienți (${pats.length})`,doctors:`Medici (${docs.length})`,appointments:`Programări (${appts.length})`,services:`Servicii (${svcs.length})`,requests:"Cereri ștergere"};
    const content={dashboard:<Dash/>,patients:<AllPat/>,doctors:<AllDoc/>,appointments:<AllAppt/>,services:<SvcsAdm/>,requests:<Reqs/>};
    return (<div style={{minHeight:"100vh",background:T.bg}}><Header name="Admin Clinică" variant="orange" role="admin" onLogout={doLogout} mob={mob}/><main style={{padding:mob?"16px 16px 80px":"24px 28px",maxWidth:1000,margin:"0 auto"}}><h1 style={{fontSize:mob?20:22,fontWeight:800,marginBottom:16}}>{titles[page]}</h1>{content[page]}</main><BNav items={nav} active={page} set={setPage}/>
      {showAddSvc&&<div className="ovl" onClick={e=>e.target===e.currentTarget&&setShowAddSvc(false)}><div className="modal" style={{padding:24}}><div style={{fontWeight:700,fontSize:17,marginBottom:16}}>Serviciu nou</div><FG mob={mob}><FF label="Denumire" required><input className="inp" value={svcForm.name} onChange={e=>setSvcForm(f=>({...f,name:e.target.value}))}/></FF><FF label="Preț"><input className="inp" placeholder="150 RON" value={svcForm.price} onChange={e=>setSvcForm(f=>({...f,price:e.target.value}))}/></FF><FF label="Durată"><input className="inp" placeholder="30 min" value={svcForm.duration} onChange={e=>setSvcForm(f=>({...f,duration:e.target.value}))}/></FF><div style={{gridColumn:"1/-1"}}><FF label="Descriere"><textarea className="inp" rows={2} value={svcForm.desc} onChange={e=>setSvcForm(f=>({...f,desc:e.target.value}))}/></FF></div><div style={{gridColumn:"1/-1"}}><FF label="Medici"><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>{docs.map(d=>{const sel=svcForm.docIds.includes(d.id);return <button key={d.id} className={`chip ${sel?"on":""}`} onClick={()=>setSvcForm(f=>({...f,docIds:sel?f.docIds.filter(x=>x!==d.id):[...f.docIds,d.id]}))}>{d.name.replace("Dr. ","")}</button>;})}</div></FF></div></FG><div style={{display:"flex",gap:10,marginTop:16}}><button className="btn-g" onClick={()=>setShowAddSvc(false)}>Anulează</button><button className="btn-p" onClick={()=>{if(!svcForm.name)return;const nid=Date.now();setSvcs(s=>[...s,{id:nid,name:svcForm.name,desc:svcForm.desc,price:svcForm.price,duration:svcForm.duration,active:true}]);if(svcForm.docIds.length>0)setDocs(ds=>ds.map(d=>svcForm.docIds.includes(d.id)?{...d,services:[...(d.services||[]),nid]}:d));setShowAddSvc(false);setSvcForm({name:"",desc:"",price:"",duration:"",docIds:[]});toast("Adăugat!");}} style={{flex:1}} disabled={!svcForm.name}>Adaugă</button></div></div></div>}
      {showSvcQR&&<QRModal onClose={()=>setShowSvcQR(false)} title="Programare — Servicii" linkText="services"/>}
    </div>);
  };

  return (<>
    <GS/>
    {!auth?<AuthScr/>:auth.role==="admin"?<AdmApp/>:auth.role==="doctor"?<DocApp/>:<PatApp/>}
    {toastD&&<Toast key={toastD.k} msg={toastD.msg} type={toastD.type} onClose={()=>setToastD(null)}/>}
  </>);
}