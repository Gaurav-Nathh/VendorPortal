import { NgClass, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { SessionServiceService } from '../../../services/session-service.service';
import { LoadingService } from '../../../services/shared/loading.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiConfigService } from '../../../services/api-config/api-config.service';
import { DomainCode } from '../../../Models/Common/domain-code.model';
import { LoginModel } from '../../../Models/Common/login.model';
import { UtilityService } from '../../../services/utility/utility.service';
import { user } from '../../../Models/Common/dashboard.model';
import CryptoJS from 'crypto-js';

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
  domain: string = '';

  // public loginModel: LoginModel = {
  //   userName: '',
  //   password: '',
  //   lghLocation: '',
  //   lghPincode: '',
  //   lghBrowser: '',
  //   lghOs: '',
  //   lghIpaddress: '',
  //   headerCode: '',
  //   lastSoftwareUpdate: '',
  //   cmpUsers: false,
  //   portalUsers: false,
  //   lghId: 0,
  //   isMobileLogin: false,
  // };

  dataToEncrypt: any = {
    user: '',
    key: '',
    utm_destination: '',
    utm_key: '',
    UserIp: '',
    Location: '',
    Pincode: '',
    UserName: '',
    Password: '',
    UrlTab: '',
    CmpReportUrl: '',
    CmpCode: '',
    CmpDocAccessKey: '',
    CmpDocBucketName: '',
    CmpDocRegion: '',
    CmpDocSecrectAccesskey: '',
    CmpDocUrl: '',
    AboutLicKey: '',
    AboutNoOfUsers: '',
    AboutDomain: '',
    CmpPlan: '',
    userLghId: 0,
  };
  isLocationAllowed: boolean = false;

  constructor(
    private authService: AuthService,
    private apiConfigService: ApiConfigService,
    private userService: UserService,
    private sessionService: SessionServiceService,
    public loadingServie: LoadingService,
    private router: Router,
    private utilityService: UtilityService
  ) {
    setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  ngOnInit() {
    this.fetchIp();
    this.fetchLocation();
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
    this.resolveDomain();
  }

  resolveDomain() {
    this.domain = this.loginModel.userName.split('@')[1];
    this.authService.resolveDomain(this.domain).subscribe({
      next: (response) => {
        this.dataToEncrypt.key = response.CmpKey;
        this.dataToEncrypt.utm_destination = response.CmpApiUrl;
        this.dataToEncrypt.utm_key = '9oiuj78hyg';
        this.dataToEncrypt.UserName = this.loginModel.userName;
        this.dataToEncrypt.Password = this.loginModel.password;
        this.dataToEncrypt.UrlTab = window.location.href;
        this.dataToEncrypt.CmpReportUrl = response.CmpReportUrl;
        this.dataToEncrypt.CmpCode = response.CmpCode;
        this.dataToEncrypt.CmpDocAccessKey = response.CmpDocAccessKey;
        this.dataToEncrypt.CmpDocBucketName = response.CmpDocBucketName;
        this.dataToEncrypt.CmpDocRegion = response.CmpDocRegion;
        this.dataToEncrypt.CmpDocSecrectAccesskey =
          response.CmpDocSecretAccessKey;
        this.dataToEncrypt.CmpDocUrl = response.CmpDocUrl;
        this.dataToEncrypt.AboutLicKey = response.CmpLicKey;
        this.dataToEncrypt.AboutNoOfUsers = response.CmpUsers;
        this.dataToEncrypt.AboutDomain = this.domain;
        this.dataToEncrypt.CmpPlan = response.CmpPlan;

        this.login();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to resolve domain. Please try again later.',
        });
      },
    });
  }

  login() {
    this.authService.login_local(this.loginModel).subscribe({
      next: (respone: any) => {
        this.dataToEncrypt.user = respone.userDetails.UsrId;
        this.dataToEncrypt.userLghId = respone.userDetails.UsrLghId;

        console.log('Data to Encrypt:', this.dataToEncrypt);
        if (
          respone.userDetails.UsrType === 'Customer' ||
          respone.userDetails.UsrType === 'Vendor'
        ) {
          const logHisId = sessionStorage.getItem('UsrLghId');
          sessionStorage.setItem('Domain', this.domain);
          if (logHisId) {
            this.sessionService.startSession();
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.redirectWithEncryptedData();
        }
        // window.location.href = this.apiConfigService.getLoginPageUrl();

        // window.location.href = 'http://127.0.0.1:5501/';
      },
    });
  }

  redirectWithEncryptedData() {
    const secretKey = 'EFACTOBNG';
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(this.dataToEncrypt),
      secretKey
    ).toString();

    let baseUrl = this.dataToEncrypt.utm_destination;
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.slice(0, -4);
    }

    window.location.href = `${baseUrl}?data=${encodeURIComponent(
      encryptedData
    )}`;
  }

  fetchIp() {
    this.utilityService.getIp().subscribe({
      next: (ip) => {
        this.dataToEncrypt.UserIp = ip;
      },
      error: (err) => {
        console.error('Error fetching IP address:', err);
      },
    });
  }

  fetchLocation() {
    this.utilityService.getLocation().subscribe({
      next: (position) => {
        this.isLocationAllowed = true;
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        this.utilityService.reverseGeocode(lat, lon).subscribe({
          next: (data) => {
            this.dataToEncrypt.Location = data['display_name'];
            this.dataToEncrypt.Pincode = data['address']?.['postcode'] || '';
          },
          error: (err) => console.error('Error fetching location:', err),
        });
      },
      error: (err) => {
        this.isLocationAllowed = false;
        console.error('Error fetching geolocation:', err);
      },
    });
  }

  // login() {
  //   this.authService.login(this.loginModel).subscribe({
  //     next: (response: any) => {
  //       if (response.success === true) {
  //         this.sessionService.startSession();
  //         this.userType = this.userService.getUserType();
  //         switch (this.userType) {
  //           case 'Customer':
  //             this.router.navigate(['/customer']);
  //             break;
  //           case 'Vendor':
  //             this.router.navigate(['/vendor']);
  //             break;
  //           default:
  //             this.router.navigate(['/']);
  //             break;
  //         }
  //       }
  //     },
  //     error: (error) => {},
  //   });
  // }

  nextSlide() {
    this.currentImage = (this.currentImage + 1) % this.images.length;
    this.progress = (this.currentImage + 1) * 50;
  }
}
