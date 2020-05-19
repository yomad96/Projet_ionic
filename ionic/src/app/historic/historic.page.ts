import { Component, OnInit } from '@angular/core';
import {GameService} from "../services/game.service";
import {Score} from "../Interfaces/score";

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {
  reversedList : Score[] = [];
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getHistorique().then( value => {
      if (value != null) {
        this.reversedList = value.slice().reverse();
      }
    });
  }

}
