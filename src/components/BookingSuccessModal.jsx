// src/components/BookingSuccessModal.jsx
import React from 'react';
import { Check, X, Plane, Calendar, User, Mail } from 'lucide-react';

const BookingSuccessModal = ({ isOpen, bookingData, onClose }) => {
  if (!isOpen || !bookingData) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 flex items-center justify-center p-4" 
      style={{ 
        zIndex: 2147483645,
        position: 'fixed'
      }}
    >
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full p-2 mr-3">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-slate-400">Your flight has been successfully booked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Reference */}
          <div className="bg-green-900/50 border border-green-700 rounded-xl p-4">
            <h3 className="text-green-400 font-semibold mb-2">Booking Reference</h3>
            <p className="text-white text-lg font-mono">{bookingData.data?.id || 'Processing...'}</p>
            <p className="text-green-300 text-sm mt-1">
              Please save this reference number for your records
            </p>
          </div>

          {/* Flight Details */}
          {bookingData.data?.flightOffers?.[0] && (
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                Flight Details
              </h3>
              
              {bookingData.data.flightOffers[0].itineraries.map((itinerary, index) => (
                <div key={index} className="mb-4">
                  {itinerary.segments.map((segment, segIndex) => (
                    <div key={segIndex} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-white font-semibold">
                            {segment.departure.iataCode}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {formatDateTime(segment.departure.at)}
                          </div>
                        </div>
                        
                        <div className="text-slate-400">→</div>
                        
                        <div className="text-center">
                          <div className="text-white font-semibold">
                            {segment.arrival.iataCode}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {formatDateTime(segment.arrival.at)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {segment.carrierCode}{segment.number}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {segment.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Traveler Information */}
          {bookingData.data?.travelers && (
            <div className="bg-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Traveler Information
              </h3>
              
              {bookingData.data.travelers.map((traveler, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-slate-600 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">
                        {traveler.name?.firstName} {traveler.name?.lastName}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {traveler.travelerType || 'ADULT'} • DOB: {traveler.dateOfBirth}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-300 text-sm">
                        {traveler.contact?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-900/50 border border-blue-700 rounded-xl p-4">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              What's Next?
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-blue-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>Confirmation email will be sent within 5 minutes</span>
              </div>
              <div className="flex items-center text-blue-300">
                <Check className="w-4 h-4 mr-2" />
                <span>Check-in opens 24 hours before departure</span>
              </div>
              <div className="flex items-center text-blue-300">
                <User className="w-4 h-4 mr-2" />
                <span>Arrive at airport 2-3 hours before international flights</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-xl p-4">
            <h4 className="text-yellow-400 font-medium mb-2">Important Notice</h4>
            <p className="text-yellow-300 text-sm">
              Please ensure your passport is valid for at least 6 months from your travel date. 
              Check visa requirements for your destination country.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export { BookingSuccessModal };
