export const VERSION='5.29';
export function stampText(text,version=VERSION){const re=/v\d+(?:\.\d+)+/;return re.test(text)?text.replace(re,'v'+version):text+' v'+version;}
export function stampVersion(doc=globalThis.document,version=VERSION){if(!doc)return false;doc.documentElement?.setAttribute?.('data-build',version);
const title=stampText(doc.title||'오챔스',version);if(doc.title!==title)doc.title=title;
const node=doc.querySelector?.('header')?.firstChild;if(node&&node.nodeType===3){const text=stampText(node.textContent,version);if(text!==node.textContent)node.textContent=text;}
return true;}
export function watchVersion(doc=globalThis.document,Observer=globalThis.MutationObserver){if(!doc)return null;stampVersion(doc);const title=doc.querySelector?.('title');if(!title||!Observer)return null;const o=new Observer(()=>stampVersion(doc));o.observe(title,{childList:true,characterData:true,subtree:true});return o;}
