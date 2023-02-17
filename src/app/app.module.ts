import { NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app-routes';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NavbarComponent,
    FooterComponent,
    CoreModule
  ],
  providers: [
    provideRouter(appRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
