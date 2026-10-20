import {test,expect} from '@playwright/test';
import path from 'node:path';
test('graphics toggle switches on and off without page errors and persists',async({page})=>{
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/three@0.180.0/build/*.js',route=>route.fulfill({path:path.resolve('node_modules/three/build',new URL(route.request().url()).pathname.split('/').pop()),contentType:'text/javascript',headers:{'access-control-allow-origin':'*'}}));
await page.goto('/');await page.waitForFunction(()=>window.__ochamsGame?.auditReady);
const button=page.locator('#gfx527');
await expect(button).toHaveText('그래픽: 표준');
await button.evaluate(b=>b.click());
await expect(button).toHaveText('그래픽: 향상');
await page.waitForTimeout(1500);
expect(await page.evaluate(()=>localStorage.getItem('ochams-gfx-v1'))).toBe('on');
await button.evaluate(b=>b.click());
await expect(button).toHaveText('그래픽: 표준');
expect(await page.evaluate(()=>localStorage.getItem('ochams-gfx-v1'))).toBe('off');
expect(errors).toEqual([]);
});
