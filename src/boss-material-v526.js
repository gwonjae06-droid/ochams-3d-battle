const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const tone=(wave,from,to,dur,gain,delay=0)=>({type:'tone',wave,from,to,dur,gain,delay});
const noise=(filter,freq,dur,gain,delay=0)=>({type:'noise',filter,freq,dur,gain,delay});
const done=new WeakSet();
export function hitPower(damage,max){const d=Number(damage),m=Number(max);if(!(d>0))return 0;const ratio=m>0&&Number.isFinite(m)?d/(m*.08):1;return clamp(.35+.65*Math.sqrt(clamp(ratio,0,1)),.35,1);}
export function partyPower(total){const t=Number(total);return t>0?clamp(.4+t/250,.4,1):0;}
export function voicePlan(boss,role,power){const p=clamp(Number(power)||0,0,1);if(p<=0)return [];let s;
if(boss===1)s=[tone('sine',1180,1100,.38,.1),tone('sine',1830,1700,.3,.06),tone('sine',2760,2500,.22,.04),noise('highpass',5200,.04,.18)];
else if(boss===2)s=[tone('sine',280,85,.16,.22),noise('bandpass',650,.12,.16)].concat(p>.6?[tone('sine',480,900,.08,.08,.05)]:[]);
else if(boss===3)s=[noise('bandpass',950,.09,.24),tone('sine',125,50,.2,.26),tone('triangle',3200,2600,.03,.06)];
else return [];
if(role==='attack')s.push(tone('sine',95,38,.32,.22));
return s.map(x=>({...x,gain:x.gain*p}));}
export function shieldPlan(power){const p=clamp(Number(power)||0,0,1);return p>0?[tone('sine',1400,1250,.35,.09*p),tone('sine',2100,2000,.25,.04*p)]:[];}
export function createPlayer(){let ctx=null,out=null,buf=null;
function ensure(){if(ctx)return true;const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return false;ctx=new AC();out=ctx.createGain();out.gain.value=.5;const comp=ctx.createDynamicsCompressor();out.connect(comp);comp.connect(ctx.destination);buf=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.5),ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return true;}
return specs=>{const st=globalThis.__ochamsSoundState;if(!specs?.length)return;if(st&&(st.enabled===false||!(st.fxVolume>0)))return;if(globalThis.document?.hidden||globalThis.__ochamsHomeActive)return;if(!ensure())return;if(ctx.state!=='running'){ctx.resume?.().catch?.(()=>{});return;}
const vol=st?.fxVolume??.75,t0=ctx.currentTime+.005;
for(const s of specs){const at=t0+(s.delay||0),g=ctx.createGain(),peak=Math.max(.0002,s.gain*vol);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(peak,at+.01);g.gain.exponentialRampToValueAtTime(.0001,at+s.dur);
if(s.type==='tone'){const o=ctx.createOscillator();o.type=s.wave;o.frequency.setValueAtTime(s.from,at);o.frequency.exponentialRampToValueAtTime(Math.max(20,s.to),at+s.dur);o.connect(g);g.connect(out);o.start(at);o.stop(at+s.dur+.03);o.onended=()=>{o.disconnect();g.disconnect();};}
else{const n=ctx.createBufferSource(),f=ctx.createBiquadFilter();n.buffer=buf;f.type=s.filter;f.frequency.value=s.freq;if(s.filter==='bandpass')f.Q.value=1.2;n.connect(f);f.connect(g);g.connect(out);n.start(at,Math.random()*.3);n.stop(at+s.dur+.03);n.onended=()=>{n.disconnect();f.disconnect();g.disconnect();};}}};}
export function installMaterialHooks(r,play,now=()=>globalThis.performance?.now?.()??Date.now()){if(!r||typeof play!=='function'||done.has(r))return false;done.add(r);
const last={hit:-1e9,attack:-1e9,shield:-1e9};
function emit(kind,plan){if(!plan.length)return;const t=now();if(t-last[kind]<40)return;last[kind]=t;play(plan);}
function safe(f){try{f();}catch(e){console.warn('보스 재질 효과음 건너뜀',e);}}
const hit=r.hitBoss,bhit=r.bossHit;
if(typeof hit==='function')r.hitBoss=function(...a){const out=hit.apply(this,a);safe(()=>emit('hit',voicePlan(r.boss,'hit',hitPower(out?.damage,r.max))));return out;};
if(typeof bhit==='function')r.bossHit=function(...a){const out=bhit.apply(this,a);safe(()=>{if(!Array.isArray(out))return;const total=out.reduce((s,x)=>s+(Number(x?.damage)||0),0),blocked=out.reduce((s,x)=>s+(Number(x?.blocked)||0),0);emit('attack',voicePlan(r.boss,'attack',partyPower(total)));if(blocked>0)emit('shield',shieldPlan(partyPower(blocked)));});return out;};
return true;}
export function installBossMaterial(rig,H,play=createPlayer()){const pose=rig?.pose;if(typeof pose!=='function'||typeof H?.state!=='function')return false;rig.pose=function(...a){const out=pose.apply(this,a);try{installMaterialHooks(H.state(),play);}catch(e){console.warn('보스 재질 효과음 건너뜀',e);}return out;};return true;}
