import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  // Corrected the template path
  templateUrl: './footer.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}