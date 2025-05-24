// navbar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService, public router: Router) {}

  isApprenant(): boolean {
    return this.authService.isLoggedIn() && this.authService.isApprenant();
  }

  logout(): void {
    this.authService.logout();
  }
}