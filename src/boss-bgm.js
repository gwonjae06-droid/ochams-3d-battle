export function createBossBgm(){
let ctx=null,master=null,rev=null,wet=null,track=0,phase=1,vol=.65,enabled=true,wanted=false,next=0,step=0,lastL=-1,nbuf=null;
const hz=n=>440*Math.pow(2,(n-69)/12);
function ensure(){if(ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;ctx=new AC();master=ctx.createGain();master.gain.value=0;const comp=ctx.createDynamicsCompressor();master.connect(comp);comp.connect(ctx.destination);rev=ctx.createConvolver();const len=Math.ceil(ctx.sampleRate*2.6),buf=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5)*.5;}rev.buffer=buf;wet=ctx.createGain();wet.gain.value=.55;rev.connect(wet);wet.connect(master);const nl=Math.ceil(ctx.sampleRate*1.2);nbuf=ctx.createBuffer(1,nl,ctx.sampleRate);const nd=nbuf.getChannelData(0);for(let i=0;i<nl;i++)nd[i]=Math.random()*2-1;setInterval(schedule,80);return true;}
function level(){const duck=document.body&&document.body.classList.contains('show');return !enabled||!wanted||document.hidden?0:vol*.7*(duck?.25:1);}
function mix(){if(!ctx)return;lastL=level();master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(lastL,ctx.currentTime,.3);}
function tone(type,f,dur,v,at,send=.3,o={}){const os=ctx.createOscillator(),g=ctx.createGain();os.type=type;os.frequency.setValueAtTime(f,at);if(o.to)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),at+dur);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),at+(o.atk||.015));g.gain.exponentialRampToValueAtTime(.0001,at+dur);if(o.lp){const fl=ctx.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(o.lp[0],at);fl.frequency.linearRampToValueAtTime(o.lp[1],at+dur*.5);fl.frequency.linearRampToValueAtTime(o.lp[0],at+dur);os.connect(fl);fl.connect(g);}else os.connect(g);g.connect(master);if(send>0){const s=ctx.createGain();s.gain.value=send;g.connect(s);s.connect(rev);}os.start(at);os.stop(at+dur+.05);}
function noise(dur,v,at,f,type='highpass'){const s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nbuf;fl.type=type;fl.frequency.value=f;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),at+.01);g.gain.exponentialRampToValueAtTime(.0001,at+dur);s.connect(fl);fl.connect(g);g.connect(master);s.start(at,Math.random()*.5);s.stop(at+dur+.05);}
const swampRoots=[38,38,41,36],blip=[62,65,68,69,72],dm=[[53,57,60,64],[50,57,62,65],[50,55,58,64],[52,57,59,64]],dbass=[38,34,43,33],scale=[62,64,65,67,69,71,72,74,76];
function dur(){return track===2?60/(phase===2?88:72)/2:60/(phase===2?66:54);}
function swamp(at,i,d){const k=i%16,root=swampRoots[Math.floor(i/16)%4];if(k===0){tone('sawtooth',hz(root),d*15,.15,at,.2,{lp:[110,380],atk:.4});[0,1,6,7].forEach(n=>tone('triangle',hz(root+24+n),d*14,.032,at,.6,{atk:.8}));}
if(k===0||k===10)tone('sine',90,.4,.5,at,.05,{to:34});
if(Math.random()<(phase===2?.5:.32)){const n=blip[Math.floor(Math.random()*blip.length)];tone('sine',hz(n),.12,.085,at,.5,{to:hz(n)*1.7});}
if(phase===2&&k%4===2)noise(.2,.07,at,2200,'bandpass');
if(phase===2&&k%8===6)tone('square',hz(root+18),.5,.045,at,.4,{lp:[300,900]});}
function gallery(at,i,d){const beat=i%3,bar=Math.floor(i/3),ci=Math.floor(bar/2)%4,tones=dm[ci];
if(beat===0)tone('sine',hz(dbass[ci]),d*2.9,.26,at,.25,{atk:.03});
if(beat>0){tone('triangle',hz(tones[beat===1?0:1]),d*1.5,.055,at,.4);tone('triangle',hz(tones[beat===1?2:3]),d*1.5,.05,at+.02,.4);}
if(beat===0&&bar%2===0||beat===2&&Math.random()<.5){const f=hz(scale[Math.floor(Math.random()*scale.length)]);tone('sine',f,2.4,.11,at,.7,{atk:.01});tone('sine',f*2.76,1.1,.022,at,.7,{atk:.01});}
noise(.025,phase===2?.05:.025,at,9000);
if(phase===2){if(bar%4===3&&beat===0){tone('sine',75,.9,.5,at,.3,{to:38});noise(.25,.2,at,300,'lowpass');}if(bar%8===7&&beat===0)[62,63,66,69].forEach(n=>tone('sawtooth',hz(n-12),d*5,.04,at,.5,{lp:[200,800],atk:.6}));}}
function schedule(){if(!ctx||ctx.state!=='running'||!track)return;const L=level();if(Math.abs(L-lastL)>.001)mix();if(!wanted){next=ctx.currentTime+.05;return;}if(next<ctx.currentTime-.2)next=ctx.currentTime+.05;while(next<ctx.currentTime+.25){const d=dur();if(track===2)swamp(next,step,d);else gallery(next,step,d);next+=d;step++;}}
document.addEventListener('pointerdown',()=>{if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{});},{passive:true});
document.addEventListener('visibilitychange',mix);
return {play(id,ph=1){wanted=true;if(!ensure())return;track=id;phase=ph;step=0;if(ctx.state==='suspended')ctx.resume().catch(()=>{});next=ctx.currentTime+.4;mix();},stop(){wanted=false;track=0;mix();},phase(p){phase=p;},volume(v){vol=Math.max(0,Math.min(1,v));mix();},enable(b){enabled=b;mix();},_tick:schedule,_dbg(){return {track,phase,step};}};}
