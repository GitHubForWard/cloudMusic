import { CloudSliderModule } from './../cloud-slider/cloud-slider.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudPlayerComponent } from './cloud-player.component';



@NgModule({
  declarations: [CloudPlayerComponent],
  imports: [
    CommonModule,
    CloudSliderModule
  ],
  exports: [CloudPlayerComponent]
})
export class CloudPlayerModule { }
