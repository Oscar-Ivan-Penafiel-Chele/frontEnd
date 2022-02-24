import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooteruserComponent } from './footeruser.component';

describe('FooteruserComponent', () => {
  let component: FooteruserComponent;
  let fixture: ComponentFixture<FooteruserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooteruserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooteruserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
