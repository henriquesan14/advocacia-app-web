import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { IconClienteComponent } from '../../../../../shared/components/icon-cliente/icon-cliente.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Parte } from '../../../../../core/models/parte.interface';
import { FormPartesComponent } from '../../../../parte/form-partes/form-partes.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PartesService } from '../../../../../shared/services/partes.service';
import { Subject, takeUntil } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'tab-reus',
  standalone: true,
  imports: [BtnNovoComponent, IconClienteComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzAutocompleteModule, NzTableModule, NzButtonModule, NzIconModule],
  templateUrl: './tab-reus.component.html',
  styleUrl: './tab-reus.component.scss'
})
export class TabReusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  reuNomeControl = new FormControl('');

  reusSelecionados: Parte[] = [];
  @Input() reus: Parte[] = [];

  @Output() reusChange = new EventEmitter<Parte[]>();

  modalService = inject(NzModalService);

  constructor(private parteService: PartesService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reus']) {
      this.reusSelecionados = [...this.reus];
    }
  }

  ngOnInit(): void {
    var params = { pageSize: 99 };
    this.getReus(params);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChangeReu(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getReus({ nome });
  }

  getReus(params: any) {
    params.pageSize = 99;
    this.parteService.getPartes(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.reus = res.items;
        }
      })
  }

  addReu(event: any) {
    const nome = event.nzValue;
    const reu = this.reus.find(a => a.nome === nome);
    if (reu && !this.reusSelecionados.some(a => a.nome === nome)) {
      this.reusSelecionados.push(reu);
      this.reuNomeControl.setValue('');
      this.reusChange.emit(this.reusSelecionados);
    }
  }

  deleteReu(index: any) {
    this.reusSelecionados.splice(index, 1);
    this.reusChange.emit(this.reusSelecionados);
  }

  openModalFormParte() {
    const modal = this.modalService.create({
      nzTitle: 'Cadastro de parte',
      nzContent: FormPartesComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        var params = { pageSize: 99 };
        this.getReus(params);
      }
    });
  }
}
