import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  error = '';
  returnUrl = '/todos';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/todos']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/todos';
  }

  onSubmit(): void {
    this.error = '';
    
    // Validate inputs
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        if (response.success && response.access_token) {
          console.log('Token saved, navigating to:', this.returnUrl);
          // Small delay to ensure token is saved
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 100);
        } else {
          this.error = 'Login failed. Please try again.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
