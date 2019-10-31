import { ServicesModule, API_CONFIG } from './services.module';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) {}

  // 获取轮播图
  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + 'banner').pipe(
      map((res: { banners: Banner[] }) => {
        // map要有返回值 不写大括号就可以不卸return
        return res.banners;
      })
    );
  }

  // 获取热门标签
  getHotTag(): Observable<HotTag[]> {
    return this.http.get(this.uri + 'playlist/hot').pipe(
      map((res: { tags: HotTag[] }) => {
        return res.tags
          .sort((x: HotTag, y: HotTag) => {
            return x.position - y.position;
          })
          .slice(0, 5);
      })
    );
  }

  // 获取热门标签
  getPersonalizedSongList(): Observable<SongSheet[]> {
    return this.http
      .get(this.uri + 'personalized')
      .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
  }
}
