import { LayoutModule } from './../layout/layout.module';
import { ServicesModule } from './../services/services.module';
import { ShareModule } from './../share/share.module';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { PagesModule } from './../pages/pages.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';

registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PagesModule,
    ShareModule,
    ServicesModule,
    LayoutModule,
    AppRoutingModule
  ],
  exports: [
    ShareModule,
    AppRoutingModule,
    LayoutModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
export class CoreModule {
  // SkipSelf装饰器: 跳过自己去父模块去查找
  // Optional装饰器： 当coreModule找不到的时候给parentModule赋值给null 就不回抛出错误
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule,只能被appModule引入');
    }
  }
}
