import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormDiligenciaComponent } from './modal-form-diligencia.component';

describe('ModalFormDiligenciaComponent', () => {
  let component: ModalFormDiligenciaComponent;
  let fixture: ComponentFixture<ModalFormDiligenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormDiligenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormDiligenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
