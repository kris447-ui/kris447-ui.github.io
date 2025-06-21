import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LoginSettings } from '@/types/app';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const [titleSettings, setTitleSettings] = useState<LoginSettings>({
    title: 'Login Sistem',
    fontSize: 'text-3xl',
    titleColor: 'text-primary',
    alignment: 'center',
    fontFamily: 'font-sans',
    fontWeight: 'font-bold',
    showLogo: false,
    logoUrl: '',
    logoSize: 'h-12 w-12',
    companyName: '',
    subtitle: 'Masukkan kredensial Anda untuk mengakses sistem',
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    subtitleColor: 'text-muted-foreground'
  });

  // Load saved login settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('loginSettings');
    if (savedSettings) {
      setTitleSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success('Login berhasil!');
      } else {
        toast.error('Username atau password salah!');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  const getAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className={getAlignmentClass(titleSettings.alignment)}>
          {titleSettings.showLogo && titleSettings.logoUrl && (
            <div className={`flex ${titleSettings.alignment === 'center' ? 'justify-center' : titleSettings.alignment === 'right' ? 'justify-end' : 'justify-start'} mb-4`}>
              <img 
                src={titleSettings.logoUrl} 
                alt="Company Logo" 
                className={`${titleSettings.logoSize} object-contain`}
              />
            </div>
          )}
          
          {titleSettings.companyName && (
            <div className={`text-sm font-medium text-muted-foreground mb-2 ${getAlignmentClass(titleSettings.alignment)}`}>
              {titleSettings.companyName}
            </div>
          )}
          
          <CardTitle 
            className={`${titleSettings.fontSize} ${titleSettings.titleColor} ${titleSettings.fontFamily} ${titleSettings.fontWeight} transition-all duration-300`}
          >
            {titleSettings.title}
          </CardTitle>
          
          <CardDescription className={getAlignmentClass(titleSettings.alignment)}>
            {titleSettings.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:shadow-lg" 
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Demo credentials:</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Admin:</span> username: admin, password: password123</p>
              <p><span className="font-medium">Kapor:</span> username: kapor1, password: password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
