import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/components/sidebar/sidebar';


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar
  ],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.scss']
})
export class Clientes {
  clientes = [
    { nome: 'Empresa A', documento: '12.345.678/0001-99', telefone: '(11) 99999-9999', email: 'contato@a.com', endereco: 'Rua X, 123 - SP', regiao: 'Sudeste' },
    { nome: 'Empresa B', documento: '98.765.432/0001-11', telefone: '(21) 98888-8888', email: 'contato@b.com', endereco: 'Av. Y, 456 - RJ', regiao: 'Sudeste' }
  ];

  novoCliente: any = {};

  salvarCliente() {
    if (this.novoCliente.nome && this.novoCliente.documento) {
      this.clientes.push({ ...this.novoCliente });
      this.novoCliente = {};
    }
  }

  editarCliente(index: number) {
    this.novoCliente = { ...this.clientes[index] };
    this.clientes.splice(index, 1);
  }

  excluirCliente(index: number) {
    this.clientes.splice(index, 1);
  }
}


