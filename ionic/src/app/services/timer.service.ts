import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor() { }

  countdown(time: number) {
    time = time%60;
    let countDownDate = new Date();
    if (countDownDate.getMinutes()+time > 60){
      countDownDate.setMinutes(countDownDate.getMinutes()+time);
    }
    else {
      countDownDate.setMinutes(countDownDate.getMinutes()-60+time);
      countDownDate.setHours(countDownDate.getHours()+1);
    }
    
    let x = setInterval(function () {

      let now = new Date().getTime();
      let distance = countDownDate.getTime() - now;
      
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";
      
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "EXPIRED";
        console.log("expired");
      }
    }, 1000);
  }
}
