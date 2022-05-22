import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class QuizInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isQuestionsRequest(req) && req.method === 'GET') {
      return next.handle(req).pipe(
        tap((event: any) => {
          if (event instanceof HttpResponse && event && event.body) {
            const body = event.body;
            // console.log('BODY', body);
          }
        })
      );
    }
    return next.handle(req);
  }

  isQuestionsRequest(req: HttpRequest<any>) {
    return req.url.startsWith('https://opentdb.com');
  }
}
