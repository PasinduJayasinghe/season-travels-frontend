import React from 'react';
import { Plane, Clock, MapPin } from 'lucide-react';

const FlightCard = ({ flight, onSelect }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (duration) => {
    // Convert ISO 8601 duration (PT12H30M) to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

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

  const handleSelect = () => {
    onSelect(flight);
  };

  // Check if this is transformed data or original Amadeus data
  const isTransformedData = flight.flightNumber && flight.airline;
  
  if (isTransformedData) {
    // Handle transformed data format from FlightResults
    const arrivalNextDay = flight.arrivalNextDay;
    const stops = flight.stops;
    const durationHours = Math.floor(flight.duration / 60);
    const durationMinutes = flight.duration % 60;
    const durationStr = durationHours > 0 ? `${durationHours}h ${durationMinutes}m` : `${durationMinutes}m`;

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:bg-slate-800/70">
        <div className="flex items-center justify-between">
          {/* Flight Times and Locations */}
          <div className="flex items-center space-x-8 flex-1">
            {/* Departure */}
            <div className="text-left">
              <div className="text-3xl font-bold text-white mb-1">
                {flight.departureTime.slice(0, 5)}
              </div>
              <div className="text-white font-medium">{flight.originCity}</div>
              <div className="text-slate-400 text-sm">{flight.originCode}</div>
            </div>

            {/* Flight Duration and Icon */}
            <div className="flex flex-col items-center flex-1 px-4">
              <div className="flex items-center text-slate-400 mb-2">
                <div className="h-px bg-slate-600 flex-1"></div>
                <Plane className="w-5 h-5 mx-3 text-slate-400 transform rotate-90" />
                <div className="h-px bg-slate-600 flex-1"></div>
              </div>
              <div className="text-slate-400 text-sm">
                {durationStr}
              </div>
              {stops > 0 && (
                <div className="text-slate-400 text-xs mt-1">
                  {stops} stop{stops > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">
                {flight.arrivalTime.slice(0, 5)}
                {arrivalNextDay && <span className="text-red-400 text-lg">+1</span>}
              </div>
              <div className="text-white font-medium">{flight.destinationCity}</div>
              <div className="text-slate-400 text-sm">{flight.destinationCode}</div>
            </div>
          </div>

          {/* Price and Select Button */}
          <div className="text-right ml-8">
            <div className="text-3xl font-bold text-white mb-3">
              {flight.currency} {flight.price}
            </div>
            <button
              onClick={handleSelect}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 min-w-[100px]"
            >
              Select
            </button>
          </div>
        </div>

        {/* Additional Flight Info */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {flight.airline}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Flight {flight.flightNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-green-400 font-medium">{flight.class}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Handle original Amadeus data format
    const firstSegment = flight.itineraries[0].segments[0];
    const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
    
    const departureTime = firstSegment.departure.at;
    const arrivalTime = lastSegment.arrival.at;
    
    // Check if arrival is next day
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(departureTime);
    const arrivalNextDay = arrivalDate.getDate() !== departureDate.getDate();
    
    const airline = getAirlineName(firstSegment.carrierCode);
    const flightNumber = `${firstSegment.carrierCode}${firstSegment.number}`;
    const originCity = getCityName(firstSegment.departure.iataCode);
    const destinationCity = getCityName(lastSegment.arrival.iataCode);
    const travelClass = flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';
    const formattedClass = travelClass.charAt(0).toUpperCase() + travelClass.slice(1).toLowerCase();

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 hover:bg-slate-800/70">
        <div className="flex items-center justify-between">
          {/* Flight Times and Locations */}
          <div className="flex items-center space-x-8 flex-1">
            {/* Departure */}
            <div className="text-left">
              <div className="text-3xl font-bold text-white mb-1">
                {formatTime(departureTime)}
              </div>
              <div className="text-white font-medium">{originCity}</div>
              <div className="text-slate-400 text-sm">{firstSegment.departure.iataCode}</div>
            </div>

            {/* Flight Duration and Icon */}
            <div className="flex flex-col items-center flex-1 px-4">
              <div className="flex items-center text-slate-400 mb-2">
                <div className="h-px bg-slate-600 flex-1"></div>
                <Plane className="w-5 h-5 mx-3 text-slate-400 transform rotate-90" />
                <div className="h-px bg-slate-600 flex-1"></div>
              </div>
              <div className="text-slate-400 text-sm">
                {formatDuration(flight.itineraries[0].duration)}
              </div>
              {flight.itineraries[0].segments.length > 1 && (
                <div className="text-slate-400 text-xs mt-1">
                  {flight.itineraries[0].segments.length - 1} stop{flight.itineraries[0].segments.length > 2 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">
                {formatTime(arrivalTime)}
                {arrivalNextDay && <span className="text-red-400 text-lg">+1</span>}
              </div>
              <div className="text-white font-medium">{destinationCity}</div>
              <div className="text-slate-400 text-sm">{lastSegment.arrival.iataCode}</div>
            </div>
          </div>

          {/* Price and Select Button */}
          <div className="text-right ml-8">
            <div className="text-3xl font-bold text-white mb-3">
              {flight.price.currency} {flight.price.total}
            </div>
            <button
              onClick={handleSelect}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 min-w-[100px]"
            >
              Select
            </button>
          </div>
        </div>

        {/* Additional Flight Info */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {airline}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Flight {flightNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-green-400 font-medium">{formattedClass}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FlightCard;