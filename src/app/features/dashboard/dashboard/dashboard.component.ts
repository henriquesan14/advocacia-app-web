import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { faArrowCircleDown, faArrowCircleUp, faScaleBalanced, faScaleUnbalanced, faScaleUnbalancedFlip } from '@fortawesome/free-solid-svg-icons';
import { Historical } from '../../../core/models/historical.interface';
import { BaseChartDirective } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NzCardModule, NzFormModule, ReactiveFormsModule, NzSelectModule, BaseChartDirective, FontAwesomeModule, NgClass, CurrencyPipe ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  formFiltro!: FormGroup;
  summary: any = {};
  monthlyData: Historical = <Historical>{};
  recentTransactions: any = {};
  statisticsByType: any = {};

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  barChartLegend: boolean = true;

  barChartData: any[] = [];

  doughnutChartLabels = [];
  doughnutChartData: any[] = [];

  doughnutChartLabels2 = [];
  doughnutChartData2: any[] = [];

  faArrowUp = faArrowCircleUp;
  faArrowDown = faArrowCircleDown;
  faScaleUnbalanced = faScaleUnbalanced;
  faScaleUnbalancedFlip = faScaleUnbalancedFlip;
  faScaleBalanced = faScaleBalanced;

  constructor(private dashboardService: DashboardService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formFiltro = this.formBuilder.group({
      ano: '',
      mes: ''
    });
    this.loadAllData();
  }

  ngOnDestroy(): void {
    
  }

  loadAllData() {
    forkJoin({
      summary: this.dashboardService.summary(null),
      monthlyData: this.dashboardService.historical(null),
      recentTransactions: this.dashboardService.recentTransactions(),
      statisticsByType: this.dashboardService.statisticsByType(null)
    }).subscribe((result) => {
      // Atualize cada variável com os dados retornados
      this.summary = result.summary;
      this.monthlyData = result.monthlyData;
      this.recentTransactions = result.recentTransactions;
      this.statisticsByType = result.statisticsByType;

      // Chama updateChartData após todos os observables terminarem
      this.updateChartData();
    });
  }

  onChangeFiltro() {
    const params = {
      mes: this.formFiltro.value.mes,
      ano: this.formFiltro.value.ano
    }
    forkJoin({
      summary: this.dashboardService.summary(params),
      statisticsByType: this.dashboardService.statisticsByType(params),
      monthlyData: this.dashboardService.historical(params),
    }).subscribe((result) => {
      this.summary = result.summary;
      this.statisticsByType = result.statisticsByType;
      this.monthlyData = result.monthlyData;
      this.updateChartData();
    });
  }


  private updateChartData(): void {

    this.barChartData = [
      {
        data: this.monthlyData.ganhosPorMes.map(d => d.total),
        label: 'Ganhos'
      },
      {
        data: this.monthlyData.despesasPorMes.map(d => d.total),
        label: 'Despesas'
      }
    ]

    this.doughnutChartLabels = this.statisticsByType.despesasPorTipo.map((d: any) => d.tipo);
    this.doughnutChartData = [
      {
        data: this.statisticsByType.despesasPorTipo.map((d: any) => d.total),
        label: 'Total'
      }
    ];

    this.doughnutChartLabels2 = this.statisticsByType.ganhosPorTipo.map((d: any) => d.tipo);
    this.doughnutChartData2 = [
      {
        data: this.statisticsByType.ganhosPorTipo.map((d: any) => d.total),
        label: 'Total'
      }
    ];
  }

  getIcon() {
    if (this.summary.saldo > 0) {
      return this.faScaleUnbalanced;
    } else if (this.summary.saldo < 0) {
      return this.faScaleUnbalancedFlip;
    }
    return this.faScaleBalanced;
  }

  getClass() {

  }
}
