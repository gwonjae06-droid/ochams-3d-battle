import * as T from 'three';
import {FACE_DATA,FACE_SUM} from './yoon-face.js?v=4.5';
export function createSlime(A,V,EX){
const g=new T.Group();g.position.set(EX+1.2,0,-.5);g.visible=false;A.scene.add(g);
const rig=new T.Group();g.add(rig);
const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d');
cx.fillStyle='#e9c9aa';cx.fillRect(0,0,128,128);cx.fillStyle='#2a1a14';cx.fillRect(34,50,16,8);cx.fillRect(78,50,16,8);cx.fillRect(48,94,32,5);
const faceTex=new T.CanvasTexture(cv);if(T.SRGBColorSpace)faceTex.colorSpace=T.SRGBColorSpace;
function sum(s){let a=0;for(let i=0;i<s.length;i++)a=(a*31+s.charCodeAt(i))%1000003;return a;}
function tryLoad(src,next){const im=new Image();im.onload=()=>{cx.clearRect(0,0,128,128);cx.drawImage(im,0,0,128,128);faceTex.needsUpdate=true;};im.onerror=()=>{if(next)next();};im.src=src;}
tryLoad('./yoon.jpg',()=>{if(sum(FACE_DATA)===FACE_SUM)tryLoad(FACE_DATA);});
const geo=new T.SphereGeometry(1,40,28),bp=geo.attributes.position,base=new Float32Array(bp.array);
const mat=new T.MeshStandardMaterial({color:0x4fcf63,transparent:true,opacity:.8,roughness:.12,metalness:.1,emissive:0x0e5a1c,emissiveIntensity:.7});
const body=new T.Mesh(geo,mat);body.scale.set(4.6,3.7,4.3);body.position.y=3.4;rig.add(body);
const core=new T.Mesh(new T.SphereGeometry(1.25,20,16),new T.MeshBasicMaterial({color:0x8a3dff,transparent:true,opacity:.85}));core.position.y=3.4;rig.add(core);
const fm=new T.MeshBasicMaterial({map:faceTex,transparent:true,side:T.DoubleSide}),Z3=new T.Vector3(0,0,1);
const faces=[];function mkFace(grp,pos,nrm,size,roll){const w=new T.Group(),m=new T.Mesh(new T.CircleGeometry(.5,28),fm);m.scale.set(size,size*1.12,1);m.rotation.z=roll;w.add(m);w.position.copy(pos);w.quaternion.setFromUnitVectors(Z3,nrm);grp.add(w);return {w,m,base:size,ph:Math.random()*6.28};}
faces.push(mkFace(rig,new T.Vector3(-4.85,3.9,0),new T.Vector3(-1,0,0),3.9,0));
for(let i=0;i<24;i++){let dx=Math.random()*2-1,dy=Math.random()*2-.6,dz=Math.random()*2-1;const l=Math.hypot(dx,dy,dz)||1;dx/=l;dy/=l;dz/=l;const n=new T.Vector3(dx/4.6,dy/3.7,dz/4.3).normalize();faces.push(mkFace(rig,new T.Vector3(4.6*1.07*dx,3.4+3.7*1.07*dy,4.3*1.07*dz),n,1.3+Math.random()*1.5,Math.random()<.3?Math.PI:(Math.random()-.5)*.8));}
const sp=new T.MeshBasicMaterial({color:0x9d5bff,transparent:true,opacity:.9});for(let i=0;i<6;i++){const c=new T.Mesh(new T.ConeGeometry(.5,2.2+(i%3)*.5,8),sp);const a=i/6*Math.PI*2;c.position.set(2.2+Math.cos(a)*.9,6.8+Math.sin(i)*.3,Math.sin(a)*1.8);c.rotation.z=-.4;rig.add(c);}
const puddle=new T.Mesh(new T.CircleGeometry(7,40),new T.MeshBasicMaterial({color:0x1d4a1f,transparent:true,opacity:.6,depthWrite:false}));puddle.rotation.x=-Math.PI/2;puddle.position.y=.04;rig.add(puddle);
const bub=new T.InstancedMesh(new T.SphereGeometry(1,8,6),new T.MeshBasicMaterial({color:0xc8ffb0,transparent:true,opacity:.55}),36),bs=Array.from({length:36},()=>({a:Math.random()*6.28,r:Math.random()*2.6,h:Math.random(),s:.1+Math.random()*.22,sp:.15+Math.random()*.25})),dm=new T.Object3D();rig.add(bub);bub.frustumCulled=false;
const tent=Array.from({length:3},()=>{const gr=new T.Group();gr.visible=false;A.scene.add(gr);const ms=[];for(let k=0;k<12;k++){const m=new T.Mesh(new T.SphereGeometry(1,10,8),mat);gr.add(m);ms.push(m);}return {gr,ms};});
const wave=new T.Group();wave.visible=false;A.scene.add(wave);
const NU=34,NV=56,wpos=new Float32Array((NU+1)*(NV+1)*3),wgeo=new T.BufferGeometry();wgeo.setAttribute('position',new T.BufferAttribute(wpos,3));const widx=[];for(let i=0;i<NV;i++)for(let j=0;j<NU;j++){const a=i*(NU+1)+j,b=a+NU+1;widx.push(a,b,a+1,b,b+1,a+1);}wgeo.setIndex(widx);
const wm=new T.MeshStandardMaterial({color:0x3fbf4f,transparent:true,opacity:.9,roughness:.2,emissive:0x167a2a,emissiveIntensity:.9,side:T.DoubleSide});
const wsheet=new T.Mesh(wgeo,wm),winner=new T.Mesh(wgeo,new T.MeshBasicMaterial({color:0x2a0e55,transparent:true,opacity:.55,side:T.DoubleSide})),wback=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0x1f5a2a,transparent:true,opacity:.8}));winner.position.x=3.2;wsheet.frustumCulled=false;winner.frustumCulled=false;wave.add(wsheet,winner,wback);
const wspikes=[];const spM=new T.MeshBasicMaterial({color:0xcfffb0});for(let k=0;k<14;k++){const c=new T.Mesh(new T.ConeGeometry(.45,2.4,8),spM);wave.add(c);wspikes.push(c);}
const wfaces=[];for(let k=0;k<9;k++){wfaces.push(mkFace(wave,new T.Vector3(),new T.Vector3(-1,.15,0).normalize(),3,k%3===0?Math.PI:(Math.random()-.5)*.6));}
function surf(s,z,h,W,now){const zn=z/(W/2),wrap=5.5*zn*zn,hv=h*(1+.2*Math.sin(z*.8+now*.002)+.1*Math.sin(z*2.1-now*.003))*(1-.2*zn*zn),claw=Math.pow(Math.max(0,Math.sin(z*1.7)),3),y=hv*s,back=.45*hv*s*s,ov=Math.pow(Math.max(0,(s-.68)/.32),1.7)*(hv*.55+3*claw),X=-back+ov+wrap+.25*Math.sin(s*14-now*.006+z);return [-X,y,z];}
function setTone(ph){if(ph>=2){mat.color.set(0x9be03a);mat.emissive.set(0x4a1a8a);wm.color.set(0x8ad03a);wm.emissive.set(0x4a1a8a);}else{mat.color.set(0x4fcf63);mat.emissive.set(0x0e5a1c);wm.color.set(0x3fbf4f);wm.emissive.set(0x167a2a);}}
function tick(now,dt,pose){const p=Object.assign({sx:1,sy:1,sz:1,ox:0,oy:0,oz:0,ry:0,rz:0,wob:1,glow:0},pose);rig.scale.set(p.sx,p.sy,p.sz);rig.position.set(p.ox,p.oy,p.oz);rig.rotation.set(0,p.ry,p.rz);
const a=bp.array,w=p.wob;for(let i=0;i<a.length;i+=3){const x=base[i],y=base[i+1],z=base[i+2],d=1+w*(.05*Math.sin(now*.0019+x*3.1+y*2.3)+.04*Math.sin(now*.0027+z*3.7+x*1.9))+(y<-.5?.07*(-y-.5):0);a[i]=x*d;a[i+1]=y*d;a[i+2]=z*d;}bp.needsUpdate=true;geo.computeVertexNormals();
mat.emissiveIntensity=.7+p.glow*1.6;const k=1+.12*Math.sin(now*.005)+p.glow*.3;core.scale.setScalar(k);puddle.scale.setScalar(1+.04*Math.sin(now*.003));
faces.forEach(f=>{const s=f.base*(1+.06*Math.sin(now*.003+f.ph));f.m.scale.set(s,s*1.12,1);});
bs.forEach((b,i)=>{b.h=(b.h+dt*b.sp)%1;dm.position.set(Math.cos(b.a+now*.0004)*b.r-.4,.9+b.h*5.4,Math.sin(b.a+now*.0004)*b.r);dm.scale.setScalar(b.s*(1-Math.abs(b.h-.5)*.8));dm.updateMatrix();bub.setMatrixAt(i,dm.matrix);});bub.instanceMatrix.needsUpdate=true;}
const tv=new T.Vector3();
function tentacle(i,from,to,amt,t){const tn=tent[i];tn.gr.visible=amt>.02;if(!tn.gr.visible)return null;const N=tn.ms.length;tn.ms.forEach((m,k)=>{const u=k/(N-1)*amt;tv.copy(from).lerp(to,u);tv.y+=Math.sin(u*Math.PI)*1.8+Math.sin(t*7+k*.8)*.3*amt;tv.z+=Math.sin(t*5+k*.7)*.5*amt;m.position.copy(tv);m.scale.setScalar(Math.max(.1,(1-u*.7)*.6));});return tn.ms[N-1].position.clone();}
function hideTent(){tent.forEach(t=>{t.gr.visible=false;});}
function setWave(u,x0,x1,m=1,now=0){if(u<=0){wave.visible=false;return null;}wave.visible=true;const x=x0+(x1-x0)*Math.pow(u,1.4),h=5+11*Math.min(1,u*1.8),W=9+19*m;wave.position.set(x,0,-.5);
let o=0;for(let iv=0;iv<=NV;iv++){const z=(iv/NV-.5)*W;for(let iu=0;iu<=NU;iu++){const p=surf(iu/NU,z,h,W,now);wpos[o++]=p[0];wpos[o++]=p[1];wpos[o++]=p[2];}}wgeo.attributes.position.needsUpdate=true;wgeo.computeVertexNormals();
wback.scale.set(6,h*.9,W);wback.position.set(7,h*.45,0);
wspikes.forEach((c,k)=>{const z=((k+.5)/14-.5)*W*.96,p=surf(1,z,h,W,now);c.position.set(p[0]-.5,p[1],p[2]);c.rotation.z=Math.PI/2+.5;c.scale.setScalar(h/12*(.6+.4*m));});
const ss=[.3,.45,.6,.75,.35,.5,.65,.8,.55],zs=[-.7,-.45,-.2,.05,.3,.55,.8,-.05,.2];wfaces.forEach((f,k)=>{const z=zs[k]*W*.5,p=surf(ss[k],z,h,W,now);f.w.position.set(p[0]-.35,p[1],p[2]);f.w.rotation.set(0,-Math.PI/2,0);f.w.visible=m>.25;f.base=(2.2+(k%3)*.9)*(.5+.5*m)*(h/10);f.m.scale.set(f.base,f.base*1.12,1);});
return {x,h,W};}
return {group:g,tick,tentacle,hideTent,setWave,setTone,show(b){g.visible=b;},pos:()=>g.position};}
