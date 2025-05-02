import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLimparComponent } from './btn-limpar.component';

describe('BtnLimparComponent', () => {
  let component: BtnLimparComponent;
  let fixture: ComponentFixture<BtnLimparComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLimparComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnLimparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
