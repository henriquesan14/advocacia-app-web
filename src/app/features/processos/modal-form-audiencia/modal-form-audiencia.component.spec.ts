import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormAudienciaComponent } from './modal-form-audiencia.component';

describe('ModalFormAudienciaComponent', () => {
  let component: ModalFormAudienciaComponent;
  let fixture: ComponentFixture<ModalFormAudienciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormAudienciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormAudienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
