import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { QuizService } from '../../services/quiz.service';

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
      map((state) => state.currentQuestionIndex),
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
  }

  restart() {
    this.quizService.restart();
  }
}
