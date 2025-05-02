import { Component, Inject, Input } from '@angular/core';
import { ProcessoFieldConfig } from '../../../core/models/processo-field-config.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { ProcessoFieldConfigService } from '../../../shared/services/processo-field-config.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-modal-config-field-processos',
  standalone: true,
  imports: [ReactiveFormsModule, BtnCadastrarComponent, NgxSpinnerModule, NzFormModule, NzButtonModule, NzInputModule, NzCheckboxModule],
  templateUrl: './config-field-processos.component.html',
  styleUrl: './config-field-processos.component.css'
})
export class ConfigFieldProcessosComponent {
  formFields!: FormGroup;

  constructor(private modalRef: NzModalRef, private fb: FormBuilder,
    private processoFieldConfigService: ProcessoFieldConfigService,
    private spinner: NgxSpinnerService,  @Inject(NZ_MODAL_DATA) public data: { fields: ProcessoFieldConfig[]} ) {}

  ngOnInit(): void {
    const formGroupConfig = this.data.fields.reduce((acc, field) => {
      acc[field.id] = [field.isSelected];
      return acc;
    }, {} as any);

    this.formFields = this.fb.group(formGroupConfig);
  }

  submit(): void {
    this.spinner.show();
    const updatedFields = this.data.fields.map(field => ({
      ...field,
      isSelected: this.formFields.get(field.id.toString())?.value
    }));

    this.processoFieldConfigService.updateFieldConfigs({
      fieldConfigs: updatedFields
    }).subscribe({
      next: () => {
        this.modalRef.close(updatedFields);
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
    
  }

  selecionarTudo(){
    this.data.fields.forEach(field => {
      this.formFields.get(field.id.toString())?.setValue(true);
    });
  }

  desmarcarTudo(){
    this.data.fields.forEach(field => {
      this.formFields.get(field.id.toString())?.setValue(false);
    });
  }

  disableFields(fieldName: string) {
    return fieldName == 'Id' || fieldName == 'CreatedAt' || fieldName == 'UpdatedAt' || fieldName == 'DataUltimoHistorico';
  }
}
