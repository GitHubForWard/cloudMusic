import { SheetService } from './../../services/sheet.service';
import {
  Banner,
  SongSheet,
  HotTag,
  Singer
} from './../../services/data-types/common.types';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singerEnterList: Singer[];
  @ViewChild(NzCarouselComponent, { static: true })
  private nzCaousel: NzCarouselComponent;
  constructor(private route: ActivatedRoute, private sheetServ: SheetService) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, songSheetList, singer]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singerEnterList = singer;
    });
  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCaousel[type]();
  }

  onPlaySheet(id: number) {
    console.log(id);
    this.sheetServ.playSheet(id).subscribe(response => {
      console.log(response);
    });
  }

  ngOnInit() { }
}
