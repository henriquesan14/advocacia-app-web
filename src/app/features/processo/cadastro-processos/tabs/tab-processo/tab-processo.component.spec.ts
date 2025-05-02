import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabProcessoComponent } from './tab-processo.component';

describe('TabProcessoComponent', () => {
  let component: TabProcessoComponent;
  let fixture: ComponentFixture<TabProcessoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabProcessoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabProcessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
