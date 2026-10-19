export const TIMING={slash:{wind:.68,cut:.16,echo:.84,detonate:1.24,end:2.4},spin:{wind:.7,cut:.38,echo:1.08,detonate:1.45,end:2.8},smash:{rise:1.05,hold:1.4,impact:1.76,end:3.2},flurry:{start:1.1,interval:.055,count:52,detonate:4.22,end:5.5}};
export const FLURRY_HITS=Array.from({length:TIMING.flurry.count},(_,i)=>TIMING.flurry.start+i*TIMING.flurry.interval);
