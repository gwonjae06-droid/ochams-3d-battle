export function awakenedMoves(rank){return {heavy:rank>=3,galaxy:rank>=5,attack:rank>=3?'강타':'일반공격',ultimate:rank>=5?'갤럭시 임팩트':'블러드 문 · 공간 파쇄'};}
export const AWAKENING_POWER={heavy:85,galaxy:420};
export const AWAKENING_TIME={heavyHit:.86,heavyEnd:2.05,launch:.65,apex:2.25,fall:3.1,impact:4.15,heal:6.7,return:7,end:8.5};
