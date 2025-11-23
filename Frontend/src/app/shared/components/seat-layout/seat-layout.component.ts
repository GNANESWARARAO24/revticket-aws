import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-layout.component.html',
  styleUrls: ['./seat-layout.component.css']
})
export class SeatLayoutComponent {
  @Input() totalSeats = 50;
  @Output() seatsSelected = new EventEmitter<string[]>();
  
  seatRows: any[][] = [];

  constructor() {
    this.generateSeats();
  }

  generateSeats(): void {
    const seatsPerRow = 10;
    const rows = Math.ceil(this.totalSeats / seatsPerRow);
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < seatsPerRow && (i * seatsPerRow + j) < this.totalSeats; j++) {
        row.push({
          id: `${this.getRowLabel(i)}${j + 1}`,
          selected: false,
          booked: Math.random() < 0.3
        });
      }
      this.seatRows.push(row);
    }
  }

  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.seatRows[rowIndex][seatIndex];
    if (!seat.booked) {
      seat.selected = !seat.selected;
      this.emitSelectedSeats();
    }
  }

  emitSelectedSeats(): void {
    const selected: string[] = [];
    this.seatRows.forEach(row => {
      row.forEach(seat => {
        if (seat.selected) {
          selected.push(seat.id);
        }
      });
    });
    this.seatsSelected.emit(selected);
  }
}