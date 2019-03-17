import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

// external libraries
import Swal from 'sweetalert2';
// import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class favoritesComponent implements OnInit {
  @Input() favorite: any[];
  @Output() changefavorite = new EventEmitter<any>();

  /**
   * Ascendent/Descendent
   */
  public ascDesc: string;

  /**
   * Filters
   */
  public typeFilter = 'Search ';
  public field: string;
  public terms: string;
  public filter: any = {};
  public filterStatus = false;
  public textFilterButton = 'show';
  public types = new Array();
  public orderType: any;

  constructor() { }

  ngOnInit() {
    this.init();
  }

  /**
   * Search all parameters
   */
  searchAll = (text$: Observable<string>) => text$
    .pipe(
      debounceTime(200),
      map(
        term => term === '' ? [] : this.favorite.filter((v) => {
          return v.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.brand.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.kind.toLowerCase().indexOf(term.toLowerCase()) > -1;
        }).slice(0, 5)
      )
  )

  /**
   * Search by param
   */
  searchSelected = (text$: Observable<string>) => text$
    .pipe(
      debounceTime(200),
      map(
        term => term === '' ? [] : this.favorite.filter((v) => {
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
      } else {
        this.filter.kind = this.terms;
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
    }

    console.log('FILTER:', this.filter);
  }

  onFocus(terms: string): void {
    console.log('onFocus', terms);
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
   * Select order list
   * @param o
   */
  selectOrder(o: string): void {
    console.log('selectOrder', o);
    this.ascDesc = o;

    this.orderByType(this.orderType);
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
      this.favorite.sort((a, b) =>  a.brand.localeCompare(b.brand));
    } else if (o === 'kind') {
      this.favorite.sort((a, b) =>  a.kind.localeCompare(b.kind));
    } else {
      this.favorite.sort((a, b) =>  a.name.localeCompare(b.name));
    }

    console.log(`asc by ${o}`, this.favorite);
  }

  /**
   * Desc order
   * @param o
   */
  descOrder(o: string): void {
    console.log('descOrder', o);
    if (o === 'brand') {
      this.favorite.sort((a, b) =>  b.brand.localeCompare(a.brand));
    } else if (o === 'kind') {
      this.favorite.sort((a, b) =>  b.kind.localeCompare(a.kind));
    } else {
      this.favorite.sort((a, b) =>  b.name.localeCompare(a.name));
    }

    console.log(`desc by ${o}`, this.favorite);
  }

  /**
   * Delete favorite
   * @param insurance
   */
  deletefavorite(insurance: any): void {
    console.log('delete:', insurance);
    // this.favorite.filter((e) =>  e !== insurance);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.newFavList(insurance);
        Swal.fire({
          type: 'success',
          title: 'Deleted!',
          showConfirmButton: false,
          timer: 800
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          type: 'error',
          title: 'Cancelled!',
          showConfirmButton: false,
          timer: 800
        });
      }
    });
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
   * New favorite list
   * @param insurance
   */
  newFavList(insurance: any): void {
    this.favorite = this.favorite.filter((e) =>  e !== insurance);
    this.changefavorite.emit(this.favorite);
  }

  init(): void {
    console.log('favorites-component loaded');
    console.log('favorites', this.favorite);
    this.field = 'name';
    this.orderByType('brand');
    this.ascDesc = 'ASCENDENT';
  }

}
