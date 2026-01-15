export interface PersonalDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  photo?: string;
}

export interface BusinessDetails {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface WithdrawalDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

export type SettingsTab = 
  | 'personal'
  | 'business'
  | 'shipping'
  | 'withdrawal'
  | 'password'
  | 'notifications'
  | 'delete';


  export interface MobileViewState {
  isMobile: boolean;
  showTabList: boolean;
  showContent: boolean;
}