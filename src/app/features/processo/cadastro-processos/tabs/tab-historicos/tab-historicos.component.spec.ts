import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabHistoricosComponent } from './tab-historicos.component';

describe('TabHistoricosComponent', () => {
  let component: TabHistoricosComponent;
  let fixture: ComponentFixture<TabHistoricosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabHistoricosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabHistoricosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
