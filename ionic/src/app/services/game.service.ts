import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private point = 0;

  constructor() { }

  addPoint(point: number) {
    this.point = this.point + point;
  }

  getPoint() {
    return this.point;
  }

}
