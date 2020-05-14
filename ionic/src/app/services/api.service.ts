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


    constructor(private http: HttpClient) {}

    getApi(): Observable<any> {
        return this.http.get(this.baseUrl + this.dataSet + this.recordid + this.lang + this.rows + this.refine);
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

    getImage(): Observable<any> {
        return this.http.get('https://whc.unesco.org/en/list/1478/gallery/&maxrows=20', { responseType: 'text' });
    }
}
