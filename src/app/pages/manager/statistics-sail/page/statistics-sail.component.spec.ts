import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsSailComponent } from './statistics-sail.component';

describe('StatisticsSailComponent', () => {
  let component: StatisticsSailComponent;
  let fixture: ComponentFixture<StatisticsSailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsSailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsSailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
