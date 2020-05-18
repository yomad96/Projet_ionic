import { Component, OnInit } from '@angular/core';
import { ApiInterfaceRecords } from "../Interfaces/apiInterfaceRecords";
import { ApiService } from "../services/api.service";
import { QuestionService } from "../services/question.service";
import {GameService} from "../services/game.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  jsonRecord : ApiInterfaceRecords[] = [];
  constructor(private api : ApiService, private question: QuestionService,private gameService : GameService, private router: Router) {}

  ngOnInit()
  {

  }

  quizz() {
    this.gameService.randomQuestion();
  }

  scores() {
    this.router.navigate(['/scores']);
  }
}
