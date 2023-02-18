import { NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app-routes';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NavbarComponent,
    FooterComponent,
    CoreModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideRouter(appRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
