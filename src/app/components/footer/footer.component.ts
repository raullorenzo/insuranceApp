import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public footer = 'Insurance App';
  public year: any;

  constructor() { }

  ngOnInit() {
    console.log('footer component loaded');
    this.year = new Date().getFullYear();
  }

}
