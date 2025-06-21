
export interface DataItem {
  id: number;
  namaPengadaan: string;
  noTglKep: string;
  noTglKontrak: string;
  jukminJusik: string;
  namaPerusahaan: string;
  bekal: string;
  proses: string;
  tipeData: string;
  dataPdf: string;
}

export interface AppSettings {
  appTitle: string;
  primaryColor: string;
  backgroundColor: string;
  navbarStyle: string;
  menuItems: Array<{
    id: string;
    label: string;
    icon: string;
    editable?: boolean;
    children?: Array<{
      id: string;
      label: string;
      icon: string;
      editable?: boolean;
      order?: number;
      parentId?: string;
    }>;
    order?: number;
    parentId?: string;
  }>;
}

export interface LoginSettings {
  title: string;
  subtitle: string;
  logoUrl: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  titleColor: string;
  subtitleColor: string;
  alignment: 'left' | 'center' | 'right';
  fontWeight: string;
  showLogo: boolean;
  logoSize: string;
  companyName: string;
}

export interface ChatMessage {
  id: string;
  senderId: number;
  senderUsername: string;
  senderNickname?: string;
  content: string;
  timestamp: Date;
  type: 'broadcast' | 'private';
  recipientId?: number;
  recipientUsername?: string;
}

export interface OnlineUser {
  id: number;
  username: string;
  nickname?: string;
  lastSeen: Date;
  isOnline: boolean;
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupInterval: 'daily' | 'weekly' | 'monthly';
  maxBackups: number;
  lastBackupDate?: Date;
}
