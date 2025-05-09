import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventosService } from '../../../shared/services/eventos.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtnNovoComponent } from '../../../shared/components/btn-novo/btn-novo.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BtnPesquisarComponent } from '../../../shared/components/btn-pesquisar/btn-pesquisar.component';
import { BtnLimparComponent } from '../../../shared/components/btn-limpar/btn-limpar.component';
import { ResponsePage } from '../../../core/models/response-page.interface';
import { Evento } from '../../../core/models/evento.interface';
import { faCameraAlt} from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CardEventoComponent } from '../card-evento/card-evento.component';
import { FormEventoComponent } from '../form-evento/form-evento.component';

@Component({
  selector: 'app-listagem-eventos',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, BtnPesquisarComponent, BtnLimparComponent, FontAwesomeModule, BtnNovoComponent, NzCardModule, CommonModule,
    NgxSpinnerModule, NzPaginationModule, NzModalModule, NzButtonModule, NzDatePickerModule, CardEventoComponent
  ],
  templateUrl: './listagem-eventos.component.html',
  styleUrl: './listagem-eventos.component.scss',
  providers: [DatePipe]
})
export class ListagemEventosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private eventoService: EventosService, private formBuilder: FormBuilder, private datePipe: DatePipe, private router: Router, private toastr: ToastrService,
  private spinner: NgxSpinnerService){}
  formAgenda!: FormGroup;

  private modalService = inject(NzModalService);
  confirmModal?: NzModalRef;

  @ViewChild('content') content!: ElementRef;

  responsePageEventos: ResponsePage<Evento> = {
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    items: [],
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };

  faCamera = faCameraAlt;

  ngOnInit(): void {
    this.formAgenda = this.formBuilder.group({
      dataEvento: [new Date(), Validators.required],
      tipo: ['']
    });
    
    this.getEventos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEventos(){
    const dateFormatted = this.getDateFormatted();
    this.eventoService.getEventos({
      tipo: this.formAgenda.get('tipo')?.value,
      dataInicio: dateFormatted,
      pageNumber: this.responsePageEventos.currentPage,
      pageSize: this.responsePageEventos.pageSize
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.responsePageEventos = res;
      }
    });
  }

  onPageChange(event: number) {
    this.responsePageEventos.currentPage = event;
    this.getEventos();
  }

  onPageSizeChange(event: number) {
    this.responsePageEventos.pageSize = event;
    this.getEventos();
  }

  editarEvento(id: string){
    this.router.navigateByUrl(`/app/agenda/${id}`);
  }

  excluirEvento(eventoId: string){
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Exclusão',
      nzContent: 'Tem certeza que quer remover esta agenda?',
      nzOnOk: () =>
        this.eventoService.deleteEvento(eventoId).subscribe({
          next: () => {
            this.toastr.success('Agenda removida!', 'Sucesso');
            this.getEventos();
          }
        })
    });
  }

  submit(){
    if(this.formAgenda.get('dataEvento')?.value){
      this.getEventos();
      return;
    }
    this.getEventos();
  }

  getDateFormatted(): string | null {
    const formDate: Date | null = this.formAgenda.get('dataEvento')?.value;
  
    if (formDate instanceof Date) {
      const formattedDate = this.datePipe.transform(formDate, 'yyyy-MM-dd');
      return formattedDate!;
    }
  
    return null;
  }

  novoEvento(){
    this.router.navigateByUrl('eventos/cadastro');
  }

  openModalFormEvento(eventoId?: string) {
      const modal = this.modalService.create({
        nzTitle: eventoId ? 'Edição de agenda' : 'Cadastro de agenda',
        nzContent: FormEventoComponent,
        nzWidth: '1000px',
        nzFooter: null,
        nzData: {
          eventoId: eventoId
        }
      });
  
      modal.afterClose.subscribe(() => {
        this.getEventos();
      });
    }

  captureScreen() {
    const content = this.content.nativeElement;

    html2canvas(content).then(canvas => {
      // Converta o canvas em uma imagem base64
      const imageData = canvas.toDataURL('image/png');

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0,10);

      // Crie um link de download para a imagem
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `agenda_${formattedDate}.png`;
      
      // Clique no link para iniciar o download
      link.click();
    });
  }

  reset() {
    this.formAgenda.get('dataEvento')?.setValue(new Date());
    this.formAgenda.get('tipo')?.setValue('');
  }
}
