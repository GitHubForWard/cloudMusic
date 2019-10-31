import {
  Banner,
  SongSheet,
  HotTag
} from './../../services/data-types/common.types';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';

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
  @ViewChild(NzCarouselComponent, { static: true })
  private nzCaousel: NzCarouselComponent;
  constructor(private homeServe: HomeService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSongList();
  }

  private getBanners() {
    this.homeServe.getBanners().subscribe(response => {
      console.log('banners:', response);
      this.banners = response;
    });
  }

  private getHotTags() {
    this.homeServe.getHotTag().subscribe(response => {
      console.log('热门歌单:', response);
      this.hotTags = response;
    });
  }

  private getPersonalizedSongList() {
    this.homeServe.getPersonalizedSongList().subscribe(response => {
      console.log('推荐歌单:', response);
      this.songSheetList = response;
    });
  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCaousel[type]();
  }

  ngOnInit() {}
}
