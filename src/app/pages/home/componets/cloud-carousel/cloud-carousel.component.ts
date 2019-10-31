import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-cloud-carousel',
  templateUrl: './cloud-carousel.component.html',
  styleUrls: ['./cloud-carousel.component.less'],
  // 更改变更检测机制
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloudCarouselComponent implements OnInit {
  @Input() activeIndex = 0;
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
  constructor() {}

  onChangeSlide(type: 'pre' | 'next') {
    this.changeSlide.emit(type);
  }

  ngOnInit() {}
}
