export const SLOTS=Object.freeze({bae:0,choi:1,park:2});
export const STORY_ENCOUNTERS=Object.freeze({
gateFight:{bossId:1,variant:'checkpoint-clone',members:['bae'],title:'이권재의 검문용 턱검룡 분신'},
collectorFight:{bossId:2,variant:'collector',members:['bae','park'],title:'윤서윤의 추심 분체'},
officeFight:{bossId:3,variant:'inspection',members:['bae','park'],title:'오슬우의 민원 검수 장치'},
raidFight:{bossId:1,variant:'raid',members:['bae','park','choi'],title:'턱검룡 이권재 · 합동 단속'},
returnFight:{bossId:2,variant:'recovery',members:['bae','park','choi'],title:'윤서윤 · 물류 회수'},
trafficFight:{bossId:1,variant:'traffic',members:['bae','park','choi'],title:'턱검룡 이권재 · 통행 재검수'},
finalFight:{bossId:3,variant:'final',members:['bae','park','choi'],title:'오슬우 · 최종 검수'}
});
for(const e of Object.values(STORY_ENCOUNTERS)){Object.freeze(e.members);Object.freeze(e);}
export function encounterFor(node,party){const spec=STORY_ENCOUNTERS[node];if(!spec||!Array.isArray(party)||party.length!==spec.members.length||party.some((id,i)=>id!==spec.members[i]))throw Error('스토리 장면과 합류 인원이 일치하지 않습니다.');return {...spec,node,members:[...spec.members],slots:spec.members.map(id=>SLOTS[id])};}
export function acceptOutcome(request,response,finished=false){return !finished&&!!response&&response.requestId===request.requestId&&response.node===request.node&&response.type==='ochams-story-result'&&['win','lose'].includes(response.outcome);}
export function maskStoryParty(r,encounter){if(!r||r.storyEncounter)throw Error('새 전투 객체에만 스토리 파티를 설정할 수 있습니다.');const spec=encounterFor(encounter.node,encounter.members);if(!Array.isArray(r.party)||r.party.length!==3||r.party.some((a,i)=>SLOTS[a.id]!==i))throw Error('전투 슬롯 형식이 변경되었습니다.');if(!r.clock||typeof r.clock.sync!=='function'||typeof r.clock.select!=='function')throw Error('행동 게이지가 준비되지 않았습니다.');
const allowed=new Set(spec.members);for(const a of r.party){if(!allowed.has(a.id)){a.hp=0;a.en=0;a.shield=0;a.poison=0;a.stacks=0;a.iq=0;a.developed=false;a.nukeTurns=0;}}
r.pendingNukes=0;r.nukeDecayPending=false;r.storyEncounter=spec;r.active=spec.slots[0];
r.alive=function(){return [...this.party.map(a=>allowed.has(a.id)&&a.hp>0),this.bhp>0];};
const targets=r.targets.bind(r);r.targets=function(...args){return targets(...args).filter(i=>this.alive()[i]);};
const start=r.start.bind(r);r.start=function(action,who=this.active){if(!allowed.has(this.party[who]?.id))throw Error('아직 합류하지 않은 인물입니다.');return start(action,who);};
const team=r.team.bind(r);r.team=function(...args){const excluded=this.party.filter(a=>!allowed.has(a.id));try{return team(...args);}finally{for(const a of excluded){a.hp=0;a.en=0;a.shield=0;a.nukeTurns=0;a.developed=false;}}};
r.clock.sync(r.speeds(),r.alive());r.clock.current=-1;r.clock.select();if(r.clock.current<3)r.active=r.clock.current;
return spec;}
