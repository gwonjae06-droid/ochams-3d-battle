import * as T from 'three';
export function applyOutfit(c){
const hero=c.hero;hero.updateMatrixWorld(true);
function paint(grp,hex,pick){grp.traverse(o=>{if(o.isMesh&&o.material&&(!pick||pick(o))){o.material=o.material.clone();if(o.material.color)o.material.color.set(hex);if(o.material.emissive)o.material.emissive.set(0x000000);}});}
function meshes(grp){const a=[];grp.traverse(o=>{if(o.isMesh&&o.geometry)a.push(o);});return a;}
function localBox(grp){const b=new T.Box3(),v=new T.Vector3();for(const m of meshes(grp)){m.updateWorldMatrix(true,false);if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();const bb=m.geometry.boundingBox;for(const x of [bb.min.x,bb.max.x])for(const y of [bb.min.y,bb.max.y])for(const z of [bb.min.z,bb.max.z]){v.set(x,y,z).applyMatrix4(m.matrixWorld);hero.worldToLocal(v);b.expandByPoint(v);}}return b;}
function add(parent,mesh,hp){const w=hero.localToWorld(hp.clone());parent.worldToLocal(w);mesh.position.copy(w);parent.add(mesh);return mesh;}
const BLACK=0x17181d,GRAY=0x8e9096,SKIN=0xf0c8a8;
paint(c.torso,BLACK);for(const k of ['la','le','ra','re'])paint(c[k],BLACK);
for(const k of ['le','re']){const ms=meshes(c[k]);if(ms.length>1){let best=null,bv=1e9;for(const m of ms){const s=new T.Vector3();new T.Box3().setFromObject(m).getSize(s);const v=s.x*s.y*s.z;if(v<bv){bv=v;best=m;}}if(best)paint(best,SKIN,o=>o===best);}}
for(const k of ['lh','lk','rh','rk'])paint(c[k],GRAY);
paint(c.head,SKIN);
try{
const tb=localBox(c.torso),hb=localBox(c.head),tw=tb.max.x-tb.min.x,th=tb.max.y-tb.min.y,tcx=(tb.max.x+tb.min.x)/2,tfz=tb.max.z;
const cv=document.createElement('canvas');cv.width=256;cv.height=128;const x=cv.getContext('2d');x.textAlign='center';x.fillStyle='#a3a8bd';x.font='bold 64px serif';x.fillText('UCLA',128,64);x.font='13px sans-serif';x.fillStyle='#b8bccc';x.fillText('University of California',128,90);x.fillText('Los Angeles',128,108);
const logo=new T.Mesh(new T.PlaneGeometry(tw*.62,tw*.31),new T.MeshBasicMaterial({map:new T.CanvasTexture(cv),transparent:true}));add(c.torso,logo,new T.Vector3(tcx,tb.min.y+th*.66,tfz+.012));
const pocket=new T.Mesh(new T.PlaneGeometry(tw*.55,th*.26),new T.MeshBasicMaterial({color:0x22242a}));add(c.torso,pocket,new T.Vector3(tcx,tb.min.y+th*.26,tfz+.008));
for(const s of [-1,1]){const d=new T.Mesh(new T.CylinderGeometry(.008,.008,th*.28,6),new T.MeshBasicMaterial({color:0xd5d5d5}));add(c.torso,d,new T.Vector3(tcx+s*tw*.1,tb.min.y+th*.8,tfz+.01));}
const hw=hb.max.x-hb.min.x,hh=hb.max.y-hb.min.y,hd=hb.max.z-hb.min.z,hcx=(hb.max.x+hb.min.x)/2,hcz=(hb.max.z+hb.min.z)/2,fz=hb.max.z+.008;
const hood=new T.Mesh(new T.TorusGeometry(hw*.46,hw*.1,8,20),new T.MeshBasicMaterial({color:BLACK}));hood.rotation.x=Math.PI/2;add(c.head,hood,new T.Vector3(hcx,hb.min.y+hh*.03,hcz));
const hairM=new T.MeshBasicMaterial({color:0x14110f});
const cap=new T.Mesh(new T.SphereGeometry(1,20,14,0,Math.PI*2,0,Math.PI*.58),hairM);cap.scale.set(hw*.58,hh*.46,hd*.58);add(c.head,cap,new T.Vector3(hcx,hb.max.y-hh*.36,hcz-hd*.02));
const bang=new T.Mesh(new T.BoxGeometry(hw*.92,hh*.15,hd*.16),hairM);add(c.head,bang,new T.Vector3(hcx,hb.max.y-hh*.2,hb.max.z-hd*.06));
const lensM=new T.MeshBasicMaterial({color:0x1a1b20}),frM=new T.MeshBasicMaterial({color:0xa6987a});
for(const s of [-1,1]){const l=new T.Mesh(new T.BoxGeometry(hw*.34,hh*.17,.012),lensM);add(c.head,l,new T.Vector3(hcx+s*hw*.21,hb.min.y+hh*.56,fz+.004));const f=new T.Mesh(new T.BoxGeometry(hw*.38,hh*.2,.008),frM);add(c.head,f,new T.Vector3(hcx+s*hw*.21,hb.min.y+hh*.56,fz));const arm=new T.Mesh(new T.BoxGeometry(.01,.012,hd*.6),frM);add(c.head,arm,new T.Vector3(hcx+s*hw*.5,hb.min.y+hh*.56,hcz+hd*.1));}
const br=new T.Mesh(new T.BoxGeometry(hw*.1,.012,.01),frM);add(c.head,br,new T.Vector3(hcx,hb.min.y+hh*.59,fz));
const pod=new T.Mesh(new T.SphereGeometry(hh*.055,10,8),new T.MeshBasicMaterial({color:0xffffff}));add(c.head,pod,new T.Vector3(hcx+hw*.5,hb.min.y+hh*.46,hcz));
const stem=new T.Mesh(new T.CylinderGeometry(hh*.018,hh*.018,hh*.14,6),new T.MeshBasicMaterial({color:0xffffff}));add(c.head,stem,new T.Vector3(hcx+hw*.5,hb.min.y+hh*.37,hcz));
}catch(e){console.warn('outfit decor skipped',e);}
}
