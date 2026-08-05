import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCheck, faEnvelope, faEnvelopeOpen, faExclamationCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { finalize, Subject, takeUntil } from 'rxjs';
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
  private readonly destroy$ = new Subject<void>();
  private readonly unlisteners: Array<() => void> = [];

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
    items: [],
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  notificationCount = 0;
  loadingMore = false;
  notificacoesCarregada = false;

  private readonly audio: HTMLAudioElement;
  private userInteracted = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {
    this.audio = new Audio('/sounds/notification.mp3');
  }

  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCountNaoLidas();
        this.recarregarNotificacoes();

        if (!this.notificacoesCarregada) {
          this.notificacoesCarregada = true;
          return;
        }

        if (this.userInteracted) {
          this.audio.play().catch(error => {
            console.error('Erro ao tocar áudio:', error);
          });
        }
      });

    this.unlisteners.push(
      this.renderer.listen('document', 'click', () => {
        this.userInteracted = true;
      })
    );

    this.unlisteners.push(
      this.renderer.listen('document', 'click', event => {
        this.onClickOutside(event);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.unlisteners.forEach(unlisten => unlisten());
  }

  getNotifications(): void {
    const requestedPage = this.responsePageNotificacoes.currentPage;

    this.notificationService
      .getNotifications({
        pageNumber: requestedPage,
        pageSize: this.responsePageNotificacoes.pageSize
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingMore = false;
        })
      )
      .subscribe({
        next: res => {
          if (requestedPage === 1) {
            this.responsePageNotificacoes.items = res.items;
          } else {
            const existingIds = new Set(
              this.responsePageNotificacoes.items.map(item => item.id)
            );

            const newItems = res.items.filter(
              item => !existingIds.has(item.id)
            );

            this.responsePageNotificacoes.items = [
              ...this.responsePageNotificacoes.items,
              ...newItems
            ];
          }

          this.responsePageNotificacoes.currentPage = res.currentPage;
          this.responsePageNotificacoes.pageSize = res.pageSize;
          this.responsePageNotificacoes.totalCount = res.totalCount;
          this.responsePageNotificacoes.totalPages = res.totalPages;
          this.responsePageNotificacoes.hasNext = res.hasNext;
          this.responsePageNotificacoes.hasPrevious = res.hasPrevious;
        },
        error: err => {
          console.error('Erro ao buscar notificações:', err);

          if (requestedPage > 1) {
            this.responsePageNotificacoes.currentPage--;
          }
        }
      });
  }

  getCountNaoLidas(): void {
    this.notificationService
      .getCountNaoLidas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: count => {
          this.notificationCount = count;
        },
        error: err => {
          console.error(
            'Erro ao buscar quantidade de notificações não lidas:',
            err
          );
        }
      });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  marcarComoLida(
    notification: Notification,
    event: Event
  ): void {
    event.stopPropagation();

    if (notification.lida) {
      return;
    }

    this.notificationService
      .marcarComoLida(notification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          /*
           * Como o backend ordena não lidas primeiro, marcar como lida
           * pode mudar a posição da notificação. Por isso recarregamos
           * desde a primeira página.
           */
          this.notificationCount = Math.max(
            0,
            this.notificationCount - 1
          );

          this.recarregarNotificacoes();
        },
        error: err => {
          console.error(
            'Erro ao marcar notificação como lida:',
            err
          );
        }
      });
  }

  marcarTodasComoLidas(): void {
    if (this.notificationCount === 0) {
      return;
    }

    this.notificationService
      .marcarTodasComoLidas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationCount = 0;
          this.recarregarNotificacoes();
        },
        error: err => {
          console.error(
            'Erro ao marcar todas as notificações como lidas:',
            err
          );
        }
      });
  }

  horaFormatada(data: string): string | null {
    return data
      ? DateUtils.formatarData(data)
      : null;
  }

  redirect(path: string): void {
    this.showNotifications = false;
    this.router.navigateByUrl(`/app/${path}`);
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;

    const chegouAoFinal =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 5;

    if (
      !chegouAoFinal ||
      !this.responsePageNotificacoes.hasNext ||
      this.loadingMore
    ) {
      return;
    }

    this.loadingMore = true;
    this.responsePageNotificacoes.currentPage++;
    this.getNotifications();
  }

  private recarregarNotificacoes(): void {
    this.responsePageNotificacoes.currentPage = 1;
    this.responsePageNotificacoes.hasNext = false;
    this.responsePageNotificacoes.hasPrevious = false;

    this.getNotifications();
  }

  private onClickOutside(event: Event): void {
    const target = event.target as Node;

    if (
      this.showNotifications &&
      !this.elementRef.nativeElement.contains(target)
    ) {
      this.showNotifications = false;
    }
  }
}