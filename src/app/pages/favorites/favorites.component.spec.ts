import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { favoritesComponent } from './favorites.component';

describe('favoritesComponent', () => {
  let component: favoritesComponent;
  let fixture: ComponentFixture<favoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ favoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(favoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
