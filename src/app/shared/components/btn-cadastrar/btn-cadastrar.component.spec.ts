import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCadastrarComponent } from './btn-cadastrar.component';

describe('BtnCadastrarComponent', () => {
  let component: BtnCadastrarComponent;
  let fixture: ComponentFixture<BtnCadastrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnCadastrarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnCadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
