export const BRIDGES={
lab:[['기록','배달 지도가 꺼졌다. 서준은 충전할 곳을 찾다가, 거리에서 유일하게 불이 켜진 연구소 문을 두드렸다.'],['배서준','보조배터리 있냐?'],['박성원','있지. 보조라는 표현에는 이견이 있어.'],['기록','건물만 한 장치가 휴대전화 한 대를 충전하고 있다.'],['배서준','전화기 충전하려고 건물을 돌리는 거야?'],['박성원','반대야. 건물을 돌리는 실험인데, 지금 쓸 수 있는 출력 단자가 이거 하나야.'],['박성원','실험을 중단하면 위약금이고 계속하면 전기요금이야.'],['배서준','여기도 돈 때문에 못 멈추는구나. 난 배달 한 건 때문에 못 나가고.'],['기록','박성원은 꺼진 단말기를 받아 들고 케이블을 살폈다. 두 사람의 첫 공동 작업은 도시 구원이 아니라 충전이었다.']],
charging:[['박성원','충전할래, 아니면 계속 밀고 갈래?'],['배서준','충전은 전화기 얘긴데 왜 밀고 가는 선택지가 나와?'],['박성원','연구소 비상 단말기를 빌려줄 수도 있어. 대신 내가 장비를 끌고 동행해야 해.'],['시스템','원자력 충전 이용료 900원 / 장비 운반 동행료 500원. 선택 후에만 청구됩니다.']],
collector:[['기록',s=>s.flags.charging==='reactor'?'충전 표시가 켜지자 연구소 계량기에 방문자 이름이 등록됐다. 바로 그때 배수구에서 초록빛이 올라왔다.':'성원이 비상 단말기를 건네자 장비 운반 명단에 서준의 이름이 등록됐다. 바로 그때 배수구에서 초록빛이 올라왔다.'],['윤서윤','폐기물 수거비를 받으러 왔어. 상담원 연결도 내가 해.'],['윤서윤','안녕하세요. 같은 얼굴의 다른 상담원입니다.'],['배서준','충전만 하러 왔는데 왜 내 이름도 적혀 있냐?'],['윤서윤','연구소 이용 기록에 둘이 있잖아. 미납 연구 폐기물 비용의 공동 이용자야.'],['박성원','이 사람은 내 연구에 참여한 게 아니야. 방금 들어왔어.'],['윤서윤','방문 목적은 자유 입력이고, 공동 책임은 자동 입력이야.'],['기록','수거 분체가 출입문을 막고 장비에 회수 표식을 붙였다. 청구서는 아직 심사 중이지만, 압류는 먼저 시작됐다.']],
joinPark:[['시스템','공동 채무자: 배서준, 박성원.'],['배서준','남의 연구비 때문에 내 배달 단말기까지 가져간다고?'],['박성원','내 단말기에도 같은 번호가 떴어. 이건 여기서 말해 봐야 취소가 안 돼.'],['박성원','같이 취소하러 가자. 혼자면 증인도 못 구해.'],['기록','서준은 배달을 계속하려면 단말기를 지켜야 했고, 성원은 장비를 되찾으려면 공동 기록을 취소해야 했다. 목적지는 둘 다 민원청이었다.']],
collectorFight:[['박성원','일단 추심 분체를 치우고 민원청으로 가자.'],['윤서윤','미납 심사 중에는 출입과 장비 반출이 제한돼.'],['배서준','우리가 나가야 심사를 취소하러 가지!'],['기록','두 사람은 수거과 전체와 싸우려는 게 아니다. 문을 막은 추심 분체를 정지시켜, 단말기와 장비를 들고 빠져나가려는 것이다.']],
chapter2:[['기록','추심 분체가 문에서 물러났다. 채무 기록은 그대로였지만 민원청까지 갈 길은 열렸다.'],['배서준','내 배달인데 왜 공동 사업이 됐냐?'],['박성원','책임을 나누면 회사가 편하거든. 우리 말고.'],['기록','둘은 취소 접수 번호를 챙겼다. 다음 목적지는 공동 책임을 심사하는 민원청. 꽃다발을 든 석상이 창구를 지킨다는 안내가 붙어 있었다.']]
};
const FILES={bae:'./face.png',dragon:'./dragon_face.jpg',yoon:'./yoon.jpg'};
const SOURCES={park:'./src/park-combat.js',statue:'./src/statue-boss.js'};
export function extractPhoto(text){return /const PHOTO='(data:image\/jpeg;base64,[A-Za-z0-9+/=]+)'/.exec(text||'')?.[1]||null;}
export function installPortraits(doc=globalThis.document,fetcher=globalThis.fetch){
if(!doc||doc.getElementById('portraits535'))return;
const left=doc.getElementById('left'),right=doc.getElementById('right');if(!left||!right)return;
const note=doc.getElementById('note');if(note)note.textContent='사진을 불러오지 못하면 이니셜로 표시됩니다. 최규원 사진 자산은 별도 반영 예정입니다.';
const style=doc.createElement('style');style.id='portraits535';style.textContent='.fig img{width:92%;height:75%;object-fit:contain;object-position:center bottom;border-radius:9px;display:block}.fig small{flex-shrink:0}.fig{min-width:0}';doc.head.append(style);
const names={'배서준':'bae','박성원':'park','최규원':'choi','턱검룡':'dragon','윤서윤':'yoon','오슬우':'statue'},urls={...FILES};
function paint(){for(const parent of [left,right])for(const card of parent.children){if(card.querySelector('img')||card.dataset.photoFailed)continue;const id=names[card.querySelector('small')?.textContent],url=urls[id],initial=card.querySelector('b');if(!url||!initial)continue;const image=doc.createElement('img');image.alt=card.querySelector('small').textContent;image.onload=()=>{initial.hidden=true;};image.onerror=()=>{card.dataset.photoFailed='1';image.remove();initial.hidden=false;};image.src=url;card.prepend(image);}}
const observer=new MutationObserver(paint);observer.observe(left,{childList:true,subtree:true});observer.observe(right,{childList:true,subtree:true});paint();
if(typeof fetcher==='function')for(const [id,path] of Object.entries(SOURCES)){fetcher(path).then(r=>r.ok?r.text():'').then(text=>{const photo=extractPhoto(text);if(photo){urls[id]=photo;paint();}}).catch(()=>{});}
return {paint,disconnect:()=>observer.disconnect()};}
