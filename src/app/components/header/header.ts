import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import RouterLink so the template can use it
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  // Add RouterLink to the imports array
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
})
export class HeaderComponent { }