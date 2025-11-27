import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TheaterService, Theater } from '../../../core/services/theater.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-manage-theatres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-theatres.component.html',
  styleUrls: ['./manage-theatres.component.css']
})
export class ManageTheatresComponent implements OnInit {
  theatres = signal<Theater[]>([]);
  theatreForm: FormGroup;
  showForm = signal(false);
  loading = signal(false);
  submitting = signal(false);
  deletingId = signal<string | null>(null);
  statusUpdatingId = signal<string | null>(null);
  editingTheatreId = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private theaterService: TheaterService,
    private alertService: AlertService
  ) {
    this.theatreForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      location: ['', [Validators.required, Validators.maxLength(120)]],
      address: ['', [Validators.required, Validators.maxLength(400)]],
      totalScreens: [1, [Validators.required, Validators.min(1)]],
      imageUrl: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadTheatres();
  }

  loadTheatres(): void {
    this.loading.set(true);
    this.theaterService.getAllTheaters(false)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (theatres) => this.theatres.set(theatres),
        error: () => {
          this.alertService.error('Failed to load theaters. Please try again.');
        }
      });
  }

  addTheatre(): void {
    this.showForm.set(true);
    this.editingTheatreId.set(null);
    this.theatreForm.reset({
      name: '',
      location: '',
      address: '',
      totalScreens: 1,
      imageUrl: '',
      isActive: true
    });
  }

  editTheatre(theatre: Theater): void {
    this.showForm.set(true);
    this.editingTheatreId.set(theatre.id);
    this.theatreForm.patchValue({
      name: theatre.name,
      location: theatre.location,
      address: theatre.address,
      totalScreens: theatre.totalScreens ?? 1,
      imageUrl: theatre.imageUrl ?? '',
      isActive: theatre.isActive
    });
  }

  submitTheatre(): void {
    this.theatreForm.markAllAsTouched();
    if (this.theatreForm.invalid) {
      return;
    }

    const payload = this.theatreForm.value;
    this.submitting.set(true);

    const editId = this.editingTheatreId();
    const request$ = editId
      ? this.theaterService.updateTheater(editId, payload)
      : this.theaterService.createTheater(payload);

    request$
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.alertService.success(`Theater ${editId ? 'updated' : 'created'} successfully`);
          this.closeForm();
          this.loadTheatres();
        },
        error: () => {
          this.alertService.error('Unable to save theater. Please check the details and try again.');
        }
      });
  }

  toggleStatus(theatre: Theater): void {
    this.statusUpdatingId.set(theatre.id);
    this.theaterService.updateTheaterStatus(theatre.id, !theatre.isActive)
      .pipe(finalize(() => this.statusUpdatingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.alertService.success(`Theater ${updated.isActive ? 'activated' : 'deactivated'} successfully`);
          this.theatres.update(theatres => theatres.map(t => t.id === updated.id ? updated : t));
        },
        error: () => {
          this.alertService.error('Unable to update status. Please try again.');
        }
      });
  }

  deleteTheatre(theatre: Theater): void {
    if (!confirm(`Delete ${theatre.name}? This action cannot be undone.`)) {
      return;
    }

    this.deletingId.set(theatre.id);
    this.theaterService.deleteTheater(theatre.id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.alertService.success('Theater deleted successfully');
          this.theatres.update(theatres => theatres.filter(t => t.id !== theatre.id));
        },
        error: () => {
          this.alertService.error('Unable to delete theater. Please try again.');
        }
      });
  }

  cancelForm(): void {
    this.closeForm();
  }

  private closeForm(): void {
    this.showForm.set(false);
    this.editingTheatreId.set(null);
    this.theatreForm.reset();
  }

  isInvalid(controlName: string): boolean {
    const control = this.theatreForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  trackByTheatreId(index: number, theatre: Theater): string {
    return theatre.id;
  }

  onImageError(event: Event, theatre: Theater): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://via.placeholder.com/80x80/667eea/ffffff?text=${encodeURIComponent(theatre.name.charAt(0))}`;
  }
}
