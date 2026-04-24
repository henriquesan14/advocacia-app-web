import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemDonosComponent } from './listagem-donos.component';

describe('ListagemDonosComponent', () => {
  let component: ListagemDonosComponent;
  let fixture: ComponentFixture<ListagemDonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemDonosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemDonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
