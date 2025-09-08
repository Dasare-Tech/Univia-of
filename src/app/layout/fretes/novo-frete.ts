import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ReplacePipe } from '../../core/pipes/replacePipe';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-novo-frete',
  imports: [
    CommonModule,
    Sidebar,
    ReplacePipe,
    ReactiveFormsModule
  ],
  templateUrl: './novo-frete.html',
  styleUrls: ['./novo-frete.scss']
})
export class NovoFrete {
 freteForm: FormGroup;

  fretes: any[] = [];

  motoristas = ['Jean da Silva', 'Maria Souza', 'José Ribeiro'];
  veiculos = ['Van 01', 'Caminhão 02', 'Moto 03'];
  clientes = ['Cliente A', 'Cliente B', 'Cliente C'];

  editingIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.freteForm = this.fb.group({
      origem: ['', Validators.required],
      destino: ['', Validators.required],
      motorista: ['', Validators.required],
      veiculo: ['', Validators.required],
      dataSaida: ['', Validators.required],
      cliente: ['', Validators.required],
      previsaoEntrega: ['', Validators.required],
      status: ['Em coleta', Validators.required],
      valor: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.freteForm.valid) {
      if (this.editingIndex !== null) {
        this.fretes[this.editingIndex] = this.freteForm.value;
        this.editingIndex = null;
      } else {
        this.fretes.push(this.freteForm.value);
      }
      this.freteForm.reset({ status: 'Em coleta' });
    }
  }

  editFrete(index: number) {
    this.freteForm.patchValue(this.fretes[index]);
    this.editingIndex = index;
  }

  deleteFrete(index: number) {
    this.fretes.splice(index, 1);
    if (this.editingIndex === index) {
      this.freteForm.reset({ status: 'Em coleta' });
      this.editingIndex = null;
    }
  }
}
