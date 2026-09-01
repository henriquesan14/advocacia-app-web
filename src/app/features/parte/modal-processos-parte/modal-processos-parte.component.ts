import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Processo } from '../../../core/models/processo.interface';
import { NroProcessoPipe } from '../../../shared/pipes/nro-processo.pipe';
import { PartesService } from '../../../shared/services/partes.service';

@Component({
  selector: 'app-modal-processos-parte',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NzButtonModule, NzTableModule, NzToolTipModule, NroProcessoPipe],
  templateUrl: './modal-processos-parte.component.html'
})
export class ModalProcessosParteComponent implements OnInit {
  processos: Processo[] = [];
  loading = true;
  faArrowRight = faArrowRight;

  constructor(
    private readonly partesService: PartesService,
    private readonly router: Router,
    private readonly modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public readonly data: { parteId: string; parteNome: string }
  ) {}

  ngOnInit(): void {
    this.partesService.getProcessos(this.data.parteId).subscribe({
      next: processos => this.processos = processos,
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

  visualizarProcesso(processoId: string): void {
    this.modalRef.close();
    this.router.navigate(['/processos', processoId]);
  }

  getPolo(processo: Processo): string {
    const isAutor = processo.autores?.some(parte => parte.id === this.data.parteId);
    const isReu = processo.reus?.some(parte => parte.id === this.data.parteId);

    if (isAutor && isReu) return 'Autor e réu';
    if (isAutor) return 'Autor';
    return 'Réu';
  }
}
