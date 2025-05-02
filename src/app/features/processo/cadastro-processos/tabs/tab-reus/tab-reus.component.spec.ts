import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabReusComponent } from './tab-reus.component';

describe('TabReusComponent', () => {
  let component: TabReusComponent;
  let fixture: ComponentFixture<TabReusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabReusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabReusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
