import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormGanhoComponent } from './modal-form-ganho.component';

describe('ModalFormGanhoComponent', () => {
  let component: ModalFormGanhoComponent;
  let fixture: ComponentFixture<ModalFormGanhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormGanhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormGanhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
