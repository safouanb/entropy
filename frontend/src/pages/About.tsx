import React from 'react';
import { ArrowLeft, Recycle, Zap, Globe, Users, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AboutProps {
  onNavigate: (page: 'home' | 'about' | 'map') => void;
}

/**
 * About page component showcasing the pyrecycleheat project mission and features
 * Displays information about sustainable energy distribution and recycling initiatives
 */
const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="text-gray-600 hover:text-gray-900 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            About pyrecycleheat
          </h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-br from-emerald-500/90 via-teal-600/90 to-cyan-700/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                <Recycle className="h-16 w-16 text-white relative z-10 drop-shadow-lg" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Sustainable Energy for San Francisco
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            pyrecycleheat is revolutionizing urban energy distribution through innovative heat recycling 
            and sustainable district heating solutions, creating a cleaner future for San Francisco.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-emerald-700">Energy Efficiency</CardTitle>
              <CardDescription>
                Advanced heat recovery systems that capture and redistribute waste energy across the city
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-teal-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl w-fit mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-teal-700">Environmental Impact</CardTitle>
              <CardDescription>
                Reducing carbon emissions by 40% through intelligent heat distribution networks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-cyan-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl w-fit mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-cyan-700">Community Focus</CardTitle>
              <CardDescription>
                Serving over 50,000 residents with affordable, sustainable heating solutions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              To create a sustainable, efficient, and equitable energy future for San Francisco by harnessing 
              the power of waste heat recovery and district heating technology. We believe that every building, 
              every neighborhood, and every community deserves access to clean, affordable energy that doesn't 
              compromise our planet's future.
            </p>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-emerald-600 mb-2">85%</h3>
            <p className="text-gray-600">Energy Efficiency Rate</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl w-fit mx-auto mb-4">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-teal-600 mb-2">12MW</h3>
            <p className="text-gray-600">Heat Recycled Daily</p>
          </div>
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl w-fit mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">40%</h3>
            <p className="text-gray-600">CO₂ Reduction</p>
          </div>
        </div>

        {/* Technology Section */}
        <Card className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Smart Heat Recovery</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our advanced sensors and AI-powered distribution system identifies waste heat sources 
                  throughout the city and intelligently routes this energy to areas with heating demand.
                </p>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">District Network</h4>
                <p className="text-gray-600 leading-relaxed">
                  A comprehensive underground network of insulated pipes carries heated water from 
                  sources to destinations, creating an efficient city-wide heating grid.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full mb-4">
                      <Recycle className="h-10 w-10 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-800 mb-2">Real-time Monitoring</h5>
                    <p className="text-sm text-gray-600">
                      24/7 system optimization for maximum efficiency
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;