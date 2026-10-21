import {createViewer as baseViewer,resolveLines as baseLines,TYPE_LABEL as labels} from './story-vn-v533.js?v=5.35';
import {LATE as originalLate} from './story-late-v538.js?v=5.38';
import {EP2} from './story-episode2-v5381.js?v=5.38.1';
import {EP3} from './story-episode3-v5382.js?v=5.38.2';
import {EP4} from './story-episode4-v5383.js?v=5.38.3';
const LATE={...originalLate,...EP3};
Object.assign(LATE,EP4);
export * from './story-vn-v533.js?v=5.35';
export const TYPE_LABEL={...labels,battle:'실전 전투',scene:'연출'};
export function resolveLines(event,state,script){const rows=EP2[event.id]||LATE[event.id];return rows?rows.map(([who,text])=>({who,text:typeof text==='function'?text(state):text})):baseLines(event,state,script);}
export function createViewer(C,store,script){const viewCore={...C,current(s){const event=C.current(s);return {...event,lines:resolveLines(event,s,script).map(({who,text})=>[who,text])};}};return baseViewer(viewCore,store);}
if(typeof document!=='undefined')for(const node of [document.querySelector('title'),document.querySelector('#home small')])if(node)node.textContent=node.textContent.replace(/v5\.38(?:\.\d+)?/,'v5.38.3');
