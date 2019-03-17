import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() favorite: any[];
  @Output() changefavorite = new EventEmitter<any>();

  /**
   * Title component
   */
  public title = 'Your favorite Insurances';

  /**
   * favorite list
   */
  public favoriteList = new Array();

  /**
   * Show delete all button
   */
  public showDeleteButton = false;

  constructor() { }

  ngOnInit() {
    console.log('modal component loaded');
    this.init();
  }

  /**
   * New favorite list
   * @param insurance
   */
  newFavList(insurance: any): void {
    console.log('rx2', insurance);
    this.changefavorite.emit(insurance);
  }

  /**
   * Delete All Insurances
   */
  deleteAll(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'You are going to eliminate all your favorites. Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.favoriteList = [];
        this.newFavList(this.favoriteList);
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
   * Init function
   */
  private init(): void {
    console.log('List of favorites:', this.favorite);
    this.favoriteList = this.favorite;
    this.newFavList(this.favorite);
  }

}
