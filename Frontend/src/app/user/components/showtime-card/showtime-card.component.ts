import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Showtime } from '../../../core/models/movie.model';

@Component({
  selector: 'app-showtime-card',
  templateUrl: './showtime-card.component.html',
  styleUrls: ['./showtime-card.component.css']
})
export class ShowtimeCardComponent {
  @Input() showtime!: Showtime;
  @Output() selected = new EventEmitter<Showtime>();

  onSelect(): void {
    this.selected.emit(this.showtime);
  }
}