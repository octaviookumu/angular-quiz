import { TestBed } from '@angular/core/testing';

import { QuizInterceptor } from './quiz.interceptor';

describe('QuizInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QuizInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: QuizInterceptor = TestBed.inject(QuizInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
