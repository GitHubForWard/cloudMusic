import { ShareModule } from './../../share/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CloudCarouselComponent } from './componets/cloud-carousel/cloud-carousel.component';
import { MemberCardComponent } from './componets/member-card/member-card.component';


@NgModule({
  declarations: [HomeComponent, CloudCarouselComponent, MemberCardComponent],
  imports: [
    ShareModule,
    CommonModule,
    HomeRoutingModule
  ],
})
export class HomeModule { }
