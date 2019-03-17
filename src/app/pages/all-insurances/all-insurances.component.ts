import { isDevMode } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { debounceTime, map, takeUntil, catchError, finalize, delay, share, tap } from 'rxjs/operators';

// services
import { InsurancesService } from '../../services/insurances.service';

@Component({
  selector: 'app-all-insurances',
  templateUrl: './all-insurances.component.html',
  styleUrls: ['./all-insurances.component.scss']
})
export class AllInsurancesComponent implements OnInit {

  /**
   * App Title
   */
  public title = 'insuranceApp';

  /**
   * DevMode or ProdMode
   */
  public isDevMode: boolean;

  /**
   * Array of insurances
   */
  public insurances: any[];
  // public insurances$: Observable<any>;

  /**
   * Item selected
   */
  public itemSelected: any;
  public model: any;

  /**
   * Show Go Button
   */
  public showGoButton = false;

  /**
   * Pagination
   */
  public page = 1;
  public maxSize = 5;
  public numResults = 10;
  public sort: string;
  public terms: string;
  public field: string;
  public totalPages: number;
  public numInsurances: number;
  public collectionSize: number;

  /**
   * Loading
   */
  public loading = false;

  /**
   * Unsubscription Observable
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Pipe Async
   */
  public observableInsurances$: Observable<any> = null;
  public insurances$: Observable<any> = null;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private insurancesService: InsurancesService
  ) { }

  ngOnInit(): void {
    console.log('all-insurances component loaded');
    this.ngxLoader.startLoader('loader-01');
    this.isDevMode = isDevMode();

    console.log('is Dev Mode?:', this.isDevMode);
    this.sort = 'brand';
    this.field = 'kind';

    this.getDataDevModeAsync();
    // this.isDevMode ? this.getDataDevModeAsync() : this.getDataProdModeAsync();
  }

  searchb = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    map(
      term => term === '' ? []
      : this.insurances.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20)
    )
  )

  formatter = (x: {name: string}) => x.name;

  goToDetailInsurance(): void {
    console.log('model:', this.model);
  }

  /**
   * Get data in dev mode without pipe async
   */
  getDataDevMode(): void {
    // this.insurances$ = this.insurancesService.getDataDev();
    this.insurancesService.getDataDev()
    .pipe(
      delay(2000),
      map(res => this.insurances = res),
      finalize(() => console.log('finalize')),
      catchError(err => {
        console.log('caught rethrown error, providing fallback value', err);
        return of([]);
      }),
      takeUntil(this.unsubscribe$),
    )
    .subscribe(
      res => console.log('HTTP response', res),
      err => console.log('HTTP error', err),
      () => console.log('HTTP request completed.')
    );
  }

  /**
   * Get data in dev mode with pipe async
   */
  private getDataDevModeAsync() {
    this.observableInsurances$ = this.insurancesService.getDataDev()
    .pipe(share());

    this.insurances$ = this.observableInsurances$
    .pipe(
      finalize(() => this.ngxLoader.stopLoader('loader-01')),
      tap(d => console.log('d:', d)),
      map((data) => this.insurances = data),
      catchError(err => {
        console.log('caught rethrown error, providing fallback value', err);
        return of([]);
      })
    );
  }

  /**
   * Get data in prod mode without pipe async
   */
  getDataProdMode(): void {
    // this.insurances$ = this.insurancesService.getDataProd();
    this.insurancesService.getDataProd()
    .pipe(
      map(res => this.insurances = res),
      finalize(() => console.log('finalize')),
      catchError(err => {
        console.log('caught rethrown error, providing fallback value', err);
        return of([]);
      }),
      takeUntil(this.unsubscribe$),
    )
    .subscribe(
      res => console.log('HTTP response', res),
      err => console.log('HTTP error', err),
      () => console.log('HTTP request completed.')
    );
  }

  /**
   * Get data in prod mode with pipe async
   */
  getDataProdModeAsync(): void {
    this.observableInsurances$ = this.insurancesService.getDataProd()
      .pipe(share());

    this.insurances$ = this.observableInsurances$
      .pipe(
        tap(d => console.log('d:', d)),
        map((data) => this.insurances = data)
      );
  }

  /**
   * Is not necesary unsubscribe to observable with pipe async
   */
  // ngOnDestroy(): void {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   console.log('unsubcribe');
  // }

}

