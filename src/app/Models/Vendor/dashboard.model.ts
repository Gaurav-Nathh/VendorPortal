export class user{
    Name!:string;
    gstin!:string;
    phone!:string;
    email!:string;
    bank:Bankdet[]=[];
    AclLocation!:string;
    AclAddress1!:string;
    AclAddress2!:string;
    AclPinCode!:string;
}

export interface Bankdet{
    AcbAccountNo:string;
    AcbBank:string;
    AcbIfsc:string;

}

