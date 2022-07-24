import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIvaComponent } from './manage-iva.component';

describe('ManageIvaComponent', () => {
  let component: ManageIvaComponent;
  let fixture: ComponentFixture<ManageIvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIvaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
