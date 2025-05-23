import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']

})
export class DashboardComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }

  toggleSection(section: string) {
    const currentPath = `/dashboard/${section}`;
    if (this.router.url === currentPath) {
      const el = document.querySelector(`app-${section}`);
      if (el) {
        el.dispatchEvent(new CustomEvent(`toggle${section}Table`, { bubbles: true }));
      }
    } else {
      this.router.navigate([currentPath]);
    }
  }
}
