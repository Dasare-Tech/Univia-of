import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-chart',
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  standalone: true,
  templateUrl: './chart.html',
  styleUrl: './chart.scss'
})
export class Chart {
  @Input() title!: string;
  @Input() chartType: ChartType = 'bar';
  @Input() chartOptions: ChartOptions = { responsive: true };
  @Input() chartData!: ChartData;

  public chartPlugins = [ChartDataLabels];


  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;

  getImageBase64(): string | undefined {
    return this.baseChart?.chart?.toBase64Image();
  }

}
