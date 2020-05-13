import { Component, OnInit } from '@angular/core';
// import { ApiInterfaceRecords } from "../Interfaces/apiInterfaceRecords";
// import { ApiService } from "../services/api.service";
import { QuestionService } from "../services/question.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  // jsonRecord : ApiInterfaceRecords[] = [];
  constructor(/**private api : ApiService*/private question: QuestionService) {}

  ngOnInit()
  {
    console.log("Chargement du json");
    console.log(this.question.getRandomQuestion());
  }
}
