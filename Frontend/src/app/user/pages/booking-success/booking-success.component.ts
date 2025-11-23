import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {
  booking = {
    id: 'BK001',
    movie: { title: 'Avengers: Endgame' },
    theater: { name: 'PVR Cinemas' },
    screen: 'Screen 1',
    showtime: new Date(),
    seats: ['A1', 'A2'],
    ticketPrice: 200,
    convenienceFee: 50,
    gst: 25,
    totalAmount: 475
  };

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Get booking data from route or service
  }

  downloadTicket(): void {
    this.alertService.success('Ticket downloaded successfully!');
  }

  sendToEmail(): void {
    this.alertService.success('Ticket sent to email successfully!');
  }
}