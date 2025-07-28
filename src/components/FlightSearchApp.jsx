// src/components/FlightSearchApp.jsx
import React, { useState } from 'react';
import FlightSearchForm from './FlightSearchForm';
import FlightResults from './FlightResults';
import { searchFlights } from '../services/flightService';

const FlightSearchApp = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState('search'); // 'search' or 'results'
  const [error, setError] = useState(null);

  const handleSearch = async (results, formData) => {
    // The search is already completed in FlightSearchForm
    // This is called when results are ready
    console.log('Search completed in FlightSearchApp:', results, formData);
    setSearchResults(results);
    setSearchParams(formData);
    setView('results');
    setError(null);
  };

  const handleModifySearch = () => {
    setView('search');
    setError(null);
  };

  const handleFlightSelect = (flight) => {
    console.log('Flight selected:', flight);
    // Handle flight selection (e.g., navigate to booking page)
  };

  return (
    <div>
      {view === 'search' ? (
        <FlightSearchForm 
          onSearch={handleSearch} 
          initialData={searchParams}
        />
      ) : (
        <FlightResults 
          flights={searchResults} 
          searchData={searchParams}
          onFlightSelect={handleFlightSelect}
          onModifySearch={handleModifySearch}
        />
      )}
    </div>
  );
};

export default FlightSearchApp;