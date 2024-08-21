import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { ToastrModule } from "ngx-toastr";
import { RouterOutlet } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app.routes";
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from "@angular/common/http";
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderInterceptor } from "./shared/services/loader-intercepter.service";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    RouterOutlet,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}