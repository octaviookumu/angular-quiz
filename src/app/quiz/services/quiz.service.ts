import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizStateInterface } from '../types/quiz.interface';
import mockData from '../data';
import { QuestionInterface } from '../types/question.interface';
import { AnswerType } from '../types/answer.type';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  initialState: QuizStateInterface = {
    questions: mockData,
    currentQuestionIndex: 1,
    showResults: false,
    correctAnswerCount: 0,
    answers: this.shuffleAnswers(mockData[0]),
    currentAnswer: null,
  };

  state$: BehaviorSubject<QuizStateInterface> =
    new BehaviorSubject<QuizStateInterface>({ ...this.initialState });

  constructor() {}

  getState(): Observable<QuizStateInterface> {
    return this.state$.asObservable();
  }

  getStateValue() {
    return this.state$.getValue();
  }

  // use partialstate to set certain values
  setState(partialState: Partial<QuizStateInterface>): void {
    this.state$.next({ ...this.state$.getValue(), ...partialState });
  }

  nextQuestion() {
    const state = this.state$.getValue();
    const newShowResults =
      state.currentQuestionIndex === state.questions.length;
    const newCurrentQuestionIndex = newShowResults
      ? state.currentQuestionIndex
      : state.currentQuestionIndex + 1;
    const newAnswers = newShowResults
      ? []
      : this.shuffleAnswers(state.questions[newCurrentQuestionIndex - 1]);

    this.setState({
      currentQuestionIndex: newCurrentQuestionIndex,
      showResults: newShowResults,
      answers: newAnswers,
      currentAnswer: null,
    });
  }

  shuffleAnswers(question: QuestionInterface): AnswerType[] {
    const unshuffledAnswers = [
      ...question.incorrectAnswers,
      question.correctAnswer,
    ];

    return unshuffledAnswers
      .map((unshuffledAnswer) => ({
        sort: Math.random(),
        value: unshuffledAnswer,
      }))
      .sort((a, b) => a.sort - b.sort)
      .map((el) => el.value);
  }

  restart() {
    this.setState(this.initialState);
  }

  selectAnswer(answer: AnswerType) {
    const state = this.state$.getValue();
    const newCorrectAnswerCount =
      answer === state.questions[state.currentQuestionIndex - 1].correctAnswer
        ? state.correctAnswerCount + 1
        : state.correctAnswerCount;
    this.setState({
      currentAnswer: answer,
      correctAnswerCount: newCorrectAnswerCount,
    });
  }
}
