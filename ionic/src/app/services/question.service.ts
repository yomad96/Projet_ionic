import {Injectable, EventEmitter, Output} from '@angular/core';
import {ApiService} from "./api.service";
import {ApiInterfaceRecords} from "../Interfaces/apiInterfaceRecords";
import {ApiInterfaceFields} from "../Interfaces/api-interface-fields";
import {Observable, Subject} from "rxjs";
import {element} from "protractor";

export interface placeData {
    id: string;
    country: string;
    site: string;
    coords: string;
}

export interface currentQuestion {
    question: string;
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
        'Latin+America+and+the+Caribean',
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
    public dataQuestionObservable = new Subject<currentQuestion>();
    public open: EventEmitter<any> = new EventEmitter();
    
    
    constructor(private api: ApiService) {
        this.getRandomQuestion();
    }

     getRandomQuestion(){
        // if (randomNumberSentence === 0) {
        //     return this.sentence[0];
        // }
        this.getTotalHits().subscribe(data => {
            let nHits: string;
            nHits = data['nhits'];
            this.nHits = parseInt(nHits);
            this.getStartNumber();
            this.api.setStart(this.startNumber);
            this.getplaces();
        });
    }

    private isADiffirentCountry(countryname: string): boolean {
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
                    id: element.fields['id_number'],
                    country: element.fields['states'],
                    site: element.fields['site'],
                    coords: element.geometry['coordinates']
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
                    id: this.recordsInterface[i].recordid,
                    country: this.recordsInterface[i].fields['states'],
                    site: this.recordsInterface[i].fields['site'],
                    coords: this.recordsInterface[i].geometry['coordinates']
                }
                this.unicAnswer(data);
            }
        this.open.emit();
        });
    }

    public getQuestion() {
        let currentQuestion: currentQuestion;   
            if (this.answers.length == 4) {
            let answer = this.answers[this.getRandomNumber(0, 3)];
            currentQuestion = {
                question: ["(BipBoop) Dans quel pays se trouve cette image (BipBoop)", " (BipBoop) Ou se trouve " + answer.country + " (BipBoop)", "(BipBoop) Laquelle de ces 4 images est " + answer.country + " (BipBoop)"][this.getRandomNumber(0, 2)],
                rightanswer: answer,
                answers: this.answers,
            }
        }
        return currentQuestion;
    }

    //verifie si le pays n'est pas déjà sélectionner
    private unicAnswer(element: placeData) {
        if (this.isADiffirentCountry(element.country) && element.country != undefined) {
            this.answers.push(element);
        }
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