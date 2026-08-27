import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { LoginAudit } from '../../../core/models/login-audit.interface';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { LoginAuditService } from '../../../shared/services/login-audit.service';

@Component({
  selector: 'app-listagem-auditoria-login',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, NzFormModule, NzInputModule, NzDatePickerModule,
    NzTableModule, NzButtonModule, NzToolTipModule, BtnPesquisarComponent, BtnLimparComponent],
  templateUrl: './listagem-auditoria-login.component.html'
})
export class ListagemAuditoriaLoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auditService = inject(LoginAuditService);
  audits: LoginAudit[] = [];
  loading = false;
  readonly form = this.formBuilder.group({
    usuario: [''],
    dataInicio: [null as Date | null],
    dataFim: [null as Date | null]
  });

  ngOnInit(): void { this.pesquisar(); }

  pesquisar(): void {
    this.loading = true;
    const { usuario, dataInicio, dataFim } = this.form.getRawValue();
    this.auditService.getAll({
      usuario: usuario ?? undefined,
      dataInicio: dataInicio ?? undefined,
      dataFim: dataFim ?? undefined
    }).subscribe({
      next: audits => this.audits = audits,
      complete: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  limpar(): void {
    this.form.reset({ usuario: '', dataInicio: null, dataFim: null });
    this.pesquisar();
  }
}
