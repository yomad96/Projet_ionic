import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
import {ApiInterfaceRecords} from '../Interfaces/apiInterfaceRecords';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-resultat-question',
  templateUrl: './resultat-question.page.html',
  styleUrls: ['./resultat-question.page.scss'],
})
export class ResultatQuestionPage implements OnInit {

  description: string;
  url: string;
  location: string;
  pays: string;
  jsonRecord: ApiInterfaceRecords;
  receive = false;
  data: any;
  image: string


  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }



  httpGetAsync() {
    this.api.getImage().subscribe( data => {
      console.log('je suis nul' + data);



    });
  }

  ngOnInit() {
    this.httpGetAsync();
    this.api.setSpecifique(this.data);
    this.api.getApi().subscribe(data => {
      this.jsonRecord = data.records;
      console.log(this.jsonRecord[0]);
      console.log(this.jsonRecord[0].fields);
      this.description = this.jsonRecord[0].fields.short_description;
      this.url = this.jsonRecord[0].fields.http_url;
      this.location = this.jsonRecord[0].fields.site;
      this.pays = this.jsonRecord[0].fields.states;
      this.image = this.jsonRecord[0].fields.image_url.filename;

      this.receive = true;

    });
  }

}
