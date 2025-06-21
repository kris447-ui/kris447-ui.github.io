
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isEditable: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
