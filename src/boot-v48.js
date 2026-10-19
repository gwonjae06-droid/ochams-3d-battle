const SRC='./party-battle.js?v=4.7';
const PATCH=[
['./party-rules.js?v=4.5','./party-rules.js?v=4.8'],
["import * as T from 'three';","import * as T from 'three';\nimport {createTheme} from './stage-theme.js?v=4.8';"],
["const SL=createSlime(A,V,EX),STA=createStatue(A,V,EX);","const SL=createSlime(A,V,EX),STA=createStatue(A,V,EX);const TH=createTheme(A,V,EX,OX);"],
["r=new PartyRules(id,id===3?campaign.unlocked3:campaign.unlocked);","r=new PartyRules(id,id===3?campaign.unlocked3:campaign.unlocked);TH.set(id);"],
["bHit(tot*.4,true)","bHit(i=>(24+r.party[i].stacks*6)*.4,true)"],
["bHit(tot*.15)","bHit(i=>(24+r.party[i].stacks*6)*.15)"],
["events.bs=r.stacks","events.bs=r.stackMax"],
["sm.stacks=r.stacks","sm.stacks=r.stackMax"],
["$('result').hidden=mode!=='over';M.setPhase(r.phase,mode==='over');","$('result').hidden=mode!=='over';M.setPhase(r.phase,mode==='over');TH.hud(r);"],
["t+=freeze>0?dt*.08:dt;","t+=freeze>0?dt*.08:dt*(fm==='boss'?TH.slow():1);"],
["(fm==='idle'||fm==='over')?6:15;","(fm==='idle'||fm==='over')?6:(fm==='boss'?10:15);"],
["DT=dt;last=now;","DT=dt;last=now;TH.tick(now,dt,r,[P.pos(0),P.pos(1)]);"],
["r.enterPhase2();if(r.boss===2)SL.setTone(2);","r.enterPhase2();TH.phase(r.phase);if(r.boss===2)SL.setTone(2);"],
["M.setEnabled(enabled);CS.setEnabled(enabled);","M.setEnabled(enabled);CS.setEnabled(enabled);TH.enable(enabled);"]
];
export function applyPatches(src){const missing=[];for(const [a,b] of PATCH){if(!src.includes(a)){missing.push(a.slice(0,48));continue;}src=src.replace(a,()=>b);}return {src,missing};}
export function absolutize(src,base){return src.replace(/(from\s+)'(\.\/[^']+)'/g,(m,a,s)=>a+"'"+new URL(s,base).href+"'");}
async function boot(){
const base=new URL(SRC,import.meta.url),status=m=>{const s=document.getElementById('status');if(s)s.textContent=m;};
let url=null,missing=[];
try{const res=await fetch(base);if(!res.ok)throw Error('HTTP '+res.status);const out=applyPatches(await res.text());missing=out.missing;url=URL.createObjectURL(new Blob([absolutize(out.src,base)],{type:'text/javascript'}));}catch(e){console.error('패치 준비 실패',e);}
if(missing.length)console.warn('적용되지 않은 패치',missing);
try{await import(url||base.href);}
catch(e){console.error(e);if(url&&e instanceof SyntaxError){try{await import(base.href);status('패치 로딩 실패로 기본 버전으로 실행합니다');return;}catch(e2){console.error(e2);}}status('로딩 실패: '+e.message);}
if(missing.length){const d=document.createElement('div');d.textContent='패치 '+missing.length+'개 미적용(콘솔 확인)';d.style.cssText='position:fixed;left:8px;bottom:4px;font-size:10px;color:#fca5a5;z-index:40;pointer-events:none';document.body.appendChild(d);}
}
boot();
