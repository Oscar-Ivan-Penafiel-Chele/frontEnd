import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesErrorComponent } from './messages-error.component';

describe('MessagesErrorComponent', () => {
  let component: MessagesErrorComponent;
  let fixture: ComponentFixture<MessagesErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
