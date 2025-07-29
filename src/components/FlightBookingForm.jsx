// src/components/FlightBookingForm.jsx
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, X, CreditCard, Check } from 'lucide-react';
import { createFlightOrder } from '../services/flightOrderService';

const FlightBookingForm = ({ pricedFlightOffer, isOpen, onClose, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    travelers: [
      {
        id: "1",
        dateOfBirth: "",
        name: {
          firstName: "",
          lastName: ""
        },
        gender: "MALE",
        contact: {
          emailAddress: "",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "1",
              number: ""
            }
          ]
        },
        documents: [
          {
            documentType: "PASSPORT",
            birthPlace: "",
            issuanceLocation: "",
            issuanceDate: "",
            number: "",
            expiryDate: "",
            issuanceCountry: "",
            validityCountry: "",
            nationality: "",
            holder: true
          }
        ]
      }
    ],
    contact: {
      addresseeName: {
        firstName: "",
        lastName: ""
      },
      companyName: "Season Travels",
      purpose: "STANDARD",
      phones: [
        {
          deviceType: "LANDLINE",
          countryCallingCode: "1",
          number: ""
        }
      ],
      emailAddress: "",
      address: {
        lines: [""],
        postalCode: "",
        cityName: "",
        countryCode: "US"
      }
    },
    remarks: {
      general: [
        {
          subType: "GENERAL_MISCELLANEOUS",
          text: "ONLINE BOOKING FROM SEASON TRAVELS"
        }
      ]
    },
    ticketingAgreement: {
      option: "DELAY_TO_CANCEL",
      delay: "6D"
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.includes('[') && key.includes(']')) {
          const [arrayKey, index] = key.split('[');
          const arrayIndex = parseInt(index.replace(']', ''));
          current = current[arrayKey][arrayIndex];
        } else {
          current = current[key];
        }
      }
      
      const finalKey = keys[keys.length - 1];
      if (finalKey.includes('[') && finalKey.includes(']')) {
        const [arrayKey, index] = finalKey.split('[');
        const arrayIndex = parseInt(index.replace(']', ''));
        current[arrayKey][arrayIndex] = value;
      } else {
        current[finalKey] = value;
      }
      
      return newData;
    });
  };

  const formatFlightDetails = (offer) => {
    if (!offer?.itineraries?.[0]?.segments?.[0]) return {};
    
    const firstSegment = offer.itineraries[0].segments[0];
    const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
    
    return {
      departure: {
        airport: firstSegment.departure.iataCode,
        time: new Date(firstSegment.departure.at).toLocaleString()
      },
      arrival: {
        airport: lastSegment.arrival.iataCode,
        time: new Date(lastSegment.arrival.at).toLocaleString()
      },
      duration: offer.itineraries[0].duration,
      price: offer.price?.grandTotal || offer.price?.total,
      currency: offer.price?.currency
    };
  };

  const flightDetails = formatFlightDetails(pricedFlightOffer);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Construct the flight order payload
      const orderPayload = {
        data: {
          type: "flight-order",
          flightOffers: [pricedFlightOffer],
          travelers: formData.travelers,
          remarks: formData.remarks,
          ticketingAgreement: formData.ticketingAgreement,
          contacts: [formData.contact]
        }
      };

      console.log('Submitting flight order:', orderPayload);
      
      // Call the flight order API
      const result = await createFlightOrder(orderPayload);
      
      console.log('Flight order result:', result);
      
      onBookingComplete({
        success: true,
        message: 'Flight booked successfully!',
        orderData: result
      });
      
    } catch (error) {
      console.error('Booking failed:', error);
      onBookingComplete({
        success: false,
        message: error.message || 'Booking failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Traveler Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.travelers[0].name.firstName}
            onChange={(e) => handleInputChange('travelers[0].name.firstName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter first name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.travelers[0].name.lastName}
            onChange={(e) => handleInputChange('travelers[0].name.lastName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.travelers[0].dateOfBirth}
            onChange={(e) => handleInputChange('travelers[0].dateOfBirth', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gender *
          </label>
          <select
            value={formData.travelers[0].gender}
            onChange={(e) => handleInputChange('travelers[0].gender', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.travelers[0].contact.emailAddress}
            onChange={(e) => handleInputChange('travelers[0].contact.emailAddress', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter email address"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.travelers[0].contact.phones[0].number}
            onChange={(e) => handleInputChange('travelers[0].contact.phones[0].number', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Passport Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Passport Number *
          </label>
          <input
            type="text"
            value={formData.travelers[0].documents[0].number}
            onChange={(e) => handleInputChange('travelers[0].documents[0].number', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter passport number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nationality *
          </label>
          <input
            type="text"
            value={formData.travelers[0].documents[0].nationality}
            onChange={(e) => handleInputChange('travelers[0].documents[0].nationality', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., US, GB, FR"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Issue Date *
          </label>
          <input
            type="date"
            value={formData.travelers[0].documents[0].issuanceDate}
            onChange={(e) => handleInputChange('travelers[0].documents[0].issuanceDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Expiry Date *
          </label>
          <input
            type="date"
            value={formData.travelers[0].documents[0].expiryDate}
            onChange={(e) => handleInputChange('travelers[0].documents[0].expiryDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Issue Country *
          </label>
          <input
            type="text"
            value={formData.travelers[0].documents[0].issuanceCountry}
            onChange={(e) => handleInputChange('travelers[0].documents[0].issuanceCountry', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g., US, GB, FR"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Birth Place *
          </label>
          <input
            type="text"
            value={formData.travelers[0].documents[0].birthPlace}
            onChange={(e) => handleInputChange('travelers[0].documents[0].birthPlace', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter birth place"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Contact First Name *
          </label>
          <input
            type="text"
            value={formData.contact.addresseeName.firstName}
            onChange={(e) => handleInputChange('contact.addresseeName.firstName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter contact first name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Contact Last Name *
          </label>
          <input
            type="text"
            value={formData.contact.addresseeName.lastName}
            onChange={(e) => handleInputChange('contact.addresseeName.lastName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter contact last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Contact Email *
        </label>
        <input
          type="email"
          value={formData.contact.emailAddress}
          onChange={(e) => handleInputChange('contact.emailAddress', e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter contact email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Contact Phone *
        </label>
        <input
          type="tel"
          value={formData.contact.phones[0].number}
          onChange={(e) => handleInputChange('contact.phones[0].number', e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter contact phone"
          required
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Address</h4>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={formData.contact.address.lines[0]}
            onChange={(e) => handleInputChange('contact.address.lines[0]', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter street address"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.contact.address.cityName}
              onChange={(e) => handleInputChange('contact.address.cityName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter city"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              value={formData.contact.address.postalCode}
              onChange={(e) => handleInputChange('contact.address.postalCode', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter postal code"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Country Code *
            </label>
            <input
              type="text"
              value={formData.contact.address.countryCode}
              onChange={(e) => handleInputChange('contact.address.countryCode', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., US, GB, FR"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Complete Your Booking</h2>
            <p className="text-slate-400 mt-1">
              Step {currentStep} of 3 - {
                currentStep === 1 ? 'Traveler Information' :
                currentStep === 2 ? 'Passport Details' :
                'Contact Information'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Flight Summary */}
        <div className="p-6 bg-slate-700 border-b border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-3">Flight Summary</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                {flightDetails.departure?.airport} → {flightDetails.arrival?.airport}
              </span>
              <span className="text-slate-400">
                {flightDetails.duration}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">
                {flightDetails.currency} {flightDetails.price}
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex justify-between">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {currentStep > 1 ? 'Previous' : 'Cancel'}
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
            >
              Next
              <Calendar className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Complete Booking
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { FlightBookingForm };
