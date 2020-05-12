import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private point: number = 0;

  constructor() { }

  addPoint(point: number) {
    this.point = this.point = point;
  }
}
