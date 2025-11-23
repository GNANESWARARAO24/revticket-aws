import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentMethod = 'card';
  cardForm: FormGroup;
  upiForm: FormGroup;
  processing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(2024)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: ['', Validators.required]
    });

    this.upiForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]]
    });
  }

  onPaymentMethodChange(method: string): void {
    this.paymentMethod = method;
  }

  processPayment(): void {
    let isValid = false;
    
    if (this.paymentMethod === 'card') {
      isValid = this.cardForm.valid;
    } else if (this.paymentMethod === 'upi') {
      isValid = this.upiForm.valid;
    } else {
      isValid = true; // For wallet payments
    }

    if (isValid) {
      this.processing = true;
      setTimeout(() => {
        this.router.navigate(['/user/success', 'booking-123']);
      }, 2000);
    }
  }
}