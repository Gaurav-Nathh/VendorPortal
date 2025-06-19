export class CustomerFormData {
  salutation: string = '';
  firstName: string = '';
  lastName: string = '';
  diplayName: string = '';
  email: string = '';
  workPhone: string = '';
  mobilePhone: string = '';
  status: 'draft' | 'confirm' = 'draft';
}
