export const DeliveryStory=(()=>{
const events=[],names={bae:'배서준',park:'박성원',choi:'최규원'};
const add=(ch,id,type,lines,extra={})=>events.push({ch,id,type,lines,...extra});
const option=(id,label,cost=0,when)=>({id,label,cost,when});
add(1,'arrival','dialogue',[['기록','세상은 망했는데 배달 예정 시간은 그대로다. 「치안 100%」 전광판 아래에서 단속기가 오토바이 바퀴를 압류 중이다.'],['배서준','배달료 2,900원. 한 건 하고 밥 먹는다.'],['시스템','배송지: 멸망구역. 수락 후 취소 위약금 59,000원.'],['배서준','가까운 게 아니라 갇힌 거네.']]);
add(1,'gate','choice',[['턱검룡','출입증을 내라. 발급소는 문 안쪽이다.'],['배서준','문보다 네 말이 더 단단하네.']],{options:[option('smash','차단기를 강타로 부순다',1200),option('terms','약관을 읽어 직원 통행 조항으로 따진다',300)]});
add(1,'gateReply','dialogue',[['시스템',s=>s.flags.gate==='smash'?'시설물 손괴 예상 청구 +1,200원.':'조항 열람료 +300원. 논쟁은 몸으로 접수합니다.'],['배서준','뭘 해도 돈을 뜯네.']]);
add(1,'gateFight','battle',[['기록','딸배 혼자 검문용 턱검룡 분신과 마주한다.']],{encounter:{bossId:1,variant:'검문 장치',goal:'단독 출입 통과'}});
add(1,'gateScene','scene',[['연출 목업','차단기 파괴 → 딸배의 멋진 포즈 → 화면을 채우는 수리비 청구서.'],['시스템','도시는 구하지 않았습니다. 출입만 처리되었습니다.']]);
add(1,'chapter1','chapter-end',[['기록','단말기 배터리가 꺼졌다. 유일하게 불이 켜진 연구소를 찾아간다.']]);
add(2,'lab','dialogue',[['배서준','보조배터리 있냐?'],['박성원','있지. 보조라는 표현에는 이견이 있어.'],['기록','건물만 한 장치가 휴대전화 한 대를 충전하고 있다.'],['박성원','실험을 중단하면 위약금이고 계속하면 전기요금이야.']]);
add(2,'charging','choice',[['박성원','충전할래, 아니면 계속 밀고 갈래?']],{options:[option('reactor','원자력 충전을 부탁한다',900),option('push','오토바이를 밀고 간다',500)]});
add(2,'collector','dialogue',[['윤서윤','폐기물 수거비를 받으러 왔어. 상담원 연결도 내가 해.'],['윤서윤','안녕하세요. 같은 얼굴의 다른 상담원입니다.'],['배서준','충전만 하러 왔는데 왜 내 이름도 적혀 있냐?']]);
add(2,'joinPark','join',[['시스템','공동 채무자: 배서준, 박성원.'],['박성원','같이 취소하러 가자. 혼자면 증인도 못 구해.']],{join:'park'});
add(2,'collectorFight','battle',[['박성원','일단 추심 분체를 치우고 민원청으로 가자.']],{encounter:{bossId:2,variant:'추심 분체',goal:'2인 파티 출구 확보'}});
add(2,'chapter2','chapter-end',[['배서준','내 배달인데 왜 공동 사업이 됐냐?'],['박성원','책임을 나누면 회사가 편하거든. 우리 말고.']]);
add(3,'office','dialogue',[['기록','꽃다발을 든 오슬우 조각상이 창구를 지킨다. 꽃에는 「장기근속 자동 지급」이 적혀 있다.'],['배서준','왜 계속 서 있어요?'],['오슬우','근무 중 착석 금지다. 질문은 하나씩 접수하라.']]);
add(3,'logic','choice',[['오슬우','모든 배달원에게 통행료가 부과된다. 배서준은 배달원이다. 전제가 참이면 그도 내야 하는가?']],{options:[option('read','내야 하지만 내가 내기는 싫다'),option('fast','빨리 달리면 면제다',200),option('guess','안 읽었지만 3번이다',400)]});
add(3,'logicReply','dialogue',[['오슬우',s=>s.flags.logic==='read'?'결론은 맞다. 감정은 별도 양식이다.':'그 결론은 전제에 없다. 오답 처리비를 청구한다.'],['박성원','조건은 내가 읽었어. 이제 접수 장치부터 끄자.']]);
add(3,'officeFight','battle',[['오슬우','정답과 별개로 공동 책임 검수가 남았다.']],{encounter:{bossId:3,variant:'민원 검수 장치',goal:'공동 채무 취소'}});
add(3,'chapter3','chapter-end',[['기록','줄 뒤에는 턱검룡이, 파견 창구에는 윤서윤의 다른 얼굴이 있었다.'],['배서준',s=>s.flags.charging==='reactor'?'도시 정전까지 우리 책임으로 적으면 진짜 부순다.':'밀고 왔는데 차량 이용료가 왜 나오냐.'],['시스템','취소 완료. 전력 복구 비용은 환락 구역에서 정산하십시오.']]);
add(4,'casino','dialogue',[['기록','시험장과 카지노. 입구는 「공정한 기회 무제한」, 출구는 「합격자 전용」이다.'],['최규원','이번에는 진짜 나간다. 아까는 나갈 연습이었음.'],['배서준','그거 돈이냐?'],['최규원','SP 쿠폰. 많으면 기분은 좋음.']]);
add(4,'roulette','choice',[['박성원','생활비로 환전되는지부터 확인하자.']],{options:[option('gamble','통행료를 따 보라고 한다',700),option('check','환전 약관부터 확인한다')]});
add(4,'rouletteReply','scene',[['연출 목업',s=>s.flags.roulette==='gamble'?'룰렛 잭팟 SP +3 → 생활비 환전 불가 안내.':'쿠폰 뒷면: 전투 전용. 현금 가치 없음.'],['최규원','이겼는데 왜 경제적으로는 졌지?']]);
add(4,'joinChoi','join',[['기록','최규원이 출구를 불로 열었다. 합동 단속 알림이 울린다.'],['턱검룡','지금은 다른 업무다.'],['배서준','맞는 입장에서는 똑같은데?'],['최규원','벌금도 공동으로 처리해 주냐?']],{join:'choi'});
add(4,'raidFight','battle',[['기록','세 명이 합동 단속을 뚫는다.']],{encounter:{bossId:1,variant:'합동 단속',goal:'3인 파티 출구 확보'}});
add(4,'chapter4','chapter-end',[['최규원','배달비 받으면 다 해결되지?'],['배서준','그 말은 내가 제일 먼저 했었다.']]);
add(5,'return','dialogue',[['시스템','비정상 배송 감지. 자동 반품을 시작합니다.'],['윤서윤','오염된 포장은 회수할게.'],['턱검룡','반품 차량의 진입 허가가 없다.'],['오슬우','배송과 반품 중 무엇이 먼저 존재했는가?'],['배서준','셋 다 남의 부서 승인 필요하다며. 그럼 서로 승인해.']]);
add(5,'plan','choice',[['박성원','읽어 둔 약관이 있으면 책임을 돌릴 수 있겠어.']],{options:[option('terms','약관으로 역민원을 건다',0,s=>s.flags.gate==='terms'||s.flags.logic==='read'),option('reader','성원에게 서류를 대신 읽힌다',400,s=>s.flags.gate!=='terms'&&s.flags.logic!=='read'),option('burn','규원에게 서류를 전부 태우게 한다',1000),option('queue','정상적으로 접수 번호를 뽑는다',300)]});
add(5,'returnFight','battle',[['윤서윤','회수 거부도 회수 대상이야.']],{encounter:{bossId:2,variant:'물류 회수',goal:'합동 검수 1/3'}});
add(5,'trafficFight','battle',[['턱검룡','압류 물품을 들고 통행하려는 건가?'],['최규원','뭘 들고 있어도 단속하잖아요.']],{encounter:{bossId:1,variant:'통행 재검수',goal:'합동 검수 2/3'}});
add(5,'finalFight','battle',[['오슬우','보류를 해제하려면 처리하라.'],['박성원','자기 자신을 호출하네.'],['배서준','그럼 호출 장치를 때리면 되겠네.']],{encounter:{bossId:3,variant:'최종 검수',goal:'합동 검수 3/3'}});
add(5,'chapter5','chapter-end',[['연출 목업','강타 → 양자 도약 → 화염. 세 부서의 도장이 찍힌다.'],['배서준',s=>s.flags.plan==='burn'?'태웠는데 사본이 왜 또 나오냐?':'승인 하나 받으려고 도시를 한 바퀴 돌았네.'],['시스템','배송 완료 권한 획득. 권한 사용 수수료는 별도입니다.']]);
add(6,'customer','dialogue',[['시스템','수취인: 배서준. 직접 수령 페이백이 자동 배차로 연결되었습니다.'],['박성원','처음부터 네 밥이었네.'],['배서준','내 밥을 왜 내가 찾아다녔는데?'],['최규원','고객님이 선택하신 서비스입니다.'],['배서준','너 지금 상담원 편이냐?']]);
add(6,'noodles','dialogue',[['최규원','불로 데워 줄까?'],['배서준','냉면이다. 한 발만 더 오면 배달 다시 간다.'],['박성원','면발 길이로 나누면 공평하겠네.'],['배서준','그릇부터 놔.']]);
add(6,'rating','choice',[['시스템','고객님, 배송을 평가해 주세요.']],{options:[option('one','별점 1점: 너무 늦었다',500),option('five','별점 5점: 내 계좌는 내가 용서한다')]});
add(6,'receipt','receipt',[['정산',s=>'배달 수당 2,900원 / 누적 청구 '+s.bills.toLocaleString()+'원 / 정산 수수료 '+settlement(s).service.toLocaleString()+'원 / 최종 '+settlement(s).net.toLocaleString()+'원'],['시스템',s=>s.flags.rating==='one'?'본인에게 남긴 별점 1점으로 기사 평가가 하락했습니다.':'만족도는 높고 정산액은 낮습니다. 정상 처리되었습니다.']]);
add(6,'ending','end',[['기록',s=>settlement(s).net<0?'마이너스 정산이 다음 근무로 이월됐다. 도시는 추가 근무를 축하했다.':'정산액 0원. 세상은 그대로고 냉면은 원래 차가웠다.'],['배서준','내일은 직접 사 먹는다.'],['턱검룡','포장 손님 통행료는 별도다.']]);
const clone=x=>JSON.parse(JSON.stringify(x));
function create(){return {version:1,pos:0,rev:0,party:['bae'],flags:{},bills:0,retries:0,failed:false};}
function current(s){return events[s.pos];}
function settlement(s){return {service:Math.max(0,2900-s.bills),net:Math.min(0,2900-s.bills)};}
function actions(s){const n=current(s);if(s.failed)return [{id:'retry',label:'이 전투 재도전'}];if(n.type==='end')return [];if(n.type==='battle')return [{id:'win',label:'목업: 승리하고 진행'},{id:'lose',label:'목업: 패배 흐름 테스트'}];return n.options?n.options.filter(o=>!o.when||o.when(s)):[{id:'next',label:n.type==='join'?'동료 합류 확인':n.type==='chapter-end'?'다음 화로':'계속'}];}
function step(state,key,rev=state.rev){if(rev!==state.rev)return state;const n=current(state),o=actions(state).find(o=>o.id===key);if(!o)throw Error('현재 장면에서 선택할 수 없습니다.');const s=clone(state);s.rev++;if(s.failed){s.failed=false;s.retries++;return s;}if(n.type==='battle'&&key==='lose'){s.failed=true;return s;}if(n.options){s.flags[n.id]=o.id;s.bills+=o.cost;}if(n.join&&!s.party.includes(n.join))s.party.push(n.join);s.pos++;return s;}
function restore(text){if(typeof text!=='string'||text.length>100000)throw Error('저장 파일이 너무 큽니다.');const s=JSON.parse(text);if(s?.version!==1||!Number.isInteger(s.pos)||!events[s.pos]||!Number.isSafeInteger(s.rev)||s.rev<0||!Number.isSafeInteger(s.retries)||s.retries<0||typeof s.failed!=='boolean'||!s.flags||Array.isArray(s.flags))throw Error('저장 형식이 올바르지 않습니다.');if(s.failed&&current(s).type!=='battle')throw Error('재도전 위치가 올바르지 않습니다.');const party=['bae'];let bills=0;for(const n of events.slice(0,s.pos)){if(n.join)party.push(n.join);if(n.options){const o=n.options.find(o=>o.id===s.flags[n.id]);if(!o||o.when&&!o.when(s))throw Error('선택 기록이 누락되거나 조건이 다릅니다.');bills+=o.cost;}}if(Object.keys(s.flags).some(k=>!events.slice(0,s.pos).some(n=>n.id===k&&n.options))||JSON.stringify(party)!==JSON.stringify(s.party)||s.bills!==bills)throw Error('합류·청구 기록이 일치하지 않습니다.');return {version:1,pos:s.pos,rev:s.rev,retries:s.retries,failed:s.failed,party,flags:{...s.flags},bills};}
return {events,names,create,current,actions,step,restore,settlement};})();
