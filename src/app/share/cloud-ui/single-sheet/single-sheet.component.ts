import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SongSheet } from 'src/app/services/data-types/common.types';


@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less']
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onPlay = new EventEmitter<number>();
  constructor() { }

  playSheet(id: number) {
    this.onPlay.emit(id);
  }

  ngOnInit() {
  }

}
