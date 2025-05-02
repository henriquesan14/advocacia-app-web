import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormComarcaComponent } from './modal-form-comarca.component';

describe('ModalFormComarcaComponent', () => {
  let component: ModalFormComarcaComponent;
  let fixture: ComponentFixture<ModalFormComarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormComarcaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormComarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
