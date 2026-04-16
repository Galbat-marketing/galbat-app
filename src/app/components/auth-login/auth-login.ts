import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-login.html',
  styleUrls: ['./auth-login.scss']
})
export class AuthLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';
  isSignup = false;

  async onSubmit() {
    this.loading = true;
    this.error = '';

    if (this.isSignup) {
      const result = await this.authService.signup(this.email, this.password);
      if (result.success) {
        this.error = 'Cuenta creada. Por favor, revisa tu email para confirmar.';
        this.isSignup = false;
        this.password = '';
      } else {
        this.error = result.error || 'Error al crear la cuenta';
      }
    } else {
      const result = await this.authService.login(this.email, this.password);
      if (result.success) {
        this.router.navigate(['/admin/posts']);
      } else {
        this.error = result.error || 'Email o contraseña incorrectos';
      }
    }

    this.loading = false;
  }

  toggleSignup() {
    this.isSignup = !this.isSignup;
    this.error = '';
    this.password = '';
  }
}
