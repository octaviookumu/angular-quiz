import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { QuizStateInterface } from '../types/quiz.interface';
import mockData from '../data';
import { QuestionInterface } from '../types/question.interface';
import { AnswerType } from '../types/answer.type';

import { HttpClient } from '@angular/common/http';
import { BackendQuestionInterface } from '../types/backendquestion.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  apiUrl =
    'https://opentdb.com/api.php?amount=10&category=31&difficulty=medium&type=multiple&encode=url3986';

  initialState: QuizStateInterface = {
    // questions: mockData,
    questions: [],
    currentQuestionIndex: 1,
    showResults: false,
    correctAnswerCount: 0,
    answers: [],
    currentAnswer: null,
  };

  state$: BehaviorSubject<QuizStateInterface> =
    new BehaviorSubject<QuizStateInterface>({ ...this.initialState });

  constructor(private http: HttpClient) {}

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
    this.getQuestions();
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

  // remove the extra signs in the fetched data
  normalizeQuestions(
    backendQuestions: BackendQuestionInterface[]
  ): QuestionInterface[] {
    return backendQuestions.map((backendQuestion) => {
      const incorrectAnswers = backendQuestion.incorrect_answers.map(
        (backendIncorrectAnswer) => decodeURIComponent(backendIncorrectAnswer)
      );

      return {
        question: decodeURIComponent(backendQuestion.question),
        correctAnswer: decodeURIComponent(backendQuestion.correct_answer),
        incorrectAnswers,
      };
    });
  }

  getQuestions(): void {
    this.http
      .get<{ results: BackendQuestionInterface[] }>(this.apiUrl)
      .pipe(map((response) => response.results))
      .subscribe((questions) => this.loadQuestions(questions));
  }

  loadQuestions(backendQuestions: BackendQuestionInterface[]) {
    const normalizedQuestions = this.normalizeQuestions(backendQuestions);
    const initialAnswers = this.shuffleAnswers(normalizedQuestions[0]);
    this.setState({
      questions: normalizedQuestions,
      answers: initialAnswers,
    });
  }
}

// TODO: Add interceptor and loading status when getQuestions is fetching
