import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    name: 'John Doe',
    email: 'user@revticket.com',
    avatar: 'assets/images/users/default-avatar.svg',
    joinDate: new Date('2023-01-15')
  };

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  activeTab = 'personal';
  loading = false;

  availableGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  
  preferences = {
    language: 'english',
    favoriteGenres: ['Action', 'Sci-Fi'],
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserData();
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      dateOfBirth: [''],
      gender: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = {
        name: currentUser.name || 'Test User',
        email: currentUser.email || 'user@revticket.com',
        avatar: 'assets/images/users/default-avatar.svg',
        joinDate: currentUser.createdAt || new Date('2023-01-15')
      };
      this.profileForm.patchValue(this.user);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/users/default-avatar.svg';
  }

  changeAvatar(): void {
    this.alertService.info('Avatar change feature coming soon!');
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.alertService.success('Profile updated successfully!');
        this.loading = false;
      }, 1000);
    }
  }

  isGenreSelected(genre: string): boolean {
    return this.preferences.favoriteGenres.includes(genre);
  }

  toggleGenre(genre: string): void {
    const index = this.preferences.favoriteGenres.indexOf(genre);
    if (index > -1) {
      this.preferences.favoriteGenres.splice(index, 1);
    } else {
      this.preferences.favoriteGenres.push(genre);
    }
  }

  updatePreferences(): void {
    this.alertService.success('Preferences updated successfully!');
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
      
      if (newPassword !== confirmPassword) {
        this.alertService.error('Passwords do not match!');
        return;
      }

      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.alertService.success('Password changed successfully!');
        this.passwordForm.reset();
        this.loading = false;
      }, 1000);
    }
  }
}