import { CloudPlayerModule } from './cloud-player/cloud-player.module';
import { PlayCountPipe } from './../play-count.pipe';
import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';

@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  imports: [
    CloudPlayerModule
  ],
  exports: [SingleSheetComponent, PlayCountPipe, CloudPlayerModule]
})
export class CloudUiModule { }
