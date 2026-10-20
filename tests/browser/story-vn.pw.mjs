import {test,expect} from '@playwright/test';
const atEnd=page=>page.evaluate(()=>window.DeliveryStory.current(window.DeliveryStoryApp.getState()).type==='end'&&document.getElementById('more').hidden);
async function finish(page){for(let i=0;i<600;i++){if(await atEnd(page))return;const b=page.locator('#actions button');if(await b.count())await b.first().click();else await page.locator('#box').click();}throw new Error('story did not finish');}
test('lines appear one at a time and choices open after the last line',async({page})=>{
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('/story-vn.html?new=1');await page.waitForFunction(()=>window.DeliveryStoryApp?.getState());
await expect(page.locator('#text')).toContainText('세상은 망했는데');await expect(page.locator('#actions button')).toHaveCount(0);await expect(page.locator('#left .fig')).toHaveCount(1);await expect(page.locator('#ep')).toContainText('대사 1/16');
await page.locator('#box').click();await expect(page.locator('#name')).toHaveText('배서준');await expect(page.locator('#left .fig.active')).toHaveCount(1);await expect(page.locator('#ep')).toContainText('대사 2/16');
await page.keyboard.press('Enter');await expect(page.locator('#ep')).toContainText('대사 3/16');
await page.locator('#skip').click();await expect(page.locator('#actions button')).toHaveCount(1);
expect(errors).toEqual([]);});
test('episode 1 explains why the checkpoint fight starts',async({page})=>{
await page.goto('/story-vn.html?new=1');await page.waitForFunction(()=>window.DeliveryStoryApp?.getState());
await page.locator('#skip').click();await page.locator('#actions button').first().click();
await page.locator('#skip').click();await page.locator('[data-action=smash]').click();
await expect(page.locator('#ep')).toContainText('대사 1/8');await page.locator('#box').click();await expect(page.locator('#text')).toContainText('교전');});
test('skip opens choices and a double click advances only once',async({page})=>{
await page.goto('/story-vn.html?new=1');await page.waitForFunction(()=>window.DeliveryStoryApp?.getState());
await page.locator('#skip').click();await expect(page.locator('#actions button')).toHaveCount(1);
await page.evaluate(()=>{const b=document.querySelector('#actions button');b.click();b.click();});
expect((await page.evaluate(()=>window.DeliveryStoryApp.getState())).rev).toBe(1);});
test('mobile playthrough finishes with the full party and resumes after navigation',async({page})=>{
await page.setViewportSize({width:390,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('/story-vn.html?new=1');await page.waitForFunction(()=>window.DeliveryStoryApp?.getState());
for(let i=0;i<6;i++){if(await page.locator('#skip').isEnabled())await page.locator('#skip').click();await page.locator('#actions button').first().click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
const saved=await page.evaluate(()=>window.DeliveryStoryApp.getState());
await page.goto('/story-vn.html?continue=1');await page.waitForFunction(()=>window.DeliveryStoryApp?.getState());expect(await page.evaluate(()=>window.DeliveryStoryApp.getState())).toEqual(saved);
await finish(page);await expect(page.locator('#notice')).toContainText('6화 완주');expect(await page.evaluate(()=>window.DeliveryStoryApp.getState().party)).toEqual(['bae','park','choi']);expect(errors).toEqual([]);});
