import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {
private lifes: number = 2;
  private point = 0;

  constructor(private router: Router) { }

randomQuestion() {
    if (Math.floor(Math.random()*3)+1 === 1) {
      this.router.navigate(['/questions'])
  } else {
      this.router.navigate(['/map'])
  }
}

  addPoint(point: number) {
    this.point = this.point + point;
  }

  getPoint() {
    return this.point;
  }

}
