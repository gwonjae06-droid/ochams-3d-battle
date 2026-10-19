import * as T from 'three';
export function createStatue(A,V,EX){
const g=new T.Group();g.position.set(EX+1.2,0,-.5);g.visible=false;A.scene.add(g);
const rig=new T.Group();g.add(rig);
const M1=new T.MeshStandardMaterial({color:0xdcdfe6,roughness:.55,metalness:.05,emissive:0x000000}),M2=new T.MeshStandardMaterial({color:0x9a9ea8,roughness:.7}),DK=new T.MeshBasicMaterial({color:0x4a4d57});
const add=(geo,mat,x,y,z,p=rig)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);p.add(m);return m;};
add(new T.BoxGeometry(7,1.2,7),M2,0,.6,0);add(new T.CylinderGeometry(1.9,2.7,6.4,28),M1,0,4.4,0);
for(let i=0;i<8;i++){const a=i/8*Math.PI*2,f=add(new T.BoxGeometry(.18,5.6,.5),M2,Math.cos(a)*2.4,4.3,Math.sin(a)*2.4);f.rotation.y=-a;}
add(new T.CylinderGeometry(1.7,1.95,3.2,24),M1,0,8.9,0);const sh=add(new T.SphereGeometry(1,20,14),M1,0,10.3,0);sh.scale.set(2.5,.85,1.5);add(new T.CylinderGeometry(.55,.65,.9,12),M1,0,11,0);
const headG=new T.Group();headG.position.set(0,12.2,0);rig.add(headG);add(new T.SphereGeometry(1.2,24,18),M1,0,0,0,headG);add(new T.BoxGeometry(.35,.55,.3),M1,-1.15,-.1,0,headG);[-1,1].forEach(s=>add(new T.SphereGeometry(.22,10,8),DK,-1,.25,s*.45,headG));add(new T.BoxGeometry(.2,.12,1.1),M2,-1.05,.5,0,headG);add(new T.BoxGeometry(.1,.08,.6),DK,-1.1,-.6,0,headG);
for(let i=0;i<16;i++){const a=i/16*Math.PI*2;add(new T.SphereGeometry(.45,10,8),M1,Math.cos(a)*.9,.85+(i%3)*.12,Math.sin(a)*.9,headG);}
const rArm=new T.Group();rArm.position.set(0,10.3,-2.3);rig.add(rArm);add(new T.CylinderGeometry(.5,.45,2.6,12),M1,0,-1.3,0,rArm);
const rFore=new T.Group();rFore.position.set(0,-2.6,0);rArm.add(rFore);add(new T.CylinderGeometry(.42,.36,2.4,12),M1,0,-1.2,0,rFore);add(new T.SphereGeometry(.5,12,10),M1,0,-2.5,0,rFore);
const holder=new T.Group();holder.position.set(0,-2.5,0);rFore.add(holder);add(new T.CylinderGeometry(.09,.12,3.8,8),new T.MeshStandardMaterial({color:0x5f9a62,roughness:.6}),0,1.9,0,holder);
const bloom=new T.Group();bloom.position.set(0,3.9,0);bloom.rotation.z=.9;holder.add(bloom);
const petM=new T.MeshStandardMaterial({color:0xff7ab0,roughness:.4,emissive:0xff3a8a,emissiveIntensity:.3});add(new T.SphereGeometry(.5,12,10),new T.MeshBasicMaterial({color:0xffd24a}),0,.05,0,bloom);
for(let i=0;i<10;i++){const a=i/10*Math.PI*2,p=add(new T.SphereGeometry(1,10,8),petM,Math.cos(a)*.85,0,Math.sin(a)*.85,bloom);p.scale.set(.75,.14,.4);p.rotation.y=-a;}
const lArm=new T.Group();lArm.position.set(0,10.3,2.3);rig.add(lArm);add(new T.CylinderGeometry(.5,.45,2.6,12),M1,0,-1.3,0,lArm);const lFore=new T.Group();lFore.position.set(0,-2.6,0);lArm.add(lFore);add(new T.CylinderGeometry(.42,.36,2.4,12),M1,0,-1.2,0,lFore);add(new T.SphereGeometry(.55,12,10),M1,0,-2.5,0,lFore);
const orbM=new T.MeshBasicMaterial({color:0xff9ccc,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}),orb=Array.from({length:14},()=>{const m=new T.Mesh(new T.SphereGeometry(1,8,6),orbM);m.scale.set(.5,.12,.28);m.visible=false;rig.add(m);return m;});
const crackM=new T.MeshBasicMaterial({color:0xffb347}),cracks=Array.from({length:12},(_,i)=>{const c=new T.Mesh(new T.BoxGeometry(.08,1.2+(i%3)*.5,.04),crackM),a=i*2.4;c.position.set(Math.cos(a)*(1.9+(i%4)*.2),3+((i*1.37)%7),Math.sin(a)*(1.9+(i%4)*.2));c.lookAt(0,c.position.y,0);c.rotation.z=(i%5-2)*.3;c.visible=false;rig.add(c);return c;});
const vines=Array.from({length:3},()=>{const gr=new T.Group();gr.visible=false;A.scene.add(gr);const ms=[],vm=new T.MeshStandardMaterial({color:0x3f7a46,roughness:.6});for(let k=0;k<14;k++){const m=new T.Mesh(new T.SphereGeometry(1,8,6),vm);gr.add(m);ms.push(m);}return {gr,ms};});
const tv=new T.Vector3(),wv=new T.Vector3();
function pose(now,p){const q=Object.assign({lean:0,hy:0,rz:-1.45,rf:-.25,lz:.12,lf:0,glow:0,big:0,stacks:0,hop:0},p);rig.rotation.z=q.lean;rig.position.y=q.hop;headG.rotation.y=q.hy;rArm.rotation.z=q.rz;rFore.rotation.z=q.rf;lArm.rotation.z=q.lz;lFore.rotation.z=q.lf;holder.rotation.z=-(q.rz+q.rf);bloom.scale.setScalar(1+q.big+q.stacks*.06);bloom.rotation.y=now*.002*(1+q.glow*3);petM.emissiveIntensity=.3+q.glow*2.2+q.stacks*.05;
orb.forEach((m,k)=>{m.visible=k<q.stacks;if(!m.visible)return;const a=now*.0014*(1+q.glow*1.5)+k*Math.PI*2/14,r=4.2+.6*Math.sin(now*.002+k);m.position.set(Math.cos(a)*r,8+(k%5)*.75+Math.sin(now*.002+k)*.3,Math.sin(a)*r);m.rotation.y=-a;});}
function vine(i,from,to,amt,t){const v=vines[i];v.gr.visible=amt>.02;if(!v.gr.visible)return;const N=v.ms.length;v.ms.forEach((m,k)=>{const u=k/(N-1)*amt;tv.copy(from).lerp(to,u);tv.y+=Math.sin(u*Math.PI)*1.2+Math.sin(t*8+k)*.25*amt;tv.z+=Math.cos(t*6+k*.9)*.45*amt;m.position.copy(tv);m.scale.setScalar(Math.max(.1,(1-u*.6)*.32));});}
function hideVines(){vines.forEach(v=>{v.gr.visible=false;});}
function setPhase(ph){const on=ph>=2;M1.emissive.set(on?0x4a2a10:0x000000);cracks.forEach(c=>{c.visible=on;});}
return {group:g,pose,vine,hideVines,setPhase,show(b){g.visible=b;},flowerPos(){bloom.getWorldPosition(wv);return wv.clone();}};}
