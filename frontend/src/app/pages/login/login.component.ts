import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('✅ Login exitoso:', res);

        if (res.token) {
          this.auth.saveToken(res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          // ✅ Redirige a /dashboard/usuarios (corregido)
          this.router.navigate(['/dashboard/users']);
        } else {
          this.errorMessage = 'Token no recibido del servidor.';
        }
      },
      error: (err) => {
        console.error('❌ Login fallido:', err);
        this.errorMessage = err.error?.error || 'Credenciales inválidas';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
