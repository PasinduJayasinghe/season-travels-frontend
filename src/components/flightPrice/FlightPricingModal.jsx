import React, { useState, useEffect } from 'react';
import { X, Plane, Clock, MapPin, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { getFlightPricing } from '../../services/flightPricingService';
import { FlightBookingForm } from '../FlightBookingForm';
import { BookingSuccessModal } from '../BookingSuccessModal';

const FlightPricingModal = ({ flight, isOpen, onClose, onConfirm }) => {
  const [pricingData, setPricingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (isOpen && flight) {
      fetchFlightPricing();
    }
  }, [isOpen, flight]);

  const fetchFlightPricing = async () => {
    setIsLoading(true);
    setError(null);
    setPricingData(null);
    setWarnings([]);

    try {
      const response = await getFlightPricing(flight);
      
      console.log('Received pricing response:', response);
      
      // Based on your backend controller, it returns FlightPricingResponse directly
      // The response should have data.flightOffers array
      if (response && response.data && response.data.flightOffers && response.data.flightOffers.length > 0) {
        setPricingData(response.data.flightOffers[0]);
        setWarnings(response.warnings || []);
      } else if (response && response.itineraries) {
        // If the response is the flight offer directly (fallback)
        setPricingData(response);
        setWarnings([]);
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('No pricing data received from server');
      }
    } catch (error) {
      console.error('Failed to fetch flight pricing:', error);
      setError(error.message || 'Failed to get flight pricing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (duration) => {
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

  const handleConfirm = () => {
    if (pricingData) {
      setShowBookingForm(true);
    }
  };

  const handleBookingComplete = (result) => {
    setShowBookingForm(false);
    
    if (result.success) {
      // Show success modal with booking details
      setBookingResult(result.orderData);
      setShowSuccessModal(true);
    } else {
      // Show error
      alert(`Booking failed: ${result.message}`);
    }
  };

  const handleBookingClose = () => {
    setShowBookingForm(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setBookingResult(null);
    onClose(); // Close the pricing modal as well
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Flight Pricing Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Getting updated pricing...</p>
              <p className="text-slate-400 text-sm mt-2">This may take a few seconds</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="text-red-300 font-medium">Pricing Error</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchFlightPricing}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {pricingData && (
            <div className="space-y-6">
              {/* Flight Summary */}
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Flight Summary</h3>
                {pricingData.itineraries.map((itinerary, itineraryIndex) => (
                  <div key={itineraryIndex} className="mb-4">
                    {itinerary.segments.map((segment, segmentIndex) => (
                      <div key={segmentIndex} className="flex items-center justify-between py-3 border-b border-slate-600 last:border-b-0">
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {formatTime(segment.departure.at)}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {getCityName(segment.departure.iataCode)}
                            </div>
                            <div className="text-slate-500 text-xs">
                              {segment.departure.iataCode}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center px-4">
                            <Plane className="w-5 h-5 text-slate-400 transform rotate-90" />
                            <div className="text-slate-400 text-xs mt-1">
                              {formatDuration(segment.duration)}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {formatTime(segment.arrival.at)}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {getCityName(segment.arrival.iataCode)}
                            </div>
                            <div className="text-slate-500 text-xs">
                              {segment.arrival.iataCode}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {getAirlineName(segment.carrierCode)}
                          </div>
                          <div className="text-slate-400 text-sm">
                            Flight {segment.carrierCode}{segment.number}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pricing Breakdown
                </h3>
                
                <div className="space-y-3">
                  {pricingData.travelerPricings.map((pricing, index) => (
                    <div key={index} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 font-medium">
                          {pricing.travelerType} (Traveler {pricing.travelerId})
                        </span>
                        <span className="text-white font-bold">
                          {pricing.price.currency} {pricing.price.total}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Base Price:</span>
                          <span className="text-slate-300 ml-2">
                            {pricing.price.currency} {pricing.price.base}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Taxes & Fees:</span>
                          <span className="text-slate-300 ml-2">
                            {pricing.price.currency} {(parseFloat(pricing.price.total) - parseFloat(pricing.price.base)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Price */}
                <div className="mt-6 pt-4 border-t border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-white">Total Price:</span>
                    <span className="text-3xl font-bold text-green-400">
                      {pricingData.price.currency} {pricingData.price.grandTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="bg-yellow-900/50 border border-yellow-700 rounded-xl p-4">
                  <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Important Notices
                  </h4>
                  <ul className="space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-300 text-sm">
                        • {warning.title || 'Please review booking conditions'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Indicator */}
              <div className="bg-green-900/50 border border-green-700 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-green-300 font-medium">Pricing Confirmed</p>
                    <p className="text-green-300 text-sm mt-1">
                      This is the final price for your selected flight
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {pricingData && (
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-700">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Proceed to Booking
            </button>
          </div>
        )}
      </div>

      {/* Flight Booking Form */}
      <FlightBookingForm
        pricedFlightOffer={pricingData}
        isOpen={showBookingForm}
        onClose={handleBookingClose}
        onBookingComplete={handleBookingComplete}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        bookingData={bookingResult}
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default FlightPricingModal;
