import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoAdminComponent } from './promo-admin.component';

describe('PromoAdminComponent', () => {
  let component: PromoAdminComponent;
  let fixture: ComponentFixture<PromoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
