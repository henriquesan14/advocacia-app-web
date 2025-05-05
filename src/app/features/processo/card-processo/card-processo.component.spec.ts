import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProcessoComponent } from './card-processo.component';

describe('CardProcessoComponent', () => {
  let component: CardProcessoComponent;
  let fixture: ComponentFixture<CardProcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
