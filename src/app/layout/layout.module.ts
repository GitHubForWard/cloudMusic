import { ShareModule } from './../share/share.module';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [FooterComponent, HeaderComponent],
  imports: [ShareModule],
  exports: [HeaderComponent, FooterComponent]
})
export class LayoutModule {}
