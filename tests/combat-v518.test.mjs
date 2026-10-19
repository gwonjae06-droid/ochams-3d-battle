import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ActionGauge} from '../src/action-gauge-v518.mjs';
const fixture=`class Previous{
constructor(){this.max=this.bhp=4000;this.boss=1;this.phase=2;this.active=0;this.party=['bae','choi','park'].map(id=>({id,hp:200,max:200,en:100,atk:0,def:0,iq:0,atkUp:0,defUp:0}));}
speeds(){return [100,100,100*(1+.2*this.party[2].iq),100];}alive(){return [...this.party.map(a=>a.hp>0),this.bhp>0];}
start(action,actor){if(this.party[actor].hp<=0)throw Error('dead');return {actor,action,boost:1,actual:0,rank:0,effect:actor===1&&action==='ult'?'atk':null};}
skill(p){const a=this.party[p.actor];a.atk++;a.def++;}team(){return 'unchanged';}
hitBoss(n,p){p.actual+=n;this.bhp-=n;return {damage:n};}endBoss(){return {next:'idle'};}enterPhase2(){this.phase=2;}}
`;
const src=readFileSync(new URL('../src/combat-rules-v518.js',import.meta.url),'utf8').split('\n').filter(l=>!l.startsWith('import ')&&!l.startsWith('export {')).join('\n');
const gauge=readFileSync(new URL('../src/action-gauge-v518.mjs',import.meta.url),'utf8');
const {PartyRules}=await import('data:text/javascript;base64,'+Buffer.from(gauge+'\n'+fixture+'\n'+src).toString('base64'));
test('stable ties and preview does not mutate live clock',()=>{const c=new ActionGauge(),s=[100,100,100,100],a=[true,true,true,true],before=JSON.stringify(c);assert.deepEqual(c.preview(s,a,4).map(x=>x.i),[0,1,2,3]);assert.equal(JSON.stringify(c),before);assert.deepEqual([c.current,c.next(s,a),c.next(s,a),c.next(s,a)],[0,1,2,3]);});
test('waiting speed change keeps accumulated work',()=>{const c=new ActionGauge([100,100,200,100]);assert.equal(c.current,2);assert.equal(c.remaining[0],5000);c.sync([200,100,200,100],[1,1,1,1]);assert.equal(c.remaining[0],5000);assert.equal(c.next([200,100,200,100],[1,1,1,1]),0);assert.equal(c.time,75);});
test('free attack generates one SP, paid fire spends 1/2/3 once',()=>{for(const cost of [0,1,2,3]){const r=new PartyRules();r.sp=5-(cost===0?1:0);r.fireChoice=cost;const before=r.sp,p=r.start('attack',1);assert.equal(r.sp,cost?before-cost:5);assert.equal(p.rank,[0,0,3,5][cost]);for(let i=0;i<3;i++)r.hitBoss(10,p);assert.equal(r.sp,cost?before-cost:5);assert.equal(r.toughness,100-[20,20,35,50][cost]);}});
test('insufficient SP changes neither SP nor energy',()=>{const r=new PartyRules();r.sp=0;r.fireChoice=3;const en=r.party[1].en;assert.throws(()=>r.start('attack',1),/SP/);assert.equal(r.sp,0);assert.equal(r.party[1].en,en);});
test('roulette restores capped SP rather than attack ranks',()=>{const r=new PartyRules();r.sp=4;const p=r.start('ult',1),time=r.clock.time;assert.match(r.team(p),/SP \+1/);assert.equal(r.sp,5);assert.equal(r.party[0].atkUp,0);assert.equal(r.clock.time,time);});
test('break applies once, delays reserved boss and routes to the promoted ally',()=>{const r=new PartyRules();r.clock.current=3;r.clock.remaining=[10000,1000,10000,0];r.toughness=20;const p=r.start('attack',0);r.hitBoss(10,p);assert.equal(r.breakSerial,1);assert.equal(r.clock.current,1);assert.equal(r.route('boss'),'idle');assert.equal(r.active,1);assert.equal(r.clock.remaining[3],1500);const hp=r.bhp;r.hitBoss(20,p);assert.equal(r.bhp,hp-25);assert.equal(r.breakSerial,1);r.onPresentationStart('boss');assert.equal(r.toughness,100);assert.equal(r.toughnessBroken,false);});
test('SP survives phases; permanent defense caps at 3',()=>{const r=new PartyRules();r.party[0].def=3;const p=r.start('skill',0);assert.equal(r.sp,2);r.skill(p);assert.equal(r.party[0].def,3);r.toughness=20;r.enterPhase2();assert.equal(r.sp,2);assert.equal(r.toughness,100);});
