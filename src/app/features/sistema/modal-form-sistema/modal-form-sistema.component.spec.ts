import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormSistemaComponent } from './modal-form-sistema.component';

describe('ModalFormSistemaComponent', () => {
  let component: ModalFormSistemaComponent;
  let fixture: ComponentFixture<ModalFormSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormSistemaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
