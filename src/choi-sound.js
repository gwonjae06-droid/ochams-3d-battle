export function createChoiSound(){let ctx=null,master=null,on=true,nb=null;
function ac(){if(!on)return null;try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=.6;master.connect(ctx.destination);const len=ctx.sampleRate*2;nb=ctx.createBuffer(1,len,ctx.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}if(ctx.state==='suspended')ctx.resume();return ctx;}catch(e){return null;}}
function tone(f,d,o={}){const c=ac();if(!c)return;const t0=c.currentTime+(o.at||0),os=c.createOscillator(),g=c.createGain(),v=(o.vol??.25)*(o.pw??1);os.type=o.type||'sine';os.frequency.setValueAtTime(f,t0);if(o.to)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t0+d);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+d);os.connect(g);g.connect(master);os.start(t0);os.stop(t0+d+.05);}
function noise(d,o={}){const c=ac();if(!c)return;const t0=c.currentTime+(o.at||0),s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),v=(o.vol??.25)*(o.pw??1);s.buffer=nb;f.type=o.type||'lowpass';f.frequency.setValueAtTime(o.f0||1000,t0);if(o.f1)f.frequency.exponentialRampToValueAtTime(Math.max(30,o.f1),t0+d);f.Q.value=o.q||1;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(Math.max(.0002,v),t0+(o.a||.02));g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(f);f.connect(g);g.connect(master);s.start(t0,Math.random());s.stop(t0+d+.05);}
return {unlock(){ac();},setEnabled(v){on=v;},
show(i,pw=1){tone(120,.18,{to:45,vol:.55,pw});if(i%2===1){noise(.1,{type:'highpass',f0:2500,q:.8,vol:.2,pw});tone(220,.09,{type:'square',vol:.07,pw,at:.01});}noise(.04,{type:'highpass',f0:8000,vol:.08,at:.234,pw});const b=[55,55,65,73][i%4];tone(b,.4,{type:'sawtooth',vol:.14,pw});tone(b*2,.2,{type:'square',vol:.04,pw,at:.234});},
chant(i,pw=1){[392,392,523].forEach((f,k)=>tone(f,.13,{type:'square',vol:.13,pw,at:k*.15}));},
cheer(pw=1){noise(1.4,{type:'bandpass',f0:900,f1:2200,q:.6,vol:.22,pw,a:.5});},
donate(pw=1){[1318,1760,2093].forEach((f,k)=>tone(f,.25,{type:'triangle',vol:.16,pw,at:k*.09}));noise(.4,{type:'highpass',f0:6000,vol:.12,pw,at:.2});},
horn(pw=1){[440,554,659].forEach(f=>tone(f,.55,{type:'sawtooth',vol:.09,pw,to:f*1.02}));noise(.4,{type:'bandpass',f0:1800,q:2,vol:.08,pw});},
inferno(pw=1){noise(2.2,{type:'bandpass',f0:300,f1:1800,q:.5,vol:.34,pw,a:.3});tone(50,2,{type:'sawtooth',vol:.25,pw,to:35});tone(100,1.5,{type:'square',vol:.07,pw,to:60});},
infernoHit(pw=1){noise(.7,{f0:2600,f1:70,vol:.5,pw});tone(80,.6,{to:30,vol:.6,pw});tone(660,.4,{type:'triangle',vol:.1,pw,to:330});},
tick(pw=1){tone(1500+Math.random()*200,.04,{type:'square',vol:.09,pw});},
spin(pw=1){noise(2.6,{type:'bandpass',f0:300,f1:2200,q:2,vol:.12,pw,a:.4});tone(180,2.6,{type:'sawtooth',to:520,vol:.05,pw});},
jackpot(pw=1){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.45,{type:'triangle',vol:.22,pw,at:i*.07}));noise(1.2,{type:'highpass',f0:6000,vol:.18,pw});for(let i=0;i<10;i++)tone(2000+Math.random()*2500,.12,{vol:.08,pw,at:.3+i*.09});tone(80,.6,{to:40,vol:.5,pw});},
fail(pw=1){[392,330,262,196].forEach((f,i)=>tone(f,.4,{type:'sawtooth',vol:.16,pw,at:i*.22,to:f*.9}));noise(.6,{f0:600,f1:120,vol:.15,pw});},
flame(pw=1){noise(1.0,{type:'bandpass',f0:500,f1:2200,q:.7,vol:.28,pw,a:.1});tone(70,.9,{type:'sawtooth',vol:.14,pw,to:55});},
boom(pw=1){noise(.9,{f0:3200,f1:80,vol:.45,pw});tone(100,.7,{to:35,vol:.55,pw});},
buff(pw=1){[330,415,523,659,831].forEach((f,i)=>tone(f,.28,{type:'sawtooth',vol:.12,pw,at:i*.06}));noise(.5,{type:'highpass',f0:3000,vol:.1,pw});},
def(pw=1){tone(220,.9,{vol:.35,pw});tone(330,.9,{vol:.25,pw,at:.04});tone(1760,.5,{type:'triangle',vol:.1,pw,at:.1});noise(.3,{f0:2000,f1:400,vol:.15,pw});},
heal(pw=1){[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.5,{vol:.18,pw,at:i*.08}));},
shield(pw=1){tone(880,.7,{type:'triangle',vol:.2,pw,to:1760});tone(1320,.7,{vol:.12,pw,at:.05});noise(.4,{type:'highpass',f0:4500,vol:.1,pw});},
zap(pw=1){tone(200,.5,{type:'sawtooth',to:1800,vol:.18,pw});noise(.5,{type:'highpass',f0:3000,vol:.2,pw});for(let i=0;i<6;i++)tone(800+Math.random()*1800,.06,{type:'square',vol:.08,pw,at:i*.07});},
charge(pw=1){tone(90,.6,{type:'sawtooth',to:600,vol:.2,pw});noise(.6,{type:'bandpass',f0:200,f1:3000,q:3,vol:.12,pw});},
reveal(pw=1){tone(262,.15,{type:'square',vol:.15,pw});tone(523,.35,{type:'square',vol:.15,pw,at:.12});},
hurt(pw=1){tone(220,.18,{type:'sawtooth',to:110,vol:.2,pw});noise(.15,{f0:2000,f1:300,vol:.15,pw});},
revive(pw=1){[262,330,392,523,659,784].forEach((f,i)=>tone(f,.5,{vol:.2,pw,at:i*.07}));tone(60,.8,{to:30,vol:.5,pw});}};}
