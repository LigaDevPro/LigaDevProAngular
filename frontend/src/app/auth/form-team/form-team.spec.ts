import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTeam } from './form-team';

describe('FormTeam', () => {
  let component: FormTeam;
  let fixture: ComponentFixture<FormTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
