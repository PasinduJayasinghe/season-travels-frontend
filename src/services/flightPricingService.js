// src/services/flightPricingService.js
const API_BASE_URL = 'https://localhost:7136/api/FlightPricing';

export const getFlightPricing = async (flightOffer) => {
  try {
    // Create the request payload matching the backend FlightPricingRequest class
    const pricingRequest = {
      data: {
        type: "flight-offers-pricing",
        flightOffers: [flightOffer] // Send the selected flight offer
      }
    };

    console.log('Sending pricing request:', pricingRequest);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pricingRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Pricing response:', result);
    
    return result;
  } catch (error) {
    console.error('Error getting flight pricing:', error);
    throw error;
  }
};
