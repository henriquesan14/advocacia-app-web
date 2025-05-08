import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BtnNovoComponent } from '../../../../../shared/components/btn-novo/btn-novo.component';
import { IconClienteComponent } from '../../../../../shared/components/icon-cliente/icon-cliente.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PartesService } from '../../../../../shared/services/partes.service';
import { Parte } from '../../../../../core/models/parte.interface';
import { FormPartesComponent } from '../../../../parte/form-partes/form-partes.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ProcessosService } from '../../../../../shared/services/processos.service';

@Component({
  selector: 'tab-autores',
  standalone: true,
  imports: [BtnNovoComponent, IconClienteComponent, NzFormModule, NzInputModule, NzAutocompleteModule, NzTableModule, ReactiveFormsModule, NzButtonModule, FontAwesomeModule],
  templateUrl: './tab-autores.component.html',
  styleUrl: './tab-autores.component.scss'
})
export class TabAutoresComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  autorNomeControl = new FormControl('');
  
  faTrash = faTrash;
  
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

  onChangeAutor(event: any) {
    const nome = typeof event === 'string' ? event : event?.target?.value || '';
    this.getAutores({ nome });
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

  addAutor(event: any) {
    const nome = event.nzValue;
    const autor = this.autores.find(a => a.nome === nome);
    if (autor && !this.autoresSelecionados.some(a => a.nome === nome)) {
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
