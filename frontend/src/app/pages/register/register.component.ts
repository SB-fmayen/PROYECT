import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  register(): void {
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      this.successMessage = '';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Email no válido';
      this.successMessage = '';
      return;
    }

    this.loading = true;

    this.auth.register({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password.trim()
    }).subscribe({
      next: () => {
        this.successMessage = '🎉 Registro exitoso, redirigiendo...';
        this.errorMessage = '';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Error inesperado en el registro.';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }
}
