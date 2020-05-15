import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {ApiInterfaceRecords} from '../Interfaces/apiInterfaceRecords';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../services/game.service";
import {ApiInterfaceFields} from "../Interfaces/api-interface-fields";
import {ModalPage} from "../modal/modal.page";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-resultat-question',
  templateUrl: './resultat-question.page.html',
  styleUrls: ['./resultat-question.page.scss'],
})
export class ResultatQuestionPage implements OnInit {


  data: any;
  goodbad: any;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private gameService: GameService, private modal: ModalController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.id;
        this.goodbad = this.router.getCurrentNavigation().extras.state.resp;
      }
    });
  }

  async openModal() {
    const mymodal = await this.modal.create({
      component : ModalPage,
      componentProps: {
        'reponse': this.data
      }
    });
    return await mymodal.present();
  }

  ngOnInit() {
  }
  ionViewDidEnter(){
    if (this.gameService.getLifes() <= 0) {
      this.router.navigate(['/result']);
    }
  }
  suivant() {
    this.gameService.randomQuestion();
  }
}
