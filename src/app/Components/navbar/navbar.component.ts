import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path based on your project structure

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}