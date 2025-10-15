import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsuario } from './dashboard-usuario';

describe('DashboardUsuario', () => {
  let component: DashboardUsuario;
  let fixture: ComponentFixture<DashboardUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
