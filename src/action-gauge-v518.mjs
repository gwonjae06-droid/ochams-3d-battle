export const WORK=10000;
const speed=x=>Number.isFinite(x)&&x>0?x:100;
export class ActionGauge{
constructor(s=[100,100,100,100],alive=[true,true,true,true]){this.time=0;this.current=-1;this.remaining=[WORK,WORK,WORK,WORK];this.carry=[0,0,0,0];this.order=[0,1,2,3];this.serial=4;this.sync(s,alive);this.select();}
sync(s,alive){this.speeds=s.map(speed);this.alive=alive.slice();return this;}
select(){let dt=Infinity;for(let i=0;i<4;i++)if(this.alive[i])dt=Math.min(dt,this.remaining[i]/this.speeds[i]);if(!Number.isFinite(dt)){this.current=-1;return -1;}for(let i=0;i<4;i++)if(this.alive[i])this.remaining[i]=Math.max(0,this.remaining[i]-dt*this.speeds[i]);this.time+=dt;let k=-1;for(let i=0;i<4;i++)if(this.alive[i]&&this.remaining[i]<1e-7&&(k<0||this.order[i]<this.order[k]))k=i;this.current=k;return k;}
next(s,alive){this.sync(s,alive);const i=this.current;if(i>=0){this.remaining[i]=WORK+this.carry[i];this.carry[i]=0;this.order[i]=this.serial++;}return this.select();}
delay(i,fraction=.25,executing=false){if(executing)this.carry[i]+=WORK*fraction;else this.remaining[i]+=WORK*fraction;if(this.current===i&&!executing)this.select();}
clone(){const c=Object.create(ActionGauge.prototype);for(const k of ['time','current','serial'])c[k]=this[k];for(const k of ['remaining','carry','order','speeds','alive'])c[k]=this[k].slice();return c;}
preview(s,alive,n=7){const c=this.clone().sync(s,alive),t=c.time,out=[];if(c.current>=0&&c.alive[c.current])out.push({i:c.current,av:0});while(out.length<n){const i=c.next(s,alive);if(i<0)break;out.push({i,av:c.time-t});}return out;}
}
