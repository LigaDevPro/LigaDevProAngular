import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatch } from './edit-match';

describe('EditMatch', () => {
  let component: EditMatch;
  let fixture: ComponentFixture<EditMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
