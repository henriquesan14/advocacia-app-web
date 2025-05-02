import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'btn-pesquisar',
  standalone: true,
  imports: [FontAwesomeModule, NzButtonModule],
  templateUrl: './btn-pesquisar.component.html',
  styleUrl: './btn-pesquisar.component.css'
})
export class BtnPesquisarComponent {
  faSearch = faSearch;
}
