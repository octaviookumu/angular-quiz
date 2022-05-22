import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnInit, OnDestroy {
  questionsLength$!: Observable<number>;
  currentQuestionIndex$!: Observable<number>;
  showResults$!: Observable<boolean>;
  correctAnswerCount$!: Observable<number>;
  destroy$ = new Subject<any>();

  constructor(private quizService: QuizService) {
    this.questionsLength$ = this.quizService
      .getState()
      .pipe(map((state) => state.questions.length));

    this.currentQuestionIndex$ = this.quizService
      .getState()
      .pipe(map((state) => state.currentQuestionIndex));

    this.showResults$ = this.quizService
      .getState()
      .pipe(map((state) => state.showResults));

    this.correctAnswerCount$ = this.quizService
      .getState()
      .pipe(map((state) => state.correctAnswerCount));
  }

  ngOnInit(): void {
    this.quizService.getQuestions();
  }

  nextQuestion() {
    this.quizService.nextQuestion();
  }

  restart() {
    this.quizService.restart();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
