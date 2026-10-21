import {createViewer as baseViewer,resolveLines as baseLines,TYPE_LABEL as labels} from './story-vn-v533.js?v=5.35';
import {LATE} from './story-late-v538.js?v=5.38';
export * from './story-vn-v533.js?v=5.35';
export const TYPE_LABEL={...labels,battle:'실전 전투',scene:'연출'};
export function resolveLines(event,state,script){const rows=LATE[event.id];return rows?rows.map(([who,text])=>({who,text:typeof text==='function'?text(state):text})):baseLines(event,state,script);}
export function createViewer(C,store,script){const viewCore={...C,current(s){const event=C.current(s);return {...event,lines:resolveLines(event,s,script).map(({who,text})=>[who,text])};}};return baseViewer(viewCore,store);}
