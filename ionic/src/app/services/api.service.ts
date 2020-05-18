import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService {


    private baseUrl = 'https://data.opendatasoft.com/api/records/1.0/search/';

    // ID du jeu de données
    private dataSet = '?dataset=world-heritage-list%40public-us';

    // Code langue de 2 lettres
    private lang = '';

    // Nombre de lignes de résultat (10 par défaut)
    private rows = '';

    // Critère de tri
    private sort = '';

    // Refinements à prendre en compte (exemple : (categ)states=(search)France, bien mettre les deux)
    private refine = '';

    private recordid = '';

    // Start
    private start: string = "";


    constructor(private http: HttpClient) {}

    getApi(): Observable<any> {
        //return this.http.get(this.baseUrl + this.dataSet + this.rows +"&apikey=de2038a4a0bf2045be261bd1e126211159c87bfdf4091daa4ceb8960");
        return this.http.get(this.baseUrl + this.dataSet + this.recordid + this.lang + this.rows + this.start+this.refine+"&apikey=de2038a4a0bf2045be261bd1e126211159c87bfdf4091daa4ceb8960");
    }

    setLang(lang: string) {
        this.lang = '&lang=' + lang;
    }

    setRows(row: number) {
        this.rows = '&rows=' + row;
    }

    setSort(sort: string) {
        this.rows = '&sort=' + sort;
    }

    setRefine(categ: string, search: string) {
      this.refine = '&refine.' + categ + '=' + search;
    }

    setSpecifique(id: string) {
        this.recordid = '&refine.recordid=' + id;
    }

    getImage(id : number): Observable<any> {
        return this.http.get(' https://cors-anywhere.herokuapp.com/whc.unesco.org/en/list/' + id + '/gallery/&maxrows=20', { responseType: 'text' });
    }

    setStart(start : number)
    {
        this.start = "&start="+start;
    }

    getspecfiqueApi(): Observable<any> {
        return this.http.get(this.baseUrl + this.dataSet + this.recordid + "&apikey=de2038a4a0bf2045be261bd1e126211159c87bfdf4091daa4ceb8960");
    }
    getUrlApi()
    {
        return this.baseUrl + this.dataSet + this.recordid + this.lang + this.rows + this.start+this.refine+"&apikey=de2038a4a0bf2045be261bd1e126211159c87bfdf4091daa4ceb8960";
    }
}
