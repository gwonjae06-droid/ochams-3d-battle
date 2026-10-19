export function createSmoother(){const items=[],store={};
function track(o){if(o&&o.rotation&&o.position&&o.scale&&!items.some(i=>i.o===o))items.push({o,init:false,p:[0,0,0],r:[0,0,0],s:[1,1,1]});}
function wrap(a){a=(a+Math.PI)%(Math.PI*2);if(a<0)a+=Math.PI*2;return a-Math.PI;}
function apply(dt,k){const a=1-Math.exp(-Math.max(0,dt)*k);for(const it of items){const o=it.o,p=o.position,r=o.rotation,s=o.scale;if(!it.init){it.p=[p.x,p.y,p.z];it.r=[r.x,r.y,r.z];it.s=[s.x,s.y,s.z];it.init=true;continue;}
it.p[0]+=(p.x-it.p[0])*a;it.p[1]+=(p.y-it.p[1])*a;it.p[2]+=(p.z-it.p[2])*a;it.r[0]+=wrap(r.x-it.r[0])*a;it.r[1]+=wrap(r.y-it.r[1])*a;it.r[2]+=wrap(r.z-it.r[2])*a;it.s[0]+=(s.x-it.s[0])*a;it.s[1]+=(s.y-it.s[1])*a;it.s[2]+=(s.z-it.s[2])*a;
p.set(it.p[0],it.p[1],it.p[2]);r.set(it.r[0],it.r[1],it.r[2]);s.set(it.s[0],it.s[1],it.s[2]);}}
function params(key,target,dt,k){const a=1-Math.exp(-Math.max(0,dt)*k),st=store[key]||(store[key]={});for(const n in target){const v=target[n];st[n]=(typeof v==='number'&&typeof st[n]==='number')?st[n]+(v-st[n])*a:v;}return Object.assign({},st);}
function snap(){items.forEach(i=>{i.init=false;});for(const key in store)delete store[key];}
return {track,apply,params,snap};}
