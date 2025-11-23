import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { SeatService } from '../../../core/services/seat.service';
import { Seat, SeatLayout, SeatAvailability } from '../../../core/models/seat.model';

@Component({
  selector: 'app-seat-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seat-selector">
      <div class="screen">SCREEN</div>
      
      <div class="seat-legend">
        <div class="legend-item">
          <div class="seat available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="seat selected"></div>
          <span>Selected</span>
        </div>
        <div class="legend-item">
          <div class="seat booked"></div>
          <span>Booked</span>
        </div>
        <div class="legend-item">
          <div class="seat premium"></div>
          <span>Premium (₹200)</span>
        </div>
        <div class="legend-item">
          <div class="seat vip"></div>
          <span>VIP (₹300)</span>
        </div>
      </div>

      <div class="seats-container" *ngIf="seatLayout">
        <div class="seat-row" *ngFor="let row of seatLayout.rows; let rowIndex = index">
          <div class="row-label">{{row}}</div>
          <div class="seats">
            <div 
              *ngFor="let seat of getSeatsForRow(row)"
              class="seat"
              [class.available]="!seat.isBooked && !isSelected(seat.id)"
              [class.selected]="isSelected(seat.id)"
              [class.booked]="seat.isBooked"

              [class.premium]="seat.type === 'PREMIUM'"
              [class.vip]="seat.type === 'VIP'"
              (click)="toggleSeat(seat)"
              [title]="getSeatTooltip(seat)">
              {{seat.number}}
            </div>
          </div>
        </div>
      </div>


    </div>
  `,
  styles: [`
    .seat-selector { 
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .screen { 
      background: linear-gradient(to bottom, #333, #666);
      color: white;
      text-align: center;
      padding: 15px;
      margin: 0 auto 40px;
      border-radius: 50px 50px 0 0;
      width: 60%;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .seat-legend {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .seats-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .seat-row {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .row-label {
      width: 25px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      color: #666;
    }
    .seats {
      display: flex;
      gap: 8px;
    }
    .seat {
      width: 35px;
      height: 35px;
      border: 2px solid #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s ease;
    }
    .seat:hover:not(.booked):not(.held) {
      transform: scale(1.1);
    }
    .seat.available { 
      background: #f8f9fa;
      border-color: #28a745;
      color: #28a745;
    }
    .seat.available:hover {
      background: #28a745;
      color: white;
    }
    .seat.premium:not(.selected) {
      border-color: #6f42c1;
      color: #6f42c1;
    }
    .seat.premium:not(.selected):hover {
      background: #6f42c1;
      color: white;
    }
    .seat.vip:not(.selected) {
      border-color: #dc3545;
      color: #dc3545;
    }
    .seat.vip:not(.selected):hover {
      background: #dc3545;
      color: white;
    }
    .seat.selected { 
      background: #007bff !important;
      color: white !important;
      border-color: #007bff !important;
      transform: scale(1.1);
    }
    .seat.selected.premium,
    .seat.selected.vip,
    .seat.selected.regular {
      background: #007bff !important;
      color: white !important;
      border-color: #007bff !important;
    }
    .seat.booked { 
      background: #dc3545 !important;
      color: white !important;
      border-color: #dc3545 !important;
      cursor: not-allowed;
      opacity: 0.7;
    }
    .seat.booked.premium,
    .seat.booked.vip,
    .seat.booked.regular {
      background: #dc3545 !important;
      color: white !important;
      border-color: #dc3545 !important;
    }

    .seat.premium { 
      background: #fff3cd;
      border-color: #856404;
      color: #856404;
    }
    .seat.premium.available:hover {
      background: #856404;
      color: white;
    }
    .seat.vip { 
      background: #f8d7da;
      border-color: #721c24;
      color: #721c24;
    }
    .hold-timer {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(220,53,69,0.3);
      font-weight: bold;
    }
    .hold-timer button {
      background: white;
      color: #dc3545;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      margin-left: 10px;
      cursor: pointer;
      font-size: 12px;
    }
  `]
})
export class SeatSelectorComponent implements OnInit, OnDestroy {
  @Input() showtimeId!: string;
  @Output() seatsSelected = new EventEmitter<string[]>();
  @Output() totalAmountChanged = new EventEmitter<number>();

  seatLayout: SeatLayout | null = null;
  selectedSeats: string[] = [];
  holdExpiry: Date | null = null;
  timeRemaining = 0;
  
  private holdTimer?: Subscription;
  private availabilityTimer?: Subscription;

  constructor(private seatService: SeatService) {}

  ngOnInit(): void {
    this.loadSeatLayout();
    this.startAvailabilityPolling();
  }

  ngOnDestroy(): void {
    this.holdTimer?.unsubscribe();
    this.availabilityTimer?.unsubscribe();
    if (this.selectedSeats.length > 0) {
      this.seatService.releaseSeats(this.showtimeId, this.selectedSeats).subscribe();
    }
  }

  loadSeatLayout(): void {
    this.seatService.getSeatLayout(this.showtimeId).subscribe(layout => {
      this.seatLayout = layout;
    });
  }

  startAvailabilityPolling(): void {
    this.availabilityTimer = interval(5000).subscribe(() => {
      this.seatService.getRealTimeAvailability(this.showtimeId).subscribe(availability => {
        this.updateSeatAvailability(availability);
      });
    });
  }

  updateSeatAvailability(availability: SeatAvailability[]): void {
    if (!this.seatLayout) return;
    
    availability.forEach(avail => {
      const seat = this.seatLayout!.seats.find(s => s.id === avail.seatId);
      if (seat) {
        seat.isBooked = !avail.isAvailable;
        seat.isHeld = avail.isHeld && avail.heldBy !== this.getSessionId();
      }
    });
  }

  getSeatsForRow(row: string): Seat[] {
    return this.seatLayout?.seats.filter(seat => seat.row === row) || [];
  }

  toggleSeat(seat: Seat): void {
    if (seat.isBooked) return;

    const isCurrentlySelected = this.isSelected(seat.id);
    
    if (isCurrentlySelected) {
      this.selectedSeats = this.selectedSeats.filter(id => id !== seat.id);
    } else {
      this.selectedSeats.push(seat.id);
    }

    this.seatsSelected.emit(this.selectedSeats);
    this.totalAmountChanged.emit(this.calculateTotal());
  }

  isSelected(seatId: string): boolean {
    return this.selectedSeats.includes(seatId);
  }

  calculateTotal(): number {
    return this.selectedSeats.reduce((total, seatId) => {
      const seat = this.seatLayout?.seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  }

  getSeatTooltip(seat: Seat): string {
    if (seat.isBooked) return 'Seat is booked';
    return `${seat.type} - ₹${seat.price}`;
  }

  startHoldTimer(): void {
    this.holdTimer?.unsubscribe();
    this.holdTimer = interval(1000).subscribe(() => {
      if (this.holdExpiry) {
        this.timeRemaining = Math.max(0, Math.floor((this.holdExpiry.getTime() - Date.now()) / 1000));
        if (this.timeRemaining === 0) {
          this.selectedSeats = [];
          this.holdExpiry = null;
          this.seatsSelected.emit([]);
          this.totalAmountChanged.emit(0);
        }
      }
    });
  }

  extendHold(): void {
    if (this.selectedSeats.length > 0) {
      this.seatService.extendSeatHold(this.showtimeId, this.selectedSeats).subscribe(() => {
        this.holdExpiry = new Date(Date.now() + 10 * 60 * 1000);
      });
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'anonymous';
  }
}