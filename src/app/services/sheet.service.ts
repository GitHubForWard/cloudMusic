import { SongService } from './song.service';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongSheet, Song } from './data-types/common.types';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    private songServ: SongService,
    @Inject(API_CONFIG) private uri: string
  ) { }

  // 获取歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id)
    // pluck() 只拿括号里面的属性 也相当于筛选
    .pipe(pluck('tracks'), switchMap(tracks => this.songServ.getSongList(tracks)));
  }
}


