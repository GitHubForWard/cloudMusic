import { CloudUiModule } from './cloud-ui/cloud-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, NgZorroAntdModule, CloudUiModule],
  exports: [FormsModule, NgZorroAntdModule, CloudUiModule]
})
export class ShareModule {}
