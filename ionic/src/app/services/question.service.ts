import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {ApiInterfaceRecords} from "../Interfaces/apiInterfaceRecords";
import {ApiInterfaceFields} from "../Interfaces/api-interface-fields";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private Region = [
        'Europe+and+North+America',
        'Asia+and+the+Pacific',
        'Latin+America+and+the+Caribean',
        'Africa',
        'Arab+States'
    ];
    private rows = 5;
    private startNumber: number = 0;
    private search: string = 'test';
    private randomRegion: string = '';
    private nHits: number;
    private boolean: boolean = false;
    private sentence = ["(BipBoop) Dans quel pays se trouve cette image (BipBoop)", " (BipBoop) Ou se trouve " + this.search + " (BipBoop)", "(BipBoop) Laquelle de ces 4 images est " + this.search + " (BipBoop)"];
    private recordsInterface: ApiInterfaceRecords[] = [];
    private fieldInterface: ApiInterfaceFields[] = [];

    constructor(private api: ApiService) {
    }

    getRandomQuestion() {
       // @ts-ignore
        let randomNumberSentence = this.getRandomNumber(0, this.sentence.length);
        if (randomNumberSentence === 0) {
            return this.sentence[0];
        }
        this.getTotalHits().subscribe(data => {
            console.log(this.api.getUrlApi());
            let nHits: string;
            nHits = data['nhits'];
            console.log(nHits);
            this.nHits = parseInt(nHits);
            this.getStartNumber();
            this.api.setStart(this.startNumber);
            this.api.getApi().subscribe(data => {
                // this.recordsInterface = data['records'];
                // console.log(this.recordsInterface);
                // this.fieldInterface = this.recordsInterface[0].fields;
                // console.log(this.fieldInterface.states);
                return this.sentence[randomNumberSentence];
            });
        });
    }

    private getRandomRegion() {
        let randomNumber = this.getRandomNumber(0, this.Region.length-1);
        this.randomRegion = this.Region[randomNumber];
    }

    private getRandomNumber(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // @ts-ignore
    getTotalHits(): Observable<any> {
        this.getRandomRegion();
        this.api.setRows(this.rows);
        this.api.setRefine("region",this.randomRegion);
        return this.api.getApi();
    }

    getStartNumber() {
        let totalHits = this.nHits;
        this.startNumber = this.getRandomNumber(0, totalHits);
    }
}
