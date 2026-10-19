import {PartyRules as Base} from './difficulty-rules.js?v=4.9';
export {Campaign,KIND,EFFECTS,DIFF,getDifficulty,setDifficulty} from './difficulty-rules.js?v=4.9';
export class ActionClock{
constructor(){this.time=100;this.current=0;this.ready=[100,100,100,100];}
next(speeds,alive){this.ready[this.current]=this.time+10000/speeds[this.current];let best=-1;for(let i=0;i<4;i++)if(alive[i]&&(best<0||this.ready[i]<this.ready[best]))best=i;if(best<0)return -1;this.current=best;this.time=this.ready[best];return best;}
preview(speeds,alive,n=7){const c=new ActionClock();c.time=this.time;c.current=this.current;c.ready=this.ready.slice();const out=[];if(alive[c.current])out.push(c.current);while(out.length<n){const k=c.next(speeds,alive);if(k<0)break;out.push(k);}return out;}
}
export class PartyRules extends Base{
constructor(...args){super(...args);this.party.push({id:'park',name:'박성원',hp:220,max:220,en:0,atk:0,def:0,atkUp:0,atkT:0,defUp:0,defT:0,shield:0,poison:0,stacks:0,revived:false,iq:0,age:0,developed:false});this.clock=new ActionClock();}
speeds(){return [100,100,100*(1+.2*this.party[2].iq),100];}
alive(){return [...this.party.map(a=>a.hp>0),this.bhp>0];}
forecast(){let o=0;return this.clock.preview(this.speeds(),this.alive()).map(k=>k===3?{b:1,o:o++}:{i:k});}
start(action,who=this.active){if(who===2&&action==='ult'&&this.party[2].developed)throw Error('Already developed');return super.start(action,who);}
skill(p){if(p.actor!==2)return super.skill(p);const a=this.party[2];a.iq++;p.overloaded=a.iq>=5;if(p.overloaded){a.iq=0;a.age=0;}a.en=Math.min(100,a.en+35);}
hitBoss(base,p){const stacks=this.party.map(a=>a.stacks);const out=super.hitBoss(base,p);if(this.boss===3)this.party.forEach((a,i)=>{a.stacks=stacks[i];});return out;}
advance(){if(this.transitionPending){this.transitionPending=false;if(!this.completedAtBoundary){const k=this.clock.current;if(k===3)return 'boss';this.active=k;return 'idle';}this.completedAtBoundary=false;}const k=this.clock.next(this.speeds(),this.alive());if(k<0)return 'lose';if(k===3)return 'boss';this.active=k;return 'idle';}
endPlayer(p){if(p.actor===2&&p.action!=='ult'){const a=this.party[2];if(a.iq>0&&++a.age>=2){a.iq--;a.age=0;}}if(this.bhp<=0)return 'win';if(this.phase===1&&this.bhp<=this.max/2){this.completedAtBoundary=true;return 'transition';}return this.advance();}
enterPhase2(){super.enterPhase2();this.transitionPending=true;}
endBoss(){const out=super.endBoss();if(out.next==='transition')this.completedAtBoundary=true;if(out.next==='idle')out.next=this.advance();return out;}
}
