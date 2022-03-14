import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterShopComponent } from './footer-shop.component';

describe('FooterShopComponent', () => {
  let component: FooterShopComponent;
  let fixture: ComponentFixture<FooterShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
