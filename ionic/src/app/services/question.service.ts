import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { ApiInterfaceRecords } from "../Interfaces/apiInterfaceRecords";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private Region  = [
                      'Europe and North America',
                      'Asia and the Pacific',
                      'Latin America and the Caribean',
                      'Africa',
                      'Arab States'
                    ];
  private rows = 5;
  private startNumber : number;
  private search :string = '';
  private sentence = ["Dans quel pays se trouve cette image","Ou se trouve "+this.search,"Laquelle de ces 4 images est "+this.search];
  private recordsInterface : ApiInterfaceRecords[] = [];

  constructor(private api: ApiService) { }

  getRandomQuestion(){
    let randomNumberSentence = this.getRandomNumber(0,this.sentence.length);
    if(randomNumberSentence === 0)
    {
      return this.sentence[0];
    }
    this.getStartNumber();
    this.api.setRows(this.rows);
    this.api.setStart(this.startNumber);
    this.api.getApi().subscribe(data =>{
      this.recordsInterface = data['records'];
      this.search = this.recordsInterface[this.startNumber]['states'];
    });

    return this.sentence[randomNumberSentence];
  }

  private getRandomRegion()
  {
    let randomRegion : string;
    let randomNumber = this.getRandomNumber(0,this.Region.length);
    randomRegion = this.Region[randomNumber];
    return randomRegion;
  }

  private getRandomNumber(min : number, max : number){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min+1) +min);
  }

  private getTotalHits()
  {
    let nHits : string = '';
    this.api.setRefine("Region",this.getRandomRegion());
    this.api.getApi().subscribe(data =>{
      nHits = data['nhits'];
    });
    return parseInt(nHits);
  }

  private getStartNumber()
  {
    let totalHits = this.getTotalHits();
    let difference : number;
    this.startNumber = this.getRandomNumber(0, totalHits);
    difference = totalHits - this.startNumber;

    while(difference < this.rows)
    {
      this.startNumber = this.getRandomNumber(0, totalHits);
      difference = totalHits - this.startNumber;
    }
  }
}
