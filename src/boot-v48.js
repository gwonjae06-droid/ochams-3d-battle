import {installMenu} from './story-menu.js?v=4.9';
const BASE=[
['./party-rules.js?v=4.5','./park-rules-v53.js?v=5.3'],
["import * as T from 'three';","import * as T from 'three';\nimport {createTheme} from './stage-theme.js?v=4.8';\nimport {createQuiz,punish} from './philosophy-quiz.js?v=4.9';\nimport {createPark} from './park-enhance.js?v=5.3';"],
['const SL=createSlime(A,V,EX),STA=createStatue(A,V,EX);',"const SL=createSlime(A,V,EX),STA=createStatue(A,V,EX);const TH=createTheme(A,V,EX,OX),QZ=createQuiz();const PK=createPark(A,V,EX,OX,{state:()=>r,hit:hHit,ui,notice:display,sound:(k,b)=>M.sfx(k,b),impact:(f,s)=>{flash=Math.max(flash,f);shake=Math.max(shake,s);}});P.park=PK.actor;const posBefore=P.pos;P.pos=i=>i===2?PK.actor.hero.position.clone():posBefore(i);"],
['r=new PartyRules(id,id===3?campaign.unlocked3:campaign.unlocked);','r=new PartyRules(id,id===3?campaign.unlocked3:campaign.unlocked);TH.set(id);PK.reset();'],
['bHit(tot*.4,true)','bHit(i=>(24+r.party[i].stacks*6)*.4,true)'],['bHit(tot*.15)','bHit(i=>(24+r.party[i].stacks*6)*.15)'],['events.bs=r.stacks','events.bs=r.stackMax'],['sm.stacks=r.stacks','sm.stacks=r.stackMax'],
["$('result').hidden=mode!=='over';M.setPhase(r.phase,mode==='over');","$('result').hidden=mode!=='over';M.setPhase(r.phase,mode==='over');TH.hud(r);PK.hud();"],
['t+=freeze>0?dt*.08:dt;',"t+=freeze>0?dt*.08:dt*(fm==='boss'?TH.slow():1);"],
["(fm==='idle'||fm==='over')?6:15;","(fm==='idle'||fm==='over')?6:(fm==='boss'?10:15);"],
['DT=dt;last=now;','DT=dt;last=now;TH.tick(now,dt,r,[P.pos(0),P.pos(1),P.pos(2)]);PK.marks(now);'],
['r.enterPhase2();if(r.boss===2)SL.setTone(2);','r.enterPhase2();TH.phase(r.phase);if(r.boss===2)SL.setTone(2);'],
['M.setEnabled(enabled);CS.setEnabled(enabled);','M.setEnabled(enabled);CS.setEnabled(enabled);TH.enable(enabled);'],
['const out=r.endBoss();progress(out.next);',"const out=r.endBoss();if(QZ.due(r,out.next)){start('quiz');QZ.ask(r).then(ok=>{if(!ok){const hits=punish(r);textP(hits.map(x=>x.name+' -'+x.damage+(x.blocked?' (보호막)':'')).join(' / '));M.sfx('detonate',true);shake=.6;flash=.2;ui();}progress(r.party.every(a=>a.hp<=0)?'lose':out.next);});}else progress(out.next);"],
['function victory(){campaign.clear(r.boss);',"function victory(){campaign.clear(r.boss);const completed=r.boss;queueMicrotask(()=>window.dispatchEvent(new CustomEvent('ochams-win',{detail:{boss:completed}})));"],
["$('result').textContent='파티 전멸';","$('result').textContent='파티 전멸';window.dispatchEvent(new CustomEvent('ochams-lose',{detail:{boss:r.boss}}));"],
['function actionName(action,idx=r.active){const a=r.party[idx];',"function actionName(action,idx=r.active){if(r.party[idx].id==='park')return PK.name(action);const a=r.party[idx];"],
['function progress(next){',"function progress(next){const before=plan;if(PK.intercept(next,p=>{plan=p;start('followup');},n=>{plan=before;progress(n);})){return;}"],
['P.resetFrame();','P.resetFrame();PK.rest();PK.idle(mode,plan,performance.now(),P.choi);'],
['for(const o of [A,P.choi])','for(const o of [A,P.choi,P.park])'],
['const actor=i===0?A:P.choi;','const actor=[A,P.choi,P.park][i];'],
["for(let i=0;i<2;i++)$('ult'+i).onclick=()=>queueUlt(i);","for(let i=0;i<r.party.length;i++)$('ult'+i).onclick=()=>queueUlt(i);"],
["if(['attack','skill','ult'].includes(fm)&&plan.actor===1)","if(mode===fm&&['attack','skill','ult'].includes(fm)&&plan.actor===1)"],
["if(fm==='transition'){", "if(mode===fm&&['attack','skill','ult'].includes(fm)&&plan.actor===2){if(PK.tick(fm,t,plan))finishHero();}\nif(fm==='followup'&&mode===fm){if(PK.tick('followup',t,plan))PK.complete();}\nif(fm==='transition'){"],
['배서준 → 최규원 → 보스 · 현재 ','속도 기반 행동 순서 · 현재 ']
];
function replaceOne(s,a,b){if(s.split(a).length!==2)throw Error('연결 위치 확인 실패: '+a.slice(0,50));return s.replace(a,()=>b);}
function block(s,start,end,body){const i=s.indexOf(start),j=s.indexOf(end,i);if(i<0||j<0)throw Error('전투 구조가 변경되었습니다: '+start);return s.slice(0,i)+body+s.slice(j);}
export function patch(s,base){for(const [a,b] of BASE)s=replaceOne(s,a,b);s=block(s,'function turnList(){','\nfunction ui(){','function turnList(){return r.forecast();}');s=block(s,'function dmgUi(){','\nfunction flood(',"function dmgUi(){const sum=dmgLog.reduce((a,b)=>a+b,0);dmgEl.classList.toggle('on',sum>0);dmgEl.innerHTML='<small>이번 턴 아군 피해</small><b>'+Math.round(sum)+'</b><small>'+r.party.map((a,i)=>a.name+' '+Math.round(dmgLog[i])).join(' · ')+'</small>';}");
s=s.split('for(let i=0;i<2;i++)').join('for(let i=0;i<r.party.length;i++)').split('[0,1].map').join('[0,1,2].map').split('[0,1].filter').join('[0,1,2].filter').split('recoil=[0,0]').join('recoil=[0,0,0]').split('dmgLog=[0,0]').join('dmgLog=[0,0,0]');
s+='\nwindow.__ochamsGame={state:()=>r,busy:()=>!["idle","target","over"].includes(mode),selectBoss};\n';return s.replace(/(from\s+)'(\.\/[^']+)'/g,(_,p,x)=>p+"'"+new URL(x,base).href+"'");}
async function boot(){let blob;try{const base=new URL('./party-battle.js?v=4.7',import.meta.url),res=await fetch(base,{cache:'no-cache'});if(!res.ok)throw Error('HTTP '+res.status);const src=patch(await res.text(),base);blob=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));await import(blob);installMenu(window.__ochamsGame);document.title='오챔스 · 박성원 3인 파티';}catch(e){console.error(e);const el=document.getElementById('status');if(el)el.textContent='로딩 실패: '+e.message;}finally{if(blob)URL.revokeObjectURL(blob);}}
boot();
