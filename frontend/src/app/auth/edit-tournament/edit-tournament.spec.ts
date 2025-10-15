import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTournament } from './edit-tournament';

describe('EditTournament', () => {
  let component: EditTournament;
  let fixture: ComponentFixture<EditTournament>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTournament]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTournament);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
