import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemEventosComponent } from './listagem-eventos.component';

describe('ListagemEventosComponent', () => {
  let component: ListagemEventosComponent;
  let fixture: ComponentFixture<ListagemEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
