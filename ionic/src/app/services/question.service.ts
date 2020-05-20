import {Injectable, EventEmitter, Output} from '@angular/core';
import {ApiService} from "./api.service";
import {ApiInterfaceRecords} from "../Interfaces/apiInterfaceRecords";
import {ApiInterfaceFields} from "../Interfaces/api-interface-fields";
import {Observable, Subject} from "rxjs";
import {element} from "protractor";


export interface placeData {
    id?: string;
    recordId?: string;
    country: string;
    site?: string;
    coords?: string;
}

export interface currentQuestion {
    rightanswer: placeData;
    answers: placeData[];
}


@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private Region = [
        'Europe+and+North+America',
        'Asia+and+the+Pacific',
        'Latin+America+and+the+Caribbean',
        'Africa',
        'Arab+States'
    ];
    private rows = 30;
    private startNumber: number = 0;
    private search : placeData[] = [];
    public answers : placeData[] = [];
    private unicPlace : string[] = [];
    private randomRegion: string = '';
    private nHits: number;
    public question : string = '';
    private recordsInterface: ApiInterfaceRecords[] = [];
    public questionEventEmitter: EventEmitter<any> = new EventEmitter();
    
    
    constructor(private api: ApiService) {
    }


     getRandomQuestion(){
        this.getTotalHits().subscribe(data => {
            let nHits: string;
            nHits = data['nhits'];
            this.nHits = parseInt(nHits);
            this.getStartNumber();
            this.api.setStart(this.startNumber);
            this.getplaces();
        });
    }

    private isADifferentCountry(countryname: string): boolean {
        if (!this.unicPlace.includes(countryname)) {
            this.unicPlace.push(countryname);
            return true;
        } else {
            return false;
        }
    }

    private getplaces() {

        this.api.getApi().subscribe(data => {
            this.recordsInterface = data['records'];
            this.recordsInterface.forEach(element => {
                let data: placeData = {
                    country: element.fields['states']
                }
                if (data.country != undefined) {
                    this.search.push(data);
                }
                let countryname = [];

            try {
                this.search.forEach(element => {
                    if (data.country != undefined) {
                        countryname.push(element.country);
                    }
                });
            }
            catch(exception){}
            });
            for (let i = 0; i < this.recordsInterface.length && this.answers.length < 4; i++) {
                let data: placeData = {
                    id: this.recordsInterface[i].fields['id_number'],
                    recordId: this.recordsInterface[i].recordid,
                    country: this.recordsInterface[i].fields['states'],
                    site: this.recordsInterface[i].fields['site'],
                    coords: this.recordsInterface[i].geometry['coordinates']
                }
                this.unicAnswer(data);
            }
            this.questionEventEmitter.emit();
        });
    }

    public getQuestion() {
        let currentQuestion: currentQuestion;
            if (this.answers.length == 4) {
            let answer = this.answers[this.getRandomNumber(0, 3)];
            currentQuestion = {
                rightanswer: answer,
                answers: this.answers,
            }
        }
        return currentQuestion;
    }

    //verifie si le pays n'est pas déjà sélectionner
    private unicAnswer(element: placeData) {
        if (this.isADifferentCountry(element.country) && element.country != undefined) {
            this.answers.push(element);
        }
    }

    private getRandomRegion() {
        let randomNumber = this.getRandomNumber(0, this.Region.length-1);
        this.randomRegion = this.Region[randomNumber];
    }

    public getRandomNumber(min: number, max: number) {
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
        let totalHits = this.nHits-30;
        this.startNumber = this.getRandomNumber(0, totalHits);
    }
}
