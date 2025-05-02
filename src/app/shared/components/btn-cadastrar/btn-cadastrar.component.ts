import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'btn-cadastrar',
  standalone: true,
  imports: [FontAwesomeModule, NzButtonModule],
  templateUrl: './btn-cadastrar.component.html',
  styleUrl: './btn-cadastrar.component.css'
})
export class BtnCadastrarComponent {
  faCheck = faCheck;
  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() title = "Cadastrar";

  onClick(){
    this.clickEvent.emit();
  }
}
