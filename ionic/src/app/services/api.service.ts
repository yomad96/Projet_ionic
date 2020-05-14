import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ApiService {


    private baseUrl: string = "https://data.opendatasoft.com/api/records/1.0/search/";

    // ID du jeu de données
    private dataSet: string = "?dataset=world-heritage-list%40public-us";

    // Code langue de 2 lettres
    private lang: string = "";

    // Nombre de lignes de résultat (10 par défaut)
    private rows: string = "";

    // Critère de tri
    private sort: string = "";

    // Refinements à prendre en compte (exemple : (categ)states=(search)France, bien mettre les deux)
    private refine: string = "";

    // Start
    private start: string = "";


    constructor(private http: HttpClient) {}

    getApi(): Observable<any> {
        return this.http.get(this.baseUrl+this.dataSet+this.lang+this.rows+this.start+this.refine);
    }

    setLang(lang: string) {
        this.lang = "&lang=" + lang;
    }

    setRows(row: number) {
        this.rows = "&rows=" + row;
    }

    setSort(sort: string) {
        this.rows = "&sort=" + sort;
    }

    setRefine(categ: string, search: string)
    {
      this.refine = "&refine."+categ+"="+search;
    }

    setStart(start : number)
    {
        this.start = "&start="+start;
    }

    getUrlApi()
    {
        return this.baseUrl+this.dataSet+this.lang+this.rows+this.start+this.refine;
    }
}
