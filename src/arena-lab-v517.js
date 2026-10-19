import {arena as createBase,V,EX,OX,BL} from './arena-v34.js?v=3.4';
import {labClock} from './lab-stats-v517.js?v=5.17';
export {V,EX,OX,BL};
export function arena(){const a=createBase(),loop=a.renderer.setAnimationLoop.bind(a.renderer);globalThis.__ochamsArena=a;a.practiceX=EX;a.renderer.setAnimationLoop=fn=>{if(!fn)return loop(null);let last=null,virtual=0;return loop((now,frame)=>{if(last===null){last=now;virtual=now;}const dt=Math.max(0,now-last);last=now;if(labClock.active&&labClock.paused)return;if(labClock.active){const core=Number.parseFloat(document.getElementById('speed')?.textContent)||1;document.documentElement.style.setProperty('--cutin-duration',(.55/(labClock.speed*core))+'s');}virtual+=dt*(labClock.active?labClock.speed:1);return fn(virtual,frame);});};return a;}
