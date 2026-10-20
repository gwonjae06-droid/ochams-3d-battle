import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hitPower,partyPower,voicePlan,shieldPlan,installMaterialHooks,installBossMaterial,sharedAudio,createPlayer} from '../src/boss-material-v526.js';
const valid=p=>p.every(s=>Number.isFinite(s.gain)&&s.gain>=0&&s.dur>0&&s.delay>=0&&(s.type==='noise'?s.freq>0:s.from>0&&s.to>0));
test('each boss has a distinct valid voice and unknown bosses are silent',()=>{
const sig=[1,2,3].map(b=>{const p=voicePlan(b,'hit',1);assert.ok(p.length>0&&valid(p));return JSON.stringify(p);});
assert.equal(new Set(sig).size,3);
assert.deepEqual(voicePlan(9,'hit',1),[]);assert.deepEqual(voicePlan(1,'hit',0),[]);
assert.ok(voicePlan(2,'attack',1).length>voicePlan(2,'hit',1).length);
assert.ok(valid(shieldPlan(1))&&shieldPlan(0).length===0);});
test('strong hits add a sub thump layer and weak hits do not',()=>{for(const b of [1,2,3]){assert.ok(voicePlan(b,'hit',1).some(s=>s.type==='tone'&&s.from===70&&s.to===34));assert.ok(!voicePlan(b,'hit',.4).some(s=>s.type==='tone'&&s.from===70&&s.to===34));}assert.ok(valid(voicePlan(2,'attack',1)));});
test('power is bounded and monotonic',()=>{assert.equal(hitPower(0,100),0);assert.ok(hitPower(1,1e9)>=.35);assert.ok(hitPower(1e9,100)<=1);assert.ok(hitPower(2,1000)<=hitPower(40,1000));assert.equal(hitPower(5,undefined),1);assert.equal(partyPower(-3),0);assert.ok(partyPower(1e6)<=1);});
test('hooks preserve results and this, throttle, and survive sink errors',()=>{
const calls=[];let t=0;const r={boss:1,max:1000,hitBoss(a){this.seen=a;return {damage:50};},bossHit(){return [{i:0,damage:30,blocked:10},{i:1,damage:0,blocked:0}];}};
assert.equal(installMaterialHooks(r,p=>calls.push(p),()=>t),true);assert.equal(installMaterialHooks(r,()=>{}),false);
assert.deepEqual(r.hitBoss(7),{damage:50});assert.equal(r.seen,7);assert.equal(calls.length,1);
t=10;r.hitBoss(1);assert.equal(calls.length,1);t=100;r.hitBoss(1);assert.equal(calls.length,2);
t=300;const out=r.bossHit();assert.equal(out.length,2);assert.equal(calls.length,4);
const bad={boss:2,max:100,hitBoss:()=>({damage:5})};installMaterialHooks(bad,()=>{throw Error('x')},()=>0);assert.deepEqual(bad.hitBoss(),{damage:5});
const zero={boss:3,max:100,hitBoss:()=>({damage:0})};let n=0;installMaterialHooks(zero,()=>n++);zero.hitBoss();assert.equal(n,0);
assert.equal(installMaterialHooks({boss:1},()=>{}),true);assert.equal(installMaterialHooks(null,()=>{}),false);});
test('rig wrapper binds each battle state once and keeps pose result',()=>{
let state={boss:1,max:100,hitBoss:()=>({damage:9})};const rig={pose:(...a)=>a.join('|')};const played=[];
assert.equal(installBossMaterial(rig,{state:()=>state},p=>played.push(p)),true);
assert.equal(rig.pose('a','b'),'a|b');rig.pose();state.hitBoss();assert.equal(played.length,1);
assert.equal(installBossMaterial({},{state(){}},()=>{}),false);assert.equal(installBossMaterial(rig,{},()=>{}),false);});
test('shared audio is a singleton and fails closed without Web Audio',()=>{const a=sharedAudio();assert.equal(a,sharedAudio());assert.equal(a.ensure(),false);assert.equal(a.ctx,null);const play=createPlayer(a);assert.equal(play([{type:'tone',wave:'sine',from:100,to:50,dur:.1,gain:.1,delay:0}]),undefined);});
