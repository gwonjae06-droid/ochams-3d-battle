import * as T from 'three';
export function createWheel(A){
const R=1.7,g=new T.Group();g.rotation.y=Math.PI/2;g.visible=false;A.scene.add(g);
const spin=new T.Group();g.add(spin);let n=6;
const bm=(c)=>new T.MeshBasicMaterial({color:c,side:T.DoubleSide});
const back=new T.Mesh(new T.CircleGeometry(R+.35,64),bm(0x151a2e));back.position.z=-.06;g.add(back);
const rim=new T.Mesh(new T.TorusGeometry(R+.18,.16,16,64),bm(0xe6b840));rim.position.z=.02;g.add(rim);
const bulbs=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2,b=new T.Mesh(new T.SphereGeometry(.09,8,6),bm(0xffffff));b.position.set(Math.cos(a)*(R+.18),Math.sin(a)*(R+.18),.16);g.add(b);bulbs.push(b);}
const hub=new T.Mesh(new T.CircleGeometry(.3,24),bm(0xe6b840));hub.position.z=.06;g.add(hub);
const ptr=new T.Mesh(new T.ConeGeometry(.24,.55,16),bm(0xff2d4a));ptr.position.set(0,R+.5,.2);ptr.rotation.z=Math.PI;g.add(ptr);
function label(text,color){const cv=document.createElement('canvas');cv.width=256;cv.height=128;const x=cv.getContext('2d'),lines=text.split('\n');x.textAlign='center';x.fillStyle=color;x.strokeStyle='#000';x.lineWidth=8;x.font='bold '+(lines.length===1?64:44)+'px sans-serif';lines.forEach((l,k)=>{const y=lines.length===1?78:54+k*54;x.strokeText(l,128,y);x.fillText(l,128,y);});return new T.CanvasTexture(cv);}
function clearSpin(){while(spin.children.length){const o=spin.children.pop();o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}}}
function setup(secs){clearSpin();n=secs.length;const seg=Math.PI*2/n;secs.forEach((s,i)=>{const m=new T.Mesh(new T.CircleGeometry(R,16,i*seg,seg),bm(s.c));spin.add(m);const mid=(i+.5)*seg,lb=new T.Mesh(new T.PlaneGeometry(1.05,.52),new T.MeshBasicMaterial({map:label(s.t,s.tc||'#ffffff'),transparent:true,side:T.DoubleSide}));lb.position.set(Math.cos(mid)*R*.62,Math.sin(mid)*R*.62,.03);lb.rotation.z=mid-Math.PI/2;spin.add(lb);const ln=new T.Mesh(new T.PlaneGeometry(R,.05),bm(0x10131f));ln.position.set(Math.cos(i*seg)*R/2,Math.sin(i*seg)*R/2,.02);ln.rotation.z=i*seg;spin.add(ln);});}
function indexAt(th){const seg=Math.PI*2/n,a=(((Math.PI/2-th)%(Math.PI*2))+Math.PI*2)%(Math.PI*2);return Math.floor(a/seg);}
function tick(now){bulbs.forEach((b,i)=>b.material.color.set(((Math.floor(now/140)+i)%2)?0xfff2a8:0xff5a5a));}
return {setup,indexAt,tick,count:()=>n,place(v){g.position.set(v.x+.25,1.95,v.z+2.7);},setAngle(a){spin.rotation.z=a;},scale(s){g.scale.setScalar(s);},show(b){g.visible=b;}};}
