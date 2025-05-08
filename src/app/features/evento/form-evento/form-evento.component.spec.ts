import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventoComponent } from './form-evento.component';

describe('FormEventoComponent', () => {
  let component: FormEventoComponent;
  let fixture: ComponentFixture<FormEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
