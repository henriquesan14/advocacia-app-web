import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcessoArquivadoComponent } from './modal-processo-arquivado.component';

describe('ModalProcessoArquivadoComponent', () => {
  let component: ModalProcessoArquivadoComponent;
  let fixture: ComponentFixture<ModalProcessoArquivadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProcessoArquivadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalProcessoArquivadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
