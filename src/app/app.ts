import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Import our new standalone components
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  // Corrected the template and style paths
  templateUrl: './app.html',
  styleUrl: './app.css'
})
// Renamed class to 'App' to match the import in main.ts
export class App {
  title = 'verdicta';
}