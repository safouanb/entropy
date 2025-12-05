import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SavingsPredictionDashboard from '../components/SavingsPredictionDashboard';
import SimpleMapComponent from '../components/SimpleMapComponent';
import Header from '../components/Header';

const Index = () => {
  const handleNavigate = (page: 'home' | 'about' | 'map') => {
    if (page === 'home') {
      window.location.href = '/';
    } else {
      window.location.href = `/${page}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 py-8">
        {/* Map Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Centers & Heat Centers Map</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <SimpleMapComponent height="500px" className="border border-gray-200" />
          </div>
        </div>
        
        {/* Dashboard Section */}
        <SavingsPredictionDashboard />
      </main>
    </div>
  );
};

export default Index;
