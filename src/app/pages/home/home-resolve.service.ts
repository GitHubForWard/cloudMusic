import { HomeService } from './../../services/home.service';
import { Banner, HotTag, SongSheet, Singer } from './../../services/data-types/common.types';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { first } from 'rxjs/internal/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable({
    providedIn: 'root',
})
export class HomeResolveService implements Resolve<any> {
    constructor(private homeServe: HomeService) { }
    resolve(): Observable<HomeDataType> {
        return forkJoin([
            this.homeServe.getBanners(),
            this.homeServe.getHotTag(),
            this.homeServe.getPersonalizedSongList(),
            this.homeServe.getEnterSinger(),
        ]).pipe(first());
    }
}
