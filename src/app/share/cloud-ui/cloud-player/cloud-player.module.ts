import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudPlayerComponent } from './cloud-player.component';



@NgModule({
  declarations: [CloudPlayerComponent],
  imports: [
    CommonModule
  ],
  exports: [CloudPlayerComponent]
})
export class CloudPlayerModule { }
