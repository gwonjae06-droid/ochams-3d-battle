export const CLONE_SPEC=Object.freeze({name:'이권재의 검문용 턱검룡 분신',owner:'이권재',scale:.58,palette:0x718799,light:0x69dfff});
export function makeCheckpointClone(T){const root=new T.Group();root.name='story-checkpoint-clone';root.userData.storyVariant='checkpoint-clone';root.userData.owner='이권재';root.scale.setScalar(CLONE_SPEC.scale);
const metal=new T.MeshStandardMaterial({color:CLONE_SPEC.palette,roughness:.55,metalness:.65}),edge=new T.MeshStandardMaterial({color:0xc5dae8,roughness:.25,metalness:.8}),lamp=new T.MeshBasicMaterial({color:CLONE_SPEC.light});
function mesh(g,m,x,y,z){const o=new T.Mesh(g,m);o.position.set(x,y,z);root.add(o);return o;}
const body=mesh(new T.SphereGeometry(1,18,12),metal,0,1.5,0);body.scale.set(1.1,.8,1.5);
const head=mesh(new T.SphereGeometry(1,20,14),metal,-1.25,2.2,.1);head.scale.set(.9,.7,1);
const jaw=mesh(new T.BoxGeometry(2.5,.2,.65),edge,-1.6,1.65,.1);jaw.rotation.z=-.12;
for(const s of [-1,1]){mesh(new T.ConeGeometry(.16,.9,8),edge,-1.2,3,s*.6);mesh(new T.SphereGeometry(.13,8,6),lamp,-1.95,2.35,s*.55);for(const x of [-.6,.65]){mesh(new T.CylinderGeometry(.15,.2,1,8),metal,x,.65,s*.7);mesh(new T.BoxGeometry(.6,.15,.45),edge,x-.13,.15,s*.8);}}
for(let i=0;i<5;i++){const tail=mesh(new T.SphereGeometry(1,10,8),metal,1.15+i*.48,1.35-i*.16,-i*.12);tail.scale.setScalar(.6-i*.09);}
const badge=mesh(new T.BoxGeometry(.48,.38,.05),lamp,-.55,1.7,1.1);badge.userData.label='검문 분신';
root.visible=false;
return {root,head,jaw,setState(mode,time=0){root.visible=mode!=='hidden';jaw.rotation.z=mode==='attack'?-.12-.5*Math.sin(Math.min(1,time)*Math.PI):-.12;head.rotation.y=mode==='disabled'?.3:Math.sin(time*1.7)*.035;},dispose(){root.traverse(o=>o.geometry?.dispose?.());for(const m of [metal,edge,lamp])m.dispose();root.parent?.remove(root);}};}
