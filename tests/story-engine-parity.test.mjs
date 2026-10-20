import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {DeliveryStory as B} from '../src/story-engine-v533.js';
const html=readFileSync(new URL('../story-mvp.html',import.meta.url),'utf8');
const source=html.match(/<script\b[^>]*\bid=["']story-engine["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(source,'inline story engine not found');
const context=vm.createContext({});vm.runInContext(source,context,{timeout:2000});
const A=context.DeliveryStory,J=x=>JSON.stringify(x);
const text=(n,s)=>n.lines.map(([w,t])=>[w,typeof t==='function'?t(s):t]);
test('module engine matches the inline engine across every reachable state',()=>{
const queue=[[A.create(),B.create()]],seen=new Set();
for(let i=0;i<queue.length;i++){assert.ok(i<20000);const [a,b]=queue[i];assert.equal(J(b),J(a));const k=J([a.pos,a.party,a.flags,a.bills,a.failed]);if(seen.has(k))continue;seen.add(k);
const na=A.current(a),nb=B.current(b);assert.equal(J([nb.ch,nb.id,nb.type,nb.join,nb.encounter]),J([na.ch,na.id,na.type,na.join,na.encounter]));assert.equal(J(text(nb,b)),J(text(na,a)));
assert.equal(J(B.actions(b).map(o=>[o.id,o.label,o.cost])),J(A.actions(a).map(o=>[o.id,o.label,o.cost])));assert.equal(J(B.settlement(b)),J(A.settlement(a)));
assert.equal(J(B.restore(J(b))),J(A.restore(J(a))));
for(const o of A.actions(a))queue.push([A.step(a,o.id),B.step(b,o.id)]);}
assert.ok(seen.size>500&&seen.size<5000);assert.equal(J(B.names),J(A.names));assert.equal(B.events.length,A.events.length);});
