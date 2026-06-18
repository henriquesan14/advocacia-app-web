import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { Movimento } from '../../../core/models/movimento.interface';
import { DataJudService } from '../../../shared/services/data-jud.service';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-movimentacoes-processo',
  standalone: true,
  imports: [NzTimelineModule, NzSpinModule, DatePipe, NzResultModule],
  templateUrl: './movimentacoes-processo.component.html',
  styleUrl: './movimentacoes-processo.component.scss'
})
export class MovimentacoesProcessoComponent implements OnInit {

  constructor(private dataJudService: DataJudService, @Inject(NZ_MODAL_DATA) public data: { nroProcesso: string }){

  }

  loadingMovimentacoes = false;
  erroMovimentacoes = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.getMovimentacoes();
  }

  getMovimentacoes(){
    this.loadingMovimentacoes = true;
    this.dataJudService.consultarProcesso(this.data.nroProcesso).subscribe({
      next: (res) => {
        this.movimentacoes = res;
      },
      error: (error) => {
        this.loadingMovimentacoes = false;
        this.erroMovimentacoes = true;
        console.log(error);
        this.mensagemErro = error.error.message;
      },
      complete: () => {
        this.loadingMovimentacoes = false;
      }
    })
  }

  movimentacoes: Movimento[] = [];
}
