import { Component, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';

export interface question {
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {
  isText: boolean;
  questionType: number;
  answerType: number;
  question: string;
  answer: question = {
    answer1: "Rep1",
    answer2: "Rep2",
    answer3: "Rep3",
    answer4: "Rep4",
  };

  constructor(private timerService: TimerService,) { 
    this.question = "Comment allez vous ?";
    this.questionType = Math.floor(Math.random()*2)+1;
    this.answerType = 0;
  }

  ngOnInit() {
    this.timerService.setTime(5);
  }

  onChooseTypeAnswer(type: number) {
    this.answerType = type;
    this.questionType = 1;
    console.log("question", this.questionType)
  switch(type) {
    case 0:
    case 1:
    case 2:
  }
  this.timerService.countdown(5);
  }

  anwser() {

  }
}
