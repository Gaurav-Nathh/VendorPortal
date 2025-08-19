import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { SessionServiceService } from './services/session-service.service';
import { AuthService } from './services/auth.service';
import * as CryptoJS from 'crypto-js';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginModel } from './Models/Common/login.model';
import { UserService } from './services/shared/user-service/user.service';
import { ApiConfigService } from './services/api-config/api-config.service';
import { filter, switchMap } from 'rxjs';
import { commonRoutes, customerRoute, vendorRoutes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isInitialized = false;
  private secretKey = 'EFACTOBNG';
  private domain: string = '';
  private userLghId: string = '';
  private userId: string = '';
  public loginModel: LoginModel = {
    userName: '',
    password: '',
    lghLocation: '',
    lghPincode: '',
    lghBrowser: '',
    lghOs: '',
    lghIpaddress: '',
    headerCode: '',
    lastSoftwareUpdate: '',
    cmpUsers: false,
    portalUsers: false,
    lghId: 0,
    isMobileLogin: false,
  };
  constructor(
    private sessionService: SessionServiceService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private config: ApiConfigService
  ) {}

  ngOnInit(): void {
    const domain: string = sessionStorage.getItem('Domain') || '';
    if (domain != '') {
      this.authService.resolveDomain(domain).subscribe({
        next: (response) => {
          const usrId = sessionStorage.getItem('UsrId');
          if (usrId) {
            this.userService.fetchUser(Number(usrId)).subscribe({
              next: (response) => {
                // this.setRoutes();
                this.isInitialized = true;
                console.log('loader false');
                const logHisId = sessionStorage.getItem('UsrLghId');
                if (logHisId) {
                  this.sessionService.startSession();
                }
              },
              error: () => {
                this.isInitialized = true;
              },
            });
          }
        },
        error: (error) => {
          this.isInitialized = true;
          window.location.href = this.config.getLoginPageUrl();
        },
      });
    } else {
      this.checkURLData();
    }
  }

  decryptData(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(
        decodeURIComponent(encryptedData),
        this.secretKey
      );
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      return null;
    }
  }

  checkURLData(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const userData = urlParams.get('data');

    if (!userData) {
      if (this.config.getIsProduction()) {
        console.log('in production');
        window.location.href = this.config.getLoginPageUrl();
        return;
      } else {
        console.log('not production');
        this.isInitialized = true;
        this.router.navigate(['/login']);
      }
      // window.location.href = this.config.getLoginPageUrl();
      // return;
    }

    const decryptedData = this.decryptData(userData ?? '');
    console.log('Decrypted Data:', decryptedData);
    this.domain = decryptedData.AboutDomain;
    this.userLghId = decryptedData.UserLghId;
    this.userId = decryptedData.user;

    this.loginModel.userName = decryptedData.UserName;
    this.loginModel.password = decryptedData.Password;
    this.loginModel.lghLocation = decryptedData.Location;
    this.loginModel.lghPincode = decryptedData.PinCode;
    this.loginModel.lghBrowser = this.getBrowserName();
    this.loginModel.lghOs = this.getOSName();
    this.loginModel.lghIpaddress = decryptedData.UserIp;
    // this.loginModel.headerCode
    this.loginModel.lastSoftwareUpdate = '';
    this.loginModel.cmpUsers = false;
    this.loginModel.portalUsers = false;
    this.loginModel.lghId = decryptedData.UserLghId;
    // this.loginModel.isMobileLogin

    sessionStorage.setItem('Domain', this.domain);
    sessionStorage.setItem('UsrId', this.userId);

    this.location.replaceState(this.router.url.split('?')[0]);

    this.authService.resolveDomain(this.domain).subscribe({
      next: (response) => {
        this.authService.login(this.loginModel).subscribe({
          next: (response: any) => {
            // this.setRoutes();
            this.isInitialized = true;
            const logHisId = sessionStorage.getItem('UsrLghId');
            if (logHisId != '') {
              this.sessionService.startSession();
            }
          },
          error: () => {
            this.isInitialized = true;
          },
        });
      },
      error: (error) => {
        this.isInitialized = true;
      },
    });
  }

  getBrowserName(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
      return 'Chrome';
    } else if (ua.includes('Firefox')) {
      return 'Firefox';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      return 'Safari';
    } else if (ua.includes('Edg')) {
      return 'Edge';
    } else if (ua.includes('OPR')) {
      return 'Opera';
    } else {
      return 'Unknown';
    }
  }

  getOSName(): string {
    const ua = navigator.userAgent;

    if (ua.includes('Windows')) {
      return 'Windows';
    } else if (ua.includes('Mac OS')) {
      return 'MacOS';
    } else if (ua.includes('Linux')) {
      return 'Linux';
    } else if (/Android/i.test(ua)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      return 'iOS';
    } else {
      return 'Unknown';
    }
  }

  // setRoutes() {
  //   let userType = this.userService._user?.UsrType;
  //   let routes = [...commonRoutes];
  //   if (userType === 'Customer') {
  //     routes.push(...customerRoute);
  //   } else if (userType === 'Vendor') {
  //     routes.push(...vendorRoutes);
  //   }
  //   console.log(routes);
  //   this.router.resetConfig(routes);
  // }
}
