const url=new URL('./boot-v48.js?source=5.16',import.meta.url),res=await fetch(url,{cache:'no-store'});
if(!res.ok)throw Error('전투 로더 HTTP '+res.status);
let src=await res.text();
const old='P.resetFrame();PK.rest();PK.idle(mode,plan,performance.now(),P.choi);';
if(src.split(old).length!==2)throw Error('전투 검증 스냅샷 연결 위치가 변경되었습니다.');
src=src.replace(old,'P.resetFrame();PK.rest();A.presentationFrame={mode,plan,time:t,dt:DT,boss:r.boss,phase:r.phase,intent:r.intent,index:r.index};PK.idle(mode,plan,performance.now(),P.choi);').replaceAll('import.meta.url',JSON.stringify(url.href)).replace(/(from\s+)'(\.\/[^']+)'/g,(_,p,x)=>p+"'"+new URL(x,url).href+"'");
const blob=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));try{await import(blob);}finally{URL.revokeObjectURL(blob);}
