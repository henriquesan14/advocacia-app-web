import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconClienteComponent } from './icon-cliente.component';

describe('IconClienteComponent', () => {
  let component: IconClienteComponent;
  let fixture: ComponentFixture<IconClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
