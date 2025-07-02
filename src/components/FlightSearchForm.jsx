import React, { useState } from 'react';
import { Search, Calendar, Users, Plane } from 'lucide-react';
import FlightResults from './FlightResults';

// Mock flight data - replace with API call in production
const mockFlightData = [
  {
    id: "1",
    type: "flight-offer",
    source: "GDS",
    instantTicketingRequired: false,
    oneWay: true,
    isUpsellOffer: false,
    numberOfBookableSeats: 5,
    itineraries: [
      {
        duration: "PT12H30M",
        segments: [
          {
            departure: {
              iataCode: "JFK",
              terminal: "4",
              at: "2024-06-15T08:00:00"
            },
            arrival: {
              iataCode: "CMB",
              terminal: "1",
              at: "2024-06-16T06:30:00"
            },
            carrierCode: "UL",
            number: "201",
            aircraft: {
              code: "A330"
            },
            duration: "PT12H30M",
            numberOfStops: 0
          }
        ]
      }
    ],
    price: {
      currency: "USD",
      total: "1250.00",
      base: "1100.00",
      grandTotal: "1250.00"
    },
    validatingAirlineCodes: ["UL"],
    travelerPricings: [
      {
        travelerId: "1",
        travelerType: "ADULT",
        price: {
          currency: "USD",
          total: "1250.00",
          base: "1100.00",
          grandTotal: "1250.00"
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            class: "Y"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    type: "flight-offer",
    source: "GDS",
    instantTicketingRequired: false,
    oneWay: true,
    isUpsellOffer: false,
    numberOfBookableSeats: 3,
    itineraries: [
      {
        duration: "PT15H45M",
        segments: [
          {
            departure: {
              iataCode: "JFK",
              terminal: "4",
              at: "2024-06-15T14:30:00"
            },
            arrival: {
              iataCode: "DOH",
              terminal: "1",
              at: "2024-06-16T05:15:00"
            },
            carrierCode: "QR",
            number: "702",
            aircraft: {
              code: "B777"
            },
            duration: "PT12H45M",
            numberOfStops: 0
          },
          {
            departure: {
              iataCode: "DOH",
              terminal: "1",
              at: "2024-06-16T07:30:00"
            },
            arrival: {
              iataCode: "CMB",
              terminal: "1",
              at: "2024-06-16T14:15:00"
            },
            carrierCode: "QR",
            number: "658",
            aircraft: {
              code: "A321"
            },
            duration: "PT3H15M",
            numberOfStops: 0
          }
        ]
      }
    ],
    price: {
      currency: "USD",
      total: "980.00",
      base: "850.00",
      grandTotal: "980.00"
    },
    validatingAirlineCodes: ["QR"],
    travelerPricings: [
      {
        travelerId: "1",
        travelerType: "ADULT",
        price: {
          currency: "USD",
          total: "980.00",
          base: "850.00",
          grandTotal: "980.00"
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "ECONOMY",
            class: "Y"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    type: "flight-offer",
    source: "GDS",
    instantTicketingRequired: false,
    oneWay: true,
    isUpsellOffer: false,
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: "PT18H20M",
        segments: [
          {
            departure: {
              iataCode: "JFK",
              terminal: "4",
              at: "2024-06-15T22:15:00"
            },
            arrival: {
              iataCode: "DXB",
              terminal: "3",
              at: "2024-06-16T18:45:00"
            },
            carrierCode: "EK",
            number: "204",
            aircraft: {
              code: "A380"
            },
            duration: "PT12H30M",
            numberOfStops: 0
          },
          {
            departure: {
              iataCode: "DXB",
              terminal: "3",
              at: "2024-06-16T21:30:00"
            },
            arrival: {
              iataCode: "CMB",
              terminal: "1",
              at: "2024-06-17T02:35:00"
            },
            carrierCode: "EK",
            number: "649",
            aircraft: {
              code: "B777"
            },
            duration: "PT4H35M",
            numberOfStops: 0
          }
        ]
      }
    ],
    price: {
      currency: "USD",
      total: "1350.00",
      base: "1200.00",
      grandTotal: "1350.00"
    },
    validatingAirlineCodes: ["EK"],
    travelerPricings: [
      {
        travelerId: "1",
        travelerType: "ADULT",
        price: {
          currency: "USD",
          total: "1350.00",
          base: "1200.00",
          grandTotal: "1350.00"
        },
        fareDetailsBySegment: [
          {
            segmentId: "1",
            cabin: "BUSINESS",
            class: "J"
          }
        ]
      }
    ]
  }
];

const FlightSearchForm = ({ onSearch, initialData }) => {
  // Initialize with initialData if provided (for returning from results)
  const [formData, setFormData] = useState(initialData || {
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    adults: 1,
    travelClass: 'ECONOMY',
    nonStop: false,
    maxResults: 5
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flightResults, setFlightResults] = useState([]);

  const travelClasses = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First Class' }
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
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter mock data based on search criteria
      let filteredResults = mockFlightData;
      
      // Apply non-stop filter if selected
      if (formData.nonStop) {
        filteredResults = filteredResults.filter(flight => 
          flight.itineraries[0].segments.length === 1
        );
      }
      
      // Apply max results limit
      filteredResults = filteredResults.slice(0, parseInt(formData.maxResults));
      
      setFlightResults(filteredResults);
      setShowResults(true);
      
      // Call parent callback if provided
      if (onSearch) {
        onSearch(filteredResults, formData);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = (flight) => {
    console.log('Selected flight:', flight);
    alert(`Flight ${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number} selected for $${flight.price.total}`);
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

              {/* Departure Date and Class */}
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
              </div>

              {/* Passengers and Advanced Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Debug Info */}
          <div className="mt-8 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
            <h3 className="text-white font-semibold mb-3">Current Form Data (for debugging):</h3>
            <pre className="text-slate-300 text-sm overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;