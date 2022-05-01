import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { QuizStateInterface } from '../../types/quiz.interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnInit {
  questionsLength$!: Observable<number>;
  currentQuestionIndex$!: Observable<number>;
  showResults$!: Observable<boolean>;
  correctAnswerCount$!: Observable<number>;

  constructor(private quizService: QuizService) {
    this.questionsLength$ = this.quizService
      .getState()
      .pipe(map((state) => state.questions.length));

    this.currentQuestionIndex$ = this.quizService.getState().pipe(
      tap((res) => console.log('INITIAL', res.currentQuestionIndex)),
      map((state) => state.currentQuestionIndex),
      tap((res) => console.log('AFTER', res))
    );

    this.showResults$ = this.quizService
      .getState()
      .pipe(map((state) => state.showResults));

    this.correctAnswerCount$ = this.quizService
      .getState()
      .pipe(map((state) => state.correctAnswerCount));
  }

  ngOnInit(): void {}

  nextQuestion() {
    this.quizService.nextQuestion();
    // console.log("SHOW", this.quizService.getState())
  }

  restart() {
    this.quizService.restart();
  }
}
