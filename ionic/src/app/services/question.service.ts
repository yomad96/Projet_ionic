import {Injectable, EventEmitter, Output} from '@angular/core';
import {ApiService} from './api.service';
import {ApiInterfaceRecords} from '../Interfaces/apiInterfaceRecords';
import {ApiInterfaceFields} from '../Interfaces/api-interface-fields';
import {Observable, Subject} from 'rxjs';
import {element} from 'protractor';
import { GameService } from './game.service';


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
    private startNumber = 0;
    private search: placeData[] = [];
    public answers: placeData[] = [];
    private unicPlace: string[] = [];
    private randomRegion = '';
    private nHits: number;
    public question = '';
    private recordsInterface: ApiInterfaceRecords[] = [];
    public questionEventEmitter: EventEmitter<any> = new EventEmitter();
    public mapEventEmitter: EventEmitter<any> = new EventEmitter();


    constructor(private api: ApiService, private gameService: GameService) {
    }
     getRandomQuestion() {
        this.getTotalHits().subscribe(data => {
            let nHits: string;
            nHits = data.nhits;
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
            this.recordsInterface = data.records;
            this.recordsInterface.forEach(element => {
                const data: placeData = {
                    country: element.fields['states']
                };
                if (data.country != undefined) {
                    this.search.push(data);
                }
                const countryname = [];

                try {
                this.search.forEach(element => {
                    if (data.country != undefined) {
                        countryname.push(element.country);
                    }
                });
            } catch (exception) {}
            });
            for (let i = 0; i < this.recordsInterface.length && this.answers.length < 4; i++) {
                const data: placeData = {
                    id: this.recordsInterface[i].fields['id_number'],
                    recordId: this.recordsInterface[i].recordid,
                    country: this.recordsInterface[i].fields['states'],
                    site: this.recordsInterface[i].fields['site'],
                    coords: this.recordsInterface[i].geometry['coordinates']
                };
                this.unicAnswer(data);
            }
            if (this.gameService.gamestate === 1) {
                this.questionEventEmitter.emit();
            } else {
                this.mapEventEmitter.emit();
            }
        });
    }

    public getQuestion() {
        console.log("getQuestion");
        let currentQuestion: currentQuestion;
        if (this.answers.length === 4) {
            console.log("In");
            const answer = this.answers[this.getRandomNumber(0, 3)];
            currentQuestion = {
                rightanswer: answer,
                answers: this.answers,
            };
        }
        return currentQuestion;
    }

    public reset() {
        this.answers = [];
    }

    // verifie si le pays n'est pas déjà sélectionner
    private unicAnswer(element: placeData) {
        if (this.isADifferentCountry(element.country) && element.country !== undefined) {
            this.answers.push(element);
            console.log("push");
        }
    }

    private getRandomRegion() {
        const randomNumber = this.getRandomNumber(0, this.Region.length - 1);
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
        this.api.setRefine('region', this.randomRegion);
        return this.api.getApi();
    }

    getStartNumber() {
        const totalHits = this.nHits - 30;
        if ( totalHits > 0) {
            this.startNumber = this.getRandomNumber(0, totalHits);
        } else {
            this.startNumber = 0;
        }
    }
}
