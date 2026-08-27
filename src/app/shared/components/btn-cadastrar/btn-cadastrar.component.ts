import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Subject, takeUntil } from 'rxjs';
import { RequestLoadingService } from '../../services/request-loading.service';

@Component({
  selector: 'btn-cadastrar',
  standalone: true,
  imports: [FontAwesomeModule, NzButtonModule],
  templateUrl: './btn-cadastrar.component.html',
  styleUrl: './btn-cadastrar.component.css'
})
export class BtnCadastrarComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  faCheck = faCheck;
  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() title = "Cadastrar";
  @Input() disabled = false;
  @Input() size: 'large' | 'default' | 'small' = 'default';
  isSubmitting = false;

  constructor(private readonly requestLoadingService: RequestLoadingService) {
    this.requestLoadingService.mutationLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => this.isSubmitting = isLoading);
  }

  onClick(){
    if (this.isSubmitting) return;
    this.clickEvent.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
