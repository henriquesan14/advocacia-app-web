import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacoesProcessoComponent } from './movimentacoes-processo.component';

describe('MovimentacoesProcessoComponent', () => {
  let component: MovimentacoesProcessoComponent;
  let fixture: ComponentFixture<MovimentacoesProcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentacoesProcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentacoesProcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
