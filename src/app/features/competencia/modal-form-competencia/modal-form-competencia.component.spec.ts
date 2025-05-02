import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormCompetenciaComponent } from './modal-form-competencia.component';

describe('ModalFormCompetenciaComponent', () => {
  let component: ModalFormCompetenciaComponent;
  let fixture: ComponentFixture<ModalFormCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormCompetenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
