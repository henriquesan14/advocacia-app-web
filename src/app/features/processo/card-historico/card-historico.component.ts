import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPencil, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Historico } from '../../../core/models/historico.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistoricoService } from '../../../shared/services/historico.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { DateUtils } from '../../../shared/utils/date.utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-card-historico',
  standalone: true,
  imports: [ FontAwesomeModule, ReactiveFormsModule, FormsModule, CommonModule, HasRoleDirective, NzFormModule, NzInputModule, NzButtonModule, NzRadioModule, NzSelectModule,
     NzGridModule, NzTagModule],
  templateUrl: './card-historico.component.html',
  styleUrl: './card-historico.component.css'
})
export class CardHistoricoComponent {
  formHistorico!: FormGroup;

  @Input({required: true}) historico!: Historico;
  @Output() deleteEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitEvent: EventEmitter<Historico> = new EventEmitter<Historico>();

  faTrash = faTrash;
  faPencil = faPencil;
  faCheck = faCheck;
  faTimesCircle = faTimesCircle;

  editar = false;

  constructor(private formBuilder: FormBuilder, private historicoService: HistoricoService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.formHistorico = this.formBuilder.group({
      descricao: [null, Validators.required],
      grau: [null],
      resultadoSentenca: [null]
    });
  }

  deleteHistorico(id: string){
    this.deleteEvent.emit(id);
  }

  editarHistorico(){
    if(!this.editar){
      this.formHistorico.get('descricao')?.setValue(this.historico.descricao);
      this.editar = true;
    }
  }

  cancelar(){
    this.editar = false;
  }

  onSubmit() {
    if (this.historico.id) {
      const historicoAtualizado = {
        ...this.historico, // copia tudo
        descricao: this.formHistorico.value.descricao,
        resultadoSentenca: this.historico.resultadoSentenca,
        grau: this.historico.grau
      };
  
      this.historicoService.updateHistorico(historicoAtualizado).subscribe({
        next: () => {
          this.toastr.success('Histórico atualizado!', 'Sucesso');
          this.submitEvent.emit(historicoAtualizado); // <--- envia objeto completo
          this.editar = false;
          this.formHistorico.reset();
        }
      });
    }
  }

  get avatar(){
    if(this.historico.createdByUser && this.historico.createdByUser.avatar){
      return this.historico.createdByUser.avatar.url;
    }
    return '/images/avatar.webp';
  }

  get horaFormatada(){
    if(this.historico){
      return DateUtils.formatarData(this.historico.createdAt)
    }
    return null;
  }

  getStatusClass(status: string | undefined) {
    return {
      'sem-sentenca': status === undefined || status === null,
      'favoravel': status === 'FAVORAVEL',
      'nao-favoravel': status === 'NAO_FAVORAVEL',
      'parcialmente-favoravel': status === 'PARCIALMENTE_FAVORAVEL',
    };
  }

  getGrauColor(grau: number): string {
    switch (grau) {
      case 1:
        return '#9AE2C0';

      case 2:
        return '#F0EBAC';

      case 3:
        return '#F87676';

      default:
        return 'default';
    }
  }

  getSetencaColor(sentenca: string | undefined): string {
    switch (sentenca) {
      case 'FAVORAVEL':
        return '#9AE2C0';

      case 'NAO_FAVORAVEL':
        return '#F87676';

      case '':
        return '#F0EBAC';
      default:
        return ' #A5C3DF';
    }
  }

  getTextSentenca(sentenca: string | undefined){
    switch(sentenca){
      case 'FAVORAVEL':
        return 'Favorável';

      case 'NAO_FAVORAVEL':
        return 'Não favorável';

      case '':
        return 'Parcialmente favorável';
      default:
        return ' Sem sentença';
    }
  }
}

