import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // check login status and role from localStorage
  get loggedIn() { 
    return !!localStorage.getItem('role'); 
  }

  get isAdmin() { 
    return localStorage.getItem('role') === 'admin'; 
  }

  logout() { 
    localStorage.removeItem('role'); 
  }
}
