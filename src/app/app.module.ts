import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { ToastrModule } from "ngx-toastr";
import { RouterOutlet } from "@angular/router";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
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
    ToastrModule.forRoot(),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}