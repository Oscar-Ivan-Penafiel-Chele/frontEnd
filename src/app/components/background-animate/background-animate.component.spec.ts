import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundAnimateComponent } from './background-animate.component';

describe('BackgroundAnimateComponent', () => {
  let component: BackgroundAnimateComponent;
  let fixture: ComponentFixture<BackgroundAnimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundAnimateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundAnimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
