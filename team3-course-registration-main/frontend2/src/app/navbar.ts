import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  constructor(private auth: AuthService) {}

  get loggedIn() {
    return this.auth.isLoggedIn();
  }

  get isAdmin() {
    return this.auth.getRole() === 'admin';
  }

  logout() {
    this.auth.logout();   // this will navigate to /login
  }
}
