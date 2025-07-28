// src/services/flightPricingService.js
const API_BASE_URL = 'https://localhost:7136/api/PriceOffer';

export const getFlightPricing = async (flightOffer) => {
  try {
    // Based on your backend controller, it expects the flight offer data directly
    // as FlightOffersPriceQuery which should be the flight offer itself
    const pricingRequest = flightOffer;

    console.log('Sending pricing request to:', API_BASE_URL);
    console.log('Request payload:', JSON.stringify(pricingRequest, null, 2));

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pricingRequest),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Pricing response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error getting flight pricing:', error);
    throw error;
  }
};
