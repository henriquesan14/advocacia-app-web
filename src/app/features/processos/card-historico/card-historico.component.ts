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

@Component({
  selector: 'app-card-historico',
  standalone: true,
  imports: [ FontAwesomeModule, ReactiveFormsModule, FormsModule, CommonModule, HasRoleDirective, NzFormModule, NzButtonModule, NzRadioModule, NzSelectModule, NzGridModule],
  templateUrl: './card-historico.component.html',
  styleUrl: './card-historico.component.css'
})
export class CardHistoricoComponent {
  formHistorico!: FormGroup;

  @Input({required: true}) historico!: Historico;
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() submitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  deleteHistorico(id: number){
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

  onSubmit(){
    if(this.historico.id){
      const historico = {
        ...this.formHistorico.value,
        id: this.historico.id,
        grau: this.historico.grau,
        resultadoSentenca: this.historico.resultadoSentenca
      }
      this.historicoService.updateHistorico(historico).subscribe({
        next: () => {
          this.toastr.success('Histórico atualizado!', 'Sucesso');
          this.submitEvent.emit(this.formHistorico.value);
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
}

