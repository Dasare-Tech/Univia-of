import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ReplacePipe } from '../../core/pipes/replacePipe';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-motoristas',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    ReplacePipe,
    ReactiveFormsModule
  ],
  templateUrl: './motoristas.html',
  styleUrls: ['./motoristas.scss']
})
export class Motoristas {
driverForm: FormGroup;

  drivers = [
    { nome: 'Jean da Silva', documento: '123456', veiculo: 'ABC-1234', contato: '1199999999', cnh: '987654321', disponibilidade: 'Disponível', endereco: 'São Paulo - SP', contaBancaria: 'Banco 001 - Ag. 1234 - Cc. 56789-0' },
    { nome: 'Maria Souza', documento: '654321', veiculo: 'DEF-5678', contato: '6298888888', cnh: '123123123', disponibilidade: 'Em frete', endereco: 'Goiânia - GO', contaBancaria: 'Banco 341 - Ag. 5678 - Cc. 98765-4' },
    { nome: 'José Ribeiro', documento: '789123', veiculo: 'GHI-9012', contato: '8197777777', cnh: '456456456', disponibilidade: 'Inativo', endereco: 'Recife - PE', contaBancaria: 'Banco 104 - Ag. 2222 - Cc. 33333-1' },
  ];

  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.driverForm = this.fb.group({
      nome: ['', Validators.required],
      documento: ['', Validators.required],
      veiculo: ['', Validators.required],
      contato: ['', Validators.required],
      cnh: ['', Validators.required],
      disponibilidade: ['Disponível', Validators.required],
      endereco: ['', Validators.required],
      contaBancaria: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.driverForm.valid) {
      if (this.editingIndex !== null) {
        // Atualiza motorista existente
        this.drivers[this.editingIndex] = this.driverForm.value;
        this.editingIndex = null;
      } else {
        // Adiciona novo motorista
        this.drivers.push(this.driverForm.value);
      }
      this.driverForm.reset({ disponibilidade: 'Disponível' });
    }
  }

  editDriver(index: number) {
    this.driverForm.patchValue(this.drivers[index]);
    this.editingIndex = index;
  }

  deleteDriver(index: number) {
    this.drivers.splice(index, 1);
    if (this.editingIndex === index) {
      this.driverForm.reset({ disponibilidade: 'Disponível' });
      this.editingIndex = null;
    }
  }
}
