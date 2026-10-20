import {sharedAudio,createPlayer} from './boss-material-v526.js?v=5.31';
const N=(filter,freq,gain,o={})=>({kind:'noise',filter,freq,gain,q:o.q||1,lfo:o.lfo||0,depth:o.depth||0});
const O=(wave,freq,gain)=>({kind:'osc',wave,freq,gain});
export function bedPlan(boss,phase){const p2=phase>=2;
if(boss===1)return [N('lowpass',p2?340:260,.09,{lfo:.12,depth:.25}),O('sine',55,.07)].concat(p2?[O('sine',82.4,.05)]:[]);
if(boss===2)return [N('bandpass',p2?700:420,.09,{q:1.4,lfo:.35,depth:.35}),O('sine',46,.08)].concat(p2?[O('triangle',69,.035)]:[]);
if(boss===3)return [N('lowpass',520,.045,{lfo:.08,depth:.2}),O('sine',98,.05),O('sine',p2?155:147,.035)];
return [];}
export function pulseInterval(ratio){return 700+Math.max(0,Math.min(.3,ratio))/.3*500;}
export function pulsePlan(ratio){if(!(ratio>0&&ratio<.3))return [];const k=1-ratio/.3;return [{type:'tone',wave:'sine',from:52,to:36,dur:.28,gain:.2+.15*k,delay:0},{type:'noise',filter:'lowpass',freq:150,dur:.12,gain:.12+.1*k,delay:0}];}
export function phaseSting(){return [{type:'noise',filter:'highpass',freq:1200,dur:.9,gain:.3,delay:0},{type:'tone',wave:'sine',from:70,to:30,dur:1.2,gain:.5,delay:0},{type:'tone',wave:'sawtooth',from:110,to:440,dur:1,gain:.12,delay:0}];}
export function gateVolume(env=globalThis){const st=env.__ochamsSoundState;if(st&&(st.enabled===false||st.wanted===false))return 0;if(env.document?.hidden||env.__ochamsHomeActive)return 0;return st?.musicVolume??.65;}
export function createBeds(audio){let layers=[],key='';
function build(ctx,s){const gain=ctx.createGain();gain.gain.value=0;let src,filter=null,lfo=null;
if(s.kind==='noise'){src=ctx.createBufferSource();src.buffer=audio.buf;src.loop=true;filter=ctx.createBiquadFilter();filter.type=s.filter;filter.frequency.value=s.freq;filter.Q.value=s.q;src.connect(filter);filter.connect(gain);
if(s.lfo){lfo=ctx.createOscillator();const depth=ctx.createGain();lfo.frequency.value=s.lfo;depth.gain.value=s.freq*s.depth;lfo.connect(depth);depth.connect(filter.frequency);lfo.start();}
src.start(0,Math.random()*.3);}
else{src=ctx.createOscillator();src.type=s.wave;src.frequency.value=s.freq;src.connect(gain);src.start();}
gain.connect(audio.out);return {src,filter,lfo,gain};}
function release(ctx){const t=ctx.currentTime;for(const l of layers){l.gain.gain.cancelScheduledValues(t);l.gain.gain.setTargetAtTime(0,t,.4);try{l.src.stop(t+2);l.lfo?.stop(t+2);}catch{}l.src.onended=()=>{try{l.src.disconnect();l.filter?.disconnect();l.gain.disconnect();}catch{}};}layers=[];}
return {get key(){return key;},get count(){return layers.length;},
set(newKey,specs,volume){if(!audio.ensure())return false;const ctx=audio.ctx;if(ctx.state==='suspended')ctx.resume?.().catch?.(()=>{});if(newKey!==key){release(ctx);key=newKey;layers=specs.map(s=>build(ctx,s));}const t=ctx.currentTime;layers.forEach((l,i)=>l.gain.gain.setTargetAtTime(specs[i].gain*volume,t,.5));return true;},
silence(){const ctx=audio.ctx;if(!ctx||!layers.length)return;const t=ctx.currentTime;for(const l of layers)l.gain.gain.setTargetAtTime(0,t,.3);},
stop(){const ctx=audio.ctx;if(ctx)release(ctx);key='';}};}
export function installAmbience(rig,H,opts={}){const pose=rig?.pose;if(typeof pose!=='function'||typeof H?.state!=='function')return false;
const audio=opts.audio||sharedAudio(),play=opts.play||createPlayer(audio),now=opts.now||(()=>globalThis.performance?.now?.()??Date.now()),env=opts.env||globalThis,beds=createBeds(audio);
let last=-1e9,lastPulse=-1e9,lastR=null,lastPhase=1,broken=false;
rig.pose=function(...a){const out=pose.apply(this,a);if(broken)return out;const t=now();if(t-last<200)return out;last=t;
try{const r=H.state(),vol=gateVolume(env),live=!!r&&[1,2,3].includes(r.boss)&&r.bhp>0;
if(r!==lastR){lastR=r;lastPhase=r?.phase||1;lastPulse=t;}
if(live&&vol>0)beds.set('b'+r.boss+'p'+(r.phase>=2?2:1),bedPlan(r.boss,r.phase),vol);else beds.silence();
if(live){if(r.phase>lastPhase)play(phaseSting());lastPhase=r.phase||1;const ratio=r.max>0&&r.max<1e8?r.bhp/r.max:1;if(ratio<.3&&t-lastPulse>=pulseInterval(ratio)){lastPulse=t;play(pulsePlan(ratio));}}}
catch(e){broken=true;console.warn('배경 음향 강화 건너뜀',e);try{beds.stop();}catch{}}
return out;};return true;}
