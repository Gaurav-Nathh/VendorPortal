import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { passwordModel, PasswordService } from '../../services/shared/password-service/password.service';
import Swal from 'sweetalert2';






@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class UpdatePasswordComponent {
  

 currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private passwordService: PasswordService) {}

  getPasswordStrength(): number {
    let strength = 0;
    if (this.newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(this.newPassword)) strength++;
    if (/\d/.test(this.newPassword)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword)) strength++;
    return strength;
  }

  getPasswordStrengthText(): string {
    switch (this.getPasswordStrength()) {
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Very Weak';
    }
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
  }

  isFormValid(): boolean {
    return (
      this.currentPassword.trim() !== '' &&
      this.newPassword.trim() !== '' &&
      this.confirmPassword.trim() !== '' &&
      this.newPassword === this.confirmPassword &&
      this.getPasswordStrength() >= 3
    );
  }

 onSubmit(): void {
  if (!this.isFormValid()) return;

  const model = new passwordModel();
  model.OldPassword = this.currentPassword;
  model.NewPassword = this.newPassword;

  const userId = sessionStorage.getItem('userId');
  if (userId) {
    model.Id = +userId;
  } else {
    Swal.fire('Error', 'User ID not found. Please login again.', 'error');
    return;
  }

  this.passwordService.changePassword(model).subscribe({
    next: (res: any) => {
      if (res?.Detail?.errorCode === -1) {
        // API returned a failure despite 200 status
        Swal.fire('Failed', res.Detail.Message || 'Password update failed.', 'error');
      } else {
        // Successful password change
        Swal.fire('Success', 'Password updated successfully', 'success');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      }
    },
    error: (err: any) => {
      console.error('Error updating password', err);

      const errorMessage = err?.error?.Detail?.Message || 'Something went wrong. Please try again.';
      Swal.fire('Error', errorMessage, 'error');

      // Clear input fields
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  });
}



checkPasswordStrength(): void {
  // Angular automatically handles change detection,
  // but calling getPasswordStrength() ensures consistency.
  this.getPasswordStrength();
}


}
