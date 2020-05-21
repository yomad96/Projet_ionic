import { Injectable } from '@angular/core';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  count: any;
  private boolTimer: boolean = false;
  private temps: string;

  constructor(private gameService: GameService) { }

  setTime(time: number) {
    time = time%60;
    let countDownDate = new Date();
    if (countDownDate.getMinutes()+time > 60){
      countDownDate.setMinutes(countDownDate.getMinutes()+time);
    } else {
      countDownDate.setMinutes(countDownDate.getMinutes()-60+time);
      countDownDate.setHours(countDownDate.getHours()+1);
    }

    let now = new Date().getTime();
    let distance = countDownDate.getTime() - now;
    
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.temps = minutes + "m " + seconds + "s ";
  }

  countdown(time: number) {
    this.boolTimer = false;
    time = time%60;
    let countDownDate = new Date();
    if (countDownDate.getMinutes()+time > 60){
      countDownDate.setMinutes(countDownDate.getMinutes()+time);
    } else {
      countDownDate.setMinutes(countDownDate.getMinutes()-60+time);
      countDownDate.setHours(countDownDate.getHours()+1);
    }
    
    this.count = setInterval( () => {
      let now = new Date().getTime();
      let distance = countDownDate.getTime() - now + 10;
      
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.temps = minutes + "m " + seconds + "s ";
      
      if (distance < 0) {
        this.stopCountdown();
        this.temps = "Time exceeded !";
        this.gameService.setLifes(this.gameService.getLifes() - 1);
        this.boolTimer = true;
      }
    }, 1000);
  }

  stopCountdown() {
    clearInterval(this.count);
  }
  getTime(){
    return this.temps;
  }

  getTimerIsFinish()
  {
    return this.boolTimer;
  }

  setTimerIsFinish(bool: boolean)
  {
    return this.boolTimer = bool;
  }
}
