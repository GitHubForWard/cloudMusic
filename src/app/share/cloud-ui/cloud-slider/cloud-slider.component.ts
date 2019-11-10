import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input, Inject,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable, merge, fromEvent, from, Subscription } from 'rxjs';
import { tap, pluck, distinctUntilChanged, takeUntil, map, filter } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from 'src/app/services/data-types/common.types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent, getElementOffset } from './cloud-slider-help';
import { limitNumberInRange, getPercent } from './../../../utils/number';
import { inArray } from './../../../utils/array';

@Component({
  selector: 'app-cloud-slider',
  templateUrl: './cloud-slider.component.html',
  styleUrls: ['./cloud-slider.component.less'],
  // 当前less相当于全局样式，否则子级样式不生效
  encapsulation: ViewEncapsulation.None,
  // OnPush 如果Input属性不发生变化 组件不会发生变更检测
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloudSliderComponent implements OnInit, OnDestroy {
  @Input() cloudVertical = false;
  @Input() cloudMin = 0;
  @Input() cloudMax = 100;
  private sliderDom: HTMLDivElement;

  @Output() wyOnAfterChange = new EventEmitter<SliderValue>();

  // 表示是否正在滑动
  private isDragging = false;

  value: SliderValue = null;
  offset: SliderValue = null;

  @ViewChild('cloudSlider', { static: true }) private cloudSlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  // tslint:disable-next-line:variable-name
  private dragStart_: Subscription | null;
  // tslint:disable-next-line:variable-name
  private dragMove_: Subscription | null;
  // tslint:disable-next-line:variable-name
  private dragEnd_: Subscription | null;

  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.sliderDom = this.cloudSlider.nativeElement;
    this.createDraggingObservalbes();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservalbes() {
    const orientField = this.cloudVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start)
        .pipe(
          filter(filterFunc),
          tap(sliderEvent),
          pluck(...pluckKey),
          map((position: number) => this.findClosestValue(position))
        );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolve$ = fromEvent(this.doc, move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });
    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolve$, touch.moveResolve$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unsubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (inArray(events, 'move') && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (inArray(events, 'end') && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private onDragStart(value: number) {
    this.setValue(value);
    this.toggleDragMoving(true);
  }
  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      // 手动的进行变更检测
      this.cdr.markForCheck();
    }
  }
  private onDragEnd() {
    this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: SliderValue) {
    if (this.value !== value) {
      this.value = value;
      this.updateTrackAndHandles();
    }
  }

  // 更新滑块和进度条
  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    console.log(this.value);
    this.cdr.markForCheck();
  }

  // value转offset
  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(this.cloudMin, this.cloudMax, value);
  }

  private toggleDragMoving(movable: boolean) {
    if (movable) {
      this.isDragging = movable;
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unsubscribeDrag(['move', 'end']);
    }
  }

  private findClosestValue(position: number): number {
    // 获取滑块总长度
    const sliderLength = this.getSliderLength();
    // 获取滑块左端点/上端点位置
    const sliderStart = this.getSliderStartPosition();
    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = this.cloudVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.cloudMax - this.cloudMin) + this.cloudMin;
  }

  private getSliderLength(): number {
    return this.cloudVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    {
      const offset = getElementOffset(this.sliderDom);
      return this.cloudVertical ? offset.top : offset.left;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeDrag();
  }

}
