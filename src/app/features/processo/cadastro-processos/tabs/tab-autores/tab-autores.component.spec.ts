import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAutoresComponent } from './tab-autores.component';

describe('TabAutoresComponent', () => {
  let component: TabAutoresComponent;
  let fixture: ComponentFixture<TabAutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabAutoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
