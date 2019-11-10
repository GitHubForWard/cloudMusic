import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy, SimpleChanges, } from '@angular/core';
import { CloudSliderStyle } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-cloud-slider-track',
  template: '<div class="wy-slider-strack" [ngStyle]="style"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloudSliderTrackComponent implements OnInit, OnChanges {
  @Input() cloudVertical = false;
  @Input() cloudLength: number;
  style: CloudSliderStyle = {};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cloudLength) {
      if (this.cloudVertical) {
        this.style.height = this.cloudLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.cloudLength + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }

}
