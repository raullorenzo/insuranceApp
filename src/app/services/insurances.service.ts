import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class InsurancesService {

  /**
   * JSON path
   */
  public url: string;

  /**
   * JSON data
   */
  public data: any[];

  constructor(
    private http: HttpClient
  ) {

    /**
     * When npm run build
     */
    this.url = GLOBAL.url;

    /**
     * When npm run build
     */
    this.data = GLOBAL.data;
  }

  /**
   * When npm run build use this method
   */
  getDataProd(): Observable<any> {

    return this.http.get(this.url, {responseType: 'json'});
  }

  /**
   * When npm start use this method
   */
  getDataDev(): Observable<any> {

    return of(this.data);
  }
}

