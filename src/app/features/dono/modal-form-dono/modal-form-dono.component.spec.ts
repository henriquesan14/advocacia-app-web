import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormDonoComponent } from './modal-form-dono.component';

describe('ModalFormDonoComponent', () => {
  let component: ModalFormDonoComponent;
  let fixture: ComponentFixture<ModalFormDonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormDonoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFormDonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
