import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'btn-voltar',
  standalone: true,
  imports: [ FontAwesomeModule, NzButtonModule],
  templateUrl: './btn-voltar.component.html',
  styleUrl: './btn-voltar.component.css'
})
export class BtnVoltarComponent {
  constructor(private location: Location){

  }
  faArrowLeft = faArrowAltCircleLeft;

  voltar(){
    this.location.back();
  }
}
