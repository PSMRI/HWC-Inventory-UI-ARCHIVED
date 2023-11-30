import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EAushadhaComponent } from './e-aushadha.component';

describe('EAushadhaComponent', () => {
  let component: EAushadhaComponent;
  let fixture: ComponentFixture<EAushadhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EAushadhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EAushadhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
