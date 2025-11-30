import { Component, Input, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../core/models/booking.model';
import * as QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-e-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './e-ticket.component.html',
  styleUrls: ['./e-ticket.component.css']
})
export class ETicketComponent implements OnInit, AfterViewInit {
  @Input() booking!: Booking;
  @ViewChild('ticketContent', { static: false }) ticketContent!: ElementRef;
  
  qrCodeDataUrl: string = '';
  private alertService = inject(AlertService);

  ngOnInit(): void {
    if (this.booking) {
      this.generateQRCode();
    }
  }

  ngAfterViewInit(): void {
    // Ensure QR is generated after view is ready
    if (!this.qrCodeDataUrl && this.booking) {
      setTimeout(() => this.generateQRCode(), 100);
    }
  }

  async generateQRCode(): Promise<void> {
    try {
      // Simple booking ID for faster generation
      const qrData = `REVTICKET:${this.booking.id}`;
      
      this.qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('QR Code generation failed:', error);
      this.qrCodeDataUrl = '';
    }
  }

  getSeatDisplay(): string {
    if (this.booking.seatLabels && this.booking.seatLabels.length > 0) {
      return this.booking.seatLabels.join(', ');
    }
    return this.booking.seats?.join(', ') || 'N/A';
  }

  formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  async downloadPDF(): Promise<void> {
    try {
      this.alertService.info('Generating PDF...');
      
      const element = this.ticketContent.nativeElement;
      const originalHeight = element.style.height;
      
      // Force full height for capture
      element.style.height = 'auto';
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowHeight: element.scrollHeight + 100
      });
      
      // Restore original height
      element.style.height = originalHeight;

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      let position = 0;
      let heightLeft = imgHeight;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`RevTicket_${this.booking.ticketNumber || this.booking.id}.pdf`);
      this.alertService.success('Ticket downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      this.alertService.error('Failed to download PDF. Please try again.');
    }
  }

  async shareTicket(): Promise<void> {
    const shareData = {
      title: `Movie Ticket - ${this.booking.movieTitle}`,
      text: `🎬 ${this.booking.movieTitle}\n🏢 ${this.booking.theaterName}\n📅 ${this.formatDateTime(this.booking.showtime)}\n💺 ${this.getSeatDisplay()}\n🎫 Ticket: ${this.booking.ticketNumber}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        this.alertService.success('Ticket shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          this.copyToClipboard();
        }
      }
    } else {
      this.copyToClipboard();
    }
  }

  private copyToClipboard(): void {
    const text = `🎬 ${this.booking.movieTitle}\n🏢 ${this.booking.theaterName}\n📅 ${this.formatDateTime(this.booking.showtime)}\n💺 ${this.getSeatDisplay()}\n🎫 ${this.booking.ticketNumber}`;
    
    navigator.clipboard.writeText(text).then(() => {
      this.alertService.success('Ticket details copied to clipboard!');
    }).catch(() => {
      this.alertService.error('Failed to copy ticket details.');
    });
  }

  printTicket(): void {
    window.print();
  }
}
