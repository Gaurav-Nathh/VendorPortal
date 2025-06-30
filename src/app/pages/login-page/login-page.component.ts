import { NgClass, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { SessionServiceService } from '../../services/session-service.service';
import { LoadingService } from '../../services/shared/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    ThemeToggleComponent,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loginModel = {
    userName: '',
    password: '',
  };
  userType: string = '';
  hidePassword: boolean = true;
  showPasswordField = false;

  images = [
    {
      src: '/assets/images/vendor_loginpage_img_1.svg',
      text: 'Welcome to our platform!',
    },
    {
      src: '/assets/images/vendor_loginpage_img_2.svg',
      text: 'Enjoy the best experience!',
    },
  ];

  currentImage = 0;
  progress = 50;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private userService: UserService,
    private sessionService: SessionServiceService,
    public loadingServie: LoadingService,
    private router: Router
  ) {
    setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;

  nextStep() {
    this.showPasswordField = true;
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.authService.login(this.loginModel).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.sessionService.startSession();
          this.userType = this.userService.getUserType();
          switch (this.userType) {
            case 'Customer':
              this.router.navigate(['/customer']);
              break;
            case 'Vendor':
              this.router.navigate(['/vendor']);
              break;
            case 'System':
              this.router.navigate(['/master']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        }
      },
      error: (error) => {},
    });
  }

  nextSlide() {
    this.currentImage = (this.currentImage + 1) % this.images.length;
    this.progress = (this.currentImage + 1) * 50;
  }
}
