const url=new URL('./framing-v55.js?source=5.8',import.meta.url),response=await fetch(url,{cache:'no-store'});
if(!response.ok)throw Error('카메라 소스 로딩 실패: '+response.status);
let source=await response.text();
const needle='d=Math.max(h/(2*t*.73),w/(2*t*a*.78))';
if(source.split(needle).length!==2)throw Error('윤서윤 거리 패치 위치가 변경되었습니다.');
source=source.replace(needle,needle+'+(r.boss===2?6:0)').replace(/(from\s+)'(\.\/[^']+)'/g,(_,p,x)=>p+"'"+new URL(x,url).href+"'");
const blob=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
let factory;try{factory=(await import(blob)).createSpectacle;}finally{URL.revokeObjectURL(blob);}
export function createSpectacle(...args){return factory(...args);}
