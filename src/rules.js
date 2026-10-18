export class Rules {
constructor(){this.hp=195;this.bhp=2600;this.en=0;this.atk=0;this.def=0;this.phase=1;this.index=0;this.cracks=0;this.broken=false;this.bonus=false;}
get intent(){return (this.phase===1?['slash','smash','slash','ult','smash','slash','smash','ult']:['guard','spin','spin','tornado','guard','slash','smash','ult'])[this.index%8];}
start(action){if(!['attack','bulk','ult'].includes(action)||this.hp<=0||this.bhp<=0||action==='ult'&&this.en<100)throw Error('Action unavailable');const p={action,boost:1,cracked:false,actual:0};if(action!=='bulk'&&this.bonus){p.boost=1.5;this.bonus=false;}if(action==='ult')this.en=0;return p;}
bulk(){this.atk=Math.min(6,this.atk+1);this.def=Math.min(6,this.def+1);this.en=Math.min(100,this.en+35);}
playerHit(base,p){const armor=this.phase===2&&this.intent==='guard'?.55:1;const damage=Math.round(base*(1+.2*this.atk)*p.boost*armor);const floor=this.phase===1?1300:0;const actual=Math.min(Math.max(0,this.bhp-floor),damage);this.bhp-=actual;p.actual+=actual;if(p.action==='attack')this.en=Math.min(100,this.en+25);let broke=false;if(this.phase===2&&this.intent!=='guard'&&!this.broken&&!p.cracked){p.cracked=true;this.cracks=Math.min(3,this.cracks+(p.action==='ult'?2:1));if(this.cracks===3){this.broken=true;broke=true;}}return {damage:actual,broke};}
heal(p){const n=Math.min(195-this.hp,Math.round(p.actual*.35));this.hp+=n;return n;}
finishPlayer(){return this.phase===1&&this.bhp<=1300?'transition':this.bhp<=0?'win':'boss';}
enterPhase2(){this.phase=2;this.index=0;this.atk=this.def=this.cracks=0;this.broken=this.bonus=false;}
bossHit(base){const weak=this.phase===2&&['ult','tornado'].includes(this.intent)&&this.broken?.3:1;const n=Math.round(base/(1+.18*this.def)*(this.phase===2?1.05:1)*weak*100)/100;const actual=Math.min(this.hp,n);this.hp=Math.max(0,Math.round((this.hp-n)*100)/100);return actual;}
finishBoss(){const ultimate=['ult','tornado'].includes(this.intent);if(this.intent!=='guard')this.en=Math.min(100,this.en+(ultimate?25:10));if(this.phase===2&&ultimate){if(this.broken)this.bonus=true;this.broken=false;this.cracks=0;}this.index=(this.index+1)%8;return this.hp<=0?'lose':'idle';}
}
