import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsAdminComponent } from './indicators-admin.component';

describe('IndicatorsAdminComponent', () => {
  let component: IndicatorsAdminComponent;
  let fixture: ComponentFixture<IndicatorsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorsAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
