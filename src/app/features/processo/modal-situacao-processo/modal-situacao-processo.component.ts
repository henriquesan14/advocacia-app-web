import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ToastrService } from 'ngx-toastr';
import { Processo } from '../../../core/models/processo.interface';
import { SituacaoProcesso } from '../../../core/models/situacao-processo.interface';
import { ProcessosService } from '../../../shared/services/processos.service';
import { SituacaoProcessoService } from '../../../shared/services/situacao-processo.service';

@Component({
  selector: 'app-modal-situacao-processo',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzSelectModule],
  templateUrl: './modal-situacao-processo.component.html'
})
export class ModalSituacaoProcessoComponent implements OnInit {
  form: FormGroup;
  situacoes: SituacaoProcesso[] = [];
  loading = true;
  saving = false;

  constructor(
    formBuilder: FormBuilder,
    private readonly processosService: ProcessosService,
    private readonly situacaoService: SituacaoProcessoService,
    private readonly toastr: ToastrService,
    private readonly modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public readonly data: { processo: Processo }
  ) {
    this.form = formBuilder.group({
      situacaoProcessoId: [data.processo.situacao.id, Validators.required]
    });
  }

  ngOnInit(): void {
    this.situacaoService.getSituacoes({}).subscribe({
      next: situacoes => this.situacoes = situacoes,
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

  salvar(): void {
    if (this.form.invalid || this.saving) return;

    this.saving = true;
    this.processosService.atualizarSituacao(
      this.data.processo.id,
      this.form.value.situacaoProcessoId
    ).subscribe({
      next: () => {
        this.toastr.success('Situação atualizada!', 'Sucesso');
        this.modalRef.close(true);
      },
      error: () => this.saving = false
    });
  }

  cancelar(): void {
    this.modalRef.close(false);
  }
}
