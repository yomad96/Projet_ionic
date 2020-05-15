import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setscore(score: number) {
    let currentdate = new Date();
    if (localStorage.getItem('scores') !== null) {
      localStorage.setItem('scores', localStorage.getItem('scores') + '|*|' + currentdate.getDay() + '/' + currentdate.getMonth() + '/' + currentdate.getFullYear() + ' ' + currentdate.getHours() + 'h' +currentdate.getMinutes() + '|#|' + score);
    } else {
      localStorage.setItem('scores', currentdate.getDay() + '/' + currentdate.getMonth() + '/' + currentdate.getFullYear() + ' ' + currentdate.getHours() + 'h' +currentdate.getMinutes() + '|#|' + score);
    }
  }

  getscores() {
    if (localStorage.getItem('scores') != null) {
      return localStorage.getItem('scores').split('|*|');
    } else {
      return [];
    }
  }
  
}
