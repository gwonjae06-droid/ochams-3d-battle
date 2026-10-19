export const BPM=92;
export const CHORDS=[[50,[0,3,7,14]],[46,[0,4,7,11]],[53,[0,4,7,11]],[48,[0,4,7,14]],[43,[0,3,7,10]],[46,[0,4,7,11]],[50,[0,3,7,14]],[45,[0,4,7,10]]];
const pattern=[0,1,2,3,2,1,2,0,1,2,3,2,1,0,1,2];
export const hz=n=>440*2**((n-69)/12);
export function scoreAt(step){const [root,chord]=CHORDS[Math.floor(step/32)%8],i=step%16;return {root,chord,lead:root+24+chord[pattern[Math.floor(step/2)%16]],pad:i===0,pluck:step%2===0,bass:i%4===0,kick:i===0||i===8,hat:i%4===2,bell:i===14};}
const observed=new WeakSet();
export function observeBreak(r,callback){if(observed.has(r))return;observed.add(r);const old=r.breakToughness;r.breakToughness=function(...args){const before=this.breakSerial,out=old.apply(this,args);if(this.breakSerial!==before)try{callback(this);}catch(e){console.warn('격파 연출 건너뜀',e);}return out;};}
