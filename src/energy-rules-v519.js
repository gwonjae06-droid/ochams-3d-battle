import {PartyRules as Previous} from './combat-rules-v518.js?v=5.18';
export {Campaign,KIND,EFFECTS,DIFF,getDifficulty,setDifficulty} from './combat-rules-v518.js?v=5.18';
export const ENERGY_MAX=[120,100,90];
export class PartyRules extends Previous{
constructor(...args){super(...args);this.party.forEach((a,i)=>a.energyMax=ENERGY_MAX[i]);}
addEnergy(i,from,gain){this.party[i].en=Math.max(0,Math.min(ENERGY_MAX[i],from+gain));}
start(action,who=this.active){if(this.lab&&!this.lastPlan)this.party.forEach(a=>a.en=a.energyMax);const a=this.party[who],before=a?.en;if(action==='ult'&&(!a||before<ENERGY_MAX[who]))throw Error('궁극기 에너지가 부족합니다.');if(who===1&&action==='attack'&&this.fireChoice===1)this.fireChoice=0;if(action==='ult'&&a.en<100)a.en=100;let p;try{p=super.start(action,who);}catch(e){if(a)a.en=before;throw e;}if(who===1&&action==='attack')p.fireScale=p.fireCost===0?.75:p.fireCost===2?.95:1.2;return p;}
skill(p){const before=this.party[p.actor].en,out=super.skill(p);this.addEnergy(p.actor,before,35);return out;}
hitBoss(base,p){const before=this.party[p.actor].en,given=p.enGiven,out=super.hitBoss(base,p);if(p.action==='attack'&&!given&&p.enGiven)this.addEnergy(p.actor,before,25);return out;}
team(p){const before=this.party.map(a=>a.en),out=super.team(p);if(p.effect==='charge')this.party.forEach((a,i)=>{if(a.hp>0)this.addEnergy(i,before[i],i===p.actor?20:50);});return out;}
endBoss(){const before=this.party.map(a=>a.en),received=[...this.received],gain=['ult','tornado','tide','bloom'].includes(this.intent)?25:10,out=super.endBoss();for(const i of received)if(this.party[i].hp>0)this.addEnergy(i,before[i],gain);return out;}
}
