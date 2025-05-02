import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDocumentosComponent } from './tab-documentos.component';

describe('TabDocumentosComponent', () => {
  let component: TabDocumentosComponent;
  let fixture: ComponentFixture<TabDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
