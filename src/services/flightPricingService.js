// src/services/flightPricingService.js
import { prepareFlightOfferForPricing, logFlightOfferStructure } from './flightDataUtils.js';

const API_BASE_URL = 'https://localhost:7136/api/PriceOffer';

export const getFlightPricing = async (flightOffer) => {
  try {
    // Send the complete flight offer object directly to backend
    // Backend will wrap it in the Amadeus format
    console.log('Original flight offer:', JSON.stringify(flightOffer, null, 2));
    
    // Validate and transform the flight offer for Amadeus compatibility
    const preparedFlightOffer = prepareFlightOfferForPricing(flightOffer);
    
    // Log the prepared structure for debugging
    logFlightOfferStructure(preparedFlightOffer, 'Prepared Flight Offer');
    
    const pricingRequest = preparedFlightOffer;

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
