import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DeliveryStory as C} from '../src/story-engine-v533.js';
import {resolveLines,createViewer} from '../src/story-vn-v533.js';
import {SCRIPT} from '../src/story-script-v534.js';
const EP1_SPEAKERS=new Set(['기록','시스템','연출 목업','배서준','턱검룡']);
const branches=[{flags:{gate:'smash'},bills:1200},{flags:{gate:'terms'},bills:300}];
const stateFor=b=>({...C.create(),...b});
const resolve=(id,b)=>resolveLines({id,lines:[]},stateFor(b),SCRIPT);
const original=(id,b)=>resolveLines(C.events.find(e=>e.id===id),stateFor(b)).map(l=>JSON.stringify([l.who,l.text]));
test('every script entry targets a real episode-1 event and keeps the original canon lines in order',()=>{
for(const id of Object.keys(SCRIPT)){const ev=C.events.find(e=>e.id===id);assert.ok(ev,id);assert.equal(ev.ch,1);
for(const b of branches){const now=resolve(id,b).map(l=>JSON.stringify([l.who,l.text])),orig=original(id,b);let at=-1;for(const line of orig){const i=now.indexOf(line,at+1);assert.ok(i>at,id+' lost an original line: '+line);at=i;}assert.ok(now.length>=orig.length);}}
assert.deepEqual(Object.keys(SCRIPT).sort(),C.events.filter(e=>e.ch===1).map(e=>e.id).sort());});
test('episode 1 stays solo: only Bae Seojun and the checkpoint dragon speak, and every line resolves to text',()=>{
for(const id of Object.keys(SCRIPT))for(const b of branches)for(const l of resolve(id,b)){assert.ok(EP1_SPEAKERS.has(l.who),id+' '+l.who);assert.equal(typeof l.text,'string');assert.ok(l.text.length>3&&!/undefined|NaN|\[object/.test(l.text),id+': '+l.text);}});
test('the script explains why the fight happens on both choices',()=>{
for(const b of branches){const reply=resolve('gateReply',b).map(l=>l.text).join(' '),fight=resolve('gateFight',b).map(l=>l.text).join(' ');
assert.match(reply,/교전/);assert.match(reply,/대화 창구는 교전 종료 후/);assert.match(fight,/분신/);assert.match(fight,/단독 출입 통과/);}
const gate=resolve('gate',branches[0]).map(l=>l.text).join(' ');assert.match(gate,/출입증/);assert.match(gate,/발급소는 문 안쪽/);assert.match(resolve('arrival',branches[0]).map(l=>l.text).join(' '),/59,000원/);
assert.match(resolve('gateReply',branches[0])[1].text,/훼손/);assert.match(resolve('gateReply',branches[1])[1].text,/이의/);
assert.match(resolve('chapter1',branches[0])[1].text,/1,200원/);assert.match(resolve('chapter1',branches[1])[2].text,/300원/);});
test('episode 1 has enough text for roughly two to four minutes of reading',()=>{
for(const b of branches){let lines=0,chars=0;for(const id of Object.keys(SCRIPT))for(const l of resolve(id,b)){lines++;chars+=l.text.length;}assert.ok(lines>=50,String(lines));assert.ok(chars>=1500&&chars<=4500,String(chars));}});
test('viewer with the script reads all lines, keeps the same choices and reaches the ending',()=>{
const mem=()=>{let t='';return {read:()=>t,write:x=>{t=x;return true;}};};
const base=createViewer(C,mem());base.start();assert.equal(base.view().total,4);
const v=createViewer(C,mem(),SCRIPT);v.start();let view=v.view();assert.equal(view.total,16);assert.equal(view.line.who,'기록');
let guard=0;const seen=new Set();while(!(view.end&&view.last)&&guard++<3000){view=v.view();if(view.end&&view.last)break;if(!view.last){v.advance();continue;}seen.add(view.id+':'+view.actions.map(a=>a.id).join(','));const pool=view.type==='choice'?view.actions:[view.actions[0]],a=pool[guard%pool.length];assert.ok(v.act(a.id,view.rev,view.token));view=v.view();}
assert.equal(v.view().end,true);assert.deepEqual(v.view().party,['bae','park','choi']);
assert.ok(seen.has('gate:smash,terms'));assert.ok(seen.has('gateFight:win,lose'));assert.ok(seen.has('arrival:next'));});
test('script lines never change engine data used by saves',()=>{
const before=JSON.stringify(C.events.map(e=>[e.ch,e.id,e.type,e.join||null,e.encounter||null,(e.options||[]).map(o=>[o.id,o.label,o.cost])]));
const v=createViewer(C,{read:()=>'',write:()=>true},SCRIPT);v.start();v.skip();const view=v.view();v.act(view.actions[0].id,view.rev,view.token);
assert.equal(JSON.stringify(C.events.map(e=>[e.ch,e.id,e.type,e.join||null,e.encounter||null,(e.options||[]).map(o=>[o.id,o.label,o.cost])])),before);});
