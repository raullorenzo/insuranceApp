import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit {

  public title = 'Statement';

  constructor() { }

  ngOnInit() {
    console.log('statement component loaded');
  }

}
