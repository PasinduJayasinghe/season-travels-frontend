import React, { useState } from 'react';
import { Search, Calendar, Users, Plane } from 'lucide-react';
import FlightResults from './FlightResults';
import { searchFlights } from '../services/flightService';

const FlightSearchForm = ({ onSearch, initialData }) => {
  // Initialize with initialData if provided (for returning from results)
  // Updated to match backend FlightSearchRequest class
  const [formData, setFormData] = useState(initialData || {
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    currencyCode: 'USD',
    maxResults: 5,
    travelClass: 'ECONOMY',
    nonStop: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flightResults, setFlightResults] = useState([]);
  const [error, setError] = useState(null);

  const travelClasses = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First Class' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'LKR', label: 'LKR - Sri Lankan Rupee' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'QAR', label: 'QAR - Qatari Riyal' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the request payload matching the backend FlightSearchRequest class
      const searchRequest = {
        originLocationCode: formData.originLocationCode.trim(),
        destinationLocationCode: formData.destinationLocationCode.trim(),
        departureDate: formData.departureDate,
        returnDate: formData.returnDate || null,
        adults: parseInt(formData.adults),
        children: parseInt(formData.children) || 0,
        infants: parseInt(formData.infants) || 0,
        currencyCode: formData.currencyCode,
        maxResults: parseInt(formData.maxResults),
        travelClass: formData.travelClass,
        nonStop: formData.nonStop
      };

      console.log('Sending search request:', searchRequest);
      
      // Call the flight search API
      const response = await searchFlights(searchRequest);
      
      console.log('Search response:', response);
      
      // Extract the flights data from the response
      const flightsData = response.data || response;
      
      setFlightResults(flightsData);
      setShowResults(true);
      
      // Call parent callback if provided
      if (onSearch) {
        onSearch(flightsData, formData);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError(error.message || 'Failed to search flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = (flight) => {
    console.log('Selected flight:', flight);
    // Handle flight selection - you might want to navigate to booking page
    alert(`Flight selected! Next step: proceed to booking.`);
  };

  const handleModifySearch = () => {
    setShowResults(false);
    setFlightResults([]);
  };

  const today = new Date().toISOString().split('T')[0];

  // Show results if we have them
  if (showResults) {
    return (
      <FlightResults
        flights={flightResults}
        searchData={formData}
        loading={isLoading}
        onFlightSelect={handleFlightSelect}
        onModifySearch={handleModifySearch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Plane className="w-8 h-8 text-red-500 mr-3 transform rotate-45" />
            <h1 className="text-4xl font-bold">
              <span className="text-red-500">SEASON</span>
              <span className="text-white">TRAVELS</span>
            </h1>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Search Flights</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Origin and Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">From</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="originLocationCode"
                      value={formData.originLocationCode}
                      onChange={handleInputChange}
                      placeholder="JFK, NYC, New York"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="destinationLocationCode"
                      value={formData.destinationLocationCode}
                      onChange={handleInputChange}
                      placeholder="CMB, Colombo"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Departure Date and Return Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Departure Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      min={today}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Return Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate || ''}
                      onChange={handleInputChange}
                      min={formData.departureDate || today}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Class and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Class</label>
                  <select
                    name="travelClass"
                    value={formData.travelClass}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    {travelClasses.map(cls => (
                      <option key={cls.value} value={cls.value} className="bg-slate-700">
                        {cls.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Currency</label>
                  <select
                    name="currencyCode"
                    value={formData.currencyCode}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value} className="bg-slate-700">
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passengers and Advanced Options */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Adults</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      name="adults"
                      value={formData.adults}
                      onChange={handleInputChange}
                      min="1"
                      max="9"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Children (2-11)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      name="children"
                      value={formData.children}
                      onChange={handleInputChange}
                      min="0"
                      max="9"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Infants (0-2)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      name="infants"
                      value={formData.infants}
                      onChange={handleInputChange}
                      min="0"
                      max="9"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Max Results</label>
                  <input
                    type="number"
                    name="maxResults"
                    value={formData.maxResults}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-3 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      name="nonStop"
                      checked={formData.nonStop}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium">Non-stop only</span>
                  </label>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-red-400 disabled:to-red-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Searching Flights...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search Flights</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;