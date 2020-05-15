import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {GameService} from '../services/game.service';
import {NavigationExtras, Router} from '@angular/router';
import {ApiService} from '../services/api.service';
import {ApiInterfaceRecords} from '../Interfaces/apiInterfaceRecords';
import {TimerService} from '../services/timer.service';

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
  reponseImg: string;

  questionLat: number;
  questionLng: number;

  distance: number;
  point: number;
  pourcentage: number;
  jsonRecord: ApiInterfaceRecords;
  questionType: number;


  ionViewDidEnter() { this.leafletMap(); }

  constructor(private gameService: GameService, private router: Router, private api: ApiService, private timerService: TimerService) { }

  ngOnInit() {
    this.questionType = Math.floor(Math.random()*2)+1;
    this.timerService.countdown(5);
    // @ts-ignore
    this.api.setSpecifique();
    this.api.getApi().subscribe(data => {
      this.jsonRecord = data.records;
      console.log(this.jsonRecord[0].fields);
      this.questionLat = this.jsonRecord[0].fields.id_number
      this.questionLng = this.jsonRecord[0].fields.id_number
      this.httpGetAsync(this.jsonRecord[0].fields.id_number);
    });

  }

  httpGetAsync(id : number) {
    this.api.getImage(id).subscribe( data => {
      const el = document.createElement( 'html' );
      el.innerHTML = data;
      const imgs = el.getElementsByClassName('icaption-img');
      this.reponseImg = imgs[0].getAttribute('data-src');
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

    this.map.tap.disable();
    const poly = [
      [45.51, -122.68],
      [this.reponseLat, this.reponseLng]
    ];

    // @ts-ignore
    this.polyline = L.polyline(poly, {color: 'red'}).addTo(this.map);
    // zoom the map to the polyline
    this.map.fitBounds(this.polyline.getBounds());

    const R = 6371e3; // metres
    const lat1 = 45.51 * Math.PI / 180; // φ, λ in radians
    const lat2 = this.reponseLat * Math.PI / 180;
    const difflat = (lat2 - lat1) * Math.PI / 180;
    const difflng = (this.reponseLng - (-122.68)) * Math.PI / 180;


    const a = Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(difflng / 2) * Math.sin(difflng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    this.distance = (R * c) / 1000;

    this.point = Math.round(5000 - ( this.distance / 40000) * 5000);
    this.gameService.addPoint(this.point);
    this.pourcentage = (this.point * 100 / 5000) / 100;

    this.validate = true;

  }

  suivant() {
    const navigationExtras: NavigationExtras = {
      state: {
        id: '5f325ebe3795d4984a051ac541f7dc131986891e'
      }
    };
    this.router.navigate(['/resultat-question'], navigationExtras);
  }


}
