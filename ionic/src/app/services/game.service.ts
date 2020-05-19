import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Score} from "../Interfaces/score";
import { Storage } from '@ionic/storage';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private lifes: number;
  private point: number;

  constructor(private router: Router, private storage: Storage) {
    this.point = 0;
    this.lifes = 3;
  }

  randomQuestion() { this.router.navigate(['/questions']);/*
    if (Math.floor(Math.random()*3)+1 === 1) {
     
    } else {
      this.router.navigate(['/map']);
    }*/
  }

  resetPoint(point: number) {
    this.point = 0;
  }
  addPoint(point: number) {
    this.point = this.point + point;
  }

  getPoint(): number {
    return this.point;
  }

  setLifes(nblives: number) {
    this.lifes = nblives;
  }

  getLifes(): number {
    return this.lifes;
  }

  async setHistorique(point: number) {
    const prevhisto = await this.getHistorique();
    let histo: Score[];
    if (prevhisto !== undefined){
       histo = await this.getHistorique();
    } else {
      histo = [];
    }
    const currentDate = new Date();
    const nscore = point;
    let currentScore: Score;
    currentScore = {
      score: nscore,
      timestamp: currentDate
    };
    histo.push(currentScore);
    this.storage.set('historique', histo);
  }

  async getHistorique() {
    return await this.storage.get('historique');
  }

}
