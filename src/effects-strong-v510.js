const url=new URL('./spectacle-v54.js?source=5.11',import.meta.url),response=await fetch(url,{cache:'no-store'});
if(!response.ok)throw Error('강함 연출 소스 로딩 실패: '+response.status);
let source=await response.text();
const initial='let level=reduced?0:1,';
const control="const control=document.createElement('button');control.textContent=level?'연출: 표준':'연출: 약함';control.title='추가 카메라 흔들림과 입자량 조절';document.getElementById('tools').append(control);control.onclick=()=>{level=(level+1)%3;control.textContent=['연출: 약함','연출: 표준','연출: 강함'][level];};";
const fixed="const control=document.createElement('span');control.textContent='연출: 강함 (고정)';control.title='전투 연출은 강함으로 고정됩니다. 음소거와 자유 카메라는 별도로 유지됩니다.';control.style.cssText='padding:7px;border:1px solid #d59bf5;border-radius:6px;background:#352044;color:#ffe5ff;font:inherit;white-space:nowrap';document.getElementById('tools').append(control);";
if(source.split(initial).length!==2||source.split(control).length!==2)throw Error('연출 강함 고정 위치가 변경되었습니다.');
source=source.split("document.body.classList.contains('storying')").join("(document.getElementById('storyOverlay')?.hidden===false)");
source=source.replace(initial,'const level=2;let ').replace(control,fixed).replace(/(from\s+)'(\.\/[^']+)'/g,(_,p,x)=>p+"'"+new URL(x,url).href+"'");
const blob=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
let factory;try{factory=(await import(blob)).createSpectacle;}finally{URL.revokeObjectURL(blob);}
export function createSpectacle(...args){return factory(...args);}
