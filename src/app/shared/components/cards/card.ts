import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [
    CommonModule
  ],
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {

  @Input() title!: string;
  @Input() value!: string | number;
  @Input() align: 'center' | 'left' = 'center'; // novo

}
