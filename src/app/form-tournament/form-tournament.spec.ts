import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTournament } from './form-tournament';

describe('FormTournament', () => {
  let component: FormTournament;
  let fixture: ComponentFixture<FormTournament>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTournament]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTournament);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
