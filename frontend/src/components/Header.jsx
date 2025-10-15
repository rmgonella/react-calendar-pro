import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, LogOut, User, Bell, Settings } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Calendar Pro
              </h1>
              <p className="text-sm text-gray-600">Gerenciador de Compromissos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Olá, {user?.name}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            {/* Mobile User Info */}
            <div className="md:hidden flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </Button>
              
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
