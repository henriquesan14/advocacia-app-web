import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemProcessosComponent } from './listagem-processos.component';

describe('ListagemProcessosComponent', () => {
  let component: ListagemProcessosComponent;
  let fixture: ComponentFixture<ListagemProcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemProcessosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListagemProcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
