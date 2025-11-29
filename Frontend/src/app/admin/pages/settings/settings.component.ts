import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Admin Settings</h1>
      <p>Configure application settings and preferences</p>
      <div class="coming-soon">
        <p>⚙️ This feature is coming soon!</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 32px;
    }
    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 8px 0;
    }
    p {
      color: #9ca3af;
      margin: 0 0 32px 0;
    }
    .coming-soon {
      background: #fff;
      border-radius: 16px;
      padding: 80px 20px;
      text-align: center;
    }
    .coming-soon p {
      font-size: 1.5rem;
      color: #667eea;
      margin: 0;
    }
  `]
})
export class SettingsComponent {}
