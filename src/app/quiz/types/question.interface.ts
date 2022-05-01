import { AnswerType } from "./answer.type";

export interface QuestionInterface {
    question: string,
    incorrectAnswers: AnswerType[],
    correctAnswer: AnswerType
}