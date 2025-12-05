import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MapComponent from '@/components/MapComponent';

interface MapProps {
  onNavigate: (page: 'home' | 'about' | 'map') => void;
}

/**
 * Dedicated Map page component that displays the interactive 3D map
 * Provides full-screen map experience with navigation controls and search functionality
 */
const Map: React.FC<MapProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header with back navigation and search */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-4 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">
              Interactive Map
            </h1>
          </div>
          
          {/* Search bar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search data centers, heat centers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-white/90 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="text-sm text-gray-600">
              Explore heat centers and demand sites across San Francisco
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen map container */}
      <div className="flex-1 relative">
        <MapComponent searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Map;