import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsPurchaseComponent } from './statistics-purchase.component';

describe('StatisticsPurchaseComponent', () => {
  let component: StatisticsPurchaseComponent;
  let fixture: ComponentFixture<StatisticsPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
