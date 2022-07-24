import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAboutContactComponent } from './nav-about-contact.component';

describe('NavAboutContactComponent', () => {
  let component: NavAboutContactComponent;
  let fixture: ComponentFixture<NavAboutContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavAboutContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavAboutContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
