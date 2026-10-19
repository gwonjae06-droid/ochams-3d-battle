export class CombatClock {
constructor(now){this.real=now;this.virtual=now;this.rate=1;}
setRate(rate){if(rate!==1&&rate!==2)throw Error('Rate must be 1 or 2');this.rate=rate;}
resume(now){this.real=now;}
advance(now,paused=false){const delta=Math.min(.12,Math.max(0,(now-this.real)/1000));this.real=now;if(paused)return [];let remaining=delta*this.rate;const frames=[];while(remaining>1e-8){const step=Math.min(.04,remaining);this.virtual+=step*1000;frames.push(this.virtual);remaining-=step;}return frames;}
}
