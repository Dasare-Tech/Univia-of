import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Card } from '../../shared/components/cards/card';
import { Chart } from '../../shared/components/charts/chart';
import { Table } from '../../shared/components/table/table';
import { ChartData, ChartOptions } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Card,
    Chart,
    Table
  ],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.scss'
})
export class Relatorio {
  @ViewChild('statusChart') statusChart!: Chart;
  @ViewChild('receitaChart') receitaChart!: Chart;
  @ViewChild('custosChart') custosChart!: Chart;


  curvaABC: any[] = []; // Tabela detalhada
  abcChartData!: ChartData<'bar' | 'line'>;
  abcChartOptions!: ChartOptions;

    // Resumos já calculados
  classeAClientes = 0;
  classeAReceita = 0;
  classeBClientes = 0;
  classeBReceita = 0;
  classeCClientes = 0;
  classeCReceita = 0;

  ngOnInit() {
    this.gerarCurvaABC();
  }

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'

      }
    }
  };

  // Opções específicas para o gráfico de pizza
  custosChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      datalabels: {
        color: '#b76161ff',
        font: {
          weight: 'bold' as const,
          size: 12
        },
        formatter: (value, ctx) => {
          const dataArr = ctx.chart.data.datasets[0].data as number[];
          const total = dataArr.reduce((a, b) => a + b, 0);
          const percentage = ((value as number) / total * 100).toFixed(1) + '%';
          return `${value} (${percentage})`;
        }
      }
    }
  };


  fretesStatusOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12 }
        }
      },
      y: {
        ticks: {
          stepSize: 10
        }
      }
    },
    datasets: {
      bar: {
        barPercentage: 0.5,     // largura da barra (0.1 = fininha, 1 = ocupa tudo)
        categoryPercentage: 0.6 // espaço da categoria (ajusta o espaço entre barras)
      }
    }
  };



  // Gráficos
  fretesStatusData: ChartData<'bar'> = {
    labels: ['Entregues', 'Em trânsito', 'Em atraso'],
    datasets: [{ label: 'Fretes', data: [85, 50, 15], backgroundColor: ['#10B981', '#3B82F6', '#EF4444'] }]
  };

  receitaMensalData: ChartData<'line'> = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{ label: 'Receita', data: [30000, 40000, 50000, 48000, 60000, 70000], borderColor: '#3B82F6', fill: false }]
  };

  custosData: ChartData<'pie'> = {
    labels: ['Combustível', 'Manutenção', 'Pedágio', 'Impostos'],
    datasets: [{
      data: [40000, 25000, 15000, 40000],
      backgroundColor: ['#F59E0B', '#EF4444', '#3B82F6', '#10B981'] }]
  };

  // Ranking vendedores
  ranking = [
    { nome: 'Carlos', vendas: 50, receita: 120000, meta: 95 },
    { nome: 'Fernanda', vendas: 40, receita: 100000, meta: 88 },
    { nome: 'Lucas', vendas: 30, receita: 80000, meta: 80 }
  ];

  // Detalhamento fretes
  fretesDetalhados = [
    { origem: 'São Paulo', destino: 'Recife', motorista: 'Jean', vendedor: 'Carlos', status: 'Entregue', valor: 5000, lucro: 3200 },
    { origem: 'Goiânia', destino: 'Manaus', motorista: 'Maria', vendedor: 'Fernanda', status: 'Em trânsito', valor: 7500, lucro: 4800 },
    { origem: 'Curitiba', destino: 'Fortaleza', motorista: 'José', vendedor: 'Lucas', status: 'Em atraso', valor: 4200, lucro: 2700 }
  ];

  fretesColumns = [
    { header: 'Origem', field: 'origem' },
    { header: 'Destino', field: 'destino' },
    { header: 'Motorista', field: 'motorista' },
    { header: 'Vendedor', field: 'vendedor' },
    { header: 'Status', field: 'status', type: 'status' },
    { header: 'Valor', field: 'valor' },
    { header: 'Lucro', field: 'lucro' }
  ];

  // Exportação
  async exportPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Fretes - Univia', 14, 20);

    // Data
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 28);

    // Cards Resumo
    doc.setFontSize(12);
    doc.text('Resumo Geral:', 14, 38);
    autoTable(doc, {
      startY: 42,
      head: [['Total Fretes', 'Receita Total', 'Custos Operacionais', 'Lucro Líquido']],
      body: [[
        150,
        'R$ 320.000',
        'R$ 120.000',
        'R$ 200.000'
      ]]
    });

    // Gráficos como imagens
    let y = (doc as any).lastAutoTable.finalY + 15;

    // Fretes por Status
    doc.setFontSize(12);
    doc.text('Fretes por Status', 14, y - 2);
    const statusImg = this.statusChart.getImageBase64();
    if (statusImg) {
      doc.addImage(statusImg, 'PNG', 14, y, 80, 60);
    }

    // Receita Mensal
    doc.text('Receita Mensal', 110, y - 2);
    const receitaImg = this.receitaChart.getImageBase64();
    if (receitaImg) {
      doc.addImage(receitaImg, 'PNG', 110, y, 80, 60);
    }

    y += 70;

    // Distribuição de Custos (pizza)
    doc.text('Distribuição de Custos', 60, y - 2);
    const custosImg = this.custosChart.getImageBase64();
    if (custosImg) {
      doc.addImage(custosImg, 'PNG', 60, y, 80, 60);
      y += 70; // espaço extra
    }

    // Ranking de Vendedores
    doc.setFontSize(12);
    doc.text('Ranking de Vendedores:', 14, y + 10);
    autoTable(doc, {
      startY: y + 15,
      head: [['Vendedor', 'Vendas', 'Receita', 'Meta %']],
      body: this.ranking.map(v => [v.nome, v.vendas, `R$ ${v.receita}`, `${v.meta}%`])
    });

    // Detalhamento de Fretes
    y = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Detalhamento de Fretes:', 14, y);
    autoTable(doc, {
      startY: y + 5,
      head: [['Origem', 'Destino', 'Motorista', 'Vendedor', 'Status', 'Valor', 'Lucro']],
      body: this.fretesDetalhados.map(f =>
        [f.origem, f.destino, f.motorista, f.vendedor, f.status, `R$ ${f.valor}`, `R$ ${f.lucro}`]
      ),
      pageBreak: 'avoid',
    });


        // Rodapé com numeração
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10);
    }


    // Salvar
    doc.save(`relatorio-fretes-${new Date().toISOString().split('T')[0]}.pdf`);
  }


  exportExcel() {
    const wb = XLSX.utils.book_new();

    // Resumo Geral
    const resumo = [
      ['Total Fretes', 'Receita Total', 'Custos Operacionais', 'Lucro Líquido'],
      [150, 'R$ 320.000', 'R$ 120.000', 'R$ 200.000']
    ];
    const resumoSheet = XLSX.utils.aoa_to_sheet(resumo);
    XLSX.utils.book_append_sheet(wb, resumoSheet, 'Resumo');

    // Ranking Vendedores
    const rankingSheet = XLSX.utils.json_to_sheet(this.ranking);
    XLSX.utils.book_append_sheet(wb, rankingSheet, 'Ranking');

    // Fretes Detalhados
    const fretesSheet = XLSX.utils.json_to_sheet(this.fretesDetalhados);
    XLSX.utils.book_append_sheet(wb, fretesSheet, 'Fretes');

    // Salvar
    XLSX.writeFile(wb, `relatorio-fretes-${new Date().toISOString().split('T')[0]}.xlsx`);
  }



  gerarCurvaABC() {
    // 🔹 Dados fictícios de clientes
    const clientes = [
      { nome: 'Cliente X', receita: 120000 },
      { nome: 'Cliente Y', receita: 90000 },
      { nome: 'Cliente Z', receita: 50000 },
      { nome: 'Cliente W', receita: 20000 },
      { nome: 'Cliente V', receita: 10000 }
    ];

    clientes.sort((a, b) => b.receita - a.receita);

    const total = clientes.reduce((sum, c) => sum + c.receita, 0);

    let acumulado = 0;
    this.curvaABC = clientes.map(c => {
      const percentual = +(c.receita / total * 100).toFixed(1);
      acumulado += percentual;

      let classe = 'C';
      if (acumulado <= 80) classe = 'A';
      else if (acumulado <= 95) classe = 'B';

      return {
        nome: c.nome,
        receita: c.receita,
        percentual,
        acumulado: +acumulado.toFixed(1),
        classe
      };
    });

    // 🔹 Calcular resumo para cards
    this.classeAClientes = this.curvaABC.filter(c => c.classe === 'A').length;
    this.classeAReceita = this.curvaABC.filter(c => c.classe === 'A')
      .reduce((sum, c) => sum + c.percentual, 0);

    this.classeBClientes = this.curvaABC.filter(c => c.classe === 'B').length;
    this.classeBReceita = this.curvaABC.filter(c => c.classe === 'B')
      .reduce((sum, c) => sum + c.percentual, 0);

    this.classeCClientes = this.curvaABC.filter(c => c.classe === 'C').length;
    this.classeCReceita = this.curvaABC.filter(c => c.classe === 'C')
      .reduce((sum, c) => sum + c.percentual, 0);

      this.abcChartData = {
      labels: this.curvaABC.map(c => c.nome),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Receita',
          data: this.curvaABC.map(c => c.receita),
          backgroundColor: '#3B82F6',
          yAxisID: 'y'
        },
        {
          type: 'line' as const,
          label: '% Acumulado',
          data: this.curvaABC.map(c => c.acumulado),
          borderColor: '#F59E0B',
          backgroundColor: '#F59E0B',
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };
  }

}
