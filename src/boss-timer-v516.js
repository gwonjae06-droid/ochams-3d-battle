import * as THREE from 'three';
import {installBossMaterial} from './boss-material-v526.js?v=5.31';
import {installGraphics} from './graphics-v527.js?v=5.28';
import {installSlimeLook} from './slime-look-v529.js?v=5.29';
import {installBossLooks} from './boss-look-v530.js?v=5.30';
import {installAmbience} from './ambience-v531.js?v=5.31';
import {watchVersion} from './version.js?v=5.31';
const url=new URL('./boss-cataclysm-v515.js?source=5.16',import.meta.url),res=await fetch(url,{cache:'no-store'});
if(!res.ok)throw Error('보스 연출 HTTP '+res.status);
let src=await res.text();
const needle='intent=r.intent,e=clock-start,p=bossParams(r,intent,e,reduced)';
if(src.split(needle).length!==2)throw Error('보스 실제 타이머 연결 위치가 변경되었습니다.');
src=src.replace(needle,"intent=A.presentationFrame?.mode==='boss'?A.presentationFrame.intent:r.intent,e=A.presentationFrame?.mode==='boss'?A.presentationFrame.time:clock-start,p=bossParams(r,intent,e,reduced)").replace(/(from\s+)'(\.\/[^']+)'/g,(_,p,x)=>p+"'"+new URL(x,url).href+"'");
const blob=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));let factory;try{factory=(await import(blob)).createSpectacle;}finally{URL.revokeObjectURL(blob);}
export function createSpectacle(...args){const rig=factory(...args);try{installBossMaterial(rig,args[4]);}catch(e){console.warn('보스 재질 효과음 건너뜀',e);}try{installGraphics(args[0],THREE);}catch(e){console.warn('향상 그래픽 건너뜀',e);}try{installSlimeLook(rig,args[0],THREE);}catch(e){console.warn('윤서윤 외형 강화 건너뜀',e);}try{installBossLooks(rig,args[0],THREE);}catch(e){console.warn('보스 외형 강화 건너뜀',e);}try{installAmbience(rig,args[4]);}catch(e){console.warn('배경 음향 강화 건너뜀',e);}try{watchVersion();}catch(e){console.warn('버전 표시 건너뜀',e);}return rig;}
