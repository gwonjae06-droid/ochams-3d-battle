import {installMenu} from './story-menu.js?v=4.9';
const PATCH=[
['./party-rules.js?v=4.5','./difficulty-rules.js?v=4.9'],
["import * as T from 'three';","import * as T from 'three';\nimport {createTheme} from './stage-theme.js?v=4.8';\nimport {createQuiz,punish} from './philosophy-quiz.js?v=4.9';"],
['const SL=createSlime(A,V,EX),STA=createStatue(A,V,EX);','const SL=createSlime(A,V,EX),STA=createStatue(A,V,EX);const TH=createTheme(A,V,EX,OX),QZ=createQuiz();'],
['r=new PartyRules(id,id===3?campaign.unlocked3:campaign.unlocked);','r=new PartyRules(id,id===3?campaign.unlocked3:campaign.unlocked);TH.set(id);'],
['bHit(tot*.4,true)','bHit(i=>(24+r.party[i].stacks*6)*.4,true)'],
['bHit(tot*.15)','bHit(i=>(24+r.party[i].stacks*6)*.15)'],
['events.bs=r.stacks','events.bs=r.stackMax'],
['sm.stacks=r.stacks','sm.stacks=r.stackMax'],
["$('result').hidden=mode!=='over';M.setPhase(r.phase,mode==='over');","$('result').hidden=mode!=='over';M.setPhase(r.phase,mode==='over');TH.hud(r);"],
['t+=freeze>0?dt*.08:dt;',"t+=freeze>0?dt*.08:dt*(fm==='boss'?TH.slow():1);"],
["(fm==='idle'||fm==='over')?6:15;","(fm==='idle'||fm==='over')?6:(fm==='boss'?10:15);"],
['DT=dt;last=now;','DT=dt;last=now;TH.tick(now,dt,r,[P.pos(0),P.pos(1)]);'],
['r.enterPhase2();if(r.boss===2)SL.setTone(2);','r.enterPhase2();TH.phase(r.phase);if(r.boss===2)SL.setTone(2);'],
['M.setEnabled(enabled);CS.setEnabled(enabled);','M.setEnabled(enabled);CS.setEnabled(enabled);TH.enable(enabled);'],
['const out=r.endBoss();progress(out.next);',"const out=r.endBoss();if(QZ.due(r,out.next)){start('quiz');QZ.ask(r).then(ok=>{if(!ok){const hits=punish(r);textP(hits.map(x=>x.name+' -'+x.damage+(x.blocked?' (보호막)':'')).join(' / '));M.sfx('detonate',true);shake=.6;flash=.2;ui();}progress(r.party.every(a=>a.hp<=0)?'lose':out.next);});}else progress(out.next);"],
['function victory(){campaign.clear(r.boss);',"function victory(){campaign.clear(r.boss);const completed=r.boss;queueMicrotask(()=>window.dispatchEvent(new CustomEvent('ochams-win',{detail:{boss:completed}})));"],
["$('result').textContent='파티 전멸';","$('result').textContent='파티 전멸';window.dispatchEvent(new CustomEvent('ochams-lose',{detail:{boss:r.boss}}));"]
];
export function patch(source,base){for(const [a,b] of PATCH){if(source.split(a).length!==2)throw Error('전투 연결 위치가 변경되었습니다: '+a.slice(0,45));source=source.replace(a,()=>b);}source+='\nwindow.__ochamsGame={state:()=>r,busy:()=>!["idle","target","over"].includes(mode),selectBoss};\n';return source.replace(/(from\s+)'(\.\/[^']+)'/g,(_,p,s)=>p+"'"+new URL(s,base).href+"'");}
async function boot(){let blob;try{const base=new URL('./party-battle.js?v=4.7',import.meta.url),res=await fetch(base,{cache:'no-cache'});if(!res.ok)throw Error('HTTP '+res.status);const src=patch(await res.text(),base);blob=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));await import(blob);installMenu(window.__ochamsGame);document.title='오챔스 · 스토리 v4.9';}catch(e){console.error(e);const s=document.getElementById('status');if(s)s.textContent='로딩 실패: '+e.message;}finally{if(blob)URL.revokeObjectURL(blob);}}
boot();
