import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Card } from '../../shared/components/cards/card';
import { Table } from '../../shared/components/table/table';
import { ReplacePipe } from '../../core/pipes/replacePipe';
import { Chart } from '../../shared/components/charts/chart';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Card,
    Table,
    ReplacePipe,
    Chart,
    FormsModule
  ],
  templateUrl: './finance.html',
  styleUrls: ['./finance.scss']
})
export class Finance {

  filtro = '';
  tabelaFiltro: { field: string, value: string } | null = null;


  columns = [
    { header: 'Empresa', field: 'company' },
    { header: 'Motorista', field: 'driver' },
    { header: 'Status', field: 'status', type: 'status' },
    { header: 'Valor', field: 'amount', type: 'currency' },
    { header: '', type: 'button', label: 'Editar' }
  ];

  payments = [
    { company: 'Transportadora A', driver: 'João Silva', status: 'Pago', amount: 1200 },
    { company: 'Transportadora B', driver: 'Maria Souza', status: 'Pendente', amount: 900 },
    { company: 'Transportadora C', driver: 'José Ribeiro', status: 'Em atraso', amount: 600 },
    { company: 'Transportadora D', driver: 'Ana Pereira', status: 'Pago', amount: 1000 },
    { company: 'Transportadora E', driver: 'Pedro Gomes', status: 'Pago', amount: 1000 },
    { company: 'Transportadora F', driver: 'Pedro Alves', status: 'Pago', amount: 1800 },
    { company: 'Transportadora G', driver: 'Ana Carla', status: 'Pago', amount: 1400 },
    { company: 'Transportadora H', driver: 'Maria Claudia', status: 'Pago', amount: 1600 },
    { company: 'Transportadora I', driver: 'João Pedro', status: 'Pago', amount: 1700 }
  ];

  aplicarFiltro() {
    // 🔹 busca tanto por empresa quanto por motorista
    this.tabelaFiltro = { field: 'company', value: this.filtro };
    if (!this.filtro) this.tabelaFiltro = null;
  }



 // Chart configs
  defaultOptions: ChartOptions = { responsive: true };

  fretesMesData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [10, 30, 20, 35, 50, 50], label: 'Fretes', borderColor: '#2563EB', fill: true, backgroundColor: 'rgba(37,99,235,0.2)' }]
  };

  tempoEntregaData: ChartData<'doughnut'> = {
    labels: ['Rápido', 'Médio', 'Lento' ],
    datasets: [{ data: [40, 35, 25], backgroundColor: ['#3B82F6', '#60A5FA', '#93C5FD'] }]
  };

  receitaMotoristaData: ChartData<'bar'> = {
    labels: ['João', 'Maria', 'José', 'Ana', 'Pedro', 'Lucas', 'Carla', 'Rafael', 'Mariana', 'Felipe'],
    datasets: [{ data: [
      11, 8, 12, 6, 3, 12, 6,18, 19, 21],
      label: 'Receita',
      backgroundColor: ['#3B82F6',  '#22C55E', '#FACC15', '#EF4444', '#236c', '#6979', '#4136'],
      borderRadius: 5
    }]
  };

  curvaABCData: ChartData<'bar'> = {
    labels: ['Categoria A', 'Categoria B', 'Categoria C', 'Categoria D', 'Categoria E', 'Categoria F', 'Categoria G', 'Categoria H', 'Categoria I', 'Categoria J', 'Categoria K', 'Categoria L'],
    datasets: [{ data: [
      60, 25, 15,32, 4, 6,12, 8, 10,15, 5, 20],
      backgroundColor: [
        '#22C55E', '#FACC15', '#EF4444', '#236c', '#6979', '#4136', '#6938','#5397',
        '#d236', '#f237', '#7236', '#b237'
       ] }]
  };

  abcOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y' // barras horizontais
  };
}
