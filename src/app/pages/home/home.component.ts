import { isDevMode } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  Observable,
  of,
  Subject,
  throwError
} from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FilterPipe } from 'ngx-filter-pipe';
import {
  debounceTime,
  map,
  takeUntil,
  catchError,
  finalize,
  delay,
  share,
  tap,
  mergeMap
} from 'rxjs/operators';

// services
import { InsurancesService } from '../../services/insurances.service';

// external libraries
import Swal from 'sweetalert2';


// Interfaces
interface PolicyOptions {
  kind: string;
  img: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**
   * Literal search placeholder
   */
  public typeFilter = 'Search ';

  /**
   * Array of policy kinds
   */
  public policies = new Array();
  public types = new Array();
  public orderType: any;

  /**
   * favorite insurance list
   */
  public favoriteList = new Array();

  /**
   * App Title
   */
  public title = 'insuranceApp';

  public filterStatus = true;
  public textFilterButton = 'show';

  /**
   * DevMode or ProdMode
   */
  public isDevMode: boolean;

  /**
   * Array of insurances
   */
  public insurances: any[];

  /**
   * Item selected
   */
  public itemSelected: any;

  /**
   * Number of items/page
   */
  public ItemsPage: number;

  /**
   * Show Go Button
   */
  public showGoButton = false;

  /**
   * Ascendent/Descendent
   */
  public ascDesc: string;

  /**
   * counters
   */
  public countVida = 0;
  public countCoche = 0;
  public countHogar = 0;
  public countViaje = 0;
  public countSecurity = 0;
  public countSalud = 0;
  public countTrabajo = 0;


  /**
   * Pagination and search
   */
  public page = 1;
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
   * Pipe Async Observables
   */
  public observableInsurances$: Observable<any> = null;
  public insurances$: Observable<any[]> = null;

  /**
   * Filter
   */
  public filter: any = {};

  constructor(
    private filterPipe: FilterPipe,
    private ngxLoader: NgxUiLoaderService,
    private insurancesService: InsurancesService
  ) {
    // console.log('FILTER:', filterPipe.transform(this.insurances, { name: 'm'}));
  }

  ngOnInit(): void {
    console.log('all-insurances component loaded');
    this.init();
  }

  counterItems(): void {
    this.insurances.map((x) => {
      if (x.kind === 'Cybersecurity') {
        this.countSecurity++;
      } else if (x.kind === 'Salud') {
        this.countSalud++;
      } else if (x.kind === 'Hogar') {
        this.countHogar++;
      } else if (x.kind === 'Vida') {
        this.countVida++;
      } else if (x.kind === 'Trabajo') {
        this.countTrabajo++;
      } else if (x.kind === 'Coche') {
        this.countCoche++;
      } else {
        this.countViaje++;
      }
    });
}

  /**
   * Get favorite list from modal component
   * @param event
   */
  newFavList(event: any) {
    console.log('rx1', event);
    this.favoriteList = event;
  }

  /**
   * Search all parameters
   */
  searchAll = (text$: Observable<string>) => text$
    .pipe(
      debounceTime(200),
      map(
        term => term === '' ? [] : this.insurances.filter((v) => {
          return v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.brand.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.kind.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.price.toLowerCase().indexOf(term.toLowerCase()) > -1 ;
        }).slice(0, 10)
      )
  )

  /**
   * Search by param
   */
  searchSelected = (text$: Observable<string>) => text$
    .pipe(
      debounceTime(200),
      map(
        term => term === '' ? [] : this.insurances.filter((v) => {
          let res: boolean;
          const name = v.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
          const brand = v.brand.toLowerCase().indexOf(term.toLowerCase()) > -1;
          const kind = v.kind.toLowerCase().indexOf(term.toLowerCase()) > -1;
          const price = v.price.toLowerCase().indexOf(term.toLowerCase()) > -1;

          if (this.field === 'name') {
            res = name;
          } else if (this.field === 'brand') {
            res = brand;
          } else if (this.field === 'kind') {
            res = kind;
          } else {
            res = price;
          }

          return res;
        }).slice(0, 10)
      )
  )

  formatterName = (x: {name: string}) => x.name;

  formatterBrand = (x: {brand: string}) => x.brand;

  formatterKind = (x: {kind: string}) => x.kind;

  formatterPrice = (x: {price: string}) => x.price;

  /**
   * Handle event input
   * @param e
   */
  onKey(e: any): void {
    console.log('event', e);

    if (e.key !== 'Enter') {
      if (this.field === 'name') {
        this.filter.name = this.terms;
      } else if (this.field === 'brand') {
        this.filter.brand = this.terms;
      } else if (this.field === 'kind') {
        this.filter.kind = this.terms;
      } else {
        this.filter.price = this.terms;
      }
    }

    console.log('FILTER:', this.filter);
  }

  /**
   * Handle event on blur
   * @param terms
   */
  onBlur(terms: any): void {
    console.log('onBlur', terms);
    if (this.field === 'name') {
      this.filter.name = terms.name || this.terms;
    } else if (this.field === 'brand') {
      this.filter.brand = terms.brand || this.terms;
    } else if (this.field === 'kind') {
      this.filter.kind = terms.kind || this.terms;
    } else {
      this.filter.price = terms.price || this.terms;
    }

    console.log('FILTER:', this.filter);
  }

  onFocus(terms: string): void {
    console.log('onFocus', terms);
  }

  /**
   * Clear input text
   */
  clearText(): void {
    // this.terms = '';
  }

  /**
   * Show/Hide text
   */
  showHideFilters(): void {
    this.filterStatus = !this.filterStatus;
    this.filterStatus ?
    this.textFilterButton = 'hide' :
    this.textFilterButton = 'show';
  }

  /**
   * Order asc/desc
   * @param o
   */
  orderByType(o: string): void {
    this.orderType = o;
    console.log('orderBy', this.orderType);
    this.ascDesc === 'ASCENDENT' ? this.ascOrder(this.orderType) : this.descOrder(this.orderType);
  }

  /**
   * Asc order
   */
  ascOrder(o: string): void {
    console.log('ascOrder', o);
    if (o === 'brand') {
      this.insurances.sort((a, b) =>  a.brand.localeCompare(b.brand));
    } else if (o === 'kind') {
      this.insurances.sort((a, b) =>  a.kind.localeCompare(b.kind));
    } else if (o === 'name') {
      this.insurances.sort((a, b) =>  a.name.localeCompare(b.name));
    } else {
      this.insurances.sort((a, b) => a.price - b.price);
    }
    console.log(`asc by ${o}`, this.insurances);
  }

  /**
   * Desc order
   * @param o
   */
  descOrder(o: string): void {
    console.log('descOrder', o);
    if (o === 'brand') {
      this.insurances.sort((a, b) =>  b.brand.localeCompare(a.brand));
    } else if (o === 'kind') {
      this.insurances.sort((a, b) =>  b.kind.localeCompare(a.kind));
    } else if (o === 'name') {
      this.insurances.sort((a, b) =>  b.name.localeCompare(a.name));
    } else {
      this.insurances.sort((a, b) => b.price - a.price);
    }
    console.log(`desc by ${o}`, this.insurances);
  }

  /**
   * Select order list
   * @param o
   */
  selectOrder(o: string): void {
    console.log('selectOrder', o);
    this.ascDesc = o;

    this.orderByType(this.orderType);
  }

  /**
   * Select search parameter
   * @param term
   */
  selectSearch(term: string): void {
    this.filter = {};
    console.log('searchFiel:', this.field);
    this.field = term;
  }

  /**
   * Add insurance to favorite list
   * @param insurance
   */
  addFav(insurance: any): void {
    // this.insurances.shift();
    try {
      this.favoriteList.push(insurance);
      console.log('add:', insurance);
      Swal.fire({
        type: 'success',
        title: 'Added to favorites!',
        showConfirmButton: false,
        timer: 800
      });
    } catch (e) {
      console.log('err:', e);
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    }
  }

  /**
   * Select number items per page
   * @param n
   */
  selectNumerItems(n: number): void {
    console.log('number:', n);
    this.ItemsPage = n;
  }

  /**
   * Is possible add to favorites?
   * @param insurance
   */
  isAddfavorite(insurance: any): boolean {
    return this.favoriteList.includes(insurance) ? false : true;
  }

  /**
   * Policy already have in favorites
   */
  already(): void {
    Swal.fire({
      type: 'info',
      title: 'Oops...',
      text: 'You already have this policy in your favorites!'
    });
  }

  /**
   * Handle Error
   * @param err
   */
  private handleError(err: any): Observable<any> {
    console.log('caught rethrown error, providing fallback value', err);
    return of([]);
  }

  /**
   * Get data in dev mode with pipe async
   */
  private getDataDevModeAsync(): void {
    this.observableInsurances$ = this.insurancesService.getDataDev()
      .pipe(share());

    this.insurances$ = this.observableInsurances$
      .pipe(
        finalize(() => this.finally()),
        tap(d => console.log('d:', d)),
        map((data) => this.insurances = data),
        mergeMap((res) => this.getPolicies(res)),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Finally Observable
   */
  private finally(): void {
    this.orderByType('brand');
    this.counterItems();
  }

  /**
   * Get all the different policy kinds unique value
   * @param res
   */
  private getPolicies(res: any): Observable<any> {
    const aux = [];
    this.favoriteList = [];

    res.forEach((e: any) => {
      if (aux.indexOf(e.kind) !== -1) {
      } else {
        aux.push(e.kind);
        this.policies.push(e);
      }
    });

    return of(res);
  }

  /**
   * Get data in prod mode with pipe async
   */
  private getDataProdModeAsync(): void {
    this.observableInsurances$ = this.insurancesService.getDataProd()
      .pipe(share());

    this.insurances$ = this.observableInsurances$
    .pipe(
      finalize(() => this.finally()),
      tap(d => console.log('d:', d)),
      map((data) => this.insurances = data),
      mergeMap((res) => this.getPolicies(res)),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Initial function
   */
  private init(): void {
    this.favoriteList = [];
    this.ngxLoader.startLoader('loader-01');
    this.isDevMode = isDevMode();

    console.log('is Dev Mode?:', this.isDevMode);
    this.field = 'name';
    this.ascDesc = 'ASCENDENT';
    this.orderType = 'brand';
    this.ItemsPage = 5;

    // this.isDevMode ? this.getDataDevModeAsync() : this.getDataProdModeAsync();
    this.getDataDevModeAsync();
  }

  /**
   * Old functions
   */

  /**
   * Get data in prod mode without pipe async
   */
  // private getDataProdMode(): void {

  //   // this.insurances$ = this.insurancesService.getDataProd();
  //   this.insurancesService.getDataProd()
  //     .pipe(
  //       map(res => this.insurances = res),
  //       finalize(() => console.log('finalize')),
  //       catchError(err => this.handleError(err)),
  //       takeUntil(this.unsubscribe$),
  //     )
  //     .subscribe(
  //       res => console.log('HTTP response', res),
  //       err => console.log('HTTP error', err),
  //       () => console.log('HTTP request completed.')
  //     );
  // }

  /**
   * Get data in dev mode without pipe async
   */
  // private getDataDevMode(): void {

  //   // this.insurances$ = this.insurancesService.getDataDev();
  //   this.insurancesService.getDataDev()
  //     .pipe(
  //       delay(2000),
  //       map(res => this.insurances = res),
  //       finalize(() => console.log('finalize')),
  //       catchError(err => this.handleError(err)),
  //       takeUntil(this.unsubscribe$),
  //     )
  //     .subscribe(
  //       res => console.log('HTTP response', res),
  //       err => console.log('HTTP error', err),
  //       () => console.log('HTTP request completed.')
  //     );
  // }

  /**
   * It's not necesary unsubscribe the observable with pipe async
   */
  // ngOnDestroy(): void {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   console.log('unsubcribe');
  // }

}
