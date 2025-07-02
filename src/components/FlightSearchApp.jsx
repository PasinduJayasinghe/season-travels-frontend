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

  const handleSearch = async (formData) => {
    setIsSearching(true);
    try {
      const results = await searchFlights(formData);
      setSearchResults(results);
      setSearchParams(formData);
      setView('results');
    } catch (error) {
      console.error('Search error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSearching(false);
    }
  };

  const handleModifySearch = () => {
    setView('search');
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
          isLoading={isSearching}
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