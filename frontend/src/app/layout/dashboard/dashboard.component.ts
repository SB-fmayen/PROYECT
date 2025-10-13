import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  isBrowser: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.userRole = user.role?.toLowerCase(); // Convertimos a minúscula para evitar errores
        } catch (error) {
          console.error('❌ Error al parsear usuario desde localStorage:', error);
        }
      }
    }
  }

  isEncargado(): boolean {
    return this.userRole === 'encargado';
  }

  isAnalista(): boolean {
    return this.userRole === 'analista';
  }

  isAdmin(): boolean {
    return this.userRole === 'administrador de sistema' || this.userRole === 'administrador';
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/']);
  }
}
