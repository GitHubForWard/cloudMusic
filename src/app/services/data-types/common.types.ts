// 轮播图
export interface Banner {
  targetId: number;
  url: string;
  imageUrl: string;
}

// 热门标签
export interface HotTag {
  id: number;
  name: string;
  position: number;
}

// 歌手
export interface Singer {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
}

// 歌曲
export interface Song {
  id: number;
  name: string;
  url: string;
  ar: Singer[]; // 歌手详情
  al: { id: number; name: string; picUrl: string; }; // 歌曲专辑信息
  dt: number; // 歌曲时长
}

// 歌单
export interface SongSheet {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
}


