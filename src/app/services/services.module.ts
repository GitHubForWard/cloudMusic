import { NgModule, InjectionToken } from '@angular/core';
// 做成令牌，注入服务
export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    { provide: API_CONFIG, useValue: 'http://localhost:3000/' }
  ]
})
export class ServicesModule { }
