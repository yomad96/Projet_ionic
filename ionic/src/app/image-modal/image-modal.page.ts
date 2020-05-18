import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @Input() url: string;
  imagurl : string
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.imagurl = "https://whc.unesco.org" + this.url;
    console.log(this.imagurl);
    console.log(this.url);
  }


  async closeModal() {
    await this.modalController.dismiss();
  }
}
