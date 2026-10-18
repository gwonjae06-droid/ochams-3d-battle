import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const status=document.querySelector('#status');
try{
const HEIGHT=1.68,scene=new THREE.Scene();scene.background=new THREE.Color('#111722');
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.05,50);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;document.body.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=2.2;controls.maxDistance=8;controls.maxPolarAngle=Math.PI*.49;
function view(name){controls.autoRotate=false;document.querySelector('#rotate').textContent='자동 회전 켜기';camera.position.set(...(name==='front'?[0,.9,3.5]:name==='side'?[3.5,.9,0]:[2.5,1.65,3.6]));controls.target.set(0,.86,0);controls.update();}view('reset');
scene.add(new THREE.HemisphereLight(0xc9e3ff,0x35313b,2));
const key=new THREE.DirectionalLight(0xffe5cf,3.2);key.position.set(3,6,4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);scene.add(key);
const rim=new THREE.DirectionalLight(0x83adff,2);rim.position.set(-3,3,-3);scene.add(rim);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x182231,roughness:.9}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);scene.add(new THREE.GridHelper(12,60,0x40516a,0x253449));
const clay=new THREE.MeshStandardMaterial({color:0xb9bec7,roughness:.75});const dark=new THREE.MeshStandardMaterial({color:0x546174,roughness:.8});
const root=new THREE.Group();root.name='Baeseojun_SlimMale_168cm';root.userData={heightMeters:HEIGHT,sex:'male',build:'slim',units:'meters',referencePose:'neutral'};scene.add(root);
function oval(parent,x,y,z,sx,sy,sz,mat=clay){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function joint(parent,name,x,y,z){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);return g;}
function limb(parent,length,a,b){const m=new THREE.Mesh(new THREE.CylinderGeometry(a,b,length,20),clay);m.position.y=-length/2;m.castShadow=true;parent.add(m);}
const hips=joint(root,'pelvis',0,.86,0);oval(hips,0,0,0,.145,.11,.09);
const torso=joint(hips,'spine',0,.10,0);oval(torso,0,.17,0,.17,.23,.10);oval(torso,0,.015,0,.115,.14,.075);
const neck=joint(torso,'neck',0,.40,0);oval(neck,0,.025,0,.047,.07,.048);
const head=joint(neck,'head',0,.16,0);oval(head,0,0,0,.106,.15,.102);oval(head,0,-.065,.009,.085,.085,.08);
oval(head,-.039,.025,.095,.014,.009,.006,dark);oval(head,.039,.025,.095,.014,.009,.006,dark);oval(head,0,-.01,.106,.017,.028,.021);oval(head,0,-.065,.088,.032,.004,.004,dark);oval(head,-.105,0,0,.018,.035,.018);oval(head,.105,0,0,.018,.035,.018);
function arm(side){const s=joint(torso,side<0?'leftShoulder':'rightShoulder',side*.205,.29,0);oval(s,0,0,0,.057,.065,.057);limb(s,.25,.043,.032);const e=joint(s,'elbow',0,-.25,0);oval(e,0,0,0,.033,.034,.033,dark);limb(e,.23,.035,.023);const hand=joint(e,'hand',0,-.26,0);oval(hand,0,0,.008,.036,.058,.026);oval(hand,-side*.032,.008,.012,.014,.029,.015);return{s,e};}
function leg(side){const h=joint(hips,side<0?'leftHip':'rightHip',side*.085,-.08,0);oval(h,0,0,0,.068,.075,.067);limb(h,.35,.063,.039);const k=joint(h,'knee',0,-.35,0);oval(k,0,0,0,.039,.04,.039,dark);limb(k,.34,.042,.025);const foot=joint(k,'ankle',0,-.34,0);oval(foot,0,-.025,.045,.046,.045,.10);return{h,k};}
const left=arm(-1),right=arm(1),ll=leg(-1),rl=leg(1);
root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root);const scale=HEIGHT/(bounds.max.y-bounds.min.y);root.scale.setScalar(scale);root.position.y=-bounds.min.y*scale;
const marker=new THREE.Group();const lineMat=new THREE.LineBasicMaterial({color:0xf0b786});function line(points){marker.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),lineMat));}line([[.48,0,0],[.48,HEIGHT,0]]);line([[.43,0,0],[.53,0,0]]);line([[.43,HEIGHT,0],[.53,HEIGHT,0]]);scene.add(marker);
const joints=[torso,head,left.s,left.e,right.s,right.e,ll.h,ll.k,rl.h,rl.k];let mode='idle',start=performance.now(),previous=start;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function choose(next){mode=next;start=performance.now();status.textContent='남성 / 마른 체형 / 基準 키 168cm / '+({idle:'대기',neutral:'기준 자세',guard:'가드',punch:'펀치'}[mode]);}choose('idle');
document.querySelectorAll('[data-pose]').forEach(b=>b.onclick=()=>choose(b.dataset.pose));document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view(b.dataset.view);if(b.dataset.view!=='reset')choose('neutral');});document.querySelector('#rotate').onclick=e=>{controls.autoRotate=!controls.autoRotate;e.target.textContent=controls.autoRotate?'자동 회전 끄기':'자동 회전 켜기';};
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
renderer.setAnimationLoop(now=>{const dt=Math.max(0,Math.min((now-previous)/1000,.05));previous=now;const t=(now-start)/1000,target=joints.map(()=>[0,0,0]);if(mode!=='neutral'){target[2][2]=-.08;target[4][2]=.08;target[3][0]=-.08;target[5][0]=-.08;target[6][2]=-.04;target[8][2]=.04;}if(mode==='guard'||mode==='punch'){target[0][1]=-.20;target[2]=[-.75,0,-.22];target[4]=[-.80,0,.22];target[3][0]=-1.65;target[5][0]=-1.65;target[7][0]=.10;target[9][0]=.10;}if(mode==='punch'){const p=THREE.MathUtils.clamp((t-.30)/.20,0,1),back=THREE.MathUtils.clamp((t-.75)/.40,0,1),ext=Math.sin(p*Math.PI/2)*(1-back);target[4][0]-=ext*.72;target[5][0]+=ext*1.58;target[0][1]+=ext*.55;if(t>1.25)choose('guard');}const blend=1-Math.exp(-dt*14);joints.forEach((j,i)=>['x','y','z'].forEach((axis,n)=>j.rotation[axis]=THREE.MathUtils.lerp(j.rotation[axis],target[i][n],blend)));hips.position.y=.86+((reduced||mode==='neutral')?0:Math.sin(now*.002)*.004);controls.update();renderer.render(scene,camera);});
}catch(error){console.error(error);status.textContent='3D 초기화 실패: WebGL 지원 여부를 확인하세요.';}
