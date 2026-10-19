import {PartyRules as Previous} from './park-rules.js?v=5.1';
import {PartyRules as Base} from './difficulty-rules.js?v=4.9';
export {Campaign,KIND,EFFECTS,DIFF,getDifficulty,setDifficulty} from './park-rules.js?v=5.1';
export class PartyRules extends Previous{
constructor(...a){super(...a);this.party[2].nukeTurns=0;this.pendingNukes=0;this.nukeDecayPending=false;}
start(action,who=this.active){return Base.prototype.start.call(this,action,who);}
activeNuke(){return this.party[2].hp>0&&this.party[2].nukeTurns>0;}
activateNuke(){this.party[2].nukeTurns=3;this.party[2].developed=true;this.nukeDecayPending=false;}
hitBoss(base,p){const on=this.activeNuke(),out=super.hitBoss(base*(on?1.05:1),p);if(on&&out.damage>0&&p.action!=='followup')this.pendingNukes++;return out;}
endPlayer(p){if(p.actor===2&&p.action!=='ult'&&this.activeNuke())this.nukeDecayPending=true;return super.endPlayer(p);}
commitNukeTurn(){if(!this.nukeDecayPending||this.pendingNukes>0)return;const a=this.party[2];a.nukeTurns=Math.max(0,a.nukeTurns-1);a.developed=a.nukeTurns>0;this.nukeDecayPending=false;}
}
