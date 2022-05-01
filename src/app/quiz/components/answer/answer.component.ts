import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AnswerType } from '../../types/answer.type';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerComponent implements OnInit {
  @Input('answerText') answerTextProps!: string;
  @Input('index') indexProps!: number;
  @Output('selectAnswer') selectAnswerEvent = new EventEmitter<AnswerType>();
  // @Input('correctAnswer') correctAnswerProps!: AnswerType | null;
  // @Input('currentAnswer') currentAnswerProps!: AnswerType | null;

  letterMapping: string[] = ['A', 'B', 'C', 'D'];

  constructor() {}

  ngOnInit(): void {
    if (!this.answerTextProps || this.indexProps === undefined) {
      console.log('Inputs in answer are not correct');
    }
  }

  selectAnswer() {
    // console.log("CLICKED")
    this.selectAnswerEvent.emit(this.answerTextProps);
  }
}
