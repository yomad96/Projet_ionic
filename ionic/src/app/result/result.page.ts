import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  constructor(private gameService: GameService, private router : Router) { }

  ngOnInit() {

  }

  restart() {
    this.gameService.setHistorique(this.gameService.getPoint())
    this.router.navigate(['/home']);
  }

}
