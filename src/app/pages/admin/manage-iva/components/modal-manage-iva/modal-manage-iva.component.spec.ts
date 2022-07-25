import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalManageIvaComponent } from './modal-manage-iva.component';

describe('ModalManageIvaComponent', () => {
  let component: ModalManageIvaComponent;
  let fixture: ComponentFixture<ModalManageIvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalManageIvaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalManageIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
