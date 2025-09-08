import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Card } from '../../shared/components/cards/card';
import { Chart } from '../../shared/components/charts/chart';
import { Table } from '../../shared/components/table/table';
import { ChartData, ChartOptions } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Card,
    Chart,
    Table,
    RouterLink
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
// Tabela
  tableData = [
    { origem: 'Pasto Alegre', destino: 'Macapá', status: 'Em coleta', valor: 'R$ 1.200' },
    { origem: 'Goiânia', destino: 'Recife', status: 'Em trânsito', valor: 'R$ 2.600' },
    { origem: 'Florianópolis', destino: 'Manaus', status: 'Entregue', valor: 'R$ 960' },
    { origem: 'Uberlândia', destino: 'João Pessoa', status: 'Em trânsito', valor: 'R$ 1.500' },
  ];
  tableColumns = [
    { header: 'Origem', field: 'origem' },
    { header: 'Destino', field: 'destino' },
    { header: 'Status', field: 'status', type: 'status' },
    { header: 'Valor', field: 'valor' }
  ];

  // Gráfico
  chartOptions: ChartOptions = { responsive: true };
  salesChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Vendas',
        data: [3000, 4200, 5000, 4800, 5200, 4700],
        backgroundColor: '#3B82F6'
      }
    ]
  };
}
