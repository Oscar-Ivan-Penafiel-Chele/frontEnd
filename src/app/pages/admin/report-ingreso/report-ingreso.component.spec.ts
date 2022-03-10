import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIngresoComponent } from './report-ingreso.component';

describe('ReportIngresoComponent', () => {
  let component: ReportIngresoComponent;
  let fixture: ComponentFixture<ReportIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIngresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
