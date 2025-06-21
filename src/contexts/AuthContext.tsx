
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users data
const sampleUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'Administrator',
    createdAt: '2024-01-01',
    isActive: true
  },
  {
    id: 2,
    username: 'kapor1',
    email: 'kapor@example.com',
    role: 'Kapor',
    createdAt: '2024-01-02',
    isActive: true
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in real app, this would be an API call
    const foundUser = sampleUsers.find(u => u.username === username && u.isActive);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
