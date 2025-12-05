import { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onMicrophoneClick: () => void;
}

const SearchBar = ({ onSearch, onMicrophoneClick }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`flex items-center relative overflow-hidden rounded-3xl transition-all duration-700 ease-out ${
          isFocused ? 'scale-[1.03] shadow-2xl' : 'hover:scale-[1.01]'
        }`}>
          {/* Enhanced main glass background with better visibility */}
          <div 
            className="absolute inset-0 rounded-3xl border border-white/30"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(60px) saturate(180%) brightness(1.1)',
              WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.1)',
              boxShadow: `
                0 12px 40px rgba(0, 0, 0, 0.15),
                0 4px 12px rgba(0, 0, 0, 0.1),
                inset 0 2px 0 rgba(255, 255, 255, 0.4),
                inset 0 -2px 0 rgba(255, 255, 255, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1)
              `
            }}
          />
          
          {/* Enhanced liquid glass highlight with more depth */}
          <div 
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-80"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.05) 100%)'
            }}
          />
          
          {/* Multi-layer inner glow for depth */}
          <div className="absolute inset-[1px] bg-gradient-to-br from-white/15 via-white/5 to-white/10 rounded-3xl pointer-events-none" />
          <div className="absolute inset-[2px] bg-gradient-to-t from-white/5 to-white/15 rounded-3xl pointer-events-none" />
          
          {/* Enhanced top highlight line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="absolute top-1 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          {/* Enhanced focus ring with liquid effect */}
          {isFocused && (
            <>
              <div 
                className="absolute -inset-2 rounded-3xl pointer-events-none animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.3), rgba(34, 197, 94, 0.2))',
                  filter: 'blur(3px)'
                }}
              />
              <div 
                className="absolute -inset-1 rounded-3xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                  filter: 'blur(1px)'
                }}
              />
            </>
          )}
          
          <div className="flex-1 flex items-center pl-8 pr-4 py-6 relative z-10">
            <Search className={`h-7 w-7 mr-5 shrink-0 transition-all duration-300 ${
              isFocused ? 'text-emerald-700 scale-110 drop-shadow-sm' : 'text-gray-600 drop-shadow-sm'
            }`} />
            <Input
              type="text"
              placeholder="Search heat centers and demand sites in San Francisco..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="border-0 bg-transparent text-gray-900 placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium h-auto p-0 w-full font-poppins drop-shadow-sm"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}
            />
          </div>
          
          <div className="flex items-center gap-3 pr-6 relative z-10">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onMicrophoneClick}
              className="h-14 w-14 rounded-2xl hover:bg-white/30 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 shadow-lg"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <Mic className="h-6 w-6 drop-shadow-sm" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-14 w-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border border-emerald-400/50"
              style={{
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4), 0 3px 10px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <Search className="h-6 w-6 drop-shadow-sm" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced bottom reflection with liquid effect */}
        <div 
          className="absolute -bottom-2 left-6 right-6 h-2 opacity-40 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            filter: 'blur(2px)'
          }}
        />
        
        {/* Ambient glow effect */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      </form>
    </div>
  );
};

export default SearchBar;