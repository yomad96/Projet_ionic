import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../services/localstorage.service';

declare function require(name: string);

@Component({
  selector: 'app-scores',
  templateUrl: './scores.page.html',
  styleUrls: ['./scores.page.scss'],
})
export class ScoresPage implements OnInit {
  public scores: string[];

  constructor(private localstorageService: LocalstorageService) {
  }

  ngOnInit() {
  }
}
