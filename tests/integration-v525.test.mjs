import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PartyRules,ELEMENTS,setDifficulty} from '../src/energy-rules-v519.js?v=5.20';
import {enhanceAudit,auditMetrics} from '../src/audit-v525.mjs';
const source=readFileSync(new URL('../src/game-v522.mjs',import.meta.url),'utf8').split('\n').filter(s=>!s.startsWith('import ')).join('\n');
const {attachBattle}=await import('data:text/javascript;base64,'+Buffer.from('const ELEMENTS='+JSON.stringify(ELEMENTS)+';\n'+source).toString('base64'));
function battle(mode='boss',survival=false){setDifficulty('normal');const r=new PartyRules(1,true,()=>.99);attachBattle(r,mode);enhanceAudit(r,{survival});return r;}
function select(r,i){r.active=i;r.clock.current=i;r.clock.remaining[i]=0;}
test('real hierarchy: phase boundary still consumes SP but toughness is independent',()=>{const r=battle();r.bhp=r.max/2+5;r.fireChoice=3;const p=r.start('attack',1);assert.deepEqual([r.hitBoss(62,p).damage,r.hitBoss(62,p).damage,r.hitBoss(62,p).damage],[5,0,0]);assert.equal(r.sp,0);assert.equal(r.toughness,50);});
test('real hierarchy: galaxy keeps full toughness damage at phase boundary',()=>{const r=battle();r.bhp=r.max/2+5;r.party[0].en=150;const p=r.start('ult',0);assert.equal(r.hitBoss(420,p).damage,5);assert.equal(r.toughness,35);assert.equal(r.party[0].en,0);});
test('real hierarchy: nonweak hits never reduce toughness',()=>{const r=battle();const p=r.start('attack',2);assert.ok(r.hitBoss(65,p).damage>0);assert.equal(r.toughness,100);});
test('study gains survive acquisition turns and refresh without double decay',()=>{const r=battle();r.sp=5;const values=[];for(let i=0;i<5;i++){select(r,2);const p=r.start('skill',2);r.skill(p);r.endPlayer(p);values.push(r.party[2].iq);}assert.deepEqual(values,[1,2,3,4,0]);});
test('study still decays after two subsequent normal actions',()=>{const r=battle();select(r,2);let p=r.start('skill',2);r.skill(p);r.endPlayer(p);for(let i=0;i<2;i++){select(r,2);p=r.start('attack',2);r.endPlayer(p);assert.equal(r.party[2].iq,i===0?1:0);}});
test('opening shield only once; phase heal does not revive or repeat',()=>{const r=battle('boss',true);assert.deepEqual(r.party.map(a=>a.shield),[30,38,33]);r.party[0].shield=0;enhanceAudit(r);assert.equal(r.party[0].shield,0);r.party[0].hp=50;r.party[1].hp=0;r.party[1].revived=true;r.party[2].hp=100;r.toughness=40;r.enterPhase2();assert.deepEqual(r.party.map(a=>a.hp),[89,0,144]);assert.equal(r.toughness,40);r.enterPhase2();assert.equal(r.party[0].hp,89);});
test('real boss damage uses bounded survival adjustment',()=>{const r=battle('boss',true);r.phase=2;const out=r.bossHit(100,[0])[0];assert.equal(out.blocked,30);assert.equal(out.damage,72.64);});
test('dummy measurement uses AV rather than wait time and excludes opening shield',()=>{const r=battle('dummy',true);assert.ok(r.party.every(a=>a.shield===0));const p=r.start('attack',0);r.hitBoss(85,p);for(let i=0;i<4;i++)r.advance();const before=auditMetrics(r).per100AV;r.practiceStart-=10000;assert.equal(auditMetrics(r).per100AV,before);assert.ok(before>0);});
