import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemGruposComponent } from './listagem-grupos.component';

describe('ListagemGruposComponent', () => {
  let component: ListagemGruposComponent;
  let fixture: ComponentFixture<ListagemGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemGruposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
