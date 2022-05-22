import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizModule } from './quiz/quiz.module';
import { QuizInterceptor } from './quiz/interceptor/quiz.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, QuizModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: QuizInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
