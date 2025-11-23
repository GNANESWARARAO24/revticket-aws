import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent {
  @Output() dateSelected = new EventEmitter<Date>();
  selectedIndex = 0;
  dates: any[] = [];

  constructor() {
    this.generateDates();
  }

  generateDates(): void {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.dates.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date
      });
    }
  }

  selectDate(index: number): void {
    this.selectedIndex = index;
    this.dateSelected.emit(this.dates[index].fullDate);
  }
}