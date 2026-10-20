import {BRIDGES,installPortraits} from './story-refinement-v535.js?v=5.35';
if(typeof document!=='undefined')queueMicrotask(()=>{try{installPortraits();}catch(e){console.warn('초상 표시 건너뜀',e);}});
export const EPISODES=6;
export const NARRATORS=new Set(['기록','시스템','정산','연출 목업']);
export const TYPE_LABEL={dialogue:'대화',choice:'선택',join:'동료 합류',battle:'전투 목업',scene:'연출 목업','chapter-end':'화 완료',receipt:'정산',end:'마무리'};
const PARTY={bae:{name:'배서준',color:'#5fb0ff'},park:{name:'박성원',color:'#c58cff'},choi:{name:'최규원',color:'#ff8a5c'}};
const BOSSES={'턱검룡':{id:'dragon',color:'#8ea2ff'},'윤서윤':{id:'yoon',color:'#6fe27f'},'오슬우':{id:'statue',color:'#d9b36a'}};
const THEMES=[null,
{title:'출입증 없는 문',bg:'linear-gradient(160deg,#1c2b3d,#3b2b36 70%)'},
{title:'공동 채무자',bg:'linear-gradient(160deg,#16303a,#2a3a2a 70%)'},
{title:'민원은 한 번에 하나씩',bg:'linear-gradient(160deg,#26263a,#3a3340 70%)'},
{title:'공정한 기회 무제한',bg:'linear-gradient(160deg,#351f35,#1f2a3e 70%)'},
{title:'서로에게 승인받기',bg:'linear-gradient(160deg,#3a2a1c,#22303a 70%)'},
{title:'고객님의 냉면',bg:'linear-gradient(160deg,#203a3a,#2a2f45 70%)'}];
export function speakerKind(who){if(Object.values(PARTY).some(p=>p.name===who))return 'party';if(BOSSES[who])return 'boss';if(NARRATORS.has(who))return 'narration';return 'other';}
export function castFor(party,who){const ids=party||[],left=ids.filter(id=>PARTY[id]).map(id=>({id,name:PARTY[id].name,initial:[...PARTY[id].name][0],color:PARTY[id].color,active:PARTY[id].name===who}));let right=[];if(BOSSES[who])right=[{id:BOSSES[who].id,name:who,initial:[...who][0],color:BOSSES[who].color,active:true}];else{const g=Object.entries(PARTY).find(([id,p])=>p.name===who&&!ids.includes(id));if(g)right=[{id:g[0],name:who,initial:[...who][0],color:g[1].color,active:true,guest:true}];}return {left,right};}
export function chapterTheme(ch){return {...(THEMES[ch]||THEMES[1])};}
export function resolveLines(event,state,script){const src=(script&&(BRIDGES[event.id]||script[event.id]))||event.lines;return src.map(([who,text])=>({who,text:typeof text==='function'?text(state):text}));}
export function createViewer(C,store,script){let s=null,idx=0,nonce=0,msg='',saved=true;
const clone=x=>JSON.parse(JSON.stringify(x)),lines=()=>resolveLines(C.current(s),s,script);
function persist(){try{saved=store.write(JSON.stringify(s))!==false;}catch{saved=false;}}
return {
get state(){return s?clone(s):null;},
get message(){return msg;},
canResume(){try{return !!store.read();}catch{return false;}},
start(){s=C.create();idx=0;nonce++;msg='';persist();return true;},
resume(text){try{const next=C.restore(text===undefined?store.read():text);s=next;idx=0;nonce++;msg='';if(text!==undefined)persist();return true;}catch(e){msg=e.message;return false;}},
close(){nonce++;},
advance(){if(!s)return false;const n=lines().length;if(idx<n-1){idx++;return true;}return false;},
skip(){if(!s)return false;const n=lines().length;if(idx>=n-1)return false;idx=n-1;return true;},
act(id,rev,token){if(!s)return false;if(token!==undefined&&token!==nonce)return false;try{const next=C.step(s,id,rev===undefined?s.rev:rev);if(next===s)return false;s=next;idx=0;nonce++;msg='';persist();return true;}catch(e){msg=e.message;return false;}},
view(){if(!s)return null;const n=C.current(s),ls=lines(),total=ls.length,i=Math.min(idx,total-1),line=ls[i]||{who:'',text:''},last=i>=total-1;return {ch:n.ch,id:n.id,type:n.type,party:[...s.party],bills:s.bills,rev:s.rev,token:nonce,line,index:i,total,last,actions:last?C.actions(s):[],failed:s.failed,end:n.type==='end',cast:castFor(s.party,line.who),theme:chapterTheme(n.ch),settlement:C.settlement(s),mock:n.type==='battle',saved,message:msg};}
};}
