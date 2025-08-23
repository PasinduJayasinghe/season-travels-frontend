// src/components/Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FlightSearchForm from './FlightSearchForm';
import FlightResults from './FlightResults';
import Settings from './Settings';
import Chatbot from './Chatbot';

const Dashboard = () => {
  // Dashboard navigation state
  const [activeSection, setActiveSection] = useState('book-flight');
  
  // Flight booking state (same as before)
  const [currentStep, setCurrentStep] = useState('search'); // 'search' or 'results'
  const [searchData, setSearchData] = useState(null);
  const [flightResults, setFlightResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Handle flight search submission
  const handleFlightSearch = async (results, formData) => {
    console.log('Search completed:', results, formData);
    setIsLoading(false);
    setSearchData(formData);
    setFlightResults(results);
    setCurrentStep('results');
  };

  // Handle flight selection
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    console.log('Flight pricing confirmed:', flight);
    
    alert(`Flight pricing confirmed! Total: ${flight.price.currency} ${flight.price.grandTotal}. Next step: Proceed to booking form.`);
  };

  // Handle modify search (go back to search form)
  const handleModifySearch = () => {
    setCurrentStep('search');
    setFlightResults([]);
    setSelectedFlight(null);
  };

  // Handle section change from sidebar
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    // Reset flight booking state when switching sections
    if (section !== 'book-flight') {
      setCurrentStep('search');
      setFlightResults([]);
      setSelectedFlight(null);
    }
  };

  // Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'book-flight':
        // Render flight booking flow
        switch (currentStep) {
          case 'search':
            return (
              <FlightSearchForm 
                onSearch={handleFlightSearch}
                initialData={searchData}
              />
            );
          case 'results':
            return (
              <FlightResults
                flights={flightResults}
                searchData={searchData}
                loading={isLoading}
                onFlightSelect={handleFlightSelect}
                onModifySearch={handleModifySearch}
              />
            );
          default:
            return <FlightSearchForm onSearch={handleFlightSearch} />;
        }
      
      case 'booked-flights':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Booked Flights</h1>
            <div className="bg-slate-800 rounded-lg p-6">
              <p className="text-slate-300">This feature will be implemented soon.</p>
              <p className="text-slate-400 text-sm mt-2">Here you will see all booked flights with their details.</p>
            </div>
          </div>
        );
      
      case 'customers':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Customers</h1>
            <div className="bg-slate-800 rounded-lg p-6">
              <p className="text-slate-300">This feature will be implemented soon.</p>
              <p className="text-slate-400 text-sm mt-2">Here you will manage customer data and information.</p>
            </div>
          </div>
        );
      
      case 'settings':
        return <Settings />;
      
      default:
        return (
          <FlightSearchForm 
            onSearch={handleFlightSearch}
            initialData={searchData}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderMainContent()}
      </div>

      {/* Chatbot */}
      <Chatbot onNavigate={handleSectionChange} />
    </div>
  );
};

export default Dashboard;
