import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']); // Navigate to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}