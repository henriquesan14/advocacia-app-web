import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormSituacaoProcessoComponent } from './modal-form-situacao-processo.component';

describe('ModalFormSituacaoProcessoComponent', () => {
  let component: ModalFormSituacaoProcessoComponent;
  let fixture: ComponentFixture<ModalFormSituacaoProcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormSituacaoProcessoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormSituacaoProcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
