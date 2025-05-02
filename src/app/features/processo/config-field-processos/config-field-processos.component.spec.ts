import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigFieldProcessosComponent } from './config-field-processos.component';

describe('ConfigFieldProcessosComponent', () => {
  let component: ConfigFieldProcessosComponent;
  let fixture: ComponentFixture<ConfigFieldProcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigFieldProcessosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigFieldProcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
