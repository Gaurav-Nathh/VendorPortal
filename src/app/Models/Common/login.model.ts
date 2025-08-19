export class LoginModel {
  userName: string = '';
  password: string = '';
  lghLocation: string = '';
  lghPincode: string = '';
  lghBrowser: string = '';
  lghOs: string = '';
  lghIpaddress: string = '';
  headerCode: string = '';
  lastSoftwareUpdate: string = ''; // ISO string format
  cmpUsers: boolean = false;
  portalUsers: boolean = false;
  lghId: number = 0;
  isMobileLogin: boolean = false;
}
