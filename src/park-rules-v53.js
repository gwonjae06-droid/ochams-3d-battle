import {PartyRules as Previous} from './park-rules.js?v=5.1';
import {PartyRules as Base} from './difficulty-rules.js?v=4.9';
export {Campaign,KIND,EFFECTS,DIFF,getDifficulty,setDifficulty} from './park-rules.js?v=5.1';
export class PartyRules extends Previous{
constructor(...a){super(...a);this.party[2].nukeTurns=0;this.pendingNukes=0;this.nukeDecayPending=false;this.nukeTurnUsed=new Set();this.splitTurns=0;this.max=Math.round(this.max*(this.diff==='easy'?1.08:1.15));this.bhp=this.max;}
start(action,who=this.active){const p=Base.prototype.start.call(this,action,who);if(action!=='ult')this.nukeTurnUsed.delete(who);return p;}
activeNuke(){return this.party[2].hp>0&&this.party[2].nukeTurns>0;}
activateNuke(){this.party[2].nukeTurns=3;this.party[2].developed=true;this.nukeDecayPending=false;}
intentAt(o=0){if(this.phase!==2)return super.intentAt(o);const seq=this.boss===1?['guard','spin','tornado','slash','guard','smash','spin','ult']:this.boss===2?['guard','lash','spores','pounce','leech','tide','lash','tide']:['scent','thorn','smite','petal','bloom','scent','smite','bloom'];return seq[(this.index+o)%8];}
hitBoss(base,p){const on=this.activeNuke(),armor=this.phase===2?(this.boss===2&&this.splitTurns>0?.82:this.boss===1&&!this.broken?.92:1):1,out=super.hitBoss(base*(on?1.05:1)*armor,p);if(on&&out.damage>0&&p.action!=='followup'&&!this.nukeTurnUsed.has(p.actor)){this.nukeTurnUsed.add(p.actor);this.pendingNukes++;}return out;}
bossHit(base,targets=this.targets()){const k=this.phase===2?(this.boss===2&&this.splitTurns>0?1.25:1.15):1;return super.bossHit(i=>(typeof base==='function'?base(i):base)*k,targets);}
endPlayer(p){if(p.actor===2&&p.action!=='ult'&&this.activeNuke())this.nukeDecayPending=true;return super.endPlayer(p);}
commitNukeTurn(){if(!this.nukeDecayPending||this.pendingNukes>0)return;const a=this.party[2];a.nukeTurns=Math.max(0,a.nukeTurns-1);a.developed=a.nukeTurns>0;this.nukeDecayPending=false;}
endBoss(){const phase=this.phase,it=this.intent,ts=this.targets(),out=super.endBoss();if(phase===2){if(this.boss===2){if(it==='guard')this.splitTurns=3;else this.splitTurns=Math.max(0,this.splitTurns-1);if(['spores','tide'].includes(it))for(const i of ts)if(this.party[i].hp>0)this.party[i].poison=Math.max(this.party[i].poison,3);}if(this.boss===3&&it!=='bloom'&&it!=='guard')for(const i of ts)if(this.party[i].hp>0)this.party[i].stacks=Math.min(12,this.party[i].stacks+1);}return out;}
}
