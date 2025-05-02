import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAudienciasComponent } from './tab-audiencias.component';

describe('TabAudienciasComponent', () => {
  let component: TabAudienciasComponent;
  let fixture: ComponentFixture<TabAudienciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabAudienciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabAudienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
