import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../src/battle-stats-data-v517.js',import.meta.url),'utf8');
const {DamageLedger,labConfig}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('direct damage shares and separate burn',()=>{const l=new DamageLedger(['서준','규원','성원']);l.hit(0,'attack',30);l.hit(1,'ult',50);l.hit(2,'followup',20);l.burn(14);const s=l.snapshot();assert.equal(s.total,114);assert.deepEqual(s.rows.map(r=>r.share),[30,50,20]);assert.equal(s.rows[2].extra,20);s.rows[0].normal=999;assert.equal(l.snapshot().rows[0].normal,30);});
test('zero overkill and invalid values never add fake damage',()=>{const l=new DamageLedger(['a','b','c']);l.hit(0,'attack',0);l.hit(1,'ult',NaN);l.hit(9,'attack',100);l.burn(-3);assert.equal(l.snapshot().total,0);assert.ok(l.snapshot().rows.every(r=>r.share===0));});
test('training configuration remains valid and restricted',()=>{const c=labConfig({boss:8,phase:9,actor:2,rank:99,iq:99,action:'followup'});assert.deepEqual([c.boss,c.phase,c.rank,c.iq],[3,2,6,4]);assert.throws(()=>labConfig({actor:0,action:'followup'}));assert.equal(labConfig({kind:'boss',boss:2,intent:'invalid'}).intent,'spit');});
