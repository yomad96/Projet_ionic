import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../services/api.service";
import {ApiInterfaceRecords} from "../Interfaces/apiInterfaceRecords";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {



  @Input() reponse: string;
  image: string;
  jsonRecord: ApiInterfaceRecords;

  constructor(private modalController: ModalController, private api: ApiService) { }

  ngOnInit() {
    // this.api.setSpecifique(this.reponse);
    this.api.setSpecifique("aaf23f0bbb475a944045913a7b202d50596af11e");
    this.api.getApi().subscribe(data => {
      this.jsonRecord = data.records;
      this.httpGetAsync(this.jsonRecord[0].fields.id_number);
    });
  }

  httpGetAsync(id : number) {
    this.api.getImage(id).subscribe( data => {
      const el = document.createElement( 'html' );
      el.innerHTML = data;
      const imgs = el.getElementsByClassName('icaption-img');
      this.image = imgs[0].getAttribute('data-src');
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
