import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DeliveryStory as C} from '../src/story-engine-v533.js';
import {createViewer} from '../src/story-vn-v533.js';
test('a failed resume or import keeps the current session and its save',()=>{let t='';const store={read:()=>t,write:x=>{t=x;return true;}};const v=createViewer(C,store);v.start();v.skip();const view=v.view();v.act(view.actions[0].id,view.rev,view.token);const before=JSON.stringify(v.state),saved=t;
assert.equal(v.resume('{bad'),false);assert.equal(JSON.stringify(v.state),before);assert.ok(v.message);assert.equal(t,saved);
assert.equal(v.resume(JSON.stringify({...v.state,bills:5})),false);assert.equal(JSON.stringify(v.state),before);assert.ok(v.view());});
