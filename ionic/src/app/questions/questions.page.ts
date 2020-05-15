import { Component, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { GameService } from '../services/game.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationExtras, Router} from "@angular/router";
import { QuestionService, currentQuestion } from '../services/question.service';

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
  fakeId = 'aaf23f0bbb475a944045913a7b202d50596af11e';

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
  this.timerService.countdown(0.1);
  }

  anwser() {
      return "test123";
  }

  validate()
  {
    if(this.cashForm.valid)
    {
      let answer = this.anwser();
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
    if(difference === 0)
    {
      this.timerService.stopCountdown();
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
      this.timerService.stopCountdown();
      this.gameService.setLifes(this.gameService.getLifes()-1);
      this.canShowGoToAnswer = true;
      this.message = this.badAnswer;
      return this.message;
    }
    this.timerService.stopCountdown();
    this.gameService.setLifes(this.gameService.getLifes()-1);
    this.canShowGoToAnswer = true;
    this.message = this.tooManyAttempts;
    return this.message;
  }

  array_diff(array1 : [], array2 : [])
  {
    let diffArray = 0;
    let letter :[''] = [''];
    if(array1.length >= array2.length)
    {
      console.log("array1 >= array2 ");
      for(let i = 0; i <= array1.length;i++)
      {
        if(array1[i] !== array2[i])
        {
          diffArray = diffArray+1;
          letter.push(array1[i]);
        }
      }
    }else{
      console.log("array2 >= array1");
      for(let i = 0; i <= array2.length;i++)
      {
        if(array2[i] !== array1[i])
        {
          diffArray = diffArray+1;
          letter.push(array2[i]);
        }
      }
    }

    console.log(letter);
    console.log(diffArray);
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


