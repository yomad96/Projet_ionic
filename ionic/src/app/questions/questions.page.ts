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
  // goodAnswer = "Well done, you found the right answer !";
  // badAnswer = "Wrong answer !";
  almostGoodAnswer = "You have almost the right answer";
  tooManyAttempts = "Too bad, you have passed your attempts number !";
  message: string;
  canShowGoToAnswer : boolean = false;
  isGoodAnswer : boolean = false;
  arrayAnswer : placeData[] = [];
  rightAnswer: string;
  canShowAnswer: boolean =true;
  pictures: string[] = [];
  isLoading: boolean = true;
  answer: question = {
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
  };

  //Cache = 5000 points
  //Carré = 3000 points
  //Duo = 1000points


  constructor(
              private timerService: TimerService,
              private gameService: GameService, 
              private router: Router, 
              private questionservice: QuestionService,
              private apiService: ApiService) {}

  ngOnInit() {
    this.timerService.setTime(5);
  }

  ionViewDidEnter()
  {
    console.log("DidEnter");
    this.questionType = Math.floor(Math.random()*2)+1;
    this.answerType = 0;
    this.cashForm = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
    this.questionservice.questionEventEmitter.subscribe(data => {
      console.log("EventEmitter");
      // @ts-ignore
      this.currentplaceinfo = this.questionservice.getQuestion();
      this.arrayAnswer = this.currentplaceinfo.answers;
      if (this.questionType == 1) {
        this.question = "(BipBoop) Where can you find "+ this.currentplaceinfo.rightanswer.site + " (BipBoop)";
      } else {
        this.question = "Which of theses 4 images corresponds to the site : " + this.currentplaceinfo.rightanswer.site;
      }
      this.rightAnswer = this.currentplaceinfo.rightanswer.country;
      for (let i: number = 0; i < this.currentplaceinfo.answers.length; i++) {
        this.apiService.getImage(parseInt(this.currentplaceinfo.answers[i].id)).subscribe( data => {
          const el = document.createElement( 'html' );
          el.innerHTML = data;
          const imgs = el.getElementsByClassName('icaption-img');
          this.pictures[i] = ("https://whc.unesco.org" + imgs[0].getAttribute('data-src'));
        });
      }
      this.timerService.countdown(0.1);
      this.isLoading = false;
    });
  }

  onChooseTypeAnswer(type: number) {
    this.answerType = type;
    this.questionType = 1;
    console.log(this.getAnwser());
  switch(type) {
    case 4:
      this.getAnswerCarre();
      break;
    case 2:
      this.getAnswerDuo();
      break;
  }
  }

  getAnwser() {
      return this.rightAnswer;
  }

  validate()
  {
    if(this.cashForm.valid)
    {
      let answer = this.getAnwser().toLowerCase();
      let answerOfPlayer = this.cashForm.value.answer;
      answerOfPlayer.toLowerCase();
      if(!this.canShowGoToAnswer)
      {
        this.answerVerification(answer,answerOfPlayer);
      }
    }
  }

  isrightPicture(idx: number)
  {
    if(this.currentplaceinfo.answers[idx].id == this.currentplaceinfo.rightanswer.id)
    {
      this.timerService.stopCountdown();
      this.isGoodAnswer = true;
      this.canShowAnswer = false;
      this.pathToResultPage();
    }
    else {
      this.timerService.stopCountdown();
      this.gameService.setLifes(this.gameService.getLifes()-1);
      this.canShowAnswer = false;
      this.pathToResultPage();
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
      this.canShowAnswer = false;
      this.gameService.addPoint(5000);
      console.log(this.gameService.getPoint());
      this.pathToResultPage();
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
    }
    this.timerService.stopCountdown();
    this.gameService.setLifes(this.gameService.getLifes()-1);
    this.canShowAnswer = false;
    this.message = this.tooManyAttempts;
    this.pathToResultPage();
  }

  array_diff(array1 : [], array2 : [])
  {
    let diffArray = 0;
    let letter :[''] = [''];
    if(array1.length >= array2.length)
    {
      for(let i = 0; i <= array1.length;i++)
      {
        if(array1[i] !== array2[i])
        {
          diffArray = diffArray+1;
          letter.push(array1[i]);
        }
      }
    }else{
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
        id: this.currentplaceinfo.rightanswer.recordId,
        resp: this.isGoodAnswer
      }
    };
    this.router.navigate(['/resultat-question'],navigationExtras)
  }

  getAnswerCarre() {
    //@ts-ignore
    this.answer.answer1 = this.arrayAnswer[0]['country'];
    // @ts-ignore
    this.answer.answer2 = this.arrayAnswer[1]['country'];
    // @ts-ignore
    this.answer.answer3 = this.arrayAnswer[2]['country'];
    // @ts-ignore
    this.answer.answer4 = this.arrayAnswer[3]['country'];
  }

  getAnswerDuo()
  {
    let randomNumber = this.questionservice.getRandomNumber(0,1);
    if(randomNumber === 0) {
      this.answer.answer1 = this.rightAnswer;
      for (let i = 0; i < this.arrayAnswer.length; i++) {
        if (this.arrayAnswer[i]['country'] !== this.rightAnswer) {
          this.answer.answer2 = this.arrayAnswer[i]['country'];
          return 0;
        }
      }
    }
    else {
      this.answer.answer2 = this.rightAnswer;
      for (let i = 0; i< this.arrayAnswer.length; i++)
      {
        if(this.arrayAnswer[i]['country'] !== this.rightAnswer)
        {
          this.answer.answer1 = this.arrayAnswer[i]['country'];
          return 0;
        }
      }
    }
  }

  checkSelectedAnswer(answer: string)
  {
    if(this.getAnwser() === answer)
    {
      if(this.answerType === 2)
      {
        this.gameService.addPoint(1000);
      }
      if(this.answerType === 4)
      {
        this.gameService.addPoint(3000);
      }
      this.timerService.stopCountdown();
      this.isGoodAnswer = true;
      this.canShowGoToAnswer = true;
    }
    else {
      this.timerService.stopCountdown();
      this.gameService.setLifes(this.gameService.getLifes()-1);
    }
    console.log(this.gameService.getPoint());
    this.canShowAnswer = false;
    this.pathToResultPage();
  }

  ionViewDidLeave()
  {
    console.log("DidLeave");
    // @ts-ignore
    this.question = "";
  }
}


