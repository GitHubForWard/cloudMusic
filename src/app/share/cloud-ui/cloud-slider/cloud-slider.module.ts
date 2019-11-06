import { CloudSliderHandleComponent } from './cloud-slider-handle.component';
import { CloudSliderTrackComponent } from './cloud-slider-track.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudSliderComponent } from './cloud-slider.component';



@NgModule({
  declarations: [CloudSliderComponent, CloudSliderTrackComponent, CloudSliderHandleComponent],
  imports: [
    CommonModule
  ],
  exports: [CloudSliderComponent]
})
export class CloudSliderModule { }
