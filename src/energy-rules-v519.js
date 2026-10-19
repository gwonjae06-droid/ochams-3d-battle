import {PartyRules as Previous} from './combat-rules-v518.js?v=5.18';
export {Campaign,KIND,EFFECTS,DIFF,getDifficulty,setDifficulty} from './combat-rules-v518.js?v=5.18';
export const ELEMENTS={physical:'물리',quantum:'양자',fire:'불',wind:'바람',imaginary:'허수',lightning:'번개'};
export const BOSS_WEAKNESSES={1:['physical','fire','wind'],2:['fire','quantum','lightning'],3:['physical','quantum','imaginary']};
export const ENERGY_MAX=[150,100,90];
export class PartyRules extends Previous{
constructor(...args){super(...args);this.party.forEach((a,i)=>{a.energyMax=ENERGY_MAX[i];a.ultCost=i===0?75:a.energyMax;a.element=['physical','fire','quantum'][i];});this.clearRanks();}
clearRanks(){for(const a of this.party)a.atk=a.def=a.atkUp=a.defUp=a.atkT=a.defT=0;}
get weaknesses(){return BOSS_WEAKNESSES[this.boss];}
addEnergy(i,from,gain){this.party[i].en=Math.max(0,Math.min(ENERGY_MAX[i],from+gain));}
start(action,who=this.active){this.clearRanks();if(this.lab&&!this.lastPlan)this.party.forEach((a,i)=>a.en=i===0?(globalThis.__ochamsBaeTrainingEnergy??150):a.energyMax);const a=this.party[who],before=a?.en,cost=who===0?(before>=150?150:75):ENERGY_MAX[who];if(action==='ult'&&(!a||before<cost))throw Error('궁극기 에너지가 부족합니다.');if(who===1&&action==='attack'&&this.fireChoice===1)this.fireChoice=0;if(action==='ult'&&a.en<100)a.en=100;let p;try{p=super.start(action,who);}catch(e){if(a)a.en=before;throw e;}if(who===0){p.heavy=action==='attack';p.galaxy=action==='ult'&&before>=150;if(action==='ult'){a.en=before-cost;p.energySpent=cost;}}if(who===1&&action==='attack')p.fireScale=p.fireCost===0?.75:p.fireCost===2?.95:1.2;if(who===1&&action==='ult'&&p.effect==='def')p.effectName='파티 보호막 +35';p.element=a.element;return p;}
skill(p){this.clearRanks();const a=this.party[p.actor],before=a.en;if(p.actor===0)a.shield=Math.max(a.shield,20);else super.skill(p);this.addEnergy(p.actor,before,35);this.clearRanks();}
team(p){this.clearRanks();if(p.effect==='def'){for(const a of this.party)if(a.hp>0)a.shield=Math.max(a.shield,35);return '파티 보호막 35';}const before=this.party.map(a=>a.en),out=super.team(p);if(p.effect==='charge')this.party.forEach((a,i)=>{if(a.hp>0)this.addEnergy(i,before[i],i===p.actor?20:50);});this.clearRanks();return out;}
hitBoss(base,p){this.clearRanks();const match=this.weaknesses.includes(this.party[p.actor].element),seen=this.toughPlans.has(p),tough=this.toughness,before=this.party[p.actor].en,given=p.enGiven;if(!match)this.toughPlans.add(p);const out=super.hitBoss(base,p);if(p.action==='attack'&&!given&&p.enGiven)this.addEnergy(p.actor,before,25);if(match&&!seen&&this.toughPlans.has(p)&&p.actor===0&&p.galaxy&&!this.toughnessBroken&&this.bhp>0&&!(this.phase===1&&this.bhp<=this.max/2)){this.toughness=Math.max(0,tough-65);if(!this.toughness)this.breakToughness();}return out;}
bossHit(...args){this.clearRanks();return super.bossHit(...args);}
endBoss(){this.clearRanks();const before=this.party.map(a=>a.en),received=[...this.received],gain=['ult','tornado','tide','bloom'].includes(this.intent)?25:10,out=super.endBoss();for(const i of received)if(this.party[i].hp>0)this.addEnergy(i,before[i],gain);this.clearRanks();return out;}
}
