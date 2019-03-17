import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public title = 'Insurance App';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('header component loaded');
  }

}
