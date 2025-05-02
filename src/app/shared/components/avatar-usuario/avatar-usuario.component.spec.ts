import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarUsuarioComponent } from './avatar-usuario.component';

describe('AvatarUsuarioComponent', () => {
  let component: AvatarUsuarioComponent;
  let fixture: ComponentFixture<AvatarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvatarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
