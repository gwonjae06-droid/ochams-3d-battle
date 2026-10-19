import * as T from 'three';
export function createSlime(A,V,EX){
const g=new T.Group();g.position.set(EX+1.2,0,-.5);g.visible=false;A.scene.add(g);
const rig=new T.Group();g.add(rig);
const geo=new T.SphereGeometry(1,40,28),bp=geo.attributes.position,base=new Float32Array(bp.array);
const mat=new T.MeshStandardMaterial({color:0x4fcf63,transparent:true,opacity:.8,roughness:.12,metalness:.1,emissive:0x0e5a1c,emissiveIntensity:.7});
const body=new T.Mesh(geo,mat);body.scale.set(4.6,3.7,4.3);body.position.y=3.4;rig.add(body);
const core=new T.Mesh(new T.SphereGeometry(1.25,20,16),new T.MeshBasicMaterial({color:0x8a3dff,transparent:true,opacity:.85}));core.position.y=3.4;rig.add(core);
const eyes=[-1,1].map(s=>{const e=new T.Group();e.position.set(-3.9,4.4,s*1.4);const w=new T.Mesh(new T.SphereGeometry(.62,16,12),new T.MeshBasicMaterial({color:0xf4ffe8})),p=new T.Mesh(new T.SphereGeometry(.3,12,10),new T.MeshBasicMaterial({color:0x120a1c}));p.scale.set(.5,1.4,.7);p.position.x=-.5;e.add(w,p);rig.add(e);return e;});
const mouth=new T.Mesh(new T.BoxGeometry(.12,.3,1.9),new T.MeshBasicMaterial({color:0x10240f}));mouth.position.set(-4.1,2.8,0);rig.add(mouth);
const sp=new T.MeshBasicMaterial({color:0x9d5bff,transparent:true,opacity:.9});for(let i=0;i<6;i++){const c=new T.Mesh(new T.ConeGeometry(.5,2.2+(i%3)*.5,8),sp);const a=i/6*Math.PI*2;c.position.set(2.2+Math.cos(a)*.9,6.6+Math.sin(i)*.3,Math.sin(a)*1.8);c.rotation.z=-.4;rig.add(c);}
const puddle=new T.Mesh(new T.CircleGeometry(7,40),new T.MeshBasicMaterial({color:0x1d4a1f,transparent:true,opacity:.6,depthWrite:false}));puddle.rotation.x=-Math.PI/2;puddle.position.y=.04;rig.add(puddle);
const bub=new T.InstancedMesh(new T.SphereGeometry(1,8,6),new T.MeshBasicMaterial({color:0xc8ffb0,transparent:true,opacity:.55}),36),bs=Array.from({length:36},(_,i)=>({a:Math.random()*6.28,r:Math.random()*2.6,h:Math.random(),s:.1+Math.random()*.22,sp:.15+Math.random()*.25})),dm=new T.Object3D();rig.add(bub);bub.frustumCulled=false;
const tent=Array.from({length:3},()=>{const gr=new T.Group();gr.visible=false;A.scene.add(gr);const ms=[];for(let k=0;k<12;k++){const m=new T.Mesh(new T.SphereGeometry(1,10,8),mat);gr.add(m);ms.push(m);}return {gr,ms};});
const wave=new T.Group();wave.visible=false;A.scene.add(wave);
const wm=new T.MeshStandardMaterial({color:0x3fbf4f,transparent:true,opacity:.86,roughness:.2,emissive:0x167a2a,emissiveIntensity:.9});
const slab=new T.Mesh(new T.BoxGeometry(1,1,1),wm),curl=new T.Mesh(new T.BoxGeometry(6,1.6,1),wm),crest=new T.Mesh(new T.BoxGeometry(5,.5,1),new T.MeshBasicMaterial({color:0xe4ffd0})),deep=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0x2a0e55,transparent:true,opacity:.5}));wave.add(slab,curl,crest,deep);
function setTone(ph){if(ph>=2){mat.color.set(0x9be03a);mat.emissive.set(0x4a1a8a);wm.color.set(0x8ad03a);wm.emissive.set(0x4a1a8a);}else{mat.color.set(0x4fcf63);mat.emissive.set(0x0e5a1c);wm.color.set(0x3fbf4f);wm.emissive.set(0x167a2a);}}
function tick(now,dt,pose){const p=Object.assign({sx:1,sy:1,sz:1,ox:0,oy:0,oz:0,ry:0,rz:0,wob:1,glow:0},pose);rig.scale.set(p.sx,p.sy,p.sz);rig.position.set(p.ox,p.oy,p.oz);rig.rotation.set(0,p.ry,p.rz);
const a=bp.array,w=p.wob;for(let i=0;i<a.length;i+=3){const x=base[i],y=base[i+1],z=base[i+2],d=1+w*(.05*Math.sin(now*.0019+x*3.1+y*2.3)+.04*Math.sin(now*.0027+z*3.7+x*1.9))+(y<-.5?.07*(-y-.5):0);a[i]=x*d;a[i+1]=y*d;a[i+2]=z*d;}bp.needsUpdate=true;geo.computeVertexNormals();
mat.emissiveIntensity=.7+p.glow*1.6;const k=1+.12*Math.sin(now*.005)+p.glow*.3;core.scale.setScalar(k);puddle.scale.setScalar(1+.04*Math.sin(now*.003));
bs.forEach((b,i)=>{b.h=(b.h+dt*b.sp)%1;dm.position.set(Math.cos(b.a+now*.0004)*b.r-.4,.9+b.h*5.4,Math.sin(b.a+now*.0004)*b.r);dm.scale.setScalar(b.s*(1-Math.abs(b.h-.5)*.8));dm.updateMatrix();bub.setMatrixAt(i,dm.matrix);});bub.instanceMatrix.needsUpdate=true;}
const tv=new T.Vector3();
function tentacle(i,from,to,amt,t){const tn=tent[i];tn.gr.visible=amt>.02;if(!tn.gr.visible)return null;const N=tn.ms.length;tn.ms.forEach((m,k)=>{const u=k/(N-1)*amt;tv.copy(from).lerp(to,u);tv.y+=Math.sin(u*Math.PI)*1.8+Math.sin(t*7+k*.8)*.3*amt;tv.z+=Math.sin(t*5+k*.7)*.5*amt;m.position.copy(tv);m.scale.setScalar(Math.max(.1,(1-u*.7)*.6));});return tn.ms[N-1].position.clone();}
function hideTent(){tent.forEach(t=>{t.gr.visible=false;});}
function setWave(u,x0,x1){if(u<=0){wave.visible=false;return null;}wave.visible=true;const x=x0+(x1-x0)*Math.pow(u,1.4),h=5+11*Math.min(1,u*1.8);wave.position.set(x,0,-.5);slab.scale.set(8,h,26);slab.position.set(4,h/2,0);deep.scale.set(6,h*.9,24);deep.position.set(5,h*.45,0);curl.scale.set(1,1,26);curl.position.set(.2,h+.3,0);curl.rotation.z=.45;crest.scale.set(1,1,26);crest.position.set(-1.8,h-.2,0);return {x,h};}
return {group:g,tick,tentacle,hideTent,setWave,setTone,show(b){g.visible=b;},pos:()=>g.position};}
