import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { AnswerType } from '../../types/answer.type';
import { QuestionInterface } from '../../types/question.interface';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnInit, OnDestroy {
  question$!: Observable<QuestionInterface>;
  answers$!: Observable<AnswerType[]>;
  correctAnswer!: AnswerType;
  currentAnswer!: AnswerType | null;
  destroy$ = new Subject<any>();

  constructor(private quizService: QuizService) {
    this.question$ = this.quizService
      .getState()
      .pipe(map((state) => state.questions[state.currentQuestionIndex - 1]));

    this.answers$ = this.quizService
      .getState()
      .pipe(map((state) => state.answers));
  }

  ngOnInit(): void {
    this.question$
      .pipe(
        map((question) => question.correctAnswer),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => (this.correctAnswer = res));

    this.quizService.state$
      .pipe(
        map((state) => state.currentAnswer),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => (this.currentAnswer = res));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  selectAnswer(answer: AnswerType) {
    this.quizService.selectAnswer(answer);
  }

  isCorrectAnswer(answer: AnswerType): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false;
    }
    let value = Boolean(this.currentAnswer) && answer === this.correctAnswer;
    return value;
  }

  isWrongAnswer(answer: AnswerType): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false;
    }
    return (
      this.currentAnswer === answer && this.currentAnswer !== this.correctAnswer
    );
  }

  isDisabledAnswer(answer: AnswerType): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false;
    }
    return Boolean(this.currentAnswer);
  }
}
