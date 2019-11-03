import { ServicesModule, API_CONFIG } from './services.module';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Banner, HotTag, SongSheet, Singer } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';
import querystring from 'query-string';

interface SingerParams {
  offset: number;
  limit: number;
  cat: string;
}

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  defaultParams: SingerParams = {
    offset: 1,
    limit: 9,
    cat: '5001'
  };
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private uri: string
  ) { }

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

  // 获取入驻歌手
  getEnterSinger(args = this.defaultParams): Observable<Singer[]> {
    const params = new HttpParams({ fromString: querystring.stringify(args) });
    return this.http.get(this.uri + 'artist/list', { params }).pipe(map((res: { artists: Singer[] }) => res.artists));
  }

}
