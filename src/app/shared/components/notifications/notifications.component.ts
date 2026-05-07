import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCheck, faEnvelope, faEnvelopeOpen, faExclamationCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { Notification } from '../../../core/models/notification.interface';
import { DateUtils } from '../../../shared/utils/date.utils';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResponsePage } from '../../../core/models/response-page.interface';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ FontAwesomeModule, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showNotifications = false;
  
  faBell = faBell;
  faEnvelope = faEnvelope;
  faEnvelopeOpen = faEnvelopeOpen;
  faInfoCircle = faInfoCircle;
  faExclamationCircle = faExclamationCircle;
  faExclamationTriangle = faExclamationTriangle;

  responsePageNotificacoes: ResponsePage<Notification> = {
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    items: [], // Inicializando como um array vazio
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  notificationCount: number = 0;
  loadingMore: boolean = false;
  private audio: HTMLAudioElement;
  notificacoesCarregada = false;
  private userInteracted = false;

  constructor(private notificationService: NotificationService, private router: Router, private elementRef: ElementRef,
    private renderer: Renderer2) {
      this.audio = new Audio('/sounds/notification.mp3');
    }

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification => {
        this.getCountNaoLidas();
        this.getNotifications();
        if (!this.notificacoesCarregada) {
            this.notificacoesCarregada = true;
        } else {
            if (this.userInteracted) {
                this.audio.play().catch(error => console.error('Erro ao tocar áudio:', error));
            }
        }
    });

    this.renderer.listen('document', 'click', this.userInteraction.bind(this));
    this.renderer.listen('document', 'click', this.onClickOutside.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getNotifications(){
    this.notificationService.getNotifications({
      pageNumber: this.responsePageNotificacoes.currentPage,
      pageSize: this.responsePageNotificacoes.pageSize
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        if (this.responsePageNotificacoes.currentPage === 1) {
          this.responsePageNotificacoes.items = res.items;
        } else {
          const existingIds = new Set(this.responsePageNotificacoes.items.map(item => item.id));
          const newItems = res.items.filter(item => !existingIds.has(item.id));
          this.responsePageNotificacoes.items = [...this.responsePageNotificacoes.items, ...newItems];
        }
        this.responsePageNotificacoes.hasNext = res.hasNext;
        this.loadingMore = false;
      },
      error: () => {
        this.loadingMore = false;
      }
    })
  }

  getCountNaoLidas(){
    this.notificationService.getCountNaoLidas()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.notificationCount = res;
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }


  marcarComoLida(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (!notification.lida) {
      this.notificationService.marcarComoLida(notification.id).subscribe({
        next: () => {
          // Atualize a notificação localmente
          const notificationIndex = this.responsePageNotificacoes.items.findIndex(n => n.id === notification.id);
          if (notificationIndex !== -1) {
            this.responsePageNotificacoes.items[notificationIndex].lida = true;
          }
          this.getCountNaoLidas(); // Atualize a contagem de notificações não lidas
        },
        error: (err) => {
          console.error('Error marking notification as read:', err);
        }
      });
    }
  }

  marcarTodasComoLidas(): void {
    const unreadNotificationIds = this.responsePageNotificacoes.items
      .filter(notification => !notification.lida)
      .map(notification => notification.id);
  
    if (unreadNotificationIds.length > 0) {
      this.notificationService.marcarTodasComoLidas().subscribe({
        next: () => {
          this.responsePageNotificacoes.items.forEach(notification => {
            notification.lida = true;
          });
          this.getCountNaoLidas();
        },
        error: (err) => {
          console.error('Error marking all notifications as read:', err);
        }
      });
    }
  }

  horaFormatada(data: string){
    if(data){
      return DateUtils.formatarData(data)
    }
    return null;
  }

  redirect(path: string){
    const currentUrl = this.router.url;

    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl).then(() => {
        this.router.navigateByUrl(`/app/${path}`);
      });
    });
  }

  onScroll(event: any): void {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && this.responsePageNotificacoes.hasNext && !this.loadingMore) {
      this.loadingMore = true;
      this.responsePageNotificacoes.currentPage++;
      this.getNotifications();
    }
  }

  private onClickOutside(event: Event): void {
    if (this.showNotifications && !this.elementRef.nativeElement.contains(event.target)) {
      this.showNotifications = false;
    }
  }

  private userInteraction(): void {
      this.userInteracted = true;
      this.renderer.listen('document', 'click', () => {});
  }
}