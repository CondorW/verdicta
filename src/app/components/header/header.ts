import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  // Corrected the template path
  templateUrl: './header.html',
})
export class HeaderComponent {
  // We can add properties and methods here later
  // for things like user login status.
}