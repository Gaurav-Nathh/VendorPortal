import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { SessionServiceService } from './services/session-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private sessionService: SessionServiceService) {}

  ngOnInit(): void {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      this.sessionService.startSession();
    }
  }
}
