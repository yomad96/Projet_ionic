import { Component, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { LocalstorageService } from '../services/localstorage.service';

declare function require(name: string);

@Component({
  selector: 'app-scores',
  templateUrl: './scores.page.html',
  styleUrls: ['./scores.page.scss'],
})
export class ScoresPage implements OnInit {
  public scores: string[];

  constructor(private timerService: TimerService,
              private localstorageService: LocalstorageService) {
    timerService.countdown(5);
    //localstorageService.setscore(12000);
    //this.scores = localstorageService.getscores();
  }

  ngOnInit() {
    //startclock();
  }
  
  

}
