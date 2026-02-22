
export interface QRCodeData {
  id: string;
  name: string;
  website: string;
  redirectToExternal: boolean;
  price: number;
  changeRate: number; // percentage
  activeTimeStart: string; // HH:mm
  activeTimeEnd: string; // HH:mm
  productImage?: string; // base64
  productInfo: string;
  publisherLogo?: string; // base64
  publisherName: string;
  publisherWebsite: string;
  createdAt: string;
  scans: number;
  ownerId?: string;
  priceDisplayType?: 'price' | 'note'; // Fiyat mı yoksa not mu gösterilecek
  priceNote?: string; // Fiyat yerine gösterilecek not
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type AppView = 'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'CREATE' | 'VIEW' | 'PUBLIC' | 'SHOW_QR' | 'EDIT';
