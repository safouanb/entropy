import React from 'react';
import { Recycle, Activity, Info, Home, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  totalSites?: number;
  activeConnections?: number;
  onNavigate?: (page: 'home' | 'about' | 'map') => void;
}

/**
 * Application header component providing branding, navigation, and system status
 * Displays the pyrecycleheat title with real-time connection statistics and navigation
 */
const Header: React.FC<HeaderProps> = ({ 
  totalSites = 0, 
  activeConnections = 0,
  onNavigate = () => {}
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Liquid Glass Logo */}
            <div className="relative group cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-emerald-500/90 via-teal-600/90 to-cyan-700/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-xl"></div>
                <Recycle className="h-7 w-7 text-white relative z-10 drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                pyrecycleheat - san francisco
              </h1>
              <p className="text-sm text-gray-600">
                Sustainable energy distribution network
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              System Status
            </span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{totalSites}</span>
              <span>Total Sites</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-green-600">{activeConnections}</span>
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-emerald-50 transition-colors"
            onClick={() => onNavigate('home')}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
            onClick={() => onNavigate('map')}
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-cyan-50 transition-colors"
            onClick={() => onNavigate('about')}
          >
            <Info className="h-4 w-4 mr-2" />
            About
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;