import * as T from 'three';
export function createFx(A){
const N=900,mat=new T.MeshBasicMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending}),im=new T.InstancedMesh(new T.SphereGeometry(1,6,5),mat,N);im.frustumCulled=false;A.scene.add(im);
const dummy=new T.Object3D(),col=new T.Color(),zero=new T.Matrix4().makeScale(0,0,0),ps=Array.from({length:N},()=>({on:false,p:new T.Vector3(),v:new T.Vector3(),life:0,max:1,size:.1,g:0,d:1,c:new T.Color()}));let cur=0;
for(let i=0;i<N;i++){im.setMatrixAt(i,zero);im.setColorAt(i,col.setRGB(0,0,0));}
function emit(pos,o={}){const n=o.n??10,sp=o.speed??3;for(let k=0;k<n;k++){const q=ps[cur];cur=(cur+1)%N;q.on=true;q.p.copy(pos);if(o.j)q.p.add(new T.Vector3((Math.random()-.5)*o.j,(Math.random()-.5)*o.j,(Math.random()-.5)*o.j));const x=Math.random()*2-1,y=Math.random()*2-1,z=Math.random()*2-1,l=Math.hypot(x,y,z)||1,s=sp*(.4+Math.random()*.6)*(o.spread??1)/l;q.v.set(x*s,y*s,z*s);if(o.dir)q.v.addScaledVector(o.dir,sp*(.7+Math.random()*.6));q.v.y+=o.up??0;q.max=q.life=(o.life??.8)*(.7+Math.random()*.6);q.size=(o.size??.1)*(.7+Math.random()*.6);q.g=o.grav??0;q.d=o.drag??1;const cc=Array.isArray(o.color)?o.color[Math.floor(Math.random()*o.color.length)]:(o.color??0xffffff);q.c.set(cc);}}
const rings=Array.from({length:10},()=>{const m=new T.Mesh(new T.RingGeometry(.88,1,48),new T.MeshBasicMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));m.visible=false;A.scene.add(m);return {m,t:9,d:1,max:3};});
function ring(pos,color,max=3,dur=.7,plane='ground'){const r=rings.find(x=>x.t>=x.d)||rings[0];r.t=0;r.d=dur;r.max=max;r.m.position.copy(pos);r.m.rotation.set(plane==='ground'?-Math.PI/2:0,plane==='ground'?0:Math.PI/2,0);r.m.material.color.set(color);r.m.visible=true;}
const pills=Array.from({length:6},()=>{const m=new T.Mesh(new T.CylinderGeometry(1,1,1,24,1,true),new T.MeshBasicMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));m.visible=false;A.scene.add(m);return {m,t:9,d:1,h:6,r:.6};});
function pillar(pos,color,h=7,rad=.6,dur=1){const p=pills.find(x=>x.t>=x.d)||pills[0];p.t=0;p.d=dur;p.h=h;p.r=rad;p.m.position.set(pos.x,pos.y+h/2,pos.z);p.m.material.color.set(color);p.m.visible=true;}
const light=new T.PointLight(0xffffff,0,18);A.scene.add(light);let gl={t:9,d:1,i:0};
function glow(pos,color,int=6,dur=.6){light.position.copy(pos);light.color.set(color);gl={t:0,d:dur,i:int};}
function update(dt){for(let i=0;i<N;i++){const q=ps[i];if(!q.on)continue;q.life-=dt;if(q.life<=0){q.on=false;im.setMatrixAt(i,zero);continue;}q.p.addScaledVector(q.v,dt);q.v.y-=q.g*dt;q.v.multiplyScalar(Math.max(0,1-q.d*dt));const k=q.life/q.max;dummy.position.copy(q.p);dummy.scale.setScalar(q.size*(.35+.65*k));dummy.rotation.set(0,0,0);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);im.setColorAt(i,col.copy(q.c).multiplyScalar(k));}
im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;
for(const r of rings){if(r.t>=r.d){r.m.visible=false;continue;}r.t+=dt;const u=Math.min(1,r.t/r.d);r.m.scale.setScalar(r.max*(1-(1-u)*(1-u))+.01);r.m.material.opacity=1-u;}
for(const p of pills){if(p.t>=p.d){p.m.visible=false;continue;}p.t+=dt;const u=Math.min(1,p.t/p.d);p.m.scale.set(p.r*(1+.4*u),p.h,p.r*(1+.4*u));p.m.material.opacity=.75*(1-u);}
if(gl.t<gl.d){gl.t+=dt;light.intensity=gl.i*(1-gl.t/gl.d);}else light.intensity=0;}
function clear(){for(const q of ps){q.on=false;}for(let i=0;i<N;i++)im.setMatrixAt(i,zero);im.instanceMatrix.needsUpdate=true;for(const r of rings){r.t=9;r.m.visible=false;}for(const p of pills){p.t=9;p.m.visible=false;}gl.t=9;light.intensity=0;}
return {emit,ring,pillar,glow,update,clear};}
