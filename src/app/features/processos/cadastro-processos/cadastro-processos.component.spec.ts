import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroProcessosComponent } from './cadastro-processos.component';

describe('CadastroProcessosComponent', () => {
  let component: CadastroProcessosComponent;
  let fixture: ComponentFixture<CadastroProcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroProcessosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroProcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
