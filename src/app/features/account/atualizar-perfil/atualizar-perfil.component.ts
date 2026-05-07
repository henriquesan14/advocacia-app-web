import { Component, OnInit, ViewChild } from '@angular/core';
import { BtnVoltarComponent } from '../../../shared/components/btn-voltar/btn-voltar.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from '../../../core/models/avatar.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarService } from '../../../shared/services/avatar.service';
import { DataService } from '../../../shared/services/data-service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormUtils } from '../../../shared/utils/form.utils';
import { BtnCadastrarComponent } from '../../../shared/components/btn-cadastrar/btn-cadastrar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { LocalstorageService } from '../../../shared/services/localstorage.service';
import { ProfileService } from '../../../shared/services/profile.service';
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
  avatar!: Avatar | null;
  faTrash = faTrash;

  
  @ViewChild('fileInput') fileInput: any;

  constructor(private formBuilder: FormBuilder, private avatarService: AvatarService, private dataService: DataService, private spinner: NgxSpinnerService, 
    private localStorageService: LocalstorageService, private profileService: ProfileService, private toastr: ToastrService,
    private imageCompressorService: ImageCompressorService ){

  }

  ngOnInit(){
    const user = this.localStorageService.getUserStorage();
    this.avatar = user.avatar;
    this.formProfile = this.formBuilder.group({
      nome: [user.nome, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      telefone:[user.telefone, [Validators.required, Validators.minLength(11)]]
    });
  }

  get avatarSelecionado(){
    if(this.avatar && this.avatar.id){
      return this.avatar.url
    }
    return this.avatar && this.avatar.urlLocal ? this.avatar.urlLocal : '/images/avatar.webp';
  }

  async submit(){
    if(this.formProfile.valid){
      this.spinner.show();
      if(this.avatar && this.avatar.file){
        const compressedFile = await this.imageCompressorService.compressImage(this.avatar.file, 800, 800, 0.8);
        const compressedFileObj = new File([compressedFile], this.avatar.file.name, {
          type: this.avatar.file.type,
          lastModified: Date.now()
        });
        this.dataService.pushFileToStorage(compressedFileObj, "avatars").subscribe({
          next: (res) => {
            this.avatar!.url = res.url;
            this.avatar!.path = res.path; 
            this.atualizarPerfil();
          },
          error: () => {
            this.spinner.hide();
            this.toastr.error('Erro ao fazer upload da imagem', 'Error');
          },
          complete: () => {
            this.spinner.hide();
          }
        });
        return;
      }
      this.atualizarPerfil();
      
    }else{
      FormUtils.markFormGroupTouched(this.formProfile);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const urlLocal = URL.createObjectURL(file);
      this.avatar = { nome: file.name, urlLocal, file };
    }  
  }

  async deleteAvatar(){
    this.fileInput.nativeElement.value = '';
    if(this.avatar?.id){
      this.spinner.show();
      this.avatarService.deleteAvatar(this.avatar.id).subscribe({
        next: async () => {
          try{
            await this.dataService.deleteFile(this.avatar?.path!);
            this.avatar = null;
            let user = this.localStorageService.getUserStorage();
            user.avatar = null!;
            this.localStorageService.setUserStorage(user);
          }catch(e){
            this.spinner.hide();
          }finally{
            this.spinner.hide();
          }
        },
        error: () => {
          this.spinner.hide();
        }
      })
    }else{
      this.avatar = null;
    }
  }

  atualizarPerfil(){
    const usuario = <UpdateProfile>{
      avatar: this.avatar,
      ...this.formProfile.value
    };
    this.profileService.atualizarPerfil(usuario).subscribe({
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

  async deleteFile(){
      await this.dataService.deleteFile(this.avatar!.path!);
  }

  isInvalidAndTouched(fieldName: string){
    return FormUtils.isInvalidAndTouched(this.formProfile, fieldName);
  }

  getError(field: string, validation: string){
    return this.formProfile.get(field)?.hasError(validation);
  }
}
