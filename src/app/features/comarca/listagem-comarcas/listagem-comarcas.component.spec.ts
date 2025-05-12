import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemComarcasComponent } from './listagem-comarcas.component';

describe('ListagemComarcasComponent', () => {
  let component: ListagemComarcasComponent;
  let fixture: ComponentFixture<ListagemComarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemComarcasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemComarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
