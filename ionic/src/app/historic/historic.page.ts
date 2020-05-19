import { Component, OnInit } from '@angular/core';
import {GameService} from "../services/game.service";
import {Score} from "../Interfaces/score";

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {

  historique: Score[];
  reversedList : Score[];
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getHistorique().then( value => {
      this.historique = value;
      this.reversedList = this.historique.slice().reverse();
    });
  }

}
