import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormDespesaComponent } from './modal-form-despesa.component';

describe('ModalFormDespesaComponent', () => {
  let component: ModalFormDespesaComponent;
  let fixture: ComponentFixture<ModalFormDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormDespesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
