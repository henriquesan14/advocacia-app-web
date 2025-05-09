import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, of, Subject, takeUntil, tap } from 'rxjs';
import { Estado } from '../../../core/models/estado.interface';
import { Cidade } from '../../../core/models/cidade.interface';
import { ViaCepService } from '../../../shared/services/viacep.service';
import { ToastrService } from 'ngx-toastr';
import { EstadoService } from '../../../shared/services/estado.service';
import { futureDateValidator } from '../../../shared/validators/future-date.validator';
import { EnderecoViaCep } from '../../../core/models/endereco-viacep.interface';
import { FormUtils } from '../../../shared/utils/form.utils';
import { Parte } from '../../../core/models/parte.interface';
import { PartesService } from '../../../shared/services/partes.service';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { enderecoValidator } from '../../../shared/validators/endereco.validator';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-form-partes',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NzButtonModule, NgxSpinnerModule, HasRoleDirective, NzFormModule, NzInputModule, NzRadioModule, NzSelectModule, NzDatePickerModule, NzCheckboxModule],
  templateUrl: './form-partes.component.html',
  styleUrl: './form-partes.component.css'
})
export class FormPartesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formPartes!: FormGroup;
  estados: Estado[] = [];
  cidades: Cidade[] = [];

  enderecoId!: number;

  @Output() submitEvent: EventEmitter<Parte> = new EventEmitter<Parte>();

  constructor(private viaCepService: ViaCepService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService,
    private estadoService: EstadoService, private parteService: PartesService, private modalRef: NzModalRef, @Inject(NZ_MODAL_DATA) public data: { parteId: string }){
  }

  ngOnInit(): void {
    this.formPartes = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.maxLength(100)]],
      tipoPessoa: ['PESSOA_FISICA'],
      cpfCnpj: [null],
      dataNascimento: [null, [futureDateValidator()]],
      telefone: [null],
      email: [null, [Validators.email]],
      isCliente: [false],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.maxLength(8), Validators.minLength(8)]],
        logradouro: [null, [Validators.maxLength(100)]],
        numero: [null, [Validators.maxLength(10)]],
        cidade: [''],
        estado: [''],
        bairro: [null, [Validators.maxLength(100)]],
        complemento: [null],
      }, { validators: enderecoValidator() }),
    });
    this.getEstados();
    if(this.data.parteId){
      this.getParte();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getParte() {
    this.spinnerService.show();
  
    this.parteService.getParteById(this.data.parteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // Preenche os campos do formulário com os dados recebidos
          this.formPartes.get('nome')?.setValue(res.nome);
          this.formPartes.get('tipoPessoa')?.setValue(res.tipoPessoa);
          this.formPartes.get('cpfCnpj')?.setValue(res.cpfCnpj);
          this.formPartes.get('telefone')?.setValue(res.telefone);
          this.formPartes.get('email')?.setValue(res.email);
          this.formPartes.get('isCliente')?.setValue(res.isCliente);
  
          if (res.dataNascimento) {
            this.formPartes.get('dataNascimento')?.setValue(new Date(res.dataNascimento));
          }
  
          if (res.endereco) {
            this.formPartes.get('endereco.cep')?.setValue(res.endereco.cep);
            this.formPartes.get('endereco.logradouro')?.setValue(res.endereco.logradouro);
            this.formPartes.get('endereco.numero')?.setValue(res.endereco.numero);
            this.formPartes.get('endereco.estado')?.setValue(res.endereco.estadoId);
            this.formPartes.get('endereco.bairro')?.setValue(res.endereco.bairro);
            this.enderecoId = res.endereco.id;
  
            // Busca as cidades para preencher o campo de cidade
            const estadoId = this.formPartes.get('endereco.estado')?.value;
            const cidadeObservable = this.estadoService.getCidades(estadoId);
            if (cidadeObservable) {
              cidadeObservable.subscribe({
                next: (response) => {
                  this.cidades = response;
                  this.formPartes.get('endereco.cidade')?.setValue(res.endereco.cidadeId);
                },
                complete: () => {
                  this.spinnerService.hide();
                },
                error: () => {
                  this.spinnerService.hide();
                }
              });
            } else {
              this.spinnerService.hide(); // Caso não haja necessidade de buscar cidades, o spinner é escondido
            }
          } else {
            // Se não houver endereço, esconda o spinner imediatamente
            this.spinnerService.hide();
          }
        },
        error: () => {
          this.spinnerService.hide();
        }
      });
  }
  
  getCidades() {
    const estadoId = this.formPartes.get('endereco.estado')?.value;
    if (estadoId) {
      this.estadoService.getCidades(estadoId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.cidades = res;
            this.formPartes.get('endereco.cidade')?.setValue('');
          },
          error: (err) => {
            console.error('Erro ao buscar cidades', err);
          }
        });
    } else {
      this.cidades = []; // Limpa a lista de cidades se nenhum estado for selecionado
      this.formPartes.get('endereco.cidade')?.setValue(null);
    }
  }

  getCep() {
    const cep = this.formPartes.get('endereco.cep')?.value;
    if (cep && cep.length > 7) {
      this.spinnerService.show();
      this.viaCepService.getCep(cep)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resCep: EnderecoViaCep) => {
            if (resCep.erro) {
              this.toastr.error('Erro ao buscar CEP', 'Error');
              this.spinnerService.hide();
              return;
            }
  
            const estado = this.estados.find(e => e.nome.toUpperCase() == resCep.uf.toUpperCase());
  
            if (estado) {
              this.formPartes.get('endereco.estado')?.setValue(estado?.id);
              
              const cidadeObservable = this.estadoService.getCidades(estado.id).pipe(
                takeUntil(this.destroy$),
                tap((res) => {
                  this.cidades = res;
                  const cidade = res.find(e => e.nome.toUpperCase() == resCep.localidade.toUpperCase());
                  if (cidade) {
                    this.formPartes.get('endereco.cidade')?.setValue(cidade.id);
                  }
                })
              );
  
              // Usando forkJoin para esperar a busca da cidade ser concluída antes de esconder o spinner
              forkJoin([cidadeObservable]).subscribe({
                next: () => {
                  this.formPartes.get('endereco.logradouro')?.setValue(resCep.logradouro);
                  this.formPartes.get('endereco.bairro')?.setValue(resCep.bairro);
                },
                error: () => {
                  this.toastr.error('Erro ao buscar cidades', 'Error');
                },
                complete: () => {
                  this.spinnerService.hide();
                }
              });
  
            } else {
              this.formPartes.get('endereco.logradouro')?.setValue(resCep.logradouro);
              this.formPartes.get('endereco.bairro')?.setValue(resCep.bairro);
              this.spinnerService.hide();
            }
          },
          error: () => {
            this.spinnerService.hide();
          }
        });
    }
  }

  onSubmit(){
    if(this.formPartes.valid){
      const form = this.formPartes.value;
      const parte = <Parte>{
        nome: form.nome.toUpperCase(),
        tipoPessoa: form.tipoPessoa,
        cpfCnpj: form.cpfCnpj,
        dataNascimento: this.formatarData(form.dataNascimento),
        telefone: form.telefone,
        email: form.email,
        isCliente: form.isCliente
      };
      const endereco = this.formPartes.value.endereco;
      const enderecoVazio = !endereco.cep && !endereco.logradouro && !endereco.numero && !endereco.cidade && !endereco.estado && !endereco.bairro;

      if (!enderecoVazio) {
        parte.endereco = endereco;
        if(this.enderecoId){
          parte.endereco.id = this.enderecoId;
        }
      }
      if(this.data.parteId){
        this.updateParte(parte);
      }else{
        this.cadastrarParte(parte);
      }
    }else{
      FormUtils.markFormGroupTouched(this.formPartes);
    }
  }

  formatarData(data: Date): string {
    const dataLocal = new Date(data); 
    dataLocal.setMinutes(dataLocal.getMinutes() - dataLocal.getTimezoneOffset()); // Ajusta para o horário local
    return dataLocal.toISOString().split('T')[0]; // "2025-05-02" (sem horário)
  }

  cadastrarParte(parte: Parte){
    this.spinnerService.show();
    this.parteService.addParte(parte).subscribe({
      next: (res) => {
        this.toastr.success('Parte cadastrada!', 'Sucesso!');
        this.modalRef.close(true);
      },
      error: () => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      }
    })
  }

  updateParte(parte: Parte){
    this.spinnerService.show();
    parte.id = this.data.parteId;
    this.parteService.updateParte(parte).subscribe({
      next: () => {
        this.toastr.success('Parte atualizada!', 'Sucesso!');
        this.modalRef.close(true);
      },
      error: () => {
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      }
    })
  }

  getEstados(){
    this.estadoService.getEstados()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.estados = res;
      }
    })
  }

  getMaskCpfCnpj(){
    return this.formPartes.get('tipoPessoa')?.value == 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0000-00';
  }

  isInvalidAndTouched(fieldName: string){
    return FormUtils.isInvalidAndTouched(this.formPartes, fieldName);
  }
  

  getError(field: string, validation: string){
    return this.formPartes.get(field)?.hasError(validation);
  }

  getCepError(field: string, fieldGroup: string, validation: string){
    return !this.formPartes.get(field)?.value &&  this.formPartes.get(fieldGroup)?.hasError(validation);
  }

}
