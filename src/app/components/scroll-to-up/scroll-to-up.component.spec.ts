import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollToUpComponent } from './scroll-to-up.component';

describe('ScrollToUpComponent', () => {
  let component: ScrollToUpComponent;
  let fixture: ComponentFixture<ScrollToUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollToUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollToUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
