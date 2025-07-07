import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, ThemeToggleComponent, RouterLink, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  loginModel = {
    email: '',
  };

  constructor() {}

  onSubmit() {
    console.log(this.loginModel.email);
  }
}
