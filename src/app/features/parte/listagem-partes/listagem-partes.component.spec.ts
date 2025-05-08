import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemPartesComponent } from './listagem-partes.component';

describe('ListagemPartesComponent', () => {
  let component: ListagemPartesComponent;
  let fixture: ComponentFixture<ListagemPartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemPartesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemPartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
