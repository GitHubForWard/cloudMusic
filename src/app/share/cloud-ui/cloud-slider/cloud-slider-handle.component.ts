import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CloudSliderStyle } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-cloud-slider-handle',
  template: '<div class="wy-slider-handle" [ngStyle]="style"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloudSliderHandleComponent implements OnInit, OnChanges {
  @Input() cloudVertical = false;
  @Input() cloudOffset: number;

  style: CloudSliderStyle = {};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (changes['cloudOffset']) {
      this.style[this.cloudVertical ? 'bottom' : 'left'] = this.cloudOffset + '%';
    }
  }

}
