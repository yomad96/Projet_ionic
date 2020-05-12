import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: Map;
  markPoint: marker;
  response: latLng;

  ionViewDidEnter() { this.leafletMap(); }

  constructor() { }

  ngOnInit() {
  }



  leafletMap() {
    this.map = new Map('mapId').setView([0,0], 2);

    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    this.map.on('click', e => {
      if (this.markPoint != null){
        this.map.removeLayer(this.markPoint);
        this.markPoint = null;
      }else{
        this.markPoint = marker([e.latlng.lat,e.latlng.lng]);
        this.markPoint.bindPopup('<p>Allo</p>');
        this.map.addLayer(this.markPoint);
        console.log(e.latlng);
      }
      this.response = e.latlng;
    });
  }

  ionViewWillLeave() {
    this.map.remove();
  }



}
