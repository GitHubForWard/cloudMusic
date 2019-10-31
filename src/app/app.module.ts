import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
