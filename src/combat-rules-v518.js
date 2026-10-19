import {PartyRules as Previous} from './park-rules-v53.js?base=5.18';
import {ActionGauge} from './action-gauge-v518.mjs?v=5.18';
export {Campaign,KIND,EFFECTS,DIFF,getDifficulty,setDifficulty} from './park-rules-v53.js?base=5.18';
export const FIRE_NAMES=['일반공격','화염방사','염옥','자염옥'];
export class PartyRules extends Previous{
constructor(...a){super(...a);this.clock=new ActionGauge(this.speeds(),this.alive());this.active=this.clock.current;this.spMax=5;this.sp=3;this.fireChoice=0;this.toughnessMax=this.toughness=100;this.toughnessBroken=false;this.breakSerial=0;this.bossActing=false;this.toughPlans=new WeakSet();const c=globalThis.__ochamsLabControl?.active&&globalThis.__ochamsCombatTraining;if(c){this.sp=Math.max(0,Math.min(5,c.sp));this.fireChoice=c.fire;if(c.toughness<=0)this.breakToughness();else this.toughness=c.toughness;}}
gainSP(n){const before=this.sp;this.sp=Math.max(0,Math.min(this.spMax,this.sp+n));return this.sp-before;}
start(action,who=this.active){const a=this.party[who],choi=a?.id==='choi',fire=choi&&action==='attack'?Math.max(0,Math.min(3,Math.trunc(this.fireChoice)||0)):0,cost=action==='skill'?1:fire;if(choi&&action==='skill')throw Error('화염 기술에서 1·2·3SP를 선택하세요.');if(this.sp<cost)throw Error('SP가 부족합니다.');if(choi)a.atk=0;const p=super.start(action,who);this.fireChoice=0;this.sp-=cost;p.spCost=cost;if(action==='attack'){if(!cost)this.gainSP(1);if(choi){p.fireCost=fire;p.rank=[0,0,3,5][fire];p.fireScale=[.35,1,.9,1.1][fire];}}if(choi&&action==='ult'&&p.effect==='atk')p.effectName='SP 회복 +3';this.lastPlan=p;return p;}
skill(p){const out=super.skill(p);this.party[p.actor].def=Math.min(3,this.party[p.actor].def);return out;}
team(p){if(p.actor===1&&p.effect==='atk')return 'SP +'+this.gainSP(3)+' ('+this.sp+'/'+this.spMax+')';return super.team(p);}
forecast(){let o=0;return this.clock.preview(this.speeds(),this.alive()).map(e=>e.i===3?{b:1,o:o++,av:e.av}:{i:e.i,av:e.av});}
route(next){if(!['idle','boss'].includes(next))return next;if(this.bhp<=0)return 'win';if(this.party.every(a=>a.hp<=0))return 'lose';if(this.phase===1&&this.bhp<=this.max/2)return 'transition';this.clock.sync(this.speeds(),this.alive());if(!this.alive()[this.clock.current])this.clock.select();const i=this.clock.current;if(i===3)return 'boss';this.active=i;return 'idle';}
resetToughness(){this.toughness=100;this.toughnessBroken=false;}
breakToughness(){if(this.toughnessBroken||this.bhp<=0)return;this.toughness=0;this.toughnessBroken=true;this.breakSerial++;this.clock.sync(this.speeds(),this.alive());this.clock.delay(3,.25,this.bossActing&&this.clock.current===3);}
hitBoss(base,p){const scale=p.actor===1&&p.action==='attack'?p.fireScale??1:1,out=super.hitBoss(base*scale*(this.toughnessBroken?1.25:1),p);if(out.damage>0&&this.bhp>0&&!(this.phase===1&&this.bhp<=this.max/2)&&!this.toughnessBroken&&!this.toughPlans.has(p)&&['attack','ult','followup'].includes(p.action)){this.toughPlans.add(p);const n=p.action==='ult'?40:p.action==='followup'?10:p.actor===1&&p.fireCost?[0,20,35,50][p.fireCost]:p.heavy?30:20;this.toughness=Math.max(0,this.toughness-n);if(!this.toughness)this.breakToughness();}return out;}
onPresentationStart(mode){this.presentation=mode;if(mode==='boss'){this.resetToughness();this.bossActing=true;if(this.lab){this.clock.current=3;this.clock.remaining[3]=0;}}}
endBoss(){this.bossActing=false;return super.endBoss();}
enterPhase2(){super.enterPhase2();this.resetToughness();}
}
