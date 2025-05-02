import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnNovoComponent } from './btn-novo.component';

describe('BtnNovoComponent', () => {
  let component: BtnNovoComponent;
  let fixture: ComponentFixture<BtnNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BtnNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
