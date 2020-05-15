import { Component, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { GameService } from '../services/game.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationExtras, Router} from "@angular/router";

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
  questionType: number;//Si c'est une question qui demande une réponse sous forme de texte ou d'image
  answerType: number;//Cash/carre/duo
  question: string;//text de la question
  name: string;
  tentative: number = 0;
  cashForm : FormGroup;
  goodAnswer = "Bien joué vous avez trouvé la bonne réponse";
  badAnswer = "Ce n'est pas la bonne réponse";
  almostGoodAnswer = "Vous avez presque la bonne réponse";
  tooManyAttempts = "Dommage, vous avez écoulé votre nombre de tentative";
  message: string;
  canShowGoToAnswer : boolean = false;
  isGoodAnswer : boolean = false;
  fakeId = '5f325ebe3795d4984a051ac541f7dc131986891e';

  answer: question = {
    answer1: "Rep1",
    answer2: "Rep2",
    answer3: "Rep3",
    answer4: "Rep4",
  };

  constructor(private timerService: TimerService, private gameService: GameService, private router: Router) {
    this.question = "Comment allez vous ?";
    this.questionType = Math.floor(Math.random()*2)+1;
    this.answerType = 0;
    this.cashForm = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.timerService.setTime(5);
  }

  onChooseTypeAnswer(type: number) {
    this.answerType = type;
    this.questionType = 1;
  switch(type) {
    case 0:
    case 1:
    case 2:
  }
  this.timerService.countdown(5);
  }

  getAnwser() {
      return "test";
  }

  validate()
  {
    if(this.cashForm.valid)
    {
      let answer = this.getAnwser();
      let answerOfPlayer = this.cashForm.value.answer;
      if(!this.canShowGoToAnswer)
      {
        this.answerVerification(answer,answerOfPlayer);
      }
    }
  }

  answerVerification(answer: string, answerOfPlayer: string)
  {
    let arrayAnswer = answer.split('');
    let arrayAnswerOfPlayer = answerOfPlayer.split('');
    // @ts-ignore
    let difference = this.array_diff(arrayAnswer, arrayAnswerOfPlayer);
    console.log(difference);
    if(difference === 0)
    {
      this.isGoodAnswer = true;
      this.canShowGoToAnswer = true;
      this.message = this.goodAnswer;
      return this.message;
    }

    if(this.tentative <= 1)
    {
      if(difference <= 2)
      {
        this.tentative = this.tentative+1;
        this.message = this.almostGoodAnswer;
        return this.message;
      }
      this.canShowGoToAnswer = true;
      this.message = this.badAnswer;
      return this.message;
    }

    this.canShowGoToAnswer = true;
    this.message = this.tooManyAttempts;
    return this.message;
  }

  array_diff(array1 : [], array2 : [])
  {
    let diffArray = 0;
    for(let i = 0; i <= array1.length;i++)
    {
      if(array1[i] !== array2[i])
      {
        diffArray = diffArray+1;
      }
    }
    return diffArray;
  }
  pathToResultPage()
  {
    const navigationExtras: NavigationExtras = {
      state: {
        id: this.fakeId,
        boolAnswer: this.isGoodAnswer
      }
    };
    this.router.navigate(['/resultat-question'],navigationExtras)
  }
}


