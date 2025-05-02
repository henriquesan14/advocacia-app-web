import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDiligenciasComponent } from './tab-diligencias.component';

describe('TabDiligenciasComponent', () => {
  let component: TabDiligenciasComponent;
  let fixture: ComponentFixture<TabDiligenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDiligenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabDiligenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
