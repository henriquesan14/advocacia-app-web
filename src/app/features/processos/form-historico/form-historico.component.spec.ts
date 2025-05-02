import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHistoricoComponent } from './form-historico.component';

describe('FormHistoricoComponent', () => {
  let component: FormHistoricoComponent;
  let fixture: ComponentFixture<FormHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHistoricoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
