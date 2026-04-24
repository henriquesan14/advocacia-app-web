import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemSituacoesComponent } from './listagem-situacoes.component';

describe('ListagemCompetenciasComponent', () => {
  let component: ListagemSituacoesComponent;
  let fixture: ComponentFixture<ListagemSituacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemSituacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemSituacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
