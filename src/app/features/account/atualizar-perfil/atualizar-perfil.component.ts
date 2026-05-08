import { Component, OnInit, ViewChild } from '@angular/core';
import { BtnVoltarComponent } from '../../../shared/components/btn-voltar/btn-voltar.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from '../../../core/models/avatar.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarService } from '../../../shared/services/avatar.service';
import { DataService } from '../../../shared/services/data-service';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { LocalstorageService } from '../../../shared/services/localstorage.service';
import { AccountService } from '../../../shared/services/account.service';
import { UpdateProfile } from '../../../core/models/update-profile.interface';
import { ToastrService } from 'ngx-toastr';
import { ImageCompressorService } from '../../../shared/services/image-compressor.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-atualizar-perfil',
  standalone: true,
  imports: [BtnVoltarComponent, NgxSpinnerModule, ReactiveFormsModule, FontAwesomeModule, BtnCadastrarComponent, NzToolTipModule, NgxMaskDirective, NzFormModule,
    NzInputModule, NzButtonModule
  ],
  templateUrl: './atualizar-perfil.component.html',
  styleUrl: './atualizar-perfil.component.css'
})
export class AtualizarPerfilComponent implements OnInit {
  formProfile!: FormGroup;
  avatar!: Avatar | undefined;
  faTrash = faTrash;
  faPencil = faPencil;


  @ViewChild('fileInput') fileInput: any;

  constructor(private formBuilder: FormBuilder, private avatarService: AvatarService, private dataService: DataService, private spinner: NgxSpinnerService,
    private localStorageService: LocalstorageService, private accountService: AccountService, private toastr: ToastrService,
    private imageCompressorService: ImageCompressorService) {

  }

  ngOnInit() {
    const user = this.localStorageService.getUserStorage();
    this.avatar = user.avatar;
    this.formProfile = this.formBuilder.group({
      nome: [user.nome, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      telefone: [user.telefone, [Validators.required, Validators.minLength(11)]]
    });
  }

  get avatarSelecionado() {
    return this.avatar && this.avatar.id ? this.avatar.url : '/images/avatar.webp';
  }

  submit() {
    if (this.formProfile.valid) {
      this.spinner.show();
      this.atualizarPerfil();
    } else {
      FormUtils.markFormGroupTouched(this.formProfile);
    }
  }

  atualizarPerfil() {
    const usuario = <UpdateProfile>{
      ...this.formProfile.value
    };
    this.accountService.atualizarPerfil(usuario).subscribe({
      next: (res) => {
        this.localStorageService.setUserStorage(res);
        this.toastr.success('Perfil atualizado!', 'Sucesso');
      },
      error: () => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const compressedFile = await this.imageCompressorService.compressImage(file, 800, 800, 0.8);
      const compressedFileObj = new File([compressedFile], file.name, {
        type: file.type,
        lastModified: Date.now()
      });
      this.accountService.atualizarAvatar(compressedFileObj).subscribe({
        next: (res) => {
          this.avatar = res.avatar;
          this.toastr.success('Avatar atualizado!', 'Sucesso');
          this.localStorageService.setUserStorage(res);
        }
      })
    }
  }

  deleteAvatar() {
    this.fileInput.nativeElement.value = '';
    if (this.avatar?.id) {
      this.spinner.show();
      this.accountService.removerAvatar().subscribe({
        next: async () => {
          this.avatar = undefined;
          let user = this.localStorageService.getUserStorage();
          user.avatar = undefined;
          this.localStorageService.setUserStorage(user);
          this.toastr.success('Avatar removido!', 'Sucesso')
        },
        error: () => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      })
    } else {
      this.avatar = undefined;
    }
  }

  isInvalidAndTouched(fieldName: string) {
    return FormUtils.isInvalidAndTouched(this.formProfile, fieldName);
  }

  getError(field: string, validation: string) {
    return this.formProfile.get(field)?.hasError(validation);
  }
}
