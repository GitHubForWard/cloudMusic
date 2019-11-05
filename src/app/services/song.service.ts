import { Observable, observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServicesModule, API_CONFIG } from './services.module';
import { Injectable, Inject } from '@angular/core';
import { SongUrl, Song } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
    providedIn: ServicesModule
})

export class SongService {
    constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

    // 获取歌曲地址（可以获取多首歌的url）
    getSongUrl(ids: string): Observable<SongUrl[]> {
        const params = new HttpParams().set('id', ids);
        return this.http.get(this.uri + 'song/url', { params }).pipe(map((res: { data: SongUrl[] }) => res.data));
    }

    // 获取歌曲列表
    getSongList(songs: Song | Song[]): Observable<Song[]> {
        const songArr = Array.isArray(songs) ? songs.slice() : [songs];
        const ids = songArr.map(item => item.id).join(',');
        return Observable.create(observable => {
            this.getSongUrl(ids).subscribe(urls => {
                observable.next(this.generateSongList(songArr, urls));
            });
        });
    }

    private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
        const result = [];
        songs.forEach(song => {
            const url = urls.find(songUrl => songUrl.id === song.id).url;
            if (url) {
                result.push({ ...song, url });
            }
        });
        return result;
    }

}
