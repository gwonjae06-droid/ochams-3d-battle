import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../src/combat-feedback-data-v516.js',import.meta.url),'utf8');
const {attackType,statuses,bossStatuses,mergeHit,ease,amount}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('damage categories and shield merge stay separate',()=>{assert.equal(attackType({action:'ult'}),'ult');assert.equal(attackType({action:'followup'}),'extra');const a=[];mergeHit(a,{key:'0',kind:'hurt',value:3},0);mergeHit(a,{key:'0',kind:'hurt',value:4},.1);mergeHit(a,{key:'0',kind:'shield',value:9},.1);assert.equal(a[0].value,7);assert.equal(a[0].hits,2);assert.equal(a[1].value,9);mergeHit(a,{key:'0',kind:'hurt',value:2},.4);assert.equal(a.length,3);});
test('status turns and null damage',()=>{assert.deepEqual(statuses({id:'park',shield:40,poison:3,nukeTurns:2}),['◈ 보호막 40','☠ 독 3턴','☢ 폭탄 2턴']);assert.deepEqual(bossStatuses({boss:2,burn:2,splitTurns:3}),['♨ 화상 2턴','◉ 분열 3턴']);const a=[];assert.equal(mergeHit(a,{key:'x',kind:'hurt',value:0},0),null);assert.equal(amount(.35),'0.4');});
test('return easing is bounded and monotonic',()=>{assert.equal(ease(-1),0);assert.equal(ease(2),1);let p=0;for(let i=0;i<=100;i++){const v=ease(i/100);assert.ok(v>=p&&v<=1);p=v;}});
