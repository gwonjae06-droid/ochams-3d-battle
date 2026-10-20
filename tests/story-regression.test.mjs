import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../story-mvp.html',import.meta.url),'utf8');
const source=html.match(/<script\b[^>]*\bid=["']story-engine["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(source,'story-engine script must exist or this test must be migrated explicitly');
const context=vm.createContext({});
vm.runInContext(source,context,{timeout:2000});
const C=context.DeliveryStory;
const plain=x=>JSON.parse(JSON.stringify(x));
const key=s=>JSON.stringify([s.pos,s.party,s.flags,s.bills,s.failed]);

test('every reachable story state round-trips, retries safely and reaches both endings',()=>{
  const queue=[C.create()],seen=new Set(),endings=new Set(),chapters=new Set();
  let battles=0;
  for(let i=0;i<queue.length;i++){
    assert.ok(i<20000,'unexpected state explosion or cycle');
    const s=queue[i],k=key(s);
    if(seen.has(k))continue;
    seen.add(k);
    const n=C.current(s);
    assert.ok(n);chapters.add(n.ch);
    assert.deepEqual(plain(C.restore(JSON.stringify(s))),plain(s));
    const expected=['bae'];
    for(const e of C.events.slice(0,s.pos))if(e.join)expected.push(e.join);
    assert.deepEqual(plain(s.party),expected);
    const before=JSON.stringify(s);
    const available=C.actions(s);
    if(n.type==='end'){
      assert.equal(n.ch,6);
      assert.equal(available.length,0);
      endings.add(C.settlement(s).net<0?'negative':'zero');
      continue;
    }
    assert.ok(available.length>0);
    assert.throws(()=>C.step(s,'__invalid_action__'));
    assert.equal(C.step(s,available[0].id,s.rev+1),s,'stale revision must be ignored');
    if(n.type==='battle'){
      battles++;
      const lost=C.step(s,'lose',s.rev);
      assert.equal(lost.failed,true);
      assert.equal(lost.pos,s.pos);
      assert.equal(lost.bills,s.bills);
      assert.deepEqual(plain(lost.party),plain(s.party));
      assert.deepEqual(plain(lost.flags),plain(s.flags));
      assert.deepEqual(plain(C.restore(JSON.stringify(lost))),plain(lost));
      assert.deepEqual(plain(C.actions(lost)).map(x=>x.id),['retry']);
      const retried=C.step(lost,'retry',lost.rev);
      assert.equal(retried.failed,false);
      assert.equal(retried.retries,s.retries+1);
      assert.equal(retried.bills,s.bills);
      assert.equal(retried.pos,s.pos);
      assert.deepEqual(plain(C.restore(JSON.stringify(retried))),plain(retried));
    }
    for(const action of available){
      if(action.id==='lose')continue;
      const next=C.step(s,action.id,s.rev);
      assert.equal(next.rev,s.rev+1);
      assert.equal(next.pos,s.pos+1);
      queue.push(next);
    }
    assert.equal(JSON.stringify(s),before,'step must not mutate its input');
  }
  assert.deepEqual([...chapters].sort(),[1,2,3,4,5,6]);
  assert.deepEqual([...endings].sort(),['negative','zero']);
  assert.ok(battles>0);
  assert.equal(C.events.find(e=>e.join==='park')?.ch,2);
  assert.equal(C.events.find(e=>e.join==='choi')?.ch,4);
});

test('corrupt and forged saves are rejected',()=>{
  const base=plain(C.create());
  const bad=['','{','null','[]',JSON.stringify({...base,version:999}),JSON.stringify({...base,pos:-1}),JSON.stringify({...base,pos:1.5}),JSON.stringify({...base,rev:-1}),JSON.stringify({...base,retries:-1}),JSON.stringify({...base,failed:true}),JSON.stringify({...base,bills:1}),JSON.stringify({...base,party:['bae','park']}),JSON.stringify({...base,flags:{gate:'terms'}}),'x'.repeat(100001)];
  for(const text of bad)assert.throws(()=>C.restore(text));
});
