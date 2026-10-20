import {test,expect} from '@playwright/test';

const KEY='ochams-delivery-mvp-v1';
const state=page=>page.evaluate(()=>window.DeliveryStoryApp.getState());

test('story survives stale buttons, reload and corrupt saves without touching other records',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/story-mvp.html');
  await page.evaluate(()=>{localStorage.setItem('ochams-story-v2','legacy-sentinel');localStorage.setItem('ochams-campaign-v4','campaign-sentinel');});
  await page.locator('#new').click();
  await page.evaluate(()=>{const old=document.querySelector('#actions button');old.click();old.click();});
  expect((await state(page)).pos).toBe(1);
  await page.locator('#actions button').first().click();
  const saved=await state(page);
  await page.reload();
  await page.locator('#resume').click();
  expect(await state(page)).toEqual(saved);
  await page.evaluate(key=>localStorage.setItem(key,'{broken'),KEY);
  await page.reload();
  await page.locator('#resume').click();
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#notice')).not.toBeEmpty();
  expect(await page.evaluate(()=>localStorage.getItem('ochams-story-v2'))).toBe('legacy-sentinel');
  expect(await page.evaluate(()=>localStorage.getItem('ochams-campaign-v4'))).toBe('campaign-sentinel');
  expect(errors).toEqual([]);
});

test('mobile story completes with a retry and no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/story-mvp.html?new=1');
  let retried=false,complete=false;
  for(let i=0;i<100;i++){
    const type=await page.evaluate(()=>DeliveryStory.current(DeliveryStoryApp.getState()).type);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    if(type==='end'){complete=true;break;}
    if(type==='battle'&&!retried){
      const before=await state(page);
      await page.locator('[data-action=lose]').click();
      await page.locator('[data-action=retry]').click();
      const after=await state(page);
      expect(after.pos).toBe(before.pos);expect(after.bills).toBe(before.bills);
      expect(after.retries).toBe(before.retries+1);retried=true;
    }
    await page.locator('#actions button').first().click();
  }
  expect(complete).toBe(true);expect(retried).toBe(true);
  expect((await state(page)).party).toEqual(['bae','park','choi']);
  await expect(page.locator('#notice')).toContainText('6화 완주');
  expect(errors).toEqual([]);
});
