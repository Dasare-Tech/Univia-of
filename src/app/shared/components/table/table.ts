import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplacePipe } from '../../../core/pipes/replacePipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    ReplacePipe
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: { header: string, field?: string, type?: string, label?: string }[] = [];

  // Compatibilidade: single-field filter ou busca global (search)
  @Input() showTotals: boolean = false;
  @Input() filter: { field: string, value: string } | null = null; // filtro único por campo (legado)
  @Input() search: string | null = null; // busca global (procura em várias colunas)
  @Input() searchFields?: string[]; // lista de campos a procurar (opcional)

  filteredData: any[] = [];
  totals: Record<string, number> = {};

  ngOnChanges(changes: SimpleChanges) {
    this.applyFilter();
  }

  applyFilter() {
    const src = Array.isArray(this.data) ? this.data : [];
    let result = src;

    // filtro legado por campo
    if (this.filter && this.filter.field && this.filter.value) {
      const q = this.filter.value.toLowerCase();
      result = src.filter(item => String(item[this.filter!.field] ?? '').toLowerCase().includes(q));
    }
    // busca global em múltiplos campos
    else if (this.search && this.search.trim() !== '') {
      const q = this.search.trim().toLowerCase();
      const fields = (this.searchFields && this.searchFields.length)
        ? this.searchFields
        : this.columns.map(c => c.field).filter(Boolean) as string[];
      result = src.filter(item =>
        fields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
      );
    }

    this.filteredData = result;
    this.calculateTotals();
  }

  calculateTotals() {
    this.totals = {};
    for (const col of this.columns) {
      if (typeof col.field !== 'string') continue;

      const sum = this.filteredData.reduce((acc, item) => {
        const value = item[col.field as string];
        const n = this.parseNumber(value);
        return acc + (isNaN(n) ? 0 : n);
      }, 0);

      this.totals[col.field] = sum;
    }
  }


  // converte strings como 'R$ 1.200,00' ou '1200.50' pra number
  parseNumber(value: any): number {
    if (value === null || value === undefined) return NaN;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      let s = value.trim();
      // remove tudo menos dígitos, ponto e vírgula e sinal
      s = s.replace(/[^\d\-,.]/g, '');
      if (s === '') return NaN;

      // se tiver '.' e ',' -> assume '.' milhares e ',' decimal -> remover '.' e trocar ',' por '.'
      if (s.indexOf('.') > -1 && s.indexOf(',') > -1) {
        s = s.replace(/\./g, '').replace(/,/g, '.');
      } else if (s.indexOf(',') > -1 && s.indexOf('.') === -1) {
        // '1234,56' -> '1234.56'
        s = s.replace(/,/g, '.');
      }
      const num = Number(s);
      return isNaN(num) ? NaN : num;
    }
    return NaN;
  }

  // formata moeda BRL de forma consistente
  formatCurrency(value: any): string {
    const n = this.parseNumber(value);
    if (isNaN(n)) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }

  isCurrencyColumn(col: any): boolean {
    if (!col) return false;
    if (col.type && col.type.toLowerCase() === 'currency') return true;
    if (col.field && /^(amount|valor|price|total)$/i.test(col.field)) return true;
    return false;
  }

  getColumnTotal(field?: string): number {
    if (!field) return 0;
    return this.totals[field] ?? 0;
  }
}
