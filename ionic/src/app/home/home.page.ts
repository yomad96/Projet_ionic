import { Component, OnInit } from '@angular/core';
import { ApiInterfaceRecords } from "../Interfaces/apiInterfaceRecords";
import { ApiService } from "../services/api.service";
import { QuestionService } from "../services/question.service";
import {GameService} from "../services/game.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  jsonRecord : ApiInterfaceRecords[] = [];
  constructor(private api : ApiService, private question: QuestionService,private gameService : GameService) {}

  ngOnInit()
  {
    // console.log("Chargement du json");
    this.question.getRandomQuestion();
  }
  quizz() {
    this.gameService.randomQuestion();
  }
}
