import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoryComponent } from './auditory.component';

describe('AuditoryComponent', () => {
  let component: AuditoryComponent;
  let fixture: ComponentFixture<AuditoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
