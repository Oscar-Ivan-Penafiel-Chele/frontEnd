import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEgresoComponent } from './report-egreso.component';

describe('ReportEgresoComponent', () => {
  let component: ReportEgresoComponent;
  let fixture: ComponentFixture<ReportEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportEgresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
