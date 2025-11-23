import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-theatres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-theatres.component.html',
  styleUrls: ['./manage-theatres.component.css']
})
export class ManageTheatresComponent implements OnInit {
  theatres: any[] = [];
  theatreForm: FormGroup;
  showForm = false;
  editingTheatre: any = null;

  constructor(private fb: FormBuilder) {
    this.theatreForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      address: ['', [Validators.required]],
      totalScreens: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadTheatres();
  }

  loadTheatres(): void {
    this.theatres = [
      { id: 1, name: 'PVR Cinemas', location: 'Mumbai', address: 'Phoenix Mall, Mumbai', totalScreens: 8, isActive: true, imageUrl: 'assets/images/theaters/PVR.png' },
      { id: 2, name: 'INOX', location: 'Delhi', address: 'Select City Walk, Delhi', totalScreens: 6, isActive: true, imageUrl: 'assets/images/theaters/inox.png' },
      { id: 3, name: 'Cinepolis', location: 'Bangalore', address: 'Forum Mall, Bangalore', totalScreens: 5, isActive: false, imageUrl: 'assets/images/theaters/cinepolis.png' }
    ];
  }

  addTheatre(): void {
    this.showForm = true;
    this.editingTheatre = null;
    this.theatreForm.reset();
  }

  editTheatre(theatre: any): void {
    this.showForm = true;
    this.editingTheatre = theatre;
    this.theatreForm.patchValue(theatre);
  }

  onSubmit(): void {
    if (this.theatreForm.valid) {
      const formData = this.theatreForm.value;
      
      if (this.editingTheatre) {
        const index = this.theatres.findIndex(t => t.id === this.editingTheatre.id);
        this.theatres[index] = { ...this.editingTheatre, ...formData };
      } else {
        const newTheatre = {
          id: Date.now(),
          ...formData,
          isActive: true
        };
        this.theatres.push(newTheatre);
      }
      
      this.showForm = false;
      this.theatreForm.reset();
    }
  }

  toggleStatus(theatre: any): void {
    theatre.isActive = !theatre.isActive;
  }

  cancelForm(): void {
    this.showForm = false;
    this.theatreForm.reset();
  }

  onImageError(event: any, theatre: any): void {
    event.target.src = 'https://via.placeholder.com/80x80/667eea/ffffff?text=' + encodeURIComponent(theatre.name.charAt(0));
  }
}