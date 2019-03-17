import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  public title = 'Comments';

  constructor() { }

  ngOnInit() {
    console.log('comments component loaded');
  }

}
