import {PartyRules as Base} from './party-rules.js?v=4.8';
export {Campaign,KIND,EFFECTS} from './party-rules.js?v=4.8';
export const DIFF={easy:{name:'쉬움',hp:.8,damage:.7},normal:{name:'보통',hp:1,damage:1},hard:{name:'어려움',hp:1.35,damage:1.3}};
let current='normal';try{const d=localStorage.getItem('ochams-difficulty');if(DIFF[d])current=d;}catch(e){}
export const getDifficulty=()=>current;
export function setDifficulty(k){if(!DIFF[k])return false;current=k;try{localStorage.setItem('ochams-difficulty',k);}catch(e){}return true;}
export class PartyRules extends Base{
constructor(...args){super(...args);this.diff=current;this.damageScale=DIFF[current].damage;this.max=Math.round(this.max*DIFF[current].hp);this.bhp=this.max;}
bossHit(base,targets=this.targets()){return super.bossHit(i=>(typeof base==='function'?base(i):base)*this.damageScale,targets);}
}
