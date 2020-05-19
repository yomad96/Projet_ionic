import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {GameService} from '../services/game.service';
import {NavigationExtras, Router} from '@angular/router';
import {ApiService} from '../services/api.service';
import {ApiInterfaceRecords} from '../Interfaces/apiInterfaceRecords';
import {TimerService} from '../services/timer.service';
import {currentQuestion, QuestionService} from "../services/question.service";
import {ModalPage} from "../modal/modal.page";
import {ImageModalPage} from "../image-modal/image-modal.page";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: L.Map;
  // @ts-ignore
  markPoint: L.marker;
  // @ts-ignore
  polyline: L.polyline;
  reponse: boolean;
  validate = false;

  reponseLat: number;
  reponseLng: number;
  goodbad = false;

  question: currentQuestion;
  site: string;
  questionLat: string;
  questionLng: string;
  questionrecordid: string;
  questionImg: string;


  distance: number;
  point: number;
  pourcentage: number;
  jsonRecord: ApiInterfaceRecords;
  questionType: number;


  // tslint:disable-next-line:max-line-length
  constructor(private gameService: GameService, private router: Router, private api: ApiService, private timerService: TimerService, private questionService: QuestionService, private modal: ModalController) { }

  ngOnInit() {
    this.questionService.questionEventEmitter.subscribe(() => {
      this.question = this.questionService.getQuestion();
      this.site = this.question.rightanswer.site;
      this.questionLat = this.question.rightanswer.coords[1];
      this.questionLng = this.question.rightanswer.coords[0];

      console.log("Quest LAT "+ this.questionLat);
      console.log("Quest LNG "+ this.questionLng);

      this.questionrecordid = this.question.rightanswer.recordId;
      // tslint:disable-next-line:radix
      this.httpGetAsync(parseInt(this.question.rightanswer.id));

    });
  }

  ionViewDidEnter() {

    this.leafletMap();
    this.timerService.stopCountdown();

    this.questionType = Math.floor(Math.random()*2)+1;

    this.reponse = false;
    this.validate = false;
    this.reponseLat = null;
    this.reponseLng = null;
    this.site = null;
    this.question = null;
    this.goodbad = false;

    this.distance = null;
    this.point = null;
    this.pourcentage = null;
    this.questionService.getRandomQuestion();
  }

  httpGetAsync(id: number) {
    this.api.getImage(id).subscribe( data => {
      const el = document.createElement( 'html' );
      el.innerHTML = data;
      const imgs = el.getElementsByClassName('icaption-img');
      this.questionImg = imgs[0].getAttribute('data-src');
      this.timerService.setTime(2);
      this.timerService.countdown(2);
    });
  }


  leafletMap() {
    this.map = new L.Map('mapId').setView([0, 0], 3);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    this.map.on('click', e => {
      if (this.markPoint !== undefined) {
        this.map.removeLayer(this.markPoint);
        this.reponse = false;

      }
      // Add a marker to show where you clicked.
      // @ts-ignore
      this.markPoint = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.reponse = true;
      // @ts-ignore
      this.reponseLat = e.latlng.lat;
      // @ts-ignore
      this.reponseLng = e.latlng.lng;
      console.log("LAT "+this.reponseLat);
      console.log("LNG "+this.reponseLng);

    });

    const southWest = L.latLng(-89.98155760646617, -180), northEast = L.latLng(89.99346179538875, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    this.map.setMaxBounds(bounds);
    this.map.on('drag', () => {
      this.map.panInsideBounds(bounds, { animate: false });
    });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  repondre() {

    this.timerService.stopCountdown();

    this.map.tap.disable();
    const poly = [
      [this.questionLat, this.questionLng],
      [this.reponseLat, this.reponseLng]
    ];

    // @ts-ignore
    this.polyline = L.polyline(poly, {color: 'red'}).addTo(this.map);
    // zoom the map to the polyline
    this.map.fitBounds(this.polyline.getBounds());

    const R = 6371e3; // metres
    const lat1 = (this.reponseLat) * Math.PI / 180; // φ, λ in radians
    const lat2 = (parseFloat(this.questionLat)) * Math.PI / 180;
    const difflat = ((lat2) - (lat1)) * Math.PI / 180;
    const difflng = (parseFloat(this.questionLng) - (this.reponseLng)) * Math.PI / 180;


    const a = Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(difflng / 2) * Math.sin(difflng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    this.distance = (R * c) / 1000;

    this.point = Math.round(5000 - ( this.distance / 40000) * 5000);
    this.gameService.addPoint(this.point);
    if (this.point <= 4000) {
      this.gameService.setLifes(this.gameService.getLifes() - 1);
    } else {
      this.goodbad = true;
    }
    this.pourcentage = (this.point * 100 / 5000) / 100;
    this.validate = true;

  }

  suivant() {
    this.timerService.stopCountdown();
    const navigationExtras: NavigationExtras = {
      state: {
        id: this.questionrecordid,
        resp : this.goodbad
      }
    };
    this.router.navigate(['/resultat-question'], navigationExtras);
  }

  async openModal() {
    const mymodal = await this.modal.create({
      component : ImageModalPage,
      componentProps: {
        'url': this.questionImg
      }
    });
    return await mymodal.present();
  }
}
