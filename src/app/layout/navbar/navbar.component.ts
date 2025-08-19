import { CommonModule, NgFor } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { SharedService } from '../../services/shared/shared.service';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/shared/user-service/user.service';
import { User } from '../../Models/Common/user.model';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [ThemeToggleComponent, FormsModule],
})
export class NavbarComponent implements OnInit {
  isSidebarVisible: boolean = true;
  greeting: string = '';
  userType: string = '';
  user: User | null = null;
  navItems: NavItem[] = [
    { icon: 'bi-house', label: 'Home', route: '/home' },
    { icon: 'bi-person', label: 'Profile', route: '/profile' },
    { icon: 'bi-gear', label: 'Settings', route: '/settings' },
    { icon: 'bi-box-arrow-right', label: 'Logout', route: '/logout' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private sidebarService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.userService.user$.subscribe((user) => {
    //   this.userType = user?.UsrType ?? '';
    // });
    this.userType = this.userService._user?.UsrType ?? '';
    this.sidebarService.sidebarVisible$.subscribe((visible) => {
      this.isSidebarVisible = visible;
    });
    // const hour = new Date().getHours();

    // if (hour < 12) {
    //   this.greeting = 'Good Morning';
    // } else if (hour < 17) {
    //   this.greeting = 'Good Afternoon';
    // } else {
    //   this.greeting = 'Good Evening';
    // }

    // this.greeting += `, ${this.capitalize(this.userType)}`;
    this.greeting = `Welcome to ${this.userType} Portal, ${this.userService._user?.UsrName}`;
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebarVisibility();
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('show');
    }
  }

  openProfile() {
    this.router.navigate([`${this.userType.toLowerCase()}/profile`]);
  }

  openSettings() {
    this.router.navigate([`${this.userType.toLowerCase()}/settings`]);
  }

  logout() {
    this.authService.logout();
  }
}
