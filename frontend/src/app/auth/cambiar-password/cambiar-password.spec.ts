import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarPassword } from './cambiar-password';

describe('CambiarPassword', () => {
  let component: CambiarPassword;
  let fixture: ComponentFixture<CambiarPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
