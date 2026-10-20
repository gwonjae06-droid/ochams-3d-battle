export const DROPS=20,STRANDS=5;
const TAU=Math.PI*2;
export const RIM_VERT='varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}';
export const RIM_FRAG='uniform vec3 uColor;uniform float uPower;uniform float uAlpha;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.0-clamp(dot(normalize(vN),normalize(vV)),0.0,1.0),uPower);gl_FragColor=vec4(uColor*1.8,f*uAlpha);}';
export function dropState(i,t){const speed=.00022+((i*13)%7)*.00003,p=(((t*speed+(i*.6180339)%1)%1)+1)%1,a=i*2.399,r=2.4+((i*37)%10)/10*1.5,y0=2.5+(i%3)*.4,y=y0-(y0-.12)*p*p,fade=p>.9?Math.max(0,(1-p)/.1):Math.min(1,p/.08),w=.15+((i*11)%5)*.02;return {x:Math.cos(a)*r,y,z:Math.sin(a)*r*.93,sx:w*fade,sy:w*(1+3.2*p)*fade};}
export function strandState(i,t){const a=i*TAU/STRANDS+.4,r=2.3+(i%2)*.8;return {x:Math.cos(a)*r,z:Math.sin(a)*r*.93,len:1.1+.45*Math.sin(t*.0011+i*1.7),tilt:.12*Math.sin(t*.0017+i)};}
export function findSlime(scene){for(const g of scene?.children||[]){if(!g.isGroup)continue;const rig=g.children?.[0];if(!rig?.isGroup)continue;const body=rig.children.find(m=>m.isMesh&&Math.abs(m.scale.x-4.6)<.01);if(body)return {g,rig,body};}return null;}
export function buildSlimeLook(T,{g,rig,body}){
const rim=new T.Mesh(body.geometry,new T.ShaderMaterial({uniforms:{uColor:{value:new T.Color(0x9dffb0)},uPower:{value:2.4},uAlpha:{value:.85}},vertexShader:RIM_VERT,fragmentShader:RIM_FRAG,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));
rim.scale.setScalar(1.035);rim.frustumCulled=false;rim.raycast=()=>{};rim.userData.slimeLook529=true;body.add(rim);
const glow=new T.Mesh(new T.SphereGeometry(1.9,20,14),new T.MeshBasicMaterial({color:0x9a5bff,transparent:true,opacity:.16,blending:T.AdditiveBlending,depthWrite:false}));glow.position.set(0,3.4,0);glow.raycast=()=>{};rig.add(glow);
const sheen=new T.Mesh(new T.RingGeometry(5.2,7,48),new T.MeshBasicMaterial({color:0x7dff8f,transparent:true,opacity:.1,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));sheen.rotation.x=-Math.PI/2;sheen.position.y=.06;sheen.raycast=()=>{};rig.add(sheen);
const drips=new T.InstancedMesh(new T.SphereGeometry(1,8,6),new T.MeshStandardMaterial({color:0x6fe27f,transparent:true,opacity:.8,roughness:.1,emissive:0x0e5a1c,emissiveIntensity:.6}),DROPS);drips.frustumCulled=false;rig.add(drips);
const strandMat=new T.MeshStandardMaterial({color:0x6fe27f,transparent:true,opacity:.7,roughness:.15,emissive:0x0e5a1c,emissiveIntensity:.5}),strands=[];
for(let i=0;i<STRANDS;i++){const m=new T.Mesh(new T.CylinderGeometry(.06,.1,1,6),strandMat);m.raycast=()=>{};rig.add(m);strands.push(m);}
const dummy=new T.Object3D(),white=new T.Color(0xffffff);
function update(t){if(!g.visible)return;const c=body.material&&body.material.color;if(c){rim.material.uniforms.uColor.value.copy(c).lerp(white,.4);drips.material.color.copy(c);strandMat.color.copy(c);}
glow.material.opacity=.15+.07*Math.sin(t*.004);glow.scale.setScalar(1+.08*Math.sin(t*.005));sheen.material.opacity=.09+.04*Math.sin(t*.0026);
for(let i=0;i<DROPS;i++){const s=dropState(i,t);dummy.position.set(s.x,s.y,s.z);dummy.scale.set(Math.max(.001,s.sx),Math.max(.001,s.sy),Math.max(.001,s.sx));dummy.updateMatrix();drips.setMatrixAt(i,dummy.matrix);}
drips.instanceMatrix.needsUpdate=true;
for(let i=0;i<STRANDS;i++){const s=strandState(i,t),m=strands[i];m.position.set(s.x,s.len/2,s.z);m.scale.set(1,s.len,1);m.rotation.z=s.tilt;}}
return {rim,glow,sheen,drips,strands,update};}
const installed=new WeakSet();
export function installSlimeLook(rig,A,T,now=()=>globalThis.performance?.now?.()??Date.now()){const pose=rig?.pose;if(typeof pose!=='function'||!A?.scene||!T)return false;let look=null,calls=0,broken=false;
rig.pose=function(...a){const out=pose.apply(this,a);if(broken)return out;try{if(!look&&calls++%30===0){const f=findSlime(A.scene);if(f&&!installed.has(f.body)){installed.add(f.body);look=buildSlimeLook(T,f);}}if(look)look.update(now());}catch(e){broken=true;console.warn('윤서윤 외형 강화 건너뜀',e);}return out;};return true;}
