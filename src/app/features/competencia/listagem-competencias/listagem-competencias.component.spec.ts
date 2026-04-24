import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemCompetenciasComponent } from './listagem-competencias.component';

describe('ListagemCompetenciasComponent', () => {
  let component: ListagemCompetenciasComponent;
  let fixture: ComponentFixture<ListagemCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemCompetenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
