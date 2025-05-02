import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnPesquisarComponent } from './btn-pesquisar.component';

describe('BtnPesquisarComponent', () => {
  let component: BtnPesquisarComponent;
  let fixture: ComponentFixture<BtnPesquisarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnPesquisarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnPesquisarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
