import { Component, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { GameService } from '../services/game.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationExtras, Router} from "@angular/router";
import { QuestionService, currentQuestion, placeData } from '../services/question.service';
import { ApiService } from '../services/api.service';

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
  currentplaceinfo: currentQuestion;
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
  arrayAnswer : placeData[] = [];
  rightAnswer: string;
  canShowAnswer: boolean =true;
  pictures: string[] = [];
  answer: question = {
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
  };


  constructor(
              private timerService: TimerService,
              private gameService: GameService, 
              private router: Router, 
              private questionservice: QuestionService,
              private apiService: ApiService) {
    this.questionType = Math.floor(Math.random()*2)+1;
    this.answerType = 0;
    this.cashForm = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
    this.questionservice.questionEventEmitter.subscribe(data => {
      // @ts-ignore
      this.currentplaceinfo = this.questionservice.getQuestion();
      this.arrayAnswer = this.currentplaceinfo.answers;
      if (this.questionType == 1) {
        this.question = "(BipBoop) Ou se trouve "+ this.currentplaceinfo.rightanswer.site + " (BipBoop)";
      } else {
        this.question = "Laquelle de ces 4 images représente le site : " + this.currentplaceinfo.rightanswer.site;
      }
      this.rightAnswer = this.currentplaceinfo.rightanswer.country;
      this.arrayAnswer.forEach(element => {
        
    this.apiService.getImage(parseInt(element.id)).subscribe( data => {
        const el = document.createElement( 'html' );
      el.innerHTML = data;
      const imgs = el.getElementsByClassName('icaption-img');
      console.log(imgs[0].getAttribute('data-src'));
      this.pictures.push("https://whc.unesco.org" + imgs[0].getAttribute('data-src'));
    });
  });
  this.timerService.countdown(0.1);
  });
  }

  ngOnInit() {
    this.timerService.setTime(1);
  }

  onChooseTypeAnswer(type: number) {
    this.answerType = type;
    this.questionType = 1;
  switch(type) {
    case 4:
      this.getAnswerCarre();
      break;
    case 2:
      this.getAnswerDuo();
      break;
  }
  this.timerService.countdown(0.1);
  }

  imageAnswer(idx: number) {
    if (this.arrayAnswer[idx].id == this.currentplaceinfo.rightanswer.id) {
      console.log("juste");
    }
  }

  getAnwser() {
      return this.rightAnswer;
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
    if(difference === 0)
    {
      this.timerService.stopCountdown();
      this.isGoodAnswer = true;
      this.canShowGoToAnswer = true;
      this.message = this.goodAnswer;
      this.canShowAnswer = false;
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
      this.canShowAnswer = false;
      this.message = this.badAnswer;
      return this.message;
    }
    this.timerService.stopCountdown();
    this.gameService.setLifes(this.gameService.getLifes()-1);
    this.canShowGoToAnswer = true;
    this.canShowAnswer = false;
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

  getAnswerCarre() {
    //@ts-ignore
    this.answer.answer1 = this.arrayAnswer[0]['site'];
    // @ts-ignore
    this.answer.answer2 = this.arrayAnswer[1]['site'];
    // @ts-ignore
    this.answer.answer3 = this.arrayAnswer[2]['site'];
    // @ts-ignore
    this.answer.answer4 = this.arrayAnswer[3]['site'];
  }

  getAnswerDuo()
  {
    let randomNumber = this.questionservice.getRandomNumber(0,1);
    if(randomNumber === 0) {
      this.answer.answer1 = this.rightAnswer;
      for (let i = 0; i < this.arrayAnswer.length; i++) {
        if (this.arrayAnswer[i]['site'] !== this.rightAnswer) {
          this.answer.answer2 = this.arrayAnswer[i]['site'];
          return 0;
        }
      }
    }
    else {
      this.answer.answer2 = this.rightAnswer;
      for (let i = 0; i< this.arrayAnswer.length; i++)
      {
        if(this.arrayAnswer[i]['site'] !== this.rightAnswer)
        {
          this.answer.answer1 = this.arrayAnswer[i]['site'];
          return 0;
        }
      }
    }
  }

  checkSelectedAnswer(answer: string)
  {
    console.log(answer);
    console.log(this.getAnwser());
    if(this.getAnwser() === answer)
    {
      this.timerService.stopCountdown();
      this.isGoodAnswer = true;
      this.canShowGoToAnswer = true;
      this.message = this.goodAnswer;
    }
    else {
      this.timerService.stopCountdown();
      this.gameService.setLifes(this.gameService.getLifes()-1);
      this.canShowGoToAnswer = true;
      this.message = this.badAnswer;
    }
    this.canShowAnswer = false;
  }
}


