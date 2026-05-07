import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './shared/services/notification.service';
import { LocalstorageService } from './shared/services/localstorage.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(private localStorageService: LocalstorageService, private notificationService: NotificationService){}

  ngOnInit() {
    // Verifica se o usuário está logado ao iniciar a aplicação
    const user = this.localStorageService.getUserStorage();
    if (user) {
      this.notificationService.startConnection(user.toString());
    }
  }
}
