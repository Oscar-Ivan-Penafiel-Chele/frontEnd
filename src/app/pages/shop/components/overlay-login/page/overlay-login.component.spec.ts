import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayLoginComponent } from './overlay-login.component';

describe('OverlayLoginComponent', () => {
  let component: OverlayLoginComponent;
  let fixture: ComponentFixture<OverlayLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
