import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorPedidosComponent } from './vendedor-pedidos.component';

describe('VendedorPedidosComponent', () => {
  let component: VendedorPedidosComponent;
  let fixture: ComponentFixture<VendedorPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendedorPedidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedorPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
