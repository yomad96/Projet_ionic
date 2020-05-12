import { Component, OnInit } from '@angular/core';
// import { ApiInterfaceRecords } from "../Interfaces/apiInterfaceRecords";
// import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  // jsonRecord : ApiInterfaceRecords[] = [];
  constructor(/**private api : ApiService*/) {}

  ngOnInit()
  {
    // console.log("Chargement du json");
    // this.api.setRefine("states","France");
    // this.api.getApi().subscribe(data => {
    //   this.jsonRecord = data['records'];
    //   console.log(this.jsonRecord);
    //   console.log(this.jsonRecord[0].fields);
    // });
  }
}
