import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemSistemasComponent } from './listagem-sistemas.component';

describe('ListagemSistemasComponent', () => {
  let component: ListagemSistemasComponent;
  let fixture: ComponentFixture<ListagemSistemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemSistemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemSistemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
