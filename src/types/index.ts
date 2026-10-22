export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string;
  avatar?: string;
  phone?: string;
}

export interface Client {
  id: string;
  clientCode: string; // e.g. CLT-2026-081
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city: string;
  address?: string;
  notes?: string;
  createdAt: string;
  avatar?: string;
  accessPasscode: string; // Client login passcode
}

export interface Photo {
  id: string;
  shootId: string;
  url: string;
  title: string;
  category: string;
  isSelectedForAlbum: boolean;
  isFavorite: boolean;
  clientNotes?: string;
  uploadedAt: string;
  resolution?: string;
  width?: number;
  height?: number;
}

export type ShootStatus =
  | 'Booked'
  | 'Shot_Completed'
  | 'Editing'
  | 'Proofing'
  | 'Album_Design'
  | 'Completed';

export type ShootType =
  | 'Wedding'
  | 'Pre-Wedding'
  | 'Fashion'
  | 'Commercial'
  | 'Portrait'
  | 'Event'
  | 'Maternity & Baby';

export interface Shoot {
  id: string;
  clientId: string;
  title: string;
  type: ShootType;
  eventDate: string;
  venue: string;
  leadPhotographer: string;
  crewMembers: string[];
  status: ShootStatus;
  packageTitle: string;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  masterDriveLink?: string;
  teaserVideoLink?: string;
  rawBackupLink?: string;
  notes?: string;
  coverImage: string;
  photosCount?: number;
  selectedPhotosCount?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'Paid' | 'Partial' | 'Unpaid';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-041
  clientId: string;
  shootId?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 18 for 18% GST
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
}

export interface StudioStage {
  id: string;
  name: string;
  dimensions: string;
  ceilingHeight: string;
  features: string[];
  power: string;
  status: 'Available' | 'In Production' | 'Reserved';
  hourlyRate: number;
  dayRate: number;
  description: string;
  image: string;
}

export interface StudioEquipment {
  id: string;
  category: 'Cameras' | 'Lenses' | 'Lighting' | 'Audio & Grip' | 'Drones & Gimbals';
  name: string;
  model: string;
  serialNumber: string;
  dailyRate: number;
  status: 'In Vault' | 'Assigned on Shoot' | 'Maintenance';
  assignedShootId?: string;
  notes?: string;
}

export interface StudioConfig {
  studioName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  operatingHours: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
}

export type DocumentCategory =
  | 'Contract & Agreement'
  | 'Model Release'
  | 'Creative Brief & Moodboard'
  | 'Delivery Receipt'
  | 'High-Res Drive Link'
  | 'Print & Album Specifications';

export interface ClientDocument {
  id: string;
  clientId: string;
  shootId?: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  category: DocumentCategory;
  downloadUrl?: string;
  uploadedAt: string;
  notes?: string;
}
