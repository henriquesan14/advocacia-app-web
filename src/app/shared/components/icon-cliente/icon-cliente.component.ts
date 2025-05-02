import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'icon-cliente',
  standalone: true,
  imports: [FontAwesomeModule, NzToolTipModule],
  templateUrl: './icon-cliente.component.html',
  styleUrl: './icon-cliente.component.css'
})
export class IconClienteComponent {
  faAddressCard = faAddressCard;
}
