import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, Input, Inject, ChangeDetectorRef } from '@angular/core';
import { Observable, merge, fromEvent, from } from 'rxjs';
import { tap, pluck, distinctUntilChanged, takeUntil, map, filter } from 'rxjs/internal/operators';
import { SlideEventObservableConfig, SliderValue } from 'src/app/services/data-types/common.types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent, getElementOffset } from './cloud-slider-help';
import { limitNumberInRange } from './../../../utils/number';
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
export class CloudSliderComponent implements OnInit {
  @Input() cloudVertical = false;
  @Input() cloudMin = 0;
  @Input() cloudMax = 100;
  private sliderDom: HTMLDivElement;

  // 表示是否正在滑动
  private isDragging = false;
  value: SliderValue;
  @ViewChild('cloudSlider', { static: true }) private cloudSlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.sliderDom = this.cloudSlider.nativeElement;
    console.log('el:', this.cloudSlider);
    this.createDraggingObservalbes();
    this.subscribeDrag();
  }

  private createDraggingObservalbes() {
    const orienField = this.cloudVertical ? 'pageY' : 'pageX';
    const mouse: SlideEventObservableConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orienField]
    };
    const touch: SlideEventObservableConfig = {
      start: 'touchtart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orienField]
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
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number) {
    console.log(value);
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
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: SliderValue) {
    this.value = value;
    this.updataTrackAndHandles();
  }

  private updataTrackAndHandles() {

  }

  private toggleDragMoving(movable: boolean) {
    if (movable) {
      this.isDragging = movable;
      this.subscribeDrag(['move', 'end']);
    } else {
      // this.unsubscribeDrag(['move', 'end']);
    }
  }
  private findClosestValue(positon: number): number {
    // 获取滑块总长度
    const sliderLength = this.getSliderLength();
    // 获取滑块左端点/上端点位置
    const sliderStart = this.getSliderStartPositon();
    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRange((positon - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = this.cloudVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.cloudMax - this.cloudMin) + this.cloudMin;
  }
  private getSliderLength(): number {
    return this.cloudVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }
  private getSliderStartPositon(): number {
    {
      const offset = getElementOffset(this.sliderDom);
      return this.cloudVertical ? offset.top : offset.left;
    }
  }

}
