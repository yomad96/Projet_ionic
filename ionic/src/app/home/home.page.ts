import { Component, OnInit } from '@angular/core';
import { ApiRecords } from "../Interfaces/api-records";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  jsonRecord : ApiRecords[] = [];
  constructor() {}

  ngOnInit()
  {
    console.log("Chargement du json");
  }
}
