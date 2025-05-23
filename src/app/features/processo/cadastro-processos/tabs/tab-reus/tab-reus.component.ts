import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Parte } from '../../../../../core/models/parte.interface';
import { FormPartesComponent } from '../../../../parte/form-partes/form-partes.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PartesService } from '../../../../../shared/services/partes.service';
import { Subject, takeUntil } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProcessosService } from '../../../../../shared/services/processos.service';
import { ToastrService } from 'ngx-toastr';
import { SelectAutocompleteComponent } from '../../../../../shared/components/select-autocomplete/select-autocomplete.component';
import { IconClienteComponent } from '../../../../../shared/components/icon-cliente/icon-cliente.component';

@Component({
  selector: 'tab-reus',
  standalone: true,
  imports: [BtnNovoComponent, ReactiveFormsModule, NzFormModule, NzInputModule, NzTableModule, NzButtonModule, FontAwesomeModule, SelectAutocompleteComponent, IconClienteComponent],
  templateUrl: './tab-reus.component.html',
  styleUrl: './tab-reus.component.scss'
})
export class TabReusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  reuNomeControl = new FormControl('');

  faTrash = faTrash;
  faAddressCard = faAddressCard;

  reus: Parte[] = [];
  @Input() reusSelecionados: Parte[] = [];
  @Input() processoId?: string;

  @Output() reusChange = new EventEmitter<Parte[]>();

  modalService = inject(NzModalService);
  toastr = inject(ToastrService);

  constructor(private parteService: PartesService, private processoService: ProcessosService) { }

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

  onChangeReu(nome: any) {
    this.getReus({ nome });
  }

  reuSelected(reu: Parte) {
    if (!this.reusSelecionados.find(p => p.id === reu.id)) {
      if (this.processoId) {
        const reuProcesso = {
          reuId: reu.id,
          processoId: this.processoId
        };

        this.processoService.addReuProcesso(reuProcesso).subscribe({
          next: () => {
            this.toastr.success('Réu adicionado no processo!', 'Sucesso');
            this.reusSelecionados.push(reu);
            this.reuNomeControl.setValue('');
            this.reusChange.emit(this.reusSelecionados);
          }
        })
      } else {
        this.reusSelecionados.push(reu);
        this.reuNomeControl.setValue('');
        this.reusChange.emit(this.reusSelecionados);
      }
    }
  }

  deleteReu(autor: Parte, index: any) {
    if (this.processoId) {
      const reuProcesso = {
        reuId: autor.id,
        processoId: this.processoId
      };
      this.processoService.deleteReuProcesso(reuProcesso).subscribe({
        next: () => {
          this.toastr.success('Réu excluído com sucesso!', 'Sucesso');
          this.reusSelecionados.splice(index, 1);
          this.reusChange.emit(this.reusSelecionados);
        }
      });
    } else {
      this.reusSelecionados.splice(index, 1);
      this.reusChange.emit(this.reusSelecionados);
    }
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
