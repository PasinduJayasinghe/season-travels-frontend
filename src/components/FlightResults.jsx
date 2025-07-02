import React, { useState } from 'react';
import { Plane } from 'lucide-react';
import FlightCard from './FlightCard';

const FlightResults = ({ flights = [], searchData = null, loading = false, onFlightSelect, onModifySearch }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Transform Amadeus API data to FlightCard format
  const transformFlightData = (amadeusFlights) => {
    return amadeusFlights.map(flight => {
      const firstSegment = flight.itineraries[0].segments[0];
      const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
      
      // Parse departure and arrival times
      const departureTime = new Date(firstSegment.departure.at);
      const arrivalTime = new Date(lastSegment.arrival.at);
      
      // Calculate if arrival is next day
      const arrivalNextDay = arrivalTime.getDate() !== departureTime.getDate();
      
      // Parse duration (PT12H30M format)
      const durationMatch = flight.itineraries[0].duration.match(/PT(\d+H)?(\d+M)?/);
      let totalMinutes = 0;
      if (durationMatch) {
        const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
        const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
        totalMinutes = hours * 60 + minutes;
      }
      
      // Get airline name from carrier code
      const getAirlineName = (carrierCode) => {
        const airlines = {
          'UL': 'SriLankan Airlines',
          'QR': 'Qatar Airways',
          'EK': 'Emirates',
          'AA': 'American Airlines',
          'DL': 'Delta Air Lines',
          'UA': 'United Airlines'
        };
        return airlines[carrierCode] || carrierCode;
      };
      
      // Get city names from IATA codes
      const getCityName = (iataCode) => {
        const cities = {
          'JFK': 'New York',
          'CMB': 'Colombo',
          'DOH': 'Doha',
          'DXB': 'Dubai',
          'LAX': 'Los Angeles',
          'LHR': 'London'
        };
        return cities[iataCode] || iataCode;
      };
      
      return {
        id: flight.id,
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        airline: getAirlineName(firstSegment.carrierCode),
        departureTime: departureTime.toTimeString(),
        arrivalTime: arrivalTime.toTimeString(),
        arrivalNextDay: arrivalNextDay,
        originCode: firstSegment.departure.iataCode,
        originCity: getCityName(firstSegment.departure.iataCode),
        destinationCode: lastSegment.arrival.iataCode,
        destinationCity: getCityName(lastSegment.arrival.iataCode),
        duration: totalMinutes,
        stops: flight.itineraries[0].segments.length - 1,
        price: parseFloat(flight.price.total),
        class: flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'Economy',
        currency: flight.price.currency,
        // Keep original data for reference
        originalData: flight
      };
    });
  };

  const displayFlights = transformFlightData(flights);

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    console.log('Selected Flight:', flight);
    
    // Call parent callback if provided
    if (onFlightSelect) {
      onFlightSelect(flight);
    } else {
      // Default behavior for demo
      alert(`Selected flight ${flight.flightNumber} for $${flight.price}`);
    }
  };

  const handleModifySearch = () => {
    if (onModifySearch) {
      onModifySearch();
    } else {
      // Default behavior - you might want to navigate back to search
      console.log('Modify search clicked');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Searching Flights...</h2>
            <p className="text-slate-400">Please wait while we find the best options for you</p>
          </div>
        </div>
      </div>
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

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Available Flights</h2>
            {searchData && (
              <div className="text-slate-400 mb-6">
                Showing {displayFlights.length} flights from {searchData.originLocationCode} to {searchData.destinationLocationCode}
                {searchData.departureDate && ` on ${searchData.departureDate}`}
              </div>
            )}
          </div>

          {/* Flight Cards */}
          {displayFlights.length > 0 ? (
            <div className="space-y-4">
              {displayFlights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onSelect={handleFlightSelect}
                />
              ))}
            </div>
          ) : (
            /* No Results State */
            <div className="text-center py-16">
              <Plane className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No flights found</h3>
              <p className="text-slate-400 mb-6">Try adjusting your search criteria</p>
              <button
                onClick={handleModifySearch}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Modify Search
              </button>
            </div>
          )}

          {/* Back to Search Button */}
          {displayFlights.length > 0 && (
            <div className="mt-12 text-center">
              <button 
                onClick={handleModifySearch}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 border border-slate-600"
              >
                Modify Search
              </button>
            </div>
          )}
        </div>

        {/* Debug Info */}
        {selectedFlight && (
          <div className="max-w-6xl mx-auto mt-8 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
            <h3 className="text-white font-semibold mb-3">Selected Flight (for debugging):</h3>
            <pre className="text-slate-300 text-sm overflow-x-auto">
              {JSON.stringify(selectedFlight, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightResults;