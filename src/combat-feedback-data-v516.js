export const TYPES={normal:['일반공격','#ffd985'],ult:['궁극기','#e2b5ff'],extra:['추가공격','#b8ff88'],hurt:['피해','#ff9caf'],shield:['보호막 소모','#80ddff'],dot:['지속 피해','#ffbc7d'],heal:['회복','#8dffc7']};
export const amount=n=>String(Math.round(Math.max(0,Number(n)||0)*10)/10);
export const attackType=p=>p?.action==='followup'?'extra':p?.action==='ult'?'ult':'normal';
export function statuses(a){const s=[];if(a.shield>0)s.push('◈ 보호막 '+amount(a.shield));if(a.poison>0)s.push('☠ 독 '+a.poison+'턴');if(a.stacks>0)s.push('◇ 사유 '+a.stacks+'/12');if(a.atkUp&&a.atkT>0)s.push('⚔ 공격 +'+a.atkUp+' · '+a.atkT+'턴');if(a.defUp&&a.defT>0)s.push('▣ 방어 +'+a.defUp+' · '+a.defT+'턴');if(a.id==='park'&&a.nukeTurns>0)s.push('☢ 폭탄 '+a.nukeTurns+'턴');return s;}
export function bossStatuses(r){const s=[];if(r.burn>0)s.push('♨ 화상 '+r.burn+'턴');if(r.splitTurns>0)s.push('◉ 분열 '+r.splitTurns+'턴');if(r.boss===1&&r.phase===2)s.push(r.broken?'턱칼 파괴':'균열 '+r.cracks+'/6');return s;}
export function mergeHit(list,event,now){if(!(event.value>0))return null;for(let i=list.length-1;i>=0;i--){const p=list[i];if(p.key===event.key&&p.kind===event.kind&&now-p.at<=.16){p.value+=event.value;p.hits++;p.at=now;return p;}}const p={...event,at:now,hits:1};list.push(p);return p;}
export function ease(x){x=Math.max(0,Math.min(1,x));return x*x*x*(10-15*x+6*x*x);}
