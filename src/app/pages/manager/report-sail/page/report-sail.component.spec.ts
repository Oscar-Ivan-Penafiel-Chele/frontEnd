import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSailComponent } from './report-sail.component';

describe('ReportSailComponent', () => {
  let component: ReportSailComponent;
  let fixture: ComponentFixture<ReportSailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
