import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PartesService } from '../../../../../shared/services/partes.service';
import { Parte } from '../../../../../core/models/parte.interface';
import { FormPartesComponent } from '../../../../parte/form-partes/form-partes.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ProcessosService } from '../../../../../shared/services/processos.service';
import { SelectAutocompleteComponent } from '../../../../../shared/components/select-autocomplete/select-autocomplete.component';
import { IconClienteComponent } from '../../../../../shared/components/icon-cliente/icon-cliente.component';

@Component({
  selector: 'tab-autores',
  standalone: true,
  imports: [BtnNovoComponent, NzFormModule, NzInputModule, NzTableModule, ReactiveFormsModule, NzButtonModule, FontAwesomeModule, SelectAutocompleteComponent, IconClienteComponent],
  templateUrl: './tab-autores.component.html',
  styleUrl: './tab-autores.component.scss'
})
export class TabAutoresComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  autorNomeControl = new FormControl('');
  
  faTrash = faTrash;
  faAddressCard = faAddressCard;
  
  autores: Parte[] = [];
  @Input() autoresSelecionados: Parte[] = [];
  @Input() processoId?: string;

  @Output() autoresChange = new EventEmitter<Parte[]>();

  modalService = inject(NzModalService);
  toastr = inject(ToastrService);

  constructor(private parteService: PartesService, private processoService: ProcessosService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autores']) {
      this.autoresSelecionados = [...this.autores];
    }
  }

  ngOnInit(): void {
    var params = { pageSize: 99 };
    this.getAutores(params);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAutores(params: any) {
    params.pageSize = 99;
    this.parteService.getPartes(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.autores = res.items;
        }
      })
  }

  onChangeAutor(nome: any){
    this.getAutores({nome});
  }

  autorSelected(autor: Parte) {
    if (!this.autoresSelecionados.find(p => p.id === autor.id)) {
      if(this.processoId){
        const autorProcesso = {
          autorId: autor.id,
          processoId: this.processoId
        };
    
        this.processoService.addAutorProcesso(autorProcesso).subscribe({
          next: () => {
            this.toastr.success('Autor adicionado no processo!', 'Sucesso');
            this.autoresSelecionados.push(autor);
            this.autorNomeControl.setValue('');
            this.autoresChange.emit(this.autoresSelecionados);
          }
        })
      }else{
        this.autoresSelecionados.push(autor);
            this.autorNomeControl.setValue('');
            this.autoresChange.emit(this.autoresSelecionados);
      }
    }
  }

  deleteAutor(autor: Parte, index: any) {
    if (this.processoId) {
      const autorProcesso = {
        autorId: autor.id,
        processoId: this.processoId
      };
      this.processoService.deleteAutorProcesso(autorProcesso).subscribe({
        next: () => {
          this.toastr.success('Autor excluído com sucesso!', 'Sucesso');
          this.autoresSelecionados.splice(index, 1);
          this.autoresChange.emit(this.autoresSelecionados);
        }
      });
    }else{
      this.autoresSelecionados.splice(index, 1);
      this.autoresChange.emit(this.autoresSelecionados);
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
        this.getAutores(params);
      }
    });
  }
}
