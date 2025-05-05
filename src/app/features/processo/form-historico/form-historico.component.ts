import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { HistoricoService } from '../../../shared/services/historico.service';
import { ToastrService } from 'ngx-toastr';
import { Historico } from '../../../core/models/historico.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { LocalstorageService } from '../../../shared/services/localstorage.service';
import { AvatarUsuarioComponent } from '../../../shared/components/avatar-usuario/avatar-usuario.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-form-historico',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, AvatarUsuarioComponent, CommonModule, NzFormModule, NzInputModule, NzButtonModule, NzSelectModule, NzRadioModule],
  templateUrl: './form-historico.component.html',
  styleUrl: './form-historico.component.css',
  providers: [DatePipe]
})
export class FormHistoricoComponent implements OnInit{
  faCheck = faCheck;
  formHistorico!: FormGroup;

  constructor(private formBuilder: FormBuilder, private historicoService: HistoricoService, private toastr: ToastrService,
     private datePipe: DatePipe, private localStorageService: LocalstorageService){}

  @Output() submitEvent: EventEmitter<Historico> = new EventEmitter<Historico>();
  @Input() processoId?: string;

  ngOnInit(): void {
    this.formHistorico = this.formBuilder.group({
      descricao: [null, Validators.required],
      resultadoSentenca: [null],
      grau: [1]
    });
  }

  onSubmit(){
    const grau = this.formHistorico.get('grau')?.value;
    const user = this.localStorageService.getAuthStorage().user;
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    if(this.processoId){
      const historico = {
        ...this.formHistorico.value,
        processoId: this.processoId,
        createdAt: formattedDate,
        createdByUser: user
      }
      this.historicoService.addHistorico(historico).subscribe({
        next: (res) => {
          this.toastr.success('Histórico adicionado!', 'Sucesso');
          historico.id = res.id;
          this.submitEvent.emit(historico);
          this.formHistorico.reset();
          this.formHistorico.get('grau')?.setValue(grau);
        }
      });
    }else{
      const historico = {
        ...this.formHistorico.value,
        createdAt: formattedDate,
        createdByUser: user
      }
      this.submitEvent.emit(historico);
      this.formHistorico.reset();
      this.formHistorico.get('grau')?.setValue(grau);
    }
  }
}
