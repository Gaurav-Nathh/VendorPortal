import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { SessionServiceService } from './services/session-service.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private sessionService: SessionServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const email = sessionStorage.getItem('UsrEmail') || '';
    const domain = email.split('@')[1];

    this.authService.resolveDomain(domain).subscribe({
      next: (response) => {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
          this.sessionService.startSession();
        }
      },
      error: (error) => {},
    });
  }
}
